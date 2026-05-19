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
  Languages
} from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import { uploadToStorage } from '../services/storageService';

const OrderSuccessPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();

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

  // ADIM 2.1: Backend'den Veri Çekme
  useEffect(() => {
    const fetchConfig = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.from('orders').select('*').eq('id', id).eq('project_code', 'erpolart').single();
        if (error) throw error;
        if (data) {
          // Ownership check: prevent accessing other users' orders
          if (data.user_id && user?.id && data.user_id !== user.id) {
            navigate('/dashboard');
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
  }, [id, navigate]);

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
    if (editCount >= 3) return;
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
    if (editCount >= 3) return;
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
    if (editCount >= 3) return;

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

  const isLocked = editCount >= 5;

  return (
    <div className="bg-deep-black min-h-screen pt-40 pb-24 relative overflow-hidden selection:bg-indigo selection:text-white transition-colors duration-500">
      <Helmet>
        <title>Sipariş Başarılı - ErpolArt</title>
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      {/* SaaS-Style Background System */}
      <div className="absolute inset-0 bg-[linear-gradient(var(--grid-color)_1px,transparent_1px),linear-gradient(90deg,var(--grid-color)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none opacity-50" />

      {/* Decorative Ambient element */}
      <div className="absolute top-1/4 right-0 w-[60vw] h-[60vw] bg-indigo/5 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

      <div className="container mx-auto px-6 lg:px-12 relative z-10 max-w-7xl">
        {/* Celebration Header */}
        <div className="flex flex-col items-center text-center mb-12 animate-in fade-in slide-in-from-top-10 duration-1000">
          {orderStatus === 'active' ? (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-[0.3em] mb-6 shadow-[0_0_20px_rgba(16,185,129,0.15)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              {t('customerDashboard.status.active') || 'SİPARİŞ ONAYLANDI'}
            </div>
          ) : orderStatus === 'awaiting_transfer' ? (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-black uppercase tracking-[0.3em] mb-6 shadow-[0_0_20px_rgba(245,158,11,0.15)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              {t('customerDashboard.status.pending') || 'ÖDEME BEKLENİYOR'}
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo/10 border border-indigo/20 text-indigo text-[10px] font-black uppercase tracking-[0.3em] mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo"></span>
              </span>
              {t('orderSuccess.celebration')}
            </div>
          )}

          <h1 className="text-4xl md:text-7xl font-display font-black text-white italic tracking-tight mb-4 leading-[0.9] py-2 flex flex-col items-center text-center">
            <span className="block">{t('orderSuccess.title')}</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo via-white to-cyan drop-shadow-2xl pr-4 block">{t('orderSuccess.titleAccent')}</span>
          </h1>
          <p className="text-gray-500 font-medium italic max-w-2xl leading-relaxed text-[10px] opacity-80">
            {t('orderSuccess.subtitle')}
          </p>
        </div>

        <div className="flex flex-col items-center gap-12">
          {/* Main Controls: Personalization Form */}
          <div className="w-full max-w-4xl space-y-8 h-full mx-auto">
            <div className="p-8 md:p-12 rounded-[3rem] bg-surface border border-white/5 shadow-2xl relative overflow-hidden group">
              {/* Internal Accent Backgrounds */}
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo/5 blur-[100px] rounded-full translate-x-1/2 translate-y-1/2 group-hover:bg-indigo/10 transition-colors duration-1000" />

              <div className="relative z-10">
                <div className="flex flex-col md:flex-row items-center justify-between mb-16 pb-8 border-b border-white/5 gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-indigo/10 flex items-center justify-center text-indigo shadow-inner">
                      <Palette size={24} />
                    </div>
                    <div>
                      <h3 className="text-white text-lg font-black italic tracking-tighter uppercase">{t('orderSuccess.form.brandName')}</h3>
                      <div className="flex items-center gap-2 text-[10px] text-gray-500 font-black uppercase tracking-widest">
                        <CheckCircle2 size={10} className="text-cyan" />
                        {t('common.edit')} MODE
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center md:items-end gap-2">
                    <div className="px-5 py-2 rounded-xl bg-surface border border-white/5 shadow-2xl flex items-center gap-3">
                      <div className="flex gap-1.5">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${editCount >= (i + 1) ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-white/10'}`} />
                        ))}
                      </div>
                      <span className={`text-[9px] font-black uppercase tracking-widest ${isLocked ? 'text-red-500' : 'text-gray-500'}`}>
                        {isLocked ? t('orderSuccess.form.editLimitReached') : t('orderSuccess.form.editLimit', { count: 5 - editCount })}
                      </span>
                    </div>
                    <div className="text-[8px] font-black uppercase tracking-[0.2em] text-cyan animate-pulse">
                      {t('orderSuccess.form.manualReview')}
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-12">
                  {/* Inputs Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
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
                        className="w-full bg-deep-black/50 border border-white/5 rounded-2xl px-6 py-4 text-white text-sm font-medium focus:border-indigo transition-all outline-none placeholder:text-white/10 italic disabled:opacity-30 disabled:grayscale transition-all"
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

                  {/* Color DNA */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="h-px flex-grow bg-white/5" />
                      <span className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-700">{t('orderSuccess.form.colors')}</span>
                      <div className="h-px flex-grow bg-white/5" />
                    </div>

                    <div className="flex flex-wrap gap-8 items-center justify-center">
                      <div className="flex items-center gap-4 group/color">
                        <div
                          className="w-12 h-12 rounded-2xl border-2 border-white/10 p-1 cursor-pointer group-hover/color:border-indigo transition-all overflow-hidden"
                          style={{ backgroundColor: formData.primaryColor }}
                          onClick={() => !isLocked && document.getElementById('primary-color').click()}
                        >
                          <input
                            id="primary-color"
                            type="color"
                            value={formData.primaryColor}
                            disabled={isLocked}
                            onChange={(e) => { setFormData({ ...formData, primaryColor: e.target.value }); setIsDirty(true); }}
                            className="opacity-0 w-0 h-0"
                          />
                        </div>
                        <div>
                          <p className="text-[10px] text-white font-black italic tracking-tighter uppercase">CORE_AXIS</p>
                          <code className="text-[9px] text-gray-500 font-mono tracking-widest">{formData.primaryColor.toUpperCase()}</code>
                        </div>
                      </div>

                      <div className="w-px h-10 bg-white/5 hidden md:block" />

                      <div className="flex items-center gap-4 group/color">
                        <div
                          className="w-12 h-12 rounded-2xl border-2 border-white/10 p-1 cursor-pointer group-hover/color:cyan transition-all overflow-hidden"
                          style={{ backgroundColor: formData.secondaryColor }}
                          onClick={() => !isLocked && document.getElementById('secondary-color').click()}
                        >
                          <input
                            id="secondary-color"
                            type="color"
                            value={formData.secondaryColor}
                            disabled={isLocked}
                            onChange={(e) => { setFormData({ ...formData, secondaryColor: e.target.value }); setIsDirty(true); }}
                            className="opacity-0 w-0 h-0"
                          />
                        </div>
                        <div>
                          <p className="text-[10px] text-white font-black italic tracking-tighter uppercase">NEON_PULSE</p>
                          <code className="text-[9px] text-gray-500 font-mono tracking-widest">{formData.secondaryColor.toUpperCase()}</code>
                        </div>
                      </div>
                    </div>
                  </div>

                    {/* Notes */}
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 flex items-center gap-2">
                        <MessageSquare size={12} className="text-indigo" />
                        {t('orderSuccess.form.notes')}
                      </label>
                      <textarea
                        rows="3"
                        disabled={isLocked}
                        value={formData.notes}
                        onChange={(e) => { setFormData({ ...formData, notes: e.target.value }); setIsDirty(true); }}
                        placeholder="..."
                        className="w-full bg-deep-black/50 border border-white/5 rounded-[2.5rem] px-8 py-6 text-white text-sm font-medium focus:border-indigo transition-all outline-none placeholder:text-white/10 italic resize-none custom-scrollbar disabled:opacity-30 disabled:grayscale transition-all"
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
                              className="w-full bg-violet/5 border border-violet/10 rounded-[2rem] px-8 py-6 text-white text-sm font-medium focus:border-violet transition-all outline-none placeholder:text-white/10 italic resize-none custom-scrollbar disabled:opacity-30 disabled:grayscale transition-all"
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
                              className="w-full bg-cyan/5 border border-cyan/10 rounded-2xl px-6 py-4 text-white text-sm font-medium focus:border-cyan transition-all outline-none placeholder:text-white/10 italic disabled:opacity-30 disabled:grayscale transition-all"
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
                      className={`w-full py-6 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-3 relative overflow-hidden group shadow-[0_15px_40px_-5px_rgba(92,115,255,0.4)] disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed transform active:scale-[0.98] ${showSuccess ? 'bg-emerald-500 shadow-emerald-500/40' : 'bg-indigo text-white'}`}
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
