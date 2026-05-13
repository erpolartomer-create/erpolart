import { ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ScrollReveal from '../ScrollReveal';
import { useTranslation } from 'react-i18next';

const SaaSShowcase = () => {
  const { t } = useTranslation();

  const projects = [
    { 
      key: 'contractoros', 
      image: '/SaaS-desktop.webp', 
      mobileImage: '/SaaS-mobile.webp',
      accent: 'violet',
      previewUrl: 'https://contractor-os.erpolart.com/'
    },
    { 
      key: 'brandpulse', 
      image: '/saas/SaaS-desktop-2.webp', 
      accent: 'amber',
      previewUrl: 'https://brand-pulse-ai.erpolart.com/'
    },
    { 
      key: 'project2', 
      image: '/saas/SaaS-dektop-3.webp', 
      accent: 'cyan',
      previewUrl: 'https://reseva-ai.erpolart-ai.workers.dev/en/dashboard'
    },
  ];

  return (
    <section className="py-16 md:py-32 relative">
      <ScrollReveal>
        <div className="text-center mb-12 md:mb-24">
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-2xl bg-cyan/5 border border-cyan/20 text-cyan text-[10px] font-black uppercase tracking-[0.3em] mb-10">
            {t('saasPage.showcase.badge')}
          </div>
          <h2 className="text-4xl md:text-[72px] font-display font-black text-white leading-[0.95] italic tracking-tighter mb-8 px-4">
            {t('saasPage.showcase.title')} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-500 via-75% to-black block py-2 pr-3">
              {t('saasPage.showcase.titleAccent')}
            </span>
          </h2>
          <p className="text-gray-400 text-xl font-medium leading-relaxed max-w-2xl mx-auto px-4">
            {t('saasPage.showcase.subtitle')}
          </p>
        </div>
      </ScrollReveal>

      <div className="space-y-32 md:space-y-48">
        {projects.map((project, idx) => (
          <ScrollReveal key={project.key} delay={idx * 0.15}>
            <div className={`group flex flex-col ${idx % 2 !== 0 ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-16 lg:gap-24`}>
              {/* Combined Mockup Area */}
              <div className="w-full lg:w-[62%] relative px-4">
                {/* Desktop/Browser Mockup */}
                <div className="relative z-10 rounded-[1.5rem] overflow-hidden border border-white/10 bg-surface shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5)] transform transition-all duration-700 group-hover:-translate-y-2">
                  {/* Realistic Browser Header */}
                  <div className="h-12 bg-white/5 border-b border-white/10 flex items-center px-4 gap-4">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                      <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                      <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                    </div>
                    <div className="flex gap-3 text-gray-500">
                      <div className="w-4 h-4 rounded bg-white/5" />
                      <div className="w-4 h-4 rounded bg-white/5" />
                    </div>
                    {/* Search Bar */}
                    <div className="flex-grow max-w-md mx-auto bg-white/5 border border-white/5 px-4 py-1.5 rounded-lg flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full border border-gray-600" />
                      <div className="h-1.5 w-32 bg-gray-600/30 rounded-full" />
                    </div>
                    <div className="flex gap-3 text-gray-500">
                      <div className="w-4 h-4 rounded bg-white/5" />
                      <div className="w-4 h-4 rounded bg-white/5" />
                    </div>
                  </div>
                  {/* Desktop Image */}
                  <div className="aspect-[16/10] overflow-hidden bg-gradient-to-br from-white/5 to-transparent relative">
                    <img
                      src={project.image}
                      alt={`${t(`saasPage.showcase.${project.key}.title`)} Desktop`}
                      className="w-full h-full object-cover object-top transform transition-transform duration-[5s] ease-out group-hover:scale-105"
                    />
                  </div>
                </div>

                {/* Premium Phone Mockup - Overlapping (Conditional) */}
                {project.mobileImage && (
                  <motion.div
                    initial={{ opacity: 0, x: idx % 2 === 0 ? 60 : -60, y: 40 }}
                    whileInView={{ opacity: 1, x: 0, y: 0 }}
                    transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    viewport={{ once: true }}
                    className={`absolute z-20 bottom-[-8%] ${idx % 2 === 0 ? 'right-0 md:right-[-6%]' : 'left-0 md:left-[-6%]'} w-[28%] sm:w-[24%] md:w-[24%] max-w-[180px] min-w-[100px]`}
                  >
                    {/* Phone Outer Frame (Ultra-thin Silver) */}
                    <div className="rounded-[1.6rem] sm:rounded-[2rem] md:rounded-[2.5rem] p-[1.5px] bg-gradient-to-b from-[#f8fafc] via-[#cbd5e1] to-[#64748b] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.1)] relative">
                      {/* Phone Inner Border (Ultra-thin Bezel) */}
                      <div className="rounded-[1.5rem] sm:rounded-[1.9rem] md:rounded-[2.4rem] p-[5px] bg-black overflow-hidden aspect-[9/19.5] relative">
                        {/* Notch / Dynamic Island - More Compact */}
                        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 md:w-12 h-3.5 bg-black rounded-full z-40 flex items-center justify-end px-1.5">
                           <div className="w-0.8 h-0.8 rounded-full bg-[#1a1a1a] border border-white/5" />
                        </div>

                        {/* Status Bar Icons - Scaled Down */}
                        <div className="absolute top-2.5 left-0 right-0 px-4 flex justify-between items-center z-30 pointer-events-none scale-90">
                          <div className="text-[5px] font-black text-white/90">9:41</div>
                          <div className="flex gap-0.5 items-center">
                            <div className="flex gap-0.5">
                              <div className="w-[1px] h-[3px] bg-white/90 rounded-full" />
                              <div className="w-[1px] h-[5px] bg-white/90 rounded-full" />
                            </div>
                            <div className="w-2.5 h-1.2 rounded-[1px] border border-white/30 p-[0.5px] flex justify-start">
                              <div className="w-full h-full bg-white/90 rounded-[0.2px]" />
                            </div>
                          </div>
                        </div>
                        
                        {/* Mobile Image Container */}
                        <div className="w-full h-full rounded-[1.2rem] sm:rounded-[1.6rem] md:rounded-[2rem] overflow-hidden bg-[#0a0a0a] relative group/mobile">
                          <img
                            src={project.mobileImage}
                            alt={`${t(`saasPage.showcase.${project.key}.title`)} Mobile`}
                            className="w-full h-full object-cover object-top transform transition-transform duration-[5s] ease-out group-hover:scale-110"
                          />
                          {/* Overlay to mimic screen glass - Softened */}
                          <div className="absolute inset-0 bg-gradient-to-tr from-white/2 via-transparent to-white/5 pointer-events-none" />
                        </div>

                        {/* Bottom Home Indicator */}
                        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-white/20 rounded-full z-30" />
                      </div>

                      {/* Side Buttons - Even More Subtle */}
                      <div className="absolute left-[-1px] top-16 w-[1.5px] h-5 bg-[#94a3b8]/50 rounded-l-full" />
                      <div className="absolute left-[-1px] top-22 w-[1.5px] h-8 bg-[#94a3b8]/50 rounded-l-full" />
                      <div className="absolute right-[-1px] top-18 w-[1.5px] h-10 bg-[#94a3b8]/50 rounded-r-full" />
                    </div>
                  </motion.div>
                )}

                {/* Ambient Glows */}
                <div className={`absolute -bottom-10 left-1/2 -translate-x-1/2 w-[80%] h-32 bg-${project.accent}/20 blur-[100px] rounded-full -z-10 opacity-50 group-hover:opacity-100 transition-opacity duration-1000`} />
                <div className={`absolute top-0 ${idx % 2 === 0 ? 'right-0' : 'left-0'} w-40 h-40 bg-${project.accent}/10 blur-[60px] rounded-full -z-10`} />
              </div>

              {/* Info */}
              <div className="w-full lg:w-[40%] space-y-8">
                <motion.div
                  initial={{ opacity: 0, x: idx % 2 !== 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-${project.accent}/5 border border-${project.accent}/20 text-${project.accent} text-[9px] font-black uppercase tracking-[0.3em] mb-6`}>
                    {t(`saasPage.showcase.${project.key}.stack`)}
                  </div>
                  
                  <h3 className="text-4xl md:text-6xl font-display font-black text-white italic tracking-tighter mb-6 leading-none">
                    {t(`saasPage.showcase.${project.key}.title`)}
                  </h3>
                  
                  <p className="text-gray-400 text-lg md:text-xl leading-relaxed font-medium mb-10 opacity-80">
                    {t(`saasPage.showcase.${project.key}.desc`)}
                  </p>

                  <div className="flex flex-wrap gap-6 items-center">
                    <a 
                      href={project.previewUrl || '#'} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="group/btn relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-white text-deep-black font-black uppercase tracking-[0.2em] text-[11px] overflow-hidden hover:scale-105 transition-all shadow-xl shadow-white/10"
                    >
                      <span className="relative z-10">Live Preview</span>
                      <ArrowUpRight size={16} className="relative z-10 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                    </a>
                    
                    <Link 
                      to={`/saas/case-study/${project.key}`}
                      className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-surface border border-white/10 text-gray-400 hover:text-white hover:border-white/30 font-black uppercase tracking-[0.2em] text-[11px] transition-all"
                    >
                      Case Study
                    </Link>
                  </div>
                </motion.div>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
};

export default SaaSShowcase;
