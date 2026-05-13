import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowRight, Bot, Lock } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import useAdminAuthStore from '../../store/adminAuthStore';
import useUIStore from '../../store/uiStore';

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const adminLogin = useAdminAuthStore((state) => state.adminLogin);
  const theme = useUIStore((state) => state.theme);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (email !== 'hello@erpolart.com') {
      setError('Yetkisiz erişim denemesi. Bu alan sadece sistem yöneticisine aittir.');
      setLoading(false);
      return;
    }

    try {
      await adminLogin(email, password);
      // Başarılı giriş sonrası doğrudan dashboard'a uçur
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message || 'Giriş yetkisi doğrulanamadı.');
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
        <div className="bg-surface/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-12 shadow-2xl transition-colors duration-500">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-10 transition-transform hover:scale-110">
              <Link to="/" className="inline-block">
                <img
                  src="/logo-beyaz.png"
                  alt="ErpolArt Logo"
                  className="h-10 w-auto object-contain mx-auto transition-all"
                />
              </Link>
            </div>

            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-indigo/10 text-indigo mb-6 border border-indigo/20 shadow-xl">
              <ShieldCheck size={40} />
            </div>
            <h1 className="text-4xl font-display font-black text-white italic tracking-tighter mb-4">
              Yönetici <span className="text-indigo">Sistemi</span>
            </h1>
            <p className="text-muted-text font-medium font-sans">
              Bu alan yalnızca <span className="text-white font-bold underline">ErpolArt yetkililerine</span> özeldir.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-muted-text uppercase tracking-widest ml-1">Admin E-Posta</label>
              <div className="relative group">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-deep-black/50 border border-white/5 rounded-2xl px-6 py-5 text-white placeholder:text-gray-600 focus:border-indigo/50 focus:outline-none transition-all"
                  placeholder="admin@erpolart.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-muted-text uppercase tracking-widest ml-1 transition-colors">Erişim Şifresi</label>
              <div className="relative group">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-deep-black/50 border border-white/5 rounded-2xl px-6 py-5 text-white placeholder:text-gray-600 focus:border-indigo/50 focus:outline-none transition-all"
                  placeholder="••••••••"
                  required
                />
                <div className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-600">
                  <Lock size={18} />
                </div>
              </div>
              <div className="flex justify-end pr-1">
                <Link to="/forgot-password" size="sm" className="text-[9px] font-black text-indigo/60 uppercase tracking-widest hover:text-indigo hover:underline transition-all">Şifremi Unuttum</Link>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium"
              >
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full group relative flex items-center justify-center gap-4 bg-white dark:bg-pearl text-deep-black font-black uppercase tracking-widest py-6 rounded-2xl hover:scale-105 active:scale-95 transition-all overflow-hidden shadow-xl"
            >
              <span className="relative z-10">{loading ? 'Doğrulanıyor...' : 'Sisteme Giriş Yap'}</span>
              {!loading && <ArrowRight size={20} className="relative z-10 group-hover:translate-x-1.5 transition-transform" />}
              <div className="absolute inset-0 bg-gradient-to-r from-indigo to-cyan opacity-0 group-hover:opacity-10 transition-opacity" />
            </button>
          </form>

          <div className="mt-12 pt-10 border-t border-white/5 flex items-center justify-between text-muted-text text-[10px] font-black uppercase tracking-wider transition-colors">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo animate-pulse" />
              <span>Teknik Terminal Aktif</span>
            </div>
            <div className="flex items-center gap-2">
              <Bot size={14} />
              <span>ErpolArt AI Guard 4.0</span>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-gray-700 text-[9px] font-black uppercase tracking-widest opacity-40">
          Unauthorized access attempt is logged with IP surveillance.
        </div>
      </motion.div>
    </section>
  );
};

export default AdminLoginPage;
