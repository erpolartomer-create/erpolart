import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  ArrowUpRight, Zap, Target, ShieldCheck, Cpu, ExternalLink, Info, Layers,
  Sparkles, Bot, Crown, Star, Layout, Gavel, Car, Utensils, Briefcase, User, Activity, ShoppingBag,
  Filter, X, ChevronDown, Clock, DollarSign, Database, Home
} from 'lucide-react';
import ScrollReveal from '../ScrollReveal';
import TemplateDetailsModal from './TemplateDetailsModal';
import { supabase } from '../../lib/supabase';
import { TemplateGridSkeleton } from '../Skeleton';

import TemplateCard from './TemplateCard';

const categories = [
  { id: 'All', key: 'all', icon: Layout },
  { id: 'Beauty Salon', key: 'beauty', icon: Sparkles },
  { id: 'Health & Fitness', key: 'fitness', icon: Activity },
  { id: 'Corporate', key: 'corporate', icon: Briefcase },
  { id: 'Law Firm', key: 'law', icon: ShieldCheck },
  { id: 'Rent-a-Car', key: 'rent', icon: Car },
  { id: 'Restaurant', key: 'restaurant', icon: Utensils },
  { id: 'Portfolio', key: 'portfolio', icon: User },
  { id: 'E-commerce', key: 'ecommerce', icon: ShoppingBag },
  { id: 'Real Estate', key: 'realestate', icon: Home }
];

