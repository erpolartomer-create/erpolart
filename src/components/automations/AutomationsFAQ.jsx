import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ScrollReveal from '../ScrollReveal';

const palette = [
  { num: 'text-emerald-400', iconBg: 'bg-emerald-400/15', iconBorder: 'border-emerald-400/40', line: 'bg-emerald-400' },
  { num: 'text-slate-300',   iconBg: 'bg-slate-400/15',   iconBorder: 'border-slate-400/40',   line: 'bg-slate-400'   },
  { num: 'text-emerald-400', iconBg: 'bg-emerald-400/15', iconBorder: 'border-emerald-400/40', line: 'bg-emerald-400' },
  { num: 'text-slate-300',   iconBg: 'bg-slate-400/15',   iconBorder: 'border-slate-400/40',   line: 'bg-slate-400'   },
  { num: 'text-emerald-400', iconBg: 'bg-emerald-400/15', iconBorder: 'border-emerald-400/40', line: 'bg-emerald-400' },
  { num: 'text-slate-300',   iconBg: 'bg-slate-400/15',   iconBorder: 'border-slate-400/40',   line: 'bg-slate-400'   },
];

const AutomationsFAQ = () => {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState(null);
  const items = t('automationsPage.faq.items', { returnObjects: true });
  const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section className="py-16 md:py-28 relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-500/5 blur-[140px] rounded-full" />
      </div>

      <div className="max-w-4xl mx-auto px-6">
        <ScrollReveal className="text-center mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-400/10 border border-emerald-400/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] mb-8">
            {t('automationsPage.faq.badge')}
          </div>
          <h2 className="text-4xl md:text-[72px] font-display font-black italic text-white tracking-tighter leading-[0.9]">
            {t('automationsPage.faq.title')}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-400 pr-3">
              {t('automationsPage.faq.titleAccent')}
            </span>
          </h2>
        </ScrollReveal>

        <div className="flex flex-col">
          {Array.isArray(items) && items.map((item, i) => {
            const c = palette[i % palette.length];
            const isOpen = openIndex === i;

            return (
              <ScrollReveal key={i} delay={i * 0.06}>
                <div className="border-b border-white/6 last:border-b-0">
                  <button
                    onClick={() => toggle(i)}
                    className="w-full flex items-start gap-5 py-7 text-left group"
                  >
                    <span className={`text-5xl md:text-6xl font-display font-black italic leading-none shrink-0 tabular-nums transition-all duration-500 ${isOpen ? c.num : 'text-white/8 group-hover:text-white/20'}`}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className={`flex-1 text-sm md:text-base font-bold leading-snug pt-3 transition-colors duration-300 ${isOpen ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>
                      {item.q}
                    </span>
                    <div className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center mt-2.5 border transition-all duration-300 ${isOpen ? `${c.iconBg} ${c.iconBorder} ${c.num}` : 'bg-white/5 border-white/10 text-gray-500 group-hover:border-white/20'}`}>
                      {isOpen ? <Minus size={12} /> : <Plus size={12} />}
                    </div>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                      >
                        <div className="pl-20 md:pl-24 pb-7 pr-10">
                          <div className={`h-px w-10 ${c.line} mb-4 opacity-60`} />
                          <p className="text-gray-300 text-sm leading-relaxed">{item.a}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AutomationsFAQ;
