# Kiosk Order Platform - Zenito

**Paul Debril, Marine Langrez**

Plateforme de commande autonome pour un restaurant japonais - Application de borne tactile interactive avec gestion backend.

Une solution complète de self-service pour restaurants incluant une application Electron pour la borne tactile et une API REST .NET pour la gestion.

---

## Table des matières

- [Technologies](#-technologies)
- [Architecture](#-architecture)
- [Fonctionnalités](#-fonctionnalités)
- [Fonctionnalités natives Electron](#-fonctionnalités-natives-electron)
- [Installation et démarrage](#-installation-et-démarrage)
- [CI/CD](#-cicd)
- [Auteurs](#-auteurs)

---


## Technologies

### Backend
- **.NET 8.0** - Framework principal
- **ASP.NET Core Web API** - API REST
- **Entity Framework Core 8** - ORM
- **PostgreSQL 16** - Base de données
- **Swagger/OpenAPI** - Documentation API
- **xUnit + Moq** - Tests unitaires
- **Docker** - Conteneurisation

### Frontend
- **Electron 39** - Application desktop multiplateforme
- **React 19** - Interface utilisateur
- **TypeScript 5.9** - Typage statique
- **Vite 7** - Build et dev server
- **Tailwind CSS 4** - Styling
- **React Router 7** - Navigation
- **jsQR** - Scan QR codes


## Architecture

Le projet suit une architecture **monorepo** avec séparation claire des responsabilités :

```
Kiosk-Order-Platform/
├── apps/
│   ├── kiosk-backend/         # API .NET 8 + Entity 
│   └── kiosk-ui/              # Application
├── .github/workflows/         # CI/CD GitHub Actions
├── docker-compose.yml         # Orchestration des services
└── .env                       # Variables d'environnement
```

### Flux de données

```
┌─────────────────┐
│  Borne tactile  │ (Electron + React)
│   (Kiosk UI)    │
└────────┬────────┘
         │ HTTP REST
         ▼
┌─────────────────┐
│   API Backend   │ (.NET 8 + EF Core)
│                 │
└────────┬────────┘
         │ SQL
         ▼
┌─────────────────┐
│   PostgreSQL    │
└─────────────────┘
```

---

## Fonctionnalités

### Borne de commande (Frontend Electron + React)
- **Interface tactile optimisée** pour bornes en mode plein écran
- **Catalogue produits** avec catégories, images et descriptions
- **Panier** avec personnalisation des produits
- **Options avancées** : suppression d'ingrédients, ajout d'extras, choix multiples
- **Scan QR Code** pour fidélité (accès caméra natif)
- **Simulation de paiement** (CB, espèces)
- **Programme de fidélité** 
- **Impression native** de tickets et étiquettes de commande
- **Mode kiosque sécurisé** (pas de fermeture accidentelle)

### API Backend (.NET 8)
- **Gestion des produits** (CRUD complet)
- **Catégories et menus** dynamiques
- **Gestion des commandes** avec historique
- **Système de fidélité** avec transactions
- **Calcul automatique** des prix et totaux
- **Relations complexes** entre produits, options et extras
- **Base de données PostgreSQL** avec seed data
- **Interface pgAdmin** pour l'administration

---

## Fonctionnalités natives Electron

L'application utilise pleinement les capacités natives d'Electron :

### Mode Kiosque sécurisé

En mode kiosque, l'application démarre en plein écran sans barre de titre, empêchant la fermeture accidentelle.
Il est impossible d'accéder aux raccourcis clavier standards (Alt+F4, Ctrl+W, etc.).

```typescript
// electron/main.ts
const win = new BrowserWindow({
  fullscreen: true,    // Plein écran au démarrage
  frame: false,        // Sans barre de titre
  kiosk: true,         // Mode kiosque strict (pas d'échap)
  webPreferences: {
    nodeIntegration: true,
    contextIsolation: false
  }
})
```

### Accès caméra pour QR Code

Pour scanner les QR codes, l'application demande automatiquement la permission d'accéder à la caméra.

```typescript
// Permission automatique pour la caméra
win.webContents.session.setPermissionRequestHandler(
  (webContents, permission, callback) => {
    if (permission === 'media') {
      callback(true) // Autorise caméra/micro
    }
  }
)
```

### Système d'impression natif

L'application gère l'impression directe des tickets de commande via les imprimantes connectées.

```typescript
// IPC Handler pour l'impression
ipcMain.handle('print-order', async (event, orderData) => {
  const printWindow = new BrowserWindow({
    show: false,
    width: 300,
    height: 600
  })
  
  // Génération HTML du ticket
  await printWindow.loadURL(`data:text/html,${receiptHtml}`)
  
  // Impression silencieuse
  printWindow.webContents.print({
    silent: true,
    printBackground: true,
    deviceName: printerName
  })
})
```

### Communication IPC (Inter-Process)

Pour interagir entre le renderer (React) et le main process (Electron), l'application utilise IPC.

```typescript
// Depuis le renderer (React)
const result = await window.electron.ipcRenderer.invoke('print-order', orderData)

// Vers le main process (Electron)
ipcMain.handle('print-order', async (event, data) => {
  // Traitement...
  return { success: true }
})
```

### Détection des imprimantes

Pour lister les imprimantes disponibles sur le système.

```typescript
ipcMain.handle('get-printers', async () => {
  const printers = win?.webContents.getPrintersAsync() || []
  return printers
})
```

---

## Installation et démarrage

### Prérequis

- **Node.js 22+** et npm
- **.NET SDK 8.0+**
- **Docker** et Docker Compose (pour le backend)
- **Git**

### Cloner le repository

```bash
git clone https://github.com/PaulDebril/Kiosk-Order-Platform.git
cd Kiosk-Order-Platform
```

### Configuration de l'environnement

Créez un fichier `.env` à la racine :

```env
# Backend
BACKEND_PORT=5001
ASPNETCORE_ENVIRONMENT=Development

# PostgreSQL
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres123
POSTGRES_DB=kioskdb

# pgAdmin
PGADMIN_PORT=5050
PGADMIN_EMAIL=admin@kiosk.com
PGADMIN_PASSWORD=admin123
```

### Lancer le backend avec Docker

```bash
# Démarrer tous les services (API + PostgreSQL + pgAdmin)
docker compose up -d --build
```

Le backend sera accessible sur `http://localhost:5001`
- API Swagger : `http://localhost:5001/swagger`
- pgAdmin : `http://localhost:5050`

### Lancer le frontend (Electron)

```bash
cd apps/kiosk-ui

# Installer les dépendances
npm install

# Mode développement (fenêtre normale)
npm run dev

# Mode kiosque (plein écran)
npm run start

npm run build # Build complet avec Electron
```

Pour obtenir un exécutable, utilisez `npm run build` et trouvez le binaire dans `dist/`.

---

## CI/CD

Le projet utilise **GitHub Actions** pour l'intégration continue et le déploiement automatisé avec deux workflows principaux :

### CI - Build and Test

Pipeline d'intégration continue déclenché automatiquement sur chaque push ou pull request vers `main` ou `develop`.

**Jobs exécutés :**

#### 1. Test Backend (.NET)
- Restauration des dépendances NuGet
- Build du backend et des tests
- Exécution de la suite de tests xUnit
- Environnement : Ubuntu Latest + .NET 8.0

#### 2. Build Frontend (Electron)
- Installation des dépendances npm
- Linting du code TypeScript/React
- Build du frontend sans packaging Electron
- Environnement : Ubuntu Latest + Node.js 22

#### 3. Docker Build Backend
- Validation du Dockerfile
- Build de l'image Docker du backend
- Test de la conteneurisation

### Build and Release

Pipeline de release déclenché par la création d'un tag `v*` (ex: `v1.0.0`) ou manuellement via workflow_dispatch.

**Architecture des jobs :**

#### 1. Build Backend (.NET)
- Build et publication en mode Release
- Création d'un artifact portable du backend
- Upload de l'artifact pour utilisation ultérieure

#### 2. Build Electron App
Compilation parallèle multi-plateformes :

- **Windows** : Génération d'un `.exe` installable
- **macOS** : Génération d'un `.dmg` (signature désactivée)
- Build simultané sur `windows-latest` et `macos-latest`
- Artifacts : `.exe`, `.dmg` + leurs `.blockmap` respectifs

#### 3. Create GitHub Release
- Téléchargement de tous les artifacts
- Compression du backend en `kiosk-backend-linux.tar.gz`
- Création automatique d'une release GitHub avec :
  - Notes de version générées automatiquement
  - Binaires Windows (`.exe`)
  - Binaires macOS (`.dmg`)
  - Backend Linux (`.tar.gz`)

### Artifacts générés

| Plateforme | Fichier | Description |
|------------|---------|-------------|
| **Windows** | `kiosk-ui-Setup-*.exe` | Installateur Electron |
| **macOS** | `kiosk-ui-*.dmg` | Image disque Electron |
| **Linux** | `kiosk-backend-linux.tar.gz` | Backend .NET compilé |


Attention : Les builds macOS ne sont pas signés ni notarized dans ce workflow. Il vous sera donc impossible d'ouvrir l'application sur un Mac avec les paramètres de sécurité par défaut. Pour pouvoir tester lancer "npm run build" sur votre Mac
## Auteurs

**Paul Debril** et **Marine Langrez**

- GitHub: [@PaulDebril](https://github.com/PaulDebril)
- Repository: [Kiosk-Order-Platform](https://github.com/PaulDebril/Kiosk-Order-Platform)
