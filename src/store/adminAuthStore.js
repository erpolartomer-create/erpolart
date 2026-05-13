import { create } from 'zustand';
import { supabaseAdmin } from '../lib/supabaseAdmin';

const useAdminAuthStore = create((set) => ({
  adminUser: null,
  isAdminInitialized: false,
  adminLogin: async (email, password) => {
    if (email !== 'hello@erpolart.com') throw new Error('Yetkisiz Admin Girişi');
    const { data, error } = await supabaseAdmin.auth.signInWithPassword({ email, password });
    if (error) throw error;
    set({ adminUser: data.user, isAdminInitialized: true });
  },
  logout: async () => {
    await supabaseAdmin.auth.signOut();
    set({ adminUser: null, isAdminInitialized: true });
    window.location.href = '/admin/login';
  },
  setAdmin: (user) => set({ adminUser: user, isAdminInitialized: true })
}));

export default useAdminAuthStore;
