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
      '/posts': 'http://localhost:5000', // Redirects API calls to the backend
    },
  },
})
