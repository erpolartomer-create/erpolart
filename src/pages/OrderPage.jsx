import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import {
  Sparkles, Check, Loader2,
  User, Mail, Phone, Building2, MessageSquare,
  Lock, ShieldCheck, CreditCard, X,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import useAuthStore from '../store/authStore';
import API from '../services/api';

// ─── Currency detection ───────────────────────────────────────────────────────
const CURRENCY_SYMBOLS = { TL: '₺', USD: '$', EUR: '€', GBP: '£' };

// PayTR'de şu an sadece TL aktif. Diğerleri onaylanınca buraya eklenir:
// örn. ['TL', 'USD', 'EUR', 'GBP']
const ACTIVE_CURRENCIES = ['TL'];

const detectCurrency = () => {
  const lang = (navigator.language || navigator.languages?.[0] || 'en').toLowerCase();
  let detected = 'USD';
  if (lang.startsWith('tr')) detected = 'TL';
  else if (lang === 'en-gb') detected = 'GBP';
  else if (['de','fr','it','es','nl','pt','pl','cs','ro'].some(l => lang.startsWith(l))) detected = 'EUR';
  // Sadece aktif para birimlerine izin ver; değilse TL'ye düş
  return ACTIVE_CURRENCIES.includes(detected) ? detected : 'TL';
};

// ─── Source config ────────────────────────────────────────────────────────────
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

// ─── Input field component ────────────────────────────────────────────────────
const Field = ({ label, icon: Icon, error, className = '', ...props }) => (
  <div className={className}>
    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 flex items-center gap-1.5 mb-1.5">
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

// ─── Card number formatter ────────────────────────────────────────────────────
const formatCardNumber = (v) =>
  v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();

const formatExpiry = (v) => {
  const d = v.replace(/\D/g, '').slice(0, 4);
  return d.length > 2 ? d.slice(0, 2) + ' / ' + d.slice(2) : d;
};

// ─── Main Component ───────────────────────────────────────────────────────────
const OrderPage = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  // Giriş (OAuth) tam-sayfa redirect'i location.state'i kaybeder → sessionStorage yedeği
  const orderDataState = location.state?.source
    ? location.state
    : (() => {
        if (id) return null; // template/proposal akışı ID ile çalışır, yedeğe gerek yok
        try { return JSON.parse(sessionStorage.getItem('erpolart_pending_order') || 'null'); }
        catch { return null; }
      })();
  const { user } = useAuthStore();

  // Billing form
  const [billing, setBilling] = useState({ name: '', email: '', phone: '', company: '', notes: '' });
  // Card form
  const [card, setCard] = useState({ owner: '', number: '', expiry: '', cvv: '' });
  const [installment, setInstallment] = useState('0');
  // BIN detection (kart markası/banka tespiti)
  const [binInfo, setBinInfo] = useState(null); // { brand, bank, schema, cardType, status }
  const binCacheRef = useRef({}); // bin → result cache
  // Taksit oranları (mağazaya tanımlı max taksit + kart markasına göre oranlar)
  const [maxInstallment, setMaxInstallment] = useState(0);
  const [ratesByBrand, setRatesByBrand] = useState({}); // { axess: { 2: 3.5, ... }, ... }

  const [errors, setErrors]         = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [dynamicOrderData, setDynamicOrderData] = useState(null);

  // PayTR Direkt API response — when set, hidden form auto-submits
  const [paytrData, setPaytrData] = useState(null);
  const hiddenFormRef = useRef(null);

  const [currency, setCurrency] = useState(detectCurrency);
  const [rates, setRates] = useState({ TRY: 38, EUR: 0.92, GBP: 0.79 });

  const isProposal = location.pathname.includes('/proposal/');

  // Pre-fill from auth
  useEffect(() => {
    if (user) setBilling(prev => ({
      ...prev,
      name:  prev.name  || user.user_metadata?.full_name || '',
      email: prev.email || user.email || '',
    }));
  }, [user]);

  // Exchange rates — backend üzerinden (CSP open.er-api.com'a izin vermiyor)
  useEffect(() => {
    API.get('/payment/rates')
      .then(({ data }) => { if (data?.rates) setRates(data.rates); })
      .catch(() => {});
  }, []);

  // Taksit oranları — max taksit + kart markasına göre vade farkı oranları
  useEffect(() => {
    API.get('/payment/installment-rates')
      .then(({ data }) => {
        if (data?.status === 'success') {
          setMaxInstallment(Number(data.maxInstallment) || 0);
          setRatesByBrand(data.ratesByBrand || {});
        }
      })
      .catch(() => {});
  }, []);

  // Fetch order/template data if no state
  useEffect(() => {
    if (orderDataState?.source) return;
    if (paytrData) return; // PayTR'ye gönderim sürüyor, yönlendirme yapma
    if (!id) { navigate('/projects', { replace: true }); return; }
    const load = async () => {
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
    load();
  }, [id, isProposal, orderDataState, navigate]);

  // PayTR'ye gönderim başladıysa (paytrData) asla /projects'e atma — yoksa gizli form gönderilemez
  useEffect(() => { if (!orderDataState?.source && !id && !paytrData) navigate('/projects', { replace: true }); }, [orderDataState, id, navigate, paytrData]);

  // Auto-submit hidden form when paytrData is ready
  useEffect(() => {
    if (paytrData && hiddenFormRef.current) {
      hiddenFormRef.current.submit();
      // Form gönderildi (PayTR'ye gidiliyor) → bekleyen sipariş yedeğini temizle
      try { sessionStorage.removeItem('erpolart_pending_order'); } catch { /* yut */ }
    }
  }, [paytrData]);

  // BIN sorgulama — kart numarası 6+ haneye ulaşınca markayı/bankayı tespit et
  const cardDigits = card.number.replace(/\s/g, '');
  useEffect(() => {
    const bin = cardDigits.slice(0, 8);
    if (cardDigits.length < 6) { setBinInfo(null); return; }
    if (binCacheRef.current[bin]) { setBinInfo(binCacheRef.current[bin]); return; }

    const timer = setTimeout(async () => {
      try {
        const { data } = await API.post('/payment/bin-detail', { binNumber: bin });
        binCacheRef.current[bin] = data;
        setBinInfo(data);
        // Yabancı kart / taksitsiz kart → tek çekime zorla
        if (data.status !== 'success' || data.brand === 'none') {
          setInstallment('0');
        }
      } catch {
        setBinInfo(null);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [cardDigits]);

  // Kart markasının oran tablosu (vade farkı %)
  const brandRates = (binInfo?.brand && binInfo.brand !== 'none')
    ? (ratesByBrand[binInfo.brand] || ratesByBrand[String(binInfo.brand).toLowerCase()] || null)
    : null;
  // Taksit seçenekleri: hem mağaza maksimumu hem de o markada oranı OLAN taksitler
  const installmentOptions = [2, 3, 6, 9, 12].filter(
    n => n <= maxInstallment && brandRates && Number(brandRates[n]) > 0
  );
  const installmentAvailable = installmentOptions.length > 0;

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

  // Paket adı ve ek hizmet adlarını sayfa diline göre yerelleştir (ham anahtar yerine).
  // Çeviri yoksa güvenli geri dönüş = ham değer.
  const PRICING_PREFIX = { projects: 'projectsPage', saas: 'saasPage', automations: 'automationsPage' };
  const _prefix = PRICING_PREFIX[source] || 'saasPage';
  const _tierKey = source === 'projects'
    ? `${_prefix}.pricing.${String(tier).toLowerCase()}.tierName`
    : `${_prefix}.pricing.tiers.${String(tier).toLowerCase()}.tierName`;
  const tierLabel = t(_tierKey, { defaultValue: tier });
  const extraLabel = (k) => t(`${_prefix}.pricing.extras.${k}`, { defaultValue: k });

  const convertPrice = (usd) => {
    if (!usd) return 0;
    if (currency === 'USD') return Number(usd);
    return Number(usd) * (rates[currency === 'TL' ? 'TRY' : currency] || 1);
  };
  const fmt = (usd) => {
    const v = convertPrice(usd);
    const s = CURRENCY_SYMBOLS[currency] || '$';
    return currency === 'TL' ? `${s}${Math.round(v).toLocaleString()}` : `${s}${v.toFixed(2)}`;
  };

  // Taksitli toplam (vade farkı dahil) — USD cinsinden döner, fmt ile formatlanır.
  // Formül (PayTR): toplam = tutar / ((100 - oran) / 100). Oran yoksa null.
  const installmentTotalUsd = (n) => {
    const oran = brandRates ? Number(brandRates[n]) : 0;
    if (!(oran > 0 && oran < 100)) return null;
    return Number(total) / ((100 - oran) / 100);
  };
  const selectedInstTotalUsd = installment !== '0' ? installmentTotalUsd(Number(installment)) : null;

  // ── Validation ──────────────────────────────────────────────────────────────
  const validate = () => {
    const e = {};
    if (!billing.name.trim())  e.name  = t('checkout.vName');
    if (!billing.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = t('checkout.vEmail');
    if (!billing.phone.trim()) e.phone = t('checkout.vPhone');
    if (!card.owner.trim())    e.cardOwner = t('checkout.vCardOwner');
    const rawCard = card.number.replace(/\s/g, '');
    if (rawCard.length !== 16) e.cardNumber = t('checkout.vCardNumber');
    const expiryDigits = card.expiry.replace(/\D/g, '');
    if (expiryDigits.length !== 4) e.expiry = t('checkout.vExpiry');
    if (card.cvv.length < 3)   e.cvv = t('checkout.vCvv');
    return e;
  };

  // ── Submit ──────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setSubmitting(true);

    try {
      // 1. Create order
      const orderPayload = isProposal
        ? { proposalId: id, isProposal: true, email: billing.email, full_name: billing.name, phone: billing.phone, company: billing.company || null, notes: billing.notes || null }
        : id
          ? { templateId: id, email: billing.email, full_name: billing.name, phone: billing.phone, company: billing.company || null, notes: billing.notes || null }
          : { direct_amount: total, tier, source, extras, pages: orderData.pages, langCount: orderData.langCount, email: billing.email, full_name: billing.name, phone: billing.phone, company: billing.company || null, notes: billing.notes || null };

      const { data: orderResult } = await API.post('/orders', orderPayload);
      const orderId = orderResult.order.id;
      // NOT: sessionStorage'ı burada SİLME — setPaytrData re-render'ında orderData
      // null olup /projects'e bounce'a sebep oluyordu. Form gönderilince silinir.

      // 2. Get PayTR Direct API token
      // ÖNEMLİ: ok/fail URL'leri backend'e (Railway) işaret eder.
      // PayTR bu URL'lere POST atar; Express POST'u karşılayıp 302 ile frontend'e yönlendirir.
      // (Cloudflare statik SPA POST'a index.html döndüremez.)
      const apiBase = import.meta.env.VITE_API_URL;

      const { data: tokenData } = await API.post('/payment/paytr-direct-token', {
        orderId,
        merchantOkUrl:   `${apiBase}/api/payment/success/${orderId}`,
        merchantFailUrl: `${apiBase}/api/payment/fail`,
        userPhone:        billing.phone,
        userName:         billing.name,
        installment_count: installment,
        currency,
        cardType:          binInfo?.brand || '',
      });

      // 3. Trigger auto-submit of hidden form (card data + paytrData → paytr.com/odeme)
      setPaytrData(tokenData);

      // Lead capture (fire-and-forget)
      supabase.from('leads').insert({ name: billing.name, email: billing.email, phone: billing.phone, company: billing.company || null, message: billing.notes || null, service_type: source, budget: String(total), timeline: tier, project_code: 'erpolart' }).then(() => {}).catch(() => {});

    } catch (err) {
      console.error('Checkout error:', err);
      setErrors({ _global: err?.response?.data?.error || err?.response?.data?.message || t('checkout.errGeneric') });
      setSubmitting(false);
    }
  };

  // Expiry → month + year
  const expiryDigits = card.expiry.replace(/\D/g, '');
  const expiryMonth  = expiryDigits.slice(0, 2);
  const expiryYear   = expiryDigits.slice(2, 4);

  return (
    <>
      <Helmet><title>Güvenli Ödeme - ErpolArt</title></Helmet>

      {/* Hidden PayTR Direct API form — auto-submitted when paytrData is ready */}
      {paytrData && (
        <form ref={hiddenFormRef} action="https://www.paytr.com/odeme" method="POST" style={{ display: 'none' }}>
          {/* Kart alanları — kullanıcının girdiği değerler, sunucuya uğramadan PayTR'ye gider */}
          <input name="cc_owner"      defaultValue={card.owner} />
          <input name="card_number"   defaultValue={card.number.replace(/\s/g, '')} />
          <input name="expiry_month"  defaultValue={expiryMonth} />
          <input name="expiry_year"   defaultValue={expiryYear} />
          <input name="cvv"           defaultValue={card.cvv} />
          {/* Tüm backend alanları */}
          <input name="paytr_token"       defaultValue={paytrData.paytr_token} />
          <input name="merchant_id"       defaultValue={paytrData.merchant_id} />
          <input name="user_ip"           defaultValue={paytrData.user_ip} />
          <input name="merchant_oid"      defaultValue={paytrData.merchant_oid} />
          <input name="email"             defaultValue={paytrData.email} />
          <input name="payment_type"      defaultValue={paytrData.payment_type} />
          <input name="payment_amount"    defaultValue={paytrData.payment_amount} />
          <input name="currency"          defaultValue={paytrData.currency} />
          <input name="test_mode"         defaultValue={paytrData.test_mode} />
          <input name="non_3d"            defaultValue={paytrData.non_3d} />
          <input name="merchant_ok_url"   defaultValue={paytrData.merchant_ok_url} />
          <input name="merchant_fail_url" defaultValue={paytrData.merchant_fail_url} />
          <input name="user_name"         defaultValue={paytrData.user_name} />
          <input name="user_address"      defaultValue={paytrData.user_address} />
          <input name="user_phone"        defaultValue={paytrData.user_phone} />
          <input name="user_basket"       defaultValue={paytrData.user_basket} />
          <input name="debug_on"          defaultValue={paytrData.debug_on} />
          <input name="client_lang"       defaultValue={paytrData.client_lang} />
          <input name="non3d_test_failed" defaultValue={paytrData.non3d_test_failed} />
          <input name="installment_count" defaultValue={paytrData.installment_count} />
          <input name="card_type"         defaultValue={paytrData.card_type} />
        </form>
      )}

      <div className="pt-20 pb-24 min-h-screen bg-deep-black relative overflow-x-clip">
        {/* Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(var(--grid-color)_1px,transparent_1px),linear-gradient(90deg,var(--grid-color)_1px,transparent_1px)] bg-[size:40px_40px]" />
          <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] ${sc.glow} blur-[200px] rounded-full`} />
        </div>

        <div className="container mx-auto px-4 lg:px-10 relative z-10 max-w-6xl">

          {/* Header */}
          <div className="text-center mb-8">
            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-[0.3em] mb-5 ${sc.badgeBg}`}>
              <Sparkles size={10} />{sourceName}
            </div>
            <h1 className="text-3xl md:text-5xl font-display font-black italic tracking-tighter leading-none mb-2">
              <span className="text-white">{t('checkout.titlePre')} </span>
              <span className={`text-transparent bg-clip-text bg-gradient-to-r ${sc.grad} pr-1`}>{t('checkout.titleAccent')}</span>
            </h1>
            <p className="text-gray-500 text-sm">{t('checkout.subtitle')}</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* ── LEFT: Sipariş özeti + fatura bilgileri ── */}
              <div className="space-y-4">

                {/* Order Summary */}
                <div className={`relative rounded-[1.75rem] border bg-surface/20 backdrop-blur-xl p-5 overflow-hidden ${sc.border}`}>
                  <div className={`absolute top-0 left-0 right-0 h-px ${sc.shimmer}`} />

                  {/* Currency Switcher — sadece birden fazla aktif para birimi varsa göster */}
                  {ACTIVE_CURRENCIES.length > 1 && (
                    <div className="flex gap-1 mb-4 flex-wrap">
                      {ACTIVE_CURRENCIES.map(c => (
                        <button key={c} type="button" onClick={() => setCurrency(c)}
                          className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-[0.1em] transition-all border
                            ${currency === c ? `${sc.bg} ${sc.accent} ${sc.border}` : 'bg-transparent border-white/8 text-gray-600 hover:text-gray-400 hover:border-white/15'}`}>
                          {CURRENCY_SYMBOLS[c]} {c}
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-600">{t('checkout.tier')}</div>
                      <div className={`font-black text-base capitalize ${sc.accent}`}>{tierLabel}</div>
                      <div className="text-xs text-gray-500">{sourceName}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-600 mb-0.5">{t('checkout.total')}</div>
                      <div className={`text-2xl font-display font-black tracking-tighter ${sc.accent}`}>{fmt(total)}</div>
                    </div>
                  </div>

                  <div className="space-y-1.5 py-3 border-t border-white/6 text-xs">
                    <div className="flex justify-between"><span className="text-gray-500">{t('checkout.basePrice')}</span><span className="text-gray-300">{fmt(base)}</span></div>
                    {extras.length > 0 && extras.map(k => <div key={k} className="flex justify-between pl-2"><span className="text-gray-600">· {extraLabel(k)}</span></div>)}
                    {maintenance && monthly > 0 && <div className="flex justify-between"><span className="text-gray-500">{t('checkout.maintenanceFirst')}</span><span className="text-gray-300">+{fmt(monthly)}</span></div>}
                  </div>

                  <div className="space-y-1.5 pt-3 border-t border-white/6">
                    {[t('checkout.trustCodes'), t('checkout.trustEmail'), t('checkout.trustLaunch')].map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full flex items-center justify-center ${sc.bg}`}><Check size={7} className={sc.accent} /></div>
                        <span className="text-[10px] text-gray-500">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Billing Info */}
                <div className={`relative rounded-[1.75rem] border bg-surface/20 backdrop-blur-xl p-5 overflow-hidden ${sc.border}`}>
                  <div className={`absolute top-0 left-0 right-0 h-px ${sc.shimmer}`} />
                  <p className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-500 mb-4">{t('checkout.billingTitle')}</p>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <Field label={t('checkout.name')} icon={User} placeholder="John Doe" value={billing.name} onChange={e => setBilling({ ...billing, name: e.target.value })} error={errors.name} />
                      <Field label={t('checkout.email')} icon={Mail} type="email" placeholder="omer@erpolart.com" value={billing.email} onChange={e => setBilling({ ...billing, email: e.target.value })} error={errors.email} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Field label={t('checkout.phone')} icon={Phone} type="tel" placeholder="+90 530..." value={billing.phone} onChange={e => setBilling({ ...billing, phone: e.target.value })} error={errors.phone} />
                      <Field label={t('checkout.company')} icon={Building2} placeholder="Acme" value={billing.company} onChange={e => setBilling({ ...billing, company: e.target.value })} />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 flex items-center gap-1.5 mb-1.5"><MessageSquare size={10} className="text-gray-600" />{t('checkout.notes')}</label>
                      <textarea rows={2} placeholder={t('checkout.notesPlaceholder')} value={billing.notes} onChange={e => setBilling({ ...billing, notes: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 hover:border-white/20 focus:border-white/30 rounded-xl px-4 py-3 text-white text-sm font-medium outline-none transition-all placeholder:text-gray-700 resize-none" />
                    </div>
                  </div>
                </div>
              </div>

              {/* ── RIGHT: Kart formu ── */}
              <div className="space-y-4">
                <div className={`relative rounded-[1.75rem] border bg-surface/20 backdrop-blur-xl p-5 overflow-hidden ${sc.border}`}>
                  <div className={`absolute top-0 left-0 right-0 h-px ${sc.shimmer}`} />

                  {/* Card logos */}
                  <div className="flex items-center justify-between mb-5">
                    <p className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-500 flex items-center gap-2"><CreditCard size={11} />{t('checkout.cardTitle')}</p>
                    <div className="flex gap-1.5">
                      {['VISA','MC','TROY','AMEX'].map(c => (
                        <div key={c} className="px-2 py-0.5 rounded bg-white/8 border border-white/10 text-[8px] font-black text-gray-500 tracking-wider">{c}</div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    {/* Card number */}
                    <Field
                      label={t('checkout.cardNumber')}
                      icon={CreditCard}
                      placeholder="0000 0000 0000 0000"
                      value={card.number}
                      onChange={e => setCard({ ...card, number: formatCardNumber(e.target.value) })}
                      maxLength={19}
                      inputMode="numeric"
                      error={errors.cardNumber}
                    />

                    {/* Card owner */}
                    <Field
                      label={t('checkout.cardOwner')}
                      icon={User}
                      placeholder="JOHN DOE"
                      value={card.owner}
                      onChange={e => setCard({ ...card, owner: e.target.value.toUpperCase() })}
                      error={errors.cardOwner}
                    />

                    {/* Expiry + CVV */}
                    <div className="grid grid-cols-2 gap-3">
                      <Field
                        label={t('checkout.expiry')}
                        placeholder="MM / YY"
                        value={card.expiry}
                        onChange={e => setCard({ ...card, expiry: formatExpiry(e.target.value) })}
                        maxLength={7}
                        inputMode="numeric"
                        error={errors.expiry}
                      />
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 flex items-center gap-1.5 mb-1.5">
                          <Lock size={10} className="text-gray-600" />CVV
                        </label>
                        <input
                          type="password"
                          placeholder="•••"
                          value={card.cvv}
                          onChange={e => setCard({ ...card, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                          maxLength={4}
                          inputMode="numeric"
                          className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white text-sm font-medium outline-none transition-all placeholder:text-gray-700 focus:border-white/30 ${errors.cvv ? 'border-red-500/40' : 'border-white/10 hover:border-white/20'}`}
                        />
                        {errors.cvv && <p className="text-[10px] text-red-400 mt-1">{errors.cvv}</p>}
                      </div>
                    </div>

                    {/* Taksit */}
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 block mb-1.5">{t('checkout.installmentLabel')}</label>
                      <select
                        value={installment}
                        onChange={e => setInstallment(e.target.value)}
                        disabled={!installmentAvailable}
                        className="w-full bg-white/5 border border-white/10 hover:border-white/20 focus:border-white/30 rounded-xl px-4 py-3 text-white text-sm font-medium outline-none transition-all appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <option value="0" className="bg-surface text-white">{t('checkout.single')} — {fmt(total)}</option>
                        {installmentAvailable && installmentOptions.map(n => {
                          const totalN = installmentTotalUsd(n);
                          const label = totalN
                            ? `${n} ${t('checkout.installmentWord')} · ${fmt(totalN / n)}${t('checkout.perMonth')}`
                            : `${n} ${t('checkout.installmentWord')}`;
                          return <option key={n} value={String(n)} className="bg-surface text-white">{label}</option>;
                        })}
                      </select>
                      {/* Taksitli toplam bilgisi (vade farkı dahil) */}
                      {selectedInstTotalUsd && (
                        <div className="mt-2 text-[11px] text-gray-400">
                          {installment} × {fmt(selectedInstTotalUsd / Number(installment))} =
                          <span className={`font-bold ${sc.accent}`}> {fmt(selectedInstTotalUsd)}</span>
                          <span className="text-gray-600"> {t('checkout.withInterest')}</span>
                        </div>
                      )}
                      {/* BIN tespit göstergesi */}
                      {cardDigits.length >= 6 && binInfo && (
                        <div className="mt-2 flex items-center gap-2 flex-wrap">
                          {binInfo.status === 'success' ? (
                            <>
                              {binInfo.schema && <span className="px-2 py-0.5 rounded bg-white/8 border border-white/10 text-[9px] font-black text-gray-400 tracking-wider">{binInfo.schema}</span>}
                              {binInfo.bank && <span className="text-[10px] text-gray-500">{binInfo.bank}</span>}
                              {!installmentAvailable && <span className="text-[10px] text-amber-400/80">· {t('checkout.installmentNoCard')}</span>}
                            </>
                          ) : (
                            <span className="text-[10px] text-gray-600">{t('checkout.foreignCard')}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Security info */}
                <div className={`relative rounded-[1.75rem] border bg-surface/15 p-5 overflow-hidden ${sc.border}`}>
                  <div className={`absolute top-0 left-0 right-0 h-px ${sc.shimmer}`} />
                  <div className="space-y-2">
                    {[
                      { icon: ShieldCheck, text: t('checkout.secSsl') },
                      { icon: Lock, text: t('checkout.secNoStore') },
                      { icon: CreditCard, text: t('checkout.sec3d') },
                    ].map(({ icon: Icon, text }) => (
                      <div key={text} className="flex items-center gap-2">
                        <Icon size={11} className={sc.accent} />
                        <span className="text-[11px] text-gray-500">{text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Error */}
                {errors._global && (
                  <div className="flex items-start gap-2 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    <X size={14} className="mt-0.5 shrink-0" />{errors._global}
                  </div>
                )}

                {/* Submit button */}
                <motion.button
                  type="submit"
                  disabled={submitting}
                  whileHover={{ scale: submitting ? 1 : 1.01 }}
                  whileTap={{ scale: submitting ? 1 : 0.98 }}
                  className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-[12px] uppercase tracking-[0.15em] transition-all duration-300 disabled:opacity-60 ${sc.cta}`}
                >
                  {submitting ? (
                    <><Loader2 size={15} className="animate-spin" />{t('checkout.preparing')}</>
                  ) : (
                    <><Lock size={14} />{fmt(selectedInstTotalUsd ?? total)} {t('checkout.payCta')}</>
                  )}
                </motion.button>

                <p className="text-center text-[9px] text-gray-600">
                  {t('checkout.legal1')} <span className="text-gray-400">{t('checkout.privacy')}</span> {t('checkout.and')} <span className="text-gray-400">{t('checkout.distance')}</span>{t('checkout.legal2')}
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default OrderPage;
