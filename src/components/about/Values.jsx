import { useTranslation } from 'react-i18next';
import { Zap, Key, Eye, Award } from 'lucide-react';
import ScrollReveal from '../ScrollReveal';

const Values = () => {
   const { t } = useTranslation();

   const values = [
      { name: t('aboutPage.values.velocity.name'), desc: t('aboutPage.values.velocity.desc'), icon: Zap },
      { name: t('aboutPage.values.exclusivity.name'), desc: t('aboutPage.values.exclusivity.desc'), icon: Key },
      { name: t('aboutPage.values.transparency.name'), desc: t('aboutPage.values.transparency.desc'), icon: Eye },
      { name: t('aboutPage.values.quality.name'), desc: t('aboutPage.values.quality.desc'), icon: Award },
   ];

   return (
      <section className="py-24 bg-deep-black border-y border-white/5">
         <div className="container mx-auto px-6 md:px-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
               {values.map((v, i) => {
                  const Icon = v.icon;
                  return (
                     <ScrollReveal direction="up" delay={i * 0.1} key={i}>
                        <div className="flex flex-col items-center text-center">
                           <div className="w-12 h-12 rounded-full flex items-center justify-center bg-indigo/10 text-indigo mb-6">
                              <Icon size={20} />
                           </div>
                           <h4 className="text-white font-bold mb-2">{v.name}</h4>
                           <p className="text-gray-500 text-sm max-w-[200px]">{v.desc}</p>
                        </div>
                     </ScrollReveal>
                  );
               })}
            </div>
         </div>
      </section>
   );
};

export default Values;
