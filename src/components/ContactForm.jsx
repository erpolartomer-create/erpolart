import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Send, CheckCircle2, MessageCircle, Mail, User, Briefcase, ChevronDown, Sparkles, ArrowRight, Check } from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import { supabase } from '../lib/supabase';
import { toast } from './Toast';

const CustomSelect = ({ value, onChange, options, icon: Icon }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between bg-surface border border-border-adaptive rounded-2xl px-6 py-4 text-white text-sm font-medium focus:border-indigo/50 focus:ring-4 focus:ring-indigo/5 outline-none transition-all shadow-sm cursor-pointer hover:border-white/20"
      >
        <span className="flex items-center gap-3">
          {Icon && <Icon size={14} className="text-indigo shrink-0" />}
          <span>{selected?.label}</span>
        </span>
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
                    ? 'bg-indigo/15 text-white'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <span className="font-medium">{opt.label}</span>
                {opt.value === value && <Check size={13} className="text-indigo shrink-0" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ContactForm = ({ id }) => {
  const { t } = useTranslation();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: 'custom_design',
    budget: '5k-10k',
    timeline: 't2',
    description: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        service_type: formData.service,
        budget: formData.budget,
        timeline: formData.timeline,
        message: formData.description,
        project_code: 'erpolart'
      };
      const { error } = await supabase.from('leads').insert([payload]);
      if (error) throw error;
      setIsSubmitted(true);
    } catch (err) {
      console.error(err);
      toast.error("Mesajınız gönderilirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.");
    } finally {
      setIsLoading(false);
    }
  };

  const labelClass = "text-[10px] font-black text-muted-text uppercase tracking-[0.3em] mb-3 block ml-1 transition-colors";
  const inputClass = "w-full bg-surface border border-border-adaptive rounded-2xl px-6 py-4 text-white text-sm font-medium placeholder-gray-500/50 focus:border-indigo/50 focus:ring-4 focus:ring-indigo/5 outline-none transition-all shadow-sm";

  const serviceOptions = [
    { value: 'custom_design', label: t('contact.services.branding') },
    { value: 'ai_saas',       label: t('contact.services.ai') },
    { value: 'automation',    label: t('contact.services.automation') },
    { value: 'ecommerce',     label: t('contact.services.ecommerce') },
    { value: 'enterprise',    label: t('contact.services.enterprise') },
  ];

  const budgetOptions = [
    { value: '250-1k',   label: '$250 — $1,000' },
    { value: '1k-2.5k',  label: '$1,000 — $2,500' },
    { value: '2.5k-5k',  label: '$2,500 — $5,000' },
    { value: '5k-10k',   label: '$5,000 — $10,000' },
    { value: '10k+',     label: '$10,000+' },
  ];

  return (
    <div id={id} className="max-w-3xl mx-auto relative z-10 font-sans group">
      {!isSubmitted ? (
        <ScrollReveal direction="up" delay={0.2}>
          <div className="relative shadow-2xl rounded-[40px] transition-all duration-500">
            <div className="bg-surface/80 backdrop-blur-3xl border border-border-adaptive rounded-[40px] p-8 md:p-12 relative overflow-hidden isolate">
              <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-indigo/20 to-transparent" />

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className={labelClass}>
                      <span className="flex items-center gap-2"><User size={12} className="text-indigo" /> {t('contact.fullName')}</span>
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
                      <span className="flex items-center gap-2"><Mail size={12} className="text-indigo" /> {t('contact.email')}</span>
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
                      <span className="flex items-center gap-2"><Briefcase size={12} className="text-indigo" /> {t('contact.service')}</span>
                    </label>
                    <CustomSelect
                      value={formData.service}
                      onChange={(v) => setFormData({ ...formData, service: v })}
                      options={serviceOptions}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>
                      <span className="flex items-center gap-2"><Sparkles size={12} className="text-indigo" /> {t('contact.budget')}</span>
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
                    <span className="flex items-center gap-2"><ArrowRight size={12} className="text-indigo" /> {t('contact.timelineLabel')}</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {['t1', 't2', 't3', 't4'].map((oId) => (
                      <button
                        key={oId}
                        type="button"
                        onClick={() => setFormData({ ...formData, timeline: oId })}
                        className={`px-4 py-3 rounded-xl border text-[11px] font-black uppercase tracking-wider transition-all ${
                          formData.timeline === oId
                            ? 'bg-indigo border-indigo text-white shadow-lg shadow-indigo/20'
                            : 'bg-surface border-white/5 text-gray-400 hover:border-white/20'
                        }`}
                      >
                        {t(`contact.timelineOptions.${oId}`)}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className={labelClass}>
                    <span className="flex items-center gap-2"><MessageCircle size={12} className="text-indigo" /> {t('contact.description')}</span>
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
                  className="group relative w-full py-5 rounded-2xl bg-[#3b58ff] text-white font-black text-xs uppercase tracking-[0.3em] overflow-hidden transition-all duration-500 hover:shadow-[0_20px_40px_rgba(59,88,255,0.3)] hover:scale-[1.01] active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none shadow-xl border border-white/10"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none" />
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
                        <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-500" />
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
          className="bg-surface border border-green-500/20 rounded-[40px] p-12 md:p-20 text-center shadow-xl font-sans"
        >
          <div className="w-24 h-24 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-10 shadow-[0_0_50px_rgba(34,197,94,0.1)]">
            <CheckCircle2 size={48} className="text-green-500" />
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-6 uppercase tracking-tight italic">{t('contact.success.title')}</h2>
          <p className="text-muted-text text-lg font-medium max-w-md mx-auto leading-relaxed mb-10">
            {t('contact.success.message')}
          </p>
          <button
            onClick={() => setIsSubmitted(false)}
            className="text-indigo font-black text-xs uppercase tracking-[0.2em] border-b-2 border-indigo/30 pb-1 hover:border-indigo transition-all"
          >
            {t('contact.success.cta')}
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default ContactForm;
