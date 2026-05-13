import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, Zap, Layout, Smartphone, MousePointer2, Code2, Layers, ArrowUpRight, ShieldCheck, Clock, ExternalLink, Target } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { useNavigate } from 'react-router-dom';

const TemplateDetailsModal = ({ template, isOpen, onClose }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  if (!template) return null;

  const getLocalizedValue = (field, fallbackField) => {
    const lang = i18n.language || 'tr';
    if (typeof field === 'object' && field !== null) {
      return field[lang] || field['en'] || field['tr'] || '';
    }
    return template[fallbackField] || '';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-4">
          {/* Enhanced Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-deep-black/95 backdrop-blur-3xl"
          />

          {/* Premium Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-6xl max-h-screen md:max-h-[95vh] bg-surface h-full md:h-auto border-0 md:border md:border-white/10 rounded-none md:rounded-[3.5rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] flex flex-col md:flex-row z-[101]"
          >
            {/* Close Trigger */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 md:top-8 md:right-8 z-[110] w-10 h-10 md:w-12 md:h-12 rounded-full bg-deep-black/20 backdrop-blur-md border border-white/10 text-white hover:bg-white hover:text-deep-black transition-all flex items-center justify-center shadow-xl group"
            >
              <X size={20} className="group-hover:rotate-90 transition-transform duration-500" />
            </button>

            {/* Left Column: The Visual Presentation */}
            <div className="w-full md:w-[45%] lg:w-[40%] h-[40vh] md:h-auto relative bg-deep-black shrink-0 overflow-hidden group/img border-b md:border-b-0 md:border-r border-white/10">
              {/* Decorative Grid */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] z-0" />

              <img
                src={template.image_url || template.preview_image}
                alt={template.name}
                className="w-full h-full object-cover object-top transform transition-transform duration-[5s] ease-out group-hover/img:scale-110 relative z-10"
              />

              {/* Dynamic Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-deep-black via-transparent to-transparent pointer-events-none opacity-60 z-20" />

              <div className="absolute bottom-6 left-6 right-6 md:bottom-12 md:left-12 md:right-12 z-20 space-y-4 md:space-y-6">
                <div className="flex flex-wrap gap-2 md:gap-3">
                  <div className="bg-indigo text-pure-white text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] px-4 py-1.5 rounded-full shadow-lg shadow-indigo/20 ring-4 ring-indigo/10 border border-white/10">
                    {template.category}
                  </div>
                  {template.tier === 1 && (
                    <div className="bg-cyan text-[#FFFFFF] text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] px-4 py-1.5 rounded-full flex items-center gap-2 shadow-lg shadow-cyan/20 ring-4 ring-cyan/10 border border-white/10">
                      <ShieldCheck size={10} fill="currentColor" />
                      {t('templatesPage.tiers.standard')}
                    </div>
                  )}
                  {template.tier === 2 && (
                    <div className="bg-indigo text-[#FFFFFF] text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] px-4 py-1.5 rounded-full flex items-center gap-2 shadow-lg shadow-indigo/20 ring-4 ring-indigo/10 border border-white/10">
                      <Zap size={10} fill="currentColor" />
                      {t('templatesPage.tiers.architect')}
                    </div>
                  )}
                  {template.tier === 3 && (
                    <motion.div
                      animate={{ opacity: [0.8, 1, 0.8] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="bg-violet text-[#FFFFFF] text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] px-4 py-1.5 rounded-full flex items-center gap-2 shadow-lg shadow-violet/40 ring-4 ring-violet/20 border border-white/10 bg-gradient-to-r from-violet via-fuchsia-500 to-violet"
                    >
                      <Target size={10} fill="currentColor" />
                      {t('templatesPage.tiers.elite')}
                    </motion.div>
                  )}
                </div>

                <h2 className="text-3xl md:text-5xl lg:text-6xl font-display font-black text-black dark:text-white italic tracking-tighter leading-none pr-4">
                  {template.name}
                </h2>

                <div className="pt-4 md:pt-6 border-t border-white/10 flex items-center gap-4 md:gap-6">
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-cyan" />
                    <span className="text-[9px] md:text-[10px] font-black text-white/50 uppercase tracking-widest">{t('templatesPage.modal.ready')}</span>
                  </div>
                  <div className="flex items-center gap-2 lg:flex hidden">
                    <ShieldCheck size={16} className="text-violet" />
                    <span className="text-[9px] md:text-[10px] font-black text-white/50 uppercase tracking-widest">{t('templatesPage.modal.protection')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: The Architecture Context */}
            <div className="w-full md:w-[55%] lg:w-[60%] p-8 md:p-16 lg:p-20 overflow-y-auto no-scrollbar bg-surface relative flex flex-col">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo/5 blur-[100px] rounded-full pointer-events-none" />

              <div className="mb-8 md:mb-12 relative">
                <div className="flex items-center justify-between mb-6 md:mb-8">
                  <div className="inline-flex items-center gap-3 text-indigo text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] pb-1 border-b-2 border-indigo/20">
                    {t('templatesPage.modal.intel')}
                  </div>
                  <span className="text-3xl md:text-4xl font-display font-black text-black dark:text-white tabular-nums drop-shadow-sm select-none p-2 bg-deep-black/5 rounded-xl">
                    {template.price}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 leading-[1.6] md:leading-[1.7] text-lg md:text-xl font-medium max-w-2xl">
                  {getLocalizedValue(template.short_pitch, 'description')}
                </p>
              </div>

              {/* Matrix Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-12 md:mb-16">
                {[
                  { icon: Layout, label: t('howItWorks.badgeOptimized'), val: `${template.stats?.pages || 8} ${t('common.pages') || 'Pages'}`, color: 'text-indigo', bg: 'bg-indigo/10' },
                  { icon: Smartphone, label: t('templatesPage.modal.viewport'), val: t('templatesPage.modal.responsive'), color: 'text-cyan', bg: 'bg-cyan/10' },
                  { icon: Layers, label: t('templatesPage.modal.integrity'), val: t('templatesPage.modal.clean'), color: 'text-violet', bg: 'bg-violet/10' },
                  { icon: MousePointer2, label: t('templatesPage.modal.anim'), val: template.stats?.animations || 'Smooth', color: 'text-orange-500', bg: 'bg-orange-500/10' }
                ].map((stat, i) => (
                  <div key={i} className="p-4 md:p-6 bg-surface border border-border-adaptive rounded-[1.5rem] md:rounded-[1.8rem] flex items-center gap-4 md:gap-5 hover:border-indigo/20 transition-all group">
                    <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl ${stat.bg} flex items-center justify-center ${stat.color} shrink-0`}>
                      <stat.icon size={22} md:size={26} />
                    </div>
                    <div>
                      <div className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</div>
                      <div className="text-sm md:text-base font-black text-black dark:text-white tracking-tight">{stat.val}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Technical Specs */}
              <div className="space-y-10 md:space-y-12 mb-12 md:mb-16">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-black dark:text-white font-black uppercase tracking-[0.3em] text-[9px] md:text-[10px] mb-6 md:mb-8 flex items-center gap-3">
                      <span className="w-8 md:w-10 h-[2px] bg-indigo" />
                      {t('templatesPage.modal.features')}
                    </h4>
                    <div className="space-y-3 md:space-y-4">
                      {(template.features_tr || template.features_en || template.features || []).map((feature, i) => (
                        <div key={i} className="flex items-center gap-3 text-sm font-medium text-gray-400">
                          <CheckCircle2 size={16} className="text-indigo shrink-0" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-black dark:text-white font-black uppercase tracking-[0.3em] text-[10px] mb-6 md:mb-8 flex items-center gap-3">
                      <span className="w-8 md:w-10 h-[2px] bg-cyan" />
                      {t('templatesPage.modal.stack')}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {(template.tech_stack || []).map((tech, i) => (
                        <div key={i} className="px-3 md:px-4 py-1.5 md:py-2 bg-surface/50 border border-border-adaptive rounded-lg md:rounded-xl flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-gray-500">
                          <Code2 size={12} className="text-indigo" />
                          {tech}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Acquire Action Hub */}
              <div className="mt-auto flex flex-col sm:flex-row gap-4 pt-8 md:pt-10 border-t border-border-adaptive">
                <button
                  onClick={() => navigate(`/checkout/${template.id}`)}
                  className="flex-grow py-4 md:py-5 rounded-2xl md:rounded-[2rem] bg-indigo text-[#FFFFFF] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-[10px] md:text-[11px] transition-all shadow-xl hover:shadow-indigo/40 active:scale-95 flex items-center justify-center gap-3 group relative overflow-hidden border border-transparent"
                >
                  <span className="text-[#FFFFFF] relative z-10">{t('latest.buyNow')}</span>
                  <Zap size={16} className="text-[#FFFFFF] relative z-10 animate-pulse" />
                  <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>

                <div className="h-14 md:h-16 w-full sm:w-16 rounded-2xl md:rounded-[2rem] bg-surface border border-border-adaptive flex items-center justify-center text-indigo hover:bg-indigo hover:text-white transition-all cursor-pointer shadow-lg hover:shadow-indigo/20 group">
                  <ExternalLink size={20} md:size={24} className="group-hover:rotate-12 transition-transform" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default TemplateDetailsModal;
