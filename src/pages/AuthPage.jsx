import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle2, Sparkles, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import useAuthStore from '../store/authStore';
import useUIStore from '../store/uiStore';
import { supabase } from '../lib/supabase';

const AuthPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { login, register, loading, error, clearError, user } = useAuthStore();
  const theme = useUIStore((state) => state.theme);

  const [isLogin, setIsLogin] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');

  // Giriş sonrası dönülecek yol: router state → sessionStorage (OAuth fallback) → '/'
  const stateFrom = location.state?.from
    ? (location.state.from.pathname || '/') + (location.state.from.search || '')
    : null;
  let storedFrom = null;
  try { storedFrom = sessionStorage.getItem('erpolart_post_login_redirect'); } catch { /* yut */ }
  const from = stateFrom || storedFrom || '/';

  const clearStoredRedirect = () => {
    try { sessionStorage.removeItem('erpolart_post_login_redirect'); } catch { /* yut */ }
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}${from}`, // Giriş sonrası yönlenecek sayfa
        queryParams: {
          access_type: 'offline',
          prompt: 'select_account',
        },
      },
    });
    if (error) console.error(t('auth.loginErrorPrefix'), error.message);
  };

  useEffect(() => {
    if (searchParams.get('verified') === 'true') {
      setIsVerified(true);
      setIsLogin(true);
      supabase.auth.signOut();
    }
  }, [searchParams]);

  // Zaten giriş yapmış kullanıcıyı auth sayfasından yönlendir (OAuth dönüşü dahil)
  useEffect(() => {
    if (user && !searchParams.get('verified')) {
      clearStoredRedirect();
      navigate(from || '/', { replace: true });
    }
  }, [user, navigate, from, searchParams]);

  const switchMode = () => {
    setIsLogin(!isLogin);
    setIsRegistered(false);
    clearError();
    setLocalError('');
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    setLocalError('');

    if (isLogin && email === 'hello@erpolart.com') {
      setLocalError('Bu alan müşteriler içindir. Sistem yöneticisi girişi için /admin/login adresini kullanın.');
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      setLocalError(t('auth.passwordMismatch'));
      return;
    }

    try {
      if (isLogin) {
        await login(email, password);
        navigate(from, { replace: true });
      } else {
        const data = await register(name, email, password);
        if (data?.session) {
          // Email onayı devre dışı → kullanıcı zaten giriş yapmış
          navigate(from, { replace: true });
        } else {
          setIsRegistered(true);
        }
      }
    } catch (err) {
      // error is set in store
    }
  };

  const displayError = localError || error;

  const passwordChecks = [
    { label: t('auth.passwordCheck.chars'), valid: password.length >= 6 },
    { label: t('auth.passwordCheck.match'), valid: password && password === confirmPassword },
  ];

  return (
    <div className="min-h-screen bg-deep-black text-white flex relative overflow-hidden transition-colors duration-500">
      <Helmet>
        <title>Giriş - ErpolArt</title>
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      {/* Left - Branding Panel */}
      <div className="hidden lg:flex lg:w-[45%] relative bg-surface flex-col justify-between p-12 overflow-hidden border-r border-border-adaptive transition-colors duration-500 font-sans">
        {/* Background Effects */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan/8 blur-[120px] rounded-full" />
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }} />

        {/* Real Logo Implementation */}
        <div className="relative z-10 transition-transform duration-500 hover:scale-110 origin-left">
          <Link to="/" className="inline-block">
            <img
              src={theme === 'dark' ? "/logo-beyaz.png" : "/logo.png"}
              alt="ErpolArt Logo"
              className="h-10 w-auto object-contain transition-all"
            />
          </Link>
        </div>

        {/* Center Content */}
        <div className="relative z-10 space-y-10">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo/5 border border-indigo/20 text-indigo text-[10px] font-black uppercase tracking-[0.3em] mb-8">
              <Sparkles size={12} />
              {t('auth.premiumPlatform')}
            </div>
            <h2 className="text-5xl xl:text-7xl font-display font-black text-white leading-[1] tracking-tight italic">
              {t('auth.heroTitlePart1')}<br />{t('auth.heroTitlePart2')}<br />
              <span className="bg-gradient-to-r from-indigo via-violet to-cyan bg-clip-text text-transparent inline-block pb-2 pr-8">
                {t('auth.heroTitlePart3')}
              </span>
            </h2>
            <p className="text-muted-text text-lg xl:text-xl mt-8 max-w-sm leading-relaxed font-medium transition-colors duration-500">
              {t('auth.heroSubtitle')}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              t('auth.features.favorites'),
              t('auth.features.templates'),
              t('auth.features.checkout'),
              t('auth.features.experience')
            ].map((f, i) => (
              <div key={i} className="px-5 py-2.5 rounded-xl bg-surface/50 border border-border-adaptive text-[10px] font-black text-muted-text uppercase tracking-widest transition-all hover:border-indigo/50">
                {f}
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-[10px] font-black text-muted-text uppercase tracking-[0.4em] transition-colors duration-500">
          {t('auth.copyright')}
        </div>
      </div>

      {/* Right - Auth Section */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 relative bg-deep-black transition-colors duration-500">
        <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-indigo/5 blur-[150px] rounded-full pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md relative z-10"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-10">
            <Link to="/" className="inline-block">
              <img
                src={theme === 'dark' ? "/logo-beyaz.png" : "/logo.png"}
                alt="ErpolArt Logo"
                className="h-8 w-auto object-contain mx-auto transition-all"
              />
            </Link>
          </div>

          <AnimatePresence mode="wait">
            {isRegistered ? (
              <motion.div
                key="registered-success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-center bg-surface border border-border-adaptive rounded-[2.5rem] p-12 shadow-2xl transition-colors duration-500 font-sans"
              >
                <div className="w-20 h-20 rounded-[2rem] bg-indigo/10 border border-indigo/20 flex items-center justify-center text-indigo mx-auto mb-10 shadow-lg">
                  {isVerified ? <CheckCircle2 size={40} className="text-emerald-500" /> : <Mail size={40} />}
                </div>
                <h2 className="text-3xl font-display font-black text-white mb-4 italic tracking-tight transition-colors duration-500">
                  {isVerified ? t('auth.verifiedSuccess') || 'Account Verified' : t('auth.checkEmail')}
                </h2>
                <p className="text-muted-text text-base mb-6 leading-relaxed font-medium transition-colors duration-500">
                  {isVerified
                    ? t('auth.verifiedSubtitle') || 'Hesabınız doğrulandı. Şimdi giriş yapabilirsiniz.'
                    : <>{t('auth.verificationSent')} <span className="text-white font-bold font-sans">{email}</span> adresine gönderildi.</>
                  }
                </p>
                {!isVerified && (
                  <p className="text-yellow-500/70 text-xs font-medium mb-8 leading-relaxed">
                    E-posta gelmiyorsa <strong>spam/gereksiz</strong> klasörünü kontrol edin.
                  </p>
                )}
                <button
                  onClick={() => { setIsLogin(true); setIsRegistered(false); setIsVerified(false); }}
                  className="w-full py-5 rounded-2xl bg-white dark:bg-pearl text-deep-black font-black text-[11px] uppercase tracking-[0.2em] transition-all hover:scale-105 active:scale-95 mb-4"
                >
                  {t('auth.returnToSignIn')}
                </button>
                {!isVerified && (
                  <button
                    onClick={async () => {
                      setResendLoading(true);
                      setResendSuccess(false);
                      try {
                        await supabase.auth.resend({ type: 'signup', email });
                        setResendSuccess(true);
                      } catch (_) {}
                      finally { setResendLoading(false); }
                    }}
                    disabled={resendLoading || resendSuccess}
                    className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-white/20 font-black text-[10px] uppercase tracking-[0.2em] transition-all disabled:opacity-50"
                  >
                    {resendSuccess ? '✓ Yeniden Gönderildi' : resendLoading ? 'Gönderiliyor...' : 'Doğrulama E-postasını Tekrar Gönder'}
                  </button>
                )}
              </motion.div>
            ) : isVerified ? (
              <motion.div
                key="verified-success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-center bg-surface border border-border-adaptive rounded-[2.5rem] p-12 shadow-2xl transition-colors duration-500 font-sans"
              >
                <div className="w-20 h-20 rounded-[2rem] bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 mx-auto mb-10 shadow-lg">
                  <CheckCircle2 size={40} />
                </div>
                <h2 className="text-3xl font-display font-black text-white mb-4 italic tracking-tight transition-colors duration-500">
                  {t('auth.verifiedSuccess') || 'Account Verified'}
                </h2>
                <p className="text-muted-text text-base mb-10 leading-relaxed font-medium transition-colors duration-500">
                  {t('auth.verifiedSubtitle') || 'Your account has been successfully verified. Please sign in to continue.'}
                </p>
                <button
                  onClick={() => { setIsVerified(false); setIsLogin(true); }}
                  className="w-full py-5 rounded-2xl bg-white dark:bg-pearl text-deep-black font-black text-[11px] uppercase tracking-[0.2em] transition-all hover:scale-105 active:scale-95"
                >
                  {t('auth.signin')}
                </button>
              </motion.div>
            ) : (
              <motion.div key="auth-flow" className="font-sans">
                {/* Tab Switcher */}
                <div className="flex bg-surface rounded-2xl p-1.5 border border-border-adaptive mb-10 shadow-sm transition-colors duration-500">
                  <button
                    onClick={() => { setIsLogin(true); clearError(); setLocalError(''); }}
                    className={`flex-1 py-4 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] transition-all ${isLogin ? 'bg-indigo text-[#FFFFFF] shadow-xl shadow-indigo/20 scale-[1.02]' : 'text-muted-text hover:text-white'
                      }`}
                  >
                    {t('auth.signin')}
                  </button>
                  <button
                    onClick={() => { setIsLogin(false); clearError(); setLocalError(''); }}
                    className={`flex-1 py-4 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] transition-all ${!isLogin ? 'bg-indigo text-[#FFFFFF] shadow-xl shadow-indigo/20 scale-[1.02]' : 'text-muted-text hover:text-white'
                      }`}
                  >
                    {t('auth.signup')}
                  </button>
                </div>

                {/* Social Logins - EMPHASIZED with high-contrast styles and hover glow */}
                <div className="grid grid-cols-2 gap-4 mb-10">
                  <motion.button
                    onClick={handleGoogleLogin}
                    animate={{
                      boxShadow: ["0 0 0px rgba(92,115,255,0)", "0 0 20px rgba(92,115,255,0.3)", "0 0 0px rgba(92,115,255,0)"]
                    }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl bg-white text-deep-black font-black text-[10px] uppercase tracking-widest border-2 border-transparent hover:border-indigo/50 hover:shadow-indigo/20 transition-all hover:scale-105 active:scale-95 group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-indigo/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <svg width="20" height="20" viewBox="0 0 24 24" className="group-hover:scale-110 transition-transform relative z-10">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    <span className="relative z-10">Google</span>
                  </motion.button>

                  <button className="flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl bg-white text-deep-black font-black text-[10px] uppercase tracking-widest border-2 border-transparent opacity-40 pointer-events-none transition-all relative group overflow-hidden">
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/5 z-20">
                      <span className="text-[6px] font-black text-indigo tracking-[0.2em] opacity-80 uppercase">{t('auth.premiumAccess')}</span>
                    </div>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="blur-[1.5px]">
                      <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.32 2.32-2.11 4.45-3.74 4.25z" />
                    </svg>
                    Apple
                  </button>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-6 mb-10">
                  <div className="flex-1 h-px bg-border-adaptive" />
                  <span className="text-[9px] font-black text-muted-text uppercase tracking-widest transition-colors duration-500">{t('auth.orWithEmail')}</span>
                  <div className="flex-1 h-px bg-border-adaptive" />
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  <AnimatePresence mode="wait">
                    {!isLogin && (
                      <motion.div key="name-field" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                        <label className="text-[10px] font-black text-muted-text uppercase tracking-widest mb-2.5 block ml-1">{t('auth.fullName')}</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                          className="w-full bg-surface border border-border-adaptive rounded-2xl px-6 py-5 text-white text-sm font-medium focus:border-indigo/50 focus:ring-4 focus:ring-indigo/5 outline-none transition-all placeholder:text-gray-600 shadow-sm"
                          placeholder={t('auth.fullNamePlaceholder')} required={!isLogin} />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="space-y-6">
                    <div>
                      <label className="text-[10px] font-black text-muted-text uppercase tracking-widest mb-2.5 block ml-1">{t('auth.email')}</label>
                      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-surface border border-border-adaptive rounded-2xl px-6 py-5 text-white text-sm font-medium focus:border-indigo/50 focus:ring-4 focus:ring-indigo/5 outline-none transition-all placeholder:text-gray-600 shadow-sm"
                        placeholder={t('auth.emailPlaceholder')} required />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2.5 ml-1">
                        <label className="text-[10px] font-black text-muted-text uppercase tracking-widest block font-sans">{t('auth.password')}</label>
                        {isLogin && <Link to="/forgot-password" size="sm" className="text-[9px] font-black text-indigo uppercase tracking-widest hover:underline">{t('auth.forgotPassword')}</Link>}
                      </div>
                      <div className="relative">
                        <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
                          className="w-full bg-surface border border-border-adaptive rounded-2xl px-6 py-5 pr-14 text-white text-sm font-medium focus:border-indigo/50 focus:ring-4 focus:ring-indigo/5 outline-none transition-all placeholder:text-gray-600 shadow-sm"
                          placeholder="••••••••" required minLength={6} />
                        <button type="button" onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-text hover:text-white transition-colors">
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    {!isLogin && (
                      <motion.div key="confirm-field" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                        <label className="text-[10px] font-black text-muted-text uppercase tracking-widest mb-2.5 block ml-1">{t('auth.confirmPassword')}</label>
                        <input type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full bg-surface border border-border-adaptive rounded-2xl px-6 py-5 text-white text-sm font-medium focus:border-indigo/50 focus:ring-4 focus:ring-indigo/5 outline-none transition-all placeholder:text-gray-600 shadow-sm"
                          placeholder="••••••••" required={!isLogin} />
                        {password && (
                          <div className="flex gap-4 mt-4 ml-1">
                            {passwordChecks.map((check, i) => (
                              <div key={i} className="flex items-center gap-1.5">
                                <CheckCircle2 size={12} className={check.valid ? 'text-green-500' : 'text-gray-700'} />
                                <span className={`text-[10px] font-black tracking-tighter uppercase ${check.valid ? 'text-green-400' : 'text-gray-600'}`}>{check.label}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {displayError && (
                    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                      className="p-5 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-500 font-sans"
                    >
                      <AlertCircle size={18} className="shrink-0" />
                      <span className="text-sm font-medium">{displayError}</span>
                    </motion.div>
                  )}

                  <button type="submit" disabled={loading}
                    className="w-full py-6 rounded-2xl bg-indigo text-[#FFFFFF] font-black text-[11px] uppercase tracking-[0.3em] transition-all hover:shadow-2xl hover:shadow-indigo/30 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed group mt-4 shadow-xl"
                  >
                    <span>{loading ? t('common.loading') : (isLogin ? t('auth.signinSubmit') : t('auth.signupSubmit'))}</span>
                    {!loading && <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform" />}
                  </button>
                </form>

                <div className="mt-10 text-center">
                  <button onClick={switchMode} className="text-xs font-black uppercase tracking-widest text-muted-text hover:text-white transition-colors">
                    {isLogin ? t('auth.noAccount') : t('auth.alreadyMember')}
                    <span className="text-indigo underline underline-offset-4 decoration-2">{isLogin ? t('auth.signup') : t('auth.signin')}</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="mt-10 text-[9px] text-gray-600 font-bold text-center leading-relaxed tracking-widest uppercase">
            {t('auth.legalHintPart1')} <span className="text-gray-400 underline cursor-pointer">{t('auth.terms')}</span> {t('auth.legalHintPart2')} <span className="text-gray-400 underline cursor-pointer">{t('auth.privacy')}</span> {t('auth.legalHintPart3')}
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthPage;
