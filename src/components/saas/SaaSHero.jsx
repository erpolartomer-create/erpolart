import { ArrowRight, Sparkles, Cpu, Braces } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import ScrollReveal from '../ScrollReveal';

const SaaSHero = () => {
  const { t } = useTranslation();

  return (
    <section className="relative pt-24 pb-20 md:pb-24 overflow-visible">
      {/* Expansive Ambient decorative elements - Full Width */}
      <div className="absolute top-0 right-0 w-[80vw] max-w-[1000px] h-[80vw] max-h-[1000px] bg-violet/10 dark:bg-violet/15 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[70vw] max-w-[800px] h-[70vw] max-h-[800px] bg-cyan/10 dark:bg-cyan/15 rounded-full blur-[120px] translate-y-1/3 -translate-x-1/4 pointer-events-none" />

      {/* Subtle grid moved to main page wrapper */}

      <div className="relative z-10">
        <ScrollReveal>
          <div className="text-center max-w-5xl mx-auto">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-black uppercase tracking-[0.4em] mb-12"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
              </span>
              {t('saasPage.hero.badge')}
            </motion.div>

            {/* Title */}
            <h1 className="text-5xl md:text-[88px] font-display font-black text-white leading-[0.9] tracking-tighter italic mb-10 px-4">
              {t('saasPage.hero.titlePart1')} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-500 via-70% to-black block py-4 pl-1 pr-4">
                {t('saasPage.hero.titlePart2')}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-gray-400 text-sm md:text-base font-medium leading-relaxed max-w-3xl mx-auto mb-16 px-4">
              {t('saasPage.hero.subtitle')}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
              <a
                href="#saas-contact"
                className="group relative inline-flex items-center gap-4 px-12 py-6 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-pure-white font-black uppercase tracking-[0.2em] text-[11px] overflow-hidden hover:scale-105 transition-all shadow-2xl shadow-amber-500/30"
              >
                <span className="relative z-10">{t('saasPage.hero.cta')}</span>
                <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
              <a
                href="#saas-features"
                className="inline-flex items-center gap-3 px-8 py-5 rounded-2xl bg-surface border border-border-adaptive text-gray-400 hover:text-white hover:border-violet/40 font-black uppercase tracking-[0.2em] text-[11px] transition-all"
              >
                {t('saasPage.hero.secondary')}
              </a>
            </div>
          </div>
        </ScrollReveal>

        {/* Floating Decorative Elements - Tightened around text area for mobile/tablet */}
        <div className="absolute inset-0 pointer-events-none z-20">
          {/* Ornament 1 - Near Title Top-Left */}
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-32 lg:top-48 xl:top-32 left-[10%] lg:left-[14%] xl:left-20 w-8 lg:w-16 h-8 lg:h-16 rounded-lg lg:rounded-2xl bg-surface border border-white/5 flex items-center justify-center text-violet shadow-2xl xl:left-auto xl:right-auto"
          >
            <Sparkles className="w-4 lg:w-7 h-4 lg:h-7" />
          </motion.div>

          {/* Ornament 2 - Near Title Top-Right */}
          <motion.div
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute top-52 lg:top-72 right-[10%] lg:right-[14%] xl:top-48 xl:right-24 w-8 lg:w-16 h-8 lg:h-16 rounded-lg lg:rounded-2xl bg-surface border border-white/5 flex items-center justify-center text-cyan shadow-2xl xl:left-auto"
          >
            <Cpu className="w-4 lg:w-7 h-4 lg:h-7" />
          </motion.div>

          {/* Ornament 3 - Near Buttons/Subtitle Bottom-Left */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute top-[480px] lg:top-[600px] left-[15%] lg:left-[20%] xl:bottom-20 xl:left-36 xl:top-auto w-6 lg:w-14 h-6 lg:h-14 rounded-md lg:rounded-2xl bg-surface border border-white/5 flex items-center justify-center text-indigo shadow-2xl xl:right-auto"
          >
            <Braces className="w-3 lg:w-6 h-3 lg:h-6" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SaaSHero;
