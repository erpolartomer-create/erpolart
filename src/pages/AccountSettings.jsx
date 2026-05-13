import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Save, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import useAuthStore from '../store/authStore';
import ScrollReveal from '../components/ScrollReveal';
import { supabase } from '../lib/supabase';

const AccountSettings = () => {
  const { t } = useTranslation();
  const { user, setUser } = useAuthStore();

  const [name, setName] = useState(user?.user_metadata?.full_name || user?.name || '');
  const [email] = useState(user?.email || ''); // Email is read-only
  const [newPassword, setNewPassword] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isGoogleUser = user?.app_metadata?.provider === 'google';

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (loading) return;

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const { data, error: updateError } = await supabase.auth.updateUser({
        data: { full_name: name }
      });

      if (updateError) throw updateError;

      // Update global store
      setUser(data.user);
      setSuccess(t('account.updateSuccess'));
    } catch (err) {
      console.error('Profile update error:', err);
      setError(err.message || t('account.updateError'));
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (loading || isGoogleUser) return;
    if (!newPassword || newPassword.length < 6) {
      setError(t('account.passwordMinLength'));
      return;
    }

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (updateError) throw updateError;

      setSuccess(t('account.passwordUpdateSuccess'));
      setNewPassword('');
    } catch (err) {
      console.error('Password update error:', err);
      setError(err.message || t('account.passwordUpdateError'));
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-surface border border-border-adaptive rounded-xl px-5 py-4 text-white text-sm font-medium placeholder-muted-text/50 focus:border-indigo/50 focus:ring-1 focus:ring-indigo/30 outline-none transition-all";
  const labelClass = "text-[10px] font-black text-muted-text uppercase tracking-widest mb-2 block";

  return (
    <div className="min-h-screen bg-deep-black pt-32 pb-20">
      <div className="container mx-auto px-6 md:px-12 max-w-2xl">
        <ScrollReveal direction="up">
          <div className="mb-12">
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2">
              {t('account.title')}
            </h1>
            <p className="text-muted-text text-sm font-medium">
              {t('account.subtitle')}
            </p>
          </div>
        </ScrollReveal>

        {/* Success / Error Messages */}
        {success && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center gap-3">
            <CheckCircle2 size={16} className="text-green-400" />
            <span className="text-green-400 text-sm font-medium">{success}</span>
          </motion.div>
        )}
        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3">
            <AlertCircle size={16} className="text-red-400" />
            <span className="text-red-400 text-sm font-medium">{error}</span>
          </motion.div>
        )}

        {/* Profile Section */}
        <ScrollReveal direction="up">
          <div className="bg-surface border border-border-adaptive rounded-3xl p-8 mb-6 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-indigo/10 border border-indigo/20 flex items-center justify-center text-indigo">
                <User size={20} />
              </div>
              <div>
                <h2 className="text-lg font-black text-white">{t('account.profile')}</h2>
                <p className="text-[10px] font-bold text-muted-text uppercase tracking-widest">{t('account.personalInfo')}</p>
              </div>
            </div>

            <form onSubmit={handleProfileUpdate} className="space-y-5">
              <div>
                <label className={labelClass}>{t('account.fullName')}</label>
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={inputClass}
                    required
                  />
                  <User size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-text" />
                </div>
              </div>

              <div>
                <label className={labelClass}>{t('account.email')}</label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    className={`${inputClass} opacity-50 cursor-not-allowed`}
                    readOnly
                  />
                  <Mail size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-text" />
                </div>
                <p className="text-[9px] text-muted-text mt-2 font-medium italic">{t('account.emailLockHint')}</p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-indigo text-pure-white font-black text-[11px] uppercase tracking-[0.2em] hover:shadow-lg hover:shadow-indigo/20 transition-all disabled:opacity-50"
              >
                <Save size={16} className={loading ? "animate-spin" : ""} />
                {loading ? t('account.saving') : t('account.saveChanges')}
              </button>
            </form>
          </div>
        </ScrollReveal>

        {/* Security Section */}
        <ScrollReveal direction="up">
          <div className="bg-surface border border-border-adaptive rounded-3xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-violet/10 border border-violet/20 flex items-center justify-center text-violet">
                <Lock size={20} />
              </div>
              <div>
                <h2 className="text-lg font-black text-white">{t('account.security')}</h2>
                <p className="text-[10px] font-bold text-muted-text uppercase tracking-widest">{t('account.changePassword')}</p>
              </div>
            </div>

            {isGoogleUser ? (
              <div className="p-6 rounded-2xl bg-indigo/5 border border-indigo/10 text-center">
                <p className="text-sm text-muted-text leading-relaxed italic">
                  {t('account.googleAuthHint')}
                </p>
              </div>
            ) : (
              <form onSubmit={handlePasswordUpdate} className="space-y-5">
                <div>
                  <label className={labelClass}>{t('account.newPassword')}</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={inputClass}
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-surface-adaptive border border-border-adaptive text-white font-black text-[11px] uppercase tracking-[0.2em] hover:bg-indigo/5 hover:text-indigo hover:border-indigo/30 transition-all disabled:opacity-50"
                >
                  <Lock size={16} />
                  {loading ? t('account.updating') : t('account.updatePassword')}
                </button>
              </form>
            )}
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
};

export default AccountSettings;
