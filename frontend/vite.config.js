import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['@reduxjs/toolkit'],
  },
  server: {
    proxy: {
      '/posts': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
      proxy: {
      '/user': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  }
  },
})
