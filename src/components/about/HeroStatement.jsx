import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const HeroStatement = () => {
  const { t } = useTranslation();

  return (
    <section className="relative py-24 md:py-32 flex items-center justify-center">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-full bg-violet/5 blur-[120px] pointer-events-none rounded-full" />
      
      <div className="container relative z-10 px-6 mx-auto text-center max-w-5xl">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="w-16 h-1 bg-gradient-to-r from-indigo to-cyan mx-auto mb-10" />
          <h1 className="text-5xl md:text-[88px] font-display font-black text-white leading-tight tracking-tighter italic mb-8 px-4 py-4">
            {t('aboutPage.hero.titlePart1')} <br className="hidden md:block" />
            <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-indigo via-violet to-cyan px-4 py-2">
               {t('aboutPage.hero.titlePart2')}
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 font-medium max-w-3xl mx-auto leading-relaxed">
            {t('aboutPage.hero.subtitle')}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroStatement;
