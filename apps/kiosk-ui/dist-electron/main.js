import { app, BrowserWindow } from "electron";
import path from "path";
import { fileURLToPath } from "url";
const __filename$1 = fileURLToPath(import.meta.url);
const __dirname$1 = path.dirname(__filename$1);
process.env.DIST = path.join(__dirname$1, "../dist");
process.env.VITE_PUBLIC = app.isPackaged ? process.env.DIST : path.join(__dirname$1, "../public");
let win;
const createWindow = () => {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    fullscreen: true,
    // IMPORTANT pour une borne : démarre en plein écran
    frame: true,
    // FALSE Enlève la barre de titre et les boutons fermer/réduire
    kiosk: false,
    // TRUE Mode kiosque strict (empêche de quitter facilement)
    webPreferences: {
      preload: path.join(__dirname$1, "preload.js"),
      nodeIntegration: true,
      contextIsolation: false
    }
  });
  console.log("__dirname:", __dirname$1);
  console.log("process.env.DIST:", process.env.DIST);
  console.log("app.isPackaged:", app.isPackaged);
  console.log("process.resourcesPath:", process.resourcesPath);
  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
    console.log("Loading dev server:", process.env.VITE_DEV_SERVER_URL);
  } else {
    const indexPath = path.join(process.env.DIST, "index.html");
    console.log("Loading file:", indexPath);
    win.loadFile(indexPath);
  }
};
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
app.whenReady().then(createWindow);
