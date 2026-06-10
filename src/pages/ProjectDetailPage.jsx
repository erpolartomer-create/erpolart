import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, ArrowUpRight, Globe, Cpu, ShieldCheck, Zap,
  Code2, Layers, Smartphone, MousePointer2, ExternalLink,
  ChevronRight, MessageCircle
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { projects } from '../data/projects';
import ScrollReveal from '../components/ScrollReveal';

const ProjectDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const project = projects.find(p => p.id === parseInt(id));

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!project) {
      navigate('/projects');
    }
  }, [project, navigate]);

  if (!project) return null;

  const seoTitle = `${project.title} - ErpolArt`;
  const seoUrl = `https://erpolart.com/projects/${project.id}`;
  const seoImage = project.image?.startsWith('http') ? project.image : 'https://erpolart.com/og-image.webp';

  return (
    <div className="bg-deep-black min-h-screen pt-32 pb-24 relative overflow-hidden transition-colors duration-500">
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={project.description} />
        <link rel="canonical" href={seoUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="ErpolArt" />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={project.description} />
        <meta property="og:url" content={seoUrl} />
        <meta property="og:image" content={seoImage} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoTitle} />
        <meta name="twitter:description" content={project.description} />
        <meta name="twitter:image" content={seoImage} />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'CreativeWork',
          name: project.title,
          description: project.description,
          image: seoImage,
          url: seoUrl,
          creator: { '@type': 'Organization', name: 'ErpolArt', url: 'https://erpolart.com' },
          genre: project.category,
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: 'https://erpolart.com/' },
            { '@type': 'ListItem', position: 2, name: 'Projeler', item: 'https://erpolart.com/projects' },
            { '@type': 'ListItem', position: 3, name: project.title, item: seoUrl },
          ],
        })}</script>
      </Helmet>
      {/* SaaS-Style Background System */}
      <div className="absolute inset-0 bg-[linear-gradient(var(--grid-color)_1px,transparent_1px),linear-gradient(90deg,var(--grid-color)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />
      
      {/* Expansive Ambient Decorative Lighting */}
      <div className="absolute top-0 left-0 w-[80vw] max-w-[1000px] h-[80vw] max-h-[1000px] bg-violet/10 rounded-full blur-[150px] -translate-y-1/2 -translate-x-1/4 pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-[70vw] max-w-[800px] h-[70vw] max-h-[800px] bg-cyan/10 rounded-full blur-[120px] translate-x-1/4 pointer-events-none" />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        
        {/* Navigation & Breadcrumbs */}
        <ScrollReveal>
           <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] mb-16">
              <Link to="/projects" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors group">
                 <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                 {t('projectsPage.projectShowcase.archives')}
              </Link>
              <ChevronRight size={10} className="text-gray-700" />
              <span className="text-white opacity-50 uppercase">{t(`projectsData.p${project.id}.title`, project.title)}</span>
           </div>
        </ScrollReveal>

        {/* Hero Section */}
        <div className="flex flex-col lg:flex-row items-end gap-12 lg:gap-24 mb-24">
           <ScrollReveal className="w-full lg:w-[60%]">
              <div className="flex flex-wrap gap-3 mb-8">
                 <div className="bg-indigo/10 text-indigo px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2 border border-indigo/20">
                    <ShieldCheck size={12} /> Signature Architecture
                 </div>
                 <div className="bg-cyan/10 text-cyan px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2 border border-cyan/20">
                    <Cpu size={12} /> Custom Engine
                 </div>
              </div>
              
              <h1 className="text-5xl md:text-[88px] font-display font-black text-white leading-[0.9] tracking-tighter mb-8 italic">
                 {t(`projectsData.p${project.id}.title`, project.title)}
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-400 font-medium leading-relaxed max-w-2xl opacity-90">
                 {t(`projectsData.p${project.id}.desc`, project.description)}
              </p>
           </ScrollReveal>

           <ScrollReveal delay={0.2} className="w-full lg:w-[45%] pb-4">
              <div className="p-8 rounded-[2rem] bg-surface/50 border border-white/10 backdrop-blur-xl">
                 <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-8">
                    <div>
                       <div className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Architectural Status</div>
                       <div className="text-2xl font-display font-black text-white italic tracking-widest uppercase">Deployed</div>
                    </div>
                    <div className="flex gap-3 w-full sm:w-auto">
                       <motion.button 
                         onClick={() => window.open('https://erpolart.com', '_blank')}
                         className="flex-grow sm:flex-initial px-6 py-4 rounded-xl bg-cyan/5 border border-cyan/20 text-white font-black uppercase tracking-[0.2em] text-[10px] transition-all hover:bg-cyan/10 flex items-center justify-center gap-2 group relative overflow-hidden"
                       >
                         <span className="relative z-10">{t('projectsPage.projectShowcase.liveView')}</span>
                         <ExternalLink size={14} className="text-cyan group-hover:scale-110 transition-transform relative z-10" />
                       </motion.button>
                    </div>
                 </div>
                 
                 <button 
                   onClick={() => navigate('/contact')}
                   className="w-full px-8 py-5 rounded-[1.5rem] bg-indigo text-[#FFFFFF] font-black uppercase tracking-[0.2em] text-[11px] transition-all hover:scale-[1.02] hover:shadow-[0_20px_40px_-10px_rgba(92,115,255,0.4)] flex items-center justify-center gap-3"
                 >
                   <span>{t('footer.start')}</span>
                   <ArrowUpRight size={16} className="text-[#FFFFFF]" />
                 </button>
              </div>
           </ScrollReveal>
        </div>

        {/* Mockup Presentation */}
        <ScrollReveal>
           <div className="relative w-full max-w-5xl mx-auto mb-32 group">
              <div className="rounded-[2.5rem] overflow-hidden border border-white/10 bg-surface shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] relative">
                <div className="relative aspect-video overflow-hidden bg-black flex items-center justify-center">
                  <img 
                      src={project.image} 
                      alt={project.title}
                      className="w-full h-full object-cover transform scale-[1.05] group-hover:scale-110 transition-transform duration-[5s] ease-out opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-deep-black via-transparent to-transparent opacity-60" />
                </div>
              </div>
              
              {/* Decorative glows */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo/20 rounded-full blur-[80px] -z-10 animate-pulse" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-cyan/20 rounded-full blur-[80px] -z-10 animate-pulse" />
           </div>
        </ScrollReveal>

        {/* Project Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
           <ScrollReveal>
              <div className="text-indigo text-[11px] font-black uppercase tracking-[0.4em] mb-8 pb-2 border-b-2 border-indigo/20 inline-block">
                 Case Study Overview
              </div>
              <h2 className="text-3xl lg:text-5xl font-display font-black text-white tracking-tighter mb-8 leading-tight italic">
                 Architecting <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo via-violet to-cyan">Digital Dominance.</span>
              </h2>
              <p className="text-gray-400 text-lg leading-[1.8] font-medium mb-12">
                 This project represents our commitment to handwritten logic and zero-copy design. We translated the brand's core values into a high-performance digital ecosystem centered on user conversion and architectural stability.
              </p>
              
              <div className="space-y-6">
                 {[
                   { icon: Code2, label: 'Handwritten Logic', desc: '100% custom codebase without bloated libraries.' },
                   { icon: Smartphone, label: 'Adaptive Mastery', desc: 'Fluid transitions tailored for every screen size.' },
                   { icon: Zap, label: 'Velocity Engine', desc: 'Optimized for sub-second load times globally.' }
                 ].map((feat, i) => (
                    <div key={i} className="flex gap-4 p-6 rounded-2xl bg-surface/30 border border-white/5 group hover:border-indigo/30 transition-all">
                       <feat.icon size={24} className="text-indigo shrink-0" />
                       <div>
                          <div className="text-white font-black text-xs uppercase tracking-widest mb-1">{feat.label}</div>
                          <div className="text-gray-500 text-xs font-bold uppercase tracking-wider">{feat.desc}</div>
                       </div>
                    </div>
                 ))}
              </div>
           </ScrollReveal>

           <div className="space-y-12">
              <ScrollReveal direction="up">
                 <div className="grid grid-cols-2 gap-4">
                    {[
                      { icon: Globe, label: 'Global Performance', val: '99/100', color: 'text-indigo' },
                      { icon: ShieldCheck, label: 'Security Grade', val: 'Enterprise', color: 'text-cyan' },
                      { icon: Layers, label: 'Stack Integrity', val: 'Perfect', color: 'text-violet' },
                      { icon: MousePointer2, label: 'Interaction UX', val: 'Liquid', color: 'text-orange-500' }
                    ].map((stat, i) => (
                      <div key={i} className="p-8 bg-surface border border-white/10 rounded-[2rem] hover:border-indigo/40 transition-colors shadow-2xl">
                         <stat.icon size={28} className={`${stat.color} mb-6`} />
                         <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">{stat.label}</div>
                         <div className="text-lg font-black text-white italic">{stat.val}</div>
                      </div>
                    ))}
                 </div>
              </ScrollReveal>

              <ScrollReveal direction="up" delay={0.2}>
                 <div className="p-10 bg-surface/50 backdrop-blur-xl border border-white/10 rounded-[2.5rem] relative overflow-hidden isolate text-center">
                    <div className="absolute top-0 left-0 w-full h-full bg-indigo/5 blur-3xl -z-10" />
                    <MessageCircle size={40} className="text-indigo mx-auto mb-8" />
                    <h3 className="text-2xl font-display font-black text-white mb-4 italic uppercase tracking-tighter">Ready for your Signature?</h3>
                    <p className="text-gray-400 mb-10 text-sm font-medium">Let's build a platform that turns your vision into a competitive digital advantage.</p>
                    <Link to="/contact" className="inline-flex px-10 py-5 rounded-2xl bg-indigo text-white font-black text-[10px] uppercase tracking-[0.3em] hover:scale-105 transition-all">Start Project</Link>
                 </div>
              </ScrollReveal>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
