import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import electron from 'vite-plugin-electron'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  // IMPORTANT : On active Electron si on fait "npm start" (mode electron)
  // OU si on est en train de construire l'app (mode production)
  const isElectronOrBuild = mode === 'electron' || mode === 'production';

  return {
    base: './', // Pour que les assets soient bien résolus dans l'app Electron
    plugins: [
      tailwindcss(),
      react(),
      isElectronOrBuild && electron([
        {
          // 1. Le processus 
          entry: 'electron/main.ts',
        },
        {
          // 2. Le script de préchargement
          entry: 'electron/preload.ts',
          onstart(options) {
            options.reload()
          },
        },
      ]),
    ],
  }
})