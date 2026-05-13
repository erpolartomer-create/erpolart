import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';
import ScrollReveal from '../ScrollReveal';

const ContactCTA = () => {
   const { t } = useTranslation();

   return (
      <section className="py-40 relative flex items-center justify-center text-center">
         {/* Background Glow */}
         <div className="absolute inset-0 z-0">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl h-full bg-cyan/10 blur-[150px] pointer-events-none rounded-full" />
         </div>

         <ScrollReveal className="relative z-10 px-6 box-border max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-[72px] font-display font-black text-white mb-8 tracking-tighter">
               {t('aboutPage.cta.title')}
            </h2>
            <p className="text-xl md:text-2xl text-gray-400 font-light mb-12">
               {t('aboutPage.cta.subtitle')}
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
               <a href="mailto:hello@erpolart.com" className="w-full sm:w-auto px-10 py-4 rounded-full bg-white text-deep-black font-bold tracking-wide hover:scale-105 transition-transform duration-300 flex items-center justify-center gap-2">
                  hello@erpolart.com
                  <ArrowRight size={18} />
               </a>
            </div>
         </ScrollReveal>
      </section>
   );
};

export default ContactCTA;
