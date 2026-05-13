import { FileText, PenTool, CheckCircle, Code, Rocket } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ScrollReveal from '../ScrollReveal';

const ProcessTimeline = () => {
  const { t } = useTranslation();

  const steps = [
    {
      icon: FileText,
      title: t('projectsPage.processTimeline.steps.s1Title'),
      description: t('projectsPage.processTimeline.steps.s1Desc'),
      color: 'text-indigo',
      bg: 'bg-indigo/20',
    },
    {
      icon: PenTool,
      title: t('projectsPage.processTimeline.steps.s2Title'),
      description: t('projectsPage.processTimeline.steps.s2Desc'),
      color: 'text-cyan',
      bg: 'bg-cyan/20',
    },
    {
      icon: CheckCircle,
      title: t('projectsPage.processTimeline.steps.s3Title'),
      description: t('projectsPage.processTimeline.steps.s3Desc'),
      color: 'text-violet',
      bg: 'bg-violet/20',
    },
    {
      icon: Code,
      title: t('projectsPage.processTimeline.steps.s4Title'),
      description: t('projectsPage.processTimeline.steps.s4Desc'),
      color: 'text-white',
      bg: 'bg-white/20',
    },
    {
      icon: Rocket,
      title: t('projectsPage.processTimeline.steps.s5Title'),
      description: t('projectsPage.processTimeline.steps.s5Desc'),
      color: 'text-indigo',
      bg: 'bg-indigo/20',
    },
  ];

  return (
    <section className="pt-8 pb-16 md:py-24">
      <ScrollReveal className="text-center mb-12 md:mb-24 max-w-3xl mx-auto">
        <h2 className="text-4xl md:text-[72px] font-display font-black text-white mb-6 tracking-tighter italic">{t('projectsPage.processTimeline.title')}</h2>
        <p className="text-gray-400 text-lg">{t('projectsPage.processTimeline.subtitle')}</p>
      </ScrollReveal>

      <div className="relative max-w-5xl mx-auto">
        {/* Vertical Line */}
        <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-indigo/50 via-cyan/50 to-transparent -translate-x-1/2" />

        <div className="space-y-12 relative z-10">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isEven = index % 2 === 0;

            return (
              <ScrollReveal direction="up" delay={index * 0.1} key={index}>
                <div className={`flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-16 relative ${isEven ? 'md:flex-row-reverse' : ''} pl-16 md:pl-0`}>

                  {/* Content Card */}
                  <div className={`w-full md:w-1/2 flex flex-col ${isEven ? 'md:items-start md:text-left' : 'md:items-end md:text-right'} items-start text-left`}>
                    <div className="bg-surface/40 hover:bg-surface border border-white/5 backdrop-blur-xl p-6 md:p-8 rounded-[2rem] w-full md:max-w-[440px] hover:border-indigo/30 hover:shadow-2xl hover:shadow-indigo/10 transition-all duration-500 group relative z-10 overflow-hidden">
                      {/* Subdued Glow Background for all cards now, for consistency */}
                      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />

                      <div className="text-indigo text-[10px] font-black tracking-[0.2em] uppercase mb-4">{t('projectsPage.processTimeline.phase')} 0{index + 1}</div>
                      <h4 className="text-xl md:text-2xl font-display font-black text-white mb-4 group-hover:text-indigo transition-colors">{step.title}</h4>
                      <p className="text-gray-400 text-sm leading-relaxed font-medium opacity-80 group-hover:opacity-100 transition-opacity">{step.description}</p>
                    </div>
                  </div>

                  {/* Icon Marker */}
                  <div className="absolute left-8 md:relative md:left-auto transform -translate-x-1/2 md:translate-x-0 shrink-0 z-10 my-4 md:my-0">
                    <div className="absolute inset-0 bg-deep-black shadow-[0_0_0_8px_var(--deep-black)] rounded-full z-0" />
                    <div className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center relative z-10 ${step.bg} border border-white/10 shadow-xl`}>
                      <Icon size={20} className={`${step.color} md:hidden`} />
                      <Icon size={24} className={`${step.color} hidden md:block`} />
                    </div>
                  </div>

                  {/* Desktop Spacer */}
                  <div className="hidden md:block md:w-1/2" />

                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProcessTimeline;
