import { ArrowUpRight, Layout, Code2, Zap, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useUIStore from '../../store/uiStore';
import Hyperspeed from '../Hyperspeed/Hyperspeed';
import { hyperspeedPresets } from '../Hyperspeed/HyperSpeedPresets';

const HeroSection = () => {
  const { t } = useTranslation();
  const theme = useUIStore((state) => state.theme);

  return (
    <section className="relative h-screen w-full flex items-center justify-center bg-deep-black transition-colors duration-500">
      {/* Three.js Background Component */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Hyperspeed effectOptions={theme === 'dark' ? hyperspeedPresets.erpolart : hyperspeedPresets.erpolartLight} />
        {/* Soft Bottom Transition & Optional Top Fog */}
        <div className={`absolute inset-0 bg-gradient-to-b ${theme === 'dark' ? 'from-deep-black/60' : 'from-deep-black/10'} via-transparent to-deep-black pointer-events-none z-10`} />
      </div>

      {/* SaaS Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(var(--grid-color)_1px,transparent_1px),linear-gradient(90deg,var(--grid-color)_1px,transparent_1px)] bg-[size:60px_60px] opacity-[0.15] pointer-events-none z-[5]" />

      {/* Floating Decorative Icons (SaaS Style) */}
      <div className="hidden xl:block absolute inset-0 pointer-events-none z-10 overflow-hidden">
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 15, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[20%] left-[15%] w-14 h-14 rounded-2xl bg-surface/10 border border-white/10 flex items-center justify-center text-violet shadow-2xl backdrop-blur-md"
        >
          <Code2 size={24} />
        </motion.div>
        <motion.div
          animate={{ y: [0, 20, 0], rotate: [0, -15, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-[25%] right-[15%] w-16 h-16 rounded-3xl bg-surface/10 border border-white/10 flex items-center justify-center text-cyan shadow-2xl backdrop-blur-md"
        >
          <Zap size={28} />
        </motion.div>
        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[30%] left-[20%] w-12 h-12 rounded-xl bg-surface/10 border border-white/10 flex items-center justify-center text-indigo shadow-2xl backdrop-blur-md"
        >
          <Sparkles size={20} />
        </motion.div>
      </div>

      <div className="container relative z-20 px-6 mx-auto flex flex-col items-center text-center mt-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="max-w-5xl"
        >
          <motion.h1
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-[2.5rem] md:text-[88px] font-display font-black text-white mb-8 leading-[0.9] tracking-tighter italic drop-shadow-2xl"
          >
            {t('hero.title1').split(' ').map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                className="inline-block mr-[0.2em]"
              >
                {word}
              </motion.span>
            ))}
            <br />
            <motion.span
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 via-violet to-indigo py-4 pl-2 pr-4"
            >
              {t('hero.title2')}
            </motion.span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="text-lg md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto font-medium opacity-80 drop-shadow-md"
          >
            {t('hero.subtitle')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            {/* PRIMARY: VIEW PROJECTS (Now Glass Effect) */}
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto relative group"
            >
              <Link to="/projects" className="relative w-full sm:w-auto rounded-2xl md:rounded-[2rem] bg-surface/20 backdrop-blur-2xl border border-white/15 px-8 md:px-12 py-4 md:py-5 flex items-center justify-center overflow-hidden transition-all duration-500 hover:border-indigo/50 hover:bg-surface/40 shadow-xl">
                {/* Tracer Scanning Lines - Indigo/Violet version */}
                <motion.div
                  className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                  initial={{ opacity: 0 }}
                >
                  <motion.div
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo to-transparent"
                  />
                  <motion.div
                    animate={{ x: ['100%', '-100%'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-violet to-transparent"
                  />
                </motion.div>

                <span className="relative z-10 text-white font-black uppercase tracking-[0.3em] text-[11px] flex items-center gap-3 drop-shadow-sm transition-colors duration-500">
                  {t('hero.viewProjects')}
                  <ArrowUpRight size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-500" />
                </span>

                {/* Inner Glow */}
                <div className="absolute inset-0 bg-radial-gradient from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              </Link>
            </motion.div>

            {/* SECONDARY: BROWSE TEMPLATES (Now Gradient Aura) */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto relative group"
            >
              <Link to="/templates" className="relative w-full sm:w-auto overflow-hidden rounded-2xl md:rounded-[2rem] bg-surface/20 backdrop-blur-2xl border border-cyan/30 px-8 md:px-12 py-4 md:py-5 flex items-center justify-center transition-all duration-500 hover:bg-cyan/10 shadow-2xl shadow-cyan-500/10 group">
                {/* Simplified Hover Overlay */}
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Subtle Kinetic Shimmer */}
                <motion.div
                  animate={{ x: ['-200%', '200%'] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-30deg] pointer-events-none"
                />

                <span className="relative z-10 text-white font-black uppercase tracking-[0.3em] text-[11px] flex items-center gap-3 transition-colors duration-500">
                  {t('hero.browseTemplates')}
                  <Layout size={18} className="group-hover:-rotate-12 transition-transform duration-500" />
                </span>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 text-white/30 flex flex-col items-center"
      >
        <span className="text-[10px] font-black uppercase tracking-[0.4em] mb-4">{t('hero.scroll')}</span>
        <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center p-1">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-1 h-2 bg-cyan rounded-full"
          />
        </div>
      </motion.div>

      {/* Master Bottom Transition Softener (Covers grid and canvas to blend into next section) */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-deep-black to-transparent pointer-events-none z-[100]" />
    </section>
  );
};

export default HeroSection;
