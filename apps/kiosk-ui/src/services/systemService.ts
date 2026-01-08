// Petite fonction pour récupérer l'IPC d'Electron proprement
const getIpcRenderer = () => {
    if ((window as any).require) {
        const electron = (window as any).require('electron');
        return electron.ipcRenderer;
    }
    return null;
};

export const systemService = {
    // C'est ici qu'on lance l'impression du ticket de caisse
    printOrder: async (orderData: any) => {
        const ipcRenderer = getIpcRenderer();

        // Si on est bien dans l'app Electron, on demande l'impression au système
        if (ipcRenderer) {
            return await ipcRenderer.invoke('print-order', orderData);
        } else {
            // Si on teste juste dans un navigateur, on prévient et on simule un délai
            console.warn('IPC Electron introuvable (on est sûrement en mode navigateur)');

            // On fait semblant d'imprimer pendant 3 secondes pour tester l'UI
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve({ success: true, simulated: true });
                }, 3000);
            });
        }
    },

    // Un petit check rapide pour savoir si on tourne sous Electron ou pas
    isElectron: () => {
        return !!(window as any).require;
    }
};

