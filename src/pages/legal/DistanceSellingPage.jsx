import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import ScrollReveal from '../../components/ScrollReveal';
import { useTranslation } from 'react-i18next';

const DistanceSellingPage = () => {
  const { t } = useTranslation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-surface min-h-screen pt-32 pb-24 relative overflow-hidden">
      <Helmet>
        <title>Mesafeli Satış Sözleşmesi - ErpolArt</title>
        <meta name="description" content="ErpolArt mesafeli satış sözleşmesi — hizmet satın alımlarına ilişkin yasal koşullar ve şartlar." />
        <link rel="canonical" href="https://erpolart.com/mesafeli-satis-sozlesmesi" />
        <meta name="robots" content="index, follow" />
      </Helmet>
      {/* Background System */}
      <div className="absolute inset-0 bg-[linear-gradient(var(--grid-color)_1px,transparent_1px),linear-gradient(90deg,var(--grid-color)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none opacity-20" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 max-w-4xl relative z-10">
        <ScrollReveal>
          <div className="mb-12">
            <Link to="/" className="inline-flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 hover:text-white transition-all group">
              <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-indigo/50 group-hover:bg-indigo/10 transition-all">
                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              </div>
              <span>{t('legal.distanceSelling.backToHome')}</span>
            </Link>
          </div>

          <div className="flex items-center gap-4 mb-12">
            <div className="w-12 h-12 rounded-2xl bg-indigo/10 text-indigo flex items-center justify-center border border-indigo/20">
              <ShieldCheck size={24} />
            </div>
            <h1 className="text-3xl md:text-5xl font-display font-black text-white italic tracking-tighter">
              {t('legal.distanceSelling.title').split(' ').slice(0,-1).join(' ')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo to-cyan">{t('legal.distanceSelling.title').split(' ').slice(-1)}</span>
            </h1>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="bg-white/[0.02] border border-white/5 p-8 md:p-12 rounded-[2.5rem] shadow-2xl text-gray-300 text-sm md:text-base leading-relaxed">
            
            <p className="font-bold text-white mb-16">{t('legal.distanceSelling.lastUpdate')}</p>

            <div className="mb-16">
              <h3 className="text-xl md:text-2xl font-bold text-cyan mb-8">{t('legal.distanceSelling.article1')}</h3>
              
              <div className="mb-8 p-6 rounded-2xl bg-white/[0.03] border border-white/10">
                <p className="text-indigo font-bold text-lg mb-4">{t('legal.distanceSelling.seller')}</p>
                <ul className="list-none space-y-2">
                  <li><strong>{t('legal.preInfo.sellerName').split(':')[0]}:</strong> {t('legal.preInfo.sellerName').split(':')[1]}</li>
                  <li><strong>{t('legal.preInfo.sellerAddress').split(':')[0]}:</strong> {t('legal.preInfo.sellerAddress').split(':')[1]}</li>
                  <li><strong>Vergi Kimlik Numarası:</strong> 9080295761</li>
                  <li><strong>{t('legal.preInfo.sellerPhone').split(':')[0]}:</strong> {t('legal.preInfo.sellerPhone').split(':')[1]}</li>
                  <li><strong>{t('legal.preInfo.sellerEmail').split(':')[0]}:</strong> {t('legal.preInfo.sellerEmail').split(':')[1]}</li>
                </ul>
              </div>

              <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10">
                <p className="text-indigo font-bold text-lg mb-4">{t('legal.distanceSelling.buyer')}</p>
                <p>{t('legal.distanceSelling.buyerDesc')}</p>
              </div>
            </div>

            <div className="mb-16">
              <h3 className="text-xl md:text-2xl font-bold text-cyan mb-6">{t('legal.distanceSelling.article2')}</h3>
              <p>{t('legal.distanceSelling.subjectDesc')}</p>
            </div>

            <div className="mb-16">
              <h3 className="text-xl md:text-2xl font-bold text-cyan mb-6">{t('legal.distanceSelling.article3')}</h3>
              <p className="mb-6">{t('legal.distanceSelling.servicesIntro')}</p>
              <ul className="list-disc pl-6 space-y-4 mb-6">
                <li>{t('legal.preInfo.s1')}</li>
                <li>{t('legal.preInfo.s2')}</li>
                <li>{t('legal.preInfo.s3')}</li>
                <li>{t('legal.preInfo.s4')}</li>
              </ul>
              <p>{t('legal.distanceSelling.servicesOutro')}</p>
            </div>

            <div className="mb-16">
              <h3 className="text-xl md:text-2xl font-bold text-cyan mb-6">{t('legal.distanceSelling.article4')}</h3>
              <p className="mb-6">{t('legal.distanceSelling.withdrawalDesc1')}</p>
              <p>{t('legal.distanceSelling.withdrawalDesc2')}</p>
            </div>

            <div className="mb-16">
              <h3 className="text-xl md:text-2xl font-bold text-cyan mb-6">{t('legal.distanceSelling.article5')}</h3>
              <p className="mb-6">{t('legal.distanceSelling.subIntro')}</p>
              <ul className="list-disc pl-6 space-y-4">
                <li>{t('legal.distanceSelling.sb1')}</li>
                <li>{t('legal.distanceSelling.sb2')}</li>
                <li>{t('legal.distanceSelling.sb3')}</li>
                <li>{t('legal.distanceSelling.sb4')}</li>
              </ul>
            </div>

            <div className="mb-16">
              <h3 className="text-xl md:text-2xl font-bold text-cyan mb-6">{t('legal.distanceSelling.article6')}</h3>
              <ul className="list-decimal pl-6 space-y-6">
                <li>{t('legal.distanceSelling.gp1')}</li>
                <li>{t('legal.distanceSelling.gp2')}</li>
                <li>{t('legal.distanceSelling.gp3')}</li>
                <li>{t('legal.distanceSelling.gp4')}</li>
              </ul>
            </div>

            <div className="mb-16">
              <h3 className="text-xl md:text-2xl font-bold text-cyan mb-6">{t('legal.distanceSelling.article7')}</h3>
              <p>{t('legal.distanceSelling.jurisdictionText')}</p>
            </div>

            {/* Footer Signature */}
            <div className="mt-16 pt-8 border-t border-white/10 font-bold text-white/80">
              <p className="mb-2">{t('legal.distanceSelling.seller')}: FİDAN ÜNAL ERPOLAT - ERPOLART MİMARLIK</p>
              <p className="mb-2 text-sm text-gray-400 font-normal">{t('legal.preInfo.sellerAddress').split(':')[0]}: Pınarlı Mah. 24096 Sk. Kapı No: 19 A Aksu / ANTALYA</p>
              <p className="mb-0 text-sm text-gray-400 font-normal">{t('legal.preInfo.sellerPhone').split(':')[0]}: +90 530 944 07 01 | {t('legal.preInfo.sellerEmail').split(':')[0]}: hello@erpolart.com</p>
            </div>

          </div>
        </ScrollReveal>
      </div>
    </div>
  );
};

export default DistanceSellingPage;
