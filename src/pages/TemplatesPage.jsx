import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import TransparencyBanner from '../components/projects/TransparencyBanner';
import TemplateProcess from '../components/templates/TemplateProcess';
import TemplateGrid from '../components/templates/TemplateGrid';
import { motion } from 'framer-motion';
import { Layout, Zap, Sparkles } from 'lucide-react';

const TemplatesPage = () => {
  const { t } = useTranslation();

  return (
    <div className="pt-24 pb-24 min-h-screen bg-deep-black relative overflow-hidden transition-colors duration-500">
      <Helmet>
        <title>Premium Şablonlar - ErpolArt</title>
        <meta name="description" content="Yüksek kaliteli, modern ve özelleştirilebilir premium web şablonları." />
        <link rel="canonical" href="https://erpolart.com/templates" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="ErpolArt" />
        <meta property="og:title" content="Premium Şablonlar - ErpolArt" />
        <meta property="og:description" content="Yüksek kaliteli, modern ve özelleştirilebilir premium web şablonları." />
        <meta property="og:url" content="https://erpolart.com/templates" />
        <meta property="og:image" content="https://erpolart.com/og-image.webp" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Premium Şablonlar - ErpolArt" />
        <meta name="twitter:description" content="Yüksek kaliteli, modern ve özelleştirilebilir premium web şablonları." />
        <meta name="twitter:image" content="https://erpolart.com/og-image.webp" />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: 'Premium Web Templates by ErpolArt',
          description: 'High-quality, modern, and customizable premium web templates. Each template sold exclusively once — guaranteed unique digital identity.',
          url: 'https://erpolart.com/templates',
          provider: { '@type': 'Organization', name: 'ErpolArt', url: 'https://erpolart.com' },
        })}</script>
      </Helmet>
      {/* SaaS-Style Background System */}
      <div className="absolute inset-0 bg-[linear-gradient(var(--grid-color)_1px,transparent_1px),linear-gradient(90deg,var(--grid-color)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      {/* Expansive Ambient decorative elements */}
      <div className="absolute top-0 left-0 w-[80vw] max-w-[1000px] h-[80vw] max-h-[1000px] bg-violet/10 dark:bg-violet/15 rounded-full blur-[150px] -translate-y-1/2 -translate-x-1/4 pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-[70vw] max-w-[800px] h-[70vw] max-h-[800px] bg-cyan/10 dark:bg-cyan/15 rounded-full blur-[120px] translate-x-1/4 pointer-events-none" />

      <div className="container mx-auto px-6 lg:px-12 relative z-10 pt-10">
        <div className="max-w-5xl mb-16 text-center mx-auto transition-all duration-700 relative">
          {/* Floating Decorative Icons (SaaS Style) */}
          <div className="hidden xl:block">
            <motion.div
              animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-12 -left-20 w-12 h-12 rounded-xl bg-surface border border-white/5 flex items-center justify-center text-amber-500 shadow-2xl backdrop-blur-sm"
            >
              <Layout size={20} />
            </motion.div>
            <motion.div
              animate={{ y: [0, 15, 0], rotate: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute top-10 -right-24 w-14 h-14 rounded-2xl bg-surface border border-white/5 flex items-center justify-center text-white shadow-2xl backdrop-blur-sm"
            >
              <Zap size={24} />
            </motion.div>
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              className="absolute -bottom-8 -left-12 w-10 h-10 rounded-lg bg-surface border border-white/5 flex items-center justify-center text-slate-200 shadow-2xl backdrop-blur-sm"
            >
              <Sparkles size={18} />
            </motion.div>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-black uppercase tracking-[0.3em] mb-8">
            {t('templatesPage.catalog')}
          </div>
          <h1 className="text-5xl md:text-[88px] font-display font-black text-white mb-8 tracking-tighter italic leading-[0.9] transition-colors duration-500">
            {t('templatesPage.titlePart1')} <br />
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-slate-200 via-white to-slate-400 p-2">{t('templatesPage.titlePart2')}</span>
          </h1>
          <p className="text-[18px] text-gray-400 font-medium leading-relaxed max-w-3xl mx-auto opacity-70">
            {t('templatesPage.subtitle')}
          </p>
        </div>

        <TransparencyBanner />
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent mb-16" />
        <TemplateGrid />
      </div>
    </div>
  );
};

export default TemplatesPage;

