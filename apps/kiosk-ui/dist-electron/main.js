import { app as e, BrowserWindow as i } from "electron";
import o from "path";
import { fileURLToPath as a } from "url";
const l = a(import.meta.url), n = o.dirname(l);
process.env.DIST = o.join(n, "../dist");
process.env.VITE_PUBLIC = e.isPackaged ? process.env.DIST : o.join(n, "../public");
let s;
const c = () => {
  if (s = new i({
    width: 800,
    height: 600,
    fullscreen: !0,
    // IMPORTANT pour une borne : démarre en plein écran
    frame: !0,
    // FALSE Enlève la barre de titre et les boutons fermer/réduire
    kiosk: !1,
    // TRUE Mode kiosque strict (empêche de quitter facilement)
    webPreferences: {
      preload: o.join(n, "preload.js"),
      nodeIntegration: !0,
      contextIsolation: !1
    }
  }), console.log("__dirname:", n), console.log("process.env.DIST:", process.env.DIST), console.log("app.isPackaged:", e.isPackaged), console.log("process.resourcesPath:", process.resourcesPath), process.env.VITE_DEV_SERVER_URL)
    s.loadURL(process.env.VITE_DEV_SERVER_URL), console.log("Loading dev server:", process.env.VITE_DEV_SERVER_URL);
  else {
    const r = o.join(process.env.DIST, "index.html");
    console.log("Loading file:", r), s.loadFile(r);
  }
  e.isPackaged || s.webContents.openDevTools();
};
e.on("window-all-closed", () => {
  process.platform !== "darwin" && e.quit();
});
e.whenReady().then(c);
