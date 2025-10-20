import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react({
      jsxImportSource: '@emotion/react',
    }),
    // Add the VitePWA plugin here
    VitePWA({
      registerType: 'autoUpdate',
      // Caching strategies
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      },
      // Web App Manifest
      manifest: {
        name: 'Sona',
        short_name: 'Sona',
        description: 'A platform for online counselling sessions.',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'Sona-flat.png', // create this icon and place it in the public folder
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'Sona-flat.png', // create this icon and place it in the public folder
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'Sona-flat.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable' // To ensure the icon looks good on all devices
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@emotion/core': '@emotion/react',
    },
  },
  optimizeDeps: {
    include: ['@emotion/styled', '@emotion/react'],
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
    },
  },
})
