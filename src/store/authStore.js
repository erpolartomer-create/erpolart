import { create } from 'zustand';
import { supabase } from '../lib/supabase';

const translateAuthError = (message) => {
  if (!message) return 'Bir hata oluştu.';
  if (message.includes('Invalid login credentials')) return 'E-posta veya şifre hatalı.';
  if (message.includes('Email not confirmed')) return 'E-posta adresiniz henüz doğrulanmadı. Lütfen gelen kutunuzu (ve spam klasörünü) kontrol edin.';
  if (message.includes('User already registered')) return 'Bu e-posta adresi zaten kayıtlı. Giriş yapmayı deneyin.';
  if (message.includes('Password should be at least')) return 'Şifre en az 6 karakter olmalıdır.';
  if (message.includes('Unable to validate email address')) return 'Geçersiz e-posta adresi formatı.';
  if (message.includes('rate limit') || message.includes('over_email_send_rate_limit') || message.includes('Email rate limit')) return 'E-posta gönderme limiti aşıldı. Lütfen birkaç dakika bekleyin.';
  if (message.includes('signup is disabled')) return 'Kayıt şu anda devre dışı.';
  if (message.includes('Too many requests')) return 'Çok fazla deneme. Lütfen biraz bekleyin.';
  if (message.includes('Network request failed')) return 'Bağlantı hatası. İnternet bağlantınızı kontrol edin.';
  return message;
};

const useAuthStore = create((set) => ({
  user: null,
  loading: false,
  isInitialized: false,
  error: null,

  setUser: (user) => set({ user, isInitialized: true, loading: false }),
  clearError: () => set({ error: null }),

  // Müşteri Girişi (Admin bu kapıdan giremez)
  login: async (email, password) => {
    set({ loading: true, error: null });
    if (email === 'hello@erpolart.com') {
      const msg = 'Yönetici hesabıyla buradan girilemez. Lütfen /admin/login adresini kullanın.';
      set({ error: msg, loading: false });
      throw new Error(msg);
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      set({ error: translateAuthError(error.message), loading: false });
      throw error;
    }
    set({ user: data.user, loading: false, isInitialized: true });
  },

  register: async (name, email, password) => {
    set({ loading: true, error: null });
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: `${window.location.origin}/auth?verified=true`,
      }
    });
    if (error) {
      set({ error: translateAuthError(error.message), loading: false });
      throw error;
    }
    // Email onayı devre dışıysa session hemen döner → kullanıcı zaten giriş yapmış
    if (data.session) {
      set({ user: data.user, loading: false, isInitialized: true });
    } else {
      set({ loading: false });
    }
    return data;
  },

  // Müşteri Çıkışı (Sadece müşteri store'u — her zaman /login'e gider)
  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null, error: null, isInitialized: true, loading: false });
    window.location.href = '/login';
  }
}));

export default useAuthStore;
