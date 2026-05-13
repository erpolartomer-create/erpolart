import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ScrollReveal from '../ScrollReveal';
import { useTranslation } from 'react-i18next';

const useCases = [
  {
    key: 'ecommerce',
    accent: 'text-emerald-400',
    accentBg: 'bg-emerald-400/8',
    accentBorder: 'border-emerald-400/20',
    accentBorderHover: 'group-hover:border-emerald-400/40',
    glowColor: 'rgba(52,211,153,0.10)',
    nodes: [
      { emoji: '📦', label: 'New Order' },
      { emoji: '🤖', label: 'AI Route' },
      { emoji: '🏭', label: 'Fulfill' },
      { emoji: '📧', label: 'Notify' },
      { emoji: '📊', label: 'Analytics' },
    ],
    results: [
      { value: '%80', label: 'Daha Hızlı' },
      { value: '7/24', label: 'Aktif' },
      { value: '0', label: 'Manuel İş' },
    ],
  },
  {
    key: 'support',
    accent: 'text-violet',
    accentBg: 'bg-violet/8',
    accentBorder: 'border-violet/20',
    accentBorderHover: 'group-hover:border-violet/40',
    glowColor: 'rgba(139,92,246,0.10)',
    nodes: [
      { emoji: '💬', label: 'User Query' },
      { emoji: '🧠', label: 'Intent AI' },
      { emoji: '📚', label: 'Knowledge' },
      { emoji: '✉️', label: 'Response' },
      { emoji: '🔔', label: 'Escalate' },
    ],
    results: [
      { value: '%92', label: 'Otomasyon' },
      { value: '<2s', label: 'Yanıt Süresi' },
      { value: '4x', label: 'Verimlilik' },
    ],
  },
  {
    key: 'crm',
    accent: 'text-cyan',
    accentBg: 'bg-cyan/8',
    accentBorder: 'border-cyan/20',
    accentBorderHover: 'group-hover:border-cyan/40',
    glowColor: 'rgba(0,179,166,0.10)',
    nodes: [
      { emoji: '🎯', label: 'Lead In' },
      { emoji: '⚡', label: 'AI Score' },
      { emoji: '🔍', label: 'Enrich' },
      { emoji: '🗃️', label: 'CRM Update' },
      { emoji: '🚀', label: 'Alert Sales' },
    ],
    results: [
      { value: '3x', label: 'Lead Kalitesi' },
      { value: '%60', label: 'Daha Az Kayıp' },
      { value: 'Real-time', label: 'Senkronizasyon' },
    ],
  },
];

