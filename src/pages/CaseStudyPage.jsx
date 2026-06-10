import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Zap, 
  Target, 
  Cpu, 
  CheckCircle2, 
  ArrowUpRight,
  Gauge
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ScrollReveal from '../components/ScrollReveal';
import ContactForm from '../components/ContactForm';

const CaseStudyPage = () => {
  const { id } = useParams();
  const { t } = useTranslation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Try to get case study data from translations
  // If not found, it will use the key itself which we can handle
  const caseStudyData = t(`saasPage.showcase.${id}.caseStudy`, { returnObjects: true });
  const hasData = typeof caseStudyData === 'object' && caseStudyData !== null && !Array.isArray(caseStudyData);

  // Fallback to project info if detailed case study isn't available
  const title = t(`saasPage.showcase.${id}.title`);
  const desc = t(`saasPage.showcase.${id}.desc`);
  const stackString = t(`saasPage.showcase.${id}.stack`);
  const stack = stackString ? stackString.split(' · ') : ['React', 'Node.js', 'Supabase'];
  const previewUrl = id === 'contractoros' ? 'https://contractor-os.erpolart.com/' : (id === 'project2' ? 'https://reseva-ai.erpolart-ai.workers.dev/en/dashboard' : '#');

  const csTitle = t(`saasPage.showcase.${id}.title`);
  const csDesc = (hasData && caseStudyData.challenge ? caseStudyData.challenge : desc).slice(0, 160);

  return (
    <div className="bg-surface min-h-screen pt-32 pb-32 relative overflow-hidden">
      <Helmet>
        <title>{csTitle} — Case Study | ErpolArt</title>
        <meta name="description" content={csDesc} />
        <link rel="canonical" href={`https://erpolart.com/saas/case-study/${id}`} />
        <meta property="og:title" content={`${csTitle} — Case Study | ErpolArt`} />
        <meta property="og:description" content={csDesc} />
        <meta property="og:url" content={`https://erpolart.com/saas/case-study/${id}`} />
        <meta property="og:image" content="https://erpolart.com/og-image.webp" />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="ErpolArt" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${csTitle} — Case Study | ErpolArt`} />
        <meta name="twitter:description" content={csDesc} />
        <meta name="twitter:image" content="https://erpolart.com/og-image.webp" />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: csTitle,
          description: csDesc,
          author: { '@type': 'Organization', name: 'ErpolArt', url: 'https://erpolart.com' },
          publisher: { '@type': 'Organization', name: 'ErpolArt', logo: { '@type': 'ImageObject', url: 'https://erpolart.com/logo.png' } },
          url: `https://erpolart.com/saas/case-study/${id}`,
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: 'https://erpolart.com/' },
            { '@type': 'ListItem', position: 2, name: 'SaaS', item: 'https://erpolart.com/saas' },
            { '@type': 'ListItem', position: 3, name: csTitle, item: `https://erpolart.com/saas/case-study/${id}` },
          ],
        })}</script>
      </Helmet>
      {/* Background System */}
      <div className="absolute inset-0 bg-[linear-gradient(var(--grid-color)_1px,transparent_1px),linear-gradient(90deg,var(--grid-color)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none opacity-20" />
      <div className="absolute top-0 -left-1/4 w-1/2 h-full bg-indigo/5 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 -right-1/4 w-1/2 h-full bg-cyan/5 blur-[160px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        {/* Back Button */}
        <ScrollReveal>
          <Link to="/saas" className="group inline-flex items-center gap-3 text-gray-500 hover:text-white transition-colors mb-12">
            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ArrowLeft size={18} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">{t('nav.saas')} Showcase</span>
          </Link>
        </ScrollReveal>

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
          <ScrollReveal>
            <div className="space-y-8">
              <div className="inline-flex items-center gap-3 px-5 py-2 rounded-2xl bg-indigo/5 border border-indigo/20 text-indigo text-[10px] font-black uppercase tracking-[0.3em]">
                {t('saasPage.showcase.badge')}
              </div>
              <h1 className="text-5xl md:text-[88px] font-display font-black text-white italic tracking-tighter leading-[0.9]">
                {title}
              </h1>
              <p className="text-gray-400 text-xl md:text-2xl font-medium leading-relaxed max-w-xl">
                {desc}
              </p>
              
              <div className="flex flex-wrap gap-4 pt-4">
                <a href={previewUrl} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-white text-black font-black uppercase tracking-[0.2em] text-[11px] transition-all hover:scale-105 shadow-xl shadow-white/5">
                  Live Preview
                  <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="relative group">
              <div className="absolute inset-0 bg-indigo/20 blur-[100px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              <div className="relative rounded-[2rem] overflow-hidden border border-white/10 bg-surface shadow-2xl transform lg:rotate-2 group-hover:rotate-0 transition-transform duration-700">
                <img 
                  src={
                    id === 'project2' ? '/saas/SaaS-dektop-3.webp' :
                    id === 'brandpulse' ? '/saas/SaaS-desktop-2.webp' :
                    id === 'contractoros' ? '/SaaS-desktop.webp' :
                    `/saas/${id}_premium.webp`
                  }
                  alt={`${title} — ErpolArt SaaS Vaka Çalışması`}
                  className="w-full aspect-video object-cover object-top"
                  onError={(e) => { e.target.src = '/saas/nexus_premium.webp' }}
                />
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-24 mb-32">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-24">
            {/* The Challenge */}
            <ScrollReveal>
              <section className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
                    <Target size={24} />
                  </div>
                  <h2 className="text-3xl font-display font-black text-white italic tracking-tight uppercase">The Challenge</h2>
                </div>
                <p className="text-gray-400 text-lg leading-relaxed font-medium">
                  {hasData ? caseStudyData.challenge : "Identifying fragmented workflows and creating a unified system to handle high-volume data processing with zero latency."}
                </p>
              </section>
            </ScrollReveal>

            {/* The Solution */}
            <ScrollReveal>
              <section className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-500">
                    <Zap size={24} />
                  </div>
                  <h2 className="text-3xl font-display font-black text-white italic tracking-tight uppercase">The Solution</h2>
                </div>
                <p className="text-gray-400 text-lg leading-relaxed font-medium mb-10">
                  {hasData ? caseStudyData.solution : "A scalable cloud architecture designed for high-availability, featuring real-time synchronization and an intuitive dashboard for complex decision making."}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {hasData && Array.isArray(caseStudyData.features) ? (
                    caseStudyData.features.map((feature, i) => (
                      <div key={i} className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex items-start gap-4 hover:border-white/10 transition-colors">
                        <CheckCircle2 size={18} className="text-cyan mt-1 shrink-0" />
                        <div className="text-sm text-gray-300 font-medium leading-relaxed">
                          {feature}
                        </div>
                      </div>
                    ))
                  ) : (
                    [
                      "Real-time data synchronization",
                      "AI-powered predictive modeling",
                      "Automated reporting engine",
                      "Enterprise-grade security"
                    ].map((feature, i) => (
                      <div key={i} className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex items-start gap-4">
                        <CheckCircle2 size={18} className="text-cyan mt-1 shrink-0" />
                        <div className="text-sm text-gray-300 font-medium leading-relaxed">
                          {feature}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </section>
            </ScrollReveal>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-12">
            {/* Tech Stack */}
            <ScrollReveal delay={0.3}>
              <div className="p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/10 space-y-8 shadow-xl">
                <div className="flex items-center gap-3">
                  <Cpu size={20} className="text-indigo" />
                  <h3 className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Tech Stack</h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  {stack.map(tech => (
                    <span key={tech} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-colors">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            {/* Performance Stats */}
            <ScrollReveal delay={0.4}>
              <div className="p-10 rounded-[2.5rem] bg-gradient-to-br from-indigo/10 to-cyan/5 border border-white/10 space-y-8 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-cyan/10 blur-3xl rounded-full translate-x-10 -translate-y-10" />
                <div className="flex items-center gap-3">
                  <Gauge size={20} className="text-cyan" />
                  <h3 className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Performance</h3>
                </div>
                <div className="space-y-8">
                  {hasData && Array.isArray(caseStudyData.results) ? (
                    caseStudyData.results.map(stat => (
                      <div key={stat.label}>
                        <div className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">{stat.label}</div>
                        <div className="text-4xl font-display font-black text-white italic tracking-tight">{stat.value}</div>
                      </div>
                    ))
                  ) : (
                    [
                      { label: 'System Uptime', value: '99.9%' },
                      { label: 'Data Processing', value: '<200ms' },
                      { label: 'User Growth', value: '+140%' }
                    ].map(stat => (
                      <div key={stat.label}>
                        <div className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">{stat.label}</div>
                        <div className="text-4xl font-display font-black text-white italic tracking-tight">{stat.value}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>

        {/* Contact Form Integration */}
        <div className="mt-48">
          <div className="text-center mb-16">
            <ScrollReveal>
              <div className="inline-flex items-center gap-3 px-5 py-2 rounded-2xl bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.3em] mb-8">
                {t('contact.titlePart1')}
              </div>
              <h2 className="text-4xl md:text-[72px] font-display font-black text-white italic tracking-tighter mb-8 leading-[0.9]">
                {t('saasPage.caseStudy.footerTitlePart1')} <br />
                <span className="inline-block py-4 pe-12 ps-2 text-transparent bg-clip-text bg-gradient-to-r from-indigo to-cyan">
                  {t('saasPage.caseStudy.footerTitlePart2')}
                </span>
              </h2>
              <p className="text-gray-500 text-lg font-medium max-w-2xl mx-auto">
                {t('saasPage.caseStudy.footerSubtitle')}
              </p>
            </ScrollReveal>
          </div>
          
          <ContactForm id="case-study-contact" />
        </div>
      </div>
    </div>
  );
};

export default CaseStudyPage;
