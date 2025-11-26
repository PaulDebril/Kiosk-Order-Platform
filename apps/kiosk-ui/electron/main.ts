// electron/main.ts
import { app, BrowserWindow } from 'electron'
import path from 'path'

// En mode dev et packagé: dist est toujours dans ../dist depuis dist-electron
process.env.DIST = path.join(__dirname, '../dist')
process.env.VITE_PUBLIC = app.isPackaged ? process.env.DIST : path.join(__dirname, '../public')

let win: BrowserWindow | null

const createWindow = () => {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    fullscreen: true, // IMPORTANT pour une borne : démarre en plein écran
    frame: false,     // Enlève la barre de titre et les boutons fermer/réduire
    kiosk: true,      // Mode kiosque strict (empêche de quitter facilement)
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), 
        nodeIntegration: true,
        contextIsolation: false,
    },
  })

  // Logs de débogage
  console.log('__dirname:', __dirname)
  console.log('process.env.DIST:', process.env.DIST)
  console.log('app.isPackaged:', app.isPackaged)
  console.log('process.resourcesPath:', process.resourcesPath)

  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL)
    console.log('Loading dev server:', process.env.VITE_DEV_SERVER_URL)
  } else {
    const indexPath = path.join(process.env.DIST!, 'index.html')
    console.log('Loading file:', indexPath)
    win.loadFile(indexPath)
  }

  // Ouvrir automatiquement les DevTools en dev
  if (!app.isPackaged) {
    win.webContents.openDevTools()
  }
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.whenReady().then(createWindow)