import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    wasm(),
    topLevelAwait(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        id: '/index.html',
        start_url: '/',
        name: 'Gourmet2Go',
        short_name: 'G2G',
        description: 'A place for SC Students who want to place orders for Gourmet2Go.',
        theme_color: '#00659B',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          { src: 'SaultCollege.png', sizes: '192x192', type: 'image/png' },
          { src: 'SaultCollege.png', sizes: '512x512', type: 'image/png' },
        ],
        screenshots: [
          {
            src: 'screenshot.jpg',
            sizes: '1280x720',
            type: 'image/png',
            label: 'Desktop view',
            platform: 'wide', 
          },
          {
            src: 'screenshot.jpg',
            sizes: '375x667',
            type: 'image/png',
            label: 'Mobile view',
            platform: 'narrow', 
          },
        ],
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/vnnlrooakzcseeiqskxw\.supabase\.co\/.*/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'supabase-api-cache',
              expiration: { maxEntries: 50, maxAgeSeconds: 3600 },
            },
          },
        ],
      },
    }),
  ],
  base: process.env.VITE_BASE_PATH,
  server: { 
    host: true, 
    port: 5173, 
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000', 
        changeOrigin: true,
        secure: false,
      }
    }
  },
});