import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials missing. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.');
}

const originalSupabase = createClient(supabaseUrl, supabaseAnonKey);

const executeProxyQuery = async (state) => {
  try {
    const sessionRes = await originalSupabase.auth.getSession();
    const token = sessionRes.data?.session?.access_token;
    
    const headers = {
      'Content-Type': 'application/json'
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const apiUrl = import.meta.env.VITE_API_URL || '';
    const response = await fetch(`${apiUrl}/api/db/${state.table}/query`, {
      method: 'POST',
      headers,
      body: JSON.stringify(state)
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || 'Database operation failed');
    }

    return await response.json();
  } catch (err) {
    console.error(`[SupabaseProxy] Error executing query on ${state.table}:`, err.message);
    throw err;
  }
};

const createBuilder = (table, method = 'GET', body = null) => {
  const state = {
    table,
    method,
    body,
    select: '*',
    selectOpts: {},
    filters: [],
    order: null,
    single: false
  };

  const builder = {
    select(fields = '*', options = {}) {
      state.select = fields;
      state.selectOpts = options;
      return builder;
    },
    insert(payload) {
      state.method = 'POST';
      state.body = payload;
      return builder;
    },
    update(payload) {
      state.method = 'PATCH';
      state.body = payload;
      return builder;
    },
    delete() {
      state.method = 'DELETE';
      return builder;
    },
    eq(column, value) {
      state.filters.push({ type: 'eq', column, value });
      return builder;
    },
    or(filterString) {
      state.filters.push({ type: 'or', value: filterString });
      return builder;
    },
    order(column, options = {}) {
      state.order = { column, ascending: options.ascending !== false };
      return builder;
    },
    single() {
      state.single = true;
      return builder;
    },
    then(onFulfilled, onRejected) {
      const promise = executeProxyQuery(state)
        .then(res => ({ data: res.data, error: null, count: res.count }))
        .catch(err => ({ data: null, error: { message: err.message, code: 'PROXY_ERR' } }));
      return promise.then(onFulfilled, onRejected);
    }
  };

  return builder;
};

// Proxy: orijinal client'ın TÜM metodlarını korur (channel, removeChannel, auth,
// realtime...) — sadece `from`'u backend proxy builder'ına yönlendirir.
// NOT: object spread {...originalSupabase} kullanılamaz; prototype metodları
// (örn. channel) kopyalanmaz ve "channel is not a function" hatası verir.
export const supabase = new Proxy(originalSupabase, {
  get(target, prop, receiver) {
    if (prop === 'from') {
      return (table) => createBuilder(table);
    }
    const value = Reflect.get(target, prop, receiver);
    return typeof value === 'function' ? value.bind(target) : value;
  },
});
