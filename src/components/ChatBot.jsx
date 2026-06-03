import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User, Loader2, AlertCircle, Shield, RotateCcw, Layers, ArrowUpRight, Sparkles } from 'lucide-react';
import axios from 'axios';
import { io } from 'socket.io-client';
import useChatStore from '../store/chatStore';
import useAuthStore from '../store/authStore';
import { supabase } from '../lib/supabase';

// ── Basit Markdown Link Renderer ──
const renderContent = (text) => {
  if (!text) return null;
  // Markdown linkleri: [text](url)
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
  return parts.map((part, i) => {
    const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (match) {
      const [, label, href] = match;
      if (href.startsWith('/') || href.startsWith('#')) {
        return <Link key={i} to={href} className="text-indigo underline hover:text-white transition-colors">{label}</Link>;
      }
      return <a key={i} href={href} target="_blank" rel="noopener noreferrer" className="text-indigo underline hover:text-white transition-colors">{label}</a>;
    }
    return <span key={i}>{part}</span>;
  });
};

// ── Fiyat biçimlendirme ──
const formatPrice = (p) => {
  const n = String(p ?? '').replace(/[^0-9.]/g, '');
  return n ? `$${n}` : '';
};

// ── Şablon Ürün Kartı (chatbot içi zengin gösterim) ──
const ProductCard = ({ p, best, onNavigate }) => (
  <Link
    to={`/templates/${p.id}`}
    onClick={onNavigate}
    className="group flex gap-3 p-2.5 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-indigo/40 hover:bg-white/[0.07] transition-all"
  >
    <div className="w-16 h-16 rounded-xl overflow-hidden bg-white/5 shrink-0">
      {p.image ? (
        <img src={p.image} alt={p.name} className="w-full h-full object-cover" loading="lazy" />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-600"><Layers size={18} /></div>
      )}
    </div>
    <div className="min-w-0 flex-1">
      <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
        <h4 className="text-[13px] font-bold text-white truncate">{p.name}</h4>
        {best && !p.is_sold && (
          <span className="text-[8px] font-black text-emerald-400 bg-emerald-500/15 border border-emerald-500/25 px-1.5 py-0.5 rounded-full uppercase tracking-wide whitespace-nowrap">En İyi Eşleşme</span>
        )}
        {p.is_sold && (
          <span className="text-[8px] font-black text-gray-400 bg-white/5 border border-white/10 px-1.5 py-0.5 rounded-full uppercase tracking-wide whitespace-nowrap">Satıldı</span>
        )}
      </div>
      {p.short_pitch && <p className="text-[11px] text-gray-400 line-clamp-1 mb-1.5">{p.short_pitch}</p>}
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] text-gray-500 flex items-center gap-1 truncate min-w-0">
          <Layers size={10} className="text-indigo shrink-0" /><span className="truncate">{p.category}</span>
        </span>
        <span className="text-[12px] font-black text-indigo shrink-0 flex items-center gap-0.5">
          {formatPrice(p.price)} <ArrowUpRight size={11} className="text-gray-500 group-hover:text-indigo transition-colors" />
        </span>
      </div>
    </div>
  </Link>
);

// ── SessionId Yardımcı ──
const getSessionId = (user) => {
  if (user?.id) {
    return `user_${user.id}`;
  }
  let guestId = localStorage.getItem('erpolart_guest_session');
  if (!guestId) {
    guestId = 'guest_' + Math.random().toString(36).substring(2, 12) + Date.now();
    localStorage.setItem('erpolart_guest_session', guestId);
  }
  return guestId;
};

