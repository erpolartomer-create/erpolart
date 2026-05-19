import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Mail, Clock, User, FileText, Check, Copy, Loader2, ArrowLeft, Send } from 'lucide-react';
import { supabaseAdmin } from '../../lib/supabaseAdmin';
import { toast } from '../../components/Toast';

const SAAS_TECH_STACK = ['Next.js / React', 'Node.js', 'Supabase (BaaS)', 'PostgreSQL', 'Stripe API', 'OpenAI Integration', 'Tailwind CSS', 'AWS S3'];
const SAAS_MODULES = ['User Authentication & RBAC', 'Admin Dashboard', 'Payment Gateway (MRR)', 'AI Chatbot Logic', 'Multi-language (i18n)', 'SEO Optimization', 'API Architecture'];

const AUTO_TECH_STACK = ['n8n / Make.com', 'OpenAI API', 'Claude AI (Anthropic)', 'LangChain', 'Python / FastAPI', 'Node.js / Express', 'Supabase / PostgreSQL', 'Redis / Queue', 'Webhook Integration', 'Docker / Cloud Deploy'];
const AUTO_MODULES = ['AI Chatbot / Conversational Agent', 'Workflow Automation (n8n/Make)', 'Data ETL Pipeline', 'Document Processing AI', 'Lead & CRM Automation', 'Email/Notification Automation', 'API Integrations', 'Monitoring & Alerting'];

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [error, setError] = useState(null);

  const [proposalType, setProposalType] = useState('saas');
  const [proposalData, setProposalData] = useState({ amount: '', timeline: '' });
  const [proposalTier, setProposalTier] = useState('Premium');
  const [selectedTech, setSelectedTech] = useState([]);
  const [selectedModules, setSelectedModules] = useState([]);
  const [customNotes, setCustomNotes] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLink, setGeneratedLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  const isAuto = proposalType === 'automation';
  const TECH_STACK = isAuto ? AUTO_TECH_STACK : SAAS_TECH_STACK;
  const CORE_MODULES = isAuto ? AUTO_MODULES : SAAS_MODULES;
  const accent = isAuto ? 'emerald' : 'indigo';

  const selectMessage = (msg) => {
    setSelectedMessage(msg);
    setGeneratedLink('');
    setEmailSent(false);
    setIsSendingEmail(false);
    setProposalType('saas');
    setProposalData({ amount: '', timeline: '' });
    setProposalTier('Premium');
    setSelectedTech([]);
    setSelectedModules([]);
    setCustomNotes('');
  };

  const switchProposalType = (type) => {
    setProposalType(type);
    setSelectedTech([]);
    setSelectedModules([]);
    setProposalTier('Premium');
  };

  const handleGenerateProposal = async () => {
    if (!proposalData.amount) { toast.warning('Lütfen bir fiyat giriniz.'); return; }
    setIsGenerating(true);
    try {
      const payload = {
        lead_name: selectedMessage.name || 'Unknown',
        lead_email: selectedMessage.email || 'No Email',
        amount: Number(proposalData.amount),
        timeline: proposalData.timeline,
        project_name: isAuto
          ? (proposalTier === 'Platinum' ? 'Platinum Automation System' : 'Premium Automation System')
          : (proposalTier === 'Platinum' ? 'Platinum SaaS Architecture' : 'Premium SaaS Architecture'),
        features: JSON.stringify({ tech: selectedTech, modules: selectedModules, tier: proposalTier, revision_limit: 5 }),
      };
      const { data, error: insertError } = await supabaseAdmin.from('proposals').insert([payload]).select().single();
      if (insertError) throw insertError;
      setGeneratedLink(`${window.location.origin}/proposal/${data.id}`);
    } catch (err) {
      toast.error(`Teklif oluşturulamadı: ${err.message || 'Bilinmeyen hata'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendEmail = async () => {
    setIsSendingEmail(true);
    try {
      const { error } = await supabaseAdmin.functions.invoke('send-proposal-email', {
        body: {
          toEmail: selectedMessage.email,
          toName: selectedMessage.name,
          proposalUrl: generatedLink,
          projectName: isAuto ? 'AI Automation Proposal' : 'SaaS Proposal',
          projectType: proposalType,
        },
      });
      if (error) throw error;
      setEmailSent(true);
      toast.success('E-posta başarıyla gönderildi!');
    } catch (err) {
      toast.error(`E-posta gönderilemedi: ${err.message}`);
    } finally {
      setIsSendingEmail(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleTech = (tech) => setSelectedTech(prev => prev.includes(tech) ? prev.filter(t => t !== tech) : [...prev, tech]);
  const toggleModule = (mod) => setSelectedModules(prev => prev.includes(mod) ? prev.filter(m => m !== mod) : [...prev, mod]);

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data: { session } } = await supabaseAdmin.auth.getSession();
        if (!session) { setError('Oturum bulunamadı. Lütfen tekrar giriş yapın.'); return; }
        const { data } = await supabaseAdmin.from('leads').select('*').eq('project_code', 'erpolart').order('created_at', { ascending: false });
        setMessages(Array.isArray(data) ? data : []);
      } catch (err) {
        setError('Mesajlar şu an yüklenemiyor.');
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, []);

  return (
    <div className="flex gap-6 h-[calc(100vh-164px)] min-h-0">
      <Helmet>
        <title>Admin Mesajlar - ErpolArt</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* ── Left: Message List ── */}
      <div className={`flex flex-col min-w-0 transition-all duration-300 ${selectedMessage ? 'w-80 shrink-0' : 'flex-1'}`}>
        <div className="mb-6">
          <h1 className="text-3xl font-black text-pure-white tracking-tight mb-1">Messages</h1>
          <p className="text-gray-500 text-sm">Kullanıcılardan gelen talepler</p>
        </div>

        <div className="flex-1 bg-[#0f0f18] border border-white/5 rounded-2xl overflow-y-auto">
          {error && (
            <div className="p-4 m-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-xs font-bold uppercase tracking-widest">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              {error}
            </div>
          )}
          {loading ? (
            <div className="px-6 py-12 text-center text-gray-500 text-sm">Loading...</div>
          ) : messages.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <Mail size={40} className="text-gray-700 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">Henüz mesaj yok.</p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => selectMessage(msg)}
                  className={`px-5 py-4 flex items-center gap-3 cursor-pointer transition-colors ${
                    selectedMessage?.id === msg.id
                      ? 'bg-indigo/10 border-l-2 border-indigo'
                      : 'hover:bg-white/[0.02] border-l-2 border-transparent'
                  }`}
                >
                  <div className="w-9 h-9 rounded-xl bg-indigo/10 border border-indigo/20 flex items-center justify-center text-indigo shrink-0">
                    <User size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-pure-white truncate">{msg.name || msg.email}</div>
                    <div className="text-[11px] text-gray-500 truncate">{msg.message?.substring(0, 50)}...</div>
                    <div className="flex items-center gap-1 mt-1 text-[10px] text-gray-700">
                      <Clock size={10} />
                      {msg.created_at ? new Date(msg.created_at).toLocaleDateString('tr-TR') : '—'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Right: Detail + Proposal Builder ── */}
      {selectedMessage && (
        <div className="flex-1 min-w-0 flex flex-col overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 shrink-0">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedMessage(null)}
                className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-gray-500 hover:text-white transition-colors"
              >
                <ArrowLeft size={16} />
              </button>
              <div>
                <h2 className="text-xl font-black text-pure-white tracking-tight">{selectedMessage.name}</h2>
                <p className="text-indigo text-xs">{selectedMessage.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-white uppercase">{selectedMessage.service_type || 'Custom'}</span>
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-white uppercase">{selectedMessage.budget || 'N/A'}</span>
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-gray-400">{selectedMessage.timeline || '—'}</span>
            </div>
          </div>

          {/* Message */}
          <div className="bg-[#0f0f18] border border-white/5 rounded-2xl p-6 mb-6 shrink-0">
            <div className="text-[9px] font-black text-gray-600 uppercase tracking-[0.3em] mb-3">Müşteri Mesajı</div>
            <p className="text-gray-400 text-sm leading-relaxed italic">"{selectedMessage.message}"</p>
          </div>

          {/* Proposal Builder */}
          <div className="bg-[#0f0f18] border border-white/5 rounded-2xl p-6 flex-1">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <FileText size={18} className={isAuto ? 'text-emerald-400' : 'text-indigo'} />
                <span className="text-sm font-black text-pure-white uppercase tracking-[0.3em]">Proposal Builder</span>
              </div>
              <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${isAuto ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-indigo/10 border border-indigo/20 text-indigo'}`}>
                {isAuto ? 'Automation' : 'SaaS'}
              </div>
            </div>

            {!generatedLink ? (
              <div className="space-y-6">
                {/* Type Switcher */}
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => switchProposalType('saas')} className={`py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all border ${!isAuto ? 'bg-indigo border-indigo text-white shadow-lg shadow-indigo-500/30' : 'bg-white/[0.03] border-white/10 text-gray-500 hover:border-white/20'}`}>
                    SaaS Project
                  </button>
                  <button onClick={() => switchProposalType('automation')} className={`py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all border ${isAuto ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'bg-white/[0.03] border-white/10 text-gray-500 hover:border-white/20'}`}>
                    AI Automation
                  </button>
                </div>

                {/* Tier + Financials — same row */}
                <div className="grid grid-cols-4 gap-4">
                  <button onClick={() => setProposalTier('Premium')} className={`py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all border ${proposalTier === 'Premium' ? isAuto ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-indigo border-indigo text-white' : 'bg-white/[0.03] border-white/10 text-gray-500 hover:border-white/20'}`}>
                    Premium
                  </button>
                  <button onClick={() => setProposalTier('Platinum')} className={`py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all border ${proposalTier === 'Platinum' ? 'bg-cyan-500 border-cyan-500 text-white' : 'bg-white/[0.03] border-white/10 text-gray-500 hover:border-white/20'}`}>
                    Platinum
                  </button>
                  <div className="relative">
                    <span className={`absolute left-4 top-1/2 -translate-y-1/2 font-bold text-sm ${isAuto ? 'text-emerald-400' : 'text-indigo'}`}>$</span>
                    <input
                      type="number"
                      value={proposalData.amount}
                      onChange={(e) => setProposalData({ ...proposalData, amount: e.target.value })}
                      className={`w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-8 pr-3 py-3 text-white font-bold text-sm outline-none transition-all ${isAuto ? 'focus:border-emerald-500/50' : 'focus:border-indigo/50'}`}
                      placeholder="Price"
                    />
                  </div>
                  <input
                    type="text"
                    value={proposalData.timeline}
                    onChange={(e) => setProposalData({ ...proposalData, timeline: e.target.value })}
                    className={`w-full bg-white/[0.03] border border-white/10 rounded-2xl px-4 py-3 text-white font-bold text-sm outline-none transition-all ${isAuto ? 'focus:border-emerald-500/50' : 'focus:border-indigo/50'}`}
                    placeholder="Timeline"
                  />
                </div>

                {/* Tech Stack */}
                <div>
                  <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest block mb-3">Technology Stack</label>
                  <div className="flex flex-wrap gap-2">
                    {TECH_STACK.map(tech => (
                      <button key={tech} onClick={() => toggleTech(tech)} className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase transition-all border ${selectedTech.includes(tech) ? isAuto ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-indigo border-indigo text-white' : 'bg-white/5 border-white/10 text-gray-500 hover:border-white/20'}`}>
                        {tech}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Modules */}
                <div>
                  <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest block mb-3">
                    {isAuto ? 'Automation Modules' : 'Core Architecture Modules'}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {CORE_MODULES.map(mod => (
                      <button key={mod} onClick={() => toggleModule(mod)} className={`flex items-center justify-between px-4 py-3 rounded-xl text-[10px] font-bold uppercase transition-all border text-left ${selectedModules.includes(mod) ? isAuto ? 'bg-emerald-500/10 border-emerald-500/40 text-white' : 'bg-indigo/10 border-indigo/40 text-white' : 'bg-white/[0.02] border-white/5 text-gray-600'}`}>
                        <span className="leading-tight">{mod}</span>
                        <div className={`w-4 h-4 rounded-full border shrink-0 ml-2 flex items-center justify-center transition-all ${selectedModules.includes(mod) ? isAuto ? 'bg-emerald-500 border-emerald-500' : 'bg-indigo border-indigo' : 'border-white/10'}`}>
                          {selectedModules.includes(mod) && <Check size={9} className="text-white" />}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest block mb-3">Project Notes</label>
                  <textarea
                    value={customNotes}
                    onChange={(e) => setCustomNotes(e.target.value)}
                    className={`w-full bg-white/[0.03] border border-white/10 rounded-2xl px-4 py-3 text-white text-sm outline-none transition-all min-h-[80px] resize-none ${isAuto ? 'focus:border-emerald-500/50' : 'focus:border-indigo/50'}`}
                    placeholder="Özel notlar, müşteri gereksinimleri..."
                  />
                </div>

                <button onClick={handleGenerateProposal} disabled={isGenerating || !proposalData.amount} className="w-full relative group">
                  <div className={`absolute inset-0 rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity ${isAuto ? 'bg-emerald-500' : 'bg-indigo'}`} />
                  <div className={`relative disabled:opacity-50 text-white font-black uppercase tracking-[0.4em] text-[11px] py-5 rounded-2xl transition-all shadow-xl flex items-center justify-center gap-3 ${isAuto ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-indigo hover:bg-indigo-600'}`}>
                    {isGenerating ? <><Loader2 size={16} className="animate-spin" /><span>Generating...</span></> : <><span>{isAuto ? 'Deploy Automation Proposal' : 'Deploy SaaS Proposal'}</span><div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /></>}
                  </div>
                </button>
              </div>
            ) : (
              <div className={`p-8 rounded-2xl text-center ${isAuto ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-indigo/10 border border-indigo/20'}`}>
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 ${isAuto ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400' : 'bg-indigo/20 border border-indigo/30 text-indigo'}`}>
                  <Check size={32} />
                </div>
                <h3 className="text-lg font-black text-pure-white uppercase tracking-widest mb-1">Proposal Online</h3>
                <p className="text-gray-500 text-xs mb-6">Link hazır. Müşteriye e-posta gönderin veya kopyalayın.</p>

                <div className="bg-black border border-white/10 rounded-xl p-4 flex items-center gap-3 mb-4">
                  <div className="flex-1 overflow-hidden">
                    <div className={`text-[8px] font-black uppercase tracking-[0.3em] text-left mb-1 ${isAuto ? 'text-emerald-400' : 'text-indigo'}`}>Proposal URL</div>
                    <input readOnly value={generatedLink} className="bg-transparent border-none text-white text-xs w-full outline-none font-mono truncate" />
                  </div>
                  <button onClick={copyToClipboard} className={`w-10 h-10 bg-white/5 rounded-lg transition-all flex items-center justify-center ${isAuto ? 'hover:bg-emerald-500 text-emerald-400 hover:text-white' : 'hover:bg-indigo text-indigo hover:text-white'}`}>
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={handleSendEmail}
                    disabled={isSendingEmail || emailSent}
                    className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.3em] transition-all disabled:cursor-default ${emailSent ? 'bg-white/5 border border-white/10 text-gray-500' : isAuto ? 'bg-emerald-500 hover:bg-emerald-600 text-white' : 'bg-indigo hover:bg-indigo-600 text-white'}`}
                  >
                    {isSendingEmail ? <Loader2 size={13} className="animate-spin" /> : emailSent ? <Check size={13} /> : <Send size={13} />}
                    {isSendingEmail ? 'Gönderiliyor...' : emailSent ? 'E-posta Gönderildi' : `${selectedMessage?.email} adresine Gönder`}
                  </button>
                  <div className="flex gap-3">
                    <button onClick={() => window.open(generatedLink, '_blank')} className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border transition-colors ${isAuto ? 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10' : 'border-indigo/30 text-indigo hover:bg-indigo/10'}`}>
                      Önizle
                    </button>
                    <button onClick={() => { setGeneratedLink(''); setEmailSent(false); setIsSendingEmail(false); }} className="flex-1 py-2.5 rounded-xl text-[10px] font-bold text-gray-600 uppercase tracking-widest border border-white/5 hover:text-white hover:border-white/20 transition-all">
                      Yeniden Oluştur
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Empty state when nothing selected */}
      {!selectedMessage && !loading && messages.length > 0 && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <FileText size={48} className="text-gray-700 mx-auto mb-4" />
            <p className="text-gray-600 text-sm font-medium">Detay ve teklif oluşturmak için bir mesaj seçin</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMessages;
