import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Send, CheckCircle2, MessageCircle, Mail, User,
  Briefcase, ChevronDown, Sparkles, ArrowRight, Check,
} from 'lucide-react';
import ScrollReveal from '../ScrollReveal';
import { supabase } from '../../lib/supabase';
import { toast } from '../Toast';

const CustomSelect = ({ value, onChange, options }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between bg-surface border border-white/8 rounded-2xl px-6 py-4 text-white text-sm font-medium focus:border-emerald-400/50 focus:ring-4 focus:ring-emerald-400/5 outline-none transition-all shadow-sm cursor-pointer hover:border-white/20"
      >
        <span className="text-sm">{selected?.label}</span>
        <ChevronDown
          size={14}
          className={`text-gray-500 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
            className="absolute z-50 top-full mt-2 w-full bg-surface/95 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-black/40"
          >
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => { onChange(opt.value); setOpen(false); }}
                className={`w-full flex items-center justify-between px-5 py-3.5 text-sm text-left transition-colors duration-150 ${
                  opt.value === value
                    ? 'bg-emerald-400/15 text-white'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <span className="font-medium">{opt.label}</span>
                {opt.value === value && <Check size={13} className="text-emerald-400 shrink-0" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const AutomationsContactSection = () => {
  const { t } = useTranslation();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: 'automation',
    budget: '2.5k-5k',
    timeline: 't2',
    description: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { error } = await supabase.from('leads').insert([{
        name: formData.name,
        email: formData.email,
        service_type: formData.service,
        budget: formData.budget,
        timeline: formData.timeline,
        message: formData.description,
        project_code: 'erpolart',
      }]);
      if (error) throw error;
      setIsSubmitted(true);
    } catch (err) {
      console.error(err);
      toast.error('Mesajınız gönderilirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  const labelClass = 'text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-3 block ml-1';
  const inputClass = 'w-full bg-surface border border-white/8 rounded-2xl px-6 py-4 text-white text-sm font-medium placeholder-gray-600 focus:border-emerald-400/50 focus:ring-4 focus:ring-emerald-400/5 outline-none transition-all shadow-sm';

  const serviceOptions = [
    { value: 'custom_design', label: t('contact.services.branding') },
    { value: 'ai_saas',       label: t('contact.services.ai') },
    { value: 'automation',    label: t('contact.services.automation') },
    { value: 'ecommerce',     label: t('contact.services.ecommerce') },
    { value: 'enterprise',    label: t('contact.services.enterprise') },
  ];

  const budgetOptions = [
    { value: '250-1k',  label: '$250 — $1,000' },
    { value: '1k-2.5k', label: '$1,000 — $2,500' },
    { value: '2.5k-5k', label: '$2,500 — $5,000' },
    { value: '5k-10k',  label: '$5,000 — $10,000' },
    { value: '10k+',    label: '$10,000+' },
  ];

  return (
    <section id="automations-contact" className="py-16 md:py-28 relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-emerald-500/5 blur-[160px] rounded-full" />
      </div>

      <ScrollReveal className="text-center mb-12 md:mb-16 px-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-400/10 border border-emerald-400/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] mb-8">
          <Sparkles size={11} />
          {t('automationsPage.cta.badge')}
        </div>
        <h2 className="text-4xl md:text-[72px] font-display font-black text-white italic tracking-tighter leading-[0.9] mb-4">
          {t('automationsPage.cta.title')}
        </h2>
        <p className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
          {t('automationsPage.cta.subtitle')}
        </p>
      </ScrollReveal>

      <div className="max-w-3xl mx-auto px-6 relative z-10">
        {!isSubmitted ? (
          <ScrollReveal direction="up" delay={0.15}>
            <div className="relative rounded-[2.5rem] overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/25 to-transparent" />
              <div className="bg-surface/60 backdrop-blur-2xl border border-white/8 rounded-[2.5rem] p-8 md:p-12">

                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className={labelClass}>
                        <span className="flex items-center gap-2">
                          <User size={11} className="text-emerald-400" />
                          {t('contact.fullName')}
                        </span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className={inputClass}
                        placeholder="Adınız Soyadınız"
                      />
                    </div>
                    <div>
                      <label className={labelClass}>
                        <span className="flex items-center gap-2">
                          <Mail size={11} className="text-emerald-400" />
                          {t('contact.email')}
                        </span>
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className={inputClass}
                        placeholder="E-posta adresiniz"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className={labelClass}>
                        <span className="flex items-center gap-2">
                          <Briefcase size={11} className="text-emerald-400" />
                          {t('contact.service')}
                        </span>
                      </label>
                      <CustomSelect
                        value={formData.service}
                        onChange={(v) => setFormData({ ...formData, service: v })}
                        options={serviceOptions}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>
                        <span className="flex items-center gap-2">
                          <Sparkles size={11} className="text-emerald-400" />
                          {t('contact.budget')}
                        </span>
                      </label>
                      <CustomSelect
                        value={formData.budget}
                        onChange={(v) => setFormData({ ...formData, budget: v })}
                        options={budgetOptions}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>
                      <span className="flex items-center gap-2">
                        <ArrowRight size={11} className="text-emerald-400" />
                        {t('contact.timelineLabel')}
                      </span>
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {['t1', 't2', 't3', 't4'].map((oId) => (
                        <button
                          key={oId}
                          type="button"
                          onClick={() => setFormData({ ...formData, timeline: oId })}
                          className={`px-4 py-3 rounded-xl border text-[11px] font-black uppercase tracking-wider transition-all ${
                            formData.timeline === oId
                              ? 'bg-emerald-400/10 border-emerald-400/50 text-emerald-400 shadow-lg shadow-emerald-400/10'
                              : 'bg-surface border-white/6 text-gray-500 hover:border-white/20 hover:text-gray-300'
                          }`}
                        >
                          {t(`contact.timelineOptions.${oId}`)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>
                      <span className="flex items-center gap-2">
                        <MessageCircle size={11} className="text-emerald-400" />
                        {t('contact.description')}
                      </span>
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className={`${inputClass} resize-none`}
                      placeholder={t('contact.descPlaceholder')}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="group relative w-full py-5 rounded-2xl bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-500 text-black font-black text-xs uppercase tracking-[0.3em] overflow-hidden transition-all duration-300 hover:shadow-[0_20px_40px_rgba(52,211,153,0.3)] hover:scale-[1.01] active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-4">
                      {isLoading ? (
                        <span className="flex items-center gap-3">
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          {t('contact.launching')}
                        </span>
                      ) : (
                        <>
                          <span>{t('contact.launch')}</span>
                          <Send size={15} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                        </>
                      )}
                    </span>
                  </button>
                </form>
              </div>
            </div>
          </ScrollReveal>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-surface/60 backdrop-blur-2xl border border-emerald-400/20 rounded-[2.5rem] p-12 md:p-20 text-center"
          >
            <div className="w-20 h-20 rounded-full bg-emerald-400/10 flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(52,211,153,0.15)]">
              <CheckCircle2 size={40} className="text-emerald-400" />
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4 uppercase tracking-tight italic">
              {t('contact.success.title')}
            </h2>
            <p className="text-gray-400 text-base font-medium max-w-md mx-auto leading-relaxed mb-6">
              {t('contact.success.message')}
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-emerald-400/8 border border-emerald-400/20 mb-10">
              <Mail size={13} className="text-emerald-400 shrink-0" />
              <span className="text-gray-400 text-xs">{t('contact.success.emailNote')}</span>
              <span className="text-emerald-400 text-xs font-bold">{formData.email}</span>
            </div>
            <button
              onClick={() => setIsSubmitted(false)}
              className="text-emerald-400 font-black text-xs uppercase tracking-[0.2em] border-b-2 border-emerald-400/30 pb-1 hover:border-emerald-400 transition-all"
            >
              {t('contact.success.cta')}
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default AutomationsContactSection;