const ChatBot = () => {
  const location = useLocation();
  const { messages, dailyCount, isOpen, setIsOpen, addMessage, setMessages, clearHistory, canSendMessage, isTyping, setIsTyping } = useChatStore();
  const { user } = useAuthStore();
  const socketRef = useRef(null);
  const containerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);
  const prevUserIdRef = useRef(null);

  const [input, setInput] = useState('');
  const [error, setError] = useState(null);
  const [sessionId, setSessionId] = useState('');
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const isBotMutedRef = useRef(false);

  // Admin panelinde chatbot'u gizle (Rules of Hooks: erken return TÜM hook'lardan
  // SONRA olmalı — yoksa render'lar arası hook sayısı değişir ve React çöker).
  const hiddenOnAdmin = location.pathname.startsWith('/admin');

  // ── Scroll ──
  const scrollToBottom = useCallback(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, []);

  // ── 0. Dışarı tıklayınca kapatma ──
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Chat açıldığında daima en alta kaydır
      setTimeout(scrollToBottom, 100);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, setIsOpen, scrollToBottom]);

  // ── 1. SessionId Yönetimi (Kullanıcı değişiminde otomatik güncelleme) ──
  useEffect(() => {
    const currentUserId = user?.id || null;
    const prevUserId = prevUserIdRef.current;
    const newSessionId = getSessionId(user);

    // Kullanıcı değiştiyse mesajları sıfırla
    if (prevUserId !== currentUserId && prevUserId !== null) {
      clearHistory();
      setHistoryLoaded(false);
    }

    prevUserIdRef.current = currentUserId;
    setSessionId(newSessionId);
  }, [user]);

  // ── 2. Socket Bağlantısı ──
  useEffect(() => {
    if (!sessionId) return;

    if (window.location.hostname === 'localhost') return;

    socketRef.current = io(import.meta.env.VITE_API_URL, { reconnectionAttempts: 1, timeout: 3000 });
    socketRef.current.emit('join_session', sessionId);

    socketRef.current.on('connect_error', () => {
      socketRef.current.disconnect();
    });

    // Socket üzerinden admin mesajlarını anında al
    socketRef.current.on('message', (msg) => {
      if (msg.role === 'admin') {
        addMessage({ role: 'admin', content: msg.content });
      }
    });

    socketRef.current.on('bot_status_update', ({ isMuted }) => {
      isBotMutedRef.current = isMuted;
    });

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [sessionId]);

  // ── 3. Sohbet Geçmişini Supabase'den Çek ──
  useEffect(() => {
    if (!sessionId || historyLoaded) return;

    const fetchHistory = async () => {
      try {
        const { data, error: fetchErr } = await supabase
          .from('chat_messages')
          .select('role, content, created_at')
          .eq('session_id', sessionId)
          .order('created_at', { ascending: true });

        if (fetchErr) {
          if (fetchErr.code === 'PGRST205') {
            console.warn('[ChatBot] chat_messages table not found.');
          } else {
            console.error('[ChatBot] History fetch error:', fetchErr);
          }
          setHistoryLoaded(true);
          return;
        }

        if (data && data.length > 0) {
          setMessages(data.map(m => ({ role: m.role, content: m.content })));
        } else {
          clearHistory();
        }
      } catch (err) {
        console.error('[ChatBot] Unexpected error:', err);
      } finally {
        setHistoryLoaded(true);
      }
    };

    fetchHistory();
  }, [sessionId, historyLoaded]);

  // ── 4. Polling Fallback (Sadece yeni mesajları ekler, mevcut mesajları silmez) ──
  useEffect(() => {
    if (!sessionId || !historyLoaded) return;

    const pollMessages = async () => {
      try {
        const { data } = await supabase
          .from('chat_messages')
          .select('role, content, created_at')
          .eq('session_id', sessionId)
          .order('created_at', { ascending: true });

        if (data && data.length > 0) {
          const currentCount = useChatStore.getState().messages.length;
          // Sadece DB'de DAHA FAZLA mesaj varsa güncelle (asla silme)
          if (data.length > currentCount) {
            setMessages(data.map(m => ({ role: m.role, content: m.content })));
          }
        }
      } catch (err) {
        // Sessizce geç
      }
    };

    const interval = setInterval(pollMessages, 4000);
    return () => clearInterval(interval);
  }, [sessionId, historyLoaded]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, isOpen, scrollToBottom]);

  // ── Yeni Sohbet Başlat ──
  const handleNewChat = async () => {
    clearHistory();
    // Misafir kullanıcı için yeni session
    if (!user) {
      const newGuestId = 'guest_' + Math.random().toString(36).substring(2, 12) + Date.now();
      localStorage.setItem('erpolart_guest_session', newGuestId);
      setSessionId(newGuestId);
      setHistoryLoaded(false);
    }
    setError(null);
  };

  // ── Mesaj Gönder ──
  const handleSend = async (e, presetText) => {
    e?.preventDefault();
    const raw = presetText ?? input;
    if (!raw.trim() || isTyping) return;

    if (!canSendMessage()) {
      setError("Günlük operasyon limitinize ulaştınız. Yarına kadar işlem yapılamaz.");
      return;
    }

    const userMessage = raw.trim();
    setInput('');
    setError(null);
    addMessage({ role: 'user', content: userMessage });
    if (!isBotMutedRef.current) setIsTyping(true);

    try {
      const history = [];
      messages.forEach((msg) => {
        const role = msg.role === 'user' ? 'user' : 'model';
        if (history.length === 0 || history[history.length - 1].role !== role) {
          history.push({
            role: role,
            parts: [{ text: msg.content }]
          });
        }
      });

      if (history.length > 0 && history[history.length - 1].role === 'user') {
        history.pop();
      }

      const statusLabel = user ? "Giriş yapmış müşteri" : "Misafir kullanıcı";

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/ai/chat`, {
        message: userMessage,
        userContext: statusLabel,
        history: history,
        sessionId: sessionId,
        userId: user?.id || null
      });

      // Muted durumda AI cevap vermez — sessizce geç
      if (response.data?.muted) {
        // Bot susturulmuş, admin canlı devrede
      } else if (response.data?.text) {
        // Polling zaten bu mesajı DB'den çekip eklemiş olabilir — tekrar ekleme
        const currentMessages = useChatStore.getState().messages;
        const lastMsg = currentMessages[currentMessages.length - 1];
        const alreadyAdded = lastMsg?.role === 'assistant' && lastMsg?.content === response.data.text;
        if (!alreadyAdded) {
          addMessage({ role: 'assistant', content: response.data.text, products: response.data.products || [] });
        }
      }
    } catch (err) {
      console.error("[ChatBot] Send error:", err);
      if (err.response?.status === 204) {
        // Bot susturulmuş, admin canlı devrede — sessizce bekle
      } else {
        setError("Sistem şu an yanıt veremiyor.");
      }
    } finally {
      setIsTyping(false);
    }
  };

  // ── Mesaj Balonu Renkleri ──
  const getBubbleStyle = (role) => {
    if (role === 'user') return 'bg-gradient-to-br from-indigo to-violet-600 text-white rounded-tr-sm shadow-lg shadow-indigo/30 [&_span]:text-white [&_a]:text-indigo-200';
    if (role === 'admin') return 'bg-gradient-to-br from-amber-500/15 to-orange-500/[0.08] text-amber-100 border border-amber-500/25 rounded-tl-sm';
    return 'bg-white/[0.07] text-gray-100 border border-white/[0.10] rounded-tl-sm';
  };

  const getAvatarStyle = (role) => {
    if (role === 'user') return 'bg-white/[0.07] text-gray-300 border border-white/10';
    if (role === 'admin') return 'bg-amber-500/15 text-amber-400 border border-amber-500/25';
    return 'bg-indigo/15 text-indigo border border-indigo/25';
  };

  const getIcon = (role) => {
    if (role === 'user') return <User size={14} />;
    if (role === 'admin') return <Shield size={14} />;
    return <Bot size={14} />;
  };

  const isTemplateDetail = location.pathname.startsWith('/templates/') && location.pathname !== '/templates';
  const isCheckout = location.pathname.startsWith('/checkout/');
  const isProjects = location.pathname === '/projects';
  const isSaaS = location.pathname === '/saas';
  const isAutomations = location.pathname === '/ai-automations';
  const isOrder = location.pathname === '/order';
  const shouldLift = isTemplateDetail || isCheckout || isProjects || isSaaS || isAutomations || isOrder;

  if (hiddenOnAdmin) return null;

  return (
    <div ref={containerRef} className={`fixed ${shouldLift ? 'bottom-32 lg:bottom-6' : 'bottom-6'} right-4 sm:right-6 z-[9999] font-sans`}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 340, damping: 32 }}
            className="absolute bottom-[72px] right-0 w-[92vw] sm:w-[390px] bg-gradient-to-b from-[#14132b]/96 via-[#100e22]/96 to-[#0c0a1a]/96 backdrop-blur-3xl border border-white/[0.09] rounded-[26px] shadow-[0_32px_80px_-16px_rgba(92,115,255,0.5),0_0_0_1px_rgba(255,255,255,0.04),inset_0_1px_0_rgba(255,255,255,0.08)] overflow-hidden"
            style={{ maxHeight: 'min(82vh, 580px)' }}
          >
            {/* Ambient glows */}
            <div className="absolute -top-20 -right-12 w-56 h-56 bg-indigo/[0.22] rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute -bottom-24 -left-12 w-56 h-56 bg-violet-500/[0.15] rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo/50 to-transparent pointer-events-none" />

            {/* Header */}
            <div className="relative z-10 shrink-0 px-4 py-3.5 border-b border-white/[0.05] flex items-center justify-between">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo/[0.06] via-transparent to-transparent pointer-events-none" />
              <div className="relative flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-indigo via-violet-600 to-cyan p-[1.5px] shadow-lg shadow-indigo/40">
                  <div className="w-full h-full rounded-xl bg-[#14132b] flex items-center justify-center text-white">
                    <Bot size={18} />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 border-[1.5px] border-[#14132b]" />
                  </span>
                </div>
                <div>
                  <h3 className="text-[13px] font-black italic leading-tight tracking-tight">
                    <span className="text-gray-100">ErpolArt</span>{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo to-cyan">AI</span>
                  </h3>
                  <p className="text-[10px] text-gray-400 flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    Çevrimiçi · {25 - dailyCount} işlem hakkı
                  </p>
                </div>
              </div>
              <div className="relative flex items-center gap-0.5">
                <button
                  onClick={handleNewChat}
                  aria-label="Yeni sohbet başlat"
                  className="p-2 hover:bg-white/[0.08] rounded-xl text-gray-400 hover:text-white transition-colors"
                >
                  <RotateCcw size={15} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  aria-label="Sohbeti kapat"
                  className="p-2 hover:bg-white/[0.08] rounded-xl text-gray-400 hover:text-white transition-colors"
                >
                  <X size={17} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div ref={messagesContainerRef} className="relative z-10 overflow-y-auto px-4 py-3 space-y-3 custom-scrollbar" style={{ maxHeight: 'min(52vh, 390px)' }}>
              {messages.length === 0 && (
                <div className="flex flex-col items-center text-center pt-5 pb-2 px-1 animate-in fade-in slide-in-from-bottom-3 duration-500">
                  <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo/20 to-violet-600/10 border border-indigo/20 flex items-center justify-center mb-3.5 text-indigo shadow-xl shadow-indigo/15">
                    <Sparkles size={24} />
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo/10 to-transparent" />
                  </div>
                  <h4 className="text-gray-100 font-black italic text-base mb-1.5 leading-tight">Yardıma mı ihtiyacın var?</h4>
                  <p className="text-gray-400 text-[11px] leading-relaxed max-w-[240px] mb-4">
                    Sana özel şablon önerebilir, fiyatları açıklayabilir ve projeni başlatabilirim.
                  </p>
                  <div className="flex flex-wrap gap-1.5 justify-center">
                    {['Bana şablon öner', 'Fiyatlar nedir?', 'SaaS projesi istiyorum', 'Nasıl çalışıyor?'].map((q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => handleSend(null, q)}
                        className="px-3 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.12] text-gray-300 text-[11px] hover:border-indigo/50 hover:bg-indigo/[0.12] hover:text-white transition-all active:scale-95"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg, i) => (
                <div key={i} className="space-y-2">
                  <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex gap-2.5 max-w-[87%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center ${getAvatarStyle(msg.role)}`}>
                        {getIcon(msg.role)}
                      </div>
                      <div className={`px-3.5 py-2.5 rounded-2xl text-[13px] leading-relaxed ${getBubbleStyle(msg.role)}`}>
                        {renderContent(msg.content)}
                      </div>
                    </div>
                  </div>

                  {/* Şablon kartları (zengin gösterim) */}
                  {msg.products?.length > 0 && (
                    <div className="pl-9 space-y-2">
                      {msg.products.map((p, pi) => (
                        <ProductCard key={p.id || pi} p={p} best={pi === 0} onNavigate={() => setIsOpen(false)} />
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo to-violet-600 p-[1.5px] flex-shrink-0">
                      <div className="w-full h-full rounded-[6px] bg-[#14132b] flex items-center justify-center text-indigo">
                        <Bot size={13} />
                      </div>
                    </div>
                    <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo/70 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo/70 animate-bounce" style={{ animationDelay: '120ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo/70 animate-bounce" style={{ animationDelay: '240ms' }} />
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="p-3 rounded-xl bg-red-500/[0.08] border border-red-500/20 text-red-400 text-xs flex items-start gap-2">
                  <AlertCircle size={13} className="mt-0.5 shrink-0" />
                  {error}
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="relative z-10 shrink-0 px-3 pt-2.5 pb-3 border-t border-white/[0.05]">
              <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.07] focus-within:border-indigo/40 focus-within:bg-white/[0.05] rounded-2xl px-1 py-1 transition-all duration-200">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={dailyCount >= 25 ? "Günlük limit doldu" : "Mesaj yazın..."}
                  disabled={dailyCount >= 25 || isTyping}
                  className="flex-1 bg-transparent pl-3 pr-1 py-2 text-[13px] placeholder-gray-500 outline-none disabled:opacity-40"
                  style={{ color: 'white', caretColor: '#818cf8' }}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping || dailyCount >= 25}
                  aria-label="Gönder"
                  className="w-9 h-9 flex items-center justify-center bg-gradient-to-br from-indigo to-violet-600 text-white rounded-xl shadow-md shadow-indigo/30 hover:scale-105 active:scale-95 disabled:from-white/10 disabled:to-white/10 disabled:shadow-none disabled:scale-100 transition-all shrink-0"
                >
                  {isTyping ? <Loader2 size={15} className="animate-spin" /> : <Send size={14} />}
                </button>
              </div>
              <p className="text-[9px] text-center text-gray-500 mt-2 tracking-wide">
                ErpolArt Core AI · sohbetiniz güvenli ve gizlidir
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.93 }}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Sohbeti kapat' : 'Sohbeti aç'}
        className={`relative w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${
          isOpen
            ? 'bg-white/10 backdrop-blur-xl border border-white/20 text-white shadow-[0_8px_24px_-4px_rgba(92,115,255,0.4)]'
            : 'bg-gradient-to-br from-indigo via-violet-600 to-cyan/80 text-white shadow-[0_12px_36px_-6px_rgba(92,115,255,0.65)]'
        }`}
      >
        {!isOpen && <span className="absolute inset-0 rounded-2xl bg-indigo/25 animate-ping" style={{ animationDuration: '2.8s' }} />}
        <span className="relative z-10">{isOpen ? <X size={22} /> : <MessageSquare size={22} />}</span>
        {!isOpen && (
          <span className="absolute -top-0.5 -right-0.5 z-20 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-[#08070f]" />
          </span>
        )}
      </motion.button>
    </div>
  );
};

export default ChatBot;