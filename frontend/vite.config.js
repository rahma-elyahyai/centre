import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  root: './',
  server: {
    port: 3000,  // Utiliser le port 3000 au lieu de 5173
    host: true
  } // Assure-toi que le root est correct
})
