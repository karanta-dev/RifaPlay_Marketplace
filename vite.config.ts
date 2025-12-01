import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx'; // Importa el plugin
// import path from 'path';
import { VitePWA } from 'vite-plugin-pwa'

import { fileURLToPath, URL } from 'url'

export default defineConfig({
  plugins: [vue(), 
    vueJsx(),
      // Configuración de la PWA
    VitePWA({
      registerType: 'autoUpdate',
      
      // Incluye el favicon.ico y apple-touch-icon.png en la raíz
      includeAssets: ['favicon.ico', 'apple-touch-icon.png'],

      manifest: {
        name: 'Rifa Play',
        short_name: 'RifaPlay',
        description: 'La plataforma definitiva para tus rifas.',
        theme_color: '#ffffff', // Color de la barra de herramientas
        background_color: '#ffffff',
        display: 'standalone',

        // --- ¡AQUÍ ESTÁ LA MAGIA! ---
        // El plugin usará el icono que le indiques para generar todos los demás.
        icons: [
          {
            src: 'rifaLogo-192x192.png', 
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'rifaLogo-512x512.png', 
            sizes: '512x512',
            type: 'image/png'
          },
          {
         
            src: 'rifaLogo-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable' // 'maskable' permite que el icono se adapte a diferentes formas
          }
        ]
      },
      
      // Opcional: para que el plugin genere los iconos por ti
      // desde tu icono base de 512x512.
      devOptions: {
        enabled: true
      }
    })
  
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});