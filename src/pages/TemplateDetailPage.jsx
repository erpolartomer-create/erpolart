import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, ArrowUpRight, CheckCircle2, Zap, Layout, Smartphone, MousePointer2, Code2, Layers,
  Target, ShieldCheck, Clock, ExternalLink, ChevronRight, Cpu, Gem, Box, Activity, Sparkles,
  Globe, Search, Moon, Cloud, Image, Calendar, BarChart3, Rocket, MessageSquare, Fingerprint,
  Heart, Database, Shield
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { supabase } from '../lib/supabase';
import ScrollReveal from '../components/ScrollReveal';

// High-Fidelity Tech Icons
const TechIcon = ({ name }) => {
  const n = name.toLowerCase();

  if (n.includes('react')) return (
    <svg viewBox="-11.5 -10.23174 23 20.46348" className="w-4 h-4 fill-none stroke-[#61DAFB]">
      <circle cx="0" cy="0" r="2.05" fill="#61DAFB" />
      <g strokeWidth="1.2">
        <ellipse rx="11" ry="4.2" />
        <ellipse rx="11" ry="4.2" transform="rotate(60)" />
        <ellipse rx="11" ry="4.2" transform="rotate(120)" />
      </g>
    </svg>
  );

  if (n.includes('tailwind')) return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#06B6D4]">
      <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8 0.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z" />
    </svg>
  );

  if (n.includes('next')) return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
      <path d="M14.539 12.871l-5.694-8.73h-1.66v15.718h1.895v-10.743l6.059 9.324h1.724v-15.718h-2.324z" />
    </svg>
  );

  if (n.includes('framer') || n.includes('motion')) return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#FF008C]">
      <path d="M4 0h16v8l-8 8-8-8V0zm0 16l8 8 8-8H4z" />
    </svg>
  );

  if (n.includes('three')) return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
      <path d="m11.162 4.416 5.275 8.354-10.55 0zM5.132 14.191l5.276 8.354 5.275-8.354zM24 0H0v24h24zM16.488 2.25l7.512 11.902h-15.024zM7.512 21.75 0 9.848h15.024z" fillRule="evenodd" />
    </svg>
  );

  if (n.includes('supabase')) return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#3ECF8E]">
      <path d="M21.362 9.354H12V.338L2.638 14.646H12v9.016z" />
    </svg>
  );

  if (n.includes('node')) return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#339933]">
      <path d="M12 2a.7.7 0 0 1 .37.1l9 5.2a.7.7 0 0 1 .37.6v10.4a.7.7 0 0 1-.37.6l-9 5.2a.7.7 0 0 1-.74 0l-9-5.2a.7.7 0 0 1-.37-.6V7.9a.7.7 0 0 1 .37-.6l9-5.2A.7.7 0 0 1 12 2zm1.4 12.3a2.6 2.6 0 0 0-2.6-2.6 2.6 2.6 0 0 0-2.6 2.6 2.6 2.6 0 0 0 2.6 2.6 2.6 2.6 0 0 0 2.6-2.6zm3.3-6.5h-1.6a.7.7 0 0 0-.7.7v4.6a.7.7 0 0 0 .7.7h1.6a.7.7 0 0 0 .7-.7v-4.6a.7.7 0 0 0-.7-.7z" />
    </svg>
  );

  if (n.includes('mongo')) return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#47A248]">
      <path d="M17.193 9.555c-1.077-4.305-3.033-7.462-5.184-9.555h-.02a.151.151 0 0 0-.214.004C9.55 2.106 7.42 5.313 6.335 9.7a14.22 14.22 0 0 0-.25 4.383 6.83 6.83 0 0 0 4.145 6.471h.024A10.884 10.884 0 0 1 8.84 23.472a.15.15 0 0 0 .193.18 16.512 16.512 0 0 0 5.485-3.067h.01c.06-.018.12-.04.18-.063a6.83 6.83 0 0 0 2.735-6.584 14.195 14.195 0 0 0-.25-4.383z" />
    </svg>
  );

  return <Box size={14} className="text-white/80" />;
};

const getTechTheme = (name) => {
  const n = name.toLowerCase();

  if (n.includes('react')) return {
    border: 'border-[#61DAFB]/30',
    text: 'text-[#61DAFB]',
    shadow: 'shadow-[0_10px_30px_-5px_rgba(97,218,251,0.25)]'
  };

  if (n.includes('tailwind')) return {
    border: 'border-[#06B6D4]/30',
    text: 'text-[#06B6D4]',
    shadow: 'shadow-[0_10px_30px_-5px_rgba(6,182,212,0.25)]'
  };

  if (n.includes('framer') || n.includes('motion')) return {
    border: 'border-[#FF008C]/40',
    text: 'text-[#FF008C]',
    shadow: 'shadow-[0_10px_30px_-5px_rgba(255,0,140,0.25)]'
  };

  if (n.includes('three')) return {
    border: 'border-white/40',
    text: 'text-white font-bold',
    shadow: 'shadow-[0_10px_30px_-5px_rgba(255,255,255,0.15)]'
  };

  if (n.includes('next') || n.includes('vercel')) return {
    border: 'border-white/30',
    text: 'text-white',
    shadow: 'shadow-[0_10px_30px_-5px_rgba(255,255,255,0.15)]'
  };

  if (n.includes('supabase')) return {
    border: 'border-[#3ECF8E]/30',
    text: 'text-[#3ECF8E]',
    shadow: 'shadow-[0_10px_30px_-5px_rgba(62,207,142,0.25)]'
  };

  if (n.includes('node')) return {
    border: 'border-[#339933]/40',
    text: 'text-[#339933]',
    shadow: 'shadow-[0_10px_30px_-5px_rgba(51,153,51,0.25)]'
  };

  if (n.includes('mongo')) return {
    border: 'border-[#47A248]/30',
    text: 'text-[#47A248]',
    shadow: 'shadow-[0_10px_30px_-5px_rgba(71,162,72,0.25)]'
  };

  return {
    border: 'border-white/10',
    text: 'text-white/80',
    shadow: 'shadow-[0_10px_30px_-5px_rgba(255,255,255,0.1)]'
  };
};

// Simplified Semantic Feature Icon Mapping (Client-Friendly Sync)
const getFeatureIcon = (feature) => {
  const f = feature.toLowerCase();

  if (f.includes('service showcase')) return Layers;
  if (f.includes('media') || f.includes('gallery')) return Image;
  if (f.includes('admin control')) return Layout;
  if (f.includes('blog') || f.includes('content manager')) return MessageSquare;
  if (f.includes('booking') || f.includes('appointment')) return Calendar;
  if (f.includes('lead') || f.includes('contact form')) return Target;
  if (f.includes('dark') || f.includes('light')) return Moon;
  if (f.includes('multi-language')) return Globe;
  if (f.includes('google seo')) return Search;
  if (f.includes('speed') || f.includes('performance')) return Rocket;
  if (f.includes('animations') || f.includes('ui')) return Sparkles;
  if (f.includes('data protection') || f.includes('secure')) return ShieldCheck;

  // Fallback for custom entries (e.g. Star/Gem)
  return Gem;
};

