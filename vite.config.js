import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', 
    port: 3001, 
    hmr: {
      host: '192.168.12.113', 
      port: 3001, 
    }
  },
})
