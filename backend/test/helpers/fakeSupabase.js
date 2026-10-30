// Bellek içi sahte Supabase istemcisi — güvenlik testleri için.
// Gerçek veritabanına dokunmadan, backend'in hangi sorguyu hangi filtre/gövdeyle
// çalıştırdığını kaydeder ve basit eq filtrelemesiyle sonuç döndürür.

import { randomUUID } from 'node:crypto';

export const createFakeDb = () => {
  const db = {
    tables: {},
    users: {},      // token → user
    log: [],        // çalıştırılan her sorgu
    reset() {
      this.tables = {};
      this.users = {};
      this.log = [];
    },
    lastOf(table, op) {
      return [...this.log].reverse().find((q) => q.table === table && (!op || q.op === op));
    },
  };

  const rowsOf = (table) => (db.tables[table] ||= []);

  const builder = (table) => {
    const q = { table, op: 'select', select: '*', filters: [], ors: [], body: null, single: false, returning: false };
    const match = (row) => q.filters.every(([c, v]) => row[c] === v);

    const exec = async () => {
      db.log.push(JSON.parse(JSON.stringify(q)));
      const rows = rowsOf(table);
      let data;
      if (q.op === 'select') {
        data = rows.filter(match).map((r) => ({ ...r }));
      } else if (q.op === 'insert') {
        const items = (Array.isArray(q.body) ? q.body : [q.body]).map((r) => ({ id: randomUUID(), created_at: new Date().toISOString(), ...r }));
        rows.push(...items);
        data = items.map((r) => ({ ...r }));
      } else if (q.op === 'update') {
        data = [];
        for (const r of rows.filter(match)) { Object.assign(r, q.body); data.push({ ...r }); }
      } else if (q.op === 'delete') {
        data = rows.filter(match);
        db.tables[table] = rows.filter((r) => !match(r));
      }
      if (q.single) {
        if (!data || data.length !== 1) return { data: null, error: { code: 'PGRST116', message: 'not single' }, count: null };
        return { data: data[0], error: null, count: null };
      }
      return { data, error: null, count: null };
    };

    const b = {
      select(cols = '*') { if (q.op === 'select') q.select = cols; else q.returning = true; return b; },
      insert(body) { q.op = 'insert'; q.body = body; return b; },
      update(body) { q.op = 'update'; q.body = body; return b; },
      upsert(body) { q.op = 'insert'; q.body = body; return b; },
      delete() { q.op = 'delete'; return b; },
      eq(c, v) { q.filters.push([c, v]); return b; },
      or(v) { q.ors.push(v); return b; },
      order() { return b; },
      limit() { return b; },
      single() { q.single = true; return b; },
      then(res, rej) { return exec().then(res, rej); },
    };
    return b;
  };

  const client = {
    from: (t) => builder(t),
    auth: {
      getUser: async (token) => {
        const user = db.users[token];
        return user ? { data: { user }, error: null } : { data: { user: null }, error: { message: 'invalid token' } };
      },
      admin: {
        updateUserById: async (id, attrs) => {
          const u = Object.values(db.users).find((x) => x.id === id);
          if (u && attrs.user_metadata) u.user_metadata = attrs.user_metadata;
          return { data: { user: u }, error: null };
        },
      },
    },
  };

  return { db, client };
};

// İmzasız ama biçimi doğru bir JWT üret (yalnızca aal claim'ini okumak için;
// imza doğrulamasını sahte auth.getUser yapar).
export const fakeJwt = (claims) =>
  ['e30', Buffer.from(JSON.stringify(claims)).toString('base64url'), 'sig'].join('.');
