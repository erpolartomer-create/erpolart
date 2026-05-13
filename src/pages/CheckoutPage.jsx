import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../services/api';
import {
  ArrowLeft,
  ArrowUpRight,
  ShieldCheck,
  Lock,
  CreditCard,
  ChevronRight,
  Zap,
  CheckCircle2,
  FileKey,
  AlertCircle,
  X,
  ShieldAlert,
  Info,
  Loader2,
  Globe,
  Sparkles,
  Gauge,
  Link as LinkIcon,
  Users
} from 'lucide-react';
import { useTranslation, Trans } from 'react-i18next';
import { supabase } from '../lib/supabase';
import useAuthStore from '../store/authStore';
// Payment is handled via Supabase Edge Functions (create-order, payment-create, payment-callback)
import ScrollReveal from '../components/ScrollReveal';
import PreInfoModal from '../components/legal/PreInfoModal';

const CheckoutPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const { user } = useAuthStore();
  const isProposalMode = window.location.pathname.includes('/proposal');
  const [template, setTemplate] = useState(null);
  const [proposal, setProposal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [subscriptionPlan, setSubscriptionPlan] = useState('Pro');

  const PLANS = [
    { id: 'Corporate', color: 'text-gray-400' },
    { id: 'Pro', color: 'text-indigo' },
    { id: 'Premium', color: 'text-violet' },
    { id: 'Platinum', color: 'text-cyan' }
  ];

  const currentPlan = PLANS.find(p => p.id === subscriptionPlan) || PLANS[1];

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    taxId: ''
  });

  const [orderId, setOrderId] = useState(null);
  const [iyzicoForm, setIyzicoForm] = useState(null);
  const [copied, setCopied] = useState(false);
  const [ibanCopied, setIbanCopied] = useState(false);

  const IBAN = 'TR65 0015 7000 0000 0076 6951 02';
  const ACCOUNT_HOLDER = 'Fidan Ünal Erpolat';

  const [selectedAddons, setSelectedAddons] = useState([]);
  const [isMaintenanceActive, setIsMaintenanceActive] = useState(false);

  // Tier-based monthly maintenance pricing
  const MAINTENANCE_TIERS = { Corporate: 29, Pro: 49, Premium: 150, Platinum: 250 };
  const maintenancePrice = MAINTENANCE_TIERS[subscriptionPlan] || 49;

  const dynamicAddons = template?.extra_services || [];

  const [isPreInfoOpen, setIsPreInfoOpen] = useState(false);
  const [agreements, setAgreements] = useState({
    preInfo: false,
    distanceSelling: false,
    noRefund: false,
    autoRenewal: false
  });

  const allAgreementsAccepted = agreements.preInfo && agreements.distanceSelling && agreements.noRefund && (!isMaintenanceActive || agreements.autoRenewal);

  // Auto-fill email from auth
  useEffect(() => {
    if (user?.email) {
      setFormData(prev => ({ ...prev, email: user.email }));
    }
    if (user?.user_metadata?.full_name) {
      const parts = user.user_metadata.full_name.split(' ');
      setFormData(prev => ({
        ...prev,
        firstName: prev.firstName || parts[0] || '',
        lastName: prev.lastName || parts.slice(1).join(' ') || ''
      }));
    }
  }, [user]);

  // Validation Logic
  const isFormValid = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return (
      formData.firstName.trim().length > 1 &&
      formData.lastName.trim().length > 1 &&
      emailRegex.test(formData.email) &&
      formData.phone.trim().length > 9 &&
      formData.address.trim().length > 5 &&
      formData.taxId.trim().length >= 10
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isProposalMode) {
          const { data, error } = await supabase.from('proposals').select('*').eq('id', id).single();
          if (error) throw error;
          setProposal(data);

          const isPlatinum = data.project_name?.includes('Platinum') || (data.features && JSON.parse(data.features).tier === 'Platinum');

          setTemplate({
            name: isPlatinum ? t('checkout.platinumArch') : t('checkout.premiumArch'),
            price: data.amount,
            tier: isPlatinum ? 4 : 3
          });
          setSubscriptionPlan(isPlatinum ? 'Platinum' : 'Premium');
        } else {
          const { data, error } = await supabase.from('templates').select('*').eq('id', id).eq('project_code', 'erpolart').single();
          if (error) throw error;
          setTemplate(data);
        }
      } catch (err) {
        console.error('Error fetching checkout data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    window.scrollTo(0, 0);
  }, [id, isProposalMode, t]);

  useEffect(() => {
    if (template) {
      const tierMap = { 1: 'Corporate', 2: 'Pro', 3: 'Premium', 4: 'Platinum' };
      setSubscriptionPlan(tierMap[template.tier] || 'Pro');
    }
  }, [template]);

  const addonTotal = selectedAddons.reduce((sum, addonId) => {
    const addon = dynamicAddons.find(a => a.id === addonId);
    return sum + (addon ? Number(addon.price) : 0);
  }, 0);

  const basePrice = isProposalMode ? (proposal?.amount || 0) : (template ? Number(template.price.toString().replace(/[^0-9.]/g, '')) : 0);
  const totalAmount = basePrice + addonTotal;

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!isFormValid()) return;

    setIsProcessing(true);
    setError(null);

    try {
      // 1. Create order via Supabase Edge Function (server-side price calculation)
      const { data: orderData, error: orderError } = await supabase.functions.invoke('create-order', {
        body: {
          ...(isProposalMode
            ? { proposalId: id, isProposal: true }
            : { templateId: template.id, selectedAddons, isMaintenanceActive }
          ),
          email: formData.email,
          full_name: `${formData.firstName} ${formData.lastName}`.trim(),
          phone: formData.phone,
          address: formData.address,
          tax_id: formData.taxId,
        },
      });

      if (orderError || !orderData?.success) {
        throw new Error(orderData?.message || orderError?.message || 'Sipariş oluşturulamadı.');
      }

      setOrderId(orderData.order.id);

      // 2. Initialize iyzico checkout form via Edge Function
      const { data: paymentData, error: paymentError } = await supabase.functions.invoke('payment-create', {
        body: { orderId: orderData.order.id },
      });

      if (paymentError || !paymentData?.success) {
        throw new Error(paymentData?.message || paymentError?.message || 'Ödeme formu oluşturulamadı.');
      }

      setIyzicoForm(paymentData.checkoutFormContent);
      setIsProcessing(false);
    } catch (err) {
      console.error('Order processing error:', err);
      setIsProcessing(false);
      setError(err.message || t('common.error'));
    }
  };

  const copyToClipboard = (text, type = 'ref') => {
    navigator.clipboard.writeText(text);
    if (type === 'iban') {
      setIbanCopied(true);
      setTimeout(() => setIbanCopied(false), 2000);
    } else {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) return <div className="min-h-screen bg-surface flex items-center justify-center text-white italic font-black uppercase tracking-[0.3em] animate-pulse">{t('checkout.establishingConnection')}</div>;
  if (!template && !error) return null;

  return (
    <div className="bg-surface min-h-screen flex flex-col pt-32 pb-32 relative transition-colors duration-500 overflow-hidden">
      {/* Immersive Background System */}
      <div className="absolute inset-0 bg-[linear-gradient(var(--grid-color)_1px,transparent_1px),linear-gradient(90deg,var(--grid-color)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none opacity-20" />

      {/* Background Glow Effects */}
      <div className="absolute top-0 -left-1/4 w-1/2 h-full bg-indigo/10 blur-[160px] rounded-full pointer-events-none animate-pulse" />
      <div className="absolute bottom-0 -right-1/4 w-1/2 h-full bg-cyan/10 blur-[160px] rounded-full pointer-events-none animate-pulse duration-[4000ms]" />

      <div className="container mx-auto px-6 lg:px-12 relative z-10 max-w-7xl flex-1">
        {template && (
          <>
            <div className="flex flex-col lg:flex-row items-start gap-6 w-full max-w-7xl mx-auto relative">
              {/* Left Column: Fixed Payment Terminal (Sticky) */}
              <div className="w-full lg:w-1/2 lg:sticky lg:top-8 h-max">
                {/* Heading Section */}
                <ScrollReveal>
                  <div className="mb-10">
                    <h1 className="text-4xl md:text-5xl font-display font-black text-white italic tracking-tighter mb-4">
                      {t('checkout.title')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo to-cyan pr-4">{t('checkout.titleAccent')}</span>
                    </h1>
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <Lock size={16} className="text-cyan" />
                      <p className="font-medium tracking-tight uppercase tracking-widest text-[10px]">{t('checkout.encrypted')}</p>
                    </div>
                  </div>
                </ScrollReveal>

                {/* Form Container */}
                <div className="flex flex-col gap-8">
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="mb-10 p-6 rounded-3xl bg-red-500/10 border border-red-500/20 flex items-start gap-4 shadow-xl"
                      >
                        <ShieldAlert size={20} className="text-red-500 mt-1 shrink-0" />
                        <div className="flex-1">
                          <p className="text-red-500 text-xs font-black uppercase tracking-widest mb-1 italic">{t('checkout.protocolRestriction') || 'ERROR'}</p>
                          <p className="text-white/60 text-[11px] leading-relaxed italic">{error}</p>
                        </div>
                        <button onClick={() => setError(null)}><X size={16} className="text-gray-500" /></button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Iyzico Payment Form Container */}
                  <AnimatePresence>
                    {iyzicoForm && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-8 rounded-[2.5rem] bg-white border border-white/10 shadow-2xl relative z-50 mb-10 overflow-hidden"
                      >
                        <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-4">
                          <div className="flex items-center gap-3">
                            <CreditCard size={20} className="text-indigo" />
                            <h3 className="text-indigo text-[10px] font-black uppercase tracking-[0.3em]">SECURE_GATEWAY_ACTIVE</h3>
                          </div>
                          <button 
                            onClick={() => setIyzicoForm(null)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <X size={20} />
                          </button>
                        </div>
                        <div id="iyzipay-checkout-form" className="responsive" dangerouslySetInnerHTML={{ __html: iyzicoForm }} />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <form className="space-y-10" onSubmit={handlePayment}>
                    {/* Billing */}
                    <div className="space-y-8">
                      <div className="flex items-center gap-3 border-b border-white/5 pb-2 inline-flex">
                        <h3 className="text-white text-[10px] font-black uppercase tracking-[0.4em]">{t('checkout.billingTitle')}</h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-widest text-white/40 italic ml-1">{t('checkout.firstName')}</label>
                          <input
                            type="text"
                            required
                            value={formData.firstName}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                            className="w-full bg-white/[0.04] border border-white/10 rounded-2xl px-6 py-4 text-white text-sm focus:outline-none focus:border-indigo/50 focus:bg-white/[0.06] transition-all placeholder:text-white/10 italic"
                            placeholder="Ömer"
                          />
                        </div>
                        <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-widest text-white/40 italic ml-1">{t('checkout.lastName')}</label>
                          <input
                            type="text"
                            required
                            value={formData.lastName}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                            className="w-full bg-white/[0.04] border border-white/10 rounded-2xl px-6 py-4 text-white text-sm focus:outline-none focus:border-indigo/50 focus:bg-white/[0.06] transition-all placeholder:text-white/10 italic"
                            placeholder="Erpolat"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                          <div className="space-y-3">
                            <label className="text-[10px] font-black text-white/40 uppercase tracking-widest italic ml-1">{t('checkout.emailLabel')}</label>
                            <input
                              type="email"
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              className="w-full bg-white/[0.04] border border-white/10 rounded-2xl px-6 py-4 text-white text-sm focus:outline-none focus:border-indigo/50 focus:bg-white/[0.06] transition-all placeholder:text-white/10 italic"
                              placeholder="E-posta adresiniz"
                              required
                            />
                          </div>

                          <div className="space-y-3">
                            <label className="text-[10px] font-black text-white/40 uppercase tracking-widest italic ml-1">{t('checkout.phoneLabel')}</label>
                            <input
                              type="tel"
                              value={formData.phone}
                              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                              className="w-full bg-white/[0.04] border border-white/10 rounded-2xl px-6 py-4 text-white text-sm focus:outline-none focus:border-indigo/50 focus:bg-white/[0.06] transition-all placeholder:text-white/10 italic"
                              placeholder="+90 5XX XXX XX XX"
                              required
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-8 mt-8">
                          <div className="space-y-3">
                            <label className="text-[10px] font-black text-white/40 uppercase tracking-widest italic ml-1">{t('checkout.addressLabel')}</label>
                            <textarea
                              value={formData.address}
                              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                              className="w-full bg-white/[0.04] border border-white/10 rounded-2xl px-6 py-4 text-white text-sm focus:outline-none focus:border-indigo/50 focus:bg-white/[0.06] transition-all placeholder:text-white/10 italic min-h-[100px]"
                              placeholder="Mahalle, Sokak, No, İlçe/İl"
                              required
                            />
                          </div>

                          <div className="space-y-3">
                            <label className="text-[10px] font-black text-white/40 uppercase tracking-widest italic ml-1">{t('checkout.taxIdLabel')}</label>
                            <input
                              type="text"
                              value={formData.taxId}
                              onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                              className="w-full bg-white/[0.04] border border-white/10 rounded-2xl px-6 py-4 text-white text-sm focus:outline-none focus:border-indigo/50 focus:bg-white/[0.06] transition-all placeholder:text-white/10 italic"
                              placeholder="11 Haneli TC veya 10 Haneli VKN"
                            />
                          </div>
                        </div>
                        {user?.email && <p className="text-[8px] text-cyan font-bold uppercase tracking-widest flex items-center gap-1"><Lock size={8} /> {t('checkout.emailLocked') || 'Verified from your account'}</p>}
                      </div>

                    {/* Payment Mode */}
                    <div className="space-y-8">
                      <div className="flex items-center gap-3 border-b border-white/5 pb-2 inline-flex">
                        <h3 className="text-white text-[10px] font-black uppercase tracking-[0.4em]">{t('checkout.paymentTitle')}</h3>
                      </div>

                      <div className="grid grid-cols-1">
                        <div className="p-8 rounded-[2rem] border-2 border-indigo/40 bg-indigo/5 flex items-center justify-between group">
                          <div className="flex items-center gap-6">
                            <div className="w-14 h-14 rounded-2xl bg-indigo flex items-center justify-center text-white shadow-[0_0_30px_rgba(99,102,241,0.4)]">
                              <CreditCard size={28} />
                            </div>
                            <div>
                              <p className="text-sm font-black text-white uppercase tracking-widest">{t('checkout.cardPayment') || 'Kredi / Banka Kartı'}</p>
                              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter italic">{t('checkout.cardPaymentDesc') || 'Iyzico Güvenli Ödeme Altyapısı'}</p>
                            </div>
                          </div>
                          <div className="w-8 h-8 rounded-full bg-indigo flex items-center justify-center text-white">
                            <CheckCircle2 size={16} />
                          </div>
                        </div>
                      </div>

                      <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
                        <div className="flex items-center gap-3 text-emerald-500">
                          <ShieldCheck size={16} />
                          <p className="text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                            {t('checkout.securePaymentNote') || 'Ödemeniz Iyzico 3D Secure altyapısı ile güvenli şekilde işlenir.'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>

              {/* Right Column: Order Summary */}
              <div className="w-full lg:w-1/2 flex flex-col gap-8">
                <div className="space-y-8">
                  {/* Product Identity */}
                  <div className="flex items-center gap-6 p-6 bg-white/[0.02] border border-white/5 rounded-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-cyan/5 blur-3xl rounded-full translate-x-10 -translate-y-10" />
                    <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-white/10 relative z-10 bg-black/40 flex items-center justify-center">
                      {isProposalMode ? (
                        <Globe size={32} className="text-cyan" />
                      ) : (
                        <img
                          src={template?.image_url || template?.preview_image}
                          alt={template?.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0 relative z-10">
                      <div className="text-[10px] font-black text-indigo uppercase tracking-[0.3em] mb-1">{t('checkout.selectedArchitecture')}</div>
                      <h1 className="text-xl font-display font-black text-white truncate leading-none mb-2">
                        {isProposalMode ? t('checkout.customSaaSArchitecture') : template?.name}
                      </h1>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded bg-indigo/20 ${currentPlan.color} uppercase tracking-widest`}>
                          {subscriptionPlan}
                        </span>
                        <span className="text-[9px] font-black px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 uppercase tracking-widest italic">
                          {t('checkout.revisionsIncluded')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Maintenance Agreement */}
                  <div className={`p-6 rounded-2xl border transition-all duration-500 ${isMaintenanceActive ? 'bg-indigo/10 border-indigo/40 shadow-lg shadow-indigo-500/10' : 'bg-white/[0.02] border-white/5 hover:border-white/10'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${isMaintenanceActive ? 'bg-indigo text-white' : 'bg-white/5 text-gray-500'}`}>
                          <ShieldCheck size={20} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-sm font-black text-white uppercase tracking-tighter italic">{t('checkout.maintenanceTitle')}</h3>
                            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[7px] font-black text-emerald-500 uppercase tracking-widest">{t('checkout.noCommitment')}</span>
                          </div>
                          <p className="text-[10px] text-gray-500 font-medium italic">{t('checkout.maintenanceDesc')}</p>
                          <div className="mt-2 flex items-center gap-2">
                            <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${currentPlan.color} bg-white/5`}>{subscriptionPlan}</span>
                            <span className="text-indigo text-sm font-black">${maintenancePrice}<span className="text-[8px] text-gray-500 font-bold">/{t('checkout.maintenanceLabel')}</span></span>
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsMaintenanceActive(!isMaintenanceActive)}
                        className={`w-10 h-5 rounded-full transition-all relative ${isMaintenanceActive ? 'bg-indigo' : 'bg-white/10'}`}
                      >
                        <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${isMaintenanceActive ? 'left-6' : 'left-1'}`} />
                      </button>
                    </div>
                  </div>

                  {/* Extensions */}
                  {dynamicAddons.length > 0 && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Zap size={18} className="text-amber-500" />
                          <h2 className="text-[10px] font-black text-white uppercase tracking-[0.3em]">{t('checkout.extraServices')}</h2>
                        </div>
                        <div className="h-px flex-1 bg-gradient-to-r from-amber-500/20 to-transparent" />
                      </div>
                      <div className="flex flex-col gap-3">
                        {dynamicAddons.map((addon) => {
                          const lang = i18n.language;
                          const displayName = (lang === 'en' && addon.name_en) ? addon.name_en : (lang === 'de' && addon.name_de) ? addon.name_de : addon.name;
                          return (
                            <div
                              key={addon.id}
                              onClick={() => {
                                if (selectedAddons.includes(addon.id)) {
                                  setSelectedAddons(selectedAddons.filter(id => id !== addon.id));
                                } else {
                                  setSelectedAddons([...selectedAddons, addon.id]);
                                }
                              }}
                              className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col gap-1 ${selectedAddons.includes(addon.id) ? 'bg-amber-500/10 border-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.1)]' : 'bg-white/[0.02] border-white/5 hover:border-white/10'}`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-normal text-gray-400 uppercase tracking-wide leading-none">{displayName}</span>
                                <span className="text-sm font-normal text-gray-400">+${addon.price} {t('checkout.oneTime')}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Final Action */}
                  <div className="mt-8 pt-8 border-t border-white/5 space-y-6">
                    
                    {/* Legal Agreements */}
                    <div className="space-y-4 bg-white/[0.02] border border-white/5 p-6 rounded-[1.5rem]">
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-2 border-b border-white/5 pb-3">{t('checkoutAgreements.title')}</p>
                      
                      <label className="flex items-start gap-3 cursor-pointer group">
                        <div className="relative flex items-center justify-center mt-0.5 shrink-0">
                          <input type="checkbox" className="peer sr-only" checked={agreements.preInfo} onChange={(e) => setAgreements(prev => ({...prev, preInfo: e.target.checked}))} />
                          <div className="w-5 h-5 rounded border border-white/20 bg-white/5 peer-checked:bg-cyan peer-checked:border-cyan transition-all flex items-center justify-center">
                            <CheckCircle2 size={14} className="text-[#0c0c16] opacity-0 peer-checked:opacity-100" strokeWidth={4} />
                          </div>
                        </div>
                        <span className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors leading-snug">
                          <Trans 
                            i18nKey="checkoutAgreements.preInfoLabel" 
                            components={{ button: <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsPreInfoOpen(true); }} className="text-cyan font-semibold hover:underline underline-offset-2" /> }} 
                          />
                        </span>
                      </label>

                      <label className="flex items-start gap-3 cursor-pointer group">
                        <div className="relative flex items-center justify-center mt-0.5 shrink-0">
                          <input type="checkbox" className="peer sr-only" checked={agreements.distanceSelling} onChange={(e) => setAgreements(prev => ({...prev, distanceSelling: e.target.checked}))} />
                          <div className="w-5 h-5 rounded border border-white/20 bg-white/5 peer-checked:bg-cyan peer-checked:border-cyan transition-all flex items-center justify-center">
                            <CheckCircle2 size={14} className="text-[#0c0c16] opacity-0 peer-checked:opacity-100" strokeWidth={4} />
                          </div>
                        </div>
                        <span className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors leading-snug">
                          <Trans 
                            i18nKey="checkoutAgreements.distanceSellingLabel" 
                            components={{ a: <Link to="/mesafeli-satis-sozlesmesi" target="_blank" onClick={(e) => e.stopPropagation()} className="text-cyan font-semibold hover:underline underline-offset-2" /> }} 
                          />
                        </span>
                      </label>

                      <label className="flex items-start gap-3 cursor-pointer group">
                        <div className="relative flex items-center justify-center mt-0.5 shrink-0">
                          <input type="checkbox" className="peer sr-only" checked={agreements.noRefund} onChange={(e) => setAgreements(prev => ({...prev, noRefund: e.target.checked}))} />
                          <div className="w-5 h-5 rounded border border-white/20 bg-white/5 peer-checked:bg-cyan peer-checked:border-cyan transition-all flex items-center justify-center">
                            <CheckCircle2 size={14} className="text-[#0c0c16] opacity-0 peer-checked:opacity-100" strokeWidth={4} />
                          </div>
                        </div>
                        <span className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors leading-snug">
                          <Trans 
                            i18nKey="checkoutAgreements.noRefundLabel" 
                            components={{ a: <Link to="/iptal-ve-iade-kosullari" target="_blank" onClick={(e) => e.stopPropagation()} className="text-cyan font-semibold hover:underline underline-offset-2" /> }} 
                          />
                        </span>
                      </label>

                      {isMaintenanceActive && (
                        <label className="flex items-start gap-3 cursor-pointer group pt-3 border-t border-white/5 mt-1">
                          <div className="relative flex items-center justify-center mt-0.5 shrink-0">
                            <input type="checkbox" className="peer sr-only" checked={agreements.autoRenewal} onChange={(e) => setAgreements(prev => ({...prev, autoRenewal: e.target.checked}))} />
                            <div className="w-5 h-5 rounded border border-white/20 bg-white/5 peer-checked:bg-cyan peer-checked:border-cyan transition-all flex items-center justify-center">
                              <CheckCircle2 size={14} className="text-[#0c0c16] opacity-0 peer-checked:opacity-100" strokeWidth={4} />
                            </div>
                          </div>
                          <span className="text-xs text-amber-500/80 group-hover:text-amber-500 transition-colors leading-snug font-medium">
                            {t('checkoutAgreements.autoRenewalLabel')}
                          </span>
                        </label>
                      )}
                    </div>

                    <p className="text-[10px] text-gray-500 font-medium italic text-center max-w-sm mx-auto leading-relaxed">
                      {t('checkout.pricePolicyDesc')}
                    </p>

                    <button
                      type="button"
                      disabled={!isFormValid() || isProcessing || !allAgreementsAccepted}
                      onClick={handlePayment}
                      className="w-full bg-gradient-to-r from-indigo to-cyan hover:from-indigo-600 hover:to-cyan-600 text-white rounded-[2rem] p-1.5 transition-all shadow-2xl shadow-indigo/20 active:scale-[0.98] group disabled:opacity-50 disabled:grayscale"
                    >
                      <div className="bg-white/10 border border-white/10 rounded-[1.8rem] px-8 py-6 flex items-center justify-between backdrop-blur-md transition-colors group-hover:bg-white/20">
                        {isProcessing ? (
                          <div className="flex items-center gap-3 mx-auto">
                            <Loader2 size={24} className="animate-spin" />
                            <span className="text-sm font-black uppercase tracking-widest">{t('common.processing')}</span>
                          </div>
                        ) : (
                          <>
                            <div className="text-left">
                              <div className="text-[10px] font-black uppercase tracking-[0.3em] !text-white/60 mb-1">{t('checkout.acquisitionProtocol')}</div>
                              <div className="text-[11px] font-black uppercase tracking-[0.2em] !text-white">{t('checkout.completePayment')}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-4xl font-display font-black !text-white tracking-tighter leading-none">${totalAmount}</div>
                              <div className="text-[8px] font-bold uppercase tracking-tighter italic !text-white/40 mt-1">
                                {t('checkout.oneTimeInvestment')}
                                {isMaintenanceActive && <span className="block text-[7px] text-indigo/60 uppercase not-italic"> + ${maintenancePrice}/{t('checkout.maintenanceLabel')}</span>}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Success Protocol Overlay */}        <AnimatePresence>
          {paymentSuccess && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-start justify-center p-6 pt-24 bg-black/90 backdrop-blur-3xl overflow-y-auto custom-scrollbar"
            >
              {/* Immersive Modal Background Elements */}
              <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo/20 blur-[150px] rounded-full animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-cyan/10 blur-[150px] rounded-full animate-pulse duration-[4000ms]" />
              </div>

              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 30 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                className="w-full max-w-2xl bg-white/[0.02] border border-white/10 rounded-[3rem] overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.5)] relative my-8 backdrop-blur-md"
              >
                {/* Top Interactive Bar */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50" />
                
                <div className="p-8 md:p-12">
                  <div className="flex flex-col items-center text-center mb-10">
                    <div className="relative mb-6">
                      <div className="w-20 h-20 rounded-[2rem] bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shadow-[0_0_50px_rgba(16,185,129,0.15)]">
                        <CheckCircle2 size={36} className="animate-in zoom-in duration-700" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-4 border-[#0c0c16] animate-ping" />
                    </div>
                    
                    <h2 className="text-xl md:text-3xl font-display font-black italic tracking-tighter text-white mb-2 uppercase leading-none">
                      {t('checkout.paymentReceived') || 'ÖDEME BAŞARILI'}
                    </h2>
                    <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <p className="text-gray-400 text-[9px] font-black uppercase tracking-[0.3em]">
                        {t('checkout.orderCreatedDesc') || 'SİPARİŞ OLUŞTURULDU'}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Payment Amount */}
                    <div className="group relative p-8 rounded-[2.5rem] bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 text-center overflow-hidden transition-all hover:border-emerald-500/30">
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                      <div className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] mb-3 relative z-10 opacity-70">
                        {t('checkout.transferAmount') || 'ÖDENEN TUTAR'}
                      </div>
                      <div className="text-5xl md:text-7xl font-display font-black text-white tracking-tighter leading-none relative z-10 flex items-center justify-center gap-2">
                        <span className="text-2xl md:text-3xl text-emerald-500 mt-4">$</span>
                        {totalAmount}
                      </div>
                      {isMaintenanceActive && (
                        <div className="inline-block mt-3 px-3 py-1 rounded-full bg-indigo/10 border border-indigo/20 text-[9px] text-indigo font-black uppercase tracking-widest relative z-10">
                          + ${maintenancePrice}/{t('checkout.maintenanceLabel')}
                        </div>
                      )}
                    </div>

                    {/* Order Reference */}
                    <div className="p-6 rounded-[2rem] bg-amber-500/[0.02] border border-amber-500/10 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-[40px] rounded-full translate-x-10 -translate-y-10 group-hover:bg-amber-500/10 transition-colors" />
                      <div className="text-[9px] font-black text-amber-500/60 uppercase tracking-[0.4em] mb-3">{t('checkout.referenceDesc') || 'SİPARİŞ REFERANSI'}</div>
                      <div className="flex items-center justify-between gap-4 relative z-10">
                        <div className="flex flex-col">
                          <code className="text-2xl md:text-3xl font-mono font-black text-amber-500 tracking-tighter bg-amber-500/10 px-4 py-2 rounded-xl border border-amber-500/20">
                            {orderId?.slice(0, 8)}
                          </code>
                          <p className="text-[8px] text-amber-500/40 font-bold uppercase tracking-widest mt-2 px-1">ORDER_REF_ID</p>
                        </div>
                        <button 
                          onClick={() => copyToClipboard(orderId?.slice(0, 8), 'ref')}
                          className="h-14 px-6 rounded-xl bg-amber-500 text-black text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-amber-500/20"
                        >
                          {copied ? '✓ COPIED' : t('checkout.copyReference')}
                        </button>
                      </div>
                    </div>

                    {/* Footer Info */}
                    <div className="flex items-center justify-center gap-3 p-4 opacity-50">
                      <ShieldCheck size={14} className="text-emerald-500" />
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] italic">{t('checkout.securePaymentComplete') || 'GÜVENLİ ÖDEME TAMAMLANDI'}</p>
                    </div>
                  </div>

                  {/* Enhanced Navigation */}
                  <div className="mt-10 space-y-3">
                    <button 
                      onClick={() => navigate(`/order-success/${orderId}`)}
                      className="w-full h-16 rounded-2xl bg-indigo text-white text-[11px] font-black uppercase tracking-[0.4em] hover:shadow-[0_0_40px_rgba(99,102,241,0.3)] transition-all active:scale-[0.98] flex items-center justify-center gap-3 group"
                    >
                      {t('checkout.fillBrandDetails') || 'MARKA KİMLİĞİNİ BAŞLAT'}
                      <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </button>
                    
                    <button 
                      onClick={() => navigate('/dashboard')}
                      className="w-full h-14 rounded-2xl bg-white/[0.03] border border-white/5 text-gray-500 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white/5 hover:text-white transition-all flex items-center justify-center gap-3"
                    >
                      {t('checkout.goToDashboard') || 'PANELE DÖN'}
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pre-Info Modal */}
        <PreInfoModal isOpen={isPreInfoOpen} onClose={() => setIsPreInfoOpen(false)} />
      </div>
    </div>
  );
};

export default CheckoutPage;

