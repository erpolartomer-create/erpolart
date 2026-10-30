// ErpolArt backend güvenlik regresyon testleri.
// Çalıştır:  cd backend && npm test
// Gerçek Supabase/PayTR/Anthropic/Resend'e DOKUNMAZ — hepsi sahte modüllerle değiştirilir.

import { test, describe, before, after, beforeEach, mock } from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import express from 'express';
import { createFakeDb, fakeJwt } from './helpers/fakeSupabase.js';

// ── Ortam ──
process.env.SUPABASE_URL = 'https://proj.supabase.co';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-key';
process.env.PAYTR_MERCHANT_ID = '123456';
process.env.PAYTR_MERCHANT_KEY = 'test-merchant-key';
process.env.PAYTR_MERCHANT_SALT = 'test-merchant-salt';
process.env.PAYTR_TEST_MODE = '1';
process.env.BACKEND_URL = 'https://api.example-backend.test';
process.env.ANTHROPIC_API_KEY = 'test-anthropic';
delete process.env.ADMIN_REQUIRE_MFA;

const { db, client } = createFakeDb();
const sentEmails = [];

const here = (p) => new URL(p, import.meta.url).href;
mock.module(here('../src/config/supabase.js'), { namedExports: { supabase: client } });
mock.module(here('../src/utils/sendEmail.js'), { defaultExport: async (o) => { sentEmails.push(o); return { id: 'mock' }; } });
mock.module('@supabase/supabase-js', { namedExports: { createClient: () => client } });
mock.module('@anthropic-ai/sdk', {
  defaultExport: class { constructor() { this.messages = { create: async () => ({ content: [{ text: 'ok' }] }) }; } },
});
mock.module('@vitalets/google-translate-api', { namedExports: { translate: async (t) => ({ text: t }) } });

// Dış HTTP (döviz kuru) sahte
const realFetch = globalThis.fetch;

let base, server;
before(async () => {
  globalThis.fetch = async (url, opts) => {
    if (String(url).includes('open.er-api.com')) return new Response(JSON.stringify({ rates: { TRY: 40 } }));
    return realFetch(url, opts);
  };
  const { default: dbRoutes } = await import('../src/routes/dbRoutes.js');
  const { default: paymentRoutes } = await import('../src/routes/paymentRoutes.js');
  const { default: messageRoutes } = await import('../src/routes/messageRoutes.js');
  const { default: aiRoutes } = await import('../src/routes/aiRoutes.js');
  const { default: templateRoutes } = await import('../src/routes/templateRoutes.js');
  const { default: authRoutes } = await import('../src/routes/authRoutes.js');

  const app = express();
  app.use(express.json({ limit: '200kb' }));
  app.use(express.urlencoded({ extended: false }));
  app.set('io', null);
  app.set('mutedSessions', new Set());
  app.use('/api/auth', authRoutes);
  app.use('/api/templates', templateRoutes);
  app.use('/api/messages', messageRoutes);
  app.use('/api', paymentRoutes);
  app.use('/api/ai', aiRoutes);
  app.use('/api/db', dbRoutes);
  await new Promise((r) => { server = app.listen(0, r); });
  base = `http://127.0.0.1:${server.address().port}`;
});
after(() => { server?.close(); globalThis.fetch = realFetch; });