const AutomationsShowcase = () => {
  const { t } = useTranslation();

  return (
    <section className="py-16 md:py-32 relative">
      <ScrollReveal>
        <div className="text-center mb-12 md:mb-24">
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] mb-10">
            {t('automationsPage.showcase.badge')}
          </div>
          <h2 className="text-4xl md:text-[72px] font-display font-black text-white leading-[0.95] italic tracking-tighter mb-8 px-4">
            {t('automationsPage.showcase.title')} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-emerald-500 via-75% to-teal-700 block py-2 pr-3">
              {t('automationsPage.showcase.titleAccent')}
            </span>
          </h2>
          <p className="text-gray-400 text-base font-medium leading-relaxed max-w-2xl mx-auto px-4">
            {t('automationsPage.showcase.subtitle')}
          </p>
        </div>
      </ScrollReveal>

      <div className="space-y-6">
        {useCases.map((uc, idx) => (
          <ScrollReveal key={uc.key} delay={idx * 0.1}>
            <motion.div
              whileHover={{ y: -3 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className={`group relative rounded-[2rem] border ${uc.accentBorder} ${uc.accentBorderHover} bg-surface/25 backdrop-blur-xl p-8 md:p-10 transition-all duration-500 overflow-hidden`}
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: `radial-gradient(ellipse at 50% 0%, ${uc.glowColor}, transparent 65%)` }}
              />

              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 lg:gap-12 items-start">

                {/* Left: info + pipeline */}
                <div>
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4 mb-6">
                    <div>
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${uc.accentBg} border ${uc.accentBorder} ${uc.accent} text-[9px] font-black uppercase tracking-[0.3em] mb-3`}>
                        {t(`automationsPage.showcase.${uc.key}.stack`)}
                      </div>
                      <h3 className="text-2xl md:text-3xl font-display font-black text-white italic tracking-tighter leading-tight">
                        {t(`automationsPage.showcase.${uc.key}.title`)}
                      </h3>
                    </div>
                  </div>

                  <p className="text-gray-500 text-sm leading-relaxed mb-8 max-w-xl">
                    {t(`automationsPage.showcase.${uc.key}.desc`)}
                  </p>

                  {/* Workflow node pipeline */}
                  <div className="mb-8">
                    <div className={`text-[9px] font-black uppercase tracking-[0.35em] ${uc.accent} mb-4`}>
                      Automation Flow
                    </div>
                    {/* Desktop: horizontal row */}
                    <div className="hidden sm:flex items-center gap-0 flex-wrap">
                      {uc.nodes.map((node, ni) => (
                        <div key={ni} className="flex items-center">
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 + ni * 0.08 }}
                            className={`flex flex-col items-center gap-1.5 px-3 py-2.5 rounded-xl ${uc.accentBg} border ${uc.accentBorder} group-hover:border-opacity-50 transition-all duration-300 min-w-[72px]`}
                          >
                            <span className="text-xl leading-none">{node.emoji}</span>
                            <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap">
                              {node.label}
                            </span>
                          </motion.div>
                          {ni < uc.nodes.length - 1 && (
                            <motion.div
                              initial={{ opacity: 0, scaleX: 0 }}
                              whileInView={{ opacity: 1, scaleX: 1 }}
                              viewport={{ once: true }}
                              transition={{ delay: 0.15 + ni * 0.08 }}
                              className="origin-left"
                            >
                              <ArrowRight size={14} className={`${uc.accent} opacity-30 mx-1`} />
                            </motion.div>
                          )}
                        </div>
                      ))}
                    </div>
                    {/* Mobile: 2-col grid */}
                    <div className="sm:hidden grid grid-cols-3 gap-2">
                      {uc.nodes.map((node, ni) => (
                        <div key={ni} className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl ${uc.accentBg} border ${uc.accentBorder}`}>
                          <span className="text-lg leading-none">{node.emoji}</span>
                          <span className="text-[7px] font-bold text-gray-500 uppercase tracking-wide text-center">{node.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Challenge & Solution */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className={`p-5 rounded-2xl ${uc.accentBg} border ${uc.accentBorder}`}>
                      <div className={`text-[8px] font-black uppercase tracking-[0.35em] ${uc.accent} mb-2`}>Challenge</div>
                      <p className="text-gray-500 text-xs leading-relaxed">
                        {t(`automationsPage.showcase.${uc.key}.challenge`)}
                      </p>
                    </div>
                    <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                      <div className={`text-[8px] font-black uppercase tracking-[0.35em] ${uc.accent} mb-2`}>Solution</div>
                      <p className="text-gray-500 text-xs leading-relaxed">
                        {t(`automationsPage.showcase.${uc.key}.solution`)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right: result metrics */}
                <div className="flex lg:flex-col gap-3 lg:gap-4 flex-wrap">
                  {uc.results.map((r, ri) => (
                    <motion.div
                      key={ri}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + ri * 0.1 }}
                      className={`px-5 py-4 rounded-2xl ${uc.accentBg} border ${uc.accentBorder} text-center min-w-[100px]`}
                    >
                      <div className={`text-2xl font-black ${uc.accent} tracking-tight`}>{r.value}</div>
                      <div className="text-[9px] text-gray-600 font-bold uppercase tracking-widest mt-1">{r.label}</div>
                    </motion.div>
                  ))}
                </div>

              </div>

              {/* Bottom shimmer line */}
              <div className={`absolute bottom-0 left-0 h-px w-0 group-hover:w-full transition-all duration-700 bg-gradient-to-r from-transparent via-current to-transparent ${uc.accent} opacity-20`} />
            </motion.div>
          </ScrollReveal>
        ))}
      </div>

      <ScrollReveal className="mt-12 text-center">
        <Link
          to="/contact"
          className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-surface border border-white/10 text-gray-400 hover:text-white hover:border-emerald-400/30 font-black uppercase tracking-[0.2em] text-[11px] transition-all"
        >
          {t('automationsPage.showcase.cta') || 'Projenizi Konuşalım'}
          <ArrowRight size={16} />
        </Link>
      </ScrollReveal>
    </section>
  );
};

export default AutomationsShowcase;
