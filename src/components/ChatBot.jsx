import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User, Loader2, AlertCircle, Shield, RotateCcw } from 'lucide-react';
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
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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
  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim() || isTyping) return;

    if (!canSendMessage()) {
      setError("Günlük operasyon limitinize ulaştınız. Yarına kadar işlem yapılamaz.");
      return;
    }

    const userMessage = input.trim();
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
          addMessage({ role: 'assistant', content: response.data.text });
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
    if (role === 'user') return 'bg-indigo text-white rounded-tr-none';
    if (role === 'admin') return 'bg-gradient-to-br from-amber-500/20 to-orange-500/10 text-amber-100 border border-amber-500/30 rounded-tl-none';
    return 'bg-white/5 text-gray-200 border border-white/10 rounded-tl-none';
  };

  const getAvatarStyle = (role) => {
    if (role === 'user') return 'bg-white/5 text-white';
    if (role === 'admin') return 'bg-amber-500/20 text-amber-400 border border-amber-500/30';
    return 'bg-indigo/20 text-indigo border border-indigo/30';
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
    <div ref={containerRef} className={`fixed ${shouldLift ? 'bottom-32 lg:bottom-6' : 'bottom-6'} right-6 z-[9999] font-sans`}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-20 right-0 w-[350px] sm:w-[400px] h-[500px] bg-[#0f0f18]/95 backdrop-blur-xl border border-white/[0.08] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/[0.08] bg-white/[0.02] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo/20 border border-indigo/30 flex items-center justify-center text-indigo">
                  <Bot size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">ErpolArt Core System</h3>
                  <p className="text-[10px] text-gray-500 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Aktif | Kalan İşlem: {25 - dailyCount}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {/* Yeni Sohbet Butonu */}
                <button
                  onClick={handleNewChat}
                  aria-label="Yeni sohbet başlat"
                  className="p-2 hover:bg-white/5 rounded-lg text-gray-500 hover:text-white transition-colors"
                >
                  <RotateCcw size={16} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  aria-label="Sohbeti kapat"
                  className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10">
              {messages.length === 0 && (
                <div className="text-center py-10 px-6">
                  <div className="w-16 h-16 bg-indigo/10 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo">
                    <Bot size={32} />
                  </div>
                  <h4 className="text-white font-bold mb-2">Sistem İnşasına Hoş Geldiniz</h4>
                  <p className="text-gray-400 text-xs leading-relaxed">
                    Ben ErpolArt sistem asistanı. Yüksek performanslı SaaS mimarileri ve Exclusive (Tek Satış) protokolümüz hakkında bilgi almak veya projenizi başlatmak için sorunuzu iletin.
                  </p>
                </div>
              )}

              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-[10px] ${getAvatarStyle(msg.role)}`}>
                      {getIcon(msg.role)}
                    </div>
                    <div className={`p-3 rounded-2xl text-sm leading-relaxed ${getBubbleStyle(msg.role)}`}>
                      {renderContent(msg.content)}
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex gap-3 max-w-[85%]">
                    <div className="w-8 h-8 rounded-lg bg-indigo/20 text-indigo border border-indigo/30 flex items-center justify-center">
                      <Loader2 size={14} className="animate-spin" />
                    </div>
                    <div className="bg-white/5 text-gray-400 p-3 rounded-2xl rounded-tl-none border border-white/10 italic text-xs">
                      Sistem Yanıtı Hazırlanıyor...
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-start gap-2">
                  <AlertCircle size={14} className="mt-0.5" />
                  {error}
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-4 border-t border-white/[0.08] bg-white/[0.01]">
              <div className="relative flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={dailyCount >= 25 ? "Günlük limit doldu" : "Komutunuzu girin..."}
                  disabled={dailyCount >= 25 || isTyping}
                  className="flex-1 bg-white/[0.03] border border-white/[0.08] focus:border-indigo/50 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition-all pr-12"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping || dailyCount >= 25}
                  className="absolute right-1.5 p-2 bg-indigo hover:bg-indigo-600 disabled:opacity-50 disabled:bg-white/5 text-white rounded-lg transition-all"
                >
                  {isTyping ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                </button>
              </div>
              <p className="text-[10px] text-center text-gray-600 mt-3">
                Powered by ErpolArt Core & Gemini 2.5
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-300 ${isOpen ? 'bg-white text-indigo' : 'bg-indigo text-white'
          }`}
      >
        {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
        {!isOpen && dailyCount < 25 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 text-[10px] font-bold text-white rounded-full flex items-center justify-center border-2 border-[#0f0f18]">
            1
          </span>
        )}
      </motion.button>
    </div>
  );
};

export default ChatBot;