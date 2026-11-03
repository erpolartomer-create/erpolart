// Edge Function güvenlik testleri — GERÇEK Deno runtime, GERÇEK standardwebhooks ve supabase-js.
// Yalnızca std/http serve() shim'lenir (port açmamak için). Dış istekler yakalanır:
//   api.resend.com → kaydedilir (mail gitmez), SUPABASE_URL/auth/v1/user → sahte kullanıcı.
// Çalıştır:  deno test --allow-env --allow-read --allow-write=. --allow-net=esm.sh,deno.land \
//              --import-map=supabase/functions/_tests/import_map.json supabase/functions/_tests/
import { assert, assertEquals } from 'https://deno.land/std@0.224.0/assert/mod.ts';
import { Webhook } from 'https://esm.sh/standardwebhooks@1.0.0';

// deno-lint-ignore no-explicit-any
const g = globalThis as any;
const HERE = new URL('.', import.meta.url);
const SB_URL = 'https://proj.supabase.co';
const SERVICE_KEY = 'svc-role-test-key';
const HOOK_B64 = btoa('test-hook-secret-0123456789abcdef');

// deno-lint-ignore no-explicit-any
const sent: any[] = [];
// deno-lint-ignore no-explicit-any
let users: Record<string, any> = {};
g.fetch = (input: Request | URL | string, init?: RequestInit) => {
  const req = new Request(input, init);
  if (req.url.startsWith('https://api.resend.com/')) {
    return req.json().then((b) => { sent.push(b); return Response.json({ id: 'mock' }); });
  }
  if (req.url.startsWith(`${SB_URL}/auth/v1/user`)) {
    const tok = (req.headers.get('authorization') || '').replace(/^Bearer /, '');
    const u = users[tok];
    return Promise.resolve(u
      ? Response.json({ id: crypto.randomUUID(), aud: 'authenticated', role: 'authenticated', ...u })
      : Response.json({ code: 401, error_code: 'bad_jwt', msg: 'invalid JWT' }, { status: 401 }));
  }
  return Promise.reject(new Error(`Testte beklenmeyen dış istek: ${req.url}`));
};

let seq = 0;
async function load(name: string, env: Record<string, string | undefined>) {
  for (const [k, v] of Object.entries(env)) v === undefined ? Deno.env.delete(k) : Deno.env.set(k, v);
  // Her yükleme taze modül olsun diye kopyadan içe aktar (env üst seviyede okunuyor)
  const base = Deno.env.get("EDGE_FN_DIR") ? new URL(`file://${Deno.env.get("EDGE_FN_DIR")}/`) : new URL("../", HERE);
  const src = await Deno.readTextFile(new URL(`${name}/index.ts`, base));
  const tmp = new URL(`./.tmp_${name}_${seq++}.ts`, HERE);
  await Deno.writeTextFile(tmp, src);
  const before = (g.__edgeHandlers ??= []).length;
  try { await import(tmp.href); } finally { await Deno.remove(tmp); }
  return g.__edgeHandlers[before] as (r: Request) => Promise<Response>;
}
const req = (body: unknown, headers: Record<string, string> = {}, method = 'POST') =>
  new Request('https://fn.local/', { method, headers: { 'content-type': 'application/json', ...headers }, body: method === 'GET' ? undefined : (typeof body === 'string' ? body : JSON.stringify(body)) });
const reset = () => { sent.length = 0; };

