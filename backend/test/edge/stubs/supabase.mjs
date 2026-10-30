// esm.sh supabase-js yerine: testin tanımladığı token → kullanıcı eşlemesini kullanır.
export const createClient = () => ({
  auth: {
    getUser: async (token) => {
      const user = globalThis.__edgeUsers?.[token];
      return user ? { data: { user }, error: null } : { data: { user: null }, error: { message: 'invalid' } };
    },
  },
});
