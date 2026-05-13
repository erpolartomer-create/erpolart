import { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Menu, X, Sun, Moon, Globe, ChevronDown, User, LogOut, LayoutDashboard, Settings, ShoppingBag, LogIn } from 'lucide-react';

import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import useUIStore from '../store/uiStore';
import useAuthStore from '../store/authStore';

// User Dropdown Component (Moved outside to prevent re-mounting issues)
const UserDropdown = ({ user, isUserMenuOpen, setIsUserMenuOpen, userMenuRef, handleLogout, t }) => (
  <div className="relative" ref={userMenuRef}>
    <button
      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
      className="flex items-center gap-2.5 p-1 rounded-full bg-white/[0.04] border border-white/[0.08] hover:border-indigo/40 hover:bg-indigo/10 transition-all group"
    >
      <div className="w-10 h-10 rounded-full bg-indigo/20 border border-indigo/30 flex items-center justify-center text-indigo font-black text-[11px] shadow-sm relative overflow-hidden transition-transform group-hover:scale-105">
        <img
          src={user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}&backgroundColor=b6e3f4,c0aede,d1d4f9`}
          alt="User Avatar"
          className="w-full h-full object-cover relative z-10"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
        <span className="hidden relative z-10">{ (user.user_metadata?.full_name || user.email).charAt(0).toUpperCase() }</span>
      </div>
    </button>

    <AnimatePresence>
      {isUserMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="absolute right-0 mt-3 w-56 rounded-xl bg-surface/95 backdrop-blur-xl border border-border-adaptive shadow-2xl overflow-hidden z-[100]"
        >
          <div className="px-4 py-3.5 border-b border-border-adaptive bg-surface/50">
            <div className="text-sm font-bold text-white truncate">
              {user.user_metadata?.full_name || user.name || user.email?.split('@')[0]}
            </div>
            <div className="text-[10px] text-muted-text truncate mt-0.5">{user.email}</div>
          </div>

          <div className="py-1.5 font-sans">
            <Link to="/dashboard" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-muted-text hover:text-white hover:bg-indigo/5 transition-colors">
              <LayoutDashboard size={15} /> Dashboard
            </Link>
            <Link to="/my-purchases" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-muted-text hover:text-white hover:bg-indigo/5 transition-colors">
              <ShoppingBag size={15} /> {t('nav.myPurchases')}
            </Link>
            <Link to="/account" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-muted-text hover:text-white hover:bg-indigo/5 transition-colors">
              <Settings size={15} /> {t('nav.accountSettings')}
            </Link>
          </div>

          <div className="border-t border-border-adaptive py-1.5 bg-red-500/[0.02]">
            <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-500/70 hover:text-red-400 hover:bg-red-500/5 transition-colors w-full text-left">
              <LogOut size={15} /> {t('nav.logout')}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const langMenuRef = useRef(null);
  const userMenuRef = useRef(null);
  const navigate = useNavigate();

  const { t, i18n } = useTranslation();
  const theme = useUIStore((state) => state.theme);
  const toggleTheme = useUIStore((state) => state.toggleTheme);
  const { user, logout, isInitialized } = useAuthStore();
  const isActuallyAdmin = user?.email === 'hello@erpolart.com';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    const handleClickOutside = (event) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target)) {
        setIsLangMenuOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('i18nextLng', lng);
    document.documentElement.lang = lng;
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
  };

  const navLinks = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.projects'), path: '/projects' },
    { name: t('nav.saas'), path: '/saas' },
    { name: t('nav.automations'), path: '/ai-automations' },
    { name: t('nav.templates'), path: '/templates' },
    { name: t('nav.about'), path: '/about' },
    { name: t('nav.contact'), path: '/contact' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 w-full z-[1000] transition-all duration-300 ${isScrolled ? 'backdrop-blur-md bg-surface/80 border-b border-white/5 py-3' : 'bg-transparent py-5'
          }`}
      >
        <div className="container mx-auto px-4 lg:px-6 xl:px-12 flex justify-between items-center">
          <NavLink to="/" className="z-[1100] relative">
            <img src={theme === 'dark' ? "/logo-beyaz.png" : "/logo.png"} alt="ErpolArt Logo" className="h-8 object-contain transition-opacity" />
          </NavLink>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center space-x-3 xl:space-x-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `text-[12px] xl:text-sm tracking-wide font-medium transition-colors duration-300 relative ${isActive ? 'text-white' : 'text-muted-text hover:text-white'
                  }`
                }
              >
                {({ isActive }) => {
                  const getIndicatorClass = (path) => {
                    switch (path) {
                      case '/saas':
                        return 'bg-gradient-to-r from-yellow-400 to-amber-500 shadow-[0_0_8px_rgba(251,191,36,0.6)]';
                      case '/projects':
                        return 'bg-gradient-to-r from-cyan-400 to-emerald-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]';
                      case '/templates':
                        return 'bg-gradient-to-r from-slate-400 to-gray-500 shadow-[0_0_8px_rgba(148,163,184,0.6)]';
                      case '/':
                        return 'bg-gradient-to-r from-indigo-400 to-purple-500 shadow-[0_0_8px_rgba(129,140,248,0.6)]';
                      case '/about':
                        return 'bg-gradient-to-r from-pink-400 to-rose-500 shadow-[0_0_8px_rgba(244,114,182,0.6)]';
                      case '/ai-automations':
                        return 'bg-gradient-to-r from-emerald-400 to-teal-500 shadow-[0_0_8px_rgba(52,211,153,0.6)]';
                      case '/contact':
                        return 'bg-gradient-to-r from-blue-400 to-indigo-500 shadow-[0_0_8px_rgba(96,165,250,0.6)]';
                      default:
                        return 'bg-cyan shadow-[0_0_8px_rgba(6,182,212,0.6)]';
                    }
                  };

                  return (
                    <>
                      {link.name}
                      {isActive && (
                        <motion.div
                          layoutId="navbar-indicator"
                          className={`absolute -bottom-1 left-0 w-full h-0.5 rounded-full blur-[0.5px] ${getIndicatorClass(link.path)}`}
                          initial={false}
                          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        />
                      )}
                    </>
                  );
                }}
              </NavLink>
            ))}

            <div className="flex items-center space-x-2 xl:space-x-4 border-l border-border-adaptive lg:pl-2 xl:pl-4 lg:ml-2 xl:ml-4">
              <button onClick={toggleTheme} aria-label={theme === 'dark' ? 'Açık temaya geç' : 'Koyu temaya geç'} className="text-muted-text hover:text-white transition-colors">
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              <div className="relative" ref={langMenuRef}>
                <button onClick={() => setIsLangMenuOpen(!isLangMenuOpen)} className="flex items-center gap-1.5 text-xs font-bold text-muted-text hover:text-white transition-colors uppercase px-3 py-1.5 rounded-lg border border-transparent hover:border-border-adaptive hover:bg-surface/50">
                  <Globe size={14} /> {i18n.language || 'en'} <ChevronDown size={14} className={`transition-transform duration-300 ${isLangMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {isLangMenuOpen && (
                    <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} transition={{ duration: 0.2 }} className="absolute right-0 mt-3 w-40 rounded-xl bg-surface/95 backdrop-blur-xl border border-border-adaptive shadow-2xl overflow-hidden z-50">
                      <div className="py-1">
                        {[{ code: 'en', label: 'English' }, { code: 'tr', label: 'Türkçe' }, { code: 'de', label: 'Deutsch' }].map((lang) => (
                          <button key={lang.code} onClick={() => { changeLanguage(lang.code); setIsLangMenuOpen(false); }} className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors flex items-center justify-between ${i18n.language === lang.code ? 'bg-cyan/10 text-cyan' : 'text-muted-text hover:bg-white/5 hover:text-white'}`}>
                            {lang.label} <span className="text-[10px] uppercase font-bold opacity-60">{lang.code}</span>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {!isInitialized ? (
              <div className="w-10 h-10 rounded-full bg-white/5 animate-pulse ml-4" />
            ) : (user && !isActuallyAdmin) ? (
              <UserDropdown
                user={user}
                isUserMenuOpen={isUserMenuOpen}
                setIsUserMenuOpen={setIsUserMenuOpen}
                userMenuRef={userMenuRef}
                handleLogout={handleLogout}
                t={t}
              />
            ) : (
              <Link to="/auth" className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-deep-black font-semibold text-sm hover:bg-indigo hover:text-pure-white transition-all shadow-sm ml-4">
                <LogIn size={15} /> {t('nav.signIn') || 'Sign In'}
              </Link>
            )}
          </nav>

          {/* Mobile Actions (Theme, Burger) */}
          <div className="lg:hidden flex items-center space-x-3 z-[1100]">
            <button onClick={toggleTheme} aria-label={theme === 'dark' ? 'Açık temaya geç' : 'Koyu temaya geç'} className="p-2 text-white/80 hover:text-white transition-colors">
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {(user && !isActuallyAdmin) ? (
              <UserDropdown
                user={user}
                isUserMenuOpen={isUserMenuOpen}
                setIsUserMenuOpen={setIsUserMenuOpen}
                userMenuRef={userMenuRef}
                handleLogout={handleLogout}
                t={t}
              />
            ) : (
              <Link to="/auth" className="p-2 text-white/80 hover:text-white transition-colors">
                <User size={20} />
              </Link>
            )}

            <button aria-label={isMobileMenuOpen ? 'Menüyü kapat' : 'Menüyü aç'} className="p-2 text-white relative" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Nav Overlay - Moved outside header for better stacking context */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-deep-black z-[9999] flex flex-col pt-6 overflow-y-auto pb-12"
          >
            {/* Internal Header for Mobile Overlay */}
            <div className="flex justify-between items-center px-6 mb-12">
              <NavLink to="/" onClick={() => setIsMobileMenuOpen(false)}>
                <img src={theme === 'dark' ? "/logo-beyaz.png" : "/logo.png"} alt="ErpolArt Logo" className="h-6 object-contain" />
              </NavLink>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-white/80 hover:text-white transition-colors"
                aria-label="Close Menu"
              >
                <X size={28} />
              </button>
            </div>

            <div className="flex flex-col items-center space-y-6 w-full px-6">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `text-3xl font-display font-black tracking-tight transition-colors duration-300 ${isActive ? 'text-indigo' : 'text-white hover:text-indigo'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}

              <div className="w-12 h-0.5 bg-white/10 my-4" />

              <div className="flex flex-col items-center space-y-4">
                <div className="flex items-center space-x-4">
                  {['en', 'tr', 'de'].map((lang) => (
                    <button
                      key={lang}
                      onClick={() => { changeLanguage(lang); setIsMobileMenuOpen(false); }}
                      className={`text-xs font-bold uppercase px-3 py-1.5 rounded-lg border transition-all ${i18n.language === lang
                          ? 'border-cyan bg-cyan/10 text-cyan'
                          : 'border-white/10 text-white/40 hover:text-white'
                        }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>

                {(user && !isActuallyAdmin) ? (
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-2 px-8 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-sm"
                  >
                    <LogOut size={16} /> {t('nav.logout') || 'Sign Out'}
                  </button>
                ) : (
                  <Link
                    to="/auth"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-10 py-4 rounded-2xl bg-white text-deep-black font-black text-sm uppercase tracking-widest"
                  >
                    {t('nav.signIn') || 'Sign In'}
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
