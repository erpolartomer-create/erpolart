import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  AlertCircle,
  ArrowLeft,
  RefreshCw,
  MessageSquare,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

const OrderCancelPage = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-surface text-white dark:text-white pt-32 pb-20 px-6 relative overflow-hidden font-outfit transition-colors duration-500">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-500/5 dark:bg-red-900/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-orange-500/5 dark:bg-orange-900/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-3xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-red-500/10 border border-red-500/20 mb-8 animate-pulse shadow-lg shadow-red-500/10">
            <AlertCircle size={48} className="text-red-500" />
          </div>

          <h1 className="text-6xl md:text-7xl font-black tracking-tighter mb-4 leading-none italic uppercase text-black dark:text-white">
            {t('orderCancel.title')} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500 italic lowercase tracking-tight">
              {t('orderCancel.titleAccent')}
            </span>
          </h1>

          <p className="text-gray-600 dark:text-gray-400 text-lg md:text-xl max-w-xl mx-auto font-light leading-relaxed">
            {t('orderCancel.subtitle')}
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Retry Card */}
          <Link
            to="/templates"
            className="group bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-[32px] p-8 transition-all hover:bg-white dark:hover:bg-white/10 hover:border-red-500/40 hover:shadow-2xl hover:shadow-red-500/5 relative overflow-hidden"
          >
            <div className="flex items-start justify-between mb-12">
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
                <RefreshCw size={24} />
              </div>
              <ChevronRight size={20} className="text-gray-300 dark:text-gray-600 group-hover:text-red-500 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="text-xl font-bold mb-2 group-hover:text-red-500 transition-colors uppercase italic tracking-wider text-black dark:text-white">
              {t('orderCancel.retry')}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-500 leading-relaxed font-light">{t('orderCancel.retryDesc')}</p>
          </Link>

          {/* Support Card */}
          <Link
            to="/contact"
            className="group bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-[32px] p-8 transition-all hover:bg-white dark:hover:bg-white/10 hover:border-gray-200 dark:hover:border-white/20 hover:shadow-2xl hover:shadow-black/5 relative overflow-hidden"
          >
            <div className="flex items-start justify-between mb-12">
              <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/20 flex items-center justify-center text-gray-700 dark:text-white group-hover:scale-110 transition-transform">
                <MessageSquare size={24} />
              </div>
              <ChevronRight size={20} className="text-gray-300 dark:text-gray-600 group-hover:text-black dark:group-hover:text-white group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="text-xl font-bold mb-2 uppercase italic tracking-wider text-black dark:text-white">
              {t('orderCancel.support')}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-500 leading-relaxed font-light">{t('orderCancel.supportDesc')}</p>
          </Link>
        </div>

        {/* Security Footer */}
        <div className="flex flex-col items-center gap-8 border-t border-gray-100 dark:border-white/5 pt-12">
          <div className="flex items-center gap-6 opacity-30 dark:opacity-30">
            <ShieldCheck size={20} className="text-black dark:text-white" />
            <span className="text-[10px] uppercase font-black tracking-[0.4em] whitespace-nowrap text-black dark:text-white">{t('orderCancel.securityShield') || 'SECURE REPLICA SHIELD ACTIVATED'}</span>
            <div className="h-px w-32 bg-black/10 dark:bg-white/20" />
          </div>

          <Link
            to="/"
            className="flex items-center gap-2 text-gray-400 hover:text-black dark:text-gray-500 dark:hover:text-white transition-colors text-[10px] font-black uppercase tracking-[0.4em] group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            {t('orderCancel.backToHome')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderCancelPage;
