import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, X, AlertCircle, Zap, Globe, Server, Loader2, Camera, FileText, Users, Hexagon } from 'lucide-react';
import { supabaseAdmin } from '../../lib/supabaseAdmin';
import { toast } from '../../components/Toast';

const OrderModal = ({ order, onClose }) => {
  if (!order) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-[#0f0f18] border border-white/10 rounded-[40px] shadow-2xl overflow-hidden text-white animate-in fade-in zoom-in duration-300">
        <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
          <div>
            <h2 className="text-lg font-black uppercase tracking-tight font-outfit">Protokol Yapılandırması</h2>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">ID: {order.id}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors"><X size={20} className="text-gray-400" /></button>
        </div>
        <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar font-outfit">
          {/* ... existing fields ... */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-3xl bg-white/[0.02] border border-white/5 space-y-4">
              <div className="flex items-center gap-2 text-[9px] font-black text-cyan uppercase tracking-widest"><Globe size={12} /> Altyapı Ortamı</div>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${order.has_own_hosting ? 'bg-amber-500/10 text-amber-500' : 'bg-cyan/10 text-cyan'}`}>
                  {order.has_own_hosting ? <Server size={18} /> : <Globe size={18} />}
                </div>
                <div>
                  <p className="text-xs font-black uppercase">{order.has_own_hosting ? 'Self-Hosted' : 'Platform Hosting'}</p>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{order.has_own_hosting ? 'EXTERNAL_NODE' : 'ERPOLART_GRID'}</p>
                </div>
              </div>
            </div>
            <div className="p-5 rounded-3xl bg-white/[0.02] border border-white/5 space-y-4">
              <div className="flex items-center gap-2 text-[9px] font-black text-indigo uppercase tracking-widest"><Zap size={12} /> Abonelik Planı</div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo/10 flex items-center justify-center text-indigo"><Zap size={18} /></div>
                <div>
                  <p className="text-xs font-black uppercase">{order.subscription_plan || 'No Plan'}</p>
                  <p className="text-[10px] text-indigo font-black uppercase tracking-widest">${order.monthly_fee || 0}/MO</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="text-[10px] font-black text-amber-500 uppercase tracking-widest flex items-center gap-2">
              <FileText size={12} /> Yönetici Notları (Sadece Sen Görürsün)
            </div>
            <textarea 
              defaultValue={order.admin_notes || ''}
              onBlur={async (e) => {
                const note = e.target.value;
                const { error } = await supabaseAdmin.from('orders').update({ admin_notes: note }).eq('id', order.id);
                if (error) toast.error('Not kaydedilemedi: ' + error.message);
              }}
              placeholder="Sipariş hakkında not al..."
              className="w-full h-32 bg-white/[0.02] border border-white/10 rounded-3xl p-5 text-sm outline-none focus:border-indigo/50 transition-all resize-none"
            />
          </div>

          {order.brand_name || order.project_notes ? (
            <div className="space-y-6 text-left">
              <div className="space-y-2">
                <div className="text-[10px] font-black text-indigo uppercase tracking-widest">Marka Kimliği</div>
                <div className="p-5 bg-white/[0.01] border border-white/5 rounded-2xl"><p className="text-xl font-black italic">{order.brand_name || '—'}</p></div>
              </div>
              <div className="space-y-4">
                <div className="text-[10px] font-black text-cyan uppercase tracking-widest">Görsel Çekirdek (Asset)</div>
                <div className="p-8 bg-black/40 border border-white/5 rounded-2xl flex items-center justify-center min-h-[160px]">
                  {order.logo_url ? <img src={order.logo_url} alt="Logo" className="max-h-[120px] object-contain drop-shadow-2xl" /> : <p className="text-xs text-gray-600 italic">Logo henüz yüklenmedi</p>}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-10 bg-white/[0.01] rounded-3xl border border-dashed border-white/5">
              <AlertCircle className="mx-auto text-gray-700 mb-4" size={32} />
              <p className="text-gray-500 font-medium text-xs uppercase tracking-widest">Müşteri henüz formu doldurmadı.</p>
            </div>
          )}
        </div>
        <div className="px-8 py-6 border-t border-white/5 bg-white/[0.02] flex justify-end">
          <button onClick={onClose} className="px-6 py-3 rounded-xl bg-white text-black text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform">CLOSE PROTOCOL</button>
        </div>
      </div>
    </div>
  );
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabaseAdmin
        .from('orders')
        .select('*, templates:template_id(name, preview_image)')
        .eq('project_code', 'erpolart')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const requestStatusUpdate = (orderId, newStatus) => {
    const statusLabels = {
      awaiting_transfer: 'Ödeme Bekleniyor',
      active: 'Aktif Sistem',
      revision: 'Revizyon',
      development: 'Geliştirme'
    };
    setConfirmDialog({
      orderId,
      newStatus,
      label: statusLabels[newStatus] || newStatus
    });
  };

  const confirmStatusUpdate = async () => {
    if (!confirmDialog) return;
    const { orderId, newStatus } = confirmDialog;
    setConfirmDialog(null);
    setUpdatingId(orderId);
    try {
      const { error } = await supabaseAdmin.from('orders').update({ status: newStatus }).eq('id', orderId);
      if (error) throw error;
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (err) {
      toast.error('İşlem başarısız: ' + err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="font-outfit min-h-screen bg-deep-black text-white p-4 md:p-8">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-black text-pure-white tracking-tighter mb-2 italic uppercase">
          Global <span className="text-indigo">Transactions</span>
        </h1>
        <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.4em]">Manage and review all purchase protocols.</p>
      </div>

      <div className="bg-[#0f0f18] border border-white/5 rounded-[40px] overflow-hidden shadow-2xl">
        <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
          <h2 className="text-[11px] font-black text-pure-white uppercase tracking-[0.2em]">Order Registry</h2>
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest bg-white/5 px-4 py-1.5 rounded-full">{orders.length} total orders</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.01]">
                <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Order ID</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Customer</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Template</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">Amount</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Date</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest text-center">Status Protocol</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.02]">
              {loading ? (
                <tr><td colSpan="7" className="px-8 py-20 text-center animate-pulse font-black uppercase text-[10px] text-gray-600 tracking-[0.3em]">Synchronizing Records...</td></tr>
              ) : orders.map((order) => (
                <tr key={order.id} className="group hover:bg-white/[0.01] transition-colors">
                  <td className="px-8 py-5 text-[10px] font-black text-white/40 group-hover:text-indigo transition-colors tracking-tight uppercase italic font-mono">
                    {order.id.slice(-8)}
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo/10 flex items-center justify-center text-indigo shadow-inner"><Users size={14} /></div>
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-pure-white tracking-tight uppercase">{order.full_name || 'Anonymous User'}</span>
                        <span className="text-[9px] font-bold text-gray-600 lowercase">{order.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/5 bg-black/40 shrink-0">
                        {order.templates?.preview_image ? <img src={order.templates.preview_image} className="w-full h-full object-cover" alt="" /> : <div className="w-full h-full flex items-center justify-center text-gray-700"><Hexagon size={14} /></div>}
                      </div>
                      <span className="text-sm font-medium text-gray-400 italic">{order.templates?.name || 'Signature Architecture'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <span className="text-sm font-black text-pure-white">${order.amount || 0}</span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-[10px] font-bold text-gray-500">{order.created_at ? new Date(order.created_at).toLocaleDateString('tr-TR') : '---'}</span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="relative min-w-[180px] mx-auto w-fit">
                      <select
                        value={order.status}
                        disabled={updatingId === order.id}
                        onChange={(e) => requestStatusUpdate(order.id, e.target.value)}
                        className={`w-full appearance-none bg-white/5 border border-white/10 rounded-xl px-4 py-2 pr-10 text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer transition-all
                          ${order.status === 'active' ? 'text-emerald-500 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : order.status === 'awaiting_transfer' ? 'text-amber-500 border-amber-500/20' : 'text-gray-400'}`}
                      >
                        <option value="awaiting_transfer">Ödeme Bekleniyor</option>
                        <option value="active">Active System</option>
                        <option value="revision">Revision</option>
                        <option value="development">Development</option>
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        {updatingId === order.id ? <Loader2 size={12} className="animate-spin text-gray-400" /> : <ChevronRight size={12} className="text-gray-400" />}
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button onClick={() => setSelectedOrder(order)} className="px-5 py-2 rounded-xl bg-white/5 border border-white/5 text-white text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <OrderModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />

      {/* Confirmation Dialog */}
      <AnimatePresence>
        {confirmDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 10 }}
              className="bg-[#0f0f18] border border-white/10 rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 mx-auto mb-6">
                <AlertCircle size={32} />
              </div>
              <h3 className="text-xl font-black text-pure-white uppercase tracking-tight mb-2">Durum Değişikliği Onayla</h3>
              <p className="text-gray-400 text-sm mb-8">Bu siparişin durumunu <strong className="text-white">"{confirmDialog.label}"</strong> olarak değiştirmek istediğinize emin misiniz?</p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setConfirmDialog(null)}
                  className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
                >
                  İptal
                </button>
                <button 
                  onClick={confirmStatusUpdate}
                  className="flex-1 py-3 rounded-xl bg-indigo text-white text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg shadow-indigo/20"
                >
                  Onayla
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminOrders;