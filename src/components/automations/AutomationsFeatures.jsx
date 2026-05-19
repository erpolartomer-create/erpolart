import React from 'react';
import { Bot, Cpu, Workflow, Database, FileText, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';
import ScrollReveal from '../ScrollReveal';
import { useTranslation } from 'react-i18next';

const stages = [
  {
    id: 'input',
    label: 'INPUT',
    stageColor: 'text-slate-400',
    stageBg: 'bg-slate-500/8',
    stageBorder: 'border-slate-500/20',
    features: [
      {
        icon: Database,
        key: 'data',
        iconBg: 'bg-slate-500/10',
        iconBorder: 'border-slate-500/25',
        iconColor: 'text-slate-400',
        cardHoverBorder: 'hover:border-slate-500/25',
        hoverGlow: 'bg-slate-400/5',
        barColor: 'bg-slate-400/50',
        barHover: 'group-hover:w-14',
      },
      {
        icon: FileText,
        key: 'document',
        iconBg: 'bg-slate-500/10',
        iconBorder: 'border-slate-500/25',
        iconColor: 'text-slate-400',
        cardHoverBorder: 'hover:border-slate-500/25',
        hoverGlow: 'bg-slate-400/5',
        barColor: 'bg-slate-400/50',
        barHover: 'group-hover:w-14',
      },
    ],
  },
  {
    id: 'intelligence',
    label: 'INTELLIGENCE',
    stageColor: 'text-emerald-400',
    stageBg: 'bg-emerald-400/8',
    stageBorder: 'border-emerald-400/20',
    features: [
      {
        icon: Bot,
        key: 'chatbot',
        iconBg: 'bg-emerald-400/10',
        iconBorder: 'border-emerald-400/30',
        iconColor: 'text-emerald-400',
        cardHoverBorder: 'hover:border-emerald-400/25',
        hoverGlow: 'bg-emerald-400/5',
        barColor: 'bg-emerald-400/50',
        barHover: 'group-hover:w-14',
      },
      {
        icon: Cpu,
        key: 'agents',
        iconBg: 'bg-emerald-400/10',
        iconBorder: 'border-emerald-400/30',
        iconColor: 'text-emerald-400',
        cardHoverBorder: 'hover:border-emerald-400/25',
        hoverGlow: 'bg-emerald-400/5',
        barColor: 'bg-emerald-400/50',
        barHover: 'group-hover:w-14',
      },
    ],
  },
  {
    id: 'output',
    label: 'OUTPUT',
    stageColor: 'text-slate-400',
    stageBg: 'bg-slate-500/8',
    stageBorder: 'border-slate-500/20',
    features: [
      {
        icon: Workflow,
        key: 'automation',
        iconBg: 'bg-slate-500/10',
        iconBorder: 'border-slate-500/25',
        iconColor: 'text-slate-400',
        cardHoverBorder: 'hover:border-slate-500/25',
        hoverGlow: 'bg-slate-400/5',
        barColor: 'bg-slate-400/50',
        barHover: 'group-hover:w-14',
      },
      {
        icon: BarChart3,
        key: 'reporting',
        iconBg: 'bg-slate-500/10',
        iconBorder: 'border-slate-500/25',
        iconColor: 'text-slate-400',
        cardHoverBorder: 'hover:border-slate-500/25',
        hoverGlow: 'bg-slate-400/5',
        barColor: 'bg-slate-400/50',
        barHover: 'group-hover:w-14',
      },
    ],
  },
];

const Arrow = ({ vertical }) =>
  vertical ? (
    <div className="flex justify-center py-2">
      <svg width="16" height="28" viewBox="0 0 16 28" fill="none" className="text-white/15">
        <path d="M8 0V22M8 22L2 16M8 22L14 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center gap-2 pt-16">
      <svg width="28" height="16" viewBox="0 0 28 16" fill="none" className="text-white/15">
        <path d="M0 8H22M22 8L16 2M22 8L16 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <div className="w-px h-16 bg-gradient-to-b from-white/8 to-transparent" />
    </div>
  );

const AutomationsFeatures = () => {
  const { t } = useTranslation();

  return (
    <section id="automations-features" className="pt-12 pb-24 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-emerald-500/4 rounded-full blur-[200px] pointer-events-none" />

      <ScrollReveal>
        <div className="text-center mb-16 md:mb-24">
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] mb-10">
            {t('automationsPage.features.badge')}
          </div>
          <h2 className="text-4xl md:text-[72px] font-display font-black text-white leading-[0.9] italic tracking-tighter mb-6 px-4">
            {t('automationsPage.features.title')}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-400 to-cyan pr-3">
              {t('automationsPage.features.titleAccent')}
            </span>
          </h2>
          <p className="text-gray-400 text-sm md:text-base font-medium leading-relaxed max-w-2xl mx-auto px-4">
            {t('automationsPage.features.subtitle')}
          </p>
        </div>
      </ScrollReveal>

      {/* Desktop: 3 stage columns with arrows */}
      <div className="hidden lg:grid grid-cols-[1fr_48px_1fr_48px_1fr] gap-0 items-start relative z-10">
        {stages.map((stage, sIdx) => (
          <React.Fragment key={stage.id}>
            <div className="flex flex-col gap-4">
              {/* Stage header */}
              <ScrollReveal delay={sIdx * 0.1}>
                <div className={`inline-flex items-center gap-2.5 px-4 py-2 rounded-xl ${stage.stageBg} border ${stage.stageBorder} mb-2`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${stage.stageColor} bg-current`} />
                  <span className={`text-[9px] font-black uppercase tracking-[0.4em] ${stage.stageColor}`}>
                    {`0${sIdx + 1} — ${stage.label}`}
                  </span>
                </div>
              </ScrollReveal>

              {/* Feature cards */}
              {stage.features.map((feat, fIdx) => (
                <ScrollReveal key={feat.key} delay={sIdx * 0.1 + fIdx * 0.08}>
                  <motion.div
                    whileHover={{ y: -4, transition: { duration: 0.3 } }}
                    className={`group relative p-7 rounded-[1.5rem] bg-surface/30 border border-white/6 ${feat.cardHoverBorder} transition-all duration-400 overflow-hidden flex flex-col h-full`}
                  >
                    <div className={`absolute inset-0 ${feat.hoverGlow} opacity-0 group-hover:opacity-100 transition-opacity duration-600 pointer-events-none`} />
                    <div className={`w-11 h-11 rounded-xl ${feat.iconBg} border ${feat.iconBorder} flex items-center justify-center ${feat.iconColor} mb-6 group-hover:scale-110 transition-transform duration-300 relative z-10 shrink-0`}>
                      <feat.icon size={20} strokeWidth={1.8} />
                    </div>
                    <h3 className="text-base font-black text-white mb-2.5 tracking-tight relative z-10">
                      {t(`automationsPage.features.${feat.key}.title`)}
                    </h3>
                    <div className={`h-[1.5px] w-8 ${feat.barColor} mb-3 ${feat.barHover} transition-all duration-500 rounded-full relative z-10`} />
                    <p className="text-gray-600 text-xs leading-relaxed font-medium group-hover:text-gray-400 transition-colors duration-300 relative z-10">
                      {t(`automationsPage.features.${feat.key}.desc`)}
                    </p>
                  </motion.div>
                </ScrollReveal>
              ))}
            </div>

            {sIdx < stages.length - 1 && (
              <div>
                <Arrow vertical={false} />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Mobile: vertical with downward arrows */}
      <div className="lg:hidden space-y-6 relative z-10">
        {stages.map((stage, sIdx) => (
          <div key={stage.id}>
            <div className={`inline-flex items-center gap-2.5 px-4 py-2 rounded-xl ${stage.stageBg} border ${stage.stageBorder} mb-4`}>
              <span className={`text-[9px] font-black uppercase tracking-[0.4em] ${stage.stageColor}`}>
                {`0${sIdx + 1} — ${stage.label}`}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {stage.features.map((feat) => (
                <div key={feat.key} className={`group relative p-6 rounded-[1.5rem] bg-surface/30 border border-white/6 transition-all duration-300 overflow-hidden`}>
                  <div className={`w-10 h-10 rounded-xl ${feat.iconBg} border ${feat.iconBorder} flex items-center justify-center ${feat.iconColor} mb-5 shrink-0`}>
                    <feat.icon size={18} strokeWidth={1.8} />
                  </div>
                  <h3 className="text-sm font-black text-white mb-2">{t(`automationsPage.features.${feat.key}.title`)}</h3>
                  <div className={`h-[1.5px] w-8 ${feat.barColor} mb-2.5 rounded-full`} />
                  <p className="text-gray-600 text-xs leading-relaxed">{t(`automationsPage.features.${feat.key}.desc`)}</p>
                </div>
              ))}
            </div>
            {sIdx < stages.length - 1 && <Arrow vertical={true} />}
          </div>
        ))}
      </div>
    </section>
  );
};

export default AutomationsFeatures;
