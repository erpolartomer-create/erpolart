import React, { useState, useCallback, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from '../components/Toast';
import useAuthStore from '../store/authStore';
import { supabase } from '../lib/supabase';
import {
  CheckCircle2,
  Palette,
  Camera,
  Globe,
  MessageSquare,
  ArrowRight,
  Upload,
  X,
  Plus,
  Rocket,
  AlertCircle,
  History,
  Lock,
  Loader2,
  Sparkles,
  Languages,
  PackageCheck,
  CalendarClock,
  Edit3,
  CreditCard,
  Wrench,
  Clock,
  Hash,
  ShieldCheck
} from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import { uploadToStorage } from '../services/storageService';

const OrderSuccessPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isInitialized } = useAuthStore();

  const [logo, setLogo] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [editCount, setEditCount] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [loading, setLoading] = useState(true);
  const [fileError, setFileError] = useState(null);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [orderStatus, setOrderStatus] = useState('pending');
  const [addonConfigs, setAddonConfigs] = useState({
    chatbotContext: '',
    targetLanguages: ''
  });

  const [formData, setFormData] = useState({
    brandName: '',
    primaryColor: '#5c73ff',
    secondaryColor: '#00d1ff',
    notes: ''
  });

  const location = useLocation();

  // Revizyon limiti — tüm kontroller (yükleme/kaydetme/kilit) tek kaynaktan.
  const MAX_REVISIONS = 5;

  // ADIM 2.1: Backend'den Veri Çekme
  // ÖNEMLİ: PayTR tam-sayfa redirect'i sonrası taze yüklemede oturum kurtarma
  // asenkron tamamlanır. Sahiplik kontrolünü auth HAZIR olana kadar bekletmeliyiz;
  // yoksa user henüz null iken sipariş sahipli olduğu için '/'a atıyordu.
  useEffect(() => {
    if (!isInitialized) return; // oturum kurtarılana kadar bekle
    const fetchConfig = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.from('orders').select('*').eq('id', id).eq('project_code', 'erpolart').single();
        if (error) throw error;
        if (data) {
          // Sahiplik: guest sipariş (user_id yok) herkese açık; sahipli sipariş
          // sadece sahibine. Auth artık hazır olduğu için user güvenilir.
          const orderBelongsToUser = !data.user_id || (user?.id && data.user_id === user.id);
          if (!orderBelongsToUser) {
            navigate('/');
            return;
          }
          setFormData({
            brandName: data.brand_name || '',
            primaryColor: data.brand_colors?.primary || '#5c73ff',
            secondaryColor: data.brand_colors?.secondary || '#00d1ff',
            notes: data.project_notes || ''
          });
          setLogo(data.logo_url || null);
          setEditCount(data.edit_count || 0);
          setSelectedAddons(data.selected_addons || []);
          setAddonConfigs({
            chatbotContext: data.addon_configs?.chatbotContext || '',
            targetLanguages: data.addon_configs?.targetLanguages || ''
          });
          setOrderStatus(data.status || 'pending');
        }
      } catch (err) {
        console.error('Failed to load order configuration:', err);
        if (err.response?.status === 401) {
          navigate('/login', { state: { from: location } });
          return;
        }
        toast.error(t('common.architectureNotFound'));
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
    window.scrollTo(0, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, navigate, isInitialized, user?.id]);

  // Ödeme sonrası durum polling — PayTR callback siparişi 'paid' yapana kadar
  // (kullanıcı callback'ten önce sayfaya ulaşmış olabilir). Ödeme öncesi durumlarda ~60sn izle.
  useEffect(() => {
    const waitingStatuses = ['pending'];
    if (!waitingStatuses.includes(orderStatus)) return;
    let attempts = 0;
    const interval = setInterval(async () => {
      attempts += 1;
      try {
        const { data } = await supabase.from('orders').select('status').eq('id', id).eq('project_code', 'erpolart').single();
        if (data?.status && !waitingStatuses.includes(data.status)) {
          setOrderStatus(data.status); // 'paid' / 'active' vb. → durum güncellenir
          clearInterval(interval);
        }
      } catch { /* sessizce yut */ }
      if (attempts >= 20) clearInterval(interval); // 20 × 3sn = 60sn
    }, 3000);
    return () => clearInterval(interval);
  }, [orderStatus, id]);

  // Sekme yeniden görünür/odaklanınca bu siparişin durumunu tazele — admin
  // 'development'/'revision'/'active' yapınca müşteri sayfayı yenilemeden görür.
  useEffect(() => {
    const refresh = async () => {
      if (document.visibilityState !== 'visible') return;
      try {
        const { data } = await supabase.from('orders').select('status').eq('id', id).eq('project_code', 'erpolart').single();
        if (data?.status) setOrderStatus(data.status);
      } catch { /* sessizce yut */ }
    };
    document.addEventListener('visibilitychange', refresh);
    window.addEventListener('focus', refresh);
    return () => {
      document.removeEventListener('visibilitychange', refresh);
      window.removeEventListener('focus', refresh);
    };
  }, [id]);

  // Handle unsaved changes warning
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  // Clear file error after 5 seconds
  useEffect(() => {
    if (fileError) {
      const timer = setTimeout(() => setFileError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [fileError]);

  const onDrop = useCallback((e) => {
    if (editCount >= MAX_REVISIONS) return;
    e.preventDefault();
    const file = e.dataTransfer.files[0];

    // File size check (5MB = 5 * 1024 * 1024 bytes)
    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    if (file && file.size > MAX_FILE_SIZE) {
      setFileError(t('orderSuccess.form.fileLimitError'));
      return;
    }

    if (file && (file.type === "image/png" || file.type === "image/svg+xml")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogo(e.target.result);
        setIsDirty(true);
        setFileError(null);
      };
      reader.readAsDataURL(file);
    } else {
      toast.warning(t('orderSuccess.form.alertLogo'));
    }
  }, [editCount, t]);

  const handleFileSelect = (e) => {
    if (editCount >= MAX_REVISIONS) return;
    const file = e.target.files[0];

    // File size check (5MB = 5 * 1024 * 1024 bytes)
    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    if (file && file.size > MAX_FILE_SIZE) {
      setFileError(t('orderSuccess.form.fileLimitError'));
      // Clear input value so same file can be selected again if needed
      e.target.value = '';
      return;
    }

    if (file && (file.type === "image/png" || file.type === "image/svg+xml")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogo(e.target.result);
        setIsDirty(true);
        setFileError(null);
      };
      reader.readAsDataURL(file);
    } else {
      toast.warning(t('orderSuccess.form.alertLogo'));
    }
  };

  // ADIM 2.3: Kaydetme (Submit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editCount >= MAX_REVISIONS) return;

    setSubmitting(true);
    try {
      let finalLogoUrl = logo;

      // Eğer logo hala Base64 formatındaysa (yeni yüklenmişse), Supabase Storage'a atalım
      if (logo && logo.startsWith('data:image')) {
        const fileName = `logo_${Date.now()}.png`;
        const path = `orders/${id}/${fileName}`;
        finalLogoUrl = await uploadToStorage('logos', path, logo);
      }

      const { data, error } = await supabase.from('orders').update({
        brand_name: formData.brandName,
        project_notes: formData.notes,
        brand_colors: {
          primary: formData.primaryColor,
          secondary: formData.secondaryColor
        },
        logo_url: finalLogoUrl,
        edit_count: editCount + 1,
        addon_configs: addonConfigs
      }).eq('id', id).eq('project_code', 'erpolart').select().single();
      
      if (error) throw error;
      setEditCount(data.edit_count);
      setShowSuccess(true);
      setIsDirty(false);

      // Update local logo state with the permanent URL
      setLogo(finalLogoUrl);

      setTimeout(() => {
        setShowSuccess(false);
        navigate('/dashboard');
      }, 2500);
    } catch (err) {
      console.error('Save configuration error:', err);
      const serverMsg = err.response?.data?.message;
      toast.error(`${t('orderSuccess.form.saveError') || "Sync Failed"}${serverMsg ? `: ${serverMsg}` : ""}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-deep-black flex flex-col items-center justify-center gap-6">
      <div className="relative">
        <Loader2 className="text-indigo animate-spin" size={48} strokeWidth={1} />
        <div className="absolute inset-0 bg-indigo/20 blur-xl rounded-full animate-pulse" />
      </div>
      <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.5em] animate-pulse">Establishing Secure Node Connection</p>
    </div>
  );

  const isLocked = editCount >= MAX_REVISIONS;
  const revisionsLeft = Math.max(0, MAX_REVISIONS - editCount);

  // Sipariş ilerleme adımları (PayTR akışı) — Ödeme → Geliştirme → Yayında.
  const STEPS = [
    { key: 'paid',        label: t('orderSuccess.steps.paid') || 'Ödendi',          icon: CreditCard },
    { key: 'development', label: t('orderSuccess.steps.development') || 'Geliştirme', icon: Wrench },
    { key: 'active',      label: t('orderSuccess.steps.active') || 'Yayında',        icon: Rocket },
  ];
  // Kaç adım tamamlandı: pending=0, paid=1, development/revision=2, active=3
  const STATUS_PROGRESS = { pending: 0, paid: 1, development: 2, revision: 2, active: 3, failed: 0 };
  const progress = STATUS_PROGRESS[orderStatus] ?? 0;
  const isFailed = orderStatus === 'failed';
  const isPending = orderStatus === 'pending';
  const shortId = (id || '').split('-')[0].toUpperCase();

  // Durum rozeti — PayTR yaşam döngüsü (IBAN yok):
  // pending → paid → development → revision → active  (+ failed)
  const BADGE_COLORS = {
    emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-500', dot: 'bg-emerald-500', shadow: 'shadow-[0_0_20px_rgba(16,185,129,0.15)]' },
    indigo:  { bg: 'bg-indigo/10',      border: 'border-indigo/20',      text: 'text-indigo',      dot: 'bg-indigo',      shadow: '' },
    rose:    { bg: 'bg-rose-500/10',    border: 'border-rose-500/20',    text: 'text-rose-500',    dot: 'bg-rose-500',    shadow: 'shadow-[0_0_20px_rgba(244,63,94,0.15)]' },
    amber:   { bg: 'bg-amber-500/10',   border: 'border-amber-500/20',   text: 'text-amber-500',   dot: 'bg-amber-500',   shadow: 'shadow-[0_0_20px_rgba(245,158,11,0.15)]' },
    red:     { bg: 'bg-red-500/10',     border: 'border-red-500/20',     text: 'text-red-500',     dot: 'bg-red-500',     shadow: 'shadow-[0_0_20px_rgba(239,68,68,0.15)]' },
  };
  const STATUS_BADGES = {
    paid:        { color: 'emerald', ping: true,  label: t('customerDashboard.status.paid') || 'ÖDENDİ' },
    active:      { color: 'emerald', ping: true,  label: t('customerDashboard.status.active') || 'AKTİF SİSTEM' },
    development: { color: 'indigo',  ping: true,  label: t('customerDashboard.status.development') || 'KURULUM AŞAMASINDA' },
    revision:    { color: 'rose',    ping: true,  label: t('customerDashboard.status.revision') || 'REVİZYON' },
    failed:      { color: 'red',     ping: false, label: t('customerDashboard.status.failed') || 'ÖDEME BAŞARISIZ' },
    pending:     { color: 'amber',   ping: false, label: t('customerDashboard.status.pending') || 'ÖDEME BEKLENİYOR' },
  };
  const badge = STATUS_BADGES[orderStatus] || { color: 'indigo', ping: true, label: t('orderSuccess.celebration') };
  const bc = BADGE_COLORS[badge.color];

  return (
    <div className="bg-deep-black min-h-screen pt-28 sm:pt-32 md:pt-40 pb-20 sm:pb-24 relative overflow-hidden selection:bg-indigo selection:text-white transition-colors duration-500">
      <Helmet>
        <title>Sipariş Başarılı - ErpolArt</title>
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      {/* Background grid + ambient glows */}
      <div className="absolute inset-0 bg-[linear-gradient(var(--grid-color)_1px,transparent_1px),linear-gradient(90deg,var(--grid-color)_1px,transparent_1px)] bg-[size:40px_40px] sm:bg-[size:50px_50px] pointer-events-none opacity-50" />
      <div className="absolute top-0 right-0 w-[80vw] h-[80vw] max-w-[700px] max-h-[700px] bg-indigo/5 rounded-full blur-[120px] -translate-y-1/3 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[70vw] h-[70vw] max-w-[600px] max-h-[600px] bg-cyan/5 rounded-full blur-[120px] translate-y-1/3 -translate-x-1/3 pointer-events-none" />

      <div className="container mx-auto px-5 sm:px-6 lg:px-12 relative z-10 max-w-3xl">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-8 sm:mb-10 animate-in fade-in slide-in-from-top-6 duration-700">
          <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full ${bc.bg} border ${bc.border} ${bc.text} text-[9px] sm:text-[10px] font-black uppercase tracking-[0.25em] mb-5 ${bc.shadow}`}>
            <span className="relative flex h-2 w-2">
              <span className={`${badge.ping ? 'animate-ping' : 'animate-pulse'} absolute inline-flex h-full w-full rounded-full ${bc.dot} opacity-75`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${bc.dot}`}></span>
            </span>
            {badge.label}
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-black text-white italic tracking-tight mb-3 leading-[0.95]">
            <span className="block">{t('orderSuccess.title')}</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo via-white to-cyan drop-shadow-2xl block">{t('orderSuccess.titleAccent')}</span>
          </h1>
          <p className="text-muted-text font-medium max-w-md leading-relaxed text-xs sm:text-sm mb-4">
            {t('orderSuccess.subtitle')}
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/5 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-muted-text">
            <Hash size={11} className="text-indigo" />
            <span>Order</span>
            <span className="text-white font-mono">{shortId}</span>
          </div>
        </div>

        {/* Order Progress Stepper / Failed banner */}
        {isFailed ? (
          <div className="w-full mb-8 sm:mb-10 p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-red-500/5 border border-red-500/20 flex items-start gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 shrink-0"><AlertCircle size={18} /></div>
            <div>
              <h4 className="text-white text-sm font-black uppercase tracking-tight mb-1">{t('customerDashboard.status.failed') || 'ÖDEME BAŞARISIZ'}</h4>
              <p className="text-muted-text text-xs leading-relaxed mb-3">{t('orderSuccess.failedDesc') || 'Ödeme tamamlanamadı. Tekrar denemek için bizimle iletişime geçebilir veya yeniden sipariş oluşturabilirsin.'}</p>
              <Link to="/contact" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-red-400 hover:text-red-300 transition-colors">
                {t('orderSuccess.contactCta') || 'İletişime Geç'} <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        ) : (
          <div className="w-full mb-10 sm:mb-12 px-1 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-start">
              {STEPS.map((step, i) => {
                const done = progress >= i + 1;
                const current = i === progress;
                const Icon = step.icon;
                return (
                  <React.Fragment key={step.key}>
                    <div className="flex flex-col items-center gap-2 shrink-0 w-16 sm:w-20">
                      <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center border transition-all duration-500 ${done ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400' : current ? 'bg-indigo/15 border-indigo/40 text-indigo shadow-[0_0_20px_rgba(92,115,255,0.25)]' : 'bg-white/[0.03] border-white/5 text-gray-600'}`}>
                        {done ? <CheckCircle2 size={18} /> : <Icon size={18} className={current ? 'animate-pulse' : ''} />}
                      </div>
                      <span className={`text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-center leading-tight ${done ? 'text-emerald-400' : current ? 'text-indigo' : 'text-gray-600'}`}>{step.label}</span>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div className="flex-1 h-0.5 rounded-full bg-white/5 mt-[22px] sm:mt-6 overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-700 ${progress > i + 1 ? 'w-full bg-emerald-500/50' : progress === i + 1 ? 'w-1/2 bg-indigo/50' : 'w-0'}`} />
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
            {isPending && (
              <p className="text-center text-amber-500/90 text-[10px] font-bold uppercase tracking-widest mt-5 flex items-center justify-center gap-2">
                <Clock size={12} /> {t('customerDashboard.status.pending') || 'ÖDEME BEKLENİYOR'}
              </p>
            )}
          </div>
        )}

        {/* What happens next */}
        <div className="w-full mb-8 sm:mb-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
          <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.35em] text-gray-600 mb-4 text-center">{t('orderSuccess.deliveryInfo.title')}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {/* Code Delivery Card */}
            <div className="group p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-surface border border-white/5 flex items-start gap-4 hover:border-cyan/20 transition-colors duration-500 relative overflow-hidden">
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-cyan/5 blur-[60px] rounded-full translate-x-1/2 translate-y-1/2 group-hover:bg-cyan/10 transition-colors duration-700" />
              <div className="w-10 h-10 rounded-xl bg-cyan/10 flex items-center justify-center text-cyan shrink-0">
                <PackageCheck size={18} />
              </div>
              <div className="relative z-10">
                <h4 className="text-white text-xs sm:text-[13px] font-black uppercase tracking-wide mb-1.5">{t('orderSuccess.deliveryInfo.codeDelivery')}</h4>
                <p className="text-muted-text text-[11px] sm:text-xs leading-relaxed">{t('orderSuccess.deliveryInfo.codeDeliveryDesc')}</p>
              </div>
            </div>
            {/* Subscription Card */}
            <div className="group p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-surface border border-white/5 flex items-start gap-4 hover:border-indigo/20 transition-colors duration-500 relative overflow-hidden">
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-indigo/5 blur-[60px] rounded-full translate-x-1/2 translate-y-1/2 group-hover:bg-indigo/10 transition-colors duration-700" />
              <div className="w-10 h-10 rounded-xl bg-indigo/10 flex items-center justify-center text-indigo shrink-0">
                <CalendarClock size={18} />
              </div>
              <div className="relative z-10">
                <h4 className="text-white text-xs sm:text-[13px] font-black uppercase tracking-wide mb-1.5">{t('orderSuccess.deliveryInfo.subscription')}</h4>
                <p className="text-muted-text text-[11px] sm:text-xs leading-relaxed">{t('orderSuccess.deliveryInfo.subscriptionDesc')}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center">
          {/* Setup Form */}
          <div className="w-full">
            <div className="p-5 sm:p-8 md:p-10 rounded-3xl sm:rounded-[2.5rem] bg-surface border border-white/5 shadow-2xl relative overflow-hidden group">
              {/* Internal Accent Background */}
              <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo/5 blur-[100px] rounded-full translate-x-1/2 translate-y-1/2 group-hover:bg-indigo/10 transition-colors duration-1000 pointer-events-none" />

              <div className="relative z-10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 sm:mb-10 pb-6 border-b border-white/5 gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-indigo/10 flex items-center justify-center text-indigo shadow-inner shrink-0">
                      <Palette size={22} />
                    </div>
                    <div>
                      <h3 className="text-white text-base sm:text-lg font-black italic tracking-tight uppercase leading-tight">{t('orderSuccess.form.setupTitle') || 'Marka Kurulumu'}</h3>
                      <div className="flex items-center gap-1.5 text-[10px] text-muted-text font-bold uppercase tracking-widest mt-0.5">
                        <ShieldCheck size={11} className="text-cyan" />
                        {t('orderSuccess.form.manualReview')}
                      </div>
                    </div>
                  </div>

                  {/* Revision counter */}
                  <div className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl border self-start sm:self-auto ${isLocked ? 'bg-red-500/5 border-red-500/20' : 'bg-white/[0.03] border-white/5'}`}>
                    <div className="flex gap-1.5">
                      {[...Array(MAX_REVISIONS)].map((_, i) => (
                        <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${editCount > i ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-emerald-500/60'}`} />
                      ))}
                    </div>
                    <span className={`text-[9px] font-black uppercase tracking-widest whitespace-nowrap ${isLocked ? 'text-red-500' : 'text-muted-text'}`}>
                      {isLocked ? (t('orderSuccess.form.editLimitReached') || 'LİMİT DOLDU') : `${revisionsLeft} ${t('orderSuccess.form.revisionsWord') || 'REVİZYON'}`}
                    </span>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8 sm:space-y-10">
                  {/* Inputs Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 flex items-center gap-2">
                        <Globe size={12} className="text-indigo" />
                        {t('orderSuccess.form.brandName')}
                      </label>
                      <input
                        type="text"
                        placeholder={t('orderSuccess.form.brandNamePlaceholder')}
                        disabled={isLocked}
                        value={formData.brandName}
                        onChange={(e) => { setFormData({ ...formData, brandName: e.target.value }); setIsDirty(true); }}
                        className="w-full bg-deep-black/50 border border-white/5 rounded-2xl px-6 py-4 text-white text-sm font-medium focus:border-indigo transition-all outline-none placeholder:text-white/20 italic disabled:opacity-30 disabled:grayscale transition-all"
                      />
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 flex items-center gap-2">
                        <Camera size={12} className="text-indigo" />
                        {t('orderSuccess.form.uploadLogo')}
                      </label>
                      <div
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={onDrop}
                        onClick={() => document.getElementById('logo-upload').click()}
                        className={`w-full bg-deep-black/50 border-2 border-dashed rounded-2xl p-4 flex items-center gap-4 cursor-pointer transition-all hover:bg-white/5 ${isLocked ? 'opacity-20 cursor-not-allowed border-white/5 grayscale' : 'border-white/10 hover:border-indigo'}`}
                      >
                        <input id="logo-upload" type="file" hidden onChange={handleFileSelect} disabled={isLocked} accept=".png,.svg" />
                        <div className="w-12 h-12 rounded-xl bg-surface border border-white/5 flex items-center justify-center shrink-0 overflow-hidden relative group/logo">
                          {logo ? (
                            <>
                              <img src={logo} alt="Müşteri Marka Logosu" className="w-full h-full object-contain p-2" />
                              {!isLocked && (
                                <div className="absolute inset-0 bg-red-500/80 opacity-0 group-hover/logo:opacity-100 flex items-center justify-center text-white transition-opacity"
                                  onClick={(e) => { e.stopPropagation(); setLogo(null); setIsDirty(true); }}>
                                  <X size={14} />
                                </div>
                              )}
                            </>
                          ) : (
                            <Plus size={16} className="text-gray-500" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] text-white font-bold truncate tracking-tight">{logo ? 'VECTOR INTEGRATED' : t('orderSuccess.form.nullEntity')}</p>
                          <p className="text-[8px] text-gray-500 uppercase font-black tracking-widest truncate">{t('orderSuccess.form.uploadHint').split('.')[0]}</p>
                        </div>
                        <Upload size={14} className="text-gray-500 group-hover:text-indigo transition-colors" />
                      </div>
                    </div>
                  </div>

                  {/* Brand Colors */}
                  <div className="space-y-5">
                    <div className="flex items-center gap-3">
                      <div className="h-px flex-grow bg-white/5" />
                      <span className="text-[9px] font-black uppercase tracking-[0.35em] text-gray-600">{t('orderSuccess.form.colors')}</span>
                      <div className="h-px flex-grow bg-white/5" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <button
                        type="button"
                        disabled={isLocked}
                        onClick={() => !isLocked && document.getElementById('primary-color').click()}
                        className="flex items-center gap-4 p-4 rounded-2xl bg-deep-black/40 border border-white/5 hover:border-indigo/40 transition-all text-left disabled:opacity-40 disabled:grayscale disabled:cursor-not-allowed"
                      >
                        <div className="w-12 h-12 rounded-xl border-2 border-white/10 shrink-0 shadow-lg" style={{ backgroundColor: formData.primaryColor }} />
                        <div className="min-w-0">
                          <p className="text-[10px] text-white font-black uppercase tracking-wide">{t('orderSuccess.form.primaryColor') || 'Ana Renk'}</p>
                          <code className="text-[11px] text-muted-text font-mono">{formData.primaryColor.toUpperCase()}</code>
                        </div>
                        <input
                          id="primary-color"
                          type="color"
                          value={formData.primaryColor}
                          disabled={isLocked}
                          onChange={(e) => { setFormData({ ...formData, primaryColor: e.target.value }); setIsDirty(true); }}
                          className="sr-only"
                        />
                      </button>

                      <button
                        type="button"
                        disabled={isLocked}
                        onClick={() => !isLocked && document.getElementById('secondary-color').click()}
                        className="flex items-center gap-4 p-4 rounded-2xl bg-deep-black/40 border border-white/5 hover:border-cyan/40 transition-all text-left disabled:opacity-40 disabled:grayscale disabled:cursor-not-allowed"
                      >
                        <div className="w-12 h-12 rounded-xl border-2 border-white/10 shrink-0 shadow-lg" style={{ backgroundColor: formData.secondaryColor }} />
                        <div className="min-w-0">
                          <p className="text-[10px] text-white font-black uppercase tracking-wide">{t('orderSuccess.form.secondaryColor') || 'İkincil Renk'}</p>
                          <code className="text-[11px] text-muted-text font-mono">{formData.secondaryColor.toUpperCase()}</code>
                        </div>
                        <input
                          id="secondary-color"
                          type="color"
                          value={formData.secondaryColor}
                          disabled={isLocked}
                          onChange={(e) => { setFormData({ ...formData, secondaryColor: e.target.value }); setIsDirty(true); }}
                          className="sr-only"
                        />
                      </button>
                    </div>
                  </div>

                    {/* Revision Requests */}
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo flex items-center gap-2">
                        <Edit3 size={12} className="text-indigo" />
                        {t('orderSuccess.form.revisionTitle')}
                      </label>
                      <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest -mt-1">
                        {t('orderSuccess.form.notes')}
                      </p>
                      <textarea
                        rows="5"
                        disabled={isLocked}
                        value={formData.notes}
                        onChange={(e) => { setFormData({ ...formData, notes: e.target.value }); setIsDirty(true); }}
                        placeholder={t('orderSuccess.form.revisionPlaceholder')}
                        className="w-full bg-indigo/5 border border-indigo/10 rounded-2xl sm:rounded-3xl px-5 sm:px-6 py-4 sm:py-5 text-white text-sm font-medium focus:border-indigo transition-all outline-none placeholder:text-white/20 italic resize-none custom-scrollbar disabled:opacity-30 disabled:grayscale"
                      />
                    </div>

                    {/* Dynamic Addon Configurations */}
                  {selectedAddons.length > 0 && (
                    <div className="space-y-10 pt-8 border-t border-white/5">
                      <div className="flex items-center gap-3">
                        <span className="text-[9px] font-black uppercase tracking-[0.4em] text-indigo">{t('orderSuccess.form.addonsTitle')}</span>
                        <div className="h-px flex-grow bg-indigo/10" />
                      </div>

                      <div className="grid grid-cols-1 gap-8">
                        {selectedAddons.includes('chatbot') && (
                          <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 flex items-center gap-2">
                              <Sparkles size={12} className="text-violet" />
                              {t('orderSuccess.form.aiContextLabel')}
                            </label>
                            <textarea
                              rows="4"
                              disabled={isLocked}
                              value={addonConfigs.chatbotContext}
                              onChange={(e) => { setAddonConfigs({ ...addonConfigs, chatbotContext: e.target.value }); setIsDirty(true); }}
                              placeholder={t('orderSuccess.form.aiContextPlaceholder')}
                              className="w-full bg-violet/5 border border-violet/10 rounded-2xl sm:rounded-3xl px-5 sm:px-6 py-4 sm:py-5 text-white text-sm font-medium focus:border-violet transition-all outline-none placeholder:text-white/20 italic resize-none custom-scrollbar disabled:opacity-30 disabled:grayscale"
                            />
                          </div>
                        )}

                        {selectedAddons.includes('language') && (
                          <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 flex items-center gap-2">
                              <Languages size={12} className="text-cyan" />
                              {t('orderSuccess.form.targetLanguagesLabel')}
                            </label>
                            <input
                              type="text"
                              disabled={isLocked}
                              value={addonConfigs.targetLanguages}
                              onChange={(e) => { setAddonConfigs({ ...addonConfigs, targetLanguages: e.target.value }); setIsDirty(true); }}
                              placeholder={t('orderSuccess.form.targetLanguagesPlaceholder')}
                              className="w-full bg-cyan/5 border border-cyan/10 rounded-2xl px-6 py-4 text-white text-sm font-medium focus:border-cyan transition-all outline-none placeholder:text-white/20 italic disabled:opacity-30 disabled:grayscale transition-all"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="pt-6 relative">
                    <button
                      disabled={submitting || isLocked}
                      type="submit"
                      className={`w-full py-5 sm:py-6 rounded-2xl sm:rounded-[2rem] font-black text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.4em] transition-all flex items-center justify-center gap-3 relative overflow-hidden group shadow-[0_15px_40px_-5px_rgba(92,115,255,0.4)] disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed transform active:scale-[0.98] ${showSuccess ? 'bg-emerald-500 shadow-emerald-500/40' : 'bg-indigo text-white'}`}
                    >
                      <span className="relative z-10 flex items-center gap-3 font-black italic leading-none pt-0.5">
                        {submitting ? (
                          <>
                            <Loader2 size={16} className="animate-spin" />
                            {t('orderSuccess.form.submitting')}
                          </>
                        ) : showSuccess ? (
                          <>
                            <CheckCircle2 size={16} />
                            AUTHENTICATED
                          </>
                        ) : isLocked ? (
                          <>
                            <Lock size={16} />
                            LIMIT_REACHED
                          </>
                        ) : (
                          <>
                            <Rocket size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            {t('orderSuccess.form.submit')}
                          </>
                        )}
                      </span>
                      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                    </button>

                    {showSuccess && (
                      <div className="absolute -top-12 left-0 w-full flex justify-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="px-5 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-[0.3em]">
                          {t('orderSuccess.form.saveSuccess')}
                        </div>
                      </div>
                    )}

                    {fileError && (
                      <div className="absolute -top-20 left-0 w-full flex justify-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="px-6 py-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold italic max-w-md text-center shadow-2xl backdrop-blur-md">
                          <div className="flex items-center gap-2 mb-1 justify-center">
                            <AlertCircle size={14} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Architectural Alert</span>
                          </div>
                          <p className="text-gray-500 text-[10px] italic leading-relaxed">
                            Each modification request uses one revision credit. Once 5 credits are consumed, the architecture is locked for final engineering.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
