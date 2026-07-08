import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    // Mirrors the production `/api` -> backend service rewrite, so the same
    // relative baseURL works in dev without a VITE_API_URL override.
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
})
