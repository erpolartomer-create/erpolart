import { Mail, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useUIStore from '../store/uiStore';

// Custom Brand Icons (Lucide 1.0 removed these)
const InstagramIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
);
const LinkedinIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
);
const XIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zm-1.292 19.494h2.039L6.486 3.24H4.298l13.311 17.407z"/></svg>
);
const YoutubeIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2C1 8.14 1 12 1 12s0 3.86.42 5.58a2.78 2.78 0 0 0 1.94 2c1.72.42 8.6.42 8.6.42s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2C23 15.86 23 12 23 12s0-3.86-.42-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg>
);
const FacebookIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
);
const GithubIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
);

const Footer = () => {
  const { t } = useTranslation();
  const theme = useUIStore((state) => state.theme);
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-surface border-t border-border-adaptive py-24 transition-colors duration-500 relative overflow-hidden">
      {/* SaaS-Style Background System */}
      <div className="absolute inset-0 bg-[linear-gradient(var(--grid-color)_1px,transparent_1px),linear-gradient(90deg,var(--grid-color)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-20" />

      {/* Decorative Glows */}
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo/10 blur-[150px] rounded-full -translate-x-1/2 translate-y-1/2 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-cyan/5 blur-[120px] rounded-full translate-x-1/4 -translate-y-1/4 pointer-events-none" />

      <div className="container mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">

        <div className="col-span-1 md:col-span-2 space-y-6">
          <img src={theme === 'dark' ? "/logo-beyaz.png" : "/logo.png"} alt="ErpolArt Dijital Çözümler Logosu" className="h-10 object-contain opacity-90 transition-opacity" />
          <p className="text-muted-text max-w-sm text-sm">
            {t('footer.desc')}
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-slate-50 hover:bg-indigo transition-all">
              <InstagramIcon size={18} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-slate-50 hover:bg-cyan transition-all">
              <LinkedinIcon size={18} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-slate-50 hover:bg-black transition-all">
              <XIcon size={14} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-slate-50 hover:bg-red-600 transition-all">
              <YoutubeIcon size={18} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-slate-50 hover:bg-blue-600 transition-all">
              <FacebookIcon size={18} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-slate-50 hover:bg-slate-800 transition-all">
              <GithubIcon size={18} />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-white font-medium mb-6 font-display">{t('footer.nav')}</h4>
          <ul className="space-y-4 text-sm text-muted-text">
            <li><Link to="/" className="hover:text-cyan transition-colors">{t('nav.home')}</Link></li>
            <li><Link to="/projects" className="hover:text-cyan transition-colors">{t('nav.projects')}</Link></li>
            <li><Link to="/templates" className="hover:text-cyan transition-colors">{t('nav.templates')}</Link></li>
            <li><Link to="/about" className="hover:text-cyan transition-colors">{t('nav.about')}</Link></li>
            <li><Link to="/contact" className="hover:text-cyan transition-colors">{t('nav.contact')}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-medium mb-6 font-display">{t('footer.contact')}</h4>
          <ul className="space-y-4 text-sm text-muted-text">
            <li className="text-white font-medium">FİDAN ÜNAL ERPOLAT - ERPOLART MİMARLIK</li>
            <li><a href="mailto:hello@erpolart.com" className="hover:text-cyan transition-colors">hello@erpolart.com</a></li>
            <li>Pınarlı Mah. 24096 Sk. No: 19 A, Aksu / ANTALYA</li>
            <li>VKN: 9080295761</li>
            <li>{t('footer.ready')}</li>
            <li><Link to="/contact" className="text-white border-b border-indigo inline-block mt-2 hover:text-indigo transition-colors">{t('footer.start')}</Link></li>
          </ul>
        </div>
      </div>

      <div className="container mx-auto px-6 md:px-12 mt-16 pt-8 border-t border-white/5 flex flex-col items-center md:flex-row md:justify-between gap-6 text-xs text-gray-500">
        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6">
          <p>&copy; {currentYear} ErpolArt. {t('footer.copyright')}</p>
          <p className="hidden md:block text-white/10">|</p>
          <p>{t('footer.tagline')}</p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4 md:gap-6 font-medium uppercase tracking-widest text-[9px]">
          <Link to="/mesafeli-satis-sozlesmesi" className="hover:text-cyan transition-colors">Mesafeli Satış Sözleşmesi</Link>
          <Link to="/iptal-ve-iade-kosullari" className="hover:text-cyan transition-colors">İptal ve İade</Link>
          <Link to="/gizlilik-politikasi" className="hover:text-violet transition-colors">Gizlilik Politikası</Link>
          <Link to="/kvkk-metni" className="hover:text-indigo transition-colors">KVKK</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
