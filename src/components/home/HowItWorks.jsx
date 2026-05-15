import { Zap, ShieldCheck, ArrowRight, Bot, BarChart3, Workflow, Layers, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';
import ScrollReveal from '../ScrollReveal';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useUIStore from '../../store/uiStore';

const HowItWorks = () => {
  const { t } = useTranslation();
  const theme = useUIStore((state) => state.theme);

  const paths = [
    {
      id: '01',
      badge: t('howItWorks.path1'),
      title: t('howItWorks.path1Title'),
      titleAccent: t('howItWorks.path1TitleAccent'),
      desc: t('howItWorks.path1Desc'),
      explore: t('howItWorks.path1Explore'),
      link: '/templates',
      image: '/saas/signature_premium.webp',
      color: 'slate-200', // Platinum
      badges: [
        { icon: <Zap size={14} />, text: t('howItWorks.path1Badge1'), color: 'text-amber-400' },
        { icon: <ShieldCheck size={14} />, text: t('howItWorks.path1Badge2'), color: 'text-blue-400' }
      ],
      floating: {
        top: { icon: <Layers size={18} />, label: 'Exclusivity', value: '1 of 1' },
        bottom: { icon: <Zap size={16} />, label: 'Deployment', text: 'Instant Access' }
      }
    },
    {
      id: '02',
      badge: t('howItWorks.path2'),
      title: t('howItWorks.path2Title'),
      titleAccent: t('howItWorks.path2TitleAccent'),
      desc: t('howItWorks.path2Desc'),
      explore: t('howItWorks.path2Explore'),
      link: '/projects',
      image: '/saas/architecture_premium.webp',
      color: 'white', // Diamond/Nexus (Swapped)
      reverse: true,
      badges: [
        { icon: <Cpu size={14} />, text: t('howItWorks.path2Badge1') },
        { icon: <Workflow size={14} />, text: t('howItWorks.path2Badge2') }
      ],
      floating: {
        top: { icon: <BarChart3 size={18} />, label: 'Architecture', value: 'Scalable' },
        bottom: { icon: <Cpu size={16} />, label: 'System', text: 'Core Optimized' }
      }
    },
    {
      id: '03',
      badge: t('howItWorks.path3'),
      title: t('howItWorks.path3Title'),
      titleAccent: t('howItWorks.path3TitleAccent'),
      desc: t('howItWorks.path3Desc'),
      explore: t('howItWorks.path3Explore'),
      link: '/saas',
      image: '/saas/SaaS-project-development.webp',
      color: 'amber-500', // Gold (Swapped)
      badges: [
        { icon: <Bot size={14} />, text: t('howItWorks.path3Badge1') },
        { icon: <Layers size={14} />, text: t('howItWorks.path3Badge2') }
      ],
      floating: {
        top: { icon: <BarChart3 size={18} />, label: 'Conversion', value: '+24.8%' },
        bottom: { icon: <Bot size={16} />, label: 'Nexus AI', text: 'System Optimized' }
      }
    },
    {
      id: '04',
      badge: t('howItWorks.path4'),
      title: t('howItWorks.path4Title'),
      titleAccent: t('howItWorks.path4TitleAccent'),
      desc: t('howItWorks.path4Desc'),
      explore: t('howItWorks.path4Explore'),
      link: '/ai-automations',
      image: '/saas/ai_automations_premium.webp',
      color: 'emerald-400', // AI Automation
      reverse: true,
      badges: [
        { icon: <Cpu size={14} />, text: t('howItWorks.path4Badge1') },
        { icon: <Bot size={14} />, text: t('howItWorks.path4Badge2') }
      ],
      floating: {
        top: { icon: <Cpu size={18} />, label: 'Autonomous', value: 'Active' },
        bottom: { icon: <Workflow size={16} />, label: 'Workflow', text: 'Optimized' }
      }
    }
  ];

  const getPathColors = (color) => {
    switch (color) {
      case 'slate-200': // Platinum
        return {
          badgeBg: theme === 'dark' ? 'bg-white/5' : 'bg-black/5',
          badgeBorder: theme === 'dark' ? 'border-white/20' : 'border-black/20',
          badgeText: theme === 'dark' ? 'text-white' : 'text-black',
          glow: theme === 'dark' ? 'bg-white' : 'bg-black',
          gradient: theme === 'dark' ? 'from-white via-slate-200 to-slate-400' : 'from-black to-slate-500',
          ping: theme === 'dark' ? 'bg-white' : 'bg-black'
        };
      case 'amber-500': // Gold
        return {
          badgeBg: 'bg-amber-500/5', badgeBorder: 'border-amber-500/20', badgeText: 'text-amber-500',
          glow: 'bg-amber-500', gradient: 'from-amber-200 via-amber-400 to-amber-600',
          ping: 'bg-amber-500'
        };
      case 'white': // Diamond/Nexus
        return {
          badgeBg: theme === 'dark' ? 'bg-cyan/5' : 'bg-black/5',
          badgeBorder: theme === 'dark' ? 'border-cyan/20' : 'border-black/20',
          badgeText: theme === 'dark' ? 'text-cyan' : 'text-black',
          glow: theme === 'dark' ? 'bg-cyan' : 'bg-black',
          gradient: theme === 'dark' ? 'from-white via-cyan-200 to-indigo-400' : 'from-black via-cyan to-indigo',
          ping: theme === 'dark' ? 'bg-cyan' : 'bg-black'
        };
      case 'emerald-400': // AI Automation
        return {
          badgeBg: 'bg-emerald-400/5', badgeBorder: 'border-emerald-400/20', badgeText: 'text-emerald-400',
          glow: 'bg-emerald-400', gradient: 'from-emerald-300 via-emerald-500 to-teal-600',
          ping: 'bg-emerald-400'
        };
      default:
        return {
          badgeBg: 'bg-indigo/5', badgeBorder: 'border-indigo/20', badgeText: 'text-indigo',
          glow: 'bg-indigo', gradient: 'from-indigo via-violet to-cyan',
          ping: 'bg-indigo'
        };
    }
  };

  return (
    <section className="pt-48 pb-20 bg-transparent relative group/section overflow-x-clip transition-colors duration-500">
      {/* Top Transition Softener (Blends with Hero Section) */}
      <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-deep-black to-transparent z-10 pointer-events-none" />

      {/* SaaS-Style Background System */}
      <div className="absolute inset-0 bg-[linear-gradient(var(--grid-color)_1px,transparent_1px),linear-gradient(90deg,var(--grid-color)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      {/* Expansive Ambient decorative elements - Bridge to LatestReleases */}
      <div className="absolute top-0 left-0 w-[60vw] h-[60vw] bg-violet/15 rounded-full blur-[140px] -translate-y-1/2 -translate-x-1/4 pointer-events-none" />
      <div className="absolute top-1/3 right-[-15%] w-[50vw] h-[50vw] bg-indigo/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-[60vw] h-[60vw] bg-cyan/10 rounded-full blur-[150px] translate-x-1/4 pointer-events-none" />
      <div className="absolute bottom-1/2 left-[-15%] w-[40vw] h-[40vw] bg-rose-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[60vw] h-[60vw] bg-violet/15 rounded-full blur-[140px] translate-y-1/2 -translate-x-1/4 pointer-events-none" />

      <div className="container mx-auto px-4 md:px-12 relative z-20">
        <ScrollReveal>
          <div className="text-center max-w-4xl mx-auto mb-24 relative">
            <h2 className="text-4xl md:text-[72px] font-display font-black mb-8 text-white tracking-tighter italic leading-[0.9] transition-colors duration-500">
              {t('howItWorks.title')}
            </h2>
            <div className={`w-20 h-1 bg-gradient-to-r from-slate-200 via-white to-amber-500 mx-auto mb-10 rounded-full`} />
            <p className="text-muted-text text-sm md:text-base font-medium leading-relaxed opacity-80 transition-colors duration-500 max-w-2xl mx-auto">
              {t('howItWorks.subtitle')}
            </p>
          </div>
        </ScrollReveal>

        {paths.map((path, index) => {
          const colors = getPathColors(path.color);
          return (
            <div key={path.id} className="relative mb-32 md:mb-64 last:mb-0">
              <ScrollReveal direction={path.reverse ? 'right' : 'left'}>
                <div className={`flex flex-col lg:flex-row items-center gap-16 md:gap-16 lg:gap-32 ${path.reverse ? 'lg:flex-row-reverse' : ''}`}>

                  {/* Content Side */}
                  <div className={`w-full lg:w-[45%] space-y-2 md:space-y-10 relative`}>
                    {/* Broad Amber Glow for SaaS Text Content */}
                    {path.id === '03' && (
                      <div className="absolute inset-0 -top-20 -left-20 w-[120%] h-[120%] bg-amber-500/10 rounded-full blur-[100px] pointer-events-none -z-10" />
                    )}
                    <div className={`inline-flex items-center gap-3 px-6 py-2.5 rounded-full ${colors.badgeBg} border ${colors.badgeBorder} ${colors.badgeText} text-[10px] font-black uppercase tracking-[0.4em]`}>
                      <span className="relative flex h-2 w-2">
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${colors.ping} opacity-75`} />
                        <span className={`relative inline-flex rounded-full h-2 w-2 ${colors.ping}`} />
                      </span>
                      {path.badge}
                    </div>

                    <h3 className="text-4xl sm:text-6xl md:text-7xl lg:text-[4.5rem] font-display font-black text-white leading-[0.9] italic tracking-tighter mt-6 md:mt-0 py-0 md:py-4 transition-colors duration-500 relative">
                      {/* Targeted Amber Glow for SaaS Section - Moved SIGNIFICANTLY further left */}
                      {path.id === '03' && (
                        <div className="absolute -top-44 -left-96 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none z-0 animate-pulse" />
                      )}
                      {/* Targeted Emerald Glow for AI Section - Top Right - PROMINENT & STATIC */}
                      {path.id === '04' && (
                         <div className="absolute -top-80 -right-80 w-[900px] h-[900px] bg-emerald-500/20 rounded-full blur-[180px] pointer-events-none z-0" />
                      )}
                      <span className="block">{path.title}</span>
                      <span className={`inline-block text-transparent bg-clip-text bg-gradient-to-r ${colors.gradient} pr-4 py-2 whitespace-nowrap`}>
                        {path.titleAccent}
                      </span>
                    </h3>

                    <p className="text-muted-text text-sm md:text-base leading-relaxed font-medium max-w-xl opacity-80 transition-colors duration-500">
                      {t(`howItWorks.path${index + 1}Desc`)}
                    </p>

                    <div className="grid grid-cols-2 gap-3 md:gap-5 pt-0 md:pt-4">
                      {path.badges.map((b, i) => (
                        <div key={i} className={`flex items-center gap-3 md:gap-4 p-3 md:p-5 rounded-2xl md:rounded-[1.8rem] bg-surface/40 border border-border-adaptive hover:border-white/20 transition-all group/chip backdrop-blur-md shadow-lg shadow-black/20`}>
                          <div className={`w-8 h-8 md:w-10 md:h-10 rounded-xl ${colors.badgeBg} border ${colors.badgeBorder} flex items-center justify-center ${b.color || colors.badgeText} group-hover/chip:scale-110 transition-transform drop-shadow-[0_0_8px_rgba(var(--accent-rgb),0.5)]`}>
                            {b.icon}
                          </div>
                          <span className="text-[9px] md:text-[10px] font-black text-white/90 uppercase tracking-widest leading-tight transition-colors duration-500">{b.text}</span>
                        </div>
                      ))}
                    </div>

                    <div className="hidden lg:block pt-8">
                      <Link to={path.link} className="group relative inline-flex items-center gap-5 px-12 py-5 rounded-[1.8rem] bg-surface text-white font-black uppercase tracking-[0.2em] text-[11px] overflow-hidden hover:shadow-2xl transition-all border border-border-adaptive transition-colors duration-500">
                        <span className="relative z-10">{path.explore}</span>
                        <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1.5 transition-transform" />
                        <div className={`absolute inset-0 bg-gradient-to-r ${colors.gradient} opacity-0 group-hover:opacity-10 transition-opacity`} />
                      </Link>
                    </div>
                  </div>

                  {/* Visual Side */}
                  <div className="w-full lg:w-[55%] relative group">
                    {/* Atmospheric Glow - Color matched to Neural Network Visual (Cyan/Blue) */}
                    {path.id === '01' && (
                      <div className="absolute inset-0 -inset-x-20 bg-gradient-to-r from-cyan-400/20 via-blue-500/20 to-indigo-500/10 rounded-full blur-[160px] pointer-events-none -z-10" />
                    )}
                    <div className={`relative rounded-2xl md:rounded-[3rem] overflow-hidden border border-border-adaptive bg-surface shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] transition-all duration-1000 ${path.reverse ? 'lg:-rotate-1' : 'lg:rotate-1'} group-hover:rotate-0 group-hover:scale-[1.02]`}>
                      <div className="h-12 bg-surface border-b border-border-adaptive flex items-center px-6 gap-2">
                        <div className="flex gap-2">
                          <div className="w-3 h-3 rounded-full bg-red-500/20" />
                          <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                          <div className="w-3 h-3 rounded-full bg-green-500/20" />
                        </div>
                      </div>
                      <div className="aspect-[16/10] overflow-hidden bg-black relative">
                        <img
                          src={path.image}
                          alt={path.title}
                          className="w-full h-full object-cover object-center transition-all duration-[2s] group-hover:scale-105"
                        />
                        <div className={`absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000`} />
                      </div>
                    </div>

                    {/* Floating Cards */}
                    <motion.div
                      animate={{ y: [0, -12, 0] }}
                      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                      className={`absolute -top-8 left-1/2 -translate-x-1/2 md:translate-x-0 ${path.reverse ? 'md:-left-12' : 'md:-right-12'} flex z-20 scale-75 md:scale-100 origin-center md:origin-right`}
                    >
                      <div className="bg-surface/40 backdrop-blur-2xl border border-border-adaptive px-6 py-4 rounded-[1.5rem] shadow-xl flex items-center gap-5">
                        <div className={`w-11 h-11 rounded-xl ${colors.badgeBg} border ${colors.badgeBorder} flex items-center justify-center ${colors.badgeText}`}>
                          {path.floating.top.icon}
                        </div>
                        <div>
                          <div className="text-[9px] font-black text-muted-text uppercase tracking-[0.2em] mb-1">{path.floating.top.label}</div>
                          <div className="text-lg font-display font-black text-white italic tracking-tight">{path.floating.top.value}</div>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      animate={{ y: [0, 12, 0] }}
                      transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                      className={`absolute -bottom-10 ${path.reverse ? '-right-4' : '-left-4'} flex z-20 scale-75 md:scale-100 origin-center md:origin-left`}
                    >
                      <div className="bg-surface/40 backdrop-blur-2xl border border-border-adaptive px-6 py-5 rounded-[1.8rem] shadow-xl flex items-center gap-5">
                        <div className={`w-11 h-11 rounded-xl ${colors.badgeBg} border ${colors.badgeBorder} flex items-center justify-center ${colors.badgeText}`}>
                          {path.floating.bottom.icon}
                        </div>
                        <div>
                          <div className="text-[10px] font-black text-white tracking-[0.2em] uppercase mb-1">{path.floating.bottom.label}</div>
                          <div className="text-[10px] text-muted-text font-medium italic">{path.floating.bottom.text}</div>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Mobile CTA (Show only on mobile, below visual) */}
                  <div className="lg:hidden w-full pt-6">
                    <Link to={path.link} className="group relative w-full inline-flex items-center justify-center gap-5 px-10 py-5 rounded-2xl bg-surface text-white font-black uppercase tracking-[0.2em] text-[11px] overflow-hidden hover:shadow-2xl transition-all border border-border-adaptive transition-colors duration-500">
                      <span className="relative z-10">{path.explore}</span>
                      <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1.5 transition-transform" />
                      <div className={`absolute inset-0 bg-gradient-to-r ${colors.gradient} opacity-0 group-hover:opacity-10 transition-opacity`} />
                    </Link>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default HowItWorks;
