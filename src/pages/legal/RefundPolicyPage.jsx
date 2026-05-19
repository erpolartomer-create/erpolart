import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowLeft, RefreshCcw } from 'lucide-react';
import ScrollReveal from '../../components/ScrollReveal';
import { useTranslation } from 'react-i18next';

const RefundPolicyPage = () => {
  const { t } = useTranslation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-surface min-h-screen pt-32 pb-24 relative overflow-hidden">
      <Helmet>
        <title>İptal ve İade Koşulları - ErpolArt</title>
        <meta name="description" content="ErpolArt iptal ve iade koşulları — hizmet iptali ve geri ödeme süreçleri hakkında detaylı bilgi." />
        <link rel="canonical" href="https://erpolart.com/iptal-ve-iade-kosullari" />
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      <div className="absolute inset-0 bg-[linear-gradient(var(--grid-color)_1px,transparent_1px),linear-gradient(90deg,var(--grid-color)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none opacity-20" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 max-w-4xl relative z-10">
        <ScrollReveal>
          <div className="mb-12">
            <Link to="/" className="inline-flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 hover:text-white transition-all group">
              <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-indigo/50 group-hover:bg-indigo/10 transition-all">
                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              </div>
              <span>{t('legal.refund.backToHome')}</span>
            </Link>
          </div>

          <div className="flex items-center gap-4 mb-12">
            <div className="w-12 h-12 rounded-2xl bg-indigo/10 text-indigo flex items-center justify-center border border-indigo/20">
              <RefreshCcw size={24} />
            </div>
            <h1 className="text-3xl md:text-5xl font-display font-black text-white italic tracking-tighter">
              {t('legal.refund.title').split(' ').slice(0,-1).join(' ')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo to-cyan">{t('legal.refund.title').split(' ').slice(-1)}</span>
            </h1>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="bg-white/[0.02] border border-white/5 p-8 md:p-12 rounded-[2.5rem] shadow-2xl text-gray-300 text-sm md:text-base leading-relaxed">
            
            <p className="font-bold text-white mb-16">{t('legal.refund.lastUpdate')}</p>

            <div className="mb-16">
              <h3 className="text-xl md:text-2xl font-bold text-cyan mb-6">{t('legal.refund.article1')}</h3>
              <p className="mb-6">{t('legal.refund.a1P1')}</p>
              <p>{t('legal.refund.a1P2')}</p>
            </div>

            <div className="mb-16">
              <h3 className="text-xl md:text-2xl font-bold text-cyan mb-6">{t('legal.refund.article2')}</h3>
              <p className="mb-6">{t('legal.refund.a2Desc')}</p>
              <ul className="list-disc pl-6 space-y-4">
                <li>{t('legal.refund.a2Li1')}</li>
                <li>{t('legal.refund.a2Li2')}</li>
                <li>{t('legal.refund.a2Li3')}</li>
              </ul>
            </div>

            <div className="mb-16">
              <h3 className="text-xl md:text-2xl font-bold text-cyan mb-6">{t('legal.refund.article3')}</h3>
              <p className="mb-6">{t('legal.refund.a3Desc')}</p>
              <ul className="list-disc pl-6 space-y-4 mb-6">
                <li>{t('legal.refund.a3Li1')}</li>
                <li>{t('legal.refund.a3Li2')}</li>
              </ul>
              <p>{t('legal.refund.a3Outro')}</p>
            </div>

            <div className="mb-16">
              <h3 className="text-xl md:text-2xl font-bold text-cyan mb-6">{t('legal.refund.article4')}</h3>
              <p>{t('legal.refund.a4Desc')}</p>
            </div>

            {/* Footer Signature */}
            <div className="mt-16 pt-8 border-t border-white/10 font-bold text-white/80">
              <p>FİDAN ÜNAL ERPOLAT - ERPOLART MİMARLIK</p>
            </div>

          </div>
        </ScrollReveal>
      </div>
    </div>
  );
};

export default RefundPolicyPage;
