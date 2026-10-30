// Socket.io güvenlik testleri — gerçek Socket.io sunucusu + istemcisi, sahte Supabase auth.
import { test, describe, before, after, mock } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { createRequire } from 'node:module';
import { Server } from 'socket.io';
import { createFakeDb, fakeJwt } from './helpers/fakeSupabase.js';

const { db, client } = createFakeDb();
mock.module(new URL('../src/config/supabase.js', import.meta.url).href, { namedExports: { supabase: client } });

// socket.io-client frontend bağımlılığı (kök node_modules)
const { io: connect } = createRequire(new URL('../../package.json', import.meta.url))('socket.io-client');

const U = {
  A: { id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', email: 'a@x.com', user_metadata: {}, app_metadata: {} },
  B: { id: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', email: 'b@x.com', user_metadata: {}, app_metadata: {} },
  FAKE: { id: 'cccccccc-cccc-4ccc-8ccc-cccccccccccc', email: 'evil@x.com', user_metadata: { role: 'admin' }, app_metadata: {} },
  ADMIN: { id: 'dddddddd-dddd-4ddd-8ddd-dddddddddddd', email: 'hello@erpolart.com', user_metadata: {}, app_metadata: {} },
};
const T = Object.fromEntries(Object.keys(U).map((k) => [k, fakeJwt({ sub: U[k].id, aal: 'aal1' })]));
const ROOM_B = `user_${U.B.id}`;

let url, httpServer, io, mutedSessions;
const sockets = [];

before(async () => {
  db.users = Object.fromEntries(Object.keys(U).map((k) => [T[k], U[k]]));
  const { isAdminUser } = await import('../src/middleware/authMiddleware.js');
  const { registerSocketHandlers } = await import('../src/socket/registerSocketHandlers.js');
  httpServer = createServer();
  io = new Server(httpServer);
  mutedSessions = new Set();
  registerSocketHandlers(io, { supabase: client, mutedSessions, isAdminUser });
  await new Promise((r) => httpServer.listen(0, r));
  url = `http://127.0.0.1:${httpServer.address().port}`;
});
after(() => { sockets.forEach((s) => s.close()); io.close(); httpServer.close(); });

const open = async () => {
  const s = connect(url, { transports: ['websocket'], forceNew: true, reconnection: false });
  sockets.push(s);
  await new Promise((r, j) => { s.once('connect', r); s.once('connect_error', j); });
  return s;
};
const settle = () => new Promise((r) => setTimeout(r, 150)); // async getUser bitsin
// Olay gelirse payload'ı, gelmezse null döner
const next = (s, ev, ms = 250) => new Promise((r) => {
  const t = setTimeout(() => { s.off(ev, h); r(null); }, ms);
  const h = (p) => { clearTimeout(t); r(p); };
  s.once(ev, h);
});
const roomsOf = async (s) => [...((await io.fetchSockets()).find((x) => x.id === s.id)?.rooms || [])];

describe('Socket.io — oda yetkisi', () => {
  test("token'sız user_ odasına katılınamaz", async () => {
    const s = await open(); s.emit('join_session', ROOM_B); await settle();
    assert.ok(!(await roomsOf(s)).includes(ROOM_B));
  });
  test("başkasının token'ıyla user_ odasına katılınamaz", async () => {
    const s = await open(); s.emit('join_session', ROOM_B, T.A); await settle();
    assert.ok(!(await roomsOf(s)).includes(ROOM_B));
  });
  test('geçersiz token ile katılınamaz', async () => {
    const s = await open(); s.emit('join_session', ROOM_B, 'garbage'); await settle();
    assert.ok(!(await roomsOf(s)).includes(ROOM_B));
  });
  test('sahibi kendi odasına katılır; misafir kendi guest_ odasına katılır', async () => {
    const b = await open(); b.emit('join_session', ROOM_B, T.B);
    const g = await open(); g.emit('join_session', 'guest_123');
    await settle();
    assert.ok((await roomsOf(b)).includes(ROOM_B));
    assert.ok((await roomsOf(g)).includes('guest_123'));
  });
  test('join_session ile admin_room\'a girilemez; geçersiz tipler yok sayılır', async () => {
    const s = await open();
    s.emit('join_session', 'admin_room');
    s.emit('join_session', { $gt: '' });
    s.emit('join_session', 'x'.repeat(500));
    await settle();
    assert.deepEqual((await roomsOf(s)).filter((r) => r !== s.id), []);
  });
});

describe('Socket.io — admin olayları', () => {
  test('müşteri ve sahte admin (user_metadata.role) admin_room\'a giremez', async () => {
    const a = await open(); a.emit('admin_join', T.A);
    const f = await open(); f.emit('admin_join', T.FAKE);
    const n = await open(); n.emit('admin_join');
    await settle();
    for (const s of [a, f, n]) assert.ok(!(await roomsOf(s)).includes('admin_room'));
  });
  test('admin olmayan kurbana admin mesajı gönderemez', async () => {
    const victim = await open(); victim.emit('join_session', ROOM_B, T.B);
    const attacker = await open(); attacker.emit('admin_join', T.FAKE);
    await settle();
    const got = next(victim, 'message');
    attacker.emit('admin_send_message', { sessionId: ROOM_B, content: '[Ödeme](https://phish.example)' });
    assert.equal(await got, null);
  });
  test('admin olmayan bot susturamaz / durum sorgulayamaz', async () => {
    const s = await open();
    s.emit('mute_bot', ROOM_B); await settle();
    assert.equal(mutedSessions.has(ROOM_B), false);
    const r = next(s, 'bot_status_update'); s.emit('check_mute_status', ROOM_B);
    assert.equal(await r, null);
  });
  test('admin_room yayınları dışarıdan dinlenemez', async () => {
    const eaves = await open(); eaves.emit('join_session', 'guest_eaves'); await settle();
    const got = next(eaves, 'new_message');
    io.to('admin_room').emit('new_message', { content: 'gizli' });
    assert.equal(await got, null);
  });
  test('gerçek admin: odaya girer, mesaj gönderir, susturur', async () => {
    const admin = await open(); admin.emit('admin_join', T.ADMIN);
    const victim = await open(); victim.emit('join_session', ROOM_B, T.B);
    await settle();
    assert.ok((await roomsOf(admin)).includes('admin_room'));
    const got = next(victim, 'message');
    admin.emit('admin_send_message', { sessionId: ROOM_B, content: 'merhaba' });
    assert.equal((await got)?.content, 'merhaba');
    admin.emit('mute_bot', ROOM_B); await settle();
    assert.equal(mutedSessions.has(ROOM_B), true);
  });
});
