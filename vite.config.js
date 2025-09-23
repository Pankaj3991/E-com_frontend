import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server:{
    host: true,  // Set this to true to allow the server to be accessed externally
    proxy:{
      // '/api/v1':'http://127.0.0.1:5173/'
      '/api/v1':'https://ecom-backend-1-0mwh.onrender.com/',
    }
  },
  plugins: [react()],
  base: './', // important for vercel (relative paths)
})
