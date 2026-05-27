import { MousePointerClick, ShieldCheck, PenTool, Rocket } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ScrollReveal from '../ScrollReveal';

const TemplateProcess = () => {
  const { t } = useTranslation();

  const steps = [
    { icon: MousePointerClick, titleKey: 'step1Title', descKey: 'step1Desc' },
    { icon: ShieldCheck,       titleKey: 'step2Title', descKey: 'step2Desc' },
    { icon: PenTool,           titleKey: 'step3Title', descKey: 'step3Desc' },
    { icon: Rocket,            titleKey: 'step4Title', descKey: 'step4Desc' },
  ];

  return (
    <section className="py-20 mb-12">
      <ScrollReveal>
        <h3 className="text-3xl font-display font-bold text-center text-white mb-16">
          {t('templatesPage.process.title')}
        </h3>
      </ScrollReveal>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <ScrollReveal direction="up" delay={index * 0.1} key={index}>
              <div className="bg-surface/30 border border-white/5 rounded-2xl p-8 hover:bg-surface/60 transition-colors h-full flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center text-gray-300 mb-6 group-hover:text-white group-hover:bg-white/10 transition-colors border border-white/10">
                  <Icon size={24} />
                </div>
                <h4 className="text-lg font-bold text-white mb-3">
                  {t(`templatesPage.process.${step.titleKey}`)}
                </h4>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {t(`templatesPage.process.${step.descKey}`)}
                </p>
              </div>
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
};

export default TemplateProcess;
