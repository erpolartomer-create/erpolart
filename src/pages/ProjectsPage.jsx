import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import CustomServicesOverview from '../components/projects/CustomServicesOverview';
import BespokeComparison from '../components/projects/BespokeComparison';
import ProcessTimeline from '../components/projects/ProcessTimeline';
import DesignManifesto from '../components/projects/DesignManifesto';
import ProjectsPricing from '../components/projects/ProjectsPricing';
import ProjectsFAQ from '../components/projects/ProjectsFAQ';
import ScrollReveal from '../components/ScrollReveal';

import { motion } from 'framer-motion';
import { Code2, MessageCircle, Rocket } from 'lucide-react';

const ProjectsPage = () => {
  const { t } = useTranslation();

  return (
    <div className="pt-24 pb-24 min-h-screen bg-deep-black relative transition-colors duration-500" style={{ overflowX: 'clip' }}>
      <Helmet>
        <title>Projelerimiz - ErpolArt</title>
        <meta name="description" content="ErpolArt tarafından hayata geçirilen yaratıcı projeler ve dijital başarı hikayeleri." />
        <link rel="canonical" href="https://erpolart.com/projects" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="ErpolArt" />
        <meta property="og:title" content="Projelerimiz - ErpolArt" />
        <meta property="og:description" content="ErpolArt tarafından hayata geçirilen yaratıcı projeler ve dijital başarı hikayeleri." />
        <meta property="og:url" content="https://erpolart.com/projects" />
        <meta property="og:image" content="https://erpolart.com/og-image.webp" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Projelerimiz - ErpolArt" />
        <meta name="twitter:description" content="ErpolArt tarafından hayata geçirilen yaratıcı projeler ve dijital başarı hikayeleri." />
        <meta name="twitter:image" content="https://erpolart.com/og-image.webp" />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: 'Bespoke Web Development',
          provider: { '@type': 'Organization', name: 'ErpolArt', url: 'https://erpolart.com' },
          description: 'Custom-engineered web experiences and bespoke digital architectures. No templates, no shortcuts — built exclusively for your brand.',
          url: 'https://erpolart.com/projects',
          areaServed: 'Worldwide',
          serviceType: 'Custom Web Application Development',
        })}</script>
      </Helmet>

      {/* Decorative background — own overflow-hidden so sticky children aren't affected */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(var(--grid-color)_1px,transparent_1px),linear-gradient(90deg,var(--grid-color)_1px,transparent_1px)] bg-[size:40px_40px]" />
        {/* Desktop ambient lighting */}
        <div className="hidden md:block absolute top-0 left-0 w-[80vw] h-[80vw] max-w-[1200px] max-h-[1200px] bg-violet/10 dark:bg-violet/15 rounded-full blur-[180px] -translate-y-1/2 -translate-x-1/4 transition-colors duration-1000" />
        <div className="hidden md:block absolute top-1/4 right-0 w-[70vw] h-[70vw] max-w-[1000px] max-h-[1000px] bg-indigo/10 dark:bg-indigo/15 rounded-full blur-[150px] translate-x-1/4 transition-colors duration-1000" />
        <div className="hidden md:block absolute bottom-1/3 left-0 w-[90vw] h-[90vw] max-w-[1400px] max-h-[1400px] bg-cyan/10 dark:bg-cyan/12 rounded-full blur-[200px] -translate-x-1/4 transition-colors duration-1000 shadow-[0_0_100px_rgba(0,179,166,0.1)]" />
        <div className="hidden md:block absolute bottom-0 right-1/4 w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] bg-violet/5 dark:bg-violet/10 rounded-full blur-[150px] translate-y-1/4 transition-colors duration-1000" />
        {/* Mobile ambient lighting */}
        <div className="md:hidden absolute top-[-5%] left-1/2 -translate-x-1/2 w-screen h-screen bg-violet/5 dark:bg-violet/8 rounded-full blur-[120px]" />
        <div className="md:hidden absolute top-[40%] left-1/2 -translate-x-1/2 w-screen h-screen bg-indigo/5 dark:bg-indigo/8 rounded-full blur-[140px] opacity-60" />
        <div className="md:hidden absolute bottom-0 left-1/2 -translate-x-1/2 w-screen h-[120vw] bg-cyan/5 dark:bg-cyan/8 rounded-full blur-[120px]" />
      </div>

      {/* Page-wide Floating Icons */}
      <div className="hidden xl:block absolute inset-0 pointer-events-none z-50">
        <motion.div
          animate={{ y: [0, -15, 0], rotate: [0, 8, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-40 left-10 w-12 h-12 rounded-xl bg-surface/80 border border-white/10 flex items-center justify-center text-violet shadow-2xl backdrop-blur-md"
        >
          <Code2 size={20} />
        </motion.div>
        <motion.div
          animate={{ y: [0, 15, 0], rotate: [0, -8, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-60 right-20 w-14 h-14 rounded-2xl bg-surface/80 border border-white/10 flex items-center justify-center text-cyan shadow-2xl backdrop-blur-md"
        >
          <MessageCircle size={22} />
        </motion.div>
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-40 left-20 w-12 h-12 rounded-xl bg-surface/80 border border-white/10 flex items-center justify-center text-indigo shadow-2xl backdrop-blur-md"
        >
          <Rocket size={20} />
        </motion.div>
      </div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10 pt-0">
        <CustomServicesOverview />
        <ProjectsPricing />
        <DesignManifesto />
        <BespokeComparison />
        <ProcessTimeline />
        <ProjectsFAQ />

        {/* Narrative Block 3: The Promise - Final Closing Statement */}
        <ScrollReveal>
          <div className="relative shadow-2xl rounded-[3rem] max-w-6xl mx-auto mb-20 md:mb-32">
            <div className="bg-surface/30 backdrop-blur-[100px] border border-white/10 rounded-[3rem] p-8 md:p-24 relative overflow-hidden text-center isolate">
              {/* Internal Glow for depth */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-indigo/5 blur-[120px] -z-10 pointer-events-none" />

              <div className="relative z-10 max-w-4xl mx-auto">
                <div className="inline-block text-indigo font-black text-[12px] uppercase tracking-[0.4em] mb-10 border-b-2 border-indigo/30 pb-2">{t('projectsPage.promise.badge')}</div>
                <h3 className="text-4xl md:text-[72px] font-display font-black text-white mb-10 leading-[1.1] tracking-tighter italic">
                  {t('projectsPage.promise.title')}
                </h3>
                <p className="text-gray-400 text-lg md:text-2xl font-medium leading-relaxed mb-12 opacity-80 max-w-3xl mx-auto">
                  {t('projectsPage.promise.desc')}
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
                  <div className="flex -space-x-4">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="w-12 h-12 rounded-full border-4 border-surface bg-deep-black overflow-hidden relative grayscale hover:grayscale-0 transition-all cursor-pointer hover:scale-110 hover:z-20 shadow-lg">
                        <img src={`https://i.pravatar.cc/150?u=${i + 20}`} alt="ErpolArt Dijital Çözümler Müşteri Referansı" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                  <div className="h-px w-12 bg-white/10 hidden sm:block" />
                  <div className="text-[11px] font-black text-white/50 uppercase tracking-[0.2em]">{t('projectsPage.promise.others')}</div>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
};

export default ProjectsPage;