// ── auth-send-email (Supabase Auth Send Email hook) ──
Deno.test('auth-send-email: imza doğrulaması (gerçek standardwebhooks)', async (t) => {
  const h = await load('auth-send-email', { SEND_EMAIL_HOOK_SECRET: `v1,whsec_${HOOK_B64}`, SUPABASE_URL: SB_URL, RESEND_API_KEY: 're_test' });
  const wh = new Webhook(HOOK_B64);
  const evt = (over = {}) => ({ user: { email: 'victim@x.com', user_metadata: {} }, email_data: { token_hash: 'th', email_action_type: 'recovery', redirect_to: 'https://erpolart.com/update-password?lang=en' }, ...over });
  const signed = (obj: unknown, { ts = new Date(), tamper = false } = {}) => {
    const payload = JSON.stringify(obj);
    const id = 'msg_' + crypto.randomUUID();
    const sig = wh.sign(id, ts, payload);
    return req(tamper ? payload.replace('victim', 'other') : payload, { 'webhook-id': id, 'webhook-timestamp': String(Math.floor(ts.getTime() / 1000)), 'webhook-signature': sig });
  };

  await t.step('imzasız istek 401, mail yok', async () => {
    reset(); assertEquals((await h(req(evt()))).status, 401); assertEquals(sent.length, 0);
  });
  await t.step('sahte imza ve değiştirilmiş gövde 401', async () => {
    reset();
    const now = String(Math.floor(Date.now() / 1000));
    assertEquals((await h(req(evt(), { 'webhook-id': 'm', 'webhook-timestamp': now, 'webhook-signature': 'v1,AAAA' }))).status, 401);
    assertEquals((await h(signed(evt(), { tamper: true }))).status, 401);
    assertEquals(sent.length, 0);
  });
  await t.step('başka secret ile imzalanmış istek 401', async () => {
    reset();
    const other = new Webhook(btoa('another-secret-another-secret-xx'));
    const payload = JSON.stringify(evt()); const id = 'msg_x'; const ts = new Date();
    assertEquals((await h(req(payload, { 'webhook-id': id, 'webhook-timestamp': String(Math.floor(ts.getTime() / 1000)), 'webhook-signature': other.sign(id, ts, payload) }))).status, 401);
    assertEquals(sent.length, 0);
  });
  await t.step('eski zaman damgası (replay) 401', async () => {
    reset(); assertEquals((await h(signed(evt(), { ts: new Date(Date.now() - 3600_000) }))).status, 401); assertEquals(sent.length, 0);
  });
  await t.step('geçerli imza: mail gider, dış redirect_to erpolart.com olur', async () => {
    reset();
    const r = await h(signed(evt({ email_data: { token_hash: 'th', email_action_type: 'recovery', redirect_to: 'https://evil.example/steal' } })));
    assertEquals(r.status, 200); assertEquals(sent.length, 1);
    assertEquals(sent[0].to, ['victim@x.com']);
    assert(!sent[0].html.includes('evil.example'));
    assert(sent[0].html.includes(encodeURIComponent('https://erpolart.com')));
  });
  await t.step('alt alan adı hilesi (erpolart.com.evil.example) da reddedilir', async () => {
    reset();
    await h(signed(evt({ email_data: { token_hash: 'th', email_action_type: 'signup', redirect_to: 'https://erpolart.com.evil.example/x' } })));
    assertEquals(sent.length, 1); assert(!sent[0].html.includes('evil.example'));
  });
  await t.step('geçerli imza, eksik alan 400', async () => {
    reset(); assertEquals((await h(signed({ user: {}, email_data: {} }))).status, 400); assertEquals(sent.length, 0);
  });
  await t.step('secret tanımsızsa 500, mail yok', async () => {
    reset();
    const h2 = await load('auth-send-email', { SEND_EMAIL_HOOK_SECRET: undefined, SUPABASE_URL: SB_URL, RESEND_API_KEY: 're_test' });
    assertEquals((await h2(req(evt()))).status, 500); assertEquals(sent.length, 0);
  });
});