const TemplateDetailPage = () => {
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);

  const getLocalizedValue = (field, fallbackField) => {
    const lang = i18n.language || 'tr';
    if (typeof field === 'object' && field !== null) {
      return field[lang] || field['en'] || field['tr'] || '';
    }
    return template[fallbackField] || '';
  };

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const { data, error } = await supabase.from('templates').select('*').eq('id', id).eq('project_code', 'erpolart').single();
        if (error) throw error;
        setTemplate(data);
      } catch (error) {
        console.error('Error fetching template:', error);
        navigate('/templates');
      } finally {
        setLoading(false);
      }
    };
    fetchTemplate();
    window.scrollTo(0, 0);
  }, [id, navigate]);

  if (loading) return <div className="min-h-screen bg-deep-black flex items-center justify-center text-white font-black uppercase tracking-widest animate-pulse">{t('templateDetail.architecting')}</div>;
  if (!template) return <div className="min-h-screen bg-deep-black flex items-center justify-center text-white font-black uppercase tracking-widest">{t('templateDetail.structureNotFound')}</div>;

  const isSold = template.is_sold || template.status === 'sold';
  const seoDescription = getLocalizedValue(template.short_pitch, 'description');
  const seoImage = template.image_url || template.preview_image || 'https://erpolart.com/og-image.webp';
  const seoTitle = `${template.name} - Premium Template | ErpolArt`;
  const seoUrl = `https://erpolart.com/templates/${id}`;

  return (
    <div className="bg-deep-black min-h-screen pt-32 pb-44 lg:pb-24 relative w-full transition-colors duration-500 overflow-x-clip">
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <link rel="canonical" href={seoUrl} />
        <meta property="og:type" content="product" />
        <meta property="og:site_name" content="ErpolArt" />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:url" content={seoUrl} />
        <meta property="og:image" content={seoImage} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoTitle} />
        <meta name="twitter:description" content={seoDescription} />
        <meta name="twitter:image" content={seoImage} />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: template.name,
          description: seoDescription,
          image: seoImage,
          url: seoUrl,
          brand: { '@type': 'Brand', name: 'ErpolArt' },
          category: template.category,
          offers: {
            '@type': 'Offer',
            price: template.price,
            priceCurrency: 'USD',
            availability: template.status === 'available'
              ? 'https://schema.org/InStock'
              : 'https://schema.org/SoldOut',
            seller: { '@type': 'Organization', name: 'ErpolArt' },
          },
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: 'https://erpolart.com/' },
            { '@type': 'ListItem', position: 2, name: 'Şablonlar', item: 'https://erpolart.com/templates' },
            { '@type': 'ListItem', position: 3, name: template.name, item: seoUrl },
          ],
        })}</script>
      </Helmet>
      {/* SaaS-Style Background System */}
      <div className="absolute inset-0 bg-[linear-gradient(var(--grid-color)_1px,transparent_1px),linear-gradient(90deg,var(--grid-color)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none opacity-50" />

      {/* Strategic Mesh Glow System - Full Page Distribution */}
      <div className="absolute top-[-5%] right-[-10%] w-[70vw] h-[70vw] bg-green-500/12 rounded-full blur-[180px] pointer-events-none animate-pulse" />
      <div className="absolute top-[15%] left-[-15%] w-[60vw] h-[60vw] bg-indigo/15 rounded-full blur-[220px] pointer-events-none" />
      <div className="absolute top-[45%] right-[-20%] w-[65vw] h-[65vw] bg-red-500/10 rounded-full blur-[200px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-[-15%] w-[55vw] h-[55vw] bg-cyan/12 rounded-full blur-[180px] pointer-events-none" />

      {/* Massive Background Text */}
      <div className="absolute top-20 right-[-10%] text-[25vw] font-black text-white/[0.02] uppercase tracking-tighter whitespace-nowrap pointer-events-none select-none z-0">
        {template.name}
      </div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10">

        {/* Navigation */}
        <ScrollReveal>
          <div className="mb-12">
            <Link to="/templates" className="inline-flex items-center gap-4 text-[9px] font-black uppercase tracking-[0.4em] text-muted-text hover:text-white transition-all group">
              <div className="w-10 h-10 rounded-full border border-border-adaptive flex items-center justify-center group-hover:border-indigo/50 group-hover:bg-indigo/10 transition-all">
                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              </div>
              <span>{t('templateDetail.backToCatalog')}</span>
            </Link>
          </div>
        </ScrollReveal>

        <div className="flex flex-col lg:flex-row gap-[68px] items-start justify-start relative">

          {/* Left Section: Visuals & Narrative */}
          <div className="w-full lg:w-[60%] space-y-10">

            <ScrollReveal>
              <div className="flex flex-wrap gap-3 mb-6">
                {template.tier === 1 && (
                  <div className="bg-indigo/10 text-indigo px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2 border border-indigo/20">
                    <ShieldCheck size={12} /> {t('templatesPage.tiers.pro')}
                  </div>
                )}
                {template.tier === 2 && (
                  <div className="bg-violet/10 text-violet px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2 border border-violet/20">
                    <Zap size={12} /> {t('templatesPage.tiers.premium')}
                  </div>
                )}
                {template.tier === 3 && (
                  <div className="bg-indigo text-pure-white text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] px-4 py-1.5 rounded-full shadow-lg shadow-indigo/20 ring-4 ring-indigo/10 border border-white/10">
                    {template.category}
                  </div>
                )}
              </div>
              <h1 className="text-5xl md:text-[88px] font-display font-black text-white leading-[0.9] tracking-tighter italic mb-8 break-words focus:outline-none select-none drop-shadow-[0_2px_16px_rgba(0,0,0,0.2)] transition-colors duration-300">
                {template.name}
              </h1>
              <p className="text-[16px] text-white/80 font-medium leading-relaxed max-w-2xl mb-10 drop-shadow-[0_1px_8px_rgba(0,0,0,0.1)] transition-colors duration-300">
                {getLocalizedValue(template.short_pitch, 'description')}
              </p>
            </ScrollReveal>

            {/* Template Preview Preview Component */}
            <div className="relative group/browser">
              <ScrollReveal>
                <div className="relative">
                  <div className="rounded-[2.5rem] overflow-hidden border border-border-adaptive bg-surface shadow-[0_50px_100px_-20px_rgba(0,0,0,0.6)] relative">
                    {/* Browser Header */}
                    <div className="h-11 bg-white/[0.03] border-b border-border-adaptive flex items-center px-6 gap-2">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-400/20 border border-red-400/30" />
                        <div className="w-3 h-3 rounded-full bg-yellow-400/20 border border-yellow-400/30" />
                        <div className="w-3 h-3 rounded-full bg-green-400/20 border border-green-400/30" />
                      </div>
                      <div className="mx-auto bg-white/[0.05] px-5 py-1 rounded-full text-[9px] font-black text-white/40 tracking-[0.1em] text-center uppercase">
                        {template.name?.toLowerCase().replace(/\s+/g, '')}.erpolart.studio
                      </div>
                    </div>

                    {/* Image Container */}
                    <div className="relative aspect-square md:aspect-[1.3/1] lg:aspect-[1/1.2] xl:aspect-[1.3/1] overflow-hidden flex items-center justify-center">
                      <img
                        src={template.image_url || template.preview_image}
                        alt={template.name}
                        loading="lazy"
                        className="w-full h-full object-cover object-top transform transition-transform duration-[4s] ease-out group-hover/browser:scale-[1.03] relative z-10"
                      />
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* TECH STACK BADGES - HIGH-PRECISION GLASS SLABS */}
            <div className="relative z-30 pt-8 pb-4">
              <div className="flex flex-wrap gap-4 justify-center">
                {(template.tech_stack || []).map((tech, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                    className="group/tech relative flex items-center gap-4 px-6 py-4 bg-white/[0.02] hover:bg-white border border-white/10 hover:border-white rounded-2xl transition-all cursor-default duration-500 active:scale-95 shadow-3xl hover:shadow-[0_20px_60px_-10px_rgba(255,255,255,0.2)] overflow-hidden"
                  >
                    {/* Internal light sweep */}
                    <div className="absolute inset-0 -translate-x-full group-hover/tech:translate-x-full bg-gradient-to-r from-transparent via-black/10 to-transparent transition-transform duration-1000 ease-in-out" />

                    {/* Icon Container with grayscale toggle */}
                    <div className="filter grayscale group-hover/tech:grayscale-0 transition-all duration-700 scale-125 relative z-10">
                      <TechIcon name={tech} />
                    </div>

                    {/* Text Typography */}
                    <span className="text-[10px] font-black text-gray-500 group-hover/tech:text-black uppercase tracking-[0.25em] transition-colors leading-none relative z-10 font-sans">
                      {tech}
                    </span>

                    {/* Subtle bottom edge glow on hover */}
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-indigo opacity-0 group-hover/tech:opacity-50 transition-opacity" />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Strategic Overview */}
            {getLocalizedValue(template.core_breakdown, 'long_description')?.trim() && (
              <div className="pt-6 pb-12 relative z-10">
                <ScrollReveal>
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-3 px-4 py-1.5 bg-cyan/10 border border-cyan/20 rounded-full w-fit">
                      <Target size={12} className="text-cyan animate-pulse" />
                      <span className="text-[9px] font-black text-cyan uppercase tracking-[0.3em]">{t('templateDetail.architecture')}</span>
                    </div>
                    <h3 className="text-3xl font-display font-black text-white italic tracking-tighter leading-none">
                      {t('templateDetail.archOverview')}
                    </h3>
                  </div>
                  <div className="max-w-3xl">
                    <p className="text-gray-300 text-lg leading-[1.8] font-medium">
                      {getLocalizedValue(template.core_breakdown, 'long_description')}
                    </p>
                  </div>
                </ScrollReveal>
              </div>
            )}

            {/* Integrated Capabilities (Simplified Brand Solutions) */}
            <ScrollReveal delay={0.1}>
              <div className="relative z-10 pt-20 pb-12">
                <div className="flex flex-col gap-10">
                  {/* High-Fidelity Header - Mirrored from Strategic Overview */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 px-4 py-1.5 bg-cyan/10 border border-cyan/20 rounded-full w-fit">
                      <Target size={12} className="text-cyan animate-pulse" />
                      <span className="text-[9px] font-black text-cyan uppercase tracking-[0.3em]">{t('saasPage.features.badge')}</span>
                    </div>
                    <h3 className="text-3xl font-display font-black text-white italic tracking-tighter leading-none">
                      {t('templateDetail.integratedCaps')}
                    </h3>
                  </div>

                  {/* Semantic Badge Grid */}
                  <div className="flex flex-wrap gap-3">
                    {(() => {
                      const lang = i18n.language || 'tr';
                      const enFeatures = template.features || [];
                      const displayFeatures = lang === 'tr'
                        ? (template.features_tr || enFeatures)
                        : lang === 'de'
                        ? (template.features_de || enFeatures)
                        : enFeatures;
                      return displayFeatures.map((feature, i) => {
                        const Icon = getFeatureIcon(enFeatures[i] || feature);
                        return (
                          <motion.div
                            key={i}
                            whileHover={{ y: -3, scale: 1.02 }}
                            className="flex items-center gap-3 px-5 py-3.5 bg-white/[0.02] hover:bg-white border border-white/10 hover:border-white rounded-xl transition-all duration-300 group/item cursor-default"
                          >
                            <div className="filter grayscale group-hover/item:grayscale-0 transition-all duration-500">
                              <Icon size={16} className="text-cyan" />
                            </div>
                            <span className="text-[10px] font-black text-gray-500 group-hover/item:text-black uppercase tracking-[0.2em] transition-colors leading-none relative z-10">
                              {t(`templateDetail.features.${feature}`, feature)}
                            </span>
                          </motion.div>
                        );
                      });
                    })()}
                  </div>
                </div>
              </div>
            </ScrollReveal>

          </div>

          {/* Right Section: Sticky Sidebar Controls */}
          <aside className="w-full lg:w-[40%] lg:sticky lg:top-24 self-start h-fit space-y-8">

            {/* Acquisition Section */}
            <ScrollReveal delay={0.2} className="hidden lg:block">
              <div className="p-8 md:p-10 rounded-[2.5rem] bg-surface border border-border-adaptive shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                <div className="flex items-center justify-between gap-6 mb-8 relative z-10">
                  <div className="space-y-0.5">
                    <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-text">{t('templateDetail.acquisitionValue')}</div>
                    <div className="text-3xl md:text-4xl font-display font-black text-white tabular-nums tracking-tighter leading-none italic">
                      {template.price}$
                    </div>
                  </div>

                  {template.demo_url && (
                    <motion.a
                      href={template.demo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      animate={{
                        boxShadow: ["0 10px 20px rgba(0,230,210,0.15)", "0 15px 40px rgba(0,230,210,0.4)", "0 10px 20px rgba(0,230,210,0.15)"],
                        borderColor: ["rgba(0,230,210,0.1)", "rgba(0,230,210,0.4)", "rgba(0,230,210,0.1)"]
                      }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                      className="px-6 py-4 rounded-2xl bg-cyan/5 border border-cyan/30 text-white font-bold uppercase tracking-[0.15em] text-[10px] md:text-[11px] transition-all hover:bg-cyan/15 hover:border-cyan/60 flex items-center justify-center gap-3 relative group/demo active:scale-95 shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/25"
                    >
                      <span className="w-2 h-2 rounded-full bg-cyan shadow-[0_0_12px_rgba(0,230,210,0.8)] animate-pulse shrink-0" />
                      <span className="relative z-10">{t('templateDetail.liveDemo')}</span>
                      <ExternalLink size={15} className="text-cyan group-hover/demo:scale-110 transition-transform relative z-10" />
                    </motion.a>
                  )}
                </div>

                {isSold ? (
                  <div className="w-full px-8 py-3.5 md:py-4 rounded-2xl bg-white/[0.03] border border-white/8 text-gray-600 font-bold uppercase tracking-[0.3em] text-[13px] md:text-[14px] flex items-center justify-center gap-3 relative z-10 cursor-not-allowed">
                    <ShieldCheck size={18} className="text-red-500/60" />
                    <span>{t('status.acquired')}</span>
                  </div>
                ) : (
                  <button
                    onClick={() => navigate(`/checkout/${id}`)}
                    className="w-full px-8 py-3.5 md:py-4 rounded-2xl bg-indigo text-pure-white font-bold uppercase tracking-[0.3em] text-[13px] md:text-[14px] transition-all hover:brightness-110 hover:shadow-[0_20px_40px_-10px_rgba(92,115,255,0.4)] flex items-center justify-center gap-3 active:scale-[0.98] shadow-[0_15px_30px_-5px_rgba(92,115,255,0.25)] relative z-10"
                  >
                    <span>{t('latest.buyNow')}</span>
                    <ArrowUpRight size={18} className="text-pure-white" />
                  </button>
                )}
              </div>
            </ScrollReveal>

            {/* Metrics Grid */}
            <ScrollReveal direction="up" delay={0.3}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {[
                  { icon: Target, label: t('templateDetail.seoStrategy'), val: t('templateDetail.gradeAOptimized'), color: 'text-indigo', bg: 'bg-indigo/10' },
                  { icon: Smartphone, label: t('templateDetail.responsive'), val: t('templateDetail.mobileFirst'), color: 'text-violet', bg: 'bg-violet/10' },
                  { icon: Layers, label: t('templateDetail.architecture'), val: t('templateDetail.componentBase'), color: 'text-indigo', bg: 'bg-indigo/10' },
                  { icon: Clock, label: t('templateDetail.fastDelivery'), val: t('templateDetail.readyIn24H'), color: 'text-cyan', bg: 'bg-cyan/10' }
                ].map((stat, i) => (
                  <div key={i} className="p-8 bg-surface border border-border-adaptive rounded-[2rem] hover:border-indigo/30 shadow-2xl transition-all group overflow-hidden relative">
                    <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-5 transition-transform group-hover:scale-110 duration-500`}>
                      <stat.icon size={24} />
                    </div>
                    <div className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1 relative z-10">{stat.label}</div>
                    <div className="text-sm font-black text-white relative z-10">{stat.val}</div>
                    <div className="absolute -bottom-4 -right-4 opacity-[0.03] rotate-12 group-hover:rotate-0 transition-transform duration-700">
                      <stat.icon size={80} />
                    </div>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </aside>
        </div>
      </div>

      {/* Mobile Sticky Bar */}
      <motion.div
        initial={{ y: 120, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8, ease: "backOut" }}
        className="lg:hidden fixed bottom-6 left-5 right-5 z-[100] p-5 bg-surface/75 backdrop-blur-3xl border border-white/10 rounded-2xl shadow-2xl ring-1 ring-white/5"
      >
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 pl-2">
            <span className="text-[7px] font-black uppercase tracking-[0.2em] text-gray-500 block mb-0.5">{t('templateDetail.acquisitionValue')}</span>
            <div className="text-xl font-display font-black text-white leading-none italic">{template.price}$</div>
          </div>

          <div className="mx-0.5" />

          <div className="flex items-center gap-2 flex-1">
            {template.demo_url && (
              <motion.a
                whileTap={{ scale: 0.95 }}
                href={template.demo_url}
                target="_blank"
                rel="noopener noreferrer"
                animate={{
                  boxShadow: ["0 0 10px rgba(0,230,210,0.2)", "0 0 25px rgba(0,230,210,0.5)", "0 0 10px rgba(0,230,210,0.2)"],
                  borderColor: ["rgba(0,230,210,0.2)", "rgba(0,230,210,0.5)", "rgba(0,230,210,0.2)"]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-4 rounded-xl bg-cyan/10 border border-cyan/30 text-cyan text-[10px] font-black uppercase tracking-wider relative overflow-hidden"
              >
                <motion.div
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan/20 to-transparent skew-x-[-20deg] pointer-events-none"
                />
                <span className="relative z-10 whitespace-nowrap">{t('templateDetail.liveDemo')}</span>
                <ExternalLink size={13} className="shrink-0 relative z-10" />
              </motion.a>
            )}

                {isSold ? (
                  <div className="flex-1 px-3 py-3 rounded-xl bg-white/[0.03] border border-white/8 text-gray-600 font-black uppercase tracking-wider text-[10px] flex items-center justify-center gap-1.5 cursor-not-allowed">
                    <ShieldCheck size={12} className="text-red-500/60 shrink-0" />
                    <span className="whitespace-nowrap">{t('status.acquired')}</span>
                  </div>
                ) : (
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate(`/checkout/${id}`)}
                    className="flex-1 px-3 py-3 rounded-xl bg-indigo text-[#FFFFFF] font-black uppercase tracking-wider text-[10px] shadow-[0_10px_20px_-5px_rgba(92,115,255,0.4)] flex items-center justify-center gap-1.5"
                  >
                    <span className="whitespace-nowrap">{t('latest.buyNow')}</span>
                    <ArrowUpRight size={13} className="shrink-0" />
                  </motion.button>
                )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TemplateDetailPage;