// ── Kimlikler ──
const U = {
  A:     { id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', email: 'a@x.com', user_metadata: {}, app_metadata: {} },
  B:     { id: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', email: 'b@x.com', user_metadata: {}, app_metadata: {} },
  FAKEADMIN: { id: 'cccccccc-cccc-4ccc-8ccc-cccccccccccc', email: 'evil@x.com', user_metadata: { role: 'admin' }, app_metadata: {} },
  ADMIN: { id: 'dddddddd-dddd-4ddd-8ddd-dddddddddddd', email: 'hello@erpolart.com', user_metadata: {}, app_metadata: {} },
};
const TOK = {
  A: fakeJwt({ sub: U.A.id, aal: 'aal1' }),
  B: fakeJwt({ sub: U.B.id, aal: 'aal1' }),
  FAKEADMIN: fakeJwt({ sub: U.FAKEADMIN.id, aal: 'aal1' }),
  ADMIN: fakeJwt({ sub: U.ADMIN.id, aal: 'aal1' }),
  ADMIN_MFA: fakeJwt({ sub: U.ADMIN.id, aal: 'aal2' }),
};

const ORDER_A = '11111111-1111-4111-8111-111111111111';
const ORDER_GUEST = '22222222-2222-4222-8222-222222222222';
const ORDER_PAID = '33333333-3333-4333-8333-333333333333';
const PROPOSAL = '44444444-4444-4444-8444-444444444444';
const LOGO_OK = 'https://proj.supabase.co/storage/v1/object/public/logos/orders/x/logo_1.png';

beforeEach(() => {
  db.reset();
  sentEmails.length = 0;
  db.users = {
    [TOK.A]: U.A, [TOK.B]: U.B, [TOK.FAKEADMIN]: U.FAKEADMIN, [TOK.ADMIN]: U.ADMIN, [TOK.ADMIN_MFA]: U.ADMIN,
  };
  db.tables = {
    orders: [
      { id: ORDER_A, user_id: U.A.id, email: 'a@x.com', full_name: 'A', status: 'pending', amount: 1000, monthly_fee: 0, edit_count: 0, admin_notes: 'gizli not', project_code: 'erpolart' },
      { id: ORDER_GUEST, user_id: null, email: 'guest@x.com', full_name: 'Guest', customer_phone: '0555', address: 'Adres', status: 'pending', amount: 500, monthly_fee: 0, edit_count: 0, admin_notes: 'gizli', project_code: 'erpolart' },
      { id: ORDER_PAID, user_id: U.A.id, email: 'a@x.com', status: 'paid', amount: 10, monthly_fee: 0, edit_count: 0, project_code: 'erpolart' },
    ],
    templates: [{ id: 't1', name: 'T1', price: 1200, project_code: 'erpolart', tier: 1, extra_services: [] }],
    proposals: [{ id: PROPOSAL, amount: 3000, project_name: 'P' }],
    chat_messages: [{ id: 'm1', session_id: `user_${U.B.id}`, role: 'user', content: 'B mesajı' }],
    leads: [{ id: 'l1', email: 'lead@x.com' }],
  };
});

const call = async (path, { method = 'POST', token, body, raw, headers = {} } = {}) => {
  const h = { ...headers };
  if (token) h.Authorization = `Bearer ${token}`;
  if (body !== undefined && !raw) h['Content-Type'] = 'application/json';
  const r = await fetch(base + path, { method, headers: h, body: raw ?? (body !== undefined ? JSON.stringify(body) : undefined), redirect: 'manual' });
  const text = await r.text();
  let json; try { json = JSON.parse(text); } catch { json = text; }
  return { status: r.status, json, headers: r.headers };
};
const q = (table, payload, token) => call(`/api/db/${table}/query`, { body: payload, token });
const idf = (v) => [{ type: 'eq', column: 'id', value: v }];

// ════════════════════════ DB PROXY ════════════════════════
describe('DB proxy — sipariş (orders)', () => {
  test('K1: dizi gövdeyle sipariş eklenemez (anonim)', async () => {
    const r = await q('orders', { method: 'POST', body: [{ amount: 1, status: 'paid', email: 'x@x.com' }] });
    assert.equal(r.status, 400);
    assert.equal(db.lastOf('orders', 'insert'), undefined);
  });
  test('K2: oturumlu kullanıcı proxy ile sipariş ekleyemez (status:paid dahil)', async () => {
    const r = await q('orders', { method: 'POST', body: { status: 'paid', amount: 1 } }, TOK.A);
    assert.equal(r.status, 403);
    assert.equal(db.lastOf('orders', 'insert'), undefined);
  });
  test('anonim sipariş listeleyemez', async () => {
    const r = await q('orders', { method: 'GET', select: '*', filters: [] });
    assert.equal(r.status, 403);
  });
  test('listelemede user_id filtresi sunucuda zorlanır (or filtresi genişletemez)', async () => {
    const r = await q('orders', { method: 'GET', select: '*', filters: [{ type: 'or', value: `email.eq.b@x.com,user_id.eq.${U.B.id}` }] }, TOK.A);
    assert.equal(r.status, 200);
    const last = db.lastOf('orders', 'select');
    assert.deepEqual(last.filters.find(([c]) => c === 'user_id'), ['user_id', U.A.id]);
  });
  test('başkasının sahipli siparişi ID ile okunamaz', async () => {
    assert.equal((await q('orders', { method: 'GET', select: '*', filters: idf(ORDER_A) }, TOK.B)).status, 403);
    assert.equal((await q('orders', { method: 'GET', select: '*', filters: idf(ORDER_A) })).status, 403);
  });
  test('misafir siparişi ID ile açılır ama PII ve admin notu dönmez', async () => {
    const r = await q('orders', { method: 'GET', select: '*', filters: idf(ORDER_GUEST), single: true });
    assert.equal(r.status, 200);
    for (const k of ['email', 'full_name', 'customer_phone', 'address', 'admin_notes', 'user_id']) assert.ok(!(k in r.json.data), `${k} sızdı`);
    assert.equal(r.json.data.status, 'pending');
  });
  test('sahip kendi siparişini görür ama admin_notes görmez', async () => {
    const r = await q('orders', { method: 'GET', select: '*', filters: idf(ORDER_A), single: true }, TOK.A);
    assert.equal(r.status, 200);
    assert.equal(r.json.data.email, 'a@x.com');
    assert.ok(!('admin_notes' in r.json.data));
  });
  test('PATCH: başkası ve anonim sahipli siparişi düzenleyemez', async () => {
    assert.equal((await q('orders', { method: 'PATCH', filters: idf(ORDER_A), body: { brand_name: 'x' } }, TOK.B)).status, 403);
    assert.equal((await q('orders', { method: 'PATCH', filters: idf(ORDER_A), body: { brand_name: 'x' } })).status, 403);
  });
  test('PATCH: status/amount/email/user_id/edit_count istemciden yazılamaz, sayaç sunucuda artar', async () => {
    const r = await q('orders', { method: 'PATCH', filters: idf(ORDER_A), body: { brand_name: 'Marka', status: 'paid', amount: 1, email: 'e@x', user_id: U.B.id, edit_count: -99, paid_at: 'now' } }, TOK.A);
    assert.equal(r.status, 200);
    const upd = db.lastOf('orders', 'update').body;
    assert.deepEqual(Object.keys(upd).sort(), ['brand_name', 'edit_count']);
    assert.equal(upd.edit_count, 1);
    assert.equal(db.tables.orders[0].status, 'pending');
  });
  test('PATCH: revizyon limiti sunucuda uygulanır', async () => {
    db.tables.orders[0].edit_count = 5;
    const r = await q('orders', { method: 'PATCH', filters: idf(ORDER_A), body: { brand_name: 'x' } }, TOK.A);
    assert.equal(r.status, 403);
  });
  test('PATCH: dış logo_url reddedilir, kendi Storage adresimiz kabul edilir', async () => {
    assert.equal((await q('orders', { method: 'PATCH', filters: idf(ORDER_A), body: { logo_url: 'https://evil.example/p.png' } }, TOK.A)).status, 400);
    assert.equal((await q('orders', { method: 'PATCH', filters: idf(ORDER_A), body: { logo_url: 'javascript:alert(1)' } }, TOK.A)).status, 400);
    assert.equal((await q('orders', { method: 'PATCH', filters: idf(ORDER_A), body: { logo_url: LOGO_OK } }, TOK.A)).status, 200);
  });
  test('PATCH: id dışı filtre veya UUID olmayan id reddedilir', async () => {
    assert.equal((await q('orders', { method: 'PATCH', filters: [{ type: 'eq', column: 'email', value: 'a@x.com' }], body: { brand_name: 'x' } }, TOK.A)).status, 403);
    assert.equal((await q('orders', { method: 'PATCH', filters: idf('not-a-uuid'), body: { brand_name: 'x' } }, TOK.A)).status, 403);
    assert.equal((await q('orders', { method: 'PATCH', filters: [...idf(ORDER_A), { type: 'eq', column: 'user_id', value: U.A.id }], body: { brand_name: 'x' } }, TOK.A)).status, 403);
  });
  test('DELETE admin dışında kapalı', async () => {
    assert.equal((await q('orders', { method: 'DELETE', filters: idf(ORDER_A) }, TOK.A)).status, 403);
    assert.equal(db.tables.orders.length, 3);
  });
});

describe('DB proxy — select / filtre enjeksiyonu', () => {
  test('K4: ilişki gömme ile başka tablo okunamaz', async () => {
    for (const select of ['id,orders(*)', 'id,orders(count)', '*,leads(*)', '*, orders!inner(email)', 'id,x:orders(*)']) {
      const r = await q('templates', { method: 'GET', select, filters: [] });
      assert.equal(r.status, 403, select);
    }
    const r2 = await q('orders', { method: 'GET', select: '*, leads(*)', filters: idf(ORDER_GUEST) });
    assert.equal(r2.status, 403);
  });
  test('frontendin kullandığı select biçimleri geçer', async () => {
    assert.equal((await q('templates', { method: 'GET', select: '*', filters: [] })).status, 200);
    assert.equal((await q('orders', { method: 'GET', select: '*, templates:template_id(name, preview_image)', filters: [] }, TOK.A)).status, 200);
    assert.equal((await q('templates', { method: 'GET', select: '*', selectOpts: { count: 'exact' }, filters: [] })).status, 200);
  });
  test('selectOpts yalnızca count/head', async () => {
    assert.equal((await q('templates', { method: 'GET', select: '*', selectOpts: { foo: 1 }, filters: [] })).status, 403);
  });
  test('kolon / tablo / or enjeksiyonu reddedilir', async () => {
    assert.equal((await q('templates', { method: 'GET', filters: [{ type: 'eq', column: 'id;drop', value: 1 }] })).status, 400);
    assert.equal((await q('templates', { method: 'GET', filters: [{ type: 'eq', column: 'id', value: { $ne: 1 } }] })).status, 400);
    assert.equal((await q('templates', { method: 'GET', filters: [{ type: 'or', value: 'id.in.(1,2)' }] })).status, 400);
    assert.equal((await q('templates', { method: 'GET', filters: [{ type: 'like', column: 'id', value: '%' }] })).status, 400);
    assert.equal((await call('/api/db/orders;drop/query', { body: { method: 'GET' } })).status, 400);
    assert.equal((await q('templates', { method: 'PUT' })).status, 400);
  });
  test('bilinmeyen tablolar yalnızca admin', async () => {
    assert.equal((await q('dm1_appointments', { method: 'GET', select: '*', filters: [] })).status, 403);
    assert.equal((await q('dm1_appointments', { method: 'GET', select: '*', filters: [] }, TOK.A)).status, 403);
  });
});

describe('DB proxy — diğer tablolar', () => {
  test('templates: anonim/kullanıcı yazamaz', async () => {
    for (const m of ['POST', 'PATCH', 'DELETE']) {
      assert.equal((await q('templates', { method: m, filters: idf('t1'), body: { price: 1 } }, TOK.A)).status, m === 'POST' || m === 'PATCH' ? 403 : 403, m);
    }
    assert.equal(db.tables.templates[0].price, 1200);
  });
  test('leads: okunamaz; yazımda alanlar beyaz listelenir, project_code sabitlenir', async () => {
    assert.equal((await q('leads', { method: 'GET', select: '*', filters: [] })).status, 403);
    const r = await q('leads', { method: 'POST', body: { name: 'N', email: 'n@x.com', message: 'm', project_code: 'baska', amount: 5, is_admin: true } });
    assert.equal(r.status, 200);
    const ins = db.lastOf('leads', 'insert').body;
    assert.equal(ins.project_code, 'erpolart');
    assert.ok(!('amount' in ins) && !('is_admin' in ins));
  });
  test('leads: geçersiz e-posta ve dizi gövde reddedilir', async () => {
    assert.equal((await q('leads', { method: 'POST', body: { email: 'bozuk', message: 'm' } })).status, 400);
    assert.equal((await q('leads', { method: 'POST', body: [{ email: 'a@x.com' }] })).status, 400);
  });
  test('proposals: yalnızca geçerli UUID ile tek kayıt, yazma yok', async () => {
    assert.equal((await q('proposals', { method: 'GET', select: '*', filters: [] })).status, 403);
    assert.equal((await q('proposals', { method: 'GET', select: '*', filters: idf('1') })).status, 403);
    assert.equal((await q('proposals', { method: 'GET', select: '*', filters: idf(PROPOSAL) })).status, 200);
    assert.equal((await q('proposals', { method: 'POST', body: { amount: 1 } }, TOK.A)).status, 403);
  });
  test('Y5: chat — başkasının user_ oturumu okunamaz, kimse proxy ile mesaj yazamaz', async () => {
    const sB = [{ type: 'eq', column: 'session_id', value: `user_${U.B.id}` }];
    assert.equal((await q('chat_messages', { method: 'GET', select: '*', filters: sB })).status, 403);
    assert.equal((await q('chat_messages', { method: 'GET', select: '*', filters: sB }, TOK.A)).status, 403);
    assert.equal((await q('chat_messages', { method: 'GET', select: '*', filters: sB }, TOK.B)).status, 200);
    assert.equal((await q('chat_messages', { method: 'GET', select: '*', filters: [{ type: 'eq', column: 'session_id', value: 'guest_abc' }] })).status, 200);
    assert.equal((await q('chat_messages', { method: 'GET', select: '*', filters: [] })).status, 403);
    assert.equal((await q('chat_messages', { method: 'POST', body: { session_id: `user_${U.B.id}`, role: 'assistant', content: '[x](javascript:alert(1))' } })).status, 403);
  });
});

describe('Admin yetkisi', () => {
  test('user_metadata.role=admin admin yapmaz', async () => {
    assert.equal((await q('leads', { method: 'GET', select: '*', filters: [] }, TOK.FAKEADMIN)).status, 403);
    assert.equal((await call('/api/admin/orders', { method: 'GET', token: TOK.FAKEADMIN })).status, 403);
    assert.equal((await call('/api/templates', { body: { name: 'x' }, token: TOK.FAKEADMIN })).status, 403);
  });
  test('gerçek admin erişir', async () => {
    assert.equal((await q('leads', { method: 'GET', select: '*', filters: [] }, TOK.ADMIN)).status, 200);
    assert.equal((await call('/api/admin/orders', { method: 'GET', token: TOK.ADMIN })).status, 200);
  });
  test('app_metadata.role=admin admin yapar', async () => {
    const t = fakeJwt({ sub: 'eeee', aal: 'aal1' });
    db.users[t] = { id: 'eeee', email: 'ops@x.com', app_metadata: { role: 'admin' }, user_metadata: {} };
    assert.equal((await q('leads', { method: 'GET', select: '*', filters: [] }, t)).status, 200);
  });
  test('ADMIN_REQUIRE_MFA=1 iken aal1 admin reddedilir, aal2 kabul', async () => {
    process.env.ADMIN_REQUIRE_MFA = '1';
    try {
      assert.equal((await call('/api/admin/orders', { method: 'GET', token: TOK.ADMIN })).status, 403);
      assert.equal((await q('leads', { method: 'GET', select: '*', filters: [] }, TOK.ADMIN)).status, 403);
      assert.equal((await call('/api/admin/orders', { method: 'GET', token: TOK.ADMIN_MFA })).status, 200);
    } finally { delete process.env.ADMIN_REQUIRE_MFA; }
  });
  test('token yok / geçersiz token', async () => {
    assert.equal((await call('/api/admin/orders', { method: 'GET' })).status, 401);
    assert.equal((await call('/api/admin/orders', { method: 'GET', token: 'garbage' })).status, 401);
  });
  test('kaldırılan eski auth uçları yok (service-role oturum kirlenmesi)', async () => {
    for (const p of ['/api/auth/login', '/api/auth/register', '/api/auth/admin-login']) {
      assert.equal((await call(p, { body: { email: 'a@x.com', password: 'x' } })).status, 404, p);
    }
  });
});

// ════════════════════════ ÖDEME ════════════════════════
describe('Ödeme', () => {
  const tok = (orderId, token, extra = {}) => call('/api/payment/paytr-direct-token', { token, body: { orderId, merchantOkUrl: 'https://evil.example/ok', merchantFailUrl: 'https://evil.example/fail', ...extra } });

  test('O2: token ucu kimlik ister', async () => {
    assert.equal((await tok(ORDER_A)).status, 401);
    assert.equal((await call('/api/payment/paytr-token', { body: { orderId: ORDER_A } })).status, 401);
  });
  test('O2: başkasının siparişi için token alınamaz', async () => {
    assert.equal((await tok(ORDER_A, TOK.B)).status, 403);
  });
  test('ödenmiş sipariş için yeniden token alınamaz', async () => {
    assert.equal((await tok(ORDER_PAID, TOK.A)).status, 400);
  });
  test('O1: dönüş URL\'leri istemciden alınmaz; tutar sunucudan', async () => {
    const r = await tok(ORDER_A, TOK.A, { payment_amount: '1.00' });
    assert.equal(r.status, 200);
    assert.equal(r.json.merchant_ok_url, `https://api.example-backend.test/api/payment/success/${ORDER_A}`);
    assert.equal(r.json.merchant_fail_url, 'https://api.example-backend.test/api/payment/fail');
    assert.equal(r.json.payment_amount, (1000 * 40).toFixed(2));
  });
  test('geçersiz sipariş id', async () => {
    assert.equal((await tok("' or 1=1 --", TOK.A)).status, 400);
  });
  test('/api/orders: tutar sunucuda hesaplanır, istemci tutarı yok sayılır', async () => {
    const r = await call('/api/orders', { token: TOK.A, body: { source: 'saas', tier: 'starter', direct_amount: 1, amount: 1, status: 'paid' } });
    assert.equal(r.status, 201);
    const ins = db.lastOf('orders', 'insert').body[0];
    assert.equal(ins.amount, 3500);
    assert.equal(ins.status, 'pending');
    assert.equal(ins.user_id, U.A.id);
  });
  test('/api/orders: bilinmeyen kaynak reddedilir; kimliksiz reddedilir', async () => {
    assert.equal((await call('/api/orders', { token: TOK.A, body: { source: 'free', direct_amount: 1 } })).status, 400);
    assert.equal((await call('/api/orders', { body: { source: 'saas', tier: 'starter' } })).status, 401);
  });
  test('K3: order-config status yazamaz; başkasının siparişine erişemez', async () => {
    const r = await call('/api/templates/order-config', { token: TOK.A, body: { orderId: ORDER_A, status: 'paid', configuration: { brandName: 'X', logo: 'javascript:x', primaryColor: 'red;}' } } });
    assert.equal(r.status, 200);
    const upd = db.lastOf('orders', 'update').body;
    assert.ok(!('status' in upd));
    assert.equal(upd.configuration.logo, null);
    assert.equal(upd.configuration.primaryColor, '#5c73ff');
    assert.equal(db.tables.orders[0].status, 'pending');
    assert.equal((await call('/api/templates/order-config', { token: TOK.B, body: { orderId: ORDER_A } })).status, 403);
    assert.equal((await call(`/api/templates/order-config/${ORDER_A}`, { method: 'GET', token: TOK.B })).status, 403);
  });

  const sign = (oid, status, total) => crypto.createHmac('sha256', 'test-merchant-key').update(oid + 'test-merchant-salt' + status + total).digest('base64');
  const cb = (fields) => call('/api/payment/paytr-callback', { raw: new URLSearchParams(fields).toString(), headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
  const OID = ORDER_A.replace(/-/g, '') + 'abc';

  test('callback: sahte hash siparişi ödenmiş yapamaz', async () => {
    const r = await cb({ merchant_oid: OID, status: 'success', total_amount: '100', hash: 'bad' });
    assert.match(r.json, /bad hash/);
    assert.equal(db.tables.orders[0].status, 'pending');
  });
  test('callback: başka sipariş için alınmış imza tutarı değiştirilerek kullanılamaz', async () => {
    const r = await cb({ merchant_oid: OID, status: 'success', total_amount: '1', hash: sign(OID, 'success', '100') });
    assert.match(r.json, /bad hash/);
    assert.equal(db.tables.orders[0].status, 'pending');
  });
  test('callback: bozuk merchant_oid reddedilir', async () => {
    const r = await cb({ merchant_oid: '../../x', status: 'success', total_amount: '1', hash: 'x' });
    assert.match(r.json, /bad request/);
  });
  test('callback: geçerli imza siparişi paid yapar, tekrar gelirse idempotent', async () => {
    const f = { merchant_oid: OID, status: 'success', total_amount: '4000000', hash: sign(OID, 'success', '4000000') };
    assert.equal((await cb(f)).json, 'OK');
    assert.equal(db.tables.orders[0].status, 'paid');
    const updates = db.log.filter((x) => x.table === 'orders' && x.op === 'update').length;
    assert.equal((await cb(f)).json, 'OK');
    assert.equal(db.log.filter((x) => x.table === 'orders' && x.op === 'update').length, updates);
  });
  test('success redirect: UUID dışı id açık yönlendirme/enjeksiyon yapamaz', async () => {
    const r = await call('/api/payment/success/%2F%2Fevil.example', { method: 'GET' });
    assert.equal(r.status, 302);
    assert.match(r.headers.get('location'), /\/order-cancel$/);
  });
});

// ════════════════════════ FORM / E-POSTA / AI ════════════════════════
describe('İletişim formu ve e-posta', () => {
  test('Y4: geçersiz e-posta ve eksik alan reddedilir', async () => {
    assert.equal((await call('/api/messages', { body: { name: 'a', email: 'bozuk', message: 'm' } })).status, 400);
    assert.equal((await call('/api/messages', { body: { email: 'a@x.com' } })).status, 400);
    assert.equal(sentEmails.length, 0);
  });
  test('Y4: e-postalara giden kullanıcı alanları HTML-kaçışlı', async () => {
    const r = await call('/api/messages', { body: { name: '<a href="https://phish.example">Hesabınızı doğrulayın</a><script>x</script>', email: 'v@x.com', message: '<img src=x onerror=alert(1)>', service_type: '<b>s</b>' } });
    assert.equal(r.status, 201);
    assert.equal(sentEmails.length, 2);
    for (const m of sentEmails) {
      assert.ok(!/<a href="https:\/\/phish/.test(m.html), 'phishing linki kaçışsız');
      assert.ok(!/<script>|<img src=x/.test(m.html), 'script/img kaçışsız');
    }
    assert.equal(db.lastOf('leads', 'insert').body[0].project_code, 'erpolart');
  });
  test('mesaj listesi yalnızca admin', async () => {
    assert.equal((await call('/api/messages', { method: 'GET' })).status, 401);
    assert.equal((await call('/api/messages', { method: 'GET', token: TOK.A })).status, 403);
  });
});

describe('AI uçları', () => {
  test('Y5: başkasının user_ oturumuna mesaj yazılamaz', async () => {
    const body = { message: 'selam', sessionId: `user_${U.B.id}`, userId: U.B.id };
    assert.equal((await call('/api/ai/chat', { body })).status, 403);
    assert.equal((await call('/api/ai/chat', { body, token: TOK.A })).status, 403);
    assert.equal(db.lastOf('chat_messages', 'insert'), undefined);
  });
  test('kendi oturumu ve misafir oturumu çalışır; user_id token\'dan gelir', async () => {
    const r = await call('/api/ai/chat', { body: { message: 'selam', sessionId: `user_${U.A.id}`, userId: U.B.id }, token: TOK.A });
    assert.equal(r.status, 200);
    assert.equal(db.lastOf('chat_messages', 'insert').body[0].user_id, U.A.id);
    assert.equal((await call('/api/ai/chat', { body: { message: 'selam', sessionId: 'guest_x' } })).status, 200);
  });
  test('çeviri ucu yalnızca admin ve sınırlı', async () => {
    assert.equal((await call('/api/ai/translate', { body: { text: 'a', targetLanguages: ['en'] } })).status, 401);
    assert.equal((await call('/api/ai/translate', { body: { text: 'a', targetLanguages: ['en'] }, token: TOK.A })).status, 403);
    assert.equal((await call('/api/ai/translate', { body: { text: 'a', targetLanguages: ['en', 'de', 'fr', 'es', 'it', 'nl'] }, token: TOK.ADMIN })).status, 400);
    assert.equal((await call('/api/ai/translate', { body: { text: 'a', targetLanguages: ['en'] }, token: TOK.ADMIN })).status, 200);
  });
});
