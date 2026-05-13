import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, ArrowRight, AlertCircle, CheckCircle2, ShieldCheck, Cpu } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const UpdatePasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkToken = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const hash = window.location.hash;

      // Eğer aktif bir oturum (recovery linkiyle gelen) yoksa ve hash bulunamadıysa giriş sayfasına yönlendir
      if (!session && !hash.includes('access_token=')) {
        navigate('/login', { replace: true });
      }
    };
    checkToken();
  }, [navigate]);



  const handleUpdate = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Şifreler uyuşmuyor.');
      return;
    }

    if (password.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });

      if (updateError) throw updateError;

      setSuccess(true);

      // URL Temizliği - Hash ve parametreleri temizle
      window.history.replaceState({}, document.title, "/");

      // Güncel oturumdaki kullanıcıyı al (Rolü belirle)
      const { data: { user: updatedUser } } = await supabase.auth.getUser();

      // Oturumu Sonlandır (Linkin tekrar kullanılmasını engelle)
      await supabase.auth.signOut();

      setTimeout(() => {
        // Güvenli Yönlendirme
        if (updatedUser?.email === 'hello@erpolart.com') {
          navigate('/admin/login', { replace: true });
        } else {
          navigate('/login', { replace: true });
        }
      }, 3000);



    } catch (err) {
      setError(err.message || 'Şifre güncellenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-deep-black flex items-center justify-center relative overflow-hidden px-6 transition-colors duration-500 font-sans">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-violet/10 blur-[150px] rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg relative z-10"
      >
        <div className="bg-surface/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-10 md:p-12 shadow-2xl transition-colors duration-500">
          <div className="text-center mb-10">
            <div className="flex justify-center mb-10 transition-transform hover:scale-110">
              <Link to="/" className="inline-block">
                <img
                  src="/logo-beyaz.png"
                  alt="ErpolArt Logo"
                  className="h-10 w-auto object-contain mx-auto transition-all"
                />
              </Link>
            </div>

            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo/10 text-indigo mb-6 border border-indigo/20 shadow-xl">
              <Lock size={30} />
            </div>
            <h1 className="text-3xl font-display font-black text-white italic tracking-tighter mb-4">
              Yeni <span className="text-indigo">Şifre Belirle</span>
            </h1>
            <p className="text-muted-text text-sm font-medium font-sans">
              Hesabınızın güvenliği için yeni şifrenizi aşağıya girin.
            </p>
          </div>

          {!success ? (
            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted-text uppercase tracking-widest ml-1">Yeni Şifre</label>
                <div className="relative group">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-deep-black/50 border border-white/5 rounded-2xl px-6 py-5 text-white placeholder:text-gray-600 focus:border-indigo/50 focus:outline-none transition-all"
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted-text uppercase tracking-widest ml-1">Yeni Şifre Tekrar</label>
                <div className="relative group">
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-deep-black/50 border border-white/5 rounded-2xl px-6 py-5 text-white placeholder:text-gray-600 focus:border-indigo/50 focus:outline-none transition-all"
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
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
                <span className="relative z-10">{loading ? 'Güncelleniyor...' : 'Şifreyi Güncelle'}</span>
                {!loading && <ArrowRight size={20} className="relative z-10 group-hover:translate-x-1.5 transition-transform" />}
                <div className="absolute inset-0 bg-gradient-to-r from-indigo to-cyan opacity-0 group-hover:opacity-10 transition-opacity" />
              </button>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-500 mx-auto mb-6">
                <CheckCircle2 size={30} />
              </div>
              <h3 className="text-2xl font-black text-white mb-2 italic tracking-tight">Şifre Başarıyla Güncellendi!</h3>
              <p className="text-gray-400 font-medium text-sm">Giriş sayfasına yönlendiriliyorsunuz...</p>
            </motion.div>
          )}

          <div className="mt-12 pt-8 border-t border-white/5 flex items-center justify-between text-muted-text text-[9px] font-black uppercase tracking-widest transition-colors opacity-60">
            <div className="flex items-center gap-2">
              <Cpu size={14} className="text-indigo" />
              <span>Node Sec-01</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck size={14} className="text-indigo" />
              <span>AI Security Guard</span>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default UpdatePasswordPage;
