import { useTranslation } from 'react-i18next';
import ScrollReveal from '../ScrollReveal';

const WhoWeAre = () => {
  const { t } = useTranslation();

  return (
    <section className="py-20 bg-transparent">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <ScrollReveal direction="right">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-cyan/20 to-indigo/20 rounded-3xl transform rotate-3 scale-105 pointer-events-none blur-sm" />
              <img 
                src="/about-visual.png" 
                alt="ErpolArt Dijital Stüdyo ve Geliştirme Ekibi - SaaS Mimari Görseli" 
                className="relative z-10 rounded-3xl object-cover w-full h-[500px] border border-white/10 shadow-2xl"
              />
            </div>
          </ScrollReveal>

          <ScrollReveal direction="left">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">{t('aboutPage.whoWeAre.title')}</h2>
            <div className="space-y-6 text-gray-300 text-lg leading-relaxed font-light">
               <p>
                 {t('aboutPage.whoWeAre.p1')}
               </p>
               <p>
                 {t('aboutPage.whoWeAre.p2')}
               </p>
               <p>
                 {t('aboutPage.whoWeAre.p3')}
               </p>
            </div>
            
            <div className="mt-12 flex items-center gap-12">
              <div>
                <div className="text-4xl font-display font-bold text-white mb-1 tracking-tight">3x</div>
                <div className="text-sm text-cyan uppercase tracking-widest font-bold">{t('aboutPage.whoWeAre.stat1')}</div>
              </div>
              <div>
                <div className="text-4xl font-display font-bold text-white mb-1 tracking-tight">100%</div>
                <div className="text-sm text-indigo uppercase tracking-widest font-bold">{t('aboutPage.whoWeAre.stat2')}</div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default WhoWeAre;
