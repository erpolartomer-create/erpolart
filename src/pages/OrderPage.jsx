import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import {
  ArrowRight, Sparkles, Check, Loader2,
  User, Mail, Phone, Building2, MessageSquare, Lock,
  CreditCard, X, ShieldCheck, Zap,
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
    shimmer: 'bg-gradient-to-r from-transparent via-cyan/35 to-transparent',
    glow: 'bg-cyan/5', grad: 'from-indigo via-violet to-cyan',
  },
  saas: {
    accent: 'text-amber-400', border: 'border-amber-400/30', bg: 'bg-amber-400/10',
    badgeBg: 'bg-amber-400/10 border-amber-400/25 text-amber-400', cta: 'bg-amber-500 text-black hover:bg-amber-400',
    shimmer: 'bg-gradient-to-r from-transparent via-amber-400/35 to-transparent',
    glow: 'bg-amber-400/5', grad: 'from-amber-300 via-amber-500 to-amber-600',
  },
  automations: {
    accent: 'text-emerald-400', border: 'border-emerald-400/30', bg: 'bg-emerald-400/10',
    badgeBg: 'bg-emerald-400/10 border-emerald-400/25 text-emerald-400', cta: 'bg-emerald-400 text-black hover:bg-emerald-300',
    shimmer: 'bg-gradient-to-r from-transparent via-emerald-400/35 to-transparent',
    glow: 'bg-emerald-400/5', grad: 'from-emerald-300 via-teal-400 to-cyan',
  },
};

