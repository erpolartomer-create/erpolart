import { useState, useEffect } from 'react';
import { Bot, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ScrollReveal from '../ScrollReveal';
import { supabase } from '../../lib/supabase';
import useUIStore from '../../store/uiStore';
import TemplateCard from '../templates/TemplateCard';


const LatestReleases = () => {
  const { t } = useTranslation();
  const theme = useUIStore((state) => state.theme);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const { data } = await supabase.from('templates').select('*').eq('project_code', 'erpolart');
        const sorted = (data || [])
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 3);
        setTemplates(sorted);
      } catch (error) {
        console.error('Error fetching latest templates:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTemplates();
  }, []);

  if (loading || templates.length === 0) return null;

  return (
    <section className="pt-32 pb-20 bg-transparent relative overflow-x-clip transition-colors duration-500">

      <div className="absolute inset-0 bg-[linear-gradient(var(--grid-color)_1px,transparent_1px),linear-gradient(90deg,var(--grid-color)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="absolute top-0 left-[-10%] w-[80vw] h-[80vw] bg-violet/10 rounded-full blur-[180px] -translate-y-1/2 pointer-events-none opacity-50" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-indigo/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-[-10%] w-[70vw] h-[70vw] bg-cyan/5 rounded-full blur-[180px] translate-y-1/4 pointer-events-none opacity-50" />

      <div className="container mx-auto px-4 md:px-12 relative z-10">
        <ScrollReveal>
          <div className="text-center max-w-5xl mx-auto mb-20 relative">
            <div className="hidden xl:block">
              <motion.div
                animate={{ y: [0, -15, 0], rotate: [0, 8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-12 -left-20 w-12 h-12 rounded-xl bg-surface border border-white/5 flex items-center justify-center text-violet shadow-xl backdrop-blur-sm"
              >
                <Bot size={20} />
              </motion.div>
              <motion.div
                animate={{ y: [0, 15, 0], rotate: [0, -8, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute top-10 -right-24 w-14 h-14 rounded-2xl bg-surface border border-white/5 flex items-center justify-center text-cyan shadow-xl backdrop-blur-sm"
              >
                <Sparkles size={24} />
              </motion.div>
            </div>

            <h2 className="text-4xl md:text-[72px] font-display font-black mb-5 italic tracking-tighter leading-[0.9] transition-colors duration-500 text-center">
              <span className={`px-4 inline-block ${theme === 'dark' ? 'text-transparent bg-clip-text bg-gradient-to-r from-slate-200 via-white to-slate-400' : 'text-black'}`}>
                {t('latest.titlePart1')} <br />
                {t('latest.titlePart2')}
              </span>
            </h2>
            <div className={`w-20 h-1 bg-gradient-to-r from-indigo via-violet to-cyan mx-auto mb-5 rounded-full`} />
            <p className="text-muted-text text-sm md:text-base font-medium leading-relaxed opacity-80 max-w-2xl mx-auto">
              {t('latest.subtitle')}
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {templates.map((template, idx) => (
            <ScrollReveal key={template.id} direction="up" delay={idx * 0.1}>
              <TemplateCard template={template} index={idx} />
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal>
          <div className="mt-32 flex flex-col items-center gap-6">
            <Link
              to="/templates"
              className="group relative px-12 py-6 rounded-[2rem] bg-indigo text-pure-white font-black uppercase tracking-[0.3em] text-[11px] overflow-hidden hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-indigo/20"
            >
              <span className="relative z-10">{t('latest.viewAll')}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="absolute inset-0 bg-indigo group-hover:opacity-0 transition-opacity duration-500" />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default LatestReleases;
