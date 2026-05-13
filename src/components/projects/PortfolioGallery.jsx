import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, Zap, Smartphone, Clock, Sparkles } from 'lucide-react';
import ScrollReveal from '../ScrollReveal';
import { projects } from '../../data/projects';

const CATEGORY_FALLBACKS = {
  Technology: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80',
  Restaurant: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80',
  'Luxury E-commerce': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80',
};

const PROJECT_META = {
  1: { perf: 99, mobile: 98, weeks: 4 },
  2: { perf: 97, mobile: 99, weeks: 2 },
  3: { perf: 98, mobile: 97, weeks: 3 },
  4: { perf: 96, mobile: 98, weeks: 3 },
  5: { perf: 99, mobile: 99, weeks: 5 },
  6: { perf: 95, mobile: 97, weeks: 2 },
  7: { perf: 98, mobile: 96, weeks: 6 },
  8: { perf: 97, mobile: 98, weeks: 5 },
  9: { perf: 99, mobile: 99, weeks: 2 },
  10: { perf: 98, mobile: 97, weeks: 6 },
  11: { perf: 99, mobile: 99, weeks: 7 },
  12: { perf: 97, mobile: 98, weeks: 4 },
  13: { perf: 96, mobile: 97, weeks: 8 },
  14: { perf: 98, mobile: 98, weeks: 4 },
  15: { perf: 97, mobile: 99, weeks: 2 },
};

const CATEGORY_COLORS = {
  Technology: 'from-cyan/20 to-indigo/20',
  'Beauty Salon': 'from-pink-500/20 to-purple-500/20',
  'Rent-a-Car': 'from-amber-500/20 to-orange-500/20',
  Restaurant: 'from-orange-500/20 to-red-500/20',
  'Law Firm': 'from-slate-400/20 to-slate-600/20',
  'Health & Fitness': 'from-green-500/20 to-emerald-500/20',
  'Real Estate': 'from-amber-600/20 to-yellow-500/20',
  'E-commerce': 'from-violet/20 to-indigo/20',
  Portfolio: 'from-cyan/20 to-teal-500/20',
  Healthcare: 'from-blue-400/20 to-cyan/20',
  'Luxury E-commerce': 'from-amber-300/20 to-yellow-600/20',
  Architecture: 'from-slate-300/20 to-slate-500/20',
  Education: 'from-indigo/20 to-violet/20',
  'Travel & Tourism': 'from-teal-400/20 to-cyan/20',
  'Spa & Wellness': 'from-green-300/20 to-teal-400/20',
};

const uniqueCategories = ['All', ...new Set(projects.map(p => p.category))];

const VISIBLE_FILTERS = ['All', 'Beauty Salon', 'Restaurant', 'E-commerce', 'Law Firm', 'Real Estate', 'Health & Fitness', 'Portfolio'];

