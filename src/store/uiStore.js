import { create } from 'zustand';

const useUIStore = create((set) => ({
  theme: localStorage.getItem('theme') || 'dark', // default to dark for ErpolArt
  setTheme: (theme) => {
    localStorage.setItem('theme', theme);
    set({ theme });
  },
  toggleTheme: () => set((state) => {
    const newTheme = state.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', newTheme);
    return { theme: newTheme };
  })
}));

export default useUIStore;
