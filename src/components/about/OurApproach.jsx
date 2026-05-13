import { useTranslation } from 'react-i18next';
import { BrainCircuit, PaintBucket, Lock } from 'lucide-react';
import ScrollReveal from '../ScrollReveal';

const OurApproach = () => {
  const { t } = useTranslation();

  const approaches = [
    {
       icon: BrainCircuit,
       title: t('aboutPage.approach.items.ai.title'),
       description: t('aboutPage.approach.items.ai.desc'),
       color: 'text-indigo'
    },
    {
       icon: PaintBucket,
       title: t('aboutPage.approach.items.design.title'),
       description: t('aboutPage.approach.items.design.desc'),
       color: 'text-cyan'
    },
    {
       icon: Lock,
       title: t('aboutPage.approach.items.exclusive.title'),
       description: t('aboutPage.approach.items.exclusive.desc'),
       color: 'text-violet'
    }
  ];

  return (
    <section className="py-32">
       <div className="container mx-auto px-6 md:px-12">
         <ScrollReveal className="text-center mb-20 max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">{t('aboutPage.approach.title')}</h2>
            <p className="text-gray-400">{t('aboutPage.approach.subtitle')}</p>
         </ScrollReveal>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {approaches.map((item, index) => {
               const Icon = item.icon;
               return (
                  <ScrollReveal direction="up" delay={index * 0.15} key={index}>
                    <div className="p-10 rounded-3xl bg-surface/40 border border-white/5 hover:bg-surface transition-colors h-full flex flex-col items-start relative overflow-hidden group">
                       <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-[40px] -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
                       
                       <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-8 relative z-10 border border-white/10 group-hover:border-white/20 transition-colors">
                          <Icon size={26} className={item.color} />
                       </div>
                       
                       <h3 className="text-2xl font-display font-bold text-white mb-4 relative z-10">{item.title}</h3>
                       <p className="text-gray-400 leading-relaxed font-light relative z-10">
                         {item.description}
                       </p>
                    </div>
                  </ScrollReveal>
               );
            })}
         </div>
       </div>
    </section>
  );
};

export default OurApproach;
