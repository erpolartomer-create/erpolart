import { ShieldCheck, Target, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const TransparencyBanner = () => {
  const { t } = useTranslation();

  return (
    <div className="relative mt-12 mb-8">
      {/* Background ambient glow behind the card */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-indigo/10 blur-[100px] pointer-events-none rounded-full" />
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative shadow-2xl rounded-[2rem] transition-all duration-500"
      >
        <div className="relative group bg-surface/40 backdrop-blur-3xl border border-white/10 rounded-[2rem] overflow-hidden isolate flex flex-col lg:flex-row items-stretch">
          {/* Visual Hub (Left) */}
          <div className="w-full lg:w-[35%] bg-gradient-to-br from-indigo/20 via-deep-black to-cyan/10 p-10 flex flex-col items-center justify-center text-center border-b lg:border-b-0 lg:border-r border-white/5 relative overflow-hidden rounded-t-[2rem] lg:rounded-tr-none lg:rounded-l-[2rem]">
             {/* Dynamic background patterns */}
             <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
             
             <div className="relative z-10">
                <div className="w-20 h-20 rounded-3xl bg-surface border border-white/10 flex items-center justify-center shadow-2xl mb-6 mx-auto group-hover:scale-110 group-hover:rotate-12 transition-transform duration-700">
                   <ShieldCheck size={40} className="text-cyan drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]" />
                </div>
                <div className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] mb-2">{t('templatesPage.transparencyBanner.protocol')}</div>
                <h4 className="text-2xl font-display font-black text-white leading-tight uppercase tracking-tight">
                   {t('templatesPage.transparencyBanner.title')} <br />
                   <span className="text-cyan">{t('templatesPage.transparencyBanner.titleAccent')}</span>
                </h4>
             </div>
          </div>
 
          {/* Context & Value (Right) */}
          <div className="w-full lg:w-[65%] p-8 md:p-10 lg:p-14 relative overflow-hidden rounded-b-[2rem] lg:rounded-bl-none lg:rounded-r-[2rem]">
             {/* Authenticity Watermark */}
             <div className="absolute -bottom-10 -right-10 text-[5rem] md:text-[8rem] lg:text-[10rem] font-display font-black text-white/[0.02] uppercase pointer-events-none italic select-none">
                {t('templatesPage.transparencyBanner.authentic')}
             </div>

             <div className="flex flex-col md:flex-row gap-10 items-start relative z-10">
                <div className="md:w-3/4">
                   <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan/10 border border-cyan/20 text-cyan text-[9px] font-black uppercase tracking-widest mb-6">
                      <Target size={12} />
                      {t('templatesPage.transparencyBanner.statement')}
                   </div>
                   <h3 className="text-5xl font-display font-black text-white mb-6 tracking-tight">
                      {t('templatesPage.transparencyBanner.headline')}
                   </h3>
                   <p className="text-muted-text text-base leading-relaxed font-medium">
                      {t('templatesPage.transparencyBanner.description')}
                   </p>
                </div>
                
                <div className="md:w-1/4 flex flex-col gap-6">
                   <div className="space-y-4">
                      <div className="flex items-center gap-3">
                         <div className="w-2 h-2 rounded-full bg-indigo shadow-[0_0_10px_rgba(79,70,229,0.8)]" />
                         <span className="text-[10px] font-black text-white/60 uppercase tracking-widest transition-colors">{t('templatesPage.transparencyBanner.ownership')}</span>
                      </div>
                      <div className="flex items-center gap-3">
                         <div className="w-2 h-2 rounded-full bg-cyan shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
                         <span className="text-[10px] font-black text-white/60 uppercase tracking-widest transition-colors">{t('templatesPage.transparencyBanner.customLogic')}</span>
                      </div>
                      <div className="flex items-center gap-3">
                         <div className="w-2 h-2 rounded-full bg-violet shadow-[0_0_10px_rgba(139,92,246,0.8)]" />
                         <span className="text-[10px] font-black text-white/60 uppercase tracking-widest transition-colors">{t('templatesPage.transparencyBanner.performance')}</span>
                      </div>
                   </div>
                   
                   <div className="pt-6 border-t border-white/5 text-[9px] text-gray-500 font-bold uppercase tracking-[0.2em] transition-colors">
                      {t('templatesPage.transparencyBanner.build')}
                   </div>
                </div>
             </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TransparencyBanner;
