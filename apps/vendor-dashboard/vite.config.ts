import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: process.env.NODE_ENV === 'production' ? '/vendor/' : './',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, '../../packages/shared'),
      '@ease2event/ui': path.resolve(__dirname, '../../packages/ui'),
    },
  },
  server: {
    port: Number(process.env.VITE_VENDOR_PORT) || 5174,
    strictPort: true,
    host: true,
    hmr: {
      port: Number(process.env.VITE_VENDOR_PORT) || 5174,
    },
    fs: {
      allow: ['..'],
    },
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})