const InputField = ({ label, icon: Icon, error, ...props }) => (
  <div>
    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 flex items-center gap-2 mb-1.5">
      {Icon && <Icon size={10} className="text-gray-600" />}{label}
    </label>
    <input
      {...props}
      className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white text-sm font-medium outline-none transition-all placeholder:text-gray-700
        focus:border-white/30 focus:bg-white/8
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
  const [iframeToken, setIframeToken] = useState(null);
  const [showTaksit, setShowTaksit] = useState(false);
  const [currency, setCurrency] = useState(detectCurrency);
  const [rates, setRates] = useState({ TRY: 38, EUR: 0.92, GBP: 0.79, RUB: 90 });
  const iframeRef = useRef(null);
  const isProposal = location.pathname.includes('/proposal/');

  useEffect(() => {
    if (user) setForm(prev => ({ ...prev, name: prev.name || user.user_metadata?.full_name || '', email: prev.email || user.email || '' }));
  }, [user]);

  useEffect(() => {
    fetch('https://open.er-api.com/v6/latest/USD').then(r => r.json()).then(d => { if (d?.rates) setRates(d.rates); }).catch(() => {});
  }, []);

  useEffect(() => {
    if (orderDataState?.source) return;
    if (!id) { navigate('/projects', { replace: true }); return; }
    const fetch_ = async () => {
      setLoadingData(true);
      try {
        if (isProposal) {
          const { data, error } = await supabase.from('proposals').select('*').eq('id', id).single();
          if (error) throw error;
          setDynamicOrderData({ source: 'projects', tier: data.parsedFeatures?.tier || 'Custom', base: data.amount, extras: [], extTotal: 0, total: data.amount, maintenance: false, monthly: 0, projectName: data.project_name });
        } else {
          const { data, error } = await supabase.from('templates').select('*').eq('id', id).single();
          if (error) throw error;
          if (data.is_sold || data.status === 'sold') { navigate('/templates', { replace: true }); return; }
          const p = parseFloat(String(data.price).replace(/[$,]/g, '')) || 0;
          setDynamicOrderData({ source: 'projects', tier: data.tier === 4 ? 'Platinum' : data.tier === 3 ? 'Premium' : data.tier === 2 ? 'Pro' : 'Corporate', base: p, extras: [], extTotal: 0, total: p, maintenance: false, monthly: 0, projectName: data.name });
        }
      } catch { navigate('/projects', { replace: true }); }
      finally { setLoadingData(false); }
    };
    fetch_();
  }, [id, isProposal, orderDataState, navigate]);

  useEffect(() => { if (!orderDataState?.source && !id) navigate('/projects', { replace: true }); }, [orderDataState, id, navigate]);

  useEffect(() => {
    if (!iframeToken) return;
    const existing = document.getElementById('paytr-resizer-script');
    if (existing) { if (window.iFrameResize && iframeRef.current) window.iFrameResize({ heightCalculationMethod: 'lowestElement' }, iframeRef.current); return; }
    const s = document.createElement('script');
    s.id = 'paytr-resizer-script';
    s.src = 'https://www.paytr.com/js/iframeResizer.min.js';
    s.onload = () => { if (window.iFrameResize && iframeRef.current) window.iFrameResize({ heightCalculationMethod: 'lowestElement' }, iframeRef.current); };
    document.head.appendChild(s);
  }, [iframeToken]);

  useEffect(() => {
    if (!showTaksit) return;
    const currentTotal = orderDataState?.total || dynamicOrderData?.total || 0;
    if (!currentTotal) return;
    const timer = setTimeout(() => {
      const container = document.getElementById('paytr_taksit_tablosu');
      if (container) container.innerHTML = '';
      const old = document.getElementById('paytr-taksit-script');
      if (old) old.remove();
      const tlAmount = (currentTotal * (rates.TRY || 38)).toFixed(2);
      const s = document.createElement('script');
      s.id = 'paytr-taksit-script';
      s.src = `https://www.paytr.com/odeme/taksit-tablosu/v2?token=400fc80a3b111727c665b40c8fb6e4a9b64434278a61ffb4d596dbead9a2dc9c&merchant_id=707720&amount=${tlAmount}&taksit=0&tumu=0`;
      document.body.appendChild(s);
    }, 150);
    return () => clearTimeout(timer);
  }, [showTaksit, orderDataState?.total, dynamicOrderData?.total, rates.TRY]);

  if (loadingData || (!orderDataState?.source && !dynamicOrderData)) {
    return (
      <div className="min-h-screen bg-deep-black flex items-center justify-center">
        <div className="relative"><Loader2 className="text-indigo animate-spin" size={48} strokeWidth={1} /><div className="absolute inset-0 bg-indigo/20 blur-xl rounded-full animate-pulse" /></div>
      </div>
    );
  }

  const orderData = orderDataState || dynamicOrderData;
  const { source, tier, base, extras = [], extTotal = 0, total, maintenance = false, monthly = 0 } = orderData;
  const sc = SOURCE_CONFIG[source] || SOURCE_CONFIG.projects;
  const sourceName = orderData.projectName || t(`orderPage.summary.source.${source}`);

  const convertPrice = (usd) => {
    if (!usd) return 0;
    if (currency === 'USD') return Number(usd);
    return Number(usd) * (rates[currency === 'TL' ? 'TRY' : currency] || 1);
  };

  const fmt = (usd) => {
    const v = convertPrice(usd);
    const s = CURRENCY_SYMBOLS[currency] || '$';
    return (currency === 'TL' || currency === 'RUB') ? `${s}${Math.round(v).toLocaleString()}` : `${s}${v.toFixed(2)}`;
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = t('orderPage.form.nameRequired');
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
      const payload = isProposal
        ? { proposalId: id, isProposal: true, email: form.email, full_name: form.name, phone: form.phone, company: form.company || null, notes: form.notes || null }
        : id
          ? { templateId: id, email: form.email, full_name: form.name, phone: form.phone, company: form.company || null, notes: form.notes || null }
          : { direct_amount: total, tier, source, email: form.email, full_name: form.name, phone: form.phone, company: form.company || null, notes: form.notes || null };

      const { data: orderResult } = await API.post('/orders', payload);
      const orderId = orderResult.order.id;
      const origin = window.location.origin;
      const { data: tokenResult } = await API.post('/payment/paytr-token', {
        orderId,
        merchantOkUrl: `${origin}/payment-result?status=success&orderId=${orderId}`,
        merchantFailUrl: `${origin}/payment-result?status=fail`,
        userPhone: form.phone, userName: form.name, currency,
      });

      setIframeToken(tokenResult.iframeToken);
      supabase.from('leads').insert({ name: form.name, email: form.email, phone: form.phone, company: form.company || null, message: form.notes || null, service_type: source, budget: String(total), timeline: tier, project_code: 'erpolart' }).then(() => {}).catch(() => {});
    } catch (err) {
      setErrors({ _global: err?.response?.data?.message || 'Sipariş oluşturulamadı. Lütfen tekrar deneyin.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Helmet><title>Siparişi Tamamla - ErpolArt</title></Helmet>

      <div className="pt-20 pb-24 min-h-screen bg-deep-black relative overflow-x-clip">
        {/* Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(var(--grid-color)_1px,transparent_1px),linear-gradient(90deg,var(--grid-color)_1px,transparent_1px)] bg-[size:40px_40px]" />
          <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] ${sc.glow} blur-[200px] rounded-full`} />
        </div>

        <div className="container mx-auto px-4 lg:px-10 relative z-10 max-w-7xl">

          {/* ── Header ── */}
          <div className="text-center mb-8">
            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-[0.3em] mb-5 ${sc.badgeBg}`}>
              <Sparkles size={10} />{sourceName}
            </div>
            <h1 className="text-3xl md:text-6xl font-display font-black italic tracking-tighter leading-none mb-2">
              <span className="text-white">Siparişinizi </span>
              <span className={`text-transparent bg-clip-text bg-gradient-to-r ${sc.grad} pr-1`}>Tamamlayın.</span>
            </h1>
            <p className="text-gray-500 text-sm">Bilgilerinizi doldurun, güvenli ödeme formunu başlatın.</p>
          </div>

          {/* ── Two-column layout ── */}
          <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-6 items-start">

            {/* ══ LEFT COLUMN ══ */}
            <div className="space-y-4 lg:sticky lg:top-24">

              {/* Order Summary */}
              <div className={`relative rounded-[1.75rem] border bg-surface/20 backdrop-blur-xl p-5 overflow-hidden ${sc.border}`}>
                <div className={`absolute top-0 left-0 right-0 h-px ${sc.shimmer}`} />

                {/* Currency */}
                <div className="flex gap-1 mb-4 flex-wrap">
                  {Object.keys(CURRENCY_SYMBOLS).map(c => (
                    <button key={c} onClick={() => setCurrency(c)}
                      className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-[0.1em] transition-all border
                        ${currency === c ? `${sc.bg} ${sc.accent} ${sc.border}` : 'bg-transparent border-white/8 text-gray-600 hover:text-gray-400 hover:border-white/15'}`}>
                      {CURRENCY_SYMBOLS[c]} {c}
                    </button>
                  ))}
                </div>

                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-600">{t('orderPage.summary.tier')}</div>
                    <div className={`font-black capitalize text-base ${sc.accent}`}>{tier}</div>
                    <div className="text-xs text-gray-500">{sourceName}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-600 mb-1">Toplam</div>
                    <div className={`text-2xl font-display font-black tracking-tighter ${sc.accent}`}>{fmt(total)}</div>
                  </div>
                </div>

                {/* Breakdown */}
                <div className="space-y-1.5 py-3 border-t border-white/6 text-xs">
                  <div className="flex justify-between"><span className="text-gray-500">Baz fiyat</span><span className="text-gray-300">{fmt(base)}</span></div>
                  {extras.length > 0 && extras.map(k => <div key={k} className="flex justify-between pl-2"><span className="text-gray-600">· {k}</span></div>)}
                  {maintenance && monthly > 0 && <div className="flex justify-between"><span className="text-gray-500">Aylık bakım</span><span className="text-gray-300">+{fmt(monthly)}/ay</span></div>}
                </div>

                {/* Trust */}
                <div className="space-y-1.5 pt-3 border-t border-white/6">
                  {[t('orderPage.trust.codes'), t('orderPage.trust.email'), t('orderPage.trust.support')].map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full flex items-center justify-center ${sc.bg}`}><Check size={7} className={sc.accent} /></div>
                      <span className="text-[10px] text-gray-500">{item}</span>
                    </div>
                  ))}
                </div>

                {/* Taksit */}
                <button onClick={() => setShowTaksit(true)}
                  className={`w-full mt-4 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-[10px] font-black uppercase tracking-[0.15em] transition-all ${sc.border} ${sc.accent} ${sc.bg} hover:opacity-75`}>
                  <CreditCard size={11} />Taksit Seçenekleri
                </button>
              </div>

              {/* Form */}
              <div className={`relative rounded-[1.75rem] border bg-surface/20 backdrop-blur-xl p-5 overflow-hidden ${sc.border}`}>
                <div className={`absolute top-0 left-0 right-0 h-px ${sc.shimmer}`} />
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-500 mb-4">İletişim Bilgileri</p>

                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <InputField label="Ad Soyad" icon={User} placeholder="Ömer Erpolat" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} error={errors.name} disabled={!!iframeToken} />
                    <InputField label="E-posta" icon={Mail} type="email" placeholder="omer@erpolart.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} error={errors.email} disabled={!!iframeToken} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <InputField label="Telefon" icon={Phone} type="tel" placeholder="+90 530..." value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} error={errors.phone} disabled={!!iframeToken} />
                    <InputField label="Şirket (opsiyonel)" icon={Building2} placeholder="Şirket Adı" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} disabled={!!iframeToken} />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 flex items-center gap-2 mb-1.5"><MessageSquare size={10} className="text-gray-600" />Proje Notları</label>
                    <textarea rows={3} placeholder="Projeniz hakkında kısa bir not..." value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} disabled={!!iframeToken}
                      className="w-full bg-white/5 border border-white/10 hover:border-white/20 focus:border-white/30 rounded-xl px-4 py-3 text-white text-sm font-medium outline-none transition-all placeholder:text-gray-700 resize-none disabled:opacity-40" />
                  </div>

                  {errors._global && <p className="text-red-400 text-xs text-center">{errors._global}</p>}

                  {!iframeToken ? (
                    <motion.button type="submit" disabled={submitting} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                      className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-black text-[11px] uppercase tracking-[0.12em] transition-all disabled:opacity-50 ${sc.cta}`}>
                      {submitting ? <><Loader2 size={14} className="animate-spin" />Hazırlanıyor...</> : <><Lock size={13} />Güvenli Ödemeyi Başlat<ArrowRight size={13} /></>}
                    </motion.button>
                  ) : (
                    <div className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-[11px] font-black uppercase tracking-[0.12em] ${sc.bg} ${sc.accent} ${sc.border} border`}>
                      <ShieldCheck size={13} />Ödeme Formu Yüklendi
                    </div>
                  )}
                </form>
              </div>
            </div>

            {/* ══ RIGHT COLUMN — PayTR iframe veya placeholder ══ */}
            <div>
              <AnimatePresence mode="wait">
                {!iframeToken ? (
                  // Placeholder
                  <motion.div key="placeholder"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className={`relative rounded-[1.75rem] border bg-surface/15 backdrop-blur-xl overflow-hidden min-h-[520px] flex flex-col items-center justify-center p-10 text-center ${sc.border}`}
                  >
                    <div className={`absolute top-0 left-0 right-0 h-px ${sc.shimmer}`} />
                    <div className={`absolute inset-0 ${sc.glow} opacity-30 blur-[80px]`} />

                    <div className="relative z-10">
                      <div className={`w-20 h-20 rounded-[1.5rem] ${sc.bg} border ${sc.border} flex items-center justify-center mx-auto mb-6`}>
                        <Lock size={32} className={`${sc.accent} opacity-60`} strokeWidth={1.5} />
                      </div>

                      <h3 className="text-white font-black text-xl italic tracking-tight mb-2">Güvenli Ödeme</h3>
                      <p className="text-gray-500 text-sm max-w-xs mx-auto mb-8">
                        Sol taraftaki bilgileri doldurun ve <span className={`font-bold ${sc.accent}`}>Güvenli Ödemeyi Başlat</span> butonuna tıklayın.
                      </p>

                      {/* Payment method logos */}
                      <div className="flex items-center justify-center gap-3 mb-8 flex-wrap">
                        {['VISA', 'MC', 'TROY', 'AMEX'].map(card => (
                          <div key={card} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-black text-gray-500 tracking-widest">{card}</div>
                        ))}
                        <div className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-black text-gray-500 tracking-widest">3D</div>
                      </div>

                      {/* Security */}
                      <div className="space-y-2">
                        {[
                          { icon: ShieldCheck, text: '256-bit SSL şifreleme' },
                          { icon: Lock, text: 'PayTR güvenli altyapı' },
                          { icon: Zap, text: 'Anlık 3D Secure doğrulama' },
                        ].map(({ icon: Icon, text }) => (
                          <div key={text} className="flex items-center justify-center gap-2">
                            <Icon size={11} className={sc.accent} />
                            <span className="text-[11px] text-gray-500">{text}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  // PayTR iframe
                  <motion.div key="iframe"
                    initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}
                    className={`relative rounded-[1.75rem] border overflow-hidden ${sc.border} bg-surface/10`}
                  >
                    <div className={`absolute top-0 left-0 right-0 h-px ${sc.shimmer}`} />
                    <iframe
                      ref={iframeRef}
                      src={`https://www.paytr.com/odeme/guvenli/${iframeToken}`}
                      id="paytriframe"
                      frameBorder="0"
                      scrolling="no"
                      style={{ width: '100%', minHeight: '850px', display: 'block' }}
                      title="PayTR Güvenli Ödeme"
                      onLoad={() => { if (window.iFrameResize && iframeRef.current) window.iFrameResize({ heightCalculationMethod: 'lowestElement' }, iframeRef.current); }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </div>
      </div>

      {/* Taksit Popup */}
      <AnimatePresence>
        {showTaksit && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
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
                    <p className="text-gray-400 text-[10px]">{fmt(total)} tutarındaki ödemeniz için</p>
                  </div>
                </div>
                <button onClick={() => setShowTaksit(false)} className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                  <X size={14} className="text-gray-500" />
                </button>
              </div>
              <div className="p-6"><div id="paytr_taksit_tablosu" /></div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default OrderPage;
