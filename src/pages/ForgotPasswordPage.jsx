import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowRight, AlertCircle, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import i18n from '../i18n';
import { supabase } from '../lib/supabase';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleResetRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password?lang=${i18n.language}`,
      });

      if (resetError) throw resetError;

      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Sıfırlama isteği gönderilirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-deep-black flex items-center justify-center p-6 relative overflow-hidden transition-colors duration-500 font-sans">
      <Helmet>
        <title>Şifremi Unuttum - ErpolArt</title>
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      {/* Background Decor */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan/5 blur-[120px] rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-surface/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-10 md:p-12 shadow-2xl transition-colors duration-500">
          <div className="text-center mb-10">
            <div className="flex justify-center mb-8">
              <Link to="/" className="inline-block hover:scale-105 transition-transform">
                <img
                  src="/logo-beyaz.png"
                  alt="ErpolArt Logo"
                  className="h-9 w-auto object-contain mx-auto"
                />
              </Link>
            </div>

            <h1 className="text-3xl font-display font-black text-white italic tracking-tighter mb-4">
              Şifre <span className="text-indigo">Sıfırlama</span>
            </h1>
            <p className="text-muted-text text-sm font-medium leading-relaxed">
              {success
                ? "Sıfırlama bağlantısı e-posta adresinize gönderildi. Lütfen gelen kutusunu (ve spam klasörünü) kontrol edin."
                : "E-posta adresinizi girin, size şifre sıfırlama bağlantısını içeren bir e-posta gönderelim."
              }
            </p>
          </div>

          <AnimatePresence mode="wait">
            {!success ? (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleResetRequest}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-text uppercase tracking-widest ml-1">E-Posta Adresi</label>
                  <div className="relative group">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-deep-black/50 border border-white/5 rounded-2xl px-6 py-5 text-white placeholder:text-gray-600 focus:border-indigo/50 focus:outline-none transition-all shadow-inner"
                      placeholder="ornek@mail.com"
                      required
                    />
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-indigo transition-colors">
                      <Mail size={18} />
                    </div>
                  </div>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-medium flex items-center gap-3"
                  >
                    <AlertCircle size={18} className="shrink-0" />
                    {error}
                  </motion.div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full group relative flex items-center justify-center gap-4 bg-white dark:bg-pearl text-deep-black font-black uppercase tracking-widest py-6 rounded-2xl hover:scale-105 active:scale-95 transition-all overflow-hidden shadow-xl"
                >
                  <span className="relative z-10">{loading ? 'İstek Gönderiliyor...' : 'Bağlantı Gönder'}</span>
                  {!loading && <ArrowRight size={20} className="relative z-10 group-hover:translate-x-1.5 transition-transform" />}
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo to-cyan opacity-0 group-hover:opacity-10 transition-opacity" />
                </button>

                <div className="text-center pt-4">
                  <Link to="/login" className="text-[10px] font-black text-gray-500 uppercase tracking-widest hover:text-white transition-colors">
                    Giriş Sayfasına Dön
                  </Link>
                </div>
              </motion.form>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6"
              >
                <div className="w-20 h-20 rounded-[2rem] bg-indigo/10 border border-indigo/20 flex items-center justify-center text-indigo mx-auto mb-8 shadow-indigo/20 shadow-2xl animate-pulse">
                  <Mail size={40} />
                </div>
                <h3 className="text-xl font-display font-black text-white mb-8 italic tracking-tight">Mail Gönderildi!</h3>
                <Link
                  to="/login"
                  className="w-full inline-flex items-center justify-center py-5 rounded-2xl bg-white/[0.03] border border-white/[0.06] text-white/50 font-black text-[11px] uppercase tracking-widest hover:bg-white/[0.06] hover:text-white transition-all"
                >
                  Giriş Sayfasına Dön
                </Link>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-12 pt-8 border-t border-white/5 flex items-center justify-center gap-4 text-gray-700 text-[8px] font-black uppercase tracking-[0.3em]">
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={12} />
              <span>Secure Node</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-white/10" />
            <div className="flex items-center gap-1.5">
              <Sparkles size={12} />
              <span>ErpolArt Cloud</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;