const TemplateGrid = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const { data } = await supabase.from('templates').select('*').eq('project_code', 'erpolart');
        
        // Map database columns to frontend expected fields to avoid touching UI
        const mappedData = (data || []).map(t => ({
          ...t,
          preview_image: t.image_url || t.preview_image,
          short_pitch: t.description || t.short_pitch
        }));
        
        setTemplates(mappedData);
      } catch (error) {
        console.error('Error fetching templates:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTemplates();
  }, []);

  const filteredTemplates = templates.filter(template => {
    if (activeCategory === 'All') return true;
    return template.category === activeCategory;
  });

  const handleOpenDetails = (template) => {
    navigate(`/templates/${template.id}`);
  };

  const getTierConfigInternal = (priceString) => {
    if (priceString === null || priceString === undefined) return { id: 'pro', name: 'PRO', accent: 'indigo', cardClass: '', tierBadgeClass: '', btnClass: '' };
    const price = parseInt(priceString.toString().replace('$', '')) || 0;

    if (price >= 900) return {
      id: 'platinum',
      name: t('templatesPage.tiers.platinum'),
      accent: 'white',
      cardClass: 'bg-surface border-white/30 hover:border-white/80 hover:shadow-[0_0_50px_-12px_rgba(255,255,255,0.2)] transition-all duration-1000 group/platinum',
      tierBadgeClass: 'bg-gradient-to-r from-slate-300 via-pure-white to-slate-400 text-slate-950 border-white/50 shadow-[0_0_20px_rgba(255,255,255,0.4)]',
      btnClass: 'bg-gradient-to-r from-slate-800 via-slate-600 to-slate-900 text-slate-50 hover:brightness-125 hover:shadow-white/20',
      shimmerColor: 'rgba(255, 255, 255, 0.5)',
      halo: true
    };

    if (price >= 800) return {
      id: 'premium',
      name: t('templatesPage.tiers.premium'),
      accent: 'amber-500',
      cardClass: 'bg-surface border-amber-500/30 hover:border-amber-500 hover:shadow-[0_0_50px_-12px_rgba(245,158,11,0.3)] transition-all duration-700 group/premium',
      tierBadgeClass: 'bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 text-slate-950 border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.5)]',
      btnClass: 'bg-gradient-to-r from-amber-300 via-amber-500 to-amber-600 text-slate-950 hover:brightness-110 hover:shadow-amber-500/20',
      shimmerColor: 'rgba(245, 158, 11, 0.4)',
      pulse: true
    };

    return {
      id: 'pro',
      name: t('templatesPage.tiers.pro'),
      accent: 'indigo',
      cardClass: 'bg-surface border-indigo/20 hover:border-indigo hover:shadow-2xl hover:shadow-indigo/20 transition-all duration-700',
      tierBadgeClass: 'bg-indigo text-pure-white border-indigo/20',
      btnClass: 'bg-gradient-to-r from-indigo-600 to-indigo-800 text-slate-50 shadow-lg shadow-indigo/20 hover:brightness-110',
      shimmerColor: 'rgba(59, 88, 255, 0.2)'
    };
  };

  return (
    <section className="py-24 relative overflow-visible transition-colors duration-500">

      {/* Background Decor & Scanning Lines */}
      <div className="absolute -top-24 right-0 w-[60vw] h-[60vw] bg-indigo/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          animate={{ y: ['-100%', '200%'] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo/10 to-transparent opacity-30"
        />
        <motion.div
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 left-0 h-full w-[1px] bg-gradient-to-b from-transparent via-cyan/5 to-transparent opacity-30"
        />
      </div>

      <ScrollReveal>
        <div className="relative mb-20 md:mb-28 px-4">
          {/* Desktop Filter Layout (Original Grid/Row) */}
          <div className="hidden lg:flex flex-wrap items-center justify-center gap-4">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-500 border relative overflow-hidden flex items-center gap-3 group/btn ${activeCategory === cat.id
                    ? 'bg-white text-deep-black border-white shadow-[0_20px_40px_-10px_rgba(255,255,255,0.2)]'
                    : 'bg-surface/50 border-white/5 text-gray-400 hover:text-white hover:border-white/20'
                  }`}
              >
                <cat.icon size={16} className={`${activeCategory === cat.id ? 'text-indigo' : 'text-gray-500 group-hover/btn:text-white'} transition-colors duration-500`} />
                <span className="relative z-10">{t(`templatesPage.categories.${cat.key}`)}</span>
              </button>
            ))}
          </div>

          {/* Mobile Filter UX (Clarified Selector Strategy) */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="w-full p-4 pl-6 rounded-2xl bg-surface border border-white/10 flex items-center justify-between shadow-2xl relative group active:scale-[0.98] transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="flex flex-col text-left">
                  <span className="text-[9px] font-black text-indigo uppercase tracking-[0.2em] mb-0.5">{t('templatesPage.catalog')}</span>
                  <div className="flex items-center gap-2">
                    <Filter size={12} className="text-gray-500" />
                    <span className="text-xs font-bold text-gray-400">{t('templatesPage.filterTitle') || 'Kategori Seç'}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white/5 px-4 py-2.5 rounded-xl border border-white/5 group-hover:border-white/10 transition-colors">
                <div className="text-right">
                  <div className="text-[11px] font-display font-black text-white italic tracking-tight">
                    {t(`templatesPage.categories.${categories.find(c => c.id === activeCategory)?.key || 'all'}`)}
                  </div>
                </div>
                <ChevronDown size={16} className={`text-indigo transition-transform duration-500 ${isFilterOpen ? 'rotate-180' : ''}`} />
              </div>
            </button>

            {/* Expanding Filter Menu */}
            <AnimatePresence>
              {isFilterOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  className="absolute top-full left-4 right-4 mt-3 z-[100]"
                >
                  <div className="p-4 rounded-[2.5rem] bg-surface/95 backdrop-blur-3xl border border-white/10 grid grid-cols-2 gap-3 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)]">
                    <div className="col-span-2 px-4 py-2 mb-1">
                      <div className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] text-center border-b border-white/5 pb-2">
                        {t('templatesPage.filterSelection') || 'SEÇİM YAPIN'}
                      </div>
                    </div>
                    {categories.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setActiveCategory(cat.id);
                          setIsFilterOpen(false);
                        }}
                        className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col items-center gap-3 text-center active:scale-95 ${activeCategory === cat.id
                            ? 'bg-indigo border-indigo text-pure-white shadow-[0_10px_20px_-5px_rgba(92,115,255,0.4)]'
                            : 'bg-white/5 border-white/5 text-gray-400'
                          }`}
                      >
                        <cat.icon size={20} className={activeCategory === cat.id ? 'text-pure-white' : 'text-gray-500'} />
                        <span className="text-[9px] font-black uppercase tracking-widest leading-none">{t(`templatesPage.categories.${cat.key}`)}</span>
                      </button>
                    ))}
                  </div>

                  {/* Backdrop for closing */}
                  <div
                    className="fixed inset-0 -z-10 bg-black/20 backdrop-blur-sm"
                    onClick={() => setIsFilterOpen(false)}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </ScrollReveal>

      {loading ? (
        <div className="px-4 mb-32">
          <TemplateGridSkeleton count={6} />
        </div>
      ) : (
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32 items-stretch px-4 relative z-10">
          <AnimatePresence mode="popLayout">
            {filteredTemplates.map((template, idx) => (
              <TemplateCard key={template.id} template={template} index={idx} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      <TemplateDetailsModal
        template={selectedTemplate}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
};

export default TemplateGrid;
