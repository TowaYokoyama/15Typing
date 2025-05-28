import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  server:{
    host:'0.0.0.0',
   port: parseInt(process.env.PORT ? process.env.PORT : '5173'),
  },
  plugins: [react(),
    tailwindcss(),
  ],
  
})
