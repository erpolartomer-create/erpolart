import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check, ArrowRight, Sparkles, ShoppingCart, FileText, Globe,
  LayoutDashboard, Search, Palette, Plus, Minus, ChevronDown,
  Server, RefreshCw, Headphones, Ban, Info, Calendar, MessageSquare, Star,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import ScrollReveal from '../ScrollReveal';

// ── Pricing logic ──────────────────────────────────────────────────────────────
function getTier(p) {
  if (p <= 2)  return 'corporate';
  if (p <= 8)  return 'pro';
  if (p <= 14) return 'premium';
  return 'platinum';
}

function getBasePrice(p) {
  if (p === 1) return 130;
  if (p === 2) return 200;
  if (p <= 8)  return 300  + (p - 3)  * 150;  // 3→$300  … 8→$1,050
  if (p <= 14) return 1550 + (p - 9)  * 130;  // 9→$1,550 … 14→$2,200
  return              2450 + (p - 15) * 510;  // 15→$2,450 … 20→$5,000
}

const MAINT = { corporate: 29, pro: 49, premium: 150, platinum: 250 };

const CORP_DISABLED = new Set(['ecommerce', 'blog', 'admin', 'reservation']);

const EXTRAS = [
  { key: 'ecommerce',   Icon: ShoppingCart,    price: 300,  okCorp: false },
  { key: 'blog',        Icon: FileText,        price: 150,  okCorp: false },
  { key: 'multilang',   Icon: Globe,           price: 100,  okCorp: true,  quantifiable: true },
  { key: 'admin',       Icon: LayoutDashboard, price: 400,  okCorp: false },
  { key: 'reservation', Icon: Calendar,        price: 300,  okCorp: false },
  { key: 'reviews',     Icon: Star,            price: 200,  okCorp: true  },
  { key: 'livechat',    Icon: MessageSquare,   price: 150,  okCorp: true  },
  { key: 'seo',         Icon: Search,          price: 200,  okCorp: true  },
  { key: 'branding',    Icon: Palette,         price: 300,  okCorp: true  },
];

// ── Tier visual config ─────────────────────────────────────────────────────────
const TC = {
  corporate: {
    text:        'text-cyan',
    border:      'border-cyan/20',
    cardBorder:  'border-cyan/20 hover:border-cyan/35',
    glow:        'shadow-[0_0_80px_rgba(0,179,166,0.08)]',
    badge:       'bg-cyan/10 border border-cyan/25 text-cyan',
    check:       'bg-cyan/10 border-cyan/25',
    checkIcon:   'text-cyan',
    progress:    'bg-cyan',
    cta:         'bg-cyan text-black hover:bg-cyan/80',
    shimmer:     'bg-gradient-to-r from-transparent via-cyan/35 to-transparent',
    hoverGlow:   'rgba(0,179,166,0.10)',
    maintDot:    'bg-cyan',
    pin:         null,
    pinCls:      '',
  },
  pro: {
    text:        'text-indigo',
    border:      'border-indigo/25',
    cardBorder:  'border-indigo/25 hover:border-indigo/50',
    glow:        'shadow-[0_0_80px_rgba(59,88,255,0.10)]',
    badge:       'bg-indigo/10 border border-indigo/25 text-indigo',
    check:       'bg-indigo/10 border-indigo/25',
    checkIcon:   'text-indigo',
    progress:    'bg-indigo',
    cta:         'bg-indigo text-white hover:bg-indigo/80 shadow-lg shadow-indigo/25',
    shimmer:     'bg-gradient-to-r from-transparent via-indigo/35 to-transparent',
    hoverGlow:   'rgba(59,88,255,0.12)',
    maintDot:    'bg-indigo',
    pin:         'POPULAR',
    pinCls:      'bg-indigo/15 border border-indigo/30 text-indigo',
  },
  premium: {
    text:        'text-amber-400',
    border:      'border-amber-500/20',
    cardBorder:  'border-amber-500/20 hover:border-amber-500/45',
    glow:        'shadow-[0_0_80px_rgba(245,158,11,0.08)]',
    badge:       'bg-amber-500/10 border border-amber-500/25 text-amber-400',
    check:       'bg-amber-500/10 border-amber-500/25',
    checkIcon:   'text-amber-400',
    progress:    'bg-amber-500',
    cta:         'bg-amber-500 text-black hover:bg-amber-400 shadow-lg shadow-amber-500/20',
    shimmer:     'bg-gradient-to-r from-transparent via-amber-500/35 to-transparent',
    hoverGlow:   'rgba(245,158,11,0.10)',
    maintDot:    'bg-amber-500',
    pin:         null,
    pinCls:      '',
  },
  platinum: {
    text:        'text-white',
    border:      'border-white/12',
    cardBorder:  'border-white/12 hover:border-white/30',
    glow:        'shadow-[0_0_80px_rgba(255,255,255,0.04)]',
    badge:       'bg-white/8 border border-white/15 text-white',
    check:       'bg-white/8 border-white/20',
    checkIcon:   'text-white/80',
    progress:    'bg-white/70',
    cta:         'bg-white text-black hover:bg-white/90 shadow-lg shadow-white/10',
    shimmer:     'bg-gradient-to-r from-transparent via-white/20 to-transparent',
    hoverGlow:   'rgba(255,255,255,0.05)',
    maintDot:    'bg-white/60',
    pin:         'EXCLUSIVE',
    pinCls:      'bg-white/8 border border-white/20 text-white',
  },
};

