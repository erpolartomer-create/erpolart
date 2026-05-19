import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Home, Search } from 'lucide-react';

const NotFoundPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-deep-black flex items-center justify-center relative overflow-hidden">
      <Helmet>
        <title>404 — ErpolArt</title>
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      {/* Background */}
      <div className="absolute inset-0 bg-[linear-gradient(var(--grid-color)_1px,transparent_1px),linear-gradient(90deg,var(--grid-color)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] bg-violet/8 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] bg-indigo/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
        {/* Icon */}
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-surface/60 border border-white/10 text-violet mb-10 shadow-2xl backdrop-blur-md"
        >
          <Search size={32} />
        </motion.div>

        {/* 404 */}
        <h1 className="text-[120px] md:text-[180px] font-display font-black italic tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-br from-violet via-indigo to-cyan mb-4">
          404
        </h1>

        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-display font-black text-white italic tracking-tight mb-6">
          {t('notFound.title')}
        </h2>

        {/* Description */}
        <p className="text-gray-400 text-lg font-medium leading-relaxed mb-12 max-w-lg mx-auto">
          {t('notFound.desc')}
        </p>

        {/* CTA */}
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-violet hover:bg-violet/80 text-white font-black uppercase tracking-[0.2em] text-[11px] transition-all hover:scale-105 shadow-xl shadow-violet/20"
        >
          <Home size={16} />
          {t('notFound.cta')}
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
