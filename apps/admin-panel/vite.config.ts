import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: './',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, '../../packages/shared'),
      '@ease2event/ui': path.resolve(__dirname, '../../packages/ui'),
    },
  },
  server: {
    port: Number(process.env.VITE_ADMIN_PORT) || 5175,
    strictPort: true,
    host: true,
    hmr: {
      port: Number(process.env.VITE_ADMIN_PORT) || 5175,
    },
    fs: {
      allow: ['..'],
    },
  },
})
