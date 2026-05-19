import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check, ArrowRight, Sparkles, CreditCard, Brain, Smartphone, Globe,
  Users, Code2, Mail, BarChart2, Info, CheckCircle2, ShieldCheck,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import ScrollReveal from '../ScrollReveal';

const TIER_PRICES   = { starter: 3500, pro: 7500,  scale: 15000, enterprise: 30000 };
const MONTHLY_PRICES = { starter: 100,  pro: 250,   scale: 500,   enterprise: 1000  };

const EXTRAS = [
  { key: 'payments',   Icon: CreditCard,  price: 480 },
  { key: 'ai',         Icon: Brain,        price: 640 },
  { key: 'mobile',     Icon: Smartphone,   price: 560 },
  { key: 'multilang',  Icon: Globe,        price: 280 },
  { key: 'crm',        Icon: Users,        price: 400 },
  { key: 'api',        Icon: Code2,        price: 320 },
  { key: 'email',      Icon: Mail,         price: 200 },
  { key: 'analytics',  Icon: BarChart2,    price: 360 },
];

const TC = {
  starter: {
    text: 'text-gray-300',
    border: 'border-white/15',
    cardBorder: 'border-white/10 hover:border-white/25',
    glow: '',
    badge: 'bg-white/5 border border-white/12 text-gray-400',
    check: 'bg-white/5 border-white/15',
    checkIcon: 'text-gray-400',
    cta: 'bg-white text-black hover:bg-gray-100',
    shimmer: 'bg-gradient-to-r from-transparent via-white/15 to-transparent',
    hoverGlow: 'rgba(255,255,255,0.03)',
    pin: null, pinCls: '',
  },
  pro: {
    text: 'text-amber-400',
    border: 'border-amber-400/30',
    cardBorder: 'border-amber-400/35 hover:border-amber-400/60',
    glow: 'shadow-[0_0_80px_rgba(251,191,36,0.10)]',
    badge: 'bg-amber-400/10 border border-amber-400/30 text-amber-400',
    check: 'bg-amber-400/10 border-amber-400/25',
    checkIcon: 'text-amber-400',
    cta: 'bg-amber-500 text-black hover:bg-amber-400 shadow-lg shadow-amber-500/25',
    shimmer: 'bg-gradient-to-r from-transparent via-amber-400/40 to-transparent',
    hoverGlow: 'rgba(251,191,36,0.12)',
    pin: 'POPULAR', pinCls: 'bg-amber-400/15 border border-amber-400/30 text-amber-400',
  },
  scale: {
    text: 'text-amber-200',
    border: 'border-amber-200/20',
    cardBorder: 'border-amber-200/18 hover:border-amber-200/40',
    glow: 'shadow-[0_0_80px_rgba(253,230,138,0.07)]',
    badge: 'bg-amber-200/8 border border-amber-200/20 text-amber-200',
    check: 'bg-amber-200/8 border-amber-200/20',
    checkIcon: 'text-amber-200',
    cta: 'bg-amber-200 text-black hover:bg-amber-100',
    shimmer: 'bg-gradient-to-r from-transparent via-amber-200/25 to-transparent',
    hoverGlow: 'rgba(253,230,138,0.08)',
    pin: null, pinCls: '',
  },
  enterprise: {
    text: 'text-white',
    border: 'border-white/15',
    cardBorder: 'border-white/12 hover:border-white/30',
    glow: 'shadow-[0_0_80px_rgba(255,255,255,0.04)]',
    badge: 'bg-white/8 border border-white/15 text-white',
    check: 'bg-white/8 border-white/20',
    checkIcon: 'text-white/80',
    cta: 'bg-white text-black hover:bg-white/90 shadow-lg shadow-white/10',
    shimmer: 'bg-gradient-to-r from-transparent via-white/20 to-transparent',
    hoverGlow: 'rgba(255,255,255,0.05)',
    pin: 'CUSTOM', pinCls: 'bg-white/8 border border-white/20 text-white',
  },
};

const TIERS_ORDER = ['starter', 'pro', 'scale', 'enterprise'];
const fmt = (n) => '$' + n.toLocaleString('en-US');

