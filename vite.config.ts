import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  root: 'frontend',
  base: '/',
  plugins: [react()],
  server: {
    open: true,
    port: 5173
  },
  build: {
    outDir: '../dist'
  }
})