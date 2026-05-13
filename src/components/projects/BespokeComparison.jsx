import { motion } from 'framer-motion';
import { Check, X, Sparkles, ShieldOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ScrollReveal from '../ScrollReveal';

const BespokeComparison = () => {
   const { t } = useTranslation();

   const features = [
      {
         labelKey: 'projectsPage.customServices.comparison.archTitle',
         bespokeKey: 'projectsPage.customServices.comparison.archBespoke',
         templateKey: 'projectsPage.customServices.comparison.archTemplate',
      },
      {
         labelKey: 'projectsPage.customServices.comparison.singTitle',
         bespokeKey: 'projectsPage.customServices.comparison.singBespoke',
         templateKey: 'projectsPage.customServices.comparison.singTemplate',
      },
      {
         labelKey: 'projectsPage.customServices.comparison.perfTitle',
         bespokeKey: 'projectsPage.customServices.comparison.perfBespoke',
         templateKey: 'projectsPage.customServices.comparison.perfTemplate',
      },
      {
         labelKey: 'projectsPage.customServices.comparison.seoTitle',
         bespokeKey: 'projectsPage.customServices.comparison.seoBespoke',
         templateKey: 'projectsPage.customServices.comparison.seoTemplate',
      },
      {
         labelKey: 'projectsPage.customServices.comparison.ctrlTitle',
         bespokeKey: 'projectsPage.customServices.comparison.ctrlBespoke',
         templateKey: 'projectsPage.customServices.comparison.ctrlTemplate',
      },
   ];

   return (
      <section className="pt-8 pb-24 md:pt-12 md:pb-32 relative">
         <div className="max-w-5xl mx-auto px-6 relative">

            {/* Ambient Glows */}
            <div className="absolute -top-32 left-1/2 md:-left-32 -translate-x-1/2 md:translate-x-0 w-[90vw] md:w-[600px] h-[90vw] md:h-[600px] bg-indigo/20 md:bg-indigo/30 rounded-full blur-[100px] md:blur-[140px] pointer-events-none opacity-60 animate-pulse" />
            <div className="absolute -bottom-32 right-1/2 md:-right-32 translate-x-1/2 md:translate-x-0 w-[80vw] md:w-[500px] h-[80vw] md:h-[500px] bg-cyan/20 md:bg-cyan/30 rounded-full blur-[80px] md:blur-[120px] pointer-events-none opacity-50" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] md:w-[600px] h-[100vw] md:h-[600px] bg-violet/10 md:bg-violet/15 rounded-full blur-[120px] md:blur-[160px] pointer-events-none opacity-30" />

            {/* Floating Particles */}
            {[...Array(8)].map((_, i) => (
               <motion.div
                  key={i}
                  animate={{ y: [0, -60, 0], x: [0, 30, 0], opacity: [0.2, 0.7, 0.2] }}
                  transition={{ duration: 6 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
                  className="absolute w-1 h-1 bg-white rounded-full hidden md:block z-20 shadow-[0_0_10px_white]"
                  style={{ top: `${10 + (i * 12)}%`, left: `${5 + (i * 10)}%` }}
               />
            ))}

            {/* Header */}
            <ScrollReveal className="text-center mb-8 md:mb-20 relative z-20">
               <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan/10 border border-cyan/20 text-cyan text-[10px] font-black uppercase tracking-[0.3em] mb-8">
                  <Sparkles size={12} />
                  {t('projectsPage.customServices.difference')}
               </div>
               <h2 className="text-4xl md:text-[72px] font-display font-black text-white tracking-tighter italic leading-[0.9]">
                  {t('projectsPage.customServices.whyUs')}
               </h2>
            </ScrollReveal>

            {/* Comparison Grid */}
            <div className="relative grid grid-cols-1 md:grid-cols-[1fr_72px_1fr] items-stretch gap-4 md:gap-0 relative z-10">

               {/* ErpolArt Card */}
               <ScrollReveal direction="right">
                  <motion.div
                     whileHover={{ y: -4 }}
                     transition={{ duration: 0.3, ease: 'easeOut' }}
                     className="h-full rounded-[2rem] border border-cyan/25 bg-gradient-to-br from-cyan/8 via-surface/20 to-indigo/10 backdrop-blur-xl shadow-[0_0_80px_rgba(0,179,166,0.07)] flex flex-col gap-5 p-8 md:p-10 relative overflow-hidden group"
                  >
                     {/* Top shimmer line */}
                     <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan/40 to-transparent" />
                     {/* Hover radial glow */}
                     <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                        style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(0,179,166,0.12), transparent 60%)' }} />

                     {/* Card Header */}
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-cyan/15 border border-cyan/30 flex items-center justify-center shrink-0">
                           <Sparkles size={18} className="text-cyan" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan">
                           {t('projectsPage.customServices.erpolartBespoke')}
                        </span>
                     </div>

                     {/* Feature List */}
                     <div className="flex flex-col gap-4 flex-1">
                        {features.map((f, i) => (
                           <motion.div
                              key={i}
                              initial={{ opacity: 0, x: -12 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.07, duration: 0.4 }}
                              className="flex items-start gap-3"
                           >
                              <div className="shrink-0 w-5 h-5 rounded-full bg-cyan/20 border border-cyan/35 flex items-center justify-center mt-0.5">
                                 <Check size={10} className="text-cyan" />
                              </div>
                              <div className="min-w-0">
                                 <div className="text-[9px] font-black uppercase tracking-[0.25em] text-gray-500 mb-0.5">
                                    {t(f.labelKey)}
                                 </div>
                                 <div className="text-sm font-bold text-white leading-snug">
                                    {t(f.bespokeKey)}
                                 </div>
                              </div>
                           </motion.div>
                        ))}
                     </div>

                     {/* Bottom accent */}
                     <div className="h-px w-0 group-hover:w-full transition-all duration-700 bg-cyan/30" />
                  </motion.div>
               </ScrollReveal>

               {/* VS Divider — desktop */}
               <div className="hidden md:flex flex-col items-center justify-center px-2">
                  <div className="flex-1 w-px bg-gradient-to-b from-transparent via-white/8 to-transparent" />
                  <div className="w-12 h-12 rounded-full bg-deep-black border border-white/10 flex items-center justify-center shadow-xl my-4 shrink-0">
                     <span className="text-[10px] font-black uppercase tracking-wider text-gray-600">VS</span>
                  </div>
                  <div className="flex-1 w-px bg-gradient-to-b from-transparent via-white/8 to-transparent" />
               </div>

               {/* VS Divider — mobile */}
               <div className="flex md:hidden items-center gap-4">
                  <div className="flex-1 h-px bg-white/5" />
                  <span className="text-[10px] font-black uppercase tracking-wider text-gray-600 px-3 py-1.5 rounded-full border border-white/8">
                     VS
                  </span>
                  <div className="flex-1 h-px bg-white/5" />
               </div>

               {/* Standard Card */}
               <ScrollReveal direction="left">
                  <motion.div
                     whileHover={{ y: -4 }}
                     transition={{ duration: 0.3, ease: 'easeOut' }}
                     className="h-full rounded-[2rem] border border-white/5 bg-surface/10 backdrop-blur-xl flex flex-col gap-5 p-8 md:p-10 relative overflow-hidden opacity-55 hover:opacity-75 transition-opacity duration-500"
                  >
                     {/* Card Header */}
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                           <ShieldOff size={18} className="text-gray-600" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600 italic">
                           {t('projectsPage.customServices.standardWeb')}
                        </span>
                     </div>

                     {/* Feature List */}
                     <div className="flex flex-col gap-4 flex-1">
                        {features.map((f, i) => (
                           <div key={i} className="flex items-start gap-3">
                              <div className="shrink-0 w-5 h-5 flex items-center justify-center mt-0.5">
                                 <X size={13} className="text-gray-700" />
                              </div>
                              <div className="min-w-0">
                                 <div className="text-[9px] font-black uppercase tracking-[0.25em] text-gray-600 mb-0.5">
                                    {t(f.labelKey)}
                                 </div>
                                 <div className="text-sm text-gray-600 italic leading-snug line-through decoration-gray-700">
                                    {t(f.templateKey)}
                                 </div>
                              </div>
                           </div>
                        ))}
                     </div>
                  </motion.div>
               </ScrollReveal>

            </div>
         </div>
      </section>
   );
};

export default BespokeComparison;
