import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import electron from 'vite-plugin-electron'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  // IMPORTANT : On active Electron si on fait "npm start" (mode electron)
  // OU si on est en train de construire l'app (mode production)
  const isElectronOrBuild = mode === 'electron' || mode === 'production';

  return {
    base: './', // Indispensable pour l'écran blanc (chemins relatifs)
    plugins: [
      tailwindcss(),
      react(),
      // On charge le plugin Electron avec DEUX entrées : Main + Preload
      isElectronOrBuild && electron([
        {
          // 1. Le processus principal (Cerveau)
          entry: 'electron/main.ts',
        },
        {
          // 2. Le script de préchargement (Pont)
          // C'est ça qui manquait et causait ton erreur "Unable to load preload script"
          entry: 'electron/preload.ts',
          onstart(options) {
            options.reload() // Recharge la page si on modifie le preload
          },
        },
      ]),
    ],
  }
})