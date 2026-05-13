import { motion } from 'framer-motion';
import { ArrowUpRight, CheckCircle2, Shield, Zap, Target } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ScrollReveal from '../ScrollReveal';

const ProjectShowcase = () => {
  const { t } = useTranslation();

  return (
    <section className="pt-20 pb-32 relative overflow-hidden">
      {/* Immersive Cinematic Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-deep-black via-transparent to-deep-black z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-deep-black via-transparent to-deep-black z-10" />
        <img
          src="/projects/bespoke-architecture-noir.webp"
          alt="ErpolArt Atelier"
          className="w-full h-full object-cover opacity-40 scale-110 blur-[2px]"
        />
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-6">
        <ScrollReveal direction="up" delay={0.2}>
          <div className="flex flex-col items-center text-center mb-24">
            <div className="w-24 h-[1px] bg-indigo mb-8" />
            <h2 className="text-5xl md:text-[88px] font-display font-black text-white leading-none tracking-[-0.07em] italic mb-6">
              PURE <span className="text-indigo">AUTHORITY.</span>
            </h2>
            <p className="text-gray-500 text-xl md:text-2xl font-medium tracking-[0.2em] uppercase">
              {t('projectsPage.bespokeSection.badge', 'Bespoke Digital Ecosystems')}
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          
          {/* Main Glassmorphism Card */}
          <ScrollReveal direction="left" delay={0.3}>
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-br from-indigo/20 to-cyan/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              <div className="relative p-10 md:p-16 rounded-[3rem] bg-white/[0.03] backdrop-blur-3xl border border-white/[0.08] shadow-2xl">
                <h3 className="text-4xl md:text-5xl font-display font-black text-white mb-10 leading-tight italic">
                  {t('projectsPage.bespokeSection.title', 'Kodun Ötesinde, Sizin İçin.')}
                </h3>
                
                <p className="text-gray-400 text-xl leading-relaxed mb-12 font-medium">
                  {t('projectsPage.bespokeSection.desc', 'Sıradanlığın dışına çıkın. ErpolArt olarak, markanızın DNA\'sını dijital bir sanat eserine dönüştürüyoruz. Sizin için sadece bir site değil, uyumayan bir satış makinesi ve dijital bir otorite inşa ediyoruz.')}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                  {[
                    { icon: Shield, text: 'Özel Mimari' },
                    { icon: Zap, text: 'Ultra Performans' },
                    { icon: Target, text: 'Yüksek Dönüşüm' },
                    { icon: CheckCircle2, text: 'Tam Otomasyon' }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4 group/item">
                      <div className="p-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-indigo group-hover/item:bg-indigo group-hover/item:text-white transition-all duration-500">
                        <item.icon size={20} />
                      </div>
                      <span className="text-white/70 font-bold text-sm tracking-widest uppercase">{item.text}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                  className="w-full group relative overflow-hidden rounded-2xl bg-white text-black py-6 font-black text-[12px] uppercase tracking-[0.4em] transition-all hover:scale-[1.02] flex items-center justify-center gap-4"
                >
                  <span className="relative z-10 transition-transform duration-500">{t('projectsPage.bespokeSection.cta', 'MİMARİNİZİ BAŞLATIN')}</span>
                  <ArrowUpRight size={20} className="relative z-10 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  <div className="absolute inset-0 bg-indigo scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-700" />
                </button>
              </div>
            </div>
          </ScrollReveal>

          {/* Side Visual - Focused Tablet */}
          <ScrollReveal direction="right" delay={0.4}>
            <div className="relative aspect-square rounded-[3rem] overflow-hidden border border-white/[0.08] shadow-[0_0_100px_rgba(92,115,255,0.1)] group">
              <img
                src="/projects/bespoke-architecture-v2.webp"
                alt="Architecture Detail"
                className="w-full h-full object-cover transform scale-110 group-hover:scale-100 transition-transform duration-[5s]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-deep-black/80 via-transparent to-transparent" />
              
              <div className="absolute bottom-10 left-10 right-10 p-8 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10">
                <div className="text-cyan text-[10px] font-black tracking-[0.5em] uppercase mb-2">System Status</div>
                <div className="text-white text-lg font-bold">100% Bespoke Logic Identified</div>
              </div>
            </div>
          </ScrollReveal>

        </div>
      </div>
    </section>
  );
};

export default ProjectShowcase;
