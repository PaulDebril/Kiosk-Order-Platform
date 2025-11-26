// electron/preload.ts
// Ce script s'exécute dans le contexte du renderer avant le chargement de la page
// Avec contextIsolation: false, ce fichier peut rester minimal

// Vous pouvez ajouter du code d'initialisation ici si nécessaire
// Par exemple: configuration globale, listeners, etc.

console.log('Preload script chargé avec succès')

// Comme contextIsolation est false et nodeIntegration est true,
// votre code React a déjà accès direct à Electron et Node.js
// Pas besoin de contextBridge dans ce cas
