import { MousePointerClick, ShieldCheck, PenTool, Rocket } from 'lucide-react';
import ScrollReveal from '../ScrollReveal';

const TemplateProcess = () => {
  const steps = [
    {
      icon: MousePointerClick,
      title: '1. Browse & Choose',
      description: 'Explore our catalog of premium designs.',
    },
    {
      icon: ShieldCheck,
      title: '2. Acquire Exclusive',
      description: 'Purchase to instantly lock the design. It is removed from sale.',
    },
    {
      icon: PenTool,
      title: '3. Brand Alignment',
      description: 'We update colors, fonts, and assets to match your brand (3 revision rounds).',
    },
    {
      icon: Rocket,
      title: '4. Rapid Deployment',
      description: 'We deploy to your domain within 72 hours, fully yours.',
    }
  ];

  return (
    <section className="py-20 mb-12">
      <ScrollReveal>
        <h3 className="text-3xl font-display font-bold text-center text-white mb-16">How Templates Work</h3>
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
                <h4 className="text-lg font-bold text-white mb-3">{step.title}</h4>
                <p className="text-gray-400 text-sm leading-relaxed">{step.description}</p>
              </div>
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
};

export default TemplateProcess;
