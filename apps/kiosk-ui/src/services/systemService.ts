// Extension du type Window pour inclure require (Electron)
interface ElectronWindow extends Window {
    require?: (module: string) => { ipcRenderer: { invoke: (channel: string, ...args: unknown[]) => Promise<unknown> } };
}

// Petite fonction pour récupérer l'IPC d'Electron proprement
const getIpcRenderer = () => {
    const electronWindow = window as ElectronWindow;
    if (electronWindow.require) {
        const electron = electronWindow.require('electron');
        return electron.ipcRenderer;
    }
    return null;
};

export const systemService = {
    // C'est ici qu'on lance l'impression du ticket de caisse
    printOrder: async (orderData: unknown) => {
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
        const electronWindow = window as ElectronWindow;
        return !!electronWindow.require;
    }
};

