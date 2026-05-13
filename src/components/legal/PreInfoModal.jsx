import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const PreInfoModal = ({ isOpen, onClose }) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-3xl max-h-[85vh] flex flex-col bg-white dark:bg-[#0c0c16] border border-gray-200 dark:border-white/10 rounded-[2rem] overflow-hidden shadow-2xl relative"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-cyan/10 flex items-center justify-center text-cyan">
                <FileText size={20} />
              </div>
              <h2 className="text-lg md:text-xl font-display font-black text-gray-900 dark:text-white italic tracking-tight">
                {t('legal.preInfo.title')}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/10 transition-all"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar flex-1 text-gray-600 dark:text-gray-300 text-sm leading-relaxed space-y-8">
            <div>
              <p className="font-bold text-gray-900 dark:text-white mb-2">{t('legal.preInfo.title')}</p>
              <p className="text-xs text-gray-500">{t('legal.preInfo.subtitle')}</p>
              <p className="text-xs text-gray-500">{t('legal.preInfo.lastUpdate')}</p>
            </div>

            <div>
              <h3 className="text-cyan font-bold text-base mb-3">{t('legal.preInfo.sellerTitle')}</h3>
              <ul className="space-y-1 bg-gray-50 dark:bg-white/[0.02] p-4 rounded-xl border border-gray-100 dark:border-white/5">
                <li><strong>{t('legal.preInfo.sellerName').split(':')[0]}:</strong> {t('legal.preInfo.sellerName').split(':')[1]}</li>
                <li><strong>{t('legal.preInfo.sellerAddress').split(':')[0]}:</strong> {t('legal.preInfo.sellerAddress').split(':')[1]}</li>
                <li><strong>{t('legal.preInfo.sellerPhone').split(':')[0]}:</strong> {t('legal.preInfo.sellerPhone').split(':')[1]}</li>
                <li><strong>{t('legal.preInfo.sellerEmail').split(':')[0]}:</strong> {t('legal.preInfo.sellerEmail').split(':')[1]}</li>
              </ul>
            </div>

            <div>
              <h3 className="text-cyan font-bold text-base mb-3">{t('legal.preInfo.servicesTitle')}</h3>
              <p className="mb-3">{t('legal.preInfo.servicesIntro')}</p>
              <ul className="list-disc pl-5 space-y-1 mb-3">
                <li>{t('legal.preInfo.s1')}</li>
                <li>{t('legal.preInfo.s2')}</li>
                <li>{t('legal.preInfo.s3')}</li>
                <li>{t('legal.preInfo.s4')}</li>
              </ul>
              <p>{t('legal.preInfo.servicesOutro')}</p>
            </div>

            <div>
              <h3 className="text-cyan font-bold text-base mb-3">{t('legal.preInfo.priceTitle')}</h3>
              <p className="mb-3">{t('legal.preInfo.priceIntro')}</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>{t('legal.preInfo.p1')}</li>
                <li>{t('legal.preInfo.p2')}</li>
                <li>{t('legal.preInfo.p3')}</li>
              </ul>
            </div>

            <div>
              <h3 className="text-cyan font-bold text-base mb-3">{t('legal.preInfo.deliveryTitle')}</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>{t('legal.preInfo.d1')}</li>
                <li>{t('legal.preInfo.d2')}</li>
                <li>{t('legal.preInfo.d3')}</li>
              </ul>
            </div>

            <div>
              <h3 className="text-cyan font-bold text-base mb-3">{t('legal.preInfo.withdrawalTitle')}</h3>
              <p className="mb-3 text-gray-800 dark:text-white/80 font-medium">{t('legal.preInfo.withdrawalLaw')}</p>
              <p className="mb-3">{t('legal.preInfo.withdrawalPolicy')}</p>
              <p>{t('legal.preInfo.withdrawalSub')}</p>
            </div>

            <div>
              <h3 className="text-cyan font-bold text-base mb-3">{t('legal.preInfo.defectTitle')}</h3>
              <p className="mb-3">{t('legal.preInfo.defectIntro')}</p>
              <ul className="list-disc pl-5 space-y-1 mb-3">
                <li>{t('legal.preInfo.df1')}</li>
                <li>{t('legal.preInfo.df2')}</li>
              </ul>
              <p>{t('legal.preInfo.defectOutro')}</p>
            </div>

            <div>
              <h3 className="text-cyan font-bold text-base mb-3">{t('legal.preInfo.jurisdictionTitle')}</h3>
              <p>{t('legal.preInfo.jurisdictionText')}</p>
            </div>
            
            <div className="pt-6 border-t border-gray-100 dark:border-white/5 flex flex-col items-center justify-center text-center">
              <p className="font-bold text-gray-900 dark:text-white mb-1">FİDAN ÜNAL ERPOLAT - ERPOLART MİMARLIK</p>
              <p className="text-xs text-gray-500">Pınarlı Mah. 24096 Sk. Kapı No: 19 A Aksu / ANTALYA</p>
              <p className="text-xs text-gray-500">hello@erpolart.com | +90 530 944 07 01</p>
            </div>
          </div>
          
          <div className="p-6 border-t border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/[0.02] flex justify-end">
             <button
               onClick={onClose}
               className="px-6 py-3 rounded-xl bg-cyan text-white dark:text-[#0c0c16] font-black uppercase tracking-widest hover:bg-cyan/90 transition-all"
             >
               {t('legal.preInfo.acceptBtn')}
             </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PreInfoModal;
