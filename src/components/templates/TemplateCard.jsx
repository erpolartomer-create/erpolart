import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowUpRight, ShieldCheck, ExternalLink, Info,
  Crown, Star, Zap, Clock, Briefcase
} from 'lucide-react';
import useUIStore from '../../store/uiStore';

const TemplateCard = forwardRef(({ template, index = 0 }, ref) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const theme = useUIStore((state) => state.theme);
  const isDark = theme === 'dark';

  const getTierConfig = (tierNum) => {
    const n = Number(tierNum) || 2;

    // ── Tier 4: PLATINUM ──────────────────────────────────────────
    if (n === 4) return {
      id: 'platinum',
      name: t('templatesPage.tiers.platinum'),
      cardBg: isDark ? '#07070c' : '#f8f8fc',
      cardClass: isDark
        ? 'border-white/15 shadow-[0_0_50px_-25px_rgba(255,255,255,0.2)] hover:border-white/55 hover:shadow-[0_0_90px_-20px_rgba(255,255,255,0.35)] transition-all duration-1000'
        : 'border-black/8 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.12)] hover:border-black/20 hover:shadow-[0_16px_60px_-12px_rgba(0,0,0,0.18)] transition-all duration-1000',
      badgeClass: 'bg-gradient-to-r from-slate-200 via-white to-slate-300 text-slate-950 shadow-[0_4px_20px_rgba(255,255,255,0.35)]',
      dotColor: isDark ? 'bg-white' : 'bg-slate-700',
      catColor: isDark ? 'text-slate-300' : 'text-slate-600',
      priceColor: isDark ? 'text-white' : 'text-slate-900',
      btnClass: isDark
        ? 'bg-gradient-to-r from-slate-700 via-slate-500 to-slate-700 text-white hover:from-white hover:via-slate-100 hover:to-white hover:text-slate-950 shadow-lg shadow-black/40'
        : 'bg-gradient-to-r from-slate-800 via-slate-700 to-slate-900 text-pure-white hover:from-slate-700 hover:via-slate-600 hover:to-slate-800 shadow-lg shadow-slate-900/25',
      detailsBtnClass: isDark
        ? 'bg-white/[0.04] border-white/[0.08] text-gray-500 hover:text-white hover:border-white/20 hover:bg-white/[0.07]'
        : 'bg-black/[0.03] border-black/[0.08] text-gray-500 hover:text-slate-800 hover:border-slate-400/40 hover:bg-black/[0.06]',
      shimmerColor: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.06)',
      clockColor: isDark ? 'text-slate-300' : 'text-slate-400',
      Icon: Crown,
      watermark: 'PLAT',
      watermarkColor: isDark ? 'text-white/[0.04]' : 'text-black/[0.04]',
      breath: 'radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.15) 0%, transparent 70%)',
    };

    // ── Tier 3: PREMIUM ───────────────────────────────────────────
    if (n === 3) return {
      id: 'premium',
      name: t('templatesPage.tiers.premium'),
      cardBg: isDark ? '#0d0900' : '#fffdf5',
      cardClass: isDark
        ? 'border-amber-500/30 shadow-[0_0_50px_-25px_rgba(245,158,11,0.25)] hover:border-amber-400/80 hover:shadow-[0_0_80px_-15px_rgba(245,158,11,0.5)] transition-all duration-700'
        : 'border-amber-300/50 shadow-[0_8px_40px_-12px_rgba(245,158,11,0.15)] hover:border-amber-400/80 hover:shadow-[0_16px_60px_-12px_rgba(245,158,11,0.3)] transition-all duration-700',
      badgeClass: 'bg-gradient-to-r from-amber-300 via-amber-400 to-amber-600 text-slate-950 shadow-[0_4px_20px_rgba(245,158,11,0.55)]',
      dotColor: 'bg-amber-400',
      catColor: 'text-amber-500',
      priceColor: isDark ? 'text-amber-400' : 'text-amber-600',
      btnClass: isDark
        ? 'bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 hover:brightness-105 shadow-lg shadow-amber-600/30'
        : 'bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-pure-white hover:brightness-105 shadow-lg shadow-amber-600/35',
      detailsBtnClass: isDark
        ? 'bg-white/[0.04] border-white/[0.08] text-gray-500 hover:text-amber-400 hover:border-amber-500/30 hover:bg-white/[0.07]'
        : 'bg-black/[0.03] border-black/[0.08] text-gray-500 hover:text-amber-600 hover:border-amber-400/40 hover:bg-amber-50/50',
      shimmerColor: isDark ? 'rgba(245,158,11,0.3)' : 'rgba(245,158,11,0.15)',
      clockColor: 'text-amber-400',
      Icon: Star,
      watermark: 'GOLD',
      watermarkColor: isDark ? 'text-amber-400/[0.06]' : 'text-amber-500/[0.08]',
      ribbon: true,
      breath: 'linear-gradient(to top, rgba(245,158,11,0.08), transparent)',
      breathBottom: true,
    };

    // ── Tier 2: PRO ───────────────────────────────────────────────
    if (n === 2) return {
      id: 'pro',
      name: t('templatesPage.tiers.pro'),
      cardBg: isDark ? '#090910' : '#f7f7ff',
      cardClass: isDark
        ? 'border-indigo/15 hover:border-indigo/65 hover:shadow-[0_0_70px_-20px_rgba(59,88,255,0.4)] transition-all duration-700'
        : 'border-indigo/20 shadow-[0_8px_40px_-12px_rgba(59,88,255,0.1)] hover:border-indigo/50 hover:shadow-[0_16px_60px_-12px_rgba(59,88,255,0.25)] transition-all duration-700',
      badgeClass: 'bg-indigo text-pure-white shadow-[0_4px_15px_rgba(59,88,255,0.45)]',
      dotColor: 'bg-indigo',
      catColor: 'text-indigo',
      priceColor: 'text-indigo',
      btnClass: isDark
        ? 'bg-gradient-to-r from-indigo-600 to-indigo-800 text-pure-white hover:brightness-110 shadow-lg shadow-indigo/25'
        : 'bg-gradient-to-r from-indigo to-indigo-700 text-pure-white hover:brightness-110 shadow-lg shadow-indigo/30',
      detailsBtnClass: isDark
        ? 'bg-white/[0.04] border-white/[0.08] text-gray-500 hover:text-indigo hover:border-indigo/30 hover:bg-white/[0.07]'
        : 'bg-black/[0.03] border-black/[0.08] text-gray-500 hover:text-indigo hover:border-indigo/30 hover:bg-indigo/[0.04]',
      shimmerColor: isDark ? 'rgba(59,88,255,0.2)' : 'rgba(59,88,255,0.1)',
      clockColor: 'text-cyan',
      Icon: Zap,
      watermark: 'PRO',
      watermarkColor: isDark ? 'text-indigo/[0.07]' : 'text-indigo/[0.08]',
    };

    // ── Tier 1: CORPORATE ─────────────────────────────────────────
    return {
      id: 'corporate',
      name: t('templatesPage.tiers.corporate'),
      cardBg: isDark ? '#050a0d' : '#f4fbfd',
      cardClass: isDark
        ? 'border-cyan/15 hover:border-cyan/55 hover:shadow-[0_0_70px_-20px_rgba(0,230,210,0.3)] transition-all duration-700'
        : 'border-cyan/25 shadow-[0_8px_40px_-12px_rgba(0,179,166,0.12)] hover:border-cyan/60 hover:shadow-[0_16px_60px_-12px_rgba(0,179,166,0.28)] transition-all duration-700',
      badgeClass: isDark
        ? 'bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-500 text-slate-950 shadow-[0_4px_15px_rgba(0,230,210,0.4)]'
        : 'bg-gradient-to-r from-cyan-500 via-teal-400 to-cyan-600 text-pure-white shadow-[0_4px_15px_rgba(0,179,166,0.4)]',
      dotColor: 'bg-cyan',
      catColor: isDark ? 'text-cyan' : 'text-teal-600',
      priceColor: isDark ? 'text-cyan' : 'text-teal-600',
      btnClass: isDark
        ? 'bg-gradient-to-r from-cyan-600 via-teal-500 to-cyan-700 text-pure-white hover:brightness-110 shadow-lg shadow-cyan/20'
        : 'bg-gradient-to-r from-teal-500 via-cyan-500 to-teal-600 text-pure-white hover:brightness-110 shadow-lg shadow-teal-500/30',
      detailsBtnClass: isDark
        ? 'bg-white/[0.04] border-white/[0.08] text-gray-500 hover:text-cyan hover:border-cyan/30 hover:bg-cyan/[0.04]'
        : 'bg-black/[0.03] border-black/[0.08] text-gray-500 hover:text-teal-600 hover:border-teal-400/40 hover:bg-teal-50/50',
      shimmerColor: isDark ? 'rgba(0,230,210,0.2)' : 'rgba(0,179,166,0.12)',
      clockColor: isDark ? 'text-cyan' : 'text-teal-500',
      Icon: Briefcase,
      watermark: 'CORP',
      watermarkColor: isDark ? 'text-cyan/[0.06]' : 'text-teal-500/[0.07]',
    };
  };

  const tier = getTierConfig(template.tier);
  const isSold = template.is_sold || template.status === 'sold';

  const getLocalizedValue = (field, fallback) => {
    const lang = i18n.language || 'tr';
    let data = field;
    if (typeof field === 'string' && field.trim().startsWith('{')) {
      try { data = JSON.parse(field); } catch { data = field; }
    }
    if (typeof data === 'object' && data !== null) {
      return data[lang] || data['en'] || data['tr'] || '';
    }
    return template[fallback] || data || '';
  };

  const handleOpenDetails = () => navigate(`/templates/${template.id}`);

  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.93 }}
      transition={{ duration: 0.6, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="h-full relative"
    >
      {/* ── PREMIUM: corner ribbon ── */}
      {!isSold && tier.ribbon && (
        <div className="absolute top-0 right-0 w-24 h-24 overflow-hidden rounded-tr-[2rem] z-[60] pointer-events-none">
          <div className="absolute top-3.5 right-[-22px] bg-gradient-to-r from-amber-400 to-amber-600 text-slate-950 text-[7px] font-black uppercase tracking-[0.2em] px-8 py-1.5 rotate-45 shadow-md">
            PREMIUM
          </div>
        </div>
      )}

      {/* ── MAIN CARD ── */}
      <div
        className={`group relative flex flex-col h-full rounded-[2rem] overflow-hidden border ${tier.cardClass} ${isSold ? '!border-white/5 !shadow-none' : ''}`}
        style={{ background: tier.cardBg }}
      >
        {/* Desaturate + dim when sold */}
        <div className={`flex flex-col h-full transition-all duration-700 ${isSold ? 'grayscale-[0.65] brightness-[0.5]' : ''}`}>

          {/* ─── IMAGE SECTION ─── */}
          <div className="relative overflow-hidden" style={{ aspectRatio: '4/3' }}>
            <img
              src={template.image_url || template.preview_image || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800'}
              alt={template.name}
              loading="lazy"
              className={`absolute inset-0 w-full h-full object-cover object-top transition-transform duration-[3s] group-hover:scale-[1.06] ${isSold ? 'opacity-50' : 'opacity-100'}`}
            />

            {/* Seamless gradient: image fades into panel background */}
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(to top, ${tier.cardBg} 0%, ${tier.cardBg}cc 8%, transparent 55%)`,
              }}
            />

            {/* Tier badge — top left */}
            <div className="absolute top-4 left-4 z-20">
              <div className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.18em] ${isSold ? 'bg-gray-800/50 text-gray-500 shadow-none' : tier.badgeClass}`}>
                <tier.Icon size={11} fill="currentColor" />
                {tier.name}
              </div>
            </div>

            {/* Ready badge — top right (only for corporate & pro tiers) */}
            {tier.id !== 'premium' && tier.id !== 'platinum' && (
              <div className="absolute top-4 right-4 z-20">
                <div className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest backdrop-blur-md border ${isSold ? 'bg-black/30 border-white/5 text-gray-700' : 'bg-black/50 border-white/10 text-pure-white'}`}>
                  <Clock size={9} className={isSold ? 'text-gray-700' : `${tier.clockColor} animate-pulse`} />
                  {t('templatesPage.modal.ready')}
                </div>
              </div>
            )}

            {/* Hover: central detail circle */}
            {!isSold && (
              <div
                onClick={handleOpenDetails}
                className="absolute inset-0 flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition-all duration-500 cursor-pointer"
              >
                <div className="w-[72px] h-[72px] rounded-full bg-white/10 backdrop-blur-xl border border-white/25 flex flex-col items-center justify-center gap-1.5 scale-90 group-hover:scale-100 transition-transform duration-500">
                  <ExternalLink size={20} className="text-white" />
                  <span className="text-[7px] font-black uppercase tracking-widest text-white/80">DETAY</span>
                </div>
              </div>
            )}
          </div>

          {/* ─── INFO SECTION ─── */}
          <div className="relative flex flex-col flex-1 px-6 pt-3 pb-6 overflow-hidden">

            {/* Tier watermark behind content */}
            <div
              className={`absolute right-3 bottom-14 text-[72px] font-display font-black italic select-none pointer-events-none leading-none ${tier.watermarkColor}`}
            >
              {tier.watermark}
            </div>

            {/* Category row */}
            <div className="flex items-center gap-2 mb-3 relative z-10">
              <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isSold ? 'bg-gray-700' : tier.dotColor} ${!isSold && tier.id !== 'pro' ? 'animate-pulse' : ''}`} />
              <span className={`text-[9px] font-black uppercase tracking-[0.35em] ${isSold ? 'text-gray-700' : tier.catColor}`}>
                {template.category?.toUpperCase() || 'DIGITAL ASSET'}
              </span>
              <div className={`h-px flex-1 ${isDark ? 'bg-white/[0.05]' : 'bg-black/[0.06]'}`} />
            </div>

            {/* Title */}
            <h3
              className={`text-[1.55rem] font-display font-black italic tracking-tight leading-tight mb-2.5 relative z-10 transition-all duration-500 ${
                isSold
                  ? 'text-gray-600'
                  : isDark
                    ? 'text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white/50'
                    : 'text-gray-900 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-gray-900 group-hover:to-gray-600'
              }`}
            >
              {template.name}
            </h3>

            {/* Description */}
            <p className={`text-[13px] leading-relaxed line-clamp-2 mb-5 relative z-10 ${isSold ? 'text-gray-700' : isDark ? 'text-gray-400/80' : 'text-gray-500'}`}>
              {getLocalizedValue(template.short_pitch, 'description')}
            </p>

            {/* ── Bottom row: price + buttons ── */}
            <div className="flex items-end gap-4 mt-auto relative z-10">
              {/* Price */}
              {!isSold && (
                <div className="flex flex-col shrink-0">
                  <span className="text-[8px] font-black uppercase tracking-[0.3em] text-gray-600 mb-0.5">Fiyat</span>
                  <span className={`text-2xl font-display font-black italic leading-none ${tier.priceColor}`}>
                    ${template.price?.toString().replace('$', '')}
                  </span>
                </div>
              )}

              {/* Buttons */}
              <div className={`flex gap-2 ${isSold ? 'w-full' : 'flex-1'}`}>
                <button
                  onClick={handleOpenDetails}
                  className={`flex-1 py-3.5 rounded-xl border text-[9px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all duration-400 ${
                    isSold
                      ? 'bg-white/[0.02] border-white/5 text-gray-700'
                      : tier.detailsBtnClass
                  }`}
                >
                  <Info size={12} />
                  {t('templatesPage.details')}
                </button>

                {!isSold && (
                  <button
                    onClick={() => navigate(`/checkout/${template.id}`)}
                    className={`flex-1 py-3.5 rounded-xl text-[9px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 hover:scale-[1.02] active:scale-[0.99] transition-all duration-300 group/buy ${tier.btnClass}`}
                  >
                    {t('latest.buyNow')}
                    <ArrowUpRight size={12} className="group-hover/buy:translate-x-0.5 group-hover/buy:-translate-y-0.5 transition-transform duration-200" />
                  </button>
                )}
              </div>
            </div>

            {isSold && (
              <p className="text-[9px] text-gray-700 font-bold uppercase tracking-[0.2em] text-center mt-3 italic relative z-10">
                Similar assets can be requested.
              </p>
            )}
          </div>
        </div>

        {/* ─── SOLD OVERLAY ─── */}
        {isSold && (
          <>
            <div className="absolute inset-0 bg-black/15 backdrop-blur-[1px] z-[45] pointer-events-none" />
            <div className="absolute inset-x-0 top-[14%] z-[60] flex items-center justify-center pointer-events-none px-6">
              <motion.div
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative w-full max-w-[270px] rotate-[-12deg]"
              >
                <div className="absolute inset-[-1px] bg-gradient-to-br from-white/25 via-transparent to-white/8 rounded-2xl blur-[1px]" />
                <div className="bg-gray-950/95 backdrop-blur-3xl border border-white/8 p-6 rounded-2xl shadow-[0_0_60px_rgba(0,0,0,0.9)] flex flex-col items-center">
                  <div className="w-12 h-12 mb-3 rounded-full border border-red-500/50 flex items-center justify-center bg-red-500/10 animate-pulse shadow-[0_0_35px_rgba(239,68,68,0.35)]">
                    <ShieldCheck size={22} className="text-red-400" />
                  </div>
                  <p className="text-[11px] font-black text-white uppercase tracking-[0.4em] italic mb-1">Project</p>
                  <p className="text-[22px] font-black text-white uppercase tracking-[0.2em] italic drop-shadow-[0_0_20px_rgba(255,255,255,0.35)]">
                    {t('status.acquired')}
                  </p>
                  <motion.div
                    animate={{ opacity: [0.3, 0.7, 0.3] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute bottom-[-30px] left-1/2 -translate-x-1/2 w-44 h-10 bg-red-600/25 blur-2xl rounded-full"
                  />
                </div>
              </motion.div>
            </div>
          </>
        )}

        {/* ─── SHIMMER on hover (available only) ─── */}
        {!isSold && (
          <div className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[2rem] overflow-hidden">
            <motion.div
              animate={{ x: ['-130%', '130%'] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'linear', repeatDelay: 1 }}
              style={{ background: `linear-gradient(105deg, transparent 30%, ${tier.shimmerColor} 50%, transparent 70%)` }}
              className="absolute inset-0"
            />
          </div>
        )}

        {/* ─── Tier ambient breath ─── */}
        {!isSold && tier.breath && !tier.breathBottom && (
          <motion.div
            animate={{ opacity: [0.06, 0.14, 0.06] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 pointer-events-none rounded-[2rem] overflow-hidden -z-0"
            style={{ background: tier.breath }}
          />
        )}
        {!isSold && tier.breath && tier.breathBottom && (
          <motion.div
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none -z-0"
            style={{ background: tier.breath }}
          />
        )}
      </div>
    </motion.div>
  );
});

export default TemplateCard;
