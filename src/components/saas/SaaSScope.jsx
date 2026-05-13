import { motion } from 'framer-motion';
import { Check, Clock, ArrowRight, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import ScrollReveal from '../ScrollReveal';

const tiers = [
  { key: 'mvp',        featured: false },
  { key: 'growth',     featured: true  },
  { key: 'enterprise', featured: false },
];

const SaaSScope = () => {
  const { t } = useTranslation();

  return (
    <section className="py-16 md:py-28 relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-amber-500/5 blur-[160px] rounded-full" />
      </div>

      <ScrollReveal className="text-center mb-12 md:mb-16 px-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-black uppercase tracking-[0.3em] mb-8">
          <Sparkles size={11} />
          {t('saasPage.scope.badge')}
        </div>
        <h2 className="text-4xl md:text-[72px] font-display font-black italic tracking-tighter leading-[0.9] mb-4">
          <span className="text-white">{t('saasPage.scope.title')}{' '}</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-500 to-amber-600 pr-3">
            {t('saasPage.scope.titleAccent')}
          </span>
        </h2>
        <p className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
          {t('saasPage.scope.subtitle')}
        </p>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-6xl mx-auto px-6">
        {tiers.map((tier, i) => {
          const features = t(`saasPage.scope.${tier.key}.features`, { returnObjects: true });

          return (
            <ScrollReveal key={tier.key} delay={i * 0.1}>
              <div className={`relative h-full ${tier.featured ? 'pt-4' : ''}`}>
                {tier.featured && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20">
                    <div className="px-4 py-1.5 rounded-full bg-amber-500 text-black text-[9px] font-black uppercase tracking-[0.25em] shadow-lg shadow-amber-500/30 whitespace-nowrap">
                      {t(`saasPage.scope.${tier.key}.badge`)}
                    </div>
                  </div>
                )}
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className={`relative rounded-[2rem] border bg-surface/25 backdrop-blur-xl p-8 flex flex-col gap-6 group transition-all duration-500 overflow-hidden h-full ${
                    tier.featured
                      ? 'border-amber-500/30 hover:border-amber-500/50 shadow-[0_0_80px_rgba(245,158,11,0.07)]'
                      : 'border-slate-500/20 hover:border-slate-400/35'
                  }`}
                >
                  {/* Hover glow */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      background: tier.featured
                        ? 'radial-gradient(ellipse at 50% 0%, rgba(245,158,11,0.10), transparent 65%)'
                        : 'radial-gradient(ellipse at 50% 0%, rgba(148,163,184,0.06), transparent 65%)',
                    }}
                  />

                  {/* Header */}
                  <div className="relative z-10 pt-2">
                    <div className={`text-[9px] font-black uppercase tracking-[0.35em] mb-3 ${tier.featured ? 'text-amber-500' : 'text-slate-400'}`}>
                      {t(`saasPage.scope.${tier.key}.tag`)}
                    </div>
                    <h3 className="text-3xl font-display font-black italic text-white tracking-tighter leading-tight mb-2">
                      {t(`saasPage.scope.${tier.key}.title`)}
                    </h3>
                    <p className="text-gray-500 text-xs leading-relaxed">
                      {t(`saasPage.scope.${tier.key}.for`)}
                    </p>
                  </div>

                  {/* Timeline */}
                  <div className={`relative z-10 flex items-center gap-3 px-4 py-3 rounded-xl border ${
                    tier.featured ? 'bg-amber-500/8 border-amber-500/20' : 'bg-slate-500/5 border-slate-500/15'
                  }`}>
                    <Clock size={14} className={tier.featured ? 'text-amber-500' : 'text-slate-400'} />
                    <div>
                      <div className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-600">
                        {t(`saasPage.scope.${tier.key}.timelineLabel`)}
                      </div>
                      <div className={`text-sm font-black ${tier.featured ? 'text-amber-400' : 'text-slate-300'}`}>
                        {t(`saasPage.scope.${tier.key}.timeline`)}
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="relative z-10 flex flex-col gap-3 flex-1">
                    {Array.isArray(features) && features.map((feature, fi) => (
                      <div key={fi} className="flex items-start gap-2.5">
                        <div className={`shrink-0 w-4 h-4 rounded-full border flex items-center justify-center mt-0.5 ${
                          tier.featured ? 'bg-amber-500/10 border-amber-500/25' : 'bg-slate-500/8 border-slate-500/20'
                        }`}>
                          <Check size={9} className={tier.featured ? 'text-amber-400' : 'text-slate-400'} />
                        </div>
                        <span className="text-gray-400 text-xs leading-snug group-hover:text-gray-300 transition-colors">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <Link
                    to="/contact"
                    className={`relative z-10 flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-black text-[10px] uppercase tracking-[0.1em] transition-all duration-300 ${
                      tier.featured
                        ? 'bg-amber-500 text-black hover:bg-amber-400 shadow-lg shadow-amber-500/20'
                        : 'bg-slate-500/8 border border-slate-500/20 text-slate-300 hover:bg-slate-500/15 hover:text-white'
                    }`}
                  >
                    {t('saasPage.scope.cta')}
                    <ArrowRight size={13} />
                  </Link>

                  {/* Bottom shimmer */}
                  <div className={`absolute bottom-0 left-0 h-px w-0 group-hover:w-full transition-all duration-700 ${
                    tier.featured
                      ? 'bg-gradient-to-r from-transparent via-amber-500/40 to-transparent'
                      : 'bg-gradient-to-r from-transparent via-slate-400/20 to-transparent'
                  }`} />
                </motion.div>
              </div>
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
};

export default SaaSScope;
