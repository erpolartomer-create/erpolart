import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X, Upload, Trash, Check, Sparkles } from 'lucide-react';
import API from '../../services/api';
import { supabaseAdmin } from '../../lib/supabaseAdmin';
import { uploadToStorage } from '../../services/storageService';
import { toast } from '../../components/Toast';

// ==========================================
// CAPABILITIES POOL (DYNAMIC — EDITABLE IN UI)
// ==========================================
const TECH_OPTIONS = ['React', 'Next.js', 'Tailwind CSS', 'Framer Motion', 'Node.js', 'Supabase', 'Three.js', 'n8n', 'Make.com', 'OpenAI API', 'Resend', 'Stripe'];
const DEFAULT_FEATURE_OPTIONS = [
  'AI-Powered Dashboard',
  'Automated Lead & CRM System',
  'SaaS Platform Architecture',
  'Real-Time Analytics Panel',
  'Multi-Language Interface',
  'Secure Cloud Infrastructure',
  'E-Commerce & Payment Integration',
  'Online Booking & Appointment',
  'Full SEO Optimization Suite',
  'Mobile-First Responsive Design',
  'Powerful Admin Control Panel',
  'Smart Blog & Content System',
  'API Integration & Webhooks',
  'Email & Notification Automation',
  'Premium Animations & Motion UI',
  'Custom Branding & Identity System',
];

// GHOST NAMES TO PURGE ON SIGHT
const GHOST_LIST = [
  'Service Menu', 'Gallery', 'Admin Panel', 'Blog', 'Dark Mode', 'Metadata', 'Architecture', 'Clinic', 'Appointment Logic', 'CMS', 'Native Content', 'Unified Management', 'Visual Asset Engine'
];

const emptyForm = {
  templateId: '',
  name: '',
  category: '',
  price: '',
  tier: 1,
  status: 'available',
  is_sold: false,
  short_pitch: { tr: '', en: '', de: '' },
  core_breakdown: { tr: '', en: '', de: '' },
  previewImage: '',
  techStack: '',
  features: '',
  demoUrl: '',
  structure_type: 'One Page',
  pages_info: '',
  extra_services: [],
};

