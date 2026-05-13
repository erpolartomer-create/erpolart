import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ScrollReveal from '../ScrollReveal';

const AboutTeaser = () => {
  const { t } = useTranslation();

  return (
    <section className="py-20 md:py-48 bg-deep-black relative overflow-hidden">
      {/* Background Graphic */}
      <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none select-none">
        <h2 className="text-[15rem] font-display font-black leading-none text-white whitespace-nowrap translate-y-1/4 translate-x-1/4">
          ERP/ART
        </h2>
      </div>

      <div className="container mx-auto px-4 md:px-12 relative z-10">
        <div className="max-w-3xl">
          <ScrollReveal>
             <div className="w-16 h-1 bg-cyan mb-8" />
             <h2 className="text-4xl sm:text-5xl md:text-5xl font-display font-bold text-white leading-[0.9] mb-8">
               {t('aboutTeaser.title')}
             </h2>
          </ScrollReveal>
          
          <ScrollReveal delay={0.2}>
            <p className="text-xl text-gray-400 mb-10 font-light">
              {t('aboutTeaser.subtitle')}
            </p>
            
            <Link to="/about" className="inline-flex items-center gap-2 group text-white border-b border-white/30 pb-1 hover:border-white transition-all text-lg font-medium">
              {t('aboutTeaser.discover')}
              <ArrowRight size={20} className="transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default AboutTeaser;
