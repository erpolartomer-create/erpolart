import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Target, Zap, Smartphone, Fingerprint } from 'lucide-react';
import ScrollReveal from '../ScrollReveal';
import useUIStore from '../../store/uiStore';

const DesignManifesto = () => {
  const { t } = useTranslation();
  const theme = useUIStore((state) => state.theme);

  const cards = [
    {
      number: '01', icon: Target, stat: '100%',
      titleKey: 'p1Title', descKey: 'p1Desc', statLabel: 'purposeVisual',
      color: 'indigo', textColor: 'text-indigo',
      iconBg: 'bg-indigo/10', iconBorder: 'border-indigo/25',
      hoverBorder: 'group-hover:border-indigo/40',
      statGlow: 'rgba(92,115,255,0.18)',
      glowBg: 'rgba(92,115,255,0.06)',
      size: 'large',
    },
    {
      number: '02', icon: Zap, stat: '<2s',
      titleKey: 'p2Title', descKey: 'p2Desc', statLabel: 'speedVisual',
      color: 'cyan', textColor: 'text-cyan',
      iconBg: 'bg-cyan/10', iconBorder: 'border-cyan/25',
      hoverBorder: 'group-hover:border-cyan/40',
      statGlow: 'rgba(0,179,166,0.18)',
      glowBg: 'rgba(0,179,166,0.06)',
      size: 'small',
    },
    {
      number: '03', icon: Smartphone, stat: '∞',
      titleKey: 'p3Title', descKey: 'p3Desc', statLabel: 'mobileVisual',
      color: 'violet', textColor: 'text-violet',
      iconBg: 'bg-violet/10', iconBorder: 'border-violet/25',
      hoverBorder: 'group-hover:border-violet/40',
      statGlow: 'rgba(139,92,246,0.18)',
      glowBg: 'rgba(139,92,246,0.06)',
      size: 'small',
    },
    {
      number: '04', icon: Fingerprint, stat: '1/1',
      titleKey: 'p4Title', descKey: 'p4Desc', statLabel: 'uniqueVisual',
      color: 'white', textColor: 'text-white',
      iconBg: 'bg-white/8', iconBorder: 'border-white/15',
      hoverBorder: 'group-hover:border-white/30',
      statGlow: 'rgba(255,255,255,0.12)',
      glowBg: 'rgba(255,255,255,0.03)',
      size: 'large',
    },
  ];

  return (
    <section className="py-24 md:py-36 relative">
      {/* Ambient glows */}
      <div className="absolute top-1/4 left-0 w-[600px] h-[600px] bg-indigo/6 rounded-full blur-[200px] pointer-events-none -translate-x-1/2" />
      <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-violet/6 rounded-full blur-[200px] pointer-events-none translate-x-1/2" />

      {/* Header */}
      <ScrollReveal className="text-center mb-16 md:mb-24 max-w-3xl mx-auto px-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo/10 border border-indigo/20 text-indigo text-[10px] font-black uppercase tracking-[0.3em] mb-8">
          {t('projectsPage.manifesto.badge')}
        </div>
        <h2 className={`text-4xl md:text-[72px] font-display font-black leading-[0.9] tracking-tighter italic pt-2 ${
          theme === 'dark'
            ? 'text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-200 to-slate-400'
            : 'text-black'
        }`}>
          {t('projectsPage.manifesto.title')}
        </h2>
      </ScrollReveal>

      {/* Bento Grid */}
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-4 auto-rows-fr">

        {cards.map((card, i) => {
          const Icon = card.icon;
          const isLarge = card.size === 'large';
          const colSpan = isLarge ? 'md:col-span-7' : 'md:col-span-5';
          const isReversed = i >= 2;

          return (
            <ScrollReveal
              key={card.number}
              delay={i * 0.07}
              className={colSpan}
              direction={isReversed ? (isLarge ? 'left' : 'right') : (isLarge ? 'right' : 'left')}
            >
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className={`relative bg-surface/25 backdrop-blur-xl border border-white/6 ${card.hoverBorder} hover:shadow-2xl transition-all duration-500 group cursor-default rounded-[2rem] overflow-hidden h-full min-h-[280px] md:min-h-[300px] flex flex-col`}
              >
                {/* Hover glow layer */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `radial-gradient(ellipse at 50% 0%, ${card.statGlow}, transparent 60%)` }}
                />

                {/* Large stat — hero visual in background */}
                <div
                  className={`absolute -top-4 -right-3 font-display font-black leading-none select-none pointer-events-none ${card.textColor} transition-all duration-500`}
                  style={{
                    fontSize: isLarge ? 'clamp(4rem, 12vw, 11rem)' : 'clamp(3.5rem, 8vw, 8rem)',
                    opacity: 0.06,
                  }}
                >
                  {card.stat}
                </div>

                {isLarge ? (
                  /* Large card: icon+number top, title+desc bottom */
                  <>
                    <div className="p-8 md:p-12 flex-1 flex flex-col gap-6 md:gap-0 md:justify-between relative z-10">
                      <div className="flex items-center gap-3">
                        <div className={`w-11 h-11 rounded-xl ${card.iconBg} border ${card.iconBorder} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                          <Icon size={20} className={card.textColor} />
                        </div>
                        <span className={`text-[10px] font-black uppercase tracking-[0.35em] ${card.textColor} opacity-60`}>
                          {card.number}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-2xl md:text-3xl font-display font-black italic text-white tracking-tight leading-tight mb-3">
                          {t(`projectsPage.manifesto.${card.titleKey}`)}
                        </h3>
                        <p className="text-gray-500 text-sm md:text-base leading-relaxed group-hover:text-gray-400 transition-colors duration-300">
                          {t(`projectsPage.manifesto.${card.descKey}`)}
                        </p>
                      </div>
                    </div>

                    {/* Bottom accent strip */}
                    <div className={`h-[2px] w-0 group-hover:w-full transition-all duration-700 ${card.iconBg.replace('/10', '')} opacity-60`} />
                  </>
                ) : (
                  /* Small card: centered stat + icon + label */
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-10 relative z-10 gap-5">
                    <div className={`w-14 h-14 rounded-2xl ${card.iconBg} border ${card.iconBorder} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <Icon size={24} className={card.textColor} />
                    </div>

                    <div>
                      <div className={`font-display font-black text-[3.2rem] md:text-[3.8rem] italic leading-none ${card.textColor} mb-2 group-hover:drop-shadow-lg transition-all duration-300`}>
                        {card.stat}
                      </div>
                      <div className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-600 group-hover:text-gray-500 transition-colors">
                        {t(`projectsPage.manifesto.${card.statLabel}`)}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg md:text-xl font-display font-black italic text-white tracking-tight leading-tight mb-2">
                        {t(`projectsPage.manifesto.${card.titleKey}`)}
                      </h3>
                      <p className="text-gray-600 text-xs leading-relaxed group-hover:text-gray-500 transition-colors duration-300">
                        {t(`projectsPage.manifesto.${card.descKey}`)}
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
};

export default DesignManifesto;
