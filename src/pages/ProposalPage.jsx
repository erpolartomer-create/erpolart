import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabase';
import {
  Check, ShieldCheck, Cpu, Layers, Clock, Sparkles,
  Loader2, ArrowRight, Code2, Rocket, Headphones,
  FileText, Video, RefreshCw, MessageCircle, Send, ChevronDown,
} from 'lucide-react';
import { motion } from 'framer-motion';

const INCLUDED_ICONS = [Code2, Rocket, FileText, RefreshCw, Headphones, Video];

const ProposalPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [proposal, setProposal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [revisionOpen, setRevisionOpen] = useState(false);
  const [revisionText, setRevisionText] = useState('');
  const [revisionSent, setRevisionSent] = useState(false);
  const [revisionLoading, setRevisionLoading] = useState(false);

  useEffect(() => {
    const fetchProposal = async () => {
      try {
        const { data, error } = await supabase
          .from('proposals')
          .select('*')
          .eq('id', id)
          .single();
        if (error) throw error;
        if (data.features) {
          data.parsedFeatures = typeof data.features === 'string'
            ? JSON.parse(data.features)
            : data.features;
        }
        setProposal(data);
      } catch (err) {
        setError(t('proposalPage.notFound'));
      } finally {
        setLoading(false);
      }
    };
    fetchProposal();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0c10] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="text-indigo animate-spin" size={40} />
          <span className="text-[10px] font-black text-indigo uppercase tracking-[0.4em]">
            {t('proposalPage.loading')}
          </span>
        </div>
      </div>
    );
  }

  if (error || !proposal) {
    return (
      <div className="min-h-screen bg-[#0b0c10] flex items-center justify-center p-6 text-center">
        <div className="max-w-md">
          <ShieldCheck size={48} className="text-red-500 mx-auto mb-6 opacity-20" />
          <h1 className="text-2xl font-black text-white uppercase tracking-tighter mb-4 italic">PROTOCOL_ERROR</h1>
          <p className="text-gray-500 text-sm mb-8">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="px-8 py-3 rounded-full bg-white/5 border border-white/10 text-[10px] font-black text-white uppercase tracking-widest hover:bg-white/10 transition-all"
          >
            {t('proposalPage.returnHome')}
          </button>
        </div>
      </div>
    );
  }

  const { tech = [], modules = [], tier, revision_limit = 5 } = proposal.parsedFeatures || {};

  const handleRevisionSubmit = async () => {
    if (!revisionText.trim()) return;
    setRevisionLoading(true);
    try {
      const { error } = await supabase.from('leads').insert([{
        name: proposal.lead_name,
        email: proposal.lead_email,
        service_type: 'revision_request',
        message: `[Teklif: ${proposal.project_name} | ID: ${id}]\n\n${revisionText}`,
        project_code: 'erpolart',
      }]);
      if (error) throw error;
      setRevisionSent(true);
      setRevisionText('');
    } catch {
      /* silent — toast not available here */
    } finally {
      setRevisionLoading(false);
    }
  };
  const isAutomation = proposal.project_name?.toLowerCase().includes('automation');
  const isPlatinum = tier === 'Platinum';

  // Color tokens
  const accentText   = isAutomation ? 'text-emerald-400'    : 'text-amber-400';
  const accentBg     = isAutomation ? 'bg-emerald-400/10'   : 'bg-amber-400/10';
  const accentBorder = isAutomation ? 'border-emerald-400/30' : 'border-amber-400/30';
  const accentGlow   = isAutomation ? 'bg-emerald-500/10'   : 'bg-amber-500/10';
  const accentGrad   = isAutomation
    ? 'from-emerald-400 via-emerald-500 to-teal-500'
    : 'from-amber-400 via-amber-500 to-amber-600';
  const accentShadow = isAutomation
    ? 'shadow-emerald-500/25 hover:shadow-emerald-500/40'
    : 'shadow-amber-500/25 hover:shadow-amber-500/40';

  const includedItems = t('proposalPage.includedItems', { returnObjects: true });
  const steps         = t('proposalPage.steps',         { returnObjects: true });

  return (
    <div className="min-h-screen bg-[#0b0c10] text-white pb-24 selection:bg-indigo selection:text-white">

      {/* Ambient glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className={`absolute top-[-15%] right-[-10%] w-[55%] h-[55%] ${accentGlow} blur-[140px] rounded-full`} />
        <div className="absolute bottom-[-10%] left-[-10%] w-[45%] h-[45%] bg-indigo/8 blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.025] mix-blend-overlay" />
      </div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10 max-w-6xl">

        {/* ── HERO ── */}
        <div className="pt-32 lg:pt-44 pb-16 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* Left: Identity + Title */}
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>

            {/* Badges row */}
            <div className="flex flex-wrap items-center gap-3 mb-8">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${accentBg} border ${accentBorder} ${accentText} text-[9px] font-black uppercase tracking-[0.35em]`}>
                <Sparkles size={10} className="animate-pulse" />
                {t('proposalPage.badge')}
              </div>
              {isPlatinum ? (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/30 text-[9px] font-black text-violet-400 uppercase tracking-widest">
                  <Sparkles size={9} />
                  {t('proposalPage.tierPlatinum')}
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan/10 border border-cyan/30 text-[9px] font-black text-cyan uppercase tracking-widest">
                  <ShieldCheck size={9} />
                  {t('proposalPage.tierPremium')}
                </div>
              )}
            </div>

            {/* Client */}
            <div className={`text-[11px] font-black ${accentText} uppercase tracking-[0.4em] mb-5`}>
              {t('proposalPage.clientLabel')}: {proposal.lead_name}
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-[58px] font-display font-black text-white italic tracking-tighter leading-[1.0] mb-8">
              {isAutomation ? t('proposalPage.autoTitle') : t('proposalPage.saasTitle')}
              <br />
              <span className={`text-transparent bg-clip-text bg-gradient-to-r ${accentGrad} pr-2`}>
                {isAutomation ? t('proposalPage.autoTitleAccent') : t('proposalPage.saasTitleAccent')}
              </span>
            </h1>

            {/* Meta */}
            <div className="flex items-center gap-6 text-gray-500 text-xs mb-12">
              <div className="flex items-center gap-2">
                <ShieldCheck size={13} className="text-cyan" />
                <span>{t('proposalPage.verified')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={13} className="text-indigo" />
                <span>{t('proposalPage.issued')}: {new Date(proposal.created_at).toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
              </div>
            </div>

            {/* Tech Stack */}
            {tech.length > 0 && (
              <section className="mb-10">
                <div className="flex items-center gap-2 mb-4">
                  <Cpu size={15} className="text-indigo" />
                  <h2 className="text-[10px] font-black text-white uppercase tracking-[0.3em]">{t('proposalPage.techStack')}</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tech.map((t_item, i) => (
                    <span key={i} className={`px-3 py-1.5 rounded-xl ${accentBg} border ${accentBorder} text-[10px] font-bold ${accentText} uppercase tracking-wider`}>
                      {t_item}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Modules */}
            {modules.length > 0 && (
              <section className="mb-10">
                <div className="flex items-center gap-2 mb-4">
                  <Layers size={15} className="text-cyan" />
                  <h2 className="text-[10px] font-black text-white uppercase tracking-[0.3em]">{t('proposalPage.modules')}</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {modules.map((mod, i) => (
                    <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.025] border border-white/5 hover:border-white/10 transition-all group">
                      <div className={`w-5 h-5 rounded-full ${accentBg} border ${accentBorder} flex items-center justify-center shrink-0`}>
                        <Check size={10} className={accentText} />
                      </div>
                      <span className="text-[11px] font-semibold text-gray-300 uppercase tracking-wide">{mod}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Custom notes */}
            {proposal.notes && (
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <MessageCircle size={15} className="text-gray-500" />
                  <h2 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">{t('proposalPage.notes')}</h2>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed italic bg-white/[0.015] border border-white/5 rounded-2xl px-5 py-4">
                  "{proposal.notes}"
                </p>
              </section>
            )}
          </motion.div>

          {/* Right: Sticky Investment Card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:sticky lg:top-32"
          >
            <div className="relative rounded-[2.5rem] overflow-hidden">
              {/* Top shimmer */}
              <div className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent ${isAutomation ? 'via-emerald-400/40' : 'via-amber-400/40'} to-transparent`} />

              <div className="bg-white/[0.035] border border-white/8 backdrop-blur-2xl rounded-[2.5rem] p-8 lg:p-10 relative">
                {/* Glow inside card */}
                <div className={`absolute top-0 right-0 w-48 h-48 ${accentGlow} blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none`} />

                <div className="relative z-10">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-8">
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em]">
                      {t('proposalPage.investment')}
                    </span>
                    <div className={`w-2 h-2 rounded-full ${isAutomation ? 'bg-emerald-400' : 'bg-amber-400'} animate-pulse`} />
                  </div>

                  {/* Price */}
                  <div className="mb-8">
                    <div className="text-[64px] lg:text-[72px] font-display font-black text-white tracking-tighter leading-none mb-2">
                      ${proposal.amount.toLocaleString()}
                    </div>
                    <div className={`text-xs font-bold ${accentText} uppercase tracking-[0.2em]`}>
                      {t('proposalPage.fixedFee')}
                    </div>
                  </div>

                  {/* Stats row */}
                  <div className="grid grid-cols-2 gap-4 py-6 border-y border-white/6 mb-8">
                    <div className="space-y-1">
                      <div className="text-[9px] font-black text-gray-600 uppercase tracking-widest">{t('proposalPage.timelineLabel')}</div>
                      <div className="text-sm font-bold text-white">{proposal.timeline || 'N/A'}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-[9px] font-black text-gray-600 uppercase tracking-widest">{t('proposalPage.revisionsLabel')}</div>
                      <div className={`text-sm font-bold ${accentText} flex items-center gap-1.5`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${isAutomation ? 'bg-emerald-400' : 'bg-amber-400'} animate-pulse`} />
                        {revision_limit}×
                      </div>
                    </div>
                  </div>

                  {/* Mini checklist */}
                  <ul className="space-y-2.5 mb-8">
                    {Array.isArray(includedItems) && includedItems.slice(0, 4).map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-[11px] text-gray-400">
                        <div className={`w-4 h-4 rounded-full ${accentBg} border ${accentBorder} flex items-center justify-center shrink-0`}>
                          <Check size={8} className={accentText} />
                        </div>
                        {item.title}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <button
                    onClick={() => navigate(`/checkout/proposal/${id}`)}
                    className={`w-full bg-gradient-to-r ${accentGrad} text-black font-black uppercase tracking-[0.25em] text-[11px] rounded-2xl py-5 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl ${accentShadow}`}
                  >
                    {t('proposalPage.cta')}
                    <ArrowRight size={14} />
                  </button>

                  {/* Trust */}
                  <div className="mt-6 flex items-center justify-center gap-2 opacity-30">
                    <ShieldCheck size={13} className="text-white" />
                    <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white">{t('proposalPage.secure')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Encryption badge */}
            <div className="mt-6 flex items-center gap-3 px-4">
              <div className="h-px flex-1 bg-white/5" />
              <span className="text-[8px] font-black uppercase tracking-[0.5em] text-gray-700">{t('proposalPage.encryption')}</span>
              <div className="h-px flex-1 bg-white/5" />
            </div>
          </motion.div>
        </div>

        {/* ── WHAT'S INCLUDED ── */}
        <motion.section
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="py-16 border-t border-white/5"
        >
          <div className="mb-10">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${accentBg} border ${accentBorder} ${accentText} text-[9px] font-black uppercase tracking-[0.35em] mb-5`}>
              <Check size={10} />
              {t('proposalPage.included')}
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-black text-white italic tracking-tighter">
              {t('proposalPage.included')}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.isArray(includedItems) && includedItems.map((item, i) => {
              const Icon = INCLUDED_ICONS[i] || Check;
              const desc = item.desc.replace('{n}', revision_limit);
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 + i * 0.07 }}
                  className="group flex flex-col gap-4 p-6 rounded-2xl bg-white/[0.025] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all"
                >
                  <div className={`w-10 h-10 rounded-xl ${accentBg} border ${accentBorder} flex items-center justify-center`}>
                    <Icon size={18} className={accentText} />
                  </div>
                  <div>
                    <div className="text-sm font-black text-white mb-1.5">{item.title}</div>
                    <div className="text-xs text-gray-500 leading-relaxed">{desc}</div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* ── NEXT STEPS ── */}
        <motion.section
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="py-16 border-t border-white/5"
        >
          <div className="mb-10">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${accentBg} border ${accentBorder} ${accentText} text-[9px] font-black uppercase tracking-[0.35em] mb-5`}>
              <Rocket size={10} />
              {t('proposalPage.nextSteps')}
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-black text-white italic tracking-tighter">
              {t('proposalPage.nextSteps')}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.isArray(steps) && steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.08 }}
                className="relative p-6 rounded-2xl bg-white/[0.025] border border-white/5 hover:border-white/10 transition-all group"
              >
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-full w-4 h-px bg-white/10 z-10" />
                )}
                <div className={`text-[10px] font-black ${accentText} uppercase tracking-[0.4em] mb-4`}>{step.num}</div>
                <div className="text-base font-black text-white mb-2">{step.title}</div>
                <div className="text-xs text-gray-500 leading-relaxed">{step.desc}</div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ── REVISION REQUEST ── */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="py-12 border-t border-white/5"
        >
          <button
            onClick={() => setRevisionOpen(p => !p)}
            className="w-full flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl ${accentBg} border ${accentBorder} flex items-center justify-center`}>
                <RefreshCw size={15} className={accentText} />
              </div>
              <div className="text-left">
                <div className="text-sm font-black text-white">
                  {t('proposalPage.revisionTitle')}
                </div>
                <div className="text-xs text-gray-500">{t('proposalPage.revisionSubtitle')}</div>
              </div>
            </div>
            <ChevronDown
              size={18}
              className={`text-gray-500 transition-transform duration-300 ${revisionOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {revisionOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="mt-6 overflow-hidden"
            >
              {revisionSent ? (
                <div className={`flex items-center gap-3 px-5 py-4 rounded-2xl ${accentBg} border ${accentBorder}`}>
                  <Check size={16} className={accentText} />
                  <span className={`text-sm font-bold ${accentText}`}>{t('proposalPage.revisionSent')}</span>
                </div>
              ) : (
                <div className="space-y-3">
                  <textarea
                    value={revisionText}
                    onChange={e => setRevisionText(e.target.value)}
                    rows={4}
                    placeholder={t('proposalPage.revisionPlaceholder')}
                    className={`w-full bg-white/[0.03] border border-white/8 rounded-2xl px-5 py-4 text-white text-sm placeholder-gray-600 outline-none resize-none transition-all focus:${accentBorder.replace('border-', 'border-')}`}
                  />
                  <button
                    onClick={handleRevisionSubmit}
                    disabled={revisionLoading || !revisionText.trim()}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r ${accentGrad} text-black font-black text-[11px] uppercase tracking-[0.2em] transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none`}
                  >
                    {revisionLoading ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
                    {t('proposalPage.revisionCta')}
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </motion.section>

        {/* ── BOTTOM CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="py-12 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6"
        >
          <div>
            <div className="text-white font-black text-lg mb-1">{proposal.project_name}</div>
            <div className="text-gray-500 text-sm">
              {t('proposalPage.questionLabel')}{' '}
              <a href="/contact" className={`${accentText} hover:underline font-semibold`}>
                {t('proposalPage.questionLink')}
              </a>
            </div>
          </div>
          <button
            onClick={() => navigate(`/checkout/proposal/${id}`)}
            className={`shrink-0 bg-gradient-to-r ${accentGrad} text-black font-black uppercase tracking-[0.25em] text-[11px] rounded-2xl px-10 py-5 flex items-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl ${accentShadow}`}
          >
            {t('proposalPage.cta')}
            <ArrowRight size={14} />
          </button>
        </motion.div>

      </div>
    </div>
  );
};

export default ProposalPage;
