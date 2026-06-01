import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const originalSupabaseAdmin = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storageKey: 'erpolart-admin-vault',
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  }
});

const executeProxyQuery = async (state) => {
  try {
    const sessionRes = await originalSupabaseAdmin.auth.getSession();
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
    console.error(`[SupabaseAdminProxy] Error executing query on ${state.table}:`, err.message);
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

// Proxy: orijinal client'ın TÜM metodlarını korur, sadece `from`'u override eder.
// (object spread prototype metodlarını kaybeder — bkz. supabase.js)
export const supabaseAdmin = new Proxy(originalSupabaseAdmin, {
  get(target, prop, receiver) {
    if (prop === 'from') {
      return (table) => createBuilder(table);
    }
    const value = Reflect.get(target, prop, receiver);
    return typeof value === 'function' ? value.bind(target) : value;
  },
});
