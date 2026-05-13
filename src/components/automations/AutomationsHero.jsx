import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const workflowSteps = [
  { label: 'New order detected', done: true, time: '0.1s' },
  { label: 'AI analyzing customer data', done: true, time: '0.4s' },
  { label: 'Routing to fulfillment', active: true },
  { label: 'Send confirmation email', done: false },
  { label: 'Update CRM & inventory', done: false },
];

const AutomationsHero = () => {
  const { t } = useTranslation();

  return (
    <section className="relative pt-24 pb-20 md:pb-24 overflow-visible">
      <div className="absolute top-0 right-0 w-[60vw] max-w-[800px] h-[60vw] max-h-[800px] bg-emerald-500/10 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[50vw] max-w-[600px] h-[50vw] max-h-[600px] bg-cyan/8 rounded-full blur-[120px] translate-y-1/3 -translate-x-1/4 pointer-events-none" />
      {/* Grid moved to main page wrapper */}

      <div className="relative z-10 container mx-auto px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

          {/* Left: Text */}
          <div className="flex-1 text-center lg:text-left min-w-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.4em] mb-12"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              {t('automationsPage.hero.badge')}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-[2.5rem] md:text-[88px] font-display font-black text-white leading-[0.9] tracking-tighter italic mb-10"
            >
              {t('automationsPage.hero.title')} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-emerald-500 via-70% to-teal-700 pr-4">
                {t('automationsPage.hero.titleAccent')}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-gray-400 text-sm md:text-base font-medium leading-relaxed max-w-xl mb-12 mx-auto lg:mx-0"
            >
              {t('automationsPage.hero.subtitle')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center lg:items-start gap-5"
            >
              <a
                href="#automations-contact"
                className="group relative inline-flex items-center gap-4 px-10 py-5 rounded-2xl bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-500 text-pure-white font-black uppercase tracking-[0.2em] text-[11px] overflow-hidden hover:scale-105 transition-all shadow-2xl shadow-emerald-500/30"
              >
                <span className="relative z-10">{t('automationsPage.hero.cta')}</span>
                <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
              <a
                href="#automations-features"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-surface border border-border-adaptive text-gray-400 hover:text-white hover:border-emerald-400/40 font-black uppercase tracking-[0.2em] text-[11px] transition-all"
              >
                {t('automationsPage.hero.secondary')}
              </a>
            </motion.div>
          </div>

          {/* Right: Live Automation Terminal */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="hidden lg:block w-[380px] flex-shrink-0"
          >
            <div className="rounded-[2rem] border border-white/8 bg-[#080d0a]/90 backdrop-blur-xl overflow-hidden shadow-2xl shadow-black/50">

              {/* Window chrome */}
              <div className="flex items-center gap-3 px-5 py-3.5 border-b border-white/[0.05] bg-white/[0.015]">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-400/50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400/50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/50" />
                </div>
                <code className="flex-1 text-center text-[10px] font-mono text-gray-700">automation.engine</code>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[9px] text-emerald-400 font-bold tracking-widest">LIVE</span>
                </div>
              </div>

              {/* Workflow info */}
              <div className="px-5 pt-5 pb-3">
                <div className="text-[8px] text-gray-700 font-mono tracking-widest mb-1.5">▶ RUNNING WORKFLOW</div>
                <code className="text-emerald-400/80 text-[11px] font-mono">e-commerce-order-handler.flow</code>
              </div>

              <div className="h-px mx-5 bg-white/[0.04] mb-4" />

              {/* Steps */}
              <div className="px-5 pb-4 space-y-2.5">
                {workflowSteps.map((step, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + i * 0.32 }}
                    className="flex items-center gap-3"
                  >
                    {step.done ? (
                      <div className="w-4 h-4 rounded-full bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center shrink-0">
                        <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                          <path d="M1 3L3 5L7 1" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    ) : step.active ? (
                      <div className="w-4 h-4 rounded-full bg-amber-500/15 border border-amber-500/25 flex items-center justify-center shrink-0">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                      </div>
                    ) : (
                      <div className="w-4 h-4 rounded-full bg-white/[0.03] border border-white/[0.07] shrink-0" />
                    )}

                    <code className={`text-[11px] font-mono flex-1 ${
                      step.done ? 'text-gray-600 line-through decoration-gray-700'
                      : step.active ? 'text-amber-400'
                      : 'text-gray-700'
                    }`}>
                      {step.label}
                    </code>

                    {step.done && (
                      <code className="text-[9px] font-mono text-emerald-400/40 shrink-0">{step.time}</code>
                    )}
                    {step.active && (
                      <code className="text-[9px] font-mono text-amber-400/50 shrink-0 animate-pulse">running...</code>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Progress */}
              <div className="mx-5 mb-4 p-3 rounded-xl bg-white/[0.015] border border-white/[0.04]">
                <div className="flex items-center justify-between mb-2">
                  <code className="text-[9px] font-mono text-gray-700">progress</code>
                  <code className="text-[9px] font-mono text-emerald-400/70">3 / 5 steps</code>
                </div>
                <div className="h-1 bg-white/[0.04] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '60%' }}
                    transition={{ delay: 2.2, duration: 0.8, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                  />
                </div>
              </div>

              {/* Stats footer */}
              <div className="grid grid-cols-3 border-t border-white/[0.05]">
                {[
                  { label: 'elapsed', value: '1.4s' },
                  { label: 'memory', value: '48 MB' },
                  { label: 'api calls', value: '3' },
                ].map((stat, i) => (
                  <div key={i} className={`px-4 py-3 text-center ${i < 2 ? 'border-r border-white/[0.05]' : ''}`}>
                    <div className="text-[8px] font-mono text-gray-700 tracking-widest">{stat.label}</div>
                    <div className="text-[11px] font-mono font-bold text-gray-400 mt-0.5">{stat.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default AutomationsHero;
