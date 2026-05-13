import { ArrowRight, Rocket } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ScrollReveal from '../ScrollReveal';

const SaaSCTA = () => {
  const { t } = useTranslation();

  return (
    <section className="py-16 md:py-32 relative">
      <ScrollReveal>
        <div className="relative rounded-[3rem] overflow-hidden bg-surface border border-white/5 p-12 md:p-24 text-center">
          {/* Background decoration */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-b from-amber-500/20 to-transparent rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />

          {/* Grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(245,158,11,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(245,158,11,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

          <div className="relative z-10">
            <div className="w-20 h-20 rounded-3xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 mx-auto mb-10">
              <Rocket size={36} />
            </div>

            <h2 className="text-4xl md:text-[72px] font-display font-black text-white italic tracking-tighter mb-8 leading-[0.95]">
              {t('saasPage.cta.title')}
            </h2>
            <p className="text-gray-400 text-sm md:text-base font-medium leading-relaxed max-w-2xl mx-auto mb-14">
              {t('saasPage.cta.subtitle')}
            </p>

            <Link
              to="/contact"
              className="group inline-flex items-center gap-4 px-12 py-6 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-pure-white font-black uppercase tracking-[0.2em] text-[11px] hover:scale-105 transition-all shadow-2xl shadow-amber-500/30 relative overflow-hidden"
            >
              <span className="relative z-10">{t('saasPage.cta.button')}</span>
              <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
};

export default SaaSCTA;
