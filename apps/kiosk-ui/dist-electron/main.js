import { app as a, ipcMain as y, BrowserWindow as c } from "electron";
import n from "path";
import { fileURLToPath as T } from "url";
import I from "fs";
import E from "os";
const P = T(import.meta.url), l = n.dirname(P);
process.env.DIST = n.join(l, "../dist");
process.env.VITE_PUBLIC = a.isPackaged ? process.env.DIST : n.join(l, "../public");
let i;
const R = () => {
  if (i = new c({
    width: 800,
    height: 600,
    fullscreen: !0,
    // Pour une borne, on veut direct le plein écran
    frame: !1,
    // On vire la barre de titre pour faire plus "borne de commande"
    kiosk: !0,
    // On verrouille tout en mode kiosque strict
    webPreferences: {
      preload: n.join(l, "preload.js"),
      nodeIntegration: !0,
      contextIsolation: !1,
      webSecurity: !1
    }
  }), i.setMenu(null), console.log("__dirname:", l), console.log("process.env.DIST:", process.env.DIST), console.log("app.isPackaged:", a.isPackaged), console.log("process.resourcesPath:", process.resourcesPath), process.env.VITE_DEV_SERVER_URL)
    i.loadURL(process.env.VITE_DEV_SERVER_URL), console.log("Chargement du serveur de dev:", process.env.VITE_DEV_SERVER_URL);
  else {
    const s = n.join(process.env.DIST, "index.html");
    console.log("Chargement du fichier index:", s), i.loadFile(s);
  }
};
a.on("window-all-closed", () => {
  process.platform !== "darwin" && a.quit();
});
a.whenReady().then(() => {
  R(), i?.webContents.getPrintersAsync().then((s) => {
    console.log("--- IMPRIMANTES DISPONIBLES ---"), s.forEach((t) => {
      console.log(`- Nom: ${t.name} | Description: ${t.description}`);
    }), console.log("-------------------------------");
  }), y.handle("print-order", async (s, t) => {
    if (!i) return { success: !1, error: "Pas de fenêtre active" };
    console.log("Impression de la commande :", t.id);
    let o = null;
    try {
      await new Promise((e) => setTimeout(e, 2500)), o = new c({
        show: !1,
        width: 300,
        height: 600,
        webPreferences: {
          nodeIntegration: !0,
          contextIsolation: !1
        }
      });
      const r = t.items ? t.items.map((e) => `
        <div class="item">
          <div class="row">
            <span class="qty">${e.quantity}x</span>
            <span class="name">${e.product.name}</span>
            <span class="price">${(e.product.price * e.quantity).toFixed(2)}€</span>
          </div>
          ${e.selectedOptions && e.selectedOptions.length > 0 ? `
            <div class="options">
              ${e.selectedOptions.map((b) => `+ ${b.name}`).join("<br/>")}
            </div>
          ` : ""}
        </div>
      `).join("") : "", p = t.total ? t.total.toFixed(2) : "0.00", m = (/* @__PURE__ */ new Date()).toLocaleString("fr-FR"), g = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: 'Courier New', Courier, monospace;
              width: 270px; /* Taille standard pour ticket ~80mm */
              margin: 0 auto;
              padding: 10px;
              background: #fff;
              color: #000;
              font-size: 12px;
            }
            .header { text-align: center; margin-bottom: 20px; }
            .logo { font-size: 20px; font-weight: bold; margin-bottom: 5px; }
            .address { font-size: 10px; }
            .divider { border-top: 1px dashed #000; margin: 10px 0; }
            .title { text-align: center; font-weight: bold; font-size: 16px; margin: 10px 0; }
            .order-num { text-align: center; font-size: 24px; font-weight: bold; margin: 5px 0; }
            .item { margin-bottom: 8px; }
            .row { display: flex; justify-content: space-between; }
            .qty { width: 20px; font-weight: bold; }
            .name { flex: 1; margin: 0 5px; }
            .price { font-weight: bold; }
            .options { font-size: 10px; color: #444; margin-left: 25px; font-style: italic; }
            .total-section { margin-top: 15px; font-size: 14px; font-weight: bold; }
            .footer { text-align: center; margin-top: 20px; font-size: 10px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">ZENITO</div>
            <div class="address">123 Avenue du Japon<br>75001 Paris</div>
            <div class="address">Tel: 01 23 45 67 89</div>
          </div>
          
          <div class="divider"></div>
          
          <div class="title">TICKET CLIENT</div>
          <div class="order-num">#${t.orderNumber}</div>
          <div style="text-align:center; margin-bottom:10px;">${m}</div>
          
          <div class="divider"></div>
          
          <div class="items">
            ${r}
          </div>
          
          <div class="divider"></div>
          
          <div class="total-section">
            <div class="row">
              <span>TOTAL TTC</span>
              <span>${p} €</span>
            </div>
            <div class="row" style="font-size: 10px; font-weight: normal; margin-top: 5px;">
              <span>Moyen de paiement</span>
              <span>${t.paymentMethod === "cash" ? "ESPECES" : "CB"}</span>
            </div>
          </div>
          
          <div class="footer">
            MERCI DE VOTRE VISITE !<br>
            A bientôt chez ZenIto
          </div>
        </body>
        </html>
      `, f = "data:text/html;charset=utf-8," + encodeURIComponent(g);
      await o.loadURL(f);
      const h = E.homedir() + "/Desktop", v = `Ticket_ZenIto_${t.orderNumber}_${Date.now()}.pdf`, d = n.join(h, v), u = await o.webContents.printToPDF({
        printBackground: !0,
        pageSize: "A4",
        // On utilise du A4 pour la visibilité du fichier PDF
        margins: { top: 0, bottom: 0, left: 0, right: 0 }
      });
      I.writeFileSync(d, u), console.log("PDF sauvegardé ici :", d), console.log("Préparation de l'étiquette pour la Niimbot B1...");
      const w = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              margin: 0;
              padding: 0;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              height: 100vh;
              font-family: 'Arial', sans-serif;
              background: white;
            }
            .title { font-size: 12px; font-weight: bold; margin-bottom: 5px; }
            .number { font-size: 40px; font-weight: 900; line-height: 1; }
            .time { font-size: 10px; margin-top: 5px; }
          </style>
        </head>
        <body>
          <div class="title">COMMANDE</div>
          <div class="number">#${t.orderNumber}</div>
          <div class="time">${(/* @__PURE__ */ new Date()).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}</div>
        </body>
        </html>
      `, x = "data:text/html;charset=utf-8," + encodeURIComponent(w);
      await o.loadURL(x), await new Promise((e) => setTimeout(e, 500));
      try {
        await o.webContents.print({
          silent: !0,
          printBackground: !1,
          deviceName: "NIIMBOT B1",
          // Nom de l'imprimante thermique
          color: !1,
          margins: { marginType: "none" },
          // Dimensions des étiquettes (50x30mm)
          pageSize: { width: 5e4, height: 3e4 }
        }), console.log("Étiquette envoyée à la Niimbot B1");
      } catch (e) {
        console.error("Échec de l'impression sur la Niimbot (pas grave, le PDF est généré) :", e);
      }
      return await new Promise((e) => setTimeout(e, 5e3)), o.close(), { success: !0, path: d };
    } catch (r) {
      return console.error("L'impression a foiré :", r), o && o.close(), { success: !1, error: r.message };
    }
  });
});