const AdminTemplates = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [uploadError, setUploadError] = useState(null);
  const [customTech, setCustomTech] = useState('');
  const [customFeature, setCustomFeature] = useState('');
  const [isTranslating, setIsTranslating] = useState({ short_pitch: false, core_breakdown: false });
  const [isTranslatingServices, setIsTranslatingServices] = useState(false);
  const [featurePool, setFeaturePool] = useState(DEFAULT_FEATURE_OPTIONS);
  const [newFeatureName, setNewFeatureName] = useState('');
  const [newFeatureEN, setNewFeatureEN] = useState('');
  const [newFeatureDE, setNewFeatureDE] = useState('');
  const [isTranslatingFeature, setIsTranslatingFeature] = useState(false);

  // Tracks whether the form pushed a history entry so back-button closes modal
  const formOpenRef = useRef(false);

  const closeForm = () => {
    formOpenRef.current = false;
    setShowForm(false);
    if (window.history.state?.adminFormOpen) {
      window.history.back();
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      if (formOpenRef.current) {
        formOpenRef.current = false;
        setShowForm(false);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const [techPool, setTechPool] = useState(TECH_OPTIONS);

  const fetchTemplates = async () => {
    try {
      const { data } = await API.get('/templates');
      setTemplates(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTemplates(); }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [field, lang] = name.split('.');
      setForm({
        ...form,
        [field]: { ...form[field], [lang]: value }
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleTranslate = async (field) => {
    const sourceText = form[field].tr;
    if (!sourceText) { toast.warning("Lütfen önce Türkçe (TR) alanını doldurun."); return; }

    setIsTranslating(prev => ({ ...prev, [field]: true }));
    try {
      const { data } = await API.post('/ai/translate', {
        text: sourceText,
        targetLanguages: ['en', 'de']
      });

      if (data.translations) {
        setForm(prev => ({
          ...prev,
          [field]: {
            ...prev[field],
            en: data.translations.en || prev[field].en,
            de: data.translations.de || prev[field].de,
          }
        }));
      }
    } catch (err) {
      console.error("Translation Error: Backend unreachable", err);
      toast.error("Çeviri şu an manuel yapılamıyor");
    } finally {
      setIsTranslating(prev => ({ ...prev, [field]: false }));
    }
  };

  const handleTranslateServices = async () => {
    setIsTranslatingServices(true);
    try {
      const updatedServices = await Promise.all(
        form.extra_services.map(async (service) => {
          if (!service.name) return service;
          try {
            const { data } = await API.post('/ai/translate', {
              text: service.name,
              targetLanguages: ['en', 'de']
            });
            return {
              ...service,
              name_en: data.translations?.en || service.name_en,
              name_de: data.translations?.de || service.name_de,
            };
          } catch (err) {
            console.error("Service translation failed:", err);
            return service;
          }
        })
      );
      setForm(prev => ({ ...prev, extra_services: updatedServices }));
    } catch (err) {
      console.error(err);
      toast.error('Hizmet çevirileri sırasında hata oluştu.');
    } finally {
      setIsTranslatingServices(false);
    }
  };

  const toggleOption = (listName, option) => {
    const currentList = form[listName].split(',').map(s => s.trim()).filter(Boolean);
    let newList;
    if (currentList.includes(option)) {
      newList = currentList.filter(item => item !== option);
    } else {
      newList = [...currentList, option];
    }
    setForm({ ...form, [listName]: newList.join(', ') });
  };

  const hardWipeFields = (field) => {
    setForm(prev => ({ ...prev, [field]: '' }));
  };

  const addTechToPool = (name) => {
    if (!name.trim()) return;
    const trimmed = name.trim();
    if (!techPool.some(t => t.toLowerCase() === trimmed.toLowerCase())) {
      setTechPool(prev => [...prev, trimmed]);
    }
    setCustomTech('');
  };

  const translateNewFeature = async () => {
    if (!newFeatureName.trim()) return;
    setIsTranslatingFeature(true);
    try {
      const { data } = await API.post('/ai/translate', {
        text: newFeatureName,
        targetLanguages: ['en', 'de'],
      });
      if (data.translations) {
        setNewFeatureEN(data.translations.en || '');
        setNewFeatureDE(data.translations.de || '');
      }
    } catch (err) {
      toast.error('Çeviri başarısız');
    } finally {
      setIsTranslatingFeature(false);
    }
  };

  const addFeatureToPool = () => {
    const label = newFeatureEN.trim() || newFeatureName.trim();
    if (!label) return;
    if (!featurePool.some(f => f.toLowerCase() === label.toLowerCase())) {
      setFeaturePool(prev => [...prev, label]);
    }
    setNewFeatureName('');
    setNewFeatureEN('');
    setNewFeatureDE('');
  };

  const removeFeatureFromPool = (feature) => {
    setFeaturePool(prev => prev.filter(f => f !== feature));
    const currentList = form.features.split(',').map(s => s.trim()).filter(Boolean);
    if (currentList.includes(feature)) {
      setForm(prev => ({ ...prev, features: currentList.filter(f => f !== feature).join(', ') }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return setUploadError("Görsel 5MB sınırını aşamaz.");
    setUploadError(null);
    const reader = new FileReader();
    reader.onloadend = () => setForm({ ...form, previewImage: reader.result });
    reader.readAsDataURL(file);
  };

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...emptyForm, templateId: templates.length + 1 });
    formOpenRef.current = true;
    window.history.pushState({ adminFormOpen: true }, '');
    setShowForm(true);
  };

  const openEdit = (template) => {
    setEditingId(template.id);

    const templateTechs = (template.tech_stack || []);

    // GHOST FILTERING: Purge legacy entries from the specific template's selected list
    const templateFeatures = (template.features_tr || template.features_en || template.features || []).filter(f => {
      const low = f.toLowerCase();
      const isOfficial = DEFAULT_FEATURE_OPTIONS.some(off => off.toLowerCase() === low);
      if (isOfficial) return true;
      // Remove if it contains any ghost term
      const isGhost = GHOST_LIST.some(ghost => low.includes(ghost.toLowerCase()));
      return !isGhost;
    }).map(f => {
      // Auto-normalization to official names
      const off = DEFAULT_FEATURE_OPTIONS.find(o => o.toLowerCase() === f.toLowerCase());
      return off || f;
    });

    // Sync individual tech pool (but features pool remains static)
    setTechPool(prev => {
      const p = [...prev];
      templateTechs.forEach(t => { if (!p.some(prevT => prevT.toLowerCase() === t.toLowerCase())) p.push(t); });
      return p;
    });

    setForm({
      templateId: template.template_id || template.templateId,
      name: template.name,
      category: template.category,
      price: template.price,
      tier: template.tier,
      status: template.status || 'available',
      is_sold: template.is_sold || false,
      short_pitch: typeof template.description === 'object' ? template.description : (typeof template.short_pitch === 'object' ? template.short_pitch : { tr: template.description || '', en: '', de: '' }),
      core_breakdown: typeof template.core_breakdown === 'object' ? template.core_breakdown : { tr: template.long_description || '', en: '', de: '' },
      previewImage: template.image_url || template.preview_image || '',
      techStack: templateTechs.join(', '),
      features: templateFeatures.join(', '),
      demoUrl: template.demo_url || '',
      structure_type: template.structure_type || 'One Page',
      pages_info: template.pages_info || '',
      extra_services: template.extra_services || [],
    });
    formOpenRef.current = true;
    window.history.pushState({ adminFormOpen: true }, '');
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let finalImageUrl = form.previewImage;
      if (form.previewImage?.startsWith('data:image')) {
        const fileName = `tpl_${form.templateId}_${Date.now()}.png`;
        finalImageUrl = await uploadToStorage('logos', `templates/${fileName}`, form.previewImage);
      }

      // Final Purge before database sync
      const finalFeatures = form.features.split(',').map(s => s.trim()).filter(Boolean).filter(f => {
        const low = f.toLowerCase();
        const isOfficial = DEFAULT_FEATURE_OPTIONS.some(off => off.toLowerCase() === low);
        if (isOfficial) return true;
        const isGhost = GHOST_LIST.some(ghost => low.includes(ghost.toLowerCase()));
        return !isGhost;
      });

      const payload = {
        name: form.name,
        description: form.short_pitch, // Mapped to snake_case 'description'
        price: form.price,
        image_url: finalImageUrl,
        demo_url: form.demoUrl,
        category: form.category,
        project_code: 'erpolart',
        template_id: Number(form.templateId),
        tier: Number(form.tier),
        is_sold: form.is_sold,
        status: form.is_sold ? 'sold' : 'available',
        core_breakdown: form.core_breakdown,
        tech_stack: form.techStack.split(',').map(s => s.trim()).filter(Boolean),
        features: finalFeatures,
        structure_type: form.structure_type,
        pages_info: form.pages_info,
        extra_services: form.extra_services,
      };

      if (editingId) { 
        await API.put(`/templates/${editingId}`, payload); 
      } else { 
        await API.post('/templates', payload); 
      }

      closeForm();
      fetchTemplates();
    } catch (err) {
      console.error(err);
      toast.error('Sync Error: ' + (err.response?.data?.message || err.message));
    } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Veriyi kalıcı olarak sil?')) return;
    try { 
      await API.delete(`/templates/${id}`);
      fetchTemplates(); 
    } catch (err) { 
      console.error(err); 
      toast.error(err.response?.data?.message || 'Silme işlemi başarısız oldu.');
    }
  };

  const inputClass = "w-full bg-[#0a0a0f] border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none transition-all focus:border-indigo";
  const labelClass = "text-[9px] font-black text-gray-500 uppercase tracking-widest mb-2 block";

  return (
    <div className="pb-10">
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-pure-white italic tracking-tighter">Digital Atelier</h1>
          <p className="text-[9px] font-black text-indigo/60 uppercase tracking-[0.5em]">Registry Management System</p>
        </div>
        {!showForm && (
          <button onClick={openCreate} className="px-8 py-4 bg-indigo text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:shadow-2xl transition-all"> <Plus size={16} className="inline mr-2" /> New Asset </button>
        )}
      </div>

      {showForm ? (
        <div className="flex gap-6 h-[calc(100vh-164px)] min-h-0">

          {/* Left: compact template sidebar */}
          <div className="w-72 shrink-0 flex flex-col bg-[#0a0a0f] border border-white/5 rounded-[2.5rem] overflow-hidden">
            <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between shrink-0">
              <span className="text-[9px] font-black text-gray-500 uppercase tracking-[0.3em]">{templates.length} Templates</span>
              <button onClick={openCreate} className="w-8 h-8 rounded-xl bg-indigo/10 text-indigo hover:bg-indigo hover:text-white transition-all flex items-center justify-center">
                <Plus size={14} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-white/[0.03]">
              {!editingId && (
                <div className="flex items-center gap-3 px-5 py-4 bg-indigo/5 border-r-2 border-r-indigo shrink-0">
                  <div className="w-9 h-9 rounded-lg bg-indigo/20 flex items-center justify-center text-indigo shrink-0"><Plus size={14} /></div>
                  <span className="text-[11px] font-black text-indigo uppercase tracking-wider">New Asset</span>
                </div>
              )}
              {templates.map(template => (
                <div
                  key={template.id}
                  onClick={() => openEdit(template)}
                  className={`flex items-center gap-3 px-5 py-4 cursor-pointer hover:bg-white/[0.02] transition-all ${editingId === template.id ? 'bg-indigo/5 border-r-2 border-r-indigo' : ''}`}
                >
                  <img src={template.image_url || template.preview_image} alt={template.name} className="w-9 h-9 rounded-lg object-cover shrink-0 border border-white/10" />
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] font-black text-white truncate italic">{template.name}</div>
                    <div className="text-[8px] text-gray-600 font-black uppercase tracking-widest mt-0.5">{template.category}</div>
                  </div>
                  <div className={`text-[7px] font-black px-1.5 py-0.5 rounded ${template.is_sold ? 'text-red-400 bg-red-500/10' : 'text-green-400 bg-green-500/10'}`}>
                    {template.is_sold ? 'SOLD' : 'AVL'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: form panel */}
          <div className="flex-1 bg-[#08080c] border border-white/5 rounded-[2.5rem] overflow-y-auto">
            <div className="p-10">
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h2 className="text-2xl font-black text-pure-white italic tracking-tighter">Asset Configuration</h2>
                  <p className="text-[9px] font-black text-gray-600 uppercase tracking-[0.3em] mt-1">{editingId ? 'Editing Existing Template' : 'New Template Registration'}</p>
                </div>
                <button onClick={closeForm} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-500 hover:text-white transition-all"> <X size={20} /> </button>
              </div>

            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="grid grid-cols-2 gap-8">
                <div> <label className={labelClass}>Internal Registry</label> <input name="templateId" value={form.templateId} onChange={handleChange} className={inputClass} placeholder="ID_001" required /> </div>
                <div className="flex flex-col">
                  <label className={labelClass}>Acquisition Flow</label>
                  <div
                    onClick={() => setForm({ ...form, is_sold: !form.is_sold })}
                    className={`h-12 w-full rounded-xl border flex items-center px-4 cursor-pointer transition-all duration-500 overflow-hidden relative group ${form.is_sold ? 'bg-red-500/10 border-red-500/30' : 'bg-green-500/5 border-green-500/20'}`}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-r transition-opacity duration-500 ${form.is_sold ? 'from-red-500/10 to-transparent opacity-100' : 'from-green-500/10 to-transparent opacity-0'}`} />
                    <div className="flex items-center gap-3 relative z-10 w-full">
                      <div className={`w-2 h-2 rounded-full animate-pulse ${form.is_sold ? 'bg-red-500' : 'bg-green-500'}`} />
                      <span className={`text-[10px] font-black uppercase tracking-widest ${form.is_sold ? 'text-red-400' : 'text-green-400'}`}>
                        {form.is_sold ? 'ACQUIRED / SOLD OUT' : 'AVAILABLE FOR REGISTRATION'}
                      </span>
                      <div className="ml-auto w-10 h-6 bg-white/5 rounded-full relative p-1 border border-white/5">
                        <motion.div
                          animate={{ x: form.is_sold ? 16 : 0 }}
                          className={`w-4 h-4 rounded-full shadow-lg ${form.is_sold ? 'bg-red-500' : 'bg-gray-600'}`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div> <label className={labelClass}>Identifier Name</label> <input name="name" value={form.name} onChange={handleChange} className={inputClass} placeholder="Exclusive Villa Project" required /> </div>
              <div> <label className={labelClass}>Live Demo URL</label> <input name="demoUrl" value={form.demoUrl} onChange={handleChange} className={inputClass} placeholder="https://luxury-villa.erpolart.studio" /> </div>

              <div className="grid grid-cols-3 gap-8">
                <div> <label className={labelClass}>Segment</label> <input name="category" value={form.category} onChange={handleChange} className={inputClass} placeholder="Corporate" required /> </div>
                <div> <label className={labelClass}>Architecture Type</label> <select name="structure_type" value={form.structure_type} onChange={handleChange} className={inputClass}> <option value="One Page">One Page</option> <option value="Multi Page">Multi Page</option> <option value="SaaS Platform">SaaS Platform</option> </select> </div>
                <div className="col-span-2"> <label className={labelClass}>Architecture Configuration (e.g. Multi Page, Admin + Front)</label> <input name="pages_info" value={form.pages_info} onChange={handleChange} className={inputClass} placeholder="Multi Page, SEO Optimized, Admin Panel" /> </div>
                <div> <label className={labelClass}>Licensing</label> <input name="price" value={form.price} onChange={handleChange} className={inputClass} placeholder="$3,500" required /> </div>
                <div> <label className={labelClass}>Exclusivity</label> <select name="tier" value={form.tier} onChange={handleChange} className={inputClass}> <option value={1}>Tier I - CORPORATE</option> <option value={2}>Tier II - PRO</option> <option value={3}>Tier III - PREMIUM</option> <option value={4}>Tier IV - PLATINUM</option> </select> </div>
              </div>

              {/* Short Pitch - Multi-Language */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <label className={labelClass}>Short Pitch (Executive Summary)</label>
                  <button
                    type="button"
                    onClick={() => handleTranslate('short_pitch')}
                    disabled={isTranslating.short_pitch}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${isTranslating.short_pitch ? 'bg-indigo/20 text-indigo/50 cursor-not-allowed' : 'bg-indigo/10 text-indigo hover:bg-indigo hover:text-white'}`}
                  >
                    {isTranslating.short_pitch ? (
                      <div className="w-3 h-3 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Sparkles size={12} />
                    )}
                    AI Translate (TR → EN/DE)
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div className="relative group">
                    <span className="absolute left-4 top-3 text-[8px] font-black text-indigo/40 uppercase pointer-events-none">TR</span>
                    <textarea name="short_pitch.tr" value={form.short_pitch.tr} onChange={handleChange} className={`${inputClass} !pl-10 h-20 resize-none`} placeholder="Executive summary in Turkish..." />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative group">
                      <span className="absolute left-4 top-3 text-[8px] font-black text-indigo/40 uppercase pointer-events-none">EN</span>
                      <textarea name="short_pitch.en" value={form.short_pitch.en} onChange={handleChange} className={`${inputClass} !pl-10 h-20 resize-none`} placeholder="English translation..." />
                    </div>
                    <div className="relative group">
                      <span className="absolute left-4 top-3 text-[8px] font-black text-indigo/40 uppercase pointer-events-none">DE</span>
                      <textarea name="short_pitch.de" value={form.short_pitch.de} onChange={handleChange} className={`${inputClass} !pl-10 h-20 resize-none`} placeholder="German translation..." />
                    </div>
                  </div>
                </div>
              </div>

              {/* Core Breakdown - Multi-Language */}
              <div className="space-y-6 pt-10 border-t border-white/5">
                <div className="flex items-center justify-between">
                  <label className={labelClass}>Core Breakdown (Technical Narrative)</label>
                  <button
                    type="button"
                    onClick={() => handleTranslate('core_breakdown')}
                    disabled={isTranslating.core_breakdown}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${isTranslating.core_breakdown ? 'bg-indigo/20 text-indigo/50 cursor-not-allowed' : 'bg-indigo/10 text-indigo hover:bg-indigo hover:text-white'}`}
                  >
                    {isTranslating.core_breakdown ? (
                      <div className="w-3 h-3 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Sparkles size={12} />
                    )}
                    AI Auto-Logic (TR → ALL)
                  </button>
                </div>
                <div className="space-y-4">
                  <div className="relative">
                    <span className="absolute left-4 top-3 text-[8px] font-black text-indigo/40 uppercase pointer-events-none">TR</span>
                    <textarea name="core_breakdown.tr" value={form.core_breakdown.tr} onChange={handleChange} className={`${inputClass} !pl-10 h-32 resize-none`} placeholder="Detailed technical narrative in Turkish..." />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <span className="absolute left-4 top-3 text-[8px] font-black text-indigo/40 uppercase pointer-events-none">EN</span>
                      <textarea name="core_breakdown.en" value={form.core_breakdown.en} onChange={handleChange} className={`${inputClass} !pl-10 h-32 resize-none`} placeholder="English version..." />
                    </div>
                    <div className="relative">
                      <span className="absolute left-4 top-3 text-[8px] font-black text-indigo/40 uppercase pointer-events-none">DE</span>
                      <textarea name="core_breakdown.de" value={form.core_breakdown.de} onChange={handleChange} className={`${inputClass} !pl-10 h-32 resize-none`} placeholder="German version..." />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className={labelClass}>Primary Visual asset</label>
                <div className="relative group/asset">
                  <input type="file" id="template-image" accept="image/*, .jpg, .jpeg, .png, .webp" onChange={handleImageUpload} className="hidden" />
                  <label htmlFor="template-image" className={`flex flex-col items-center justify-center w-full min-h-[220px] rounded-[2.5rem] border-2 border-dashed transition-all cursor-pointer ${form.previewImage ? 'border-indigo/40 bg-indigo/5' : 'border-white/5 bg-white/[0.01] hover:border-indigo/20'}`}>
                    {form.previewImage ? (
                      <div className="relative w-full h-full p-4">
                        <img src={form.previewImage} alt="Identity" className="w-full h-60 object-cover rounded-[2rem] shadow-2xl" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/asset:opacity-100 transition-all duration-500 flex items-center justify-center rounded-[2rem] backdrop-blur-[2px]">
                          <div className="px-8 py-4 bg-indigo text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl transform scale-90 group-hover/asset:scale-100 transition-transform duration-500">
                            Update Asset
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-4 py-12">
                        <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center text-gray-700"> <Upload size={32} /> </div>
                        <div className="text-center"> <p className="text-[10px] font-black text-white uppercase tracking-widest">Access Local Media</p> <p className="text-[8px] text-gray-600 font-bold uppercase mt-2">Maximum 5MB</p> </div>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Extra Services (Upsell) */}
              <div className="space-y-6 pt-12 border-t border-white/5">
                <div className="flex items-center justify-between">
                  <label className={labelClass}>Ekstra Hizmetler (Upsell)</label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleTranslateServices}
                      disabled={isTranslatingServices || form.extra_services.length === 0}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${isTranslatingServices || form.extra_services.length === 0 ? 'bg-violet/10 text-violet/50 cursor-not-allowed' : 'bg-violet/20 text-violet hover:bg-violet hover:text-white'}`}
                    >
                      {isTranslatingServices ? (
                        <div className="w-3 h-3 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Sparkles size={12} />
                      )}
                      Tümünü Çevir (TR → EN/DE)
                    </button>
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, extra_services: [...form.extra_services, { id: Date.now(), name: '', name_en: '', name_de: '', price: 0 }] })}
                      className="px-4 py-2 bg-indigo/10 text-indigo rounded-xl text-[9px] font-black uppercase hover:bg-indigo hover:text-white transition-all flex items-center gap-2"
                    >
                      <Plus size={12} /> Yeni Hizmet Ekle
                    </button>
                  </div>
                </div>
                <div className="space-y-3">
                  {form.extra_services.map((service, index) => (
                    <div key={service.id} className="flex flex-col gap-2 p-4 bg-white/[0.02] border border-white/5 rounded-2xl relative group">
                      <div className="flex gap-4 items-start">
                        <div className="flex-1 space-y-3">
                          <div className="relative">
                            <span className="absolute left-4 top-3 text-[8px] font-black text-indigo/40 uppercase pointer-events-none">TR</span>
                            <input
                              value={service.name || ''}
                              onChange={(e) => {
                                const newList = [...form.extra_services];
                                newList[index].name = e.target.value;
                                setForm({ ...form, extra_services: newList });
                              }}
                              placeholder="Hizmet Adı (TR)"
                              className={`${inputClass} !pl-10`}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="relative">
                              <span className="absolute left-4 top-3 text-[8px] font-black text-indigo/40 uppercase pointer-events-none">EN</span>
                              <input
                                value={service.name_en || ''}
                                onChange={(e) => {
                                  const newList = [...form.extra_services];
                                  newList[index].name_en = e.target.value;
                                  setForm({ ...form, extra_services: newList });
                                }}
                                placeholder="Service Name (EN)"
                                className={`${inputClass} !pl-10 !py-2`}
                              />
                            </div>
                            <div className="relative">
                              <span className="absolute left-4 top-3 text-[8px] font-black text-indigo/40 uppercase pointer-events-none">DE</span>
                              <input
                                value={service.name_de || ''}
                                onChange={(e) => {
                                  const newList = [...form.extra_services];
                                  newList[index].name_de = e.target.value;
                                  setForm({ ...form, extra_services: newList });
                                }}
                                placeholder="Dienstname (DE)"
                                className={`${inputClass} !pl-10 !py-2`}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-3 w-32 shrink-0">
                          <input
                            type="number"
                            value={service.price}
                            onChange={(e) => {
                              const newList = [...form.extra_services];
                              newList[index].price = Number(e.target.value);
                              setForm({ ...form, extra_services: newList });
                            }}
                            placeholder="Fiyat ($)"
                            className={`${inputClass}`}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newList = form.extra_services.filter((_, i) => i !== index);
                              setForm({ ...form, extra_services: newList });
                            }}
                            className="p-2.5 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all w-full flex justify-center"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Strict Feature & Tech Orchestration */}
              <div className="space-y-12 pt-12 border-t border-white/5">
                {/* Tech Pool */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between"> <label className={labelClass}>Core Infrastructure</label> <button type="button" onClick={() => hardWipeFields('techStack')} className="text-[9px] font-black text-gray-600 hover:text-red-500 uppercase tracking-widest transition-colors flex items-center gap-1"> <Trash size={10} /> Clear Stack </button> </div>
                  <div className="flex flex-wrap gap-2 p-6 bg-white/[0.01] border border-white/5 rounded-3xl">
                    {techPool.filter(t => !form.techStack.split(',').map(s => s.trim()).includes(t)).map(tech => (
                      <button key={tech} type="button" onClick={() => toggleOption('techStack', tech)} className="px-4 py-2 bg-white/5 text-gray-500 border border-white/5 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-indigo/10 transition-all"> + {tech} </button>
                    ))}
                    <div className="flex gap-4 w-full mt-4 pt-4 border-t border-white/5">
                      <input value={customTech} onChange={(e) => setCustomTech(e.target.value)} placeholder="Register Custom Tech..." className="bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-[9px] font-black uppercase outline-none focus:border-indigo transition-all flex-1" onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechToPool(customTech))} />
                      <button type="button" onClick={() => addTechToPool(customTech)} className="px-6 bg-indigo/10 border border-indigo/20 text-indigo rounded-xl text-[9px] font-black uppercase hover:bg-indigo hover:text-white transition-all"> ADD </button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 p-6 bg-indigo/5 border border-indigo/10 rounded-3xl min-h-[70px]">
                    {form.techStack.split(',').map(s => s.trim()).filter(Boolean).map(tech => (
                      <button key={tech} type="button" onClick={() => toggleOption('techStack', tech)} className="px-4 py-3 bg-indigo text-white shadow-xl shadow-indigo/20 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-red-500 transition-all flex items-center gap-2"> {tech} <X size={10} /> </button>
                    ))}
                  </div>
                </div>

                {/* Features Pool (Dynamic) */}
                <div className="space-y-6 pt-12 border-t border-white/5">
                  <div className="flex items-center justify-between">
                    <label className={labelClass}>Capabilities Pool ({featurePool.length} Items)</label>
                    <button type="button" onClick={() => hardWipeFields('features')} className="text-[9px] font-black text-gray-600 hover:text-red-500 uppercase tracking-widest transition-colors flex items-center gap-1"> <Trash size={10} /> Wipe Integrated Data </button>
                  </div>

                  <div className="p-6 bg-white/[0.01] border border-white/5 rounded-3xl space-y-4">
                    {/* Pool chips */}
                    <div className="flex flex-wrap gap-2">
                      {featurePool.filter(f => !form.features.split(',').map(s => s.trim()).includes(f)).map(feature => (
                        <div key={feature} className="flex items-center gap-1 group/feat">
                          <button type="button" onClick={() => toggleOption('features', feature)} className="px-4 py-2 bg-white/5 text-gray-400 border border-white/5 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-violet/10 hover:text-white hover:border-violet/20 transition-all">
                            + {feature}
                          </button>
                          <button type="button" onClick={() => removeFeatureFromPool(feature)} className="w-5 h-5 rounded-full text-gray-700 hover:bg-red-500/20 hover:text-red-400 transition-all flex items-center justify-center opacity-0 group-hover/feat:opacity-100 shrink-0">
                            <X size={9} />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Add new feature input */}
                    <div className="pt-4 border-t border-white/5 space-y-3">
                      <div className="flex gap-3">
                        <div className="relative flex-1">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[8px] font-black text-violet/40 uppercase pointer-events-none">TR</span>
                          <input
                            value={newFeatureName}
                            onChange={(e) => setNewFeatureName(e.target.value)}
                            placeholder="Yeni özellik adı (TR)..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-[9px] font-black uppercase outline-none focus:border-violet transition-all text-white placeholder-gray-700"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') { e.preventDefault(); newFeatureEN ? addFeatureToPool() : translateNewFeature(); }
                            }}
                          />
                        </div>
                        <button type="button" onClick={translateNewFeature} disabled={isTranslatingFeature || !newFeatureName.trim()} className="px-4 bg-violet/10 border border-violet/20 text-violet rounded-xl text-[9px] font-black uppercase hover:bg-violet hover:text-white transition-all flex items-center gap-2 disabled:opacity-40 shrink-0">
                          {isTranslatingFeature ? <div className="w-3 h-3 border-2 border-violet border-t-transparent rounded-full animate-spin" /> : <Sparkles size={12} />}
                          AI Sync
                        </button>
                      </div>

                      {(newFeatureEN || newFeatureDE) && (
                        <div className="grid grid-cols-2 gap-3">
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[8px] font-black text-violet/40 uppercase pointer-events-none">EN</span>
                            <input value={newFeatureEN} onChange={(e) => setNewFeatureEN(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-[9px] font-black uppercase outline-none focus:border-violet transition-all text-white" />
                          </div>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[8px] font-black text-violet/40 uppercase pointer-events-none">DE</span>
                            <input value={newFeatureDE} onChange={(e) => setNewFeatureDE(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-[9px] font-black uppercase outline-none focus:border-violet transition-all text-white" />
                          </div>
                        </div>
                      )}

                      <button type="button" onClick={addFeatureToPool} disabled={!newFeatureName.trim()} className="px-5 py-2.5 bg-violet/10 border border-violet/20 text-violet rounded-xl text-[9px] font-black uppercase hover:bg-violet hover:text-white transition-all flex items-center gap-2 disabled:opacity-40">
                        <Plus size={12} /> Pool'a Ekle
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className={labelClass}>Integrated Template Logic</label>
                  </div>
                  <div className="flex flex-wrap gap-2 p-6 bg-violet/5 border border-violet/10 rounded-3xl min-h-[90px]">
                    {form.features.split(',').map(s => s.trim()).filter(Boolean).map(feature => (
                      <button key={feature} type="button" onClick={() => toggleOption('features', feature)} className="px-4 py-3 bg-violet text-white shadow-xl shadow-violet/20 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-red-500 transition-all flex items-center gap-2"> {feature} <X size={10} /> </button>
                    ))}
                    {form.features.split(',').map(s => s.trim()).filter(Boolean).length === 0 && <div className="w-full text-center py-4 text-[9px] font-black text-gray-700 uppercase italic">Clean Registry — Select from Pool</div>}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-5 bg-indigo text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] hover:shadow-[0_20px_40px_-10px_rgba(79,70,229,0.5)] hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
              >
                <Check size={18} />
                {editingId ? 'Save Asset Configuration' : 'Publish New Template'}
              </button>
            </form>
            </div>
          </div>

        </div>
      ) : (
        /* Full-width table when no form */
        <div className="bg-[#0a0a0f] border border-white/5 rounded-[3.5rem] overflow-hidden shadow-2xl">
          <div className="grid grid-cols-[auto_1fr_auto_auto_auto_auto] gap-10 px-12 py-8 border-b border-white/5 text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] bg-white/[0.01]">
            <span>Asset Identity</span> <span>Narrative</span> <span>Segment</span> <span>Premium</span> <span>Registry</span> <span>Actions</span>
          </div>
          {loading ? (
            <div className="px-12 py-24 text-center text-gray-700 text-sm font-black uppercase tracking-[0.6em] italic">Accessing Decrypted Repository...</div>
          ) : (
            <div className="divide-y divide-white/[0.03]">
              {templates.map((template) => (
                <div key={template.id} className="grid grid-cols-[auto_1fr_auto_auto_auto_auto] gap-10 px-12 py-10 items-center hover:bg-white/[0.01] transition-all group">
                  <div className="w-20 h-20 rounded-3xl overflow-hidden border border-white/5 shrink-0 shadow-2xl group-hover:border-indigo/40 transition-all group-hover:scale-105">
                    <img src={template.image_url || template.preview_image} alt={template.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="text-xl font-black text-pure-white group-hover:text-indigo transition-colors tracking-tighter italic leading-none">{template.name}</div>
                    <div className="text-[10px] text-gray-600 uppercase font-black tracking-[0.15em] mt-2 opacity-60">REF_ID_{template.template_id} • EXCLUSIVITY_{template.tier}</div>
                  </div>
                  <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest bg-white/[0.02] px-4 py-2 rounded-xl border border-white/5">{template.category}</div>
                  <div className="text-lg font-black text-white italic tracking-tighter">${template.price?.replace('$', '')}</div>
                  <div className="flex flex-col gap-1 items-center">
                    <div className={`text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border ${template.is_sold ? 'text-red-400 bg-red-500/5 border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]' : 'text-green-400 bg-green-500/5 border-green-500/10'}`}>
                      {template.is_sold ? 'Acquired' : 'Available'}
                    </div>
                    {template.is_sold && <div className="text-[7px] text-gray-600 font-bold uppercase tracking-tighter">OFF THE MARKET</div>}
                  </div>
                  <div className="flex gap-4">
                    <button onClick={() => openEdit(template)} className="w-14 h-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-gray-600 hover:text-indigo hover:border-indigo/40 hover:bg-indigo/10 transition-all group/btn"> <Pencil size={20} className="group-hover/btn:rotate-12 transition-transform" /> </button>
                    <button onClick={() => handleDelete(template.id)} className="w-14 h-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-gray-600 hover:text-red-400 hover:border-red-500/40 hover:bg-red-500/10 transition-all group/btn"> <Trash2 size={20} className="group-hover/btn:-rotate-12 transition-transform" /> </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminTemplates;
