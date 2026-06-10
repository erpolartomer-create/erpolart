import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import sitemap from 'vite-plugin-sitemap'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    sitemap({
      hostname: 'https://erpolart.com',
      dynamicRoutes: [
        '/projects',
        '/templates',
        '/about',
        '/contact',
        '/saas',
        '/ai-automations',
        // SaaS vaka çalışmaları
        '/saas/case-study/project1',
        '/saas/case-study/project2',
        '/saas/case-study/project3',
        '/saas/case-study/contractoros',
        '/saas/case-study/brandpulse',
        // Yasal sayfalar (indexlenebilir — e-ticaret güven sinyali)
        '/gizlilik-politikasi',
        '/kvkk-metni',
        '/mesafeli-satis-sozlesmesi',
        '/iptal-ve-iade-kosullari',
        // Statik portföy projeleri
        ...Array.from({ length: 15 }, (_, i) => `/projects/${i + 1}`),
        // Şablon detayları (DB'den; satılınca /templates'e yönlenir)
        ...Array.from({ length: 8 }, (_, i) => `/templates/${i + 1}`),
      ],
      // Özel/auth gerektiren sayfalar sitemap dışı
      exclude: [
        '/admin', '/dashboard', '/workspace', '/order', '/order-success',
        '/order-cancel', '/update-password', '/forgot-password', '/auth', '/proposal',
      ],
      // robots.txt politikası — AI/GEO crawler'larına açık izin
      robots: [
        { userAgent: '*', allow: '/', disallow: ['/admin', '/dashboard', '/workspace', '/order', '/update-password', '/forgot-password', '/auth'] },
        { userAgent: 'GPTBot', allow: '/' },
        { userAgent: 'OAI-SearchBot', allow: '/' },
        { userAgent: 'ChatGPT-User', allow: '/' },
        { userAgent: 'ClaudeBot', allow: '/' },
        { userAgent: 'Claude-Web', allow: '/' },
        { userAgent: 'anthropic-ai', allow: '/' },
        { userAgent: 'PerplexityBot', allow: '/' },
        { userAgent: 'Google-Extended', allow: '/' },
        { userAgent: 'CCBot', allow: '/' },
      ],
    })
  ],
  optimizeDeps: {
    include: ['three', 'postprocessing'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('three') || id.includes('postprocessing')) {
            return 'three-bundle';
          }
        },
      },
    },
  },
  server: {
    port: 5253,
    proxy: {
      '/api': {
        target: 'http://localhost:5002',
        changeOrigin: true
      }
    }
  },
})
