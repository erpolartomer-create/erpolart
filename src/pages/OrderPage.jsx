import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import {
  ArrowRight, Sparkles, Check, Loader2,
  User, Mail, Phone, Building2, MessageSquare, ShieldCheck, Lock,
  CreditCard, X, Edit3,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import useAuthStore from '../store/authStore';
import API from '../services/api';

const detectCurrency = () => {
  const lang = (navigator.language || navigator.languages?.[0] || 'en').toLowerCase();
  if (lang.startsWith('tr')) return 'TL';
  if (lang.startsWith('ru')) return 'RUB';
  if (lang === 'en-gb') return 'GBP';
  if (['de','fr','it','es','nl','pt','pl','cs','ro'].some(l => lang.startsWith(l))) return 'EUR';
  return 'USD';
};

const CURRENCY_SYMBOLS = { TL: '₺', USD: '$', EUR: '€', GBP: '£', RUB: '₽' };

const SOURCE_CONFIG = {
  projects: {
    accent: 'text-cyan', border: 'border-cyan/30', bg: 'bg-cyan/10',
    badgeBg: 'bg-cyan/10 border-cyan/20 text-cyan', cta: 'bg-cyan text-black hover:bg-cyan/80',
    shimmer: 'bg-gradient-to-r from-transparent via-cyan/35 to-transparent', glow: 'bg-cyan/5',
  },
  saas: {
    accent: 'text-amber-400', border: 'border-amber-400/30', bg: 'bg-amber-400/10',
    badgeBg: 'bg-amber-400/10 border-amber-400/25 text-amber-400', cta: 'bg-amber-500 text-black hover:bg-amber-400',
    shimmer: 'bg-gradient-to-r from-transparent via-amber-400/35 to-transparent', glow: 'bg-amber-400/5',
  },
  automations: {
    accent: 'text-emerald-400', border: 'border-emerald-400/30', bg: 'bg-emerald-400/10',
    badgeBg: 'bg-emerald-400/10 border-emerald-400/25 text-emerald-400', cta: 'bg-emerald-400 text-black hover:bg-emerald-300',
    shimmer: 'bg-gradient-to-r from-transparent via-emerald-400/35 to-transparent', glow: 'bg-emerald-400/5',
  },
};

const InputField = ({ label, icon: Icon, error, ...props }) => (
  <div>
    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 flex items-center gap-2 mb-2">
      {Icon && <Icon size={11} className="text-gray-600" />}
      {label}
    </label>
    <input
      {...props}
      className={`w-full bg-surface/30 border rounded-2xl px-5 py-3.5 text-white text-sm font-medium outline-none transition-all placeholder:text-gray-700
        focus:border-white/30 focus:bg-surface/50
        ${error ? 'border-red-500/40' : 'border-white/10 hover:border-white/20'}`}
    />
    {error && <p className="text-[10px] text-red-400 mt-1">{error}</p>}
  </div>
);

const OrderPage = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const orderDataState = location.state;
  const { user } = useAuthStore();

  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', notes: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [dynamicOrderData, setDynamicOrderData] = useState(null);
  const [step, setStep] = useState('billing');
  const [iframeToken, setIframeToken] = useState(null);
  const [showTaksit, setShowTaksit] = useState(false);
  const [currency, setCurrency] = useState(detectCurrency);
  const [rates, setRates] = useState({ TRY: 38, EUR: 0.92, GBP: 0.79, RUB: 90 });
  const iframeRef = useRef(null);

  const isProposal = location.pathname.includes('/proposal/');

  // Prefill from auth
  useEffect(() => {
    if (user) {
      setForm(prev => ({
        ...prev,
        name:  prev.name  || user.user_metadata?.full_name || '',
        email: prev.email || user.email || '',
      }));
    }
  }, [user]);

  // Fetch exchange rates
  useEffect(() => {
    fetch('https://open.er-api.com/v6/latest/USD')
      .then(r => r.json())
      .then(d => { if (d?.rates) setRates(d.rates); })
      .catch(() => {});
  }, []);

  // Fetch order/template data
  useEffect(() => {
    if (orderDataState?.source) return;
    if (!id) { navigate('/projects', { replace: true }); return; }

    const fetchOrderDetails = async () => {
      setLoadingData(true);
      try {
        if (isProposal) {
          const { data, error } = await supabase.from('proposals').select('*').eq('id', id).single();
          if (error) throw error;
          setDynamicOrderData({
            source: 'projects', tier: data.parsedFeatures?.tier || 'Custom',
            base: data.amount, extras: [], extTotal: 0, total: data.amount,
            maintenance: false, monthly: 0, projectName: data.project_name,
          });
        } else {
          const { data, error } = await supabase.from('templates').select('*').eq('id', id).single();
          if (error) throw error;
          if (data.is_sold || data.status === 'sold') { navigate('/templates', { replace: true }); return; }
          const parsedPrice = parseFloat(String(data.price).replace(/[$,]/g, '')) || 0;
          setDynamicOrderData({
            source: 'projects',
            tier: data.tier === 4 ? 'Platinum' : data.tier === 3 ? 'Premium' : data.tier === 2 ? 'Pro' : 'Corporate',
            base: parsedPrice, extras: [], extTotal: 0, total: parsedPrice,
            maintenance: false, monthly: 0, projectName: data.name,
          });
        }
      } catch (err) {
        console.error('Error loading order details:', err);
        navigate('/projects', { replace: true });
      } finally {
        setLoadingData(false);
      }
    };
    fetchOrderDetails();
  }, [id, isProposal, orderDataState, navigate]);

  useEffect(() => {
    if (!orderDataState?.source && !id) navigate('/projects', { replace: true });
  }, [orderDataState, id, navigate]);

  // PayTR iframeResizer
  useEffect(() => {
    if (step !== 'payment' || !iframeToken) return;
    const existing = document.getElementById('paytr-resizer-script');
    if (existing) { if (window.iFrameResize && iframeRef.current) window.iFrameResize({ heightCalculationMethod: 'lowestElement' }, iframeRef.current); return; }
    const script = document.createElement('script');
    script.id  = 'paytr-resizer-script';
    script.src = 'https://www.paytr.com/js/iframeResizer.min.js';
    script.onload = () => { if (window.iFrameResize && iframeRef.current) window.iFrameResize({ heightCalculationMethod: 'lowestElement' }, iframeRef.current); };
    document.head.appendChild(script);
  }, [step, iframeToken]);

  // PayTR taksit tablosu — uses state values only (no destructured vars)
  useEffect(() => {
    if (!showTaksit) return;
    const currentTotal = orderDataState?.total || dynamicOrderData?.total || 0;
    if (!currentTotal) return;

    // Kısa bekleme: React'in modal div'ini DOM'a eklemesini garantile
    const timer = setTimeout(() => {
      const container = document.getElementById('paytr_taksit_tablosu');
      if (container) container.innerHTML = '';
      const old = document.getElementById('paytr-taksit-script');
      if (old) old.remove();
      const tlAmount = (currentTotal * (rates.TRY || 38)).toFixed(2);
      const script = document.createElement('script');
      script.id  = 'paytr-taksit-script';
      script.src = `https://www.paytr.com/odeme/taksit-tablosu/v2?token=400fc80a3b111727c665b40c8fb6e4a9b64434278a61ffb4d596dbead9a2dc9c&merchant_id=707720&amount=${tlAmount}&taksit=0&tumu=0`;
      document.body.appendChild(script);
    }, 150);

    return () => clearTimeout(timer);
  }, [showTaksit, orderDataState?.total, dynamicOrderData?.total, rates.TRY]);

  if (loadingData || (!orderDataState?.source && !dynamicOrderData)) {
    return (
      <div className="min-h-screen bg-deep-black flex flex-col items-center justify-center gap-6">
        <div className="relative">
          <Loader2 className="text-indigo animate-spin" size={48} strokeWidth={1} />
          <div className="absolute inset-0 bg-indigo/20 blur-xl rounded-full animate-pulse" />
        </div>
        <p className="text-white/25 text-[10px] font-black uppercase tracking-[0.5em] animate-pulse">Loading Order Details</p>
      </div>
    );
  }

  const orderData = orderDataState || dynamicOrderData;
  const { source, tier, base, extras = [], extTotal = 0, total, maintenance = false, monthly = 0 } = orderData;
  const sc = SOURCE_CONFIG[source] || SOURCE_CONFIG.projects;
  const sourceName = orderData.projectName || t(`orderPage.summary.source.${source}`);

  const convertPrice = (usdAmount) => {
    if (!usdAmount) return 0;
    const n = Number(usdAmount);
    if (currency === 'USD') return n;
    const rateKey = currency === 'TL' ? 'TRY' : currency;
    return n * (rates[rateKey] || 1);
  };

  const fmtPrice = (usdAmount) => {
    const converted = convertPrice(usdAmount);
    const sym = CURRENCY_SYMBOLS[currency] || '$';
    if (currency === 'TL' || currency === 'RUB') return `${sym}${Math.round(converted).toLocaleString()}`;
    return `${sym}${converted.toFixed(2)}`;
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim())  e.name  = t('orderPage.form.nameRequired');
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = t('orderPage.form.emailRequired');
    if (!form.phone.trim()) e.phone = t('orderPage.form.phoneRequired');
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitting(true);
    try {
      const orderPayload = isProposal
        ? { proposalId: id, isProposal: true, email: form.email, full_name: form.name, phone: form.phone, company: form.company || null, notes: form.notes || null }
        : id
          ? { templateId: id, email: form.email, full_name: form.name, phone: form.phone, company: form.company || null, notes: form.notes || null }
          : { direct_amount: total, tier, source, email: form.email, full_name: form.name, phone: form.phone, company: form.company || null, notes: form.notes || null };

      const { data: orderResult } = await API.post('/orders', orderPayload);
      const orderId = orderResult.order.id;

      const origin = window.location.origin;
      const { data: tokenResult } = await API.post('/payment/paytr-token', {
        orderId,
        merchantOkUrl:   `${origin}/payment-result?status=success&orderId=${orderId}`,
        merchantFailUrl: `${origin}/payment-result?status=fail`,
        userPhone: form.phone,
        userName:  form.name,
        currency,
      });

      setIframeToken(tokenResult.iframeToken);
      setStep('payment');

      supabase.from('leads').insert({
        name: form.name, email: form.email, phone: form.phone,
        company: form.company || null, message: form.notes || null,
        service_type: source, budget: String(total), timeline: tier, project_code: 'erpolart',
      }).then(() => {}).catch(() => {});

    } catch (err) {
      console.error('Order/Token error:', err);
      setErrors({ _global: err?.response?.data?.message || 'Sipariş oluşturulamadı. Lütfen tekrar deneyin.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Helmet><title>Siparişi Tamamla - ErpolArt</title></Helmet>

      <div className="pt-24 pb-24 min-h-screen bg-deep-black relative" style={{ overflowX: 'clip' }}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(var(--grid-color)_1px,transparent_1px),linear-gradient(90deg,var(--grid-color)_1px,transparent_1px)] bg-[size:40px_40px]" />
          <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] ${sc.glow} blur-[200px] rounded-full`} />
        </div>

        <div className="container mx-auto px-6 lg:px-12 relative z-10 max-w-6xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-[10px] font-black uppercase tracking-[0.3em] mb-6 ${sc.badgeBg}`}>
              <Sparkles size={11} />
              {sourceName}
            </div>
            <h1 className="text-4xl md:text-[64px] font-display font-black italic tracking-tighter leading-[0.9] mb-3">
              <span className="text-white">{step === 'payment' ? 'Güvenli ' : t('orderPage.title')}{' '}</span>
              <span className={`text-transparent bg-clip-text bg-gradient-to-r ${
                source === 'saas' ? 'from-amber-300 via-amber-500 to-amber-600' :
                source === 'automations' ? 'from-emerald-300 via-teal-400 to-cyan' :
                'from-indigo via-violet to-cyan'
              } pr-2`}>
                {step === 'payment' ? 'Ödeme' : t('orderPage.titleAccent')}
              </span>
            </h1>
          </motion.div>

          <AnimatePresence mode="wait">
            {/* ── BILLING STEP ── */}
            {step === 'billing' && (
              <motion.div
                key="billing"
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start"
              >
                {/* Form */}
                <div className={`relative rounded-[2rem] border bg-surface/20 backdrop-blur-xl p-6 md:p-10 overflow-hidden ${sc.border}`}>
                  <div className={`absolute top-0 left-0 right-0 h-px ${sc.shimmer}`} />
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <InputField label={t('orderPage.form.name')} icon={User} placeholder={t('orderPage.form.namePlaceholder')} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} error={errors.name} />
                      <InputField label={t('orderPage.form.email')} icon={Mail} type="email" placeholder={t('orderPage.form.emailPlaceholder')} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} error={errors.email} />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <InputField label={t('orderPage.form.phone')} icon={Phone} type="tel" placeholder={t('orderPage.form.phonePlaceholder')} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} error={errors.phone} />
                      <InputField label={t('orderPage.form.company')} icon={Building2} placeholder={t('orderPage.form.companyPlaceholder')} value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 flex items-center gap-2 mb-2">
                        <MessageSquare size={11} className="text-gray-600" />{t('orderPage.form.notes')}
                      </label>
                      <textarea rows={4} placeholder={t('orderPage.form.notesPlaceholder')} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
                        className="w-full bg-surface/30 border border-white/10 hover:border-white/20 focus:border-white/30 rounded-2xl px-5 py-3.5 text-white text-sm font-medium outline-none transition-all placeholder:text-gray-700 resize-none" />
                    </div>
                    {errors._global && <p className="text-red-400 text-sm text-center">{errors._global}</p>}
                    <motion.button type="submit" disabled={submitting} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                      className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.12em] transition-all duration-300 disabled:opacity-50 ${sc.cta}`}>
                      {submitting ? <><Loader2 size={14} className="animate-spin" />Hazırlanıyor...</> : <><Lock size={14} />Ödemeye Geç<ArrowRight size={14} /></>}
                    </motion.button>
                    <p className="text-center text-[9px] text-gray-600">{t('orderPage.ctaNote')}</p>
                  </form>
                </div>

                {/* Order Summary */}
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="lg:sticky lg:top-28">
                  <div className={`relative rounded-[2rem] border bg-surface/25 backdrop-blur-xl p-6 overflow-hidden ${sc.border}`}>
                    <div className={`absolute top-0 left-0 right-0 h-px ${sc.shimmer}`} />

                    {/* Currency Switcher */}
                    <div className="flex gap-1 mb-5 flex-wrap">
                      {Object.keys(CURRENCY_SYMBOLS).map(c => (
                        <button key={c} onClick={() => setCurrency(c)}
                          className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-[0.15em] transition-all border
                            ${currency === c ? `${sc.bg} ${sc.accent} ${sc.border}` : 'bg-transparent border-white/10 text-gray-600 hover:border-white/20 hover:text-gray-400'}`}>
                          {CURRENCY_SYMBOLS[c]} {c}
                        </button>
                      ))}
                    </div>

                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-[0.25em] mb-5 ${sc.badgeBg}`}>
                      <Sparkles size={9} />{t('orderPage.summary.title')}
                    </div>

                    <div className="mb-4">
                      <div className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-600 mb-1">{t('orderPage.summary.tier')}</div>
                      <div className={`text-sm font-black capitalize ${sc.accent}`}>{tier}</div>
                      <div className="text-xs text-gray-500">{sourceName}</div>
                    </div>

                    <div className="space-y-2 py-4 border-t border-b border-white/6 mb-4">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">{t('orderPage.summary.basePrice')}</span>
                        <span className="text-gray-300 font-medium">{fmtPrice(base)}</span>
                      </div>
                      {extras.length > 0 && (
                        <>
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-500">{t('orderPage.summary.extras')}</span>
                            <span className="text-gray-300 font-medium">+{fmtPrice(extTotal)}</span>
                          </div>
                          {extras.map(key => (
                            <div key={key} className="flex justify-between text-xs pl-2">
                              <span className="text-gray-600">· {key}</span>
                            </div>
                          ))}
                        </>
                      )}
                      {maintenance && monthly > 0 && (
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-500">{t('orderPage.summary.maintenance')}</span>
                          <span className="text-gray-300 font-medium">+{fmtPrice(monthly)}/mo</span>
                        </div>
                      )}
                    </div>

                    <div className="mb-5">
                      <div className="text-[9px] font-black uppercase tracking-[0.25em] text-gray-600 mb-1">{t('orderPage.summary.total')}</div>
                      <div className={`text-4xl font-display font-black tracking-tighter ${sc.accent}`}>{fmtPrice(total)}</div>
                      <div className="text-[9px] text-gray-600 mt-1">{t('orderPage.summary.oneTime')}</div>
                    </div>

                    <div className="space-y-2 pt-4 border-t border-white/6">
                      {[t('orderPage.trust.codes'), t('orderPage.trust.email'), t('orderPage.trust.support')].map((item, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${sc.bg}`}>
                            <Check size={8} className={sc.accent} />
                          </div>
                          <span className="text-[10px] text-gray-500">{item}</span>
                        </div>
                      ))}
                    </div>

                    <button onClick={() => setShowTaksit(true)}
                      className={`w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-2xl border text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${sc.border} ${sc.accent} ${sc.bg} hover:opacity-80`}>
                      <CreditCard size={12} />Taksit Seçenekleri
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* ── PAYMENT STEP — tek sayfada yan yana ── */}
            {step === 'payment' && iframeToken && (
              <motion.div
                key="payment"
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8 items-start"
              >
                {/* LEFT: Sipariş özeti + bilgiler */}
                <div className="lg:sticky lg:top-28 space-y-4">
                  {/* Güvenlik rozetleri */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.15em]">
                      <ShieldCheck size={12} />256-bit SSL Encrypted
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo/10 border border-indigo/20 text-indigo text-[10px] font-black uppercase tracking-[0.15em]">
                      <Lock size={12} />PayTR Secure Payment
                    </div>
                  </div>

                  {/* Girilen bilgiler */}
                  <div className={`relative rounded-[2rem] border bg-surface/20 backdrop-blur-xl p-5 overflow-hidden ${sc.border}`}>
                    <div className={`absolute top-0 left-0 right-0 h-px ${sc.shimmer}`} />
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-[9px] font-black uppercase tracking-[0.25em] text-gray-500">Sipariş Bilgileri</p>
                      <button onClick={() => setStep('billing')}
                        className="flex items-center gap-1 text-[9px] font-black uppercase tracking-[0.1em] text-gray-500 hover:text-white transition-colors">
                        <Edit3 size={10} />Düzenle
                      </button>
                    </div>
                    <div className="space-y-2.5">
                      {[
                        { label: 'Ad Soyad', value: form.name },
                        { label: 'E-posta', value: form.email },
                        { label: 'Telefon', value: form.phone },
                        ...(form.company ? [{ label: 'Şirket', value: form.company }] : []),
                      ].map(({ label, value }) => (
                        <div key={label}>
                          <div className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-600">{label}</div>
                          <div className="text-white text-xs font-medium truncate">{value}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tutar */}
                  <div className={`relative rounded-[2rem] border bg-surface/20 backdrop-blur-xl p-5 overflow-hidden ${sc.border}`}>
                    <div className={`absolute top-0 left-0 right-0 h-px ${sc.shimmer}`} />
                    <div className="text-[9px] font-black uppercase tracking-[0.25em] text-gray-500 mb-1">{sourceName} · {tier}</div>
                    <div className={`text-3xl font-display font-black tracking-tighter ${sc.accent}`}>{fmtPrice(total)}</div>
                    {maintenance && monthly > 0 && (
                      <div className="text-[10px] text-gray-500 mt-1">+{fmtPrice(monthly)}/ay bakım dahil</div>
                    )}
                  </div>
                </div>

                {/* RIGHT: PayTR iframe */}
                <div className={`relative rounded-[2rem] border overflow-hidden ${sc.border} bg-surface/10`}>
                  <div className={`absolute top-0 left-0 right-0 h-px ${sc.shimmer}`} />
                  <iframe
                    ref={iframeRef}
                    src={`https://www.paytr.com/odeme/guvenli/${iframeToken}`}
                    id="paytriframe"
                    frameBorder="0"
                    scrolling="no"
                    style={{ width: '100%', minHeight: '850px', display: 'block' }}
                    title="PayTR Güvenli Ödeme"
                    onLoad={() => {
                      if (window.iFrameResize && iframeRef.current) {
                        window.iFrameResize({ heightCalculationMethod: 'lowestElement' }, iframeRef.current);
                      }
                    }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Taksit Popup */}
      <AnimatePresence>
        {showTaksit && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-deep-black/85 backdrop-blur-xl"
            onClick={() => setShowTaksit(false)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.92, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 280, damping: 24 }}
              className="relative w-full max-w-4xl max-h-[85vh] overflow-y-auto rounded-[2rem] bg-white shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b border-gray-100 px-8 py-5 flex items-center justify-between z-10 rounded-t-[2rem]">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${sc.bg}`}>
                    <CreditCard size={14} className={sc.accent} />
                  </div>
                  <div>
                    <p className="text-gray-900 font-black text-sm uppercase tracking-wider">Taksit Seçenekleri</p>
                    <p className="text-gray-400 text-[10px]">{fmtPrice(total)} tutarındaki ödemeniz için</p>
                  </div>
                </div>
                <button onClick={() => setShowTaksit(false)}
                  className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                  <X size={14} className="text-gray-500" />
                </button>
              </div>
              <div className="p-6">
                <div id="paytr_taksit_tablosu" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default OrderPage;
