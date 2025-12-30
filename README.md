# WhatsApp Pool Café - Sistema de Gestion de Café

Une solution complète et moderne pour la gestion d'un café, comprenant une interface client avec QR codes, un tableau de bord pour la cuisine et un panneau d'administration pour les gestionnaires.

## 🚀 Fonctionnalités

- **Interface Client (QR Table)**
  - Accès direct via QR code unique par table.
  - Menu interactif avec photos haute résolution.
  - Panier et suivi de commande en temps réel.
  - Thème premium "Food-Zone" (Noir, Jaune, Blanc).

- **Cuisine (Kitchen Dashboard)**
  - Gestion des commandes entrantes en temps réel via WebSockets.
  - Contrôle de la disponibilité du menu (In/Out stock).
  - Traçage du timing de préparation.

- **Administration (Manager Panel)**
  - Gestion complète du menu (CRUD avec images).
  - Gestion de l'équipe (Staff).
  - Gestion des tables et génération de liens QR.
  - Historique détaillé des ventes et performances.

## 🛠️ Stack Technologique

- **Frontend**: React, Vite, Tailwind CSS, Lucide React, Socket.io-client.
- **Backend**: Node.js, Express, MongoDB (Mongoose), Socket.io.
- **Authentification**: JWT (JSON Web Tokens) & BCrypt.

---

## ⚙️ Installation

### 1. Prérequis
- Node.js (v18+)
- MongoDB (Local ou Atlas)

### 2. Cloner le projet
```bash
git clone <repository-url>
cd café
```

### 3. Configuration des variables d'environnement
Créez un fichier `.env` dans les dossiers `backend` et `frontend` en vous basant sur les exemples suivants :

**Backend (.env)**
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/cafe_db
JWT_SECRET=votre_secret_jwt
```

**Frontend (.env)**
```env
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

### 4. Installation des dépendances
```bash
# Dans le dossier backend
cd backend
npm install

# Dans le dossier frontend
cd ../frontend
npm install
```

---

## 🗄️ Initialisation de la Base de Données (Seeders)

Il est crucial de lancer les seeders pour avoir un environnement fonctionnel :

### A. Création du compte Manager
Créez le compte administrateur principal :
```bash
cd backend
node manger.js
```
- **Login**: `admin@cafe.com`
- **Password**: `123456`

### B. Initialisation du Menu
Remplissez le menu avec les catégories, plats et images :
```bash
cd backend
node seeder.js
```

---

## 🏃 Lancement de l'Application

### Lancer le Backend (Développement)
```bash
cd backend
npm run dev
```

### Lancer le Frontend (Développement)
```bash
cd frontend
npm run dev
```

---

## 📖 Structure du Projet

```text
├── backend/
│   ├── config/         # Connection DB
│   ├── controllers/    # Logique métier
│   ├── models/         # Modèles Mongoose
│   ├── routes/         # Points d'accès API
│   ├── seeder.js/      # Initialisation Menu
│   └── manger.js/      # Initialisation Manager
├── frontend/
│   ├── src/
│   │   ├── api/        # Appels Axios/Sockets
│   │   ├── components/ # Composants réutilisables
│   │   ├── context/    # Auth & Panier
│   │   └── pages/      # Vues (Admin, Client, Kitchen)
```

---

## 🎨 Design System
Le projet utilise une palette de couleurs contrastée conçue pour la visibilité et l'esthétique premium :
- **Black**: Pour l'élégance et la structure.
- **Yellow (Food-Zone)**: Pour les actions critiques et l'appel visuel.
- **White/Gray**: Pour la clarté et l'organisation des données.
