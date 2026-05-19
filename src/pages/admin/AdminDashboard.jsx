import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { io } from 'socket.io-client';
import {
  Layers,
  Users,
  ShoppingCart,
  MessageSquare,
  TrendingUp,
  Eye,
  ChevronRight,
  ArrowRight,
  Bell,
  Volume2,
  VolumeX,
  X as CloseIcon,
  BarChart2,
  Search,
  Tag
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabaseAdmin } from '../../lib/supabaseAdmin';

const StatCard = ({ icon: Icon, label, value, color, bgColor }) => (
  <div className="bg-[#0f0f18] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all group">
    <div className="flex items-center justify-between mb-4">
      <div className={`w-10 h-10 rounded-xl ${bgColor} flex items-center justify-center ${color}`}>
        <Icon size={20} />
      </div>
      <TrendingUp size={14} className="text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
    <div className="text-2xl font-black text-pure-white mb-1">{value}</div>
    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">{label}</div>
  </div>
);

const AdminDashboard = () => {
  const [templates, setTemplates] = useState([]);
  const [orders, setOrders] = useState([]);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeAlert, setActiveAlert] = useState(null);
  const [socket, setSocket] = useState(null);
  const [mutedSessions, setMutedSessions] = useState(new Set());

  useEffect(() => {
    // Socket.io Bağlantısı
    const newSocket = io('http://localhost:5002'); // Backend URL (.env PORT=5002)
    setSocket(newSocket);

    newSocket.on('new_lead_alert', (lead) => {
      setActiveAlert(lead);
      try { new Audio('/alert.mp3').play().catch(() => {}); } catch {}
    });

    newSocket.on('bot_status_update', ({ sessionId, isMuted }) => {
      setMutedSessions(prev => {
        const next = new Set(prev);
        if (isMuted) next.add(sessionId);
        else next.delete(sessionId);
        return next;
      });
    });

    return () => newSocket.close();
  }, []);

  const handleMuteBot = (sessionId) => {
    if (socket) {
      socket.emit('mute_bot', sessionId);
    }
  };

  const handleUnmuteBot = (sessionId) => {
    if (socket) {
      socket.emit('unmute_bot', sessionId);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [templatesRes, ordersRes, leadsRes] = await Promise.all([
          supabaseAdmin.from('templates').select('*', { count: 'exact' }).eq('project_code', 'erpolart'),
          supabaseAdmin.from('orders').select('*').eq('project_code', 'erpolart'),
          supabaseAdmin.from('leads').select('*', { count: 'exact' }).eq('project_code', 'erpolart')
        ]);
        setTemplates(templatesRes.data || []);
        setOrders(ordersRes.data || []);
        setLeads(leadsRes.data || []);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const availableCount = templates.filter(t => t.status === 'available').length;
  const recentOrders = [...orders].reverse().slice(0, 5);

  return (
    <div className="font-outfit">
      <Helmet>
        <title>Admin Panel - ErpolArt</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="mb-10 relative">
        <h1 className="text-4xl font-black text-pure-white tracking-tight mb-2">Command <span className="text-indigo italic">Center</span></h1>
        <p className="text-gray-500 text-sm font-medium">Digital Atelier operational status and high-level summaries.</p>

        {/* Lead Alert Overlay (Büyük Bildirim) */}
        <AnimatePresence>
          {activeAlert && (
            <motion.div 
              initial={{ opacity: 0, y: -50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed top-10 left-1/2 -translate-x-1/2 z-[100] w-full max-w-xl px-6"
            >
              <div className="bg-[#1a1a2e] border-2 border-indigo shadow-[0_0_50px_rgba(99,102,241,0.3)] rounded-[2rem] p-8 backdrop-blur-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo via-violet to-cyan" />
                
                <button 
                  onClick={() => setActiveAlert(null)}
                  className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"
                >
                  <CloseIcon size={20} />
                </button>

                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-indigo/20 flex items-center justify-center text-indigo shrink-0 animate-pulse">
                    <Bell size={32} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-[10px] font-black bg-indigo text-white px-2 py-0.5 rounded-full uppercase tracking-widest">Yeni Lead Yakalandı</span>
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{new Date().toLocaleTimeString()}</span>
                    </div>
                    <h3 className="text-xl font-black text-pure-white mb-2 leading-tight">
                      Müşteri iletişim tercihi bıraktı!
                    </h3>
                    <div className="bg-black/40 border border-white/5 rounded-xl p-4 mb-6">
                      <p className="text-gray-400 text-sm italic font-medium">"{activeAlert.message}"</p>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-[9px] font-black text-indigo/80 uppercase">Tip:</span>
                        <span className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">{activeAlert.type}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      {!mutedSessions.has(activeAlert.sessionId) ? (
                        <button 
                          onClick={() => handleMuteBot(activeAlert.sessionId)}
                          className="flex-1 bg-indigo hover:bg-indigo-600 text-white font-black text-[11px] uppercase tracking-widest py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo/20"
                        >
                          <VolumeX size={16} /> Botu Sustur ve Devral
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleUnmuteBot(activeAlert.sessionId)}
                          className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-black text-[11px] uppercase tracking-widest py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
                        >
                          <Volume2 size={16} /> Botu Geri Aç
                        </button>
                      )}
                      <button 
                        onClick={() => {
                          window.location.href = `/admin/messages?session=${activeAlert.sessionId}`;
                        }}
                        className="bg-white/5 hover:bg-white/10 text-white font-black text-[11px] uppercase tracking-widest py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
                      >
                        Sohbete Git
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-12">
        <StatCard icon={Layers} label="Total Templates" value={templates.length} color="text-indigo" bgColor="bg-indigo/10" />
        <StatCard icon={Eye} label="Available" value={availableCount} color="text-cyan" bgColor="bg-cyan/10" />
        <StatCard icon={ShoppingCart} label="Revenue Points" value={orders.length} color="text-green-500" bgColor="bg-green-500/10" />
        <StatCard icon={MessageSquare} label="Feedback Units" value={leads.length} color="text-violet" bgColor="bg-violet/10" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Recent Transactions */}
        <div className="xl:col-span-2 bg-[#0f0f18] border border-white/5 rounded-[32px] overflow-hidden shadow-2xl">
          <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
            <h2 className="text-[11px] font-black text-pure-white uppercase tracking-[0.2em]">Recent Transactions</h2>
            <Link to="/admin/orders" className="text-[10px] font-black text-indigo uppercase tracking-widest hover:text-white transition-colors flex items-center gap-2">
              View All <ArrowRight size={14} />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-gray-500">
                  <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest">Customer</th>
                  <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest">Template</th>
                  <th className="px-8 py-4 text-[9px] font-black uppercase tracking-widest">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.02]">
                {loading ? (
                  <tr><td colSpan="3" className="px-8 py-10 text-center text-[10px] font-black text-gray-700 uppercase tracking-widest animate-pulse">Syncing...</td></tr>
                ) : recentOrders.length === 0 ? (
                  <tr><td colSpan="3" className="px-8 py-10 text-center text-gray-600 text-xs">No recent activity.</td></tr>
                ) : (
                  recentOrders.map((order) => (
                    <tr key={order.id} className="group hover:bg-white/[0.01] transition-colors">
                      <td className="px-8 py-4 text-xs font-bold text-pure-white">
                        {order.customer_name || order.customer_email || 'Guest'}
                      </td>
                      <td className="px-8 py-4 text-xs text-gray-400">
                        {order.template_name || 'Unknown Asset'}
                      </td>
                      <td className="px-8 py-4">
                        <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${order.status === 'completed' ? 'text-green-400 bg-green-500/10' : 'text-orange-400 bg-orange-500/10'}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Insights */}
        <div className="bg-[#0f0f18] border border-white/5 rounded-[32px] p-8 space-y-8 shadow-2xl">
          <h3 className="text-[11px] font-black text-pure-white uppercase tracking-[0.2em] border-b border-white/5 pb-6">Operations Hub</h3>
          <div className="space-y-6">
            <Link to="/admin/templates" className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-indigo/50 transition-all group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo/10 flex items-center justify-center text-indigo group-hover:scale-110 transition-transform">
                  <Layers size={20} />
                </div>
                <div>
                  <p className="text-xs font-black text-pure-white tracking-tight uppercase">Templates</p>
                  <p className="text-[9px] text-gray-500 font-bold uppercase">Manage Catalog</p>
                </div>
              </div>
              <ChevronRight size={16} className="text-gray-700 group-hover:text-indigo" />
            </Link>

            <Link to="/admin/messages" className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-violet/50 transition-all group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-violet/10 flex items-center justify-center text-violet group-hover:scale-110 transition-transform">
                  <MessageSquare size={20} />
                </div>
                <div>
                  <p className="text-xs font-black text-pure-white tracking-tight uppercase">Messages</p>
                  <p className="text-[9px] text-gray-500 font-bold uppercase">Customer Intel</p>
                </div>
              </div>
              <ChevronRight size={16} className="text-gray-700 group-hover:text-violet" />
            </Link>

            <div className="border-t border-white/5 pt-6">
              <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-4">Google Tools</p>
              <div className="space-y-3">
                <a href="https://analytics.google.com" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-orange-500/50 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400 group-hover:scale-110 transition-transform">
                      <BarChart2 size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-black text-pure-white tracking-tight uppercase">Analytics</p>
                      <p className="text-[9px] text-gray-500 font-bold uppercase">GA4 Dashboard</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-gray-700 group-hover:text-orange-400" />
                </a>

                <a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-cyan/50 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-cyan/10 flex items-center justify-center text-cyan group-hover:scale-110 transition-transform">
                      <Search size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-black text-pure-white tracking-tight uppercase">Search Console</p>
                      <p className="text-[9px] text-gray-500 font-bold uppercase">SEO & Indexing</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-gray-700 group-hover:text-cyan" />
                </a>

                <a href="https://tagmanager.google.com" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-green-500/50 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-400 group-hover:scale-110 transition-transform">
                      <Tag size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-black text-pure-white tracking-tight uppercase">Tag Manager</p>
                      <p className="text-[9px] text-gray-500 font-bold uppercase">GTM Container</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-gray-700 group-hover:text-green-400" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
