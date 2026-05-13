import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, MessageCircle, Code2, Rocket } from 'lucide-react';
import ScrollReveal from '../ScrollReveal';

const BespokeCTA = () => {
  const { t } = useTranslation();

  return (
    <section className="py-12 md:py-20 relative">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[800px] h-[300px] md:h-[400px] bg-indigo/10 blur-[100px] md:blur-[150px] rounded-full pointer-events-none" />

      <ScrollReveal direction="up">
        <div className="relative shadow-2xl rounded-[40px] transition-all duration-500 overflow-visible">
          <div className="relative z-10 bg-surface border border-border-adaptive rounded-[40px] p-8 md:p-20 overflow-hidden group isolate">
            
            {/* Subtle grid pattern - adaptive */}
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none" style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)',
              backgroundSize: '40px 40px',
            }} />

            <div className="flex flex-col xl:flex-row items-center justify-between gap-12 md:gap-16 relative z-10">
              <div className="max-w-2xl text-center xl:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo/10 border border-indigo/20 text-indigo text-[10px] font-black uppercase tracking-[0.3em] mb-8">
                  <Sparkles size={14} />
                  {t('projectsPage.bespoke.engineeringBadge')}
                </div>
                
                <h2 className="text-5xl md:text-6xl font-black text-white leading-[1.1] tracking-tight mb-8 transition-colors">
                  {t('projectsPage.bespoke.title') || 'Architect Your Unique Identity'}
                </h2>
                
                <p className="text-muted-text text-lg md:text-xl font-medium leading-relaxed max-w-xl mb-12 transition-colors">
                  {t('projectsPage.bespoke.subtitle') || 'We bridge high-end aesthetics with custom, AI-accelerated engineering.'}
                </p>

                <div className="flex flex-wrap items-center justify-center xl:justify-start gap-4">
                  <Link
                    to="/contact"
                    className="flex items-center gap-3 px-10 py-5 rounded-2xl bg-indigo text-[#FFFFFF] font-black text-xs uppercase tracking-[0.2em] hover:shadow-2xl hover:shadow-indigo/30 transition-all hover:scale-[1.02] active:scale-[0.98] group/btn"
                  >
                    {t('projectsPage.bespoke.cta') || 'Start Your Project'}
                    <ArrowRight size={18} className="group-hover/btn:translate-x-1.5 transition-transform" />
                  </Link>
                  
                  <Link
                    to="/about"
                    className="flex items-center gap-3 px-10 py-5 rounded-2xl bg-surface/50 border border-border-adaptive text-white font-black text-xs uppercase tracking-[0.2em] hover:bg-surface transition-all"
                  >
                    {t('projectsPage.bespoke.secondary') || 'Explore Our Process'}
                  </Link>
                </div>
              </div>

              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full xl:max-w-md">
                {[
                  { icon: MessageCircle, label: t('projectsPage.bespoke.feature1Label'), desc: t('projectsPage.bespoke.feature1Desc') },
                  { icon: Code2, label: t('projectsPage.bespoke.feature2Label'), desc: t('projectsPage.bespoke.feature2Desc') },
                  { icon: Rocket, label: t('projectsPage.bespoke.feature3Label'), desc: t('projectsPage.bespoke.feature3Desc') },
                  { icon: Sparkles, label: t('projectsPage.bespoke.feature4Label'), desc: t('projectsPage.bespoke.feature4Desc') },
                ].map((item, i) => (
                  <div key={i} className="bg-surface/30 border border-border-adaptive rounded-2xl p-6 hover:bg-surface/50 transition-all group/item shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-indigo/10 border border-indigo/20 flex items-center justify-center text-indigo mb-4 group-hover/item:scale-110 transition-transform">
                      <item.icon size={20} />
                    </div>
                    <h3 className="text-white font-bold text-xs mb-1 uppercase tracking-wider transition-colors">{item.label}</h3>
                    <p className="text-muted-text text-[10px] uppercase font-bold tracking-widest transition-colors">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Animated glow effect */}
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo/10 blur-[120px] rounded-full pointer-events-none group-hover:bg-indigo/20 transition-all duration-700" />
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
};

export default BespokeCTA;