const SaaSPricing = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [tier, setTier] = useState('pro');
  const [selected, setSelected] = useState(new Set());
  const [tooltipKey, setTooltipKey] = useState(null);
  const [showBar, setShowBar] = useState(false);
  const [expandedCards, setExpandedCards] = useState(new Set());
  const [withMaintenance, setWithMaintenance] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowBar(entry.isIntersecting),
      { threshold: 0.05 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const c = TC[tier];
  const base = TIER_PRICES[tier];
  const monthly = MONTHLY_PRICES[tier];
  const extTotal = [...selected].reduce((s, k) => {
    const e = EXTRAS.find((x) => x.key === k);
    return s + (e?.price ?? 0);
  }, 0);
  const total = base + extTotal;


  const toggleExtra = useCallback((key) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }, []);

  const handleProceed = () => {
    navigate('/order', {
      state: { source: 'saas', tier, base, extras: [...selected], extTotal, total, maintenance: withMaintenance, monthly: withMaintenance ? monthly : 0 },
    });
  };

  const tierFeatures = t(`saasPage.pricing.tiers.${tier}.features`, { returnObjects: true }) ?? [];

  return (
    <section ref={sectionRef} className="py-16 md:py-28 relative">
      {/* Tier-reactive ambient glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <AnimatePresence>
          {tier === 'pro' && (
            <motion.div key="g-pro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-amber-400/5 blur-[180px] rounded-full" />
          )}
          {tier === 'scale' && (
            <motion.div key="g-scale" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-amber-200/4 blur-[180px] rounded-full" />
          )}
          {tier === 'enterprise' && (
            <motion.div key="g-ent" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-white/3 blur-[180px] rounded-full" />
          )}
        </AnimatePresence>
      </div>

      {/* Section header */}
      <ScrollReveal className="text-center mb-12 md:mb-16 px-6 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={tier + '-badge'}
            initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.2 }}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-[10px] font-black uppercase tracking-[0.3em] mb-8 transition-all duration-500 ${c.badge}`}
          >
            <Sparkles size={11} />
            {t('saasPage.pricing.badge')}
          </motion.div>
        </AnimatePresence>
        <h2 className="text-4xl md:text-[72px] font-display font-black italic tracking-tighter leading-[0.9] mb-4">
          <span className="text-white">{t('saasPage.pricing.title')}{' '}</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-500 to-amber-600 pr-2">
            {t('saasPage.pricing.titleAccent')}
          </span>
        </h2>
        <p className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
          {t('saasPage.pricing.subtitle')}
        </p>
      </ScrollReveal>

      {/* Mobile sticky bottom bar */}
      <AnimatePresence>
        {showBar && (
        <motion.div
          initial={{ y: '100%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 30, stiffness: 280 }}
          className="fixed bottom-0 left-0 right-0 z-50 lg:hidden pointer-events-none"
        >
        <div className="pointer-events-auto mx-3 mb-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={tier + '-bar'}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.22 }}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl border bg-[#0d0e18]/95 backdrop-blur-2xl shadow-2xl transition-all duration-500 ${c.cardBorder}`}
            >
              <div className="flex-1 min-w-0">
                <div className={`text-[8px] font-black uppercase tracking-[0.3em] mb-0.5 transition-colors duration-500 ${c.text}`}>
                  {t(`saasPage.pricing.tiers.${tier}.tierName`)}
                </div>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={total}
                    initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.15 }}
                    className={`text-2xl font-display font-black tracking-tighter transition-colors duration-500 ${c.text}`}
                  >
                    {fmt(total)}
                  </motion.div>
                </AnimatePresence>
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleProceed}
                className={`shrink-0 flex items-center gap-2 px-5 py-3 rounded-xl font-black text-[10px] uppercase tracking-[0.08em] transition-all duration-300 ${c.cta}`}
              >
                {t('saasPage.pricing.cta')}
                <ArrowRight size={12} />
              </motion.button>
            </motion.div>
          </AnimatePresence>
        </div>
        </motion.div>
        )}
      </AnimatePresence>

      {/* Configurator + Summary */}
      <div className="max-w-6xl mx-auto px-6 relative z-10 pb-24 lg:pb-0">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 items-start">

          {/* ══ LEFT: Tier selection + Extras ══ */}
          <div className="space-y-5">

            {/* Tier cards 2x2 grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {TIERS_ORDER.map((t_key) => {
                const tc = TC[t_key];
                const isSelected = tier === t_key;
                const tierFeats = t(`saasPage.pricing.tiers.${t_key}.features`, { returnObjects: true }) ?? [];
                return (
                  <motion.div
                    key={t_key}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setTier(t_key)}
                    className={`relative rounded-[2rem] border cursor-pointer transition-all duration-300 overflow-hidden
                      ${isSelected
                        ? `${tc.cardBorder} bg-surface/25 backdrop-blur-xl ${tc.glow}`
                        : 'border-white/8 bg-surface/10 hover:border-white/20 hover:bg-surface/15'}
                    `}
                  >
                    {/* Shimmer on selected */}
                    {isSelected && (
                      <div className={`absolute top-0 left-0 right-0 h-px ${tc.shimmer}`} />
                    )}

                    <div className="p-5 md:p-6">
                      {/* Pin badge */}
                      {tc.pin && (
                        <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-[0.25em] mb-3 ${tc.pinCls}`}>
                          <Sparkles size={7} />
                          {tc.pin}
                        </div>
                      )}

                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className={`text-[10px] font-black uppercase tracking-[0.3em] mb-0.5 transition-colors duration-300 ${isSelected ? tc.text : 'text-gray-600'}`}>
                            {t(`saasPage.pricing.tiers.${t_key}.tierName`)}
                          </div>
                          <div className="text-white font-display font-black text-2xl tracking-tight">
                            {fmt(TIER_PRICES[t_key])}
                          </div>
                          <div className="text-[9px] text-gray-600 mt-0.5 font-medium">
                            +{fmt(MONTHLY_PRICES[t_key])}<span className="text-gray-700">{t('saasPage.pricing.perMonth')} {t('saasPage.pricing.maintenance.rowLabel').toLowerCase()} (opt.)</span>
                          </div>
                          <div className="text-[10px] text-gray-600 mt-0.5">
                            {t(`saasPage.pricing.tiers.${t_key}.tagline`)}
                          </div>
                        </div>
                        {/* Selected indicator */}
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-300 mt-1
                          ${isSelected ? `${tc.check} border-[1.5px]` : 'border-white/15 bg-white/3'}`}>
                          {isSelected && <CheckCircle2 size={11} className={tc.checkIcon} />}
                        </div>
                      </div>

                      {/* Features mini list */}
                      <div className="space-y-1.5">
                        {Array.isArray(tierFeats) && tierFeats.slice(0, 3).map((feat, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <Check size={9} className={isSelected ? tc.checkIcon : 'text-gray-700'} />
                            <span className={`text-[10px] leading-snug transition-colors duration-300 ${isSelected ? 'text-gray-400' : 'text-gray-600'}`}>
                              {feat}
                            </span>
                          </div>
                        ))}
                        <AnimatePresence>
                          {expandedCards.has(t_key) && Array.isArray(tierFeats) && tierFeats.slice(3).map((feat, i) => (
                            <motion.div
                              key={'x' + i}
                              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.18, delay: i * 0.03 }}
                              className="flex items-center gap-2 overflow-hidden"
                            >
                              <Check size={9} className={isSelected ? tc.checkIcon : 'text-gray-700'} />
                              <span className={`text-[10px] leading-snug transition-colors duration-300 ${isSelected ? 'text-gray-400' : 'text-gray-600'}`}>
                                {feat}
                              </span>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                        {Array.isArray(tierFeats) && tierFeats.length > 3 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedCards((prev) => {
                                const next = new Set(prev);
                                next.has(t_key) ? next.delete(t_key) : next.add(t_key);
                                return next;
                              });
                            }}
                            className={`text-[9px] font-black transition-colors duration-300 underline underline-offset-2 ${isSelected ? tc.text : 'text-gray-700'}`}
                          >
                            {expandedCards.has(t_key) ? t('saasPage.pricing.showLess') : `+${tierFeats.length - 3}`}
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Full feature list for selected tier */}
            <div className={`rounded-[2rem] border bg-surface/15 backdrop-blur-xl p-6 md:p-8 transition-all duration-500 ${c.cardBorder}`}>
              <div className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 mb-5">
                {t('saasPage.pricing.includedSection')}
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={tier}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                >
                  {Array.isArray(tierFeatures) && tierFeatures.map((feat, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04, duration: 0.25 }}
                      className="flex items-start gap-2.5"
                    >
                      <div className={`shrink-0 w-4 h-4 rounded-full border flex items-center justify-center mt-0.5 ${c.check}`}>
                        <Check size={9} className={c.checkIcon} />
                      </div>
                      <span className="text-gray-400 text-xs leading-snug">{feat}</span>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Extras */}
            <div className={`rounded-[2rem] border bg-surface/15 backdrop-blur-xl p-6 md:p-8 transition-all duration-500 ${c.cardBorder}`}>
              <div className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 mb-5">
                {t('saasPage.pricing.extrasSection')}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {EXTRAS.map((extra) => {
                  const checked = selected.has(extra.key);
                  const { Icon } = extra;
                  const showTip = tooltipKey === extra.key;

                  return (
                    <div key={extra.key} className="relative">
                      <motion.div
                        whileTap={{ scale: 0.97 }}
                        onClick={() => toggleExtra(extra.key)}
                        className={`
                          flex items-start gap-3 px-4 py-3 rounded-xl border text-left w-full transition-all duration-200 cursor-pointer select-none
                          ${checked ? 'border-white/18 bg-white/5' : 'border-white/8 bg-white/[0.02] hover:border-white/15 hover:bg-white/4'}
                        `}
                      >
                        <div className={`shrink-0 mt-0.5 w-4 h-4 rounded border flex items-center justify-center transition-all duration-200
                          ${checked ? `${c.check} border-[1.5px]` : 'border-white/20 bg-white/3'}
                        `}>
                          {checked && <Check size={9} className={c.checkIcon} />}
                        </div>
                        <Icon size={14} className={`shrink-0 mt-0.5 ${checked ? c.text : 'text-gray-500'}`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className={`text-xs font-medium leading-snug ${checked ? 'text-gray-300' : 'text-gray-500'}`}>
                              {t(`saasPage.pricing.extras.${extra.key}`)}
                            </span>
                            <button
                              onMouseEnter={() => setTooltipKey(extra.key)}
                              onMouseLeave={() => setTooltipKey(null)}
                              onClick={(e) => e.stopPropagation()}
                              className="shrink-0 text-gray-700 hover:text-gray-400 transition-colors"
                            >
                              <Info size={11} />
                            </button>
                          </div>
                        </div>
                        <span className={`text-[10px] font-black shrink-0 self-start mt-0.5 ${checked ? c.text : 'text-gray-500'}`}>
                          +${extra.price}
                        </span>
                      </motion.div>

                      <AnimatePresence>
                        {showTip && (
                          <motion.div
                            initial={{ opacity: 0, y: 6, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 6, scale: 0.96 }} transition={{ duration: 0.15 }}
                            onClick={(e) => e.stopPropagation()}
                            onMouseDown={(e) => e.stopPropagation()}
                            className="absolute bottom-full left-0 right-0 z-50 mb-2 px-3 py-2.5 rounded-xl bg-[#14151f] border border-white/15 text-[10px] text-gray-300 leading-relaxed shadow-2xl"
                          >
                            {t(`saasPage.pricing.extrasDesc.${extra.key}`)}
                            <div className="absolute top-full left-4 w-2 h-2 bg-[#14151f] border-r border-b border-white/15 rotate-45 -mt-[5px]" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Aylık Bakım Paketi toggle */}
            <motion.div
              whileTap={{ scale: 0.99 }}
              onClick={() => setWithMaintenance((p) => !p)}
              className={`rounded-[2rem] border cursor-pointer transition-all duration-300 overflow-hidden
                ${withMaintenance
                  ? `${c.cardBorder} bg-surface/25 backdrop-blur-xl ${c.glow}`
                  : 'border-white/8 bg-surface/10 hover:border-white/20 hover:bg-surface/15'}
              `}
            >
              {withMaintenance && <div className={`h-px ${c.shimmer}`} />}
              <div className="p-5 md:p-6 flex items-center gap-4">
                <div className={`shrink-0 w-10 h-10 rounded-xl border flex items-center justify-center transition-all duration-300
                  ${withMaintenance ? `${c.check} border-[1.5px]` : 'border-white/15 bg-white/3'}`}>
                  {withMaintenance
                    ? <Check size={16} className={c.checkIcon} />
                    : <ShieldCheck size={16} className="text-gray-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`text-xs font-black uppercase tracking-[0.2em] mb-0.5 transition-colors duration-300 ${withMaintenance ? c.text : 'text-gray-500'}`}>
                    {t('saasPage.pricing.maintenance.title')}
                  </div>
                  <div className="text-[10px] text-gray-600 leading-snug">
                    {t('saasPage.pricing.maintenance.desc')}
                  </div>
                </div>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={tier + '-m'}
                    initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.15 }}
                    className={`shrink-0 text-right transition-colors duration-300 ${withMaintenance ? c.text : 'text-gray-600'}`}
                  >
                    <div className="text-lg font-display font-black tracking-tight">{fmt(monthly)}</div>
                    <div className="text-[9px] font-normal text-gray-600">{t('saasPage.pricing.perMonth')}</div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>

          </div>

          {/* ══ RIGHT: Price summary (sticky on desktop) ══ */}
          <div className="lg:sticky lg:top-28">
            <div className={`relative rounded-[2rem] border bg-surface/25 backdrop-blur-xl p-6 md:p-8 overflow-hidden transition-all duration-500 ${c.cardBorder} ${c.glow}`}>
              <div className={`absolute top-0 left-0 right-0 h-px ${c.shimmer}`} />

              {c.pin && (
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.25em] mb-4 ${c.badge}`}>
                  <Sparkles size={9} />
                  {c.pin}
                </div>
              )}

              <AnimatePresence mode="wait">
                <motion.div
                  key={tier + '-label'}
                  initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.18 }}
                  className="mb-5"
                >
                  <div className={`text-[10px] font-black uppercase tracking-[0.35em] mb-1 transition-colors duration-500 ${c.text}`}>
                    {t(`saasPage.pricing.tiers.${tier}.tierName`)}
                  </div>
                  <div className="text-gray-600 text-xs">{t(`saasPage.pricing.tiers.${tier}.tagline`)}</div>
                </motion.div>
              </AnimatePresence>

              <div className="mb-4">
                <div className="text-[9px] font-black uppercase tracking-[0.25em] text-gray-600 mb-1">
                  {t('saasPage.pricing.totalLabel')}
                </div>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={total}
                    initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }}
                    transition={{ duration: 0.18 }}
                    className={`text-5xl font-display font-black tracking-tighter transition-colors duration-500 ${c.text}`}
                  >
                    {fmt(total)}
                  </motion.div>
                </AnimatePresence>
                <div className="text-[9px] text-gray-600 mt-1">{t('saasPage.pricing.oneTime')}</div>
              </div>

              <div className="space-y-2 py-4 border-t border-b border-white/6 mb-5">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">{t('saasPage.pricing.baseLabel')}</span>
                  <span className="text-gray-300 font-medium">{fmt(base)}</span>
                </div>
                <AnimatePresence>
                  {extTotal > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                      className="flex justify-between text-xs overflow-hidden"
                    >
                      <span className="text-gray-500">{t('saasPage.pricing.extrasBreakdown')}</span>
                      <span className="text-gray-300 font-medium">+{fmt(extTotal)}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Selected extras list */}
                <AnimatePresence>
                  {[...selected].map((key) => {
                    const e = EXTRAS.find((x) => x.key === key);
                    return e ? (
                      <motion.div
                        key={key}
                        initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                        className="flex justify-between text-xs overflow-hidden pl-2"
                      >
                        <span className="text-gray-600">· {t(`saasPage.pricing.extras.${key}`)}</span>
                        <span className="text-gray-500">+${e.price}</span>
                      </motion.div>
                    ) : null;
                  })}
                </AnimatePresence>

                {/* Maintenance row */}
                <AnimatePresence>
                  {withMaintenance && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className={`flex justify-between text-xs pt-2 border-t border-white/6 mt-1`}>
                        <span className={`font-black ${c.text}`}>{t('saasPage.pricing.maintenance.rowLabel')}</span>
                        <span className={`font-black ${c.text}`}>{fmt(monthly)}<span className="text-gray-600 font-normal">{t('saasPage.pricing.perMonth')}</span></span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleProceed}
                className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-black text-[11px] uppercase tracking-[0.1em] transition-all duration-300 ${c.cta}`}
              >
                {t('saasPage.pricing.cta')}
                <ArrowRight size={14} />
              </motion.button>

              <p className="text-center text-[9px] text-gray-600 mt-3">
                {t('saasPage.pricing.ctaNote')}
              </p>
            </div>
          </div>
        </div>

        {/* Enterprise note */}
        <ScrollReveal className="mt-10 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl border border-white/8 bg-white/[0.02]">
            <Sparkles size={11} className="text-gray-500 shrink-0" />
            <p className="text-xs text-gray-500">{t('saasPage.pricing.enterpriseNote')}</p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default SaaSPricing;
