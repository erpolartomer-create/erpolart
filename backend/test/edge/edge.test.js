// Supabase Edge Function güvenlik testleri — gerçek fonksiyon kodu, Node'da, stub'lanmış importlarla.
// Dış servis yok: Resend çağrıları sahte fetch ile yakalanır.
import { test, describe, before, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { register } from 'node:module';
import { Webhook } from './stubs/standardwebhooks.mjs';

register(new URL('./loader.mjs', import.meta.url));

const FN = (name) => new URL(`../../../supabase/functions/${name}/index.ts`, import.meta.url).href;
const HOOK_B64 = Buffer.from('test-hook-secret-0123456789abcdef').toString('base64');
const SERVICE_KEY = 'svc-role-test-key';

globalThis.Deno = { env: { get: (k) => process.env[k] } };
const sent = [];
globalThis.fetch = async (url, opts) => {
  if (String(url).startsWith('https://api.resend.com')) {
    sent.push(JSON.parse(opts.body));
    return new Response(JSON.stringify({ id: 'mock' }), { status: 200 });
  }
  throw new Error(`Beklenmeyen dış istek: ${url}`);
};
beforeEach(() => { sent.length = 0; });

let seq = 0;
const load = async (name, env) => {
  const saved = {};
  for (const [k, v] of Object.entries(env)) { saved[k] = process.env[k]; if (v === undefined) delete process.env[k]; else process.env[k] = v; }
  const before = (globalThis.__edgeHandlers ??= []).length;
  await import(`${FN(name)}?i=${seq++}`);
  return globalThis.__edgeHandlers[before];
};
const req = (body, headers = {}, method = 'POST') =>
  new Request('https://fn.local/', { method, headers: { 'content-type': 'application/json', ...headers }, body: typeof body === 'string' ? body : JSON.stringify(body) });

// ── auth-send-email ──
describe('auth-send-email (Auth hook)', () => {
  let handler;
  const wh = new Webhook(HOOK_B64);
  const signed = (obj, { ts = Math.floor(Date.now() / 1000), tamper = false } = {}) => {
    const payload = JSON.stringify(obj);
    const id = 'msg_1';
    const sig = wh.sign(id, String(ts), payload);
    return req(tamper ? payload.replace('victim', 'other') : payload, { 'webhook-id': id, 'webhook-timestamp': String(ts), 'webhook-signature': `v1,${sig}` });
  };
  const evt = (over = {}) => ({ user: { email: 'victim@x.com', user_metadata: {} }, email_data: { token_hash: 'th', email_action_type: 'recovery', redirect_to: 'https://erpolart.com/update-password?lang=en' }, ...over });

  before(async () => {
    handler = await load('auth-send-email', { SEND_EMAIL_HOOK_SECRET: `v1,whsec_${HOOK_B64}`, SUPABASE_URL: 'https://proj.supabase.co', RESEND_API_KEY: 're_test' });
  });

  test('Y1: imzasız istek reddedilir, mail gitmez', async () => {
    const r = await handler(req(evt()));
    assert.equal(r.status, 401);
    assert.equal(sent.length, 0);
  });
  test('Y1: yanlış imza / değiştirilmiş gövde reddedilir', async () => {
    const bad = req(evt(), { 'webhook-id': 'm', 'webhook-timestamp': String(Math.floor(Date.now() / 1000)), 'webhook-signature': 'v1,AAAA' });
    assert.equal((await handler(bad)).status, 401);
    assert.equal((await handler(signed(evt(), { tamper: true }))).status, 401);
    assert.equal(sent.length, 0);
  });
  test('Y1: eski zaman damgalı (replay) istek reddedilir', async () => {
    assert.equal((await handler(signed(evt(), { ts: Math.floor(Date.now() / 1000) - 3600 }))).status, 401);
    assert.equal(sent.length, 0);
  });
  test('geçerli imza: mail gider; dış redirect_to erpolart.com ile değiştirilir', async () => {
    const r = await handler(signed(evt({ email_data: { token_hash: 'th', email_action_type: 'recovery', redirect_to: 'https://evil.example/steal' } })));
    assert.equal(r.status, 200);
    assert.equal(sent.length, 1);
    assert.deepEqual(sent[0].to, ['victim@x.com']);
    assert.ok(!sent[0].html.includes('evil.example'), 'dış yönlendirme maile girdi');
    assert.ok(sent[0].html.includes(encodeURIComponent('https://erpolart.com')));
  });
  test('geçerli imza ama eksik alanlar → 400', async () => {
    assert.equal((await handler(signed({ user: {}, email_data: {} }))).status, 400);
    assert.equal(sent.length, 0);
  });
  test('secret tanımlı değilse hiçbir mail gitmez', async () => {
    const h = await load('auth-send-email', { SEND_EMAIL_HOOK_SECRET: undefined, SUPABASE_URL: 'https://proj.supabase.co', RESEND_API_KEY: 're_test' });
    assert.equal((await h(req(evt()))).status, 500);
    assert.equal(sent.length, 0);
  });
});

// ── send-proposal-email ──
describe('send-proposal-email', () => {
  let handler;
  const P = 'https://erpolart.com/proposal/44444444-4444-4444-8444-444444444444';
  before(async () => {
    globalThis.__edgeUsers = {
      tA: { email: 'a@x.com', app_metadata: {}, user_metadata: {} },
      tFake: { email: 'evil@x.com', app_metadata: {}, user_metadata: { role: 'admin' } },
      tAdmin: { email: 'hello@erpolart.com', app_metadata: {}, user_metadata: {} },
    };
    handler = await load('send-proposal-email', { SUPABASE_URL: 'https://proj.supabase.co', SUPABASE_SERVICE_ROLE_KEY: SERVICE_KEY, RESEND_API_KEY: 're_test' });
  });
  const auth = (t) => ({ authorization: `Bearer ${t}` });
  const body = (o = {}) => ({ toEmail: 'c@x.com', toName: 'C', proposalUrl: P, projectName: 'Proje', ...o });

  test('kimliksiz / müşteri / sahte admin (user_metadata) gönderemez', async () => {
    assert.equal((await handler(req(body()))).status, 401);
    assert.equal((await handler(req(body(), auth('tA')))).status, 403);
    assert.equal((await handler(req(body(), auth('tFake')))).status, 403);
    assert.equal((await handler(req(body(), auth('garbage')))).status, 403);
    assert.equal(sent.length, 0);
  });
  test('Y2: admin bile dış/phishing linki gönderemez', async () => {
    for (const proposalUrl of ['https://evil.example/proposal/x', 'https://erpolart.com.evil.example/proposal/44444444-4444-4444-8444-444444444444', 'javascript:alert(1)', 'https://erpolart.com/login']) {
      assert.equal((await handler(req(body({ proposalUrl }), auth('tAdmin')))).status, 400, proposalUrl);
    }
    assert.equal((await handler(req(body({ toEmail: 'bozuk' }), auth('tAdmin')))).status, 400);
    assert.equal(sent.length, 0);
  });
  test('admin geçerli teklifi gönderir; ad/proje HTML-kaçışlı', async () => {
    const r = await handler(req(body({ toName: '<a href="https://phish.example">tıkla</a>', projectName: '<script>x</script>' }), auth('tAdmin')));
    assert.equal(r.status, 200);
    assert.equal(sent.length, 1);
    assert.ok(!sent[0].html.includes('<a href="https://phish.example">'));
    assert.ok(!sent[0].html.includes('<script>'));
  });
});

// ── Veritabanı webhook'ları ──
for (const [name, record] of [
  ['send-activation-email', { status: 'active', id: '11111111-1111-4111-8111-111111111111', email: 'c@x.com', full_name: '<img src=x onerror=alert(1)>' }],
  ['send-order-confirmation', { status: 'awaiting_transfer', id: '11111111-1111-4111-8111-111111111111', email: 'c@x.com', full_name: '<img src=x onerror=alert(1)>', amount: '<b>1</b>' }],
]) {
  describe(name, () => {
    let handler;
    before(async () => { handler = await load(name, { SUPABASE_SERVICE_ROLE_KEY: SERVICE_KEY, RESEND_API_KEY: 're_test' }); });
    test('service-role anahtarı olmadan çağrılamaz', async () => {
      assert.equal((await handler(req({ record }))).status, 401);
      assert.equal((await handler(req({ record }, { authorization: 'Bearer wrong' }))).status, 401);
      assert.equal(sent.length, 0);
    });
    test('secret boşsa "Bearer undefined" ile açılmaz', async () => {
      const h = await load(name, { SUPABASE_SERVICE_ROLE_KEY: undefined, RESEND_API_KEY: 're_test' });
      assert.equal((await h(req({ record }, { authorization: 'Bearer undefined' }))).status, 401);
      process.env.SUPABASE_SERVICE_ROLE_KEY = SERVICE_KEY;
    });
    test('kayıttaki kullanıcı alanları HTML-kaçışlı', async () => {
      const r = await handler(req({ record, old_record: { status: 'pending' } }, { authorization: `Bearer ${SERVICE_KEY}` }));
      assert.equal(r.status, 200);
      assert.equal(sent.length, 1);
      assert.ok(!sent[0].html.includes('<img src=x'));
      assert.ok(!sent[0].html.includes('<b>1</b>'));
    });
  });
}

// ── send-lead-notification (canlıda kimliksiz bulundu; sertleştirildi) ──
describe('send-lead-notification', () => {
  let handler;
  const record = { full_name: '<a href="https://phish.example">Acil: hesabınızı doğrulayın</a>', email: 'x@x.com"><script>', selected_plan: '<img src=x>' };
  before(async () => { handler = await load(process.env.LEAD_FN || 'send-lead-notification', { SUPABASE_SERVICE_ROLE_KEY: SERVICE_KEY, RESEND_API_KEY: 're_test' }); });
  test('public anahtar / kimliksiz çağrı mail gönderemez', async () => {
    assert.equal((await handler(req({ record }))).status, 401);
    assert.equal((await handler(req({ record }, { authorization: 'Bearer sb_publishable_xxx' }))).status, 401);
    assert.equal(sent.length, 0);
  });
  test('webhook (service role) çağrısında alanlar HTML-kaçışlı', async () => {
    const r = await handler(req({ record }, { authorization: `Bearer ${SERVICE_KEY}` }));
    assert.equal(r.status, 200);
    assert.equal(sent.length, 1);
    assert.ok(!sent[0].html.includes('<a href="https://phish.example">'));
    assert.ok(!sent[0].html.includes('<script>') && !sent[0].html.includes('<img src=x>'));
  });
});
