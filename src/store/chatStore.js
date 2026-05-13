import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useChatStore = create(
  persist(
    (set, get) => ({
      // ─── TRANSIENT STATE (DB'den gelir, localStorage'a YAZILMAZ) ───
      messages: [],
      isTyping: false,

      // ─── PERSISTENT STATE (localStorage'da kalır) ───
      dailyCount: 0,
      lastResetDate: new Date().toDateString(),
      isOpen: false,

      // ─── ACTIONS ───
      setIsOpen: (isOpen) => set({ isOpen }),
      setIsTyping: (isTyping) => set({ isTyping }),

      addMessage: (message) => {
        const today = new Date().toDateString();
        const { dailyCount, lastResetDate } = get();

        let currentCount = dailyCount;
        if (today !== lastResetDate) {
          currentCount = 0;
        }

        set((state) => ({
          messages: [...state.messages, message],
          dailyCount: message.role === 'user' ? currentCount + 1 : currentCount,
          lastResetDate: today,
        }));
      },

      setMessages: (messages) => set({ messages }),
      clearHistory: () => set({ messages: [] }),

      canSendMessage: () => {
        const today = new Date().toDateString();
        const { dailyCount, lastResetDate } = get();
        if (today !== lastResetDate) return true;
        return dailyCount < 25;
      }
    }),
    {
      name: 'erpolart-chat-v2',
      storage: createJSONStorage(() => localStorage),
      // ✅ KRİTİK: Sadece UI state'i persist et, mesajları ASLA localStorage'a yazma
      partialize: (state) => ({
        dailyCount: state.dailyCount,
        lastResetDate: state.lastResetDate,
        isOpen: state.isOpen,
      }),
    }
  )
);

export default useChatStore;
