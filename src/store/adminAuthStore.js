import { create } from 'zustand';
import { supabaseAdmin } from '../lib/supabaseAdmin';

// İki aşamalı doğrulama (TOTP) durumu:
//   'ok'        → oturum aal2 (veya henüz faktör yok ve kurulum atlandı)
//   'challenge' → doğrulanmış faktör var, 6 haneli kod gerekiyor
//   'enroll'    → faktör yok, QR ile kurulum önerilir
// Asıl koruma backend'de: ADMIN_REQUIRE_MFA=1 iken aal2 olmayan token admin sayılmaz.
const mfaState = async () => {
  const { data: aal } = await supabaseAdmin.auth.mfa.getAuthenticatorAssuranceLevel();
  if (aal?.currentLevel === 'aal2') return { step: 'ok' };
  const { data: factors } = await supabaseAdmin.auth.mfa.listFactors();
  const verified = (factors?.totp || []).find((f) => f.status === 'verified');
  if (verified) return { step: 'challenge', factorId: verified.id };
  return { step: 'enroll' };
};

const useAdminAuthStore = create((set) => ({
  adminUser: null,
  isAdminInitialized: false,
  mfaPending: false, // doğrulanmış faktör var ama oturum henüz aal2 değil
  adminLogin: async (email, password) => {
    if (email !== 'hello@erpolart.com') throw new Error('Yetkisiz Admin Girişi');
    const { data, error } = await supabaseAdmin.auth.signInWithPassword({ email, password });
    if (error) throw error;
    const mfa = await mfaState();
    set({ adminUser: data.user, isAdminInitialized: true, mfaPending: mfa.step === 'challenge' });
    return mfa;
  },
  verifyMfa: async (factorId, code) => {
    const { error } = await supabaseAdmin.auth.mfa.challengeAndVerify({ factorId, code: String(code).trim() });
    if (error) throw new Error('Kod doğrulanamadı. Uygulamadaki güncel kodu girin.');
    set({ mfaPending: false });
  },
  refreshMfa: async () => {
    const { data } = await supabaseAdmin.auth.getSession();
    if (!data?.session) return set({ mfaPending: false });
    const mfa = await mfaState();
    set({ mfaPending: mfa.step === 'challenge' });
  },
  startEnroll: async () => {
    // Yarım kalmış (doğrulanmamış) faktörleri temizle, yoksa yeni kayıt reddedilir
    const { data: factors } = await supabaseAdmin.auth.mfa.listFactors();
    for (const f of factors?.all || []) {
      if (f.status !== 'verified') await supabaseAdmin.auth.mfa.unenroll({ factorId: f.id });
    }
    const { data, error } = await supabaseAdmin.auth.mfa.enroll({ factorType: 'totp', friendlyName: 'ErpolArt Admin' });
    if (error) throw error;
    return { factorId: data.id, qr: data.totp.qr_code, secret: data.totp.secret };
  },
  logout: async () => {
    await supabaseAdmin.auth.signOut();
    set({ adminUser: null, isAdminInitialized: true, mfaPending: false });
    window.location.href = '/admin/login';
  },
  setAdmin: (user) => set({ adminUser: user, isAdminInitialized: true })
}));

export default useAdminAuthStore;
