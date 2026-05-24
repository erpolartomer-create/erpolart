import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Sparkles, Mail, MessageSquare, Building2, Phone } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import ContactForm from '../components/ContactForm';
import { motion } from 'framer-motion';

const ContactPage = () => {
   const { t } = useTranslation();

   return (
      <div className="min-h-screen bg-deep-black pt-32 pb-24 relative overflow-hidden transition-colors duration-500">
         <Helmet>
            <title>İletişim - ErpolArt</title>
            <meta name="description" content="Projeleriniz için bizimle iletişime geçin. ErpolArt ekibi size yardımcı olmaktan mutluluk duyar." />
            <link rel="canonical" href="https://erpolart.com/contact" />
            <meta property="og:type" content="website" />
            <meta property="og:site_name" content="ErpolArt" />
            <meta property="og:title" content="İletişim - ErpolArt" />
            <meta property="og:description" content="Projeleriniz için bizimle iletişime geçin. ErpolArt ekibi size yardımcı olmaktan mutluluk duyar." />
            <meta property="og:url" content="https://erpolart.com/contact" />
            <meta property="og:image" content="https://erpolart.com/og-image.webp" />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content="İletişim - ErpolArt" />
            <meta name="twitter:description" content="Projeleriniz için bizimle iletişime geçin. ErpolArt ekibi size yardımcı olmaktan mutluluk duyar." />
            <meta name="twitter:image" content="https://erpolart.com/og-image.webp" />
         </Helmet>
         
         {/* SaaS-Style Background System */}
         <div className="absolute inset-0 bg-[linear-gradient(var(--grid-color)_1px,transparent_1px),linear-gradient(90deg,var(--grid-color)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

         {/* Expansive Ambient Lighting System */}
         <div className="absolute top-0 right-0 w-[70vw] h-[70vw] bg-indigo/10 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
         <div className="absolute bottom-1/4 left-0 w-[60vw] h-[60vw] bg-violet/10 blur-[150px] rounded-full -translate-x-1/4 pointer-events-none" />
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] bg-cyan/5 blur-[180px] rounded-full pointer-events-none opacity-40" />

         <div className="container mx-auto px-6 md:px-12 relative z-10">
            <div className="flex flex-col lg:flex-row gap-16 lg:gap-32 items-start">

               {/* Left Side: Context & Direct Contact */}
               <div className="w-full lg:w-[35%] sticky lg:top-20">
                  <ScrollReveal direction="left">
                     <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo/10 border border-indigo/20 text-indigo text-[10px] font-black uppercase tracking-[0.3em] mb-8">
                        <Sparkles size={14} />
                        PROTOCOL: DISCOVERY v1.0
                     </div>

                     <h1 className="text-5xl md:text-[88px] font-display font-black text-white mb-10 leading-[0.9] tracking-tighter italic">
                        {t('contact.titlePart1')} <br />
                        <span className="text-white dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-cyan dark:via-pure-white dark:to-indigo pb-2 inline-block">{t('contact.titleAccent')}</span>
                     </h1>

                     <p className="text-gray-400 text-lg md:text-xl font-medium leading-relaxed mb-16 opacity-80 transition-colors">
                        {t('contact.subtitle')}
                     </p>

                     {/* Company Information Card */}
                     <div className="group relative">
                        <div className="absolute inset-0 bg-indigo/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                        <div className="relative bg-surface/40 backdrop-blur-2xl border border-white/5 p-6 md:p-8 rounded-[2.5rem] overflow-hidden">
                           <div className="absolute top-0 right-0 w-32 h-32 bg-indigo/5 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/2" />

                           <div className="flex flex-col gap-5 text-sm text-gray-400">
                              <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">{t('contact.companyLabel')}</div>
                              
                              <div className="flex gap-4 items-start">
                                 <div className="w-8 h-8 rounded-lg bg-indigo/10 flex items-center justify-center text-indigo shrink-0">
                                    <Building2 size={16} />
                                 </div>
                                 <div>
                                    <div className="font-bold text-gray-500 text-[10px] uppercase tracking-wider">{t('contact.companyTitle')}</div>
                                    <div className="text-white font-medium mt-1 text-xs md:text-sm">FİDAN ÜNAL ERPOLAT - ERPOLART MİMARLIK</div>
                                 </div>
                              </div>

                              <div className="flex gap-4 items-start">
                                 <div className="w-8 h-8 rounded-lg bg-indigo/10 flex items-center justify-center text-indigo shrink-0">
                                    <Phone size={16} />
                                 </div>
                                 <div>
                                    <div className="font-bold text-gray-500 text-[10px] uppercase tracking-wider">{t('contact.companyPhone')}</div>
                                    <a href="tel:+905309440701" className="text-white hover:text-indigo transition-colors font-medium mt-1 text-xs md:text-sm block">+90 530 944 07 01</a>
                                 </div>
                              </div>

                              <div className="flex gap-4 items-start">
                                 <div className="w-8 h-8 rounded-lg bg-indigo/10 flex items-center justify-center text-indigo shrink-0">
                                    <Mail size={16} />
                                 </div>
                                 <div>
                                    <div className="font-bold text-gray-500 text-[10px] uppercase tracking-wider">{t('contact.companyEmail')}</div>
                                    <a href="mailto:hello@erpolart.com" className="text-white hover:text-indigo transition-colors font-medium mt-1 text-xs md:text-sm block">hello@erpolart.com</a>
                                 </div>
                              </div>

                           </div>
                        </div>
                     </div>
                  </ScrollReveal>
               </div>

               {/* Right Side: Comprehensive Quote Form */}
               <div className="w-full lg:w-[65%] lg:pt-12">
                  <ScrollReveal direction="right" delay={0.2}>
                     <ContactForm id="main-contact-form" />
                  </ScrollReveal>
               </div>

            </div>
         </div>
      </div>
   );
};

export default ContactPage;