const fmt = (n) => '$' + n.toLocaleString('en-US');

// Global progress: position on 1–20 scale
const toGlobal = (p) => ((p - 1) / 19) * 100;
// Tier boundary tick marks at pages 3, 9, 15
const TICKS = [3, 9, 15];

// ── Component ─────────────────────────────────────────────────────────────────
const ProjectsPricing = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [pages, setPages] = useState(1);
  const [selected, setSelected] = useState(new Set());
  const [maintenance, setMaintenance] = useState(false);
  const [maintOpen, setMaintOpen] = useState(false);
  const [langCount, setLangCount] = useState(2);
  const [tooltipKey, setTooltipKey] = useState(null);

  const trackRef = useRef(null);
  const isDragging = useRef(false);
  const sectionRef = useRef(null);
  const [showBar, setShowBar] = useState(false);

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

  const pageFromX = useCallback((clientX) => {
    if (!trackRef.current) return 1;
    const { left, width } = trackRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - left) / width));
    return Math.max(1, Math.min(20, Math.round(ratio * 19) + 1));
  }, []);

  useEffect(() => {
    const onMove = (e) => { if (isDragging.current) setPages(pageFromX(e.clientX)); };
    const onUp   = ()  => { isDragging.current = false; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup',   onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup',   onUp);
    };
  }, [pageFromX]);


  const tier = getTier(pages);
  const c = TC[tier];
  const base = getBasePrice(pages);
  const extTotal = [...selected].reduce((s, k) => {
    if (k === 'multilang') return s + (langCount - 1) * 100;
    const e = EXTRAS.find((x) => x.key === k);
    return s + (e?.price ?? 0);
  }, 0);
  const total = base + extTotal;
  const monthly = maintenance ? MAINT[tier] : 0;
  const perPage = Math.round(total / pages);

  const tierFeatures = t(`projectsPage.pricing.${tier}.features`, { returnObjects: true }) ?? [];

  // Auto-deselect Corporate-incompatible extras when tier drops to corporate
  useEffect(() => {
    if (tier === 'corporate') {
      setSelected((prev) => {
        const next = new Set(prev);
        CORP_DISABLED.forEach((k) => next.delete(k));
        return next;
      });
    }
  }, [tier]);

  // Reset lang count when multilang is deselected
  useEffect(() => {
    if (!selected.has('multilang')) setLangCount(2);
  }, [selected]);

  const toggleExtra = useCallback((key, avail) => {
    if (!avail) return;
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }, []);

  const handleProceed = () => {
    const orderState = {
      source: 'projects',
      tier,
      pages,
      base,
      extras: [...selected],
      extTotal,
      total,
      maintenance,
      monthly,
    };
    // Giriş (özellikle Google OAuth tam-sayfa redirect) state'i kaybeder → sessionStorage'a yedekle
    try { sessionStorage.setItem('erpolart_pending_order', JSON.stringify(orderState)); } catch { /* yut */ }
    navigate('/order', { state: orderState });
  };

  return (
    <section ref={sectionRef} className="py-16 md:py-28 relative">
      {/* Tier-reactive ambient glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <AnimatePresence>
          {tier === 'corporate' && (
            <motion.div key="g-c" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-cyan/5 blur-[180px] rounded-full" />
          )}
          {tier === 'pro' && (
            <motion.div key="g-p" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-indigo/6 blur-[180px] rounded-full" />
          )}
          {tier === 'premium' && (
            <motion.div key="g-pm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-amber-500/5 blur-[180px] rounded-full" />
          )}
          {tier === 'platinum' && (
            <motion.div key="g-pl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-white/3 blur-[180px] rounded-full" />
          )}
        </AnimatePresence>
      </div>

      {/* Section header */}
      <ScrollReveal className="text-center mb-12 md:mb-16 px-6 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={tier + '-badge'}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.2 }}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-[10px] font-black uppercase tracking-[0.3em] mb-8 transition-all duration-500 ${c.badge}`}
          >
            <Sparkles size={11} />
            {t('projectsPage.pricing.badge')}
          </motion.div>
        </AnimatePresence>
        <h2 className="text-4xl md:text-[72px] font-display font-black italic tracking-tighter leading-[0.9] mb-4">
          <span className="text-white">{t('projectsPage.pricing.title')}{' '}</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo via-violet to-cyan pr-2">
            {t('projectsPage.pricing.titleAccent')}
          </span>
        </h2>
        <p className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
          {t('projectsPage.pricing.subtitle')}
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
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.22 }}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl border bg-[#0d0e18]/95 backdrop-blur-2xl shadow-2xl transition-all duration-500 ${c.cardBorder}`}
            >
              {/* Tier + price */}
              <div className="flex-1 min-w-0">
                <div className={`text-[8px] font-black uppercase tracking-[0.3em] mb-0.5 transition-colors duration-500 ${c.text}`}>
                  {t(`projectsPage.pricing.${tier}.tierName`)} · {pages} {t('projectsPage.pricing.pages')}
                </div>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={total}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.15 }}
                    className={`text-2xl font-display font-black tracking-tighter transition-colors duration-500 ${c.text}`}
                  >
                    {fmt(total)}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Maintenance dot */}
              {maintenance && (
                <div className="flex items-center gap-1.5 shrink-0">
                  <div className={`w-1.5 h-1.5 rounded-full ${c.maintDot}`} />
                  <span className="text-[9px] text-gray-500">+{fmt(monthly)}/mo</span>
                </div>
              )}

              {/* CTA */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleProceed}
                className={`shrink-0 flex items-center gap-2 px-5 py-3 rounded-xl font-black text-[10px] uppercase tracking-[0.08em] transition-all duration-300 ${c.cta}`}
              >
                {t('projectsPage.pricing.cta')}
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

          {/* ══ LEFT: Configurator ══ */}
          <div className="space-y-5">

            {/* Tier badge */}
            <AnimatePresence mode="wait">
              <motion.div
                key={tier}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.22 }}
                className="flex items-center gap-3 flex-wrap"
              >
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-[11px] font-black uppercase tracking-[0.25em] transition-all duration-500 ${c.badge}`}>
                  {c.pin && (
                    <span className={`text-[8px] font-black uppercase tracking-[0.3em] px-2 py-0.5 rounded-md ${c.pinCls}`}>
                      {c.pin}
                    </span>
                  )}
                  {t(`projectsPage.pricing.${tier}.tierName`)}
                </div>
                <span className="text-gray-600 text-xs">
                  {t(`projectsPage.pricing.${tier}.tagline`)}
                </span>
              </motion.div>
            </AnimatePresence>

            {/* Page counter */}
            <div className={`rounded-[2rem] border bg-surface/20 backdrop-blur-xl p-6 md:p-8 transition-all duration-500 ${c.cardBorder}`}>
              <div className="flex items-center justify-between mb-7">
                <div>
                  <div className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 mb-1.5">
                    {t('projectsPage.pricing.pageLabel')}
                  </div>
                  <div className="text-xs text-gray-600">
                    {t('projectsPage.pricing.pageHint')}
                  </div>
                </div>

                {/* Stepper */}
                <div className="flex items-center gap-3">
                  <motion.button
                    whileTap={{ scale: 0.88 }}
                    onClick={() => setPages((p) => Math.max(1, p - 1))}
                    disabled={pages === 1}
                    className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all duration-200 disabled:opacity-25 disabled:cursor-not-allowed bg-white/3 hover:bg-white/6 ${c.border}`}
                  >
                    <Minus size={14} className="text-gray-300" />
                  </motion.button>

                  <div className="w-16 text-center overflow-hidden">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={pages}
                        initial={{ opacity: 0, y: -14 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 14 }}
                        transition={{ duration: 0.14 }}
                        className={`text-4xl font-display font-black tracking-tighter transition-colors duration-500 ${c.text}`}
                      >
                        {pages}
                      </motion.div>
                    </AnimatePresence>
                    <div className="text-[9px] text-gray-600 uppercase tracking-widest">
                      {t('projectsPage.pricing.pages')}
                    </div>
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.88 }}
                    onClick={() => setPages((p) => Math.min(20, p + 1))}
                    disabled={pages === 20}
                    className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all duration-200 disabled:opacity-25 disabled:cursor-not-allowed bg-white/3 hover:bg-white/6 ${c.border}`}
                  >
                    <Plus size={14} className="text-gray-300" />
                  </motion.button>
                </div>
              </div>

              {/* Global progress bar (1–20 scale) — draggable */}
              <div>
                <div
                  ref={trackRef}
                  className="relative h-4 flex items-center cursor-pointer select-none"
                  onMouseDown={(e) => { isDragging.current = true; setPages(pageFromX(e.clientX)); }}
                  onTouchStart={(e) => { isDragging.current = true; setPages(pageFromX(e.touches[0].clientX)); }}
                  onTouchMove={(e) => { if (isDragging.current) { e.preventDefault(); setPages(pageFromX(e.touches[0].clientX)); } }}
                  onTouchEnd={() => { isDragging.current = false; }}
                  style={{ touchAction: 'none' }}
                >
                  {/* Track */}
                  <div className="absolute inset-x-0 h-2 bg-white/5 rounded-full overflow-visible">
                    {/* Fill */}
                    <motion.div
                      className={`h-full rounded-full transition-colors duration-500 ${c.progress}`}
                      animate={{ width: `${toGlobal(pages)}%` }}
                      transition={{ type: 'spring', stiffness: 220, damping: 28 }}
                    />
                    {/* Tier boundary ticks */}
                    {TICKS.map((tick) => (
                      <div
                        key={tick}
                        className="absolute top-0 bottom-0 w-px bg-white/20"
                        style={{ left: `${toGlobal(tick)}%` }}
                      />
                    ))}
                  </div>
                  {/* Thumb */}
                  <motion.div
                    className={`absolute w-4 h-4 rounded-full border-2 border-current shadow-lg z-10 transition-colors duration-500 ${c.text}`}
                    style={{ backgroundColor: 'var(--surface, #111)', left: `${toGlobal(pages)}%`, transform: 'translateX(-50%)' }}
                    animate={{ scale: isDragging.current ? 1.2 : 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  />
                </div>
                <div className="relative flex justify-between text-[8px] text-gray-700 mt-2 select-none">
                  {[1, 3, 9, 15, 20].map((n) => (
                    <span
                      key={n}
                      className={`transition-colors duration-300 ${pages >= n ? c.text : ''}`}
                      style={n !== 1 && n !== 20 ? { position: 'absolute', left: `${toGlobal(n)}%`, transform: 'translateX(-50%)' } : {}}
                    >
                      {n}
                    </span>
                  ))}
                </div>
                <div className="flex justify-between text-[8px] text-gray-700 mt-2">
                  {['Corporate', 'Pro', 'Premium', 'Platinum'].map((name) => (
                    <span key={name} className={`text-[7px] font-black uppercase tracking-widest transition-colors duration-300 ${tier === name.toLowerCase() ? c.text : 'text-gray-700'}`}>
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Tier features list */}
            <div className={`rounded-[2rem] border bg-surface/15 backdrop-blur-xl p-6 md:p-8 transition-all duration-500 ${c.cardBorder}`}>
              <div className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 mb-5">
                {t('projectsPage.pricing.includedLabel')}
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={tier}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                >
                  {Array.isArray(tierFeatures) && tierFeatures.map((feat, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
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

            {/* Extra services */}
            <div className={`rounded-[2rem] border bg-surface/15 backdrop-blur-xl p-6 md:p-8 transition-all duration-500 ${c.cardBorder}`}>
              <div className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 mb-5">
                {t('projectsPage.pricing.extrasSection')}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {EXTRAS.map((extra) => {
                  const avail = !(tier === 'corporate' && !extra.okCorp);
                  const checked = selected.has(extra.key);
                  const { Icon } = extra;
                  const isMultilang = extra.key === 'multilang';
                  const showTip = tooltipKey === extra.key;

                  return (
                    <div key={extra.key} className="relative">
                      <motion.div
                        whileTap={avail ? { scale: 0.97 } : {}}
                        onClick={() => toggleExtra(extra.key, avail)}
                        className={`
                          flex items-start gap-3 px-4 py-3 rounded-xl border text-left w-full transition-all duration-200 cursor-pointer select-none
                          ${!avail ? 'opacity-25 cursor-not-allowed border-white/5 bg-white/[0.02]' : ''}
                          ${avail && checked  ? 'border-white/18 bg-white/5'  : ''}
                          ${avail && !checked ? 'border-white/8 bg-white/[0.02] hover:border-white/15 hover:bg-white/4' : ''}
                        `}
                      >
                        {/* Checkbox */}
                        <div className={`shrink-0 mt-0.5 w-4 h-4 rounded border flex items-center justify-center transition-all duration-200
                          ${checked && avail ? `${c.check} border-[1.5px]` : 'border-white/20 bg-white/3'}
                        `}>
                          {checked && avail && <Check size={9} className={c.checkIcon} />}
                          {!avail && <Ban size={8} className="text-gray-600" />}
                        </div>

                        <Icon size={14} className={`shrink-0 mt-0.5 ${avail ? (checked ? c.text : 'text-gray-500') : 'text-gray-700'}`} />

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className={`text-xs font-medium leading-snug ${avail ? 'text-gray-300' : 'text-gray-600'}`}>
                              {t(`projectsPage.pricing.extras.${extra.key}`)}
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

                          {/* Multilang language counter */}
                          {isMultilang && checked && (
                            <div
                              className="flex items-center gap-1.5 mt-1.5"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                onClick={() => setLangCount((n) => Math.max(2, n - 1))}
                                disabled={langCount <= 2}
                                className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all duration-150 disabled:opacity-30 ${c.border} bg-white/5 hover:bg-white/10`}
                              >
                                <Minus size={9} className="text-gray-400" />
                              </button>
                              <span className={`text-[10px] font-black min-w-[52px] text-center ${c.text}`}>
                                {langCount} {t('projectsPage.pricing.langLabel')}
                              </span>
                              <button
                                onClick={() => setLangCount((n) => Math.min(6, n + 1))}
                                disabled={langCount >= 6}
                                className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all duration-150 disabled:opacity-30 ${c.border} bg-white/5 hover:bg-white/10`}
                              >
                                <Plus size={9} className="text-gray-400" />
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Price */}
                        <span className={`text-[10px] font-black shrink-0 self-start mt-0.5 ${avail ? (checked ? c.text : 'text-gray-500') : 'text-gray-700'}`}>
                          {isMultilang
                            ? (checked
                                ? `+$${(langCount - 1) * 100}`
                                : `+$100${t('projectsPage.pricing.perLang')}`)
                            : `+$${extra.price}`
                          }
                        </span>
                      </motion.div>

                      {/* Tooltip */}
                      <AnimatePresence>
                        {showTip && (
                          <motion.div
                            initial={{ opacity: 0, y: 6, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 6, scale: 0.96 }}
                            transition={{ duration: 0.15 }}
                            onClick={(e) => e.stopPropagation()}
                            onMouseDown={(e) => e.stopPropagation()}
                            className="absolute bottom-full left-0 right-0 z-50 mb-2 px-3 py-2.5 rounded-xl bg-[#14151f] border border-white/15 text-[10px] text-gray-300 leading-relaxed shadow-2xl"
                          >
                            {t(`projectsPage.pricing.extrasDesc.${extra.key}`)}
                            <div className="absolute top-full left-4 w-2 h-2 bg-[#14151f] border-r border-b border-white/15 rotate-45 -mt-[5px]" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>

              {tier === 'corporate' && (
                <p className="text-[10px] text-gray-600 mt-4 flex items-center gap-2">
                  <Ban size={10} />
                  {t('projectsPage.pricing.corporateDisabledNote')}
                </p>
              )}
            </div>

            {/* Maintenance toggle */}
            <div className={`rounded-[2rem] border bg-surface/15 backdrop-blur-xl p-6 md:p-8 transition-all duration-500 ${c.cardBorder}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <span className={`text-sm font-black transition-colors duration-300 ${maintenance ? c.text : 'text-gray-300'}`}>
                      {t('projectsPage.pricing.maintTitle')}
                    </span>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={tier + '-m'}
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.85 }}
                        transition={{ duration: 0.15 }}
                        className={`text-[10px] font-black px-2 py-0.5 rounded-lg border transition-all duration-300 ${maintenance ? c.badge : 'bg-white/5 border-white/10 text-gray-500'}`}
                      >
                        ${MAINT[tier]}/mo
                      </motion.div>
                    </AnimatePresence>
                  </div>
                  <p className="text-gray-600 text-xs">{t('projectsPage.pricing.maintSub')}</p>
                </div>

                {/* Toggle */}
                <button
                  onClick={() => setMaintenance((m) => !m)}
                  className={`relative shrink-0 w-12 h-6 rounded-full transition-all duration-300 ${maintenance ? c.progress : 'bg-white/10'}`}
                >
                  <motion.div
                    className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md"
                    animate={{ left: maintenance ? '26px' : '4px' }}
                    transition={{ type: 'spring', stiffness: 320, damping: 26 }}
                  />
                </button>
              </div>

              {/* Expandable details */}
              <button
                onClick={() => setMaintOpen((o) => !o)}
                className="flex items-center gap-2 mt-4 text-[10px] font-black uppercase tracking-widest text-gray-600 hover:text-gray-400 transition-colors"
              >
                <motion.div animate={{ rotate: maintOpen ? 180 : 0 }} transition={{ duration: 0.22 }}>
                  <ChevronDown size={12} />
                </motion.div>
                {t('projectsPage.pricing.maintExpand')}
              </button>

              <AnimatePresence>
                {maintOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-col gap-2.5 mt-4 pt-4 border-t border-white/5">
                      {[
                        { Icon: Headphones, key: 'maintInclude1' },
                        { Icon: RefreshCw,  key: 'maintInclude2' },
                        { Icon: Server,     key: 'maintInclude3' },
                      ].map(({ Icon, key }) => (
                        <div key={key} className="flex items-center gap-2.5">
                          <Icon size={13} className={c.text} />
                          <span className="text-xs text-gray-400">{t(`projectsPage.pricing.${key}`)}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* ══ RIGHT: Price summary (sticky on desktop) ══ */}
          <div className="lg:sticky lg:top-28">
            <div className={`relative rounded-[2rem] border bg-surface/25 backdrop-blur-xl p-6 md:p-8 overflow-hidden transition-all duration-500 ${c.cardBorder} ${c.glow}`}>
              {/* Shimmer line */}
              <div className={`absolute top-0 left-0 right-0 h-px ${c.shimmer}`} />

              {/* Exclusive pin */}
              {c.pin && (
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.25em] mb-4 ${c.badge}`}>
                  <Sparkles size={9} />
                  {c.pin}
                </div>
              )}

              {/* Tier label */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={tier + '-label'}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.18 }}
                  className="mb-5"
                >
                  <div className={`text-[10px] font-black uppercase tracking-[0.35em] mb-1 transition-colors duration-500 ${c.text}`}>
                    {t(`projectsPage.pricing.${tier}.tierName`)}
                  </div>
                  <div className="text-gray-600 text-xs">
                    {pages} {t('projectsPage.pricing.pages')} · {t(`projectsPage.pricing.${tier}.tagline`)}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Big animated price */}
              <div className="mb-5">
                <div className="text-[9px] font-black uppercase tracking-[0.25em] text-gray-600 mb-1">
                  {t('projectsPage.pricing.totalLabel')}
                </div>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={total}
                    initial={{ opacity: 0, y: -12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 12 }}
                    transition={{ duration: 0.18 }}
                    className={`text-5xl font-display font-black tracking-tighter transition-colors duration-500 ${c.text}`}
                  >
                    {fmt(total)}
                  </motion.div>
                </AnimatePresence>
                <div className="text-[9px] text-gray-600 mt-1">
                  {t('projectsPage.pricing.oneTime')} · ≈ {fmt(perPage)}/{t('projectsPage.pricing.perPage')}
                </div>
              </div>

              {/* Breakdown */}
              <div className="space-y-2 py-4 border-t border-b border-white/6 mb-5">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">{t('projectsPage.pricing.baseLabel')}</span>
                  <span className="text-gray-300 font-medium">{fmt(base)}</span>
                </div>
                <AnimatePresence>
                  {extTotal > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex justify-between text-xs overflow-hidden"
                    >
                      <span className="text-gray-500">{t('projectsPage.pricing.extrasBreakdown')}</span>
                      <span className="text-gray-300 font-medium">+{fmt(extTotal)}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Maintenance line */}
              <div className="mb-7">
                <div className={`flex items-center justify-between py-3 px-4 rounded-xl border transition-all duration-300 ${maintenance ? c.border + ' bg-white/4' : 'border-white/6 bg-white/[0.02]'}`}>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full transition-all duration-300 ${maintenance ? c.maintDot : 'bg-gray-700'}`} />
                    <span className="text-xs text-gray-500">{t('projectsPage.pricing.maintTitle')}</span>
                  </div>
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={tier + String(maintenance)}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.14 }}
                      className={`text-xs font-black transition-colors duration-300 ${maintenance ? c.text : 'text-gray-600'}`}
                    >
                      {maintenance ? `+${fmt(MAINT[tier])}/mo` : t('projectsPage.pricing.maintOff')}
                    </motion.span>
                  </AnimatePresence>
                </div>
              </div>

              {/* CTA */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleProceed}
                className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-black text-[11px] uppercase tracking-[0.1em] transition-all duration-300 ${c.cta}`}
              >
                {t('projectsPage.pricing.cta')}
                <ArrowRight size={14} />
              </motion.button>

              <p className="text-center text-[9px] text-gray-600 mt-3">
                {t('projectsPage.pricing.ctaNote')}
              </p>
            </div>
          </div>
        </div>

        {/* 20+ enterprise note */}
        <ScrollReveal className="mt-10 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl border border-white/8 bg-white/[0.02]">
            <Sparkles size={11} className="text-gray-500 shrink-0" />
            <p className="text-xs text-gray-500">
              {t('projectsPage.pricing.enterpriseNote')}
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default ProjectsPricing;
