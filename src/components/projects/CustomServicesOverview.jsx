import { motion } from 'framer-motion';
import { Layers, Palette, Terminal, Zap, ArrowRight, ShieldCheck, Check, X, MousePointer2, Cpu, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ScrollReveal from '../ScrollReveal';
import useUIStore from '../../store/uiStore';

const CustomServicesOverview = () => {
  const { t } = useTranslation();
  const theme = useUIStore((state) => state.theme);

  const comparison = [
    { feature: t('projectsPage.customServices.comparison.archTitle'), bespoke: t('projectsPage.customServices.comparison.archBespoke'), template: t('projectsPage.customServices.comparison.archTemplate') },
    { feature: t('projectsPage.customServices.comparison.singTitle'), bespoke: t('projectsPage.customServices.comparison.singBespoke'), template: t('projectsPage.customServices.comparison.singTemplate') },
    { feature: t('projectsPage.customServices.comparison.perfTitle'), bespoke: t('projectsPage.customServices.comparison.perfBespoke'), template: t('projectsPage.customServices.comparison.perfTemplate') },
    { feature: t('projectsPage.customServices.comparison.seoTitle'), bespoke: t('projectsPage.customServices.comparison.seoBespoke'), template: t('projectsPage.customServices.comparison.seoTemplate') },
    { feature: t('projectsPage.customServices.comparison.ctrlTitle'), bespoke: t('projectsPage.customServices.comparison.ctrlBespoke'), template: t('projectsPage.customServices.comparison.ctrlTemplate') }
  ];

  return (
    <section className="pt-4 md:pt-8 pb-0 relative">
      {/* Decorative Background Elements - Removed due to visual clumping */}

      <div className="container mx-auto px-6 relative z-10">

        {/* Editorial Block 1: The Core Message */}
        <div className="flex flex-col lg:flex-row items-start gap-16 lg:gap-24 mb-16">
          <ScrollReveal direction="right" className="lg:w-[48%] relative">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan/10 border border-cyan/20 text-cyan text-[10px] font-black uppercase tracking-[0.3em] mb-8">
                <ShieldCheck size={14} />
                {t('projectsPage.customServices.badge')}
              </div>

              <h2 className="text-5xl md:text-[88px] font-display font-black text-white leading-[0.85] mb-10 tracking-tighter italic">
                {t('projectsPage.customServices.title')} <br />
                <span className={`text-transparent bg-clip-text bg-gradient-to-r py-4 inline-block ${theme === 'dark'
                    ? 'from-slate-200 via-white to-slate-400'
                    : 'from-indigo via-violet-600 to-indigo-800'
                  }`}>
                  {t('projectsPage.customServices.titleAccent')}
                </span>
              </h2>

              <div className="space-y-8 text-lg md:text-xl text-gray-400 font-medium leading-relaxed max-w-xl opacity-90">
                <p>
                  {t('projectsPage.customServices.desc1')}
                </p>
                <p className="text-base text-gray-500">
                  {t('projectsPage.customServices.desc2')}
                </p>
              </div>

              <div className="flex gap-6 mt-12">
                <div className="flex flex-col">
                  <span className="text-3xl font-display font-black text-white italic tracking-tighter">0%</span>
                  <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">{t('projectsPage.customServices.readyTool')}</span>
                </div>
                <div className="w-px h-12 bg-white/10" />
                <div className="flex flex-col">
                  <span className="text-3xl font-display font-black text-white italic tracking-tighter">100%</span>
                  <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">{t('projectsPage.customServices.handmadeCode')}</span>
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="left" className="lg:w-[52%] w-full">
            <div className="relative group">
              {/* Visual Glass Frame */}
              <div className="relative rounded-[3rem] overflow-hidden border border-white/10 bg-surface/5 backdrop-blur-xl shadow-2xl p-3">
                <div className="relative aspect-square rounded-[2.5rem] overflow-hidden bg-black border border-white/5">
                  <img
                    src="https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80"
                    alt="ErpolArt Özel Yazılım Mimarisi ve Dijital Tasarım"
                    className="w-full h-full object-cover opacity-70 contrast-125 transition-transform duration-[5s] group-hover:scale-105"
                  />

                  {/* Overlay Data Points */}
                  <div className="absolute inset-0 z-20 flex flex-col p-8 md:p-10">
                    <div className="flex justify-between items-start mb-auto">
                      <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        className="px-4 py-2.5 rounded-xl bg-indigo/20 backdrop-blur-2xl border border-indigo/40 inline-flex items-center gap-2.5"
                      >
                        <Cpu size={12} className="text-indigo" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-[#FFFFFF]">Signature v1.0.4</span>
                      </motion.div>
                      <motion.div
                        initial={{ x: 20, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-2xl border border-white/20 flex items-center justify-center text-white"
                      >
                        <Globe size={16} />
                      </motion.div>
                    </div>

                    {/* Center Interactive Widget */}
                    <div className="relative mx-auto my-auto w-full max-w-[260px]">
                      <div className="absolute inset-0 bg-indigo/10 blur-[60px] rounded-full" />
                      <div className="relative p-7 rounded-[2.5rem] bg-black/60 backdrop-blur-3xl border border-white/10 flex flex-col gap-6">
                        <div className="flex items-center justify-between">
                          <div className="text-[8px] font-black uppercase tracking-widest text-gray-500">Security Architecture</div>
                          <ShieldCheck size={14} className="text-cyan" />
                        </div>
                        <div className="space-y-4">
                          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: '100%' }}
                              transition={{ duration: 1.5 }}
                              className="h-full bg-gradient-to-r from-indigo to-cyan"
                            />
                          </div>
                          <div className="flex justify-between items-center text-[10px] font-black text-[#FFFFFF] italic">
                            <span>Integrity Grade</span>
                            <span className="text-cyan">A++</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Code Snippet */}
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      className="mt-auto p-4 rounded-xl bg-black/80 font-mono text-[8px] text-indigo/80 border border-indigo/20"
                    >
                      <span className="text-cyan font-bold">const</span> signature = <span className="text-indigo">"Unique"</span>;<br />
                      <span className="text-cyan font-bold">export default</span> digital_atelier;
                    </motion.div>
                  </div>

                  {/* Scanning Line */}
                  <motion.div
                    animate={{ y: ['-100%', '200%'] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                    className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo to-transparent opacity-50 z-30"
                  />
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>

      </div>
    </section>
  );
};

export default CustomServicesOverview;