const ProjectCard = ({ project, index }) => {
  const [imgError, setImgError] = useState(false);
  const meta = PROJECT_META[project.id] || { perf: 97, mobile: 97, weeks: 3 };
  const fallback = CATEGORY_FALLBACKS[project.category];
  const gradient = CATEGORY_COLORS[project.category] || 'from-indigo/20 to-cyan/20';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group relative rounded-[2rem] overflow-hidden bg-surface border border-white/[0.07] hover:border-white/20 transition-all duration-700 hover:shadow-[0_30px_60px_-20px_rgba(0,0,0,0.5)] flex flex-col"
    >
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={(imgError && fallback) ? fallback : project.image}
          onError={() => setImgError(true)}
          alt={project.title}
          loading="lazy"
          className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-[1.5s]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700 mix-blend-overlay`} />

        {/* Category badge */}
        <div className="absolute top-4 left-4 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-xl border border-white/10 text-white text-[9px] font-black uppercase tracking-[0.2em]">
          {project.category}
        </div>

        {project.isNew && (
          <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo/90 backdrop-blur-xl border border-indigo/40 text-white text-[9px] font-black uppercase tracking-widest">
            <Sparkles size={10} />
            NEW
          </div>
        )}

        {/* Hover CTA overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white">
            <ArrowUpRight size={22} />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-xl font-display font-black text-white italic tracking-tight mb-2 leading-tight group-hover:text-indigo transition-colors duration-500">
          {project.title}
        </h3>
        <p className="text-gray-400 text-sm leading-relaxed flex-1 mb-5">
          {project.description}
        </p>

        {/* Metrics */}
        <div className="flex items-center gap-0 border-t border-white/5 pt-4">
          <div className="flex-1 flex flex-col items-center gap-1">
            <div className="flex items-center gap-1 text-indigo">
              <Zap size={11} />
              <span className="text-[13px] font-black text-white">{meta.perf}</span>
            </div>
            <span className="text-[8px] font-black uppercase tracking-widest text-gray-600">Perf.</span>
          </div>
          <div className="w-px h-8 bg-white/5" />
          <div className="flex-1 flex flex-col items-center gap-1">
            <div className="flex items-center gap-1 text-cyan">
              <Smartphone size={11} />
              <span className="text-[13px] font-black text-white">{meta.mobile}</span>
            </div>
            <span className="text-[8px] font-black uppercase tracking-widest text-gray-600">Mobile</span>
          </div>
          <div className="w-px h-8 bg-white/5" />
          <div className="flex-1 flex flex-col items-center gap-1">
            <div className="flex items-center gap-1 text-amber-400">
              <Clock size={11} />
              <span className="text-[13px] font-black text-white">{meta.weeks}w</span>
            </div>
            <span className="text-[8px] font-black uppercase tracking-widest text-gray-600">Süre</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const PortfolioGallery = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('All');

  const filtered = projects.filter(p =>
    activeFilter === 'All' ? true : p.category === activeFilter
  );

  return (
    <section className="py-20 md:py-32 relative">

      <ScrollReveal>
        <div className="text-center mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo/10 border border-indigo/20 text-indigo text-[10px] font-black uppercase tracking-[0.3em] mb-8">
            <Sparkles size={12} />
            Çalışmalarımız
          </div>

          <h2 className="text-5xl md:text-[88px] font-display font-black text-white leading-none tracking-[-0.05em] italic mb-6">
            PORT<span className="text-indigo">FOLIO.</span>
          </h2>

          <p className="text-gray-400 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
            Her sektörden, her ölçekten. Sıfırdan yazılan kodla inşa edilen dijital deneyimler.
          </p>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 mt-10">
            {[
              { value: '15+', label: 'Tamamlanan Proje' },
              { value: '10+', label: 'Sektör' },
              { value: '100%', label: 'Özel Kod' },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className="text-2xl md:text-3xl font-display font-black text-white italic">{stat.value}</span>
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 mt-1">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* Filter tabs */}
      <ScrollReveal>
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {VISIBLE_FILTERS.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all duration-300 border ${
                activeFilter === cat
                  ? 'bg-white text-deep-black border-white shadow-[0_10px_30px_-10px_rgba(255,255,255,0.3)]'
                  : 'bg-white/[0.03] border-white/[0.07] text-gray-500 hover:text-white hover:border-white/20'
              }`}
            >
              {cat === 'All' ? 'Tümü' : cat}
            </button>
          ))}
        </div>
      </ScrollReveal>

      {/* Grid */}
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filtered.map((project, idx) => (
            <ProjectCard key={project.id} project={project} index={idx} />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* CTA */}
      <ScrollReveal>
        <div className="text-center mt-16">
          <p className="text-gray-500 text-sm mb-6 font-medium">
            Hazır şablonlardan başlamak mı istiyorsunuz?
          </p>
          <button
            onClick={() => navigate('/templates')}
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-surface border border-white/10 text-white text-[11px] font-black uppercase tracking-[0.2em] hover:border-indigo/50 hover:bg-indigo/5 transition-all duration-500"
          >
            Şablonları İncele
            <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </ScrollReveal>
    </section>
  );
};

export default PortfolioGallery;
