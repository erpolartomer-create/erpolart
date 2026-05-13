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
        ...Array.from({ length: 15 }, (_, i) => `/projects/${i + 1}`),
        ...Array.from({ length: 8 }, (_, i) => `/templates/${i + 1}`),
      ]
    })
  ],
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
