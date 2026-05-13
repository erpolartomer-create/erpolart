import { Bot, BarChart3, Workflow, Plug, ShieldCheck, Server } from 'lucide-react';
import { motion } from 'framer-motion';
import ScrollReveal from '../ScrollReveal';
import { useTranslation } from 'react-i18next';

const chartBars = [4, 7, 5, 9, 6, 8, 10, 7, 9, 11, 8, 10];

const SaaSFeatures = () => {
  const { t } = useTranslation();

  return (
    <section id="saas-features" className="pt-12 pb-24 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-500/5 rounded-full blur-[200px] pointer-events-none" />

      <ScrollReveal>
        <div className="text-center mb-12 md:mb-20">
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-2xl bg-amber-500/8 border border-amber-500/20 text-amber-500 text-[10px] font-black uppercase tracking-[0.3em] mb-10">
            {t('saasPage.features.badge')}
          </div>
          <h2 className="text-4xl md:text-[72px] font-display font-black text-white leading-[0.9] italic tracking-tighter mb-6 px-4">
            {t('saasPage.features.title')}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-500 to-amber-600 pr-3">
              {t('saasPage.features.titleAccent')}
            </span>
          </h2>
          <p className="text-gray-400 text-sm md:text-base font-medium leading-relaxed max-w-2xl mx-auto px-4">
            {t('saasPage.features.subtitle')}
          </p>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-6 gap-5">

        {/* ── Card 1: Chatbot ── wide (4/6) — amber */}
        <ScrollReveal className="md:col-span-4">
          <motion.div
            whileHover={{ y: -4, transition: { duration: 0.3 } }}
            className="group relative p-8 md:p-10 rounded-[2rem] bg-surface/30 border border-amber-500/20 hover:border-amber-500/40 transition-all duration-500 overflow-hidden h-full flex flex-col md:flex-row gap-8"
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-[2rem]"
              style={{ background: 'radial-gradient(ellipse at 30% 50%, rgba(245,158,11,0.07), transparent 60%)' }} />

            <div className="flex-1 relative z-10 flex flex-col justify-center">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 mb-7 group-hover:scale-110 transition-transform duration-300 shrink-0">
                <Bot size={22} strokeWidth={1.8} />
              </div>
              <h3 className="text-xl md:text-2xl font-black text-white mb-3 tracking-tight leading-snug">
                {t('saasPage.features.chatbot.title')}
              </h3>
              <div className="h-[1.5px] w-8 bg-amber-500/50 mb-4 group-hover:w-14 transition-all duration-500 rounded-full" />
              <p className="text-gray-500 text-sm leading-relaxed font-medium group-hover:text-gray-400 transition-colors duration-300">
                {t('saasPage.features.chatbot.desc')}
              </p>
            </div>

            {/* Chat bubble decoration */}
            <div className="hidden xl:flex flex-col justify-center gap-3 w-52 shrink-0 relative z-10 py-2">
              <div className="bg-white/5 border border-white/8 rounded-2xl rounded-tl-sm px-4 py-3 self-start">
                <div className="flex gap-1.5 items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-pulse" />
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-pulse [animation-delay:150ms]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-pulse [animation-delay:300ms]" />
                </div>
              </div>
              <div className="bg-amber-500/10 border border-amber-500/25 rounded-2xl rounded-tr-sm px-4 py-3 self-end max-w-[180px]">
                <div className="h-1.5 w-24 bg-amber-500/40 rounded-full mb-2" />
                <div className="h-1.5 w-16 bg-amber-500/25 rounded-full" />
              </div>
              <div className="bg-white/5 border border-white/8 rounded-2xl rounded-tl-sm px-4 py-3 self-start max-w-[180px]">
                <div className="h-1.5 w-20 bg-white/20 rounded-full mb-2" />
                <div className="h-1.5 w-28 bg-white/10 rounded-full" />
              </div>
              <div className="bg-amber-500/10 border border-amber-500/25 rounded-2xl rounded-tr-sm px-4 py-3 self-end">
                <div className="h-1.5 w-14 bg-amber-500/40 rounded-full" />
              </div>
            </div>
          </motion.div>
        </ScrollReveal>

        {/* ── Card 2: Dashboard ── narrow (2/6) — silver */}
        <ScrollReveal className="md:col-span-2">
          <motion.div
            whileHover={{ y: -4, transition: { duration: 0.3 } }}
            className="group relative p-8 rounded-[2rem] bg-surface/30 border border-slate-500/15 hover:border-slate-400/30 transition-all duration-500 overflow-hidden h-full flex flex-col"
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-[2rem]"
              style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(148,163,184,0.06), transparent 60%)' }} />

            <div className="w-12 h-12 rounded-2xl bg-slate-500/10 border border-slate-500/25 flex items-center justify-center text-slate-400 mb-7 group-hover:scale-110 transition-transform duration-300 relative z-10 shrink-0">
              <BarChart3 size={22} strokeWidth={1.8} />
            </div>
            <h3 className="text-xl font-black text-white mb-3 tracking-tight leading-snug relative z-10">
              {t('saasPage.features.dashboard.title')}
            </h3>
            <div className="h-[1.5px] w-8 bg-slate-500/40 mb-4 group-hover:w-14 transition-all duration-500 rounded-full relative z-10" />
            <p className="text-gray-500 text-sm leading-relaxed font-medium group-hover:text-gray-400 transition-colors duration-300 relative z-10 flex-1">
              {t('saasPage.features.dashboard.desc')}
            </p>

            {/* Mini bar chart */}
            <div className="mt-6 flex items-end gap-[3px] h-10 relative z-10">
              {chartBars.map((h, i) => (
                <div
                  key={i}
                  className="flex-1 bg-slate-500/20 rounded-t-sm group-hover:bg-slate-400/35 transition-colors duration-500"
                  style={{ height: `${h * 9}%`, transitionDelay: `${i * 30}ms` }}
                />
              ))}
            </div>
          </motion.div>
        </ScrollReveal>

        {/* ── Card 3: Automation ── (2/6) — silver */}
        <ScrollReveal className="md:col-span-2">
          <motion.div
            whileHover={{ y: -4, transition: { duration: 0.3 } }}
            className="group relative p-8 rounded-[2rem] bg-surface/30 border border-slate-500/15 hover:border-slate-400/30 transition-all duration-500 overflow-hidden h-full flex flex-col"
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-[2rem]"
              style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(148,163,184,0.06), transparent 60%)' }} />

            <div className="w-12 h-12 rounded-2xl bg-slate-500/10 border border-slate-500/25 flex items-center justify-center text-slate-400 mb-7 group-hover:scale-110 transition-transform duration-300 relative z-10 shrink-0">
              <Workflow size={22} strokeWidth={1.8} />
            </div>

            {/* Flow nodes decoration */}
            <div className="flex items-center gap-2 mb-6 relative z-10">
              {['bg-slate-500/30', 'bg-slate-500/18', 'bg-slate-500/10'].map((bg, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-lg ${bg} border border-slate-500/20 flex items-center justify-center`}>
                    <div className="w-2 h-2 rounded-full bg-slate-400/50" />
                  </div>
                  {i < 2 && <div className="w-4 h-px bg-slate-500/20 group-hover:bg-slate-400/40 transition-colors duration-500" />}
                </div>
              ))}
            </div>

            <h3 className="text-xl font-black text-white mb-3 tracking-tight leading-snug relative z-10">
              {t('saasPage.features.automation.title')}
            </h3>
            <div className="h-[1.5px] w-8 bg-slate-500/40 mb-4 group-hover:w-14 transition-all duration-500 rounded-full relative z-10" />
            <p className="text-gray-500 text-sm leading-relaxed font-medium group-hover:text-gray-400 transition-colors duration-300 relative z-10">
              {t('saasPage.features.automation.desc')}
            </p>
          </motion.div>
        </ScrollReveal>

        {/* ── Card 4: API ── (2/6) — silver */}
        <ScrollReveal className="md:col-span-2">
          <motion.div
            whileHover={{ y: -4, transition: { duration: 0.3 } }}
            className="group relative p-8 rounded-[2rem] bg-surface/30 border border-slate-500/15 hover:border-slate-400/30 transition-all duration-500 overflow-hidden h-full flex flex-col"
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-[2rem]"
              style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(148,163,184,0.06), transparent 60%)' }} />

            <div className="w-12 h-12 rounded-2xl bg-slate-500/10 border border-slate-500/25 flex items-center justify-center text-slate-400 mb-7 group-hover:scale-110 transition-transform duration-300 relative z-10 shrink-0">
              <Plug size={22} strokeWidth={1.8} />
            </div>

            {/* Endpoint pill decorations */}
            <div className="flex flex-wrap gap-1.5 mb-6 relative z-10">
              {['GET', 'POST', 'PUT', 'DEL'].map((m, i) => (
                <span key={i} className="px-2 py-0.5 rounded-md bg-slate-500/8 border border-slate-500/15 text-slate-500 text-[9px] font-black tracking-widest group-hover:border-slate-400/30 group-hover:text-slate-300 transition-all duration-300" style={{ transitionDelay: `${i * 50}ms` }}>
                  {m}
                </span>
              ))}
            </div>

            <h3 className="text-xl font-black text-white mb-3 tracking-tight leading-snug relative z-10">
              {t('saasPage.features.api.title')}
            </h3>
            <div className="h-[1.5px] w-8 bg-slate-500/40 mb-4 group-hover:w-14 transition-all duration-500 rounded-full relative z-10" />
            <p className="text-gray-500 text-sm leading-relaxed font-medium group-hover:text-gray-400 transition-colors duration-300 relative z-10">
              {t('saasPage.features.api.desc')}
            </p>
          </motion.div>
        </ScrollReveal>

        {/* ── Card 5: Security ── (2/6) — silver */}
        <ScrollReveal className="md:col-span-2">
          <motion.div
            whileHover={{ y: -4, transition: { duration: 0.3 } }}
            className="group relative p-8 rounded-[2rem] bg-surface/30 border border-slate-500/15 hover:border-slate-400/30 transition-all duration-500 overflow-hidden h-full flex flex-col"
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-[2rem]"
              style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(148,163,184,0.06), transparent 60%)' }} />

            <div className="w-12 h-12 rounded-2xl bg-slate-500/10 border border-slate-500/25 flex items-center justify-center text-slate-400 mb-7 group-hover:scale-110 transition-transform duration-300 relative z-10 shrink-0">
              <ShieldCheck size={22} strokeWidth={1.8} />
            </div>

            {/* Compliance badges */}
            <div className="flex gap-2 mb-6 relative z-10">
              {['GDPR', 'SOC2', 'KVKK'].map((badge, i) => (
                <span key={i} className="px-2.5 py-1 rounded-full bg-slate-500/8 border border-slate-500/15 text-slate-500 text-[9px] font-black tracking-widest group-hover:border-slate-400/30 group-hover:text-slate-300 transition-all duration-300" style={{ transitionDelay: `${i * 60}ms` }}>
                  {badge}
                </span>
              ))}
            </div>

            <h3 className="text-xl font-black text-white mb-3 tracking-tight leading-snug relative z-10">
              {t('saasPage.features.security.title')}
            </h3>
            <div className="h-[1.5px] w-8 bg-slate-500/40 mb-4 group-hover:w-14 transition-all duration-500 rounded-full relative z-10" />
            <p className="text-gray-500 text-sm leading-relaxed font-medium group-hover:text-gray-400 transition-colors duration-300 relative z-10">
              {t('saasPage.features.security.desc')}
            </p>
          </motion.div>
        </ScrollReveal>

        {/* ── Card 6: Infrastructure ── full width (6/6) — amber */}
        <ScrollReveal className="md:col-span-6">
          <motion.div
            whileHover={{ y: -4, transition: { duration: 0.3 } }}
            className="group relative p-8 md:p-10 rounded-[2rem] bg-surface/30 border border-amber-500/20 hover:border-amber-500/40 transition-all duration-500 overflow-hidden flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-12"
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-[2rem]"
              style={{ background: 'radial-gradient(ellipse at 20% 50%, rgba(245,158,11,0.07), transparent 60%)' }} />

            <div className="shrink-0 relative z-10 max-w-xs">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 mb-7 group-hover:scale-110 transition-transform duration-300">
                <Server size={22} strokeWidth={1.8} />
              </div>
              <h3 className="text-xl md:text-2xl font-black text-white mb-3 tracking-tight leading-snug">
                {t('saasPage.features.infrastructure.title')}
              </h3>
              <div className="h-[1.5px] w-8 bg-amber-500/50 mb-4 group-hover:w-14 transition-all duration-500 rounded-full" />
              <p className="text-gray-500 text-sm leading-relaxed font-medium group-hover:text-gray-400 transition-colors duration-300">
                {t('saasPage.features.infrastructure.desc')}
              </p>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-2 md:flex md:flex-wrap gap-4 relative z-10 flex-1">
              {[
                { value: 'AWS', sub: 'GCP · Azure' },
                { value: '100K+', sub: 'Eş zamanlı kullanıcı' },
                { value: '99.9%', sub: 'Uptime garantisi' },
                { value: '<50ms', sub: 'API yanıt süresi' },
              ].map((stat, i) => (
                <div key={i} className="px-6 py-5 rounded-2xl bg-amber-500/6 border border-amber-500/15 group-hover:border-amber-500/30 transition-all duration-500 min-w-[110px]" style={{ transitionDelay: `${i * 60}ms` }}>
                  <div className="text-2xl font-black text-amber-400 tracking-tight mb-1">{stat.value}</div>
                  <div className="text-[10px] text-gray-500 font-medium uppercase tracking-widest">{stat.sub}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </ScrollReveal>

      </div>
    </section>
  );
};

export default SaaSFeatures;
