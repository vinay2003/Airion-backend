import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/admin/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, '../../packages/shared'),
      '@airion/ui': path.resolve(__dirname, '../../packages/ui'),
    },
  },
  server: {
    port: 5175,
    strictPort: true,
    host: true,
    hmr: {
      port: 5175,
    },
    fs: {
      allow: ['..'],
    },
  },
})