// ── send-proposal-email (gerçek supabase-js auth.getUser) ──
Deno.test('send-proposal-email: yalnızca admin, yalnızca erpolart teklif linki', async (t) => {
  users = {
    tA: { email: 'a@x.com', app_metadata: {}, user_metadata: {} },
    tFake: { email: 'evil@x.com', app_metadata: {}, user_metadata: { role: 'admin' } },
    tAdmin: { email: 'hello@erpolart.com', app_metadata: {}, user_metadata: {} },
  };
  const h = await load('send-proposal-email', { SUPABASE_URL: SB_URL, SUPABASE_SERVICE_ROLE_KEY: SERVICE_KEY, RESEND_API_KEY: 're_test' });
  const P = 'https://erpolart.com/proposal/44444444-4444-4444-8444-444444444444';
  const body = (o = {}) => ({ toEmail: 'c@x.com', toName: 'C', proposalUrl: P, projectName: 'Proje', ...o });
  const auth = (tk: string) => ({ authorization: `Bearer ${tk}` });

  await t.step('kimliksiz 401; müşteri, user_metadata ile sahte admin ve çöp token 403', async () => {
    reset();
    assertEquals((await h(req(body()))).status, 401);
    assertEquals((await h(req(body(), auth('tA')))).status, 403);
    assertEquals((await h(req(body(), auth('tFake')))).status, 403);
    assertEquals((await h(req(body(), auth('garbage')))).status, 403);
    assertEquals(sent.length, 0);
  });
  await t.step('admin bile dış/phishing link gönderemez', async () => {
    reset();
    for (const proposalUrl of ['https://evil.example/proposal/x', 'https://erpolart.com.evil.example/proposal/44444444-4444-4444-8444-444444444444', 'javascript:alert(1)', 'https://erpolart.com/login', `${P}?next=https://evil.example`]) {
      assertEquals((await h(req(body({ proposalUrl }), auth('tAdmin')))).status, 400, proposalUrl);
    }
    assertEquals((await h(req(body({ toEmail: 'bozuk' }), auth('tAdmin')))).status, 400);
    assertEquals(sent.length, 0);
  });
  await t.step('admin geçerli teklif gönderir; HTML kaçışlı', async () => {
    reset();
    const r = await h(req(body({ toName: '<a href="https://phish.example">tıkla</a>', projectName: '<script>x</script>' }), auth('tAdmin')));
    assertEquals(r.status, 200); assertEquals(sent.length, 1);
    assert(!sent[0].html.includes('<a href="https://phish.example">')); assert(!sent[0].html.includes('<script>'));
  });
});

// ── Veritabanı webhook fonksiyonları (service-role Bearer) ──
const XSS = '<img src=x onerror=alert(1)>';
for (const [name, record] of [
  ['send-activation-email', { status: 'active', id: '11111111-1111-4111-8111-111111111111', email: 'c@x.com', full_name: XSS }],
  ['send-order-confirmation', { status: 'awaiting_transfer', id: '11111111-1111-4111-8111-111111111111', email: 'c@x.com', full_name: XSS, amount: '<b>1</b>' }],
  ['send-lead-notification', { full_name: '<a href="https://phish.example">Acil</a>', email: 'x@x.com"><script>', selected_plan: XSS }],
] as const) {
  Deno.test(`${name}: service-role zorunlu, HTML kaçışlı`, async (t) => {
    const h = await load(name, { SUPABASE_SERVICE_ROLE_KEY: SERVICE_KEY, RESEND_API_KEY: 're_test' });
    await t.step('kimliksiz / yanlış / public anahtar 401', async () => {
      reset();
      for (const hd of [{} as Record<string, string>, { authorization: 'Bearer wrong' }, { authorization: 'Bearer sb_publishable_xxx' }]) {
        assertEquals((await h(req({ record }, hd))).status, 401);
      }
      assertEquals(sent.length, 0);
    });
    await t.step('secret boşsa "Bearer undefined" ile açılmaz', async () => {
      reset();
      const h2 = await load(name, { SUPABASE_SERVICE_ROLE_KEY: undefined, RESEND_API_KEY: 're_test' });
      assertEquals((await h2(req({ record }, { authorization: 'Bearer undefined' }))).status, 401);
      assertEquals((await h2(req({ record }, { authorization: 'Bearer ' }))).status, 401);
      Deno.env.set('SUPABASE_SERVICE_ROLE_KEY', SERVICE_KEY);
      assertEquals(sent.length, 0);
    });
    await t.step('service-role çağrısında alanlar kaçışlı', async () => {
      reset();
      const r = await h(req({ record, old_record: { status: 'pending' } }, { authorization: `Bearer ${SERVICE_KEY}` }));
      assertEquals(r.status, 200); assertEquals(sent.length, 1);
      for (const bad of ['<img src=x', '<b>1</b>', '<script>', '<a href="https://phish.example">']) assert(!sent[0].html.includes(bad), bad);
      assert(!/[\r\n]/.test(sent[0].subject), 'konu satırında satır sonu');
    });
  });
}
