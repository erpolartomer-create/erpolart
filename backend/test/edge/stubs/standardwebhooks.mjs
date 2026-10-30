// Standard Webhooks spesifikasyonunun (https://www.standardwebhooks.com) doğrulama kısmı.
// İmza: base64(HMAC-SHA256(base64decode(secret), `${id}.${timestamp}.${payload}`)),
// başlık "webhook-signature: v1,<imza> [v1,<imza2> ...]", zaman toleransı 5 dakika.
import crypto from 'node:crypto';

export class Webhook {
  constructor(secret) {
    if (!secret) throw new Error('Secret can\'t be empty.');
    this.key = Buffer.from(String(secret).replace(/^whsec_/, ''), 'base64');
  }
  sign(id, ts, payload) {
    return crypto.createHmac('sha256', this.key).update(`${id}.${ts}.${payload}`).digest('base64');
  }
  verify(payload, headers) {
    const h = Object.fromEntries(Object.entries(headers).map(([k, v]) => [k.toLowerCase(), v]));
    const id = h['webhook-id'], ts = h['webhook-timestamp'], sigs = h['webhook-signature'];
    if (!id || !ts || !sigs) throw new Error('Missing required headers');
    const now = Math.floor(Date.now() / 1000);
    if (!/^\d+$/.test(ts) || Math.abs(now - Number(ts)) > 300) throw new Error('Message timestamp too old or new');
    const expected = Buffer.from(this.sign(id, ts, payload));
    const ok = String(sigs).split(' ').some((part) => {
      const [ver, sig] = part.split(',');
      if (ver !== 'v1' || !sig) return false;
      const got = Buffer.from(sig);
      return got.length === expected.length && crypto.timingSafeEqual(got, expected);
    });
    if (!ok) throw new Error('No matching signature found');
    return JSON.parse(payload);
  }
}
