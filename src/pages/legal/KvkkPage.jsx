import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';
import ScrollReveal from '../../components/ScrollReveal';
import { useTranslation } from 'react-i18next';

const KvkkPage = () => {
  const { t } = useTranslation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-surface min-h-screen pt-32 pb-24 relative overflow-hidden">
      <Helmet>
        <title>KVKK Metni - ErpolArt</title>
        <meta name="description" content="ErpolArt KVKK aydınlatma metni — 6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında veri işleme bilgilendirmesi." />
        <link rel="canonical" href="https://erpolart.com/kvkk-metni" />
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
              <span>{t('legal.kvkk.backToHome')}</span>
            </Link>
          </div>

          <div className="flex items-center gap-4 mb-12">
            <div className="w-12 h-12 rounded-2xl bg-indigo/10 text-indigo flex items-center justify-center border border-indigo/20">
              <FileText size={24} />
            </div>
            <h1 className="text-3xl md:text-5xl font-display font-black text-white italic tracking-tighter">
              {t('legal.kvkk.title').split(' ').slice(0,-1).join(' ')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo to-cyan">{t('legal.kvkk.title').split(' ').slice(-1)}</span>
            </h1>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="bg-white/[0.02] border border-white/5 p-8 md:p-12 rounded-[2.5rem] shadow-2xl text-gray-300 text-sm md:text-base leading-relaxed">
            
            <p className="font-bold text-white mb-16">{t('legal.kvkk.lastUpdate')}</p>

            <div className="mb-16">
              <h3 className="text-xl md:text-2xl font-bold text-indigo mb-6">{t('legal.kvkk.controller')}</h3>
              <ul className="list-none space-y-2">
                <li><strong>{t('legal.preInfo.sellerName').split(':')[0]}:</strong> {t('legal.preInfo.sellerName').split(':')[1]}</li>
                <li><strong>{t('legal.preInfo.sellerAddress').split(':')[0]}:</strong> {t('legal.preInfo.sellerAddress').split(':')[1]}</li>
                <li><strong>{t('legal.preInfo.sellerEmail').split(':')[0]}:</strong> {t('legal.preInfo.sellerEmail').split(':')[1]}</li>
                <li><strong>{t('legal.preInfo.sellerPhone').split(':')[0]}:</strong> {t('legal.preInfo.sellerPhone').split(':')[1]}</li>
              </ul>
            </div>

            <div className="mb-16">
              <p>{t('legal.kvkk.intro')}</p>
            </div>

            <div className="mb-16">
              <h3 className="text-xl md:text-2xl font-bold text-indigo mb-6">{t('legal.kvkk.article1')}</h3>
              <p className="mb-6">{t('legal.kvkk.a1Desc')}</p>
              <ul className="list-disc pl-6 space-y-4">
                <li>{t('legal.kvkk.a1Li1')}</li>
                <li>{t('legal.kvkk.a1Li2')}</li>
                <li>{t('legal.kvkk.a1Li3')}</li>
                <li>{t('legal.kvkk.a1Li4')}</li>
              </ul>
            </div>

            <div className="mb-16">
              <h3 className="text-xl md:text-2xl font-bold text-indigo mb-6">{t('legal.kvkk.article2')}</h3>
              <p className="mb-6">{t('legal.kvkk.a2Desc')}</p>
              <ul className="list-disc pl-6 space-y-4 mb-6">
                <li>{t('legal.kvkk.a2Li1')}</li>
                <li>{t('legal.kvkk.a2Li2')}</li>
                <li>{t('legal.kvkk.a2Li3')}</li>
              </ul>
              <p>{t('legal.kvkk.a2Outro')}</p>
            </div>

            <div className="mb-16">
              <h3 className="text-xl md:text-2xl font-bold text-indigo mb-6">{t('legal.kvkk.article3')}</h3>
              <p className="mb-6">{t('legal.kvkk.a3Desc1')}</p>
              <p className="mb-6">{t('legal.kvkk.a3Desc2')}</p>
              <ul className="list-disc pl-6 space-y-4">
                <li>{t('legal.kvkk.a3Li1')}</li>
                <li>{t('legal.kvkk.a3Li2')}</li>
                <li>{t('legal.kvkk.a3Li3')}</li>
              </ul>
            </div>

            <div className="mb-16">
              <h3 className="text-xl md:text-2xl font-bold text-indigo mb-6">{t('legal.kvkk.article4')}</h3>
              <p>{t('legal.kvkk.a4Desc')}</p>
            </div>

            <div className="mb-16">
              <h3 className="text-xl md:text-2xl font-bold text-indigo mb-6">{t('legal.kvkk.article5')}</h3>
              <p className="mb-6">{t('legal.kvkk.a5Desc')}</p>
              <ul className="list-disc pl-6 space-y-4">
                <li>{t('legal.kvkk.a5Li1')}</li>
                <li>{t('legal.kvkk.a5Li2')}</li>
                <li>{t('legal.kvkk.a5Li3')}</li>
                <li>{t('legal.kvkk.a5Li4')}</li>
                <li>{t('legal.kvkk.a5Li5')}</li>
                <li>{t('legal.kvkk.a5Li6')}</li>
                <li>{t('legal.kvkk.a5Li7')}</li>
                <li>{t('legal.kvkk.a5Li8')}</li>
              </ul>
            </div>

            <div className="mb-16">
              <h3 className="text-xl md:text-2xl font-bold text-indigo mb-6">{t('legal.kvkk.article6')}</h3>
              <p className="mb-6">{t('legal.kvkk.a6Desc')}</p>
              <ul className="list-none space-y-2 mb-6">
                <li><strong>{t('legal.preInfo.sellerEmail').split(':')[0]}:</strong> {t('legal.preInfo.sellerEmail').split(':')[1]}</li>
                <li><strong>Adres:</strong> Pınarlı Mah. 24096 Sk. Kapı No: 19 A Aksu / ANTALYA</li>
                <li><strong>{t('legal.preInfo.sellerPhone').split(':')[0]}:</strong> {t('legal.preInfo.sellerPhone').split(':')[1]}</li>
              </ul>
              <p>{t('legal.kvkk.a6Outro')}</p>
            </div>

            {/* Footer Signature */}
            <div className="mt-16 pt-8 border-t border-white/10 font-bold text-white/80">
              <p className="mb-1">FİDAN ÜNAL ERPOLAT - ERPOLART MİMARLIK</p>
              <p className="mb-1 text-sm text-gray-400 font-normal">Pınarlı Mah. 24096 Sk. Kapı No: 19 A Aksu / ANTALYA</p>
              <p className="mb-0 text-sm text-gray-400 font-normal">hello@erpolart.com | +90 530 944 07 01</p>
            </div>

          </div>
        </ScrollReveal>
      </div>
    </div>
  );
};

export default KvkkPage;
