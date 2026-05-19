import { useState, useEffect, useRef, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, User, Bot, Send, Shield, 
  Zap, ZapOff, Search, Circle
} from 'lucide-react';
import { supabaseAdmin } from '../../lib/supabaseAdmin';
import { io } from 'socket.io-client';

const AdminChatDashboard = () => {
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const selectedSessionRef = useRef(null);

  // Ref'i senkronize tut (socket callback'lerinde güncel değeri okumak için)
  useEffect(() => {
    selectedSessionRef.current = selectedSession;
  }, [selectedSession]);

  // ── 1. Tek Seferlik Socket Bağlantısı ──
  useEffect(() => {
    const socketUrl = window.location.hostname === 'localhost' ? 'http://localhost:5001' : import.meta.env.VITE_API_URL;
    socketRef.current = io(socketUrl);

    supabaseAdmin.auth.getSession().then(({ data: { session } }) => {
      if (session?.access_token) {
        socketRef.current.emit('admin_join', session.access_token);
      }
    });

    // Gelen mesajları dinle
    socketRef.current.on('new_message', (payload) => {
      const current = selectedSessionRef.current;
      if (current && payload.sessionId === current) {
        setMessages(prev => {
          // Mükerrer kontrol
          const isDupe = prev.some(m => 
            m.content === payload.content && m.role === payload.role &&
            Math.abs(new Date(m.created_at || 0) - new Date(payload.timestamp || 0)) < 2000
          );
          if (isDupe) return prev;
          return [...prev, { ...payload, created_at: payload.timestamp }];
        });
      }

      // Session listesini hafif güncelle (tam DB sorgusu yerine)
      setSessions(prev => {
        const idx = prev.findIndex(s => s.id === payload.sessionId);
        const updated = {
          id: payload.sessionId,
          lastMessage: payload.content,
          timestamp: payload.timestamp || new Date().toISOString(),
          role: payload.role
        };
        if (idx >= 0) {
          const copy = [...prev];
          copy[idx] = { ...copy[idx], ...updated };
          // En son mesaj olan oturumu öne taşı
          const [item] = copy.splice(idx, 1);
          copy.unshift(item);
          return copy;
        }
        return [updated, ...prev];
      });
    });

    socketRef.current.on('bot_status_update', ({ sessionId, isMuted: muted }) => {
      if (selectedSessionRef.current === sessionId) {
        setIsMuted(muted);
      }
    });

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, []); // Boş dependency — tek sefer çalışır

  // ── 2. Oturumları DB'den Çek (Sadece sayfa açılışında) ──
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const { data, error } = await supabaseAdmin
          .from('chat_messages')
          .select('session_id, role, content, created_at, user_id')
          .order('created_at', { ascending: false });
        if (error) throw error;

        const uniqueSessions = [];
        const seen = new Set();
        data.forEach(msg => {
          if (!seen.has(msg.session_id)) {
            seen.add(msg.session_id);
            uniqueSessions.push({
              id: msg.session_id,
              lastMessage: msg.content,
              timestamp: msg.created_at,
              userId: msg.user_id,
              role: msg.role
            });
          }
        });
        setSessions(uniqueSessions);
      } catch (err) {
        console.error('Error fetching sessions:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, []);

  // ── 3. Seçilen Oturumun Mesajlarını Çek ──
  useEffect(() => {
    if (!selectedSession) return;

    const fetchMessages = async () => {
      try {
        const { data, error } = await supabaseAdmin
          .from('chat_messages')
          .select('*')
          .eq('session_id', selectedSession)
          .order('created_at', { ascending: true });
        if (error) throw error;
        setMessages(data || []);
      } catch (err) {
        console.error('Error fetching messages:', err);
      }
    };

    fetchMessages();
    if (socketRef.current) {
      socketRef.current.emit('join_session', selectedSession);
      // Sunucudan gerçek mute durumunu sorgula
      socketRef.current.emit('check_mute_status', selectedSession);
    }
  }, [selectedSession]);

  // ── Scroll ──
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── 4. Admin Mesaj Gönder ──
  const handleSendMessage = useCallback(async (e) => {
    e?.preventDefault();
    if (!input.trim() || !selectedSession) return;

    const adminMessage = input.trim();
    setInput('');

    const now = new Date().toISOString();

    // 1. Önce local state'e ekle (anında görünsün)
    setMessages(prev => [...prev, { role: 'admin', content: adminMessage, created_at: now }]);

    // 2. Socket ile müşteriye gönder
    if (socketRef.current) {
      socketRef.current.emit('admin_send_message', {
        sessionId: selectedSession,
        content: adminMessage
      });
    }

    // 3. DB'ye kaydet
    try {
      await supabaseAdmin.from('chat_messages').insert([{
        session_id: selectedSession,
        role: 'admin',
        content: adminMessage
      }]);
    } catch (err) {
      console.error('Error saving admin message:', err);
    }
  }, [input, selectedSession]);

  // ── 5. Mute/Unmute Toggle ──
  const handleToggleMute = useCallback(() => {
    if (!selectedSession || !socketRef.current) return;
    const newMuteState = !isMuted;
    setIsMuted(newMuteState);
    socketRef.current.emit(newMuteState ? 'mute_bot' : 'unmute_bot', selectedSession);
  }, [isMuted, selectedSession]);

  const filteredSessions = sessions.filter(s => 
    s.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (s.lastMessage && s.lastMessage.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="h-[calc(100vh-160px)] flex gap-6">
      <Helmet>
        <title>Admin Chat - ErpolArt</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      {/* Sidebar */}
      <div className="w-80 flex flex-col bg-[#0f0f18] border border-white/5 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-white/5">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input type="text" placeholder="Search sessions..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white outline-none focus:border-indigo/50 transition-all" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/5">
          {loading ? (
            <div className="p-8 text-center text-gray-500 text-xs">Loading sessions...</div>
          ) : filteredSessions.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-xs">No active sessions found.</div>
          ) : (
            filteredSessions.map(session => (
              <div key={session.id} onClick={() => setSelectedSession(session.id)}
                className={`p-4 border-b border-white/[0.02] cursor-pointer transition-all hover:bg-white/[0.02] ${selectedSession === session.id ? 'bg-indigo/10 border-l-4 border-l-indigo' : ''}`}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black text-white uppercase tracking-wider truncate max-w-[120px]">
                      {session.id.replace(/^(user_|guest_)/, '').substring(0, 10)}...
                    </span>
                  </div>
                  <span className="text-[8px] text-gray-600 font-bold">
                    {new Date(session.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-[10px] text-gray-500 truncate italic">
                  {session.role === 'user' ? '👤' : session.role === 'admin' ? '🛡️' : '🤖'} {session.lastMessage}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Chat */}
      <div className="flex-1 flex flex-col bg-[#0f0f18] border border-white/5 rounded-2xl overflow-hidden relative">
        <AnimatePresence mode="wait">
          {!selectedSession ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-center text-center p-12">
              <div className="w-20 h-20 bg-indigo/10 rounded-full flex items-center justify-center mb-6 text-indigo/40 border border-indigo/20">
                <MessageSquare size={40} />
              </div>
              <h3 className="text-xl font-black text-white uppercase tracking-widest mb-2 italic">Select a Terminal</h3>
              <p className="text-gray-500 text-xs font-medium max-w-xs">İzlemek veya müdahale etmek istediğiniz canlı sohbet oturumunu sol menüden seçin.</p>
            </motion.div>
          ) : (
            <motion.div key={selectedSession} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              className="flex-1 flex flex-col h-full">
              {/* Header */}
              <div className="p-4 border-b border-white/5 bg-white/[0.01] flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo/10 border border-indigo/20 flex items-center justify-center text-indigo"><User size={20} /></div>
                  <div>
                    <h4 className="text-sm font-black text-white uppercase tracking-tighter">Session: {selectedSession.substring(0, 16)}...</h4>
                    <p className="text-[9px] text-gray-500 font-bold flex items-center gap-1 uppercase">
                      <Circle size={8} className="fill-emerald-500 text-emerald-500" /> Live Interaction
                    </p>
                  </div>
                </div>
                <button onClick={handleToggleMute}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${isMuted 
                    ? 'bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20' 
                    : 'bg-indigo/10 border-indigo/20 text-indigo hover:bg-indigo/20'}`}>
                  {isMuted ? <ZapOff size={14} /> : <Zap size={14} />}
                  {isMuted ? 'AI Muted' : 'AI Active'}
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-white/5 bg-[#0a0a0f]/50">
                {messages.map((msg, i) => (
                  <div key={`${i}-${msg.created_at}`} className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}>
                    <div className={`flex gap-4 max-w-[70%] ${msg.role === 'user' ? '' : 'flex-row-reverse'}`}>
                      <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center border ${msg.role === 'user' 
                        ? 'bg-white/5 border-white/10 text-white' 
                        : msg.role === 'admin' ? 'bg-indigo border-indigo text-white' 
                        : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'}`}>
                        {msg.role === 'user' ? <User size={14} /> : msg.role === 'admin' ? <Shield size={14} /> : <Bot size={14} />}
                      </div>
                      <div className="space-y-1">
                        <div className={`p-4 rounded-2xl text-xs leading-relaxed font-medium ${msg.role === 'user' 
                          ? 'bg-[#0f0f18] text-gray-300 border border-white/5 rounded-tl-none' 
                          : msg.role === 'admin' ? 'bg-indigo text-white rounded-tr-none shadow-lg shadow-indigo/20' 
                          : 'bg-emerald-500/5 text-emerald-100 border border-emerald-500/20 rounded-tr-none'}`}>
                          {msg.content}
                        </div>
                        <div className={`text-[8px] font-black text-gray-600 uppercase tracking-widest ${msg.role === 'user' ? 'text-left' : 'text-right'}`}>
                          {msg.role === 'admin' ? 'ADMIN' : msg.role === 'user' ? 'CLIENT' : 'AI'} • {new Date(msg.created_at || Date.now()).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-white/5 bg-white/[0.01]">
                <div className="relative flex items-center gap-3">
                  <div className="flex-1 relative">
                    <input type="text" value={input} onChange={(e) => setInput(e.target.value)}
                      placeholder="Type a manual command or intervention..."
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-xs text-white outline-none focus:border-indigo/50 transition-all pr-12" />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      <div className={`w-2 h-2 rounded-full ${isMuted ? 'bg-red-500' : 'bg-emerald-500'} animate-pulse`} />
                    </div>
                  </div>
                  <button type="submit" disabled={!input.trim()}
                    className="w-12 h-12 bg-indigo hover:bg-indigo-600 disabled:opacity-50 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo/20 transition-all active:scale-95">
                    <Send size={18} />
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminChatDashboard;
