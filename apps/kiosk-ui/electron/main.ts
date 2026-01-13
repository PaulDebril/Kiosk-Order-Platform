// electron/main.ts
import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import os from 'os'

// On récupère l'équivalent de __dirname pour le mode ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Configuration des dossiers de distribution et des assets publics
process.env.DIST = path.join(__dirname, '../dist')
process.env.VITE_PUBLIC = app.isPackaged ? process.env.DIST : path.join(__dirname, '../public')

let win: BrowserWindow | null

const createWindow = () => {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    fullscreen: true, // Pour une borne, on veut direct le plein écran
    frame: false,     // On vire la barre de titre pour faire plus "borne de commande"
    kiosk: true,      // On verrouille tout en mode kiosque strict
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,
    },
  })

  // Permissions pour la caméra (natif Electron)
  win.webContents.session.setPermissionRequestHandler((webContents, permission, callback) => {
    if (permission === 'media') {
      callback(true) // Autorise l'accès à la caméra/micro
    } else {
      callback(false)
    }
  })

  // On empêche la fermeture accidentelle via les menus
  win.setMenu(null)

  // Logs de débogage
  console.log('__dirname:', __dirname)
  console.log('process.env.DIST:', process.env.DIST)
  console.log('app.isPackaged:', app.isPackaged)
  console.log('process.resourcesPath:', process.resourcesPath)

  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL)
    console.log('Chargement du serveur de dev:', process.env.VITE_DEV_SERVER_URL)
  } else {
    const indexPath = path.join(process.env.DIST!, 'index.html')
    console.log('Chargement du fichier index:', indexPath)
    win.loadFile(indexPath)
  }
}

// On ferme l'app quand toutes les fenêtres sont fermées (sauf sur Mac)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.whenReady().then(() => {
  createWindow()

  // --- Gestion de la communication (IPC) ---

  // Pour le debug : on liste les imprimantes branchées sur le système
  win?.webContents.getPrintersAsync().then((printers) => {
    console.log('--- IMPRIMANTES DISPONIBLES ---')
    printers.forEach(p => {
      console.log(`- Nom: ${p.name} | Description: ${p.description}`)
    })
    console.log('-------------------------------')
  })

  // Gestion de l'impression : Génère un PDF (reçu) et imprime une étiquette (commande)
  ipcMain.handle('print-order', async (event, orderData) => {
    if (!win) return { success: false, error: 'Pas de fenêtre active' }

    console.log('Impression de la commande :', orderData.id)

    let printWindow: BrowserWindow | null = null;

    try {
      // Petite pause pour simuler le "travail" de l'imprimante
      await new Promise(resolve => setTimeout(resolve, 2500))

      // On crée une fenêtre invisible pour préparer le rendu du ticket
      printWindow = new BrowserWindow({
        show: false,
        width: 300,
        height: 600,
        webPreferences: {
          nodeIntegration: true,
          contextIsolation: false
        }
      })

      // On prépare le HTML pour les articles de la commande
      interface OrderItem {
        quantity: number;
        product: { name: string; price: number };
        selectedOptions?: { name: string }[];
      }
      
      const itemsHtml = orderData.items ? orderData.items.map((item: OrderItem) => `
        <div class="item">
          <div class="row">
            <span class="qty">${item.quantity}x</span>
            <span class="name">${item.product.name}</span>
            <span class="price">${(item.product.price * item.quantity).toFixed(2)}€</span>
          </div>
          ${item.selectedOptions && item.selectedOptions.length > 0 ? `
            <div class="options">
              ${item.selectedOptions.map((opt) => `+ ${opt.name}`).join('<br/>')}
            </div>
          ` : ''}
        </div>
      `).join('') : '';

      const total = orderData.total ? orderData.total.toFixed(2) : '0.00';
      const date = new Date().toLocaleString('fr-FR');

      // Le template HTML du ticket de caisse (style ticket de restau)
      const receiptHtml = `
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
          <div class="order-num">#${orderData.orderNumber}</div>
          <div style="text-align:center; margin-bottom:10px;">${date}</div>
          
          <div class="divider"></div>
          
          <div class="items">
            ${itemsHtml}
          </div>
          
          <div class="divider"></div>
          
          <div class="total-section">
            <div class="row">
              <span>TOTAL TTC</span>
              <span>${total} €</span>
            </div>
            <div class="row" style="font-size: 10px; font-weight: normal; margin-top: 5px;">
              <span>Moyen de paiement</span>
              <span>${orderData.paymentMethod === 'cash' ? 'ESPECES' : 'CB'}</span>
            </div>
          </div>
          
          <div class="footer">
            MERCI DE VOTRE VISITE !<br>
            A bientôt chez ZenIto
          </div>
        </body>
        </html>
      `;

      // On charge le HTML dans notre fenêtre d'impression
      const dataUri = 'data:text/html;charset=utf-8,' + encodeURIComponent(receiptHtml);
      await printWindow.loadURL(dataUri);

      // 1. On sauvegarde d'abord le ticket complet en PDF sur le bureau (pour la démo)
      const desktopPath = os.homedir() + '/Desktop'
      const fileName = `Ticket_ZenIto_${orderData.orderNumber}_${Date.now()}.pdf`
      const pdfPath = path.join(desktopPath, fileName)

      const pdfData = await printWindow.webContents.printToPDF({
        printBackground: true,
        pageSize: 'A4', // On utilise du A4 pour la visibilité du fichier PDF
        margins: { top: 0, bottom: 0, left: 0, right: 0 }
      })

      fs.writeFileSync(pdfPath, pdfData)
      console.log('PDF sauvegardé ici :', pdfPath)

      // 2. Ensuite, on imprime l'étiquette (numéro de commande) sur la Niimbot B1
      // Note: On n'imprime que le numéro car les étiquettes B1 sont trop petites pour tout le ticket
      console.log('Préparation de l\'étiquette pour la Niimbot B1...')

      const labelHtml = `
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
          <div class="number">#${orderData.orderNumber}</div>
          <div class="time">${new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</div>
        </body>
        </html>
      `;

      const labelDataUri = 'data:text/html;charset=utf-8,' + encodeURIComponent(labelHtml);
      await printWindow.loadURL(labelDataUri);

      // On attend une demi-seconde pour être sûr que le rendu est prêt
      await new Promise(resolve => setTimeout(resolve, 500));

      try {
        await printWindow.webContents.print({
          silent: true,
          printBackground: false,
          deviceName: 'NIIMBOT B1', // Nom de l'imprimante thermique
          color: false,
          margins: { marginType: 'none' },
          // Dimensions des étiquettes (50x30mm)
          pageSize: { width: 50000, height: 30000 }
        });
        console.log("Étiquette envoyée à la Niimbot B1");
      } catch (printError) {
        console.error("Échec de l'impression sur la Niimbot (pas grave, le PDF est généré) :", printError);
      }

      // On laisse un peu de temps à Electron pour envoyer le job à l'imprimante avant de fermer la fenêtre
      await new Promise(resolve => setTimeout(resolve, 5000));

      printWindow.close();
      return { success: true, path: pdfPath }

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      console.error('L\'impression a foiré :', error)
      if (printWindow) printWindow.close();
      return { success: false, error: errorMessage }
    }
  })
})
