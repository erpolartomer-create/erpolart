import HeroStatement from '../components/about/HeroStatement';
import WhoWeAre from '../components/about/WhoWeAre';
import OurApproach from '../components/about/OurApproach';
import Values from '../components/about/Values';
import OurTeam from '../components/about/OurTeam';
import TechMarquee from '../components/home/TechMarquee';
import ContactCTA from '../components/about/ContactCTA';

import { motion } from 'framer-motion';
import { Sparkles, MessageCircle, Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';

const AboutPage = () => {
  const { t } = useTranslation();

  return (
    <div className="pt-24 pb-24 min-h-screen bg-deep-black relative overflow-hidden transition-colors duration-500">
      <Helmet>
        <title>{t('aboutPage.seo.title')}</title>
        <meta name="description" content={t('aboutPage.seo.description')} />
        <link rel="canonical" href="https://erpolart.com/about" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="ErpolArt" />
        <meta property="og:title" content={t('aboutPage.seo.title')} />
        <meta property="og:description" content={t('aboutPage.seo.description')} />
        <meta property="og:url" content="https://erpolart.com/about" />
        <meta property="og:image" content="https://erpolart.com/og-image.webp" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t('aboutPage.seo.title')} />
        <meta name="twitter:description" content={t('aboutPage.seo.description')} />
        <meta name="twitter:image" content="https://erpolart.com/og-image.webp" />
      </Helmet>
      {/* SaaS-Style Background System */}
      <div className="absolute inset-0 bg-[linear-gradient(var(--grid-color)_1px,transparent_1px),linear-gradient(90deg,var(--grid-color)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      
      {/* Expansive Ambient decorative elements */}
      <div className="absolute top-0 left-0 w-[80vw] max-w-[1000px] h-[80vw] max-h-[1000px] bg-violet/10 dark:bg-violet/15 rounded-full blur-[150px] -translate-y-1/2 -translate-x-1/4 pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-[70vw] max-w-[800px] h-[70vw] max-h-[800px] bg-cyan/10 dark:bg-cyan/15 rounded-full blur-[120px] translate-x-1/4 pointer-events-none" />

      {/* Page-wide Floating Icons */}
      <div className="hidden xl:block absolute inset-0 pointer-events-none z-50">
        <motion.div 
          animate={{ y: [0, -15, 0], rotate: [0, 8, 0] }} 
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-40 left-10 w-12 h-12 rounded-xl bg-surface/80 border border-white/10 flex items-center justify-center text-violet shadow-2xl backdrop-blur-md"
        >
          <Sparkles size={20} />
        </motion.div>
        <motion.div 
          animate={{ y: [0, 15, 0], rotate: [0, -8, 0] }} 
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-60 right-20 w-14 h-14 rounded-2xl bg-surface/80 border border-white/10 flex items-center justify-center text-cyan shadow-2xl backdrop-blur-md"
        >
          <MessageCircle size={22} />
        </motion.div>
        <motion.div 
          animate={{ scale: [1, 1.1, 1] }} 
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-40 left-20 w-12 h-12 rounded-xl bg-surface/80 border border-white/10 flex items-center justify-center text-indigo shadow-2xl backdrop-blur-md"
        >
          <Heart size={20} />
        </motion.div>
      </div>

      <div className="relative z-10">
        <HeroStatement />
        <WhoWeAre />
        <OurApproach />
        <TechMarquee />
        <OurTeam />
        <Values />
        <ContactCTA />
      </div>
    </div>
  );
};

export default AboutPage;

