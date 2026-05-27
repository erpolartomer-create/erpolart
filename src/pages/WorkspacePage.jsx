import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Loader2, Palette, Type, Globe, CheckCircle2,
  ArrowLeft, Save, Rocket, Monitor, Layout,
  Smartphone, MousePointer2, ShieldCheck, AlertCircle
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabase';
import ScrollReveal from '../components/ScrollReveal';

const WorkspacePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [order, setOrder] = useState(null);
  const [siteData, setSiteData] = useState({
    brandName: '',
    primaryColor: '#5c73ff',
    secondaryColor: '#00e6d2',
    headline: '',
    description: '',
    socials: { instagram: '', twitter: '', linkedin: '' }
  });

  const [viewMode, setViewMode] = useState('desktop'); // desktop, mobile
  const [activeTab, setActiveTab] = useState('identity'); // identity, content, style
  const [showPublishSuccess, setShowPublishSuccess] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data, error } = await supabase.from('orders').select('*').eq('id', id).eq('project_code', 'erpolart').single();
        if (error) throw error;
        setOrder(data);
        
        // Priority Mapping: 1. New Columns, 2. siteData, 3. configuration
        if (data.brand_name || data.brand_colors) {
          setSiteData(prev => ({
            ...prev,
            brandName: data.brand_name || prev.brandName,
            primaryColor: data.brand_colors?.primary || prev.primaryColor,
            secondaryColor: data.brand_colors?.secondary || prev.secondaryColor,
            description: data.project_notes || prev.description
          }));
        } else if (data.siteData) {
          setSiteData(data.siteData);
        } else if (data.configuration) {
          setSiteData(prev => ({
            ...prev,
            brandName: data.configuration.brandName || '',
            primaryColor: data.configuration.primaryColor || '#5c73ff',
            secondaryColor: data.configuration.secondaryColor || '#00e6d2',
          }));
        }
      } catch (err) {
        console.error('Workspace fetch error:', err);
        navigate('/my-purchases');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, navigate]);

  const handleInputChange = (field, value) => {
    setSiteData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase.from('orders').update({
        siteData: siteData
      }).eq('id', id).eq('project_code', 'erpolart');
      if (error) throw error;
      // Optional: localized toast
    } catch (err) {
      console.error('Workspace save error:', err);
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    setSaving(true);
    try {
      const { error } = await supabase.from('orders').update({
        siteData: siteData,
      }).eq('id', id).eq('project_code', 'erpolart');
      if (error) throw error;
      setShowPublishSuccess(true);
      setTimeout(() => navigate('/my-purchases'), 3000);
    } catch (err) {
      console.error('Publish error:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#060609] flex flex-col items-center justify-center gap-6">
      <Loader2 className="text-indigo animate-spin" size={48} strokeWidth={1} />
      <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">Initializing Workspace Environment...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#060609] text-white flex flex-col lg:flex-row overflow-hidden">
      <Helmet>
        <title>Workspace - ErpolArt</title>
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      {/* 1. Side Panel - Editor Controls */}
      <div className="w-full lg:w-[400px] border-r border-white/5 bg-[#0a0a12]/50 backdrop-blur-3xl flex flex-col h-screen relative z-30">

        {/* Panel Header */}
        <div className="p-8 border-b border-white/5 bg-white/2">
          <button
            onClick={() => navigate('/my-purchases')}
            className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors mb-6 group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Back to Purchases
          </button>
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-display font-black tracking-tighter italic">Workspace</h1>
              <p className="text-[10px] font-black text-indigo uppercase tracking-[0.2em] mt-1">Live Architectural Edit</p>
            </div>
            <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-black text-white/60">
              PRO_ENGINE_v4
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-white/5">
          {[
            { id: 'identity', icon: ShieldCheck, label: 'Identity' },
            { id: 'content', icon: Type, label: 'Content' },
            { id: 'style', icon: Palette, label: 'Aesthetics' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-4 flex flex-col items-center gap-1.5 transition-all relative ${activeTab === tab.id ? 'text-white' : 'text-white/30 hover:text-white/60'}`}
            >
              <tab.icon size={16} />
              <span className="text-[9px] font-black uppercase tracking-widest">{tab.label}</span>
              {activeTab === tab.id && (
                <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo" />
              )}
            </button>
          ))}
        </div>

        {/* Scrollable Form Content */}
        <div className="flex-grow overflow-y-auto p-8 custom-scrollbar">
          <AnimatePresence mode="wait">
            {activeTab === 'identity' && (
              <motion.div
                key="identity"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-8"
              >
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Brand Identity (Name)</label>
                  <input
                    type="text"
                    value={siteData.brandName}
                    onChange={(e) => handleInputChange('brandName', e.target.value)}
                    className="w-full bg-white/3 border border-white/10 rounded-xl px-5 py-4 text-sm font-medium focus:border-indigo/50 focus:ring-1 focus:ring-indigo/20 transition-all outline-none"
                    placeholder="e.g. Lumina Digital"
                  />
                </div>

                <div className="p-6 rounded-2xl bg-indigo/5 border border-indigo/20 space-y-4">
                  <div className="flex items-center gap-3 text-indigo">
                    <Layout size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Global Meta Data</span>
                  </div>
                  <p className="text-[10px] text-white/40 italic leading-relaxed">This brand name will be used across SEO tags, headers, and footer across all pages.</p>
                </div>
              </motion.div>
            )}

            {activeTab === 'content' && (
              <motion.div
                key="content"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-8"
              >
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Strategic Headline</label>
                  <textarea
                    value={siteData.headline}
                    onChange={(e) => handleInputChange('headline', e.target.value)}
                    className="w-full h-32 bg-white/3 border border-white/10 rounded-xl px-5 py-4 text-sm font-medium focus:border-indigo/50 focus:ring-1 focus:ring-indigo/20 transition-all outline-none resize-none"
                    placeholder="Enter heroic headline..."
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Architecture Narrative (Desc)</label>
                  <textarea
                    value={siteData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="w-full h-44 bg-white/3 border border-white/10 rounded-xl px-5 py-4 text-sm font-medium focus:border-indigo/50 focus:ring-1 focus:ring-indigo/20 transition-all outline-none resize-none"
                    placeholder="Detailed architectural description..."
                  />
                </div>
              </motion.div>
            )}

            {activeTab === 'style' && (
              <motion.div
                key="style"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-8"
              >
                <div className="space-y-6">
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Visual Core (Primary)</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="color"
                      value={siteData.primaryColor}
                      onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                      className="w-14 h-14 bg-transparent border-none outline-none cursor-pointer rounded-lg overflow-hidden"
                    />
                    <div className="flex-grow bg-white/3 border border-white/10 rounded-xl px-4 py-3 text-xs font-mono text-white/60 italic uppercase tracking-widest leading-none flex items-center">
                      {siteData.primaryColor}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Accent Layer (Secondary)</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="color"
                      value={siteData.secondaryColor}
                      onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                      className="w-14 h-14 bg-transparent border-none outline-none cursor-pointer rounded-lg overflow-hidden"
                    />
                    <div className="flex-grow bg-white/3 border border-white/10 rounded-xl px-4 py-3 text-xs font-mono text-white/60 italic uppercase tracking-widest leading-none flex items-center">
                      {siteData.secondaryColor}
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-cyan/5 border border-cyan/20 space-y-4">
                  <div className="flex items-center gap-3 text-cyan">
                    <MousePointer2 size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Real-time Feedback</span>
                  </div>
                  <p className="text-[10px] text-white/40 italic leading-relaxed">These colors are applied to buttons, gradients, and interactive elements across the preview architecture.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Panel Footer - Actions */}
        <div className="p-8 border-t border-white/5 flex gap-4 bg-[#0c0c16]">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 py-4 rounded-xl border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            Auto-Save
          </button>
          <button
            onClick={handlePublish}
            disabled={saving}
            className="flex-1 py-4 rounded-xl bg-indigo text-white text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-2xl shadow-indigo/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Rocket size={14} />}
            Publish
          </button>
        </div>
      </div>

      {/* 2. Main Canvas - Live Preview */}
      <div className="flex-grow bg-[#060609] relative flex flex-col p-8 lg:p-12 overflow-hidden">

        {/* Canvas Header - Viewport Controls */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-6">
            <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/5">
              <button
                onClick={() => setViewMode('desktop')}
                className={`p-3 rounded-xl transition-all ${viewMode === 'desktop' ? 'bg-indigo text-white shadow-xl' : 'text-white/30 hover:text-white/50'}`}
              >
                <Monitor size={18} />
              </button>
              <button
                onClick={() => setViewMode('mobile')}
                className={`p-3 rounded-xl transition-all ${viewMode === 'mobile' ? 'bg-indigo text-white shadow-xl' : 'text-white/30 hover:text-white/50'}`}
              >
                <Smartphone size={18} />
              </button>
            </div>
            <div className="hidden md:flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-white/40">
              <Globe size={14} className="text-cyan" />
              Preview Environment: <span className="text-white/80">erpolart-simulation-01.local</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="px-5 py-2 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Live Engine Ready
            </div>
          </div>
        </div>

        {/* Interaction Canvas */}
        <div className="flex-grow relative flex justify-center perspective-1000 overflow-hidden lg:overflow-visible">
          <motion.div
            animate={{
              width: viewMode === 'desktop' ? '100%' : '375px',
              height: viewMode === 'desktop' ? '100%' : '667px',
            }}
            transition={{ type: "spring", stiffness: 200, damping: 30 }}
            className="bg-white rounded-[2rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] border border-white/10 relative"
          >
            {/* Fake Website Content - Reactive to Editor */}
            <div className="h-full overflow-y-auto no-scrollbar bg-[#0f0f1b] text-white font-sans">

              {/* Preview Navbar */}
              <nav className="p-8 border-b border-white/5 flex items-center justify-between">
                <div className="text-xl font-bold tracking-tighter" style={{ color: siteData.primaryColor }}>
                  {siteData.brandName || "BrandLogo"}
                </div>
                <div className="flex gap-6 text-[10px] font-bold uppercase tracking-widest text-white/40">
                  <span>Portfolio</span>
                  <span>Services</span>
                </div>
              </nav>

              {/* Preview Hero */}
              <div className="p-12 md:p-20 space-y-8 flex flex-col items-center text-center">
                <motion.div
                  key={siteData.headline}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-4xl md:text-6xl lg:text-7xl font-display font-black tracking-tighter italic leading-none"
                >
                  {siteData.headline || "Unmatched Architectural Excellence."}
                </motion.div>

                <motion.p
                  key={siteData.description}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-white/40 text-sm md:text-base max-w-xl font-medium leading-relaxed"
                >
                  {siteData.description || "Deploying elite digital experiences powered by the ErpolArt Engine. Seamless integration, premium aesthetics, and unparalleled speed."}
                </motion.p>

                <div className="flex gap-6 mt-10">
                  <button
                    className="px-10 py-5 rounded-full text-white font-black uppercase tracking-widest text-xs shadow-2xl transition-all"
                    style={{ backgroundColor: siteData.primaryColor, boxShadow: `0 20px 40px -10px ${siteData.primaryColor}66` }}
                  >
                    Get Started
                  </button>
                </div>
              </div>

              {/* Feature Grid Mockup */}
              <div className="p-12 border-t border-white/5 grid grid-cols-2 gap-8 opacity-40 grayscale">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-40 bg-white/5 rounded-3xl border border-white/10" />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {showPublishSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-deep-black/90 backdrop-blur-2xl"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full max-w-md bg-[#0c0c16] border border-white/10 rounded-[2.5rem] p-12 text-center shadow-2xl shadow-indigo/20 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan via-indigo to-violet" />
              <div className="w-20 h-20 rounded-3xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-500 mx-auto mb-8 shadow-inner">
                <Rocket size={40} />
              </div>
              <h2 className="text-3xl font-display font-black italic tracking-tighter text-white mb-4">DEPLOYED SUCCESSFUL</h2>
              <p className="text-white/40 text-sm font-medium leading-relaxed mb-8">Your architecture is now live on the global grid. Initializing administrative handover...</p>
              <div className="flex items-center justify-center gap-3 text-cyan text-xs font-black uppercase tracking-widest">
                <Loader2 size={16} className="animate-spin" />
                Finalizing Protocol...
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WorkspacePage;
