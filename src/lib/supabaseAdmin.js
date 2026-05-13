import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabaseAdmin = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storageKey: 'erpolart-admin-vault',
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false // OAuth tokenlarını YAKALAMASINI engelle
  }
});
