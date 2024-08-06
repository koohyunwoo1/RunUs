import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'https://localhost:8000',
    },
  },
  build: {
    rollupOptions: {
      input: {
        app: './index.html',
        'firebase-messaging-sw': './public/firebase-messaging-sw.js',
      },
    },
  },
})