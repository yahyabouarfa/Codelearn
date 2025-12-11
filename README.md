# CodeLearn Frontend

Plateforme d'apprentissage en ligne pour le développement de compétences en programmation - Interface utilisateur React.

## 📋 Table des matières

- [Vue d'ensemble](#vue-densemble)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Configuration](#configuration)
- [Démarrage](#démarrage)
- [Architecture](#architecture)
- [Fonctionnalités](#fonctionnalités)
- [Déploiement](#déploiement)
- [Technologies utilisées](#technologies-utilisées)

## 🎯 Vue d'ensemble

CodeLearn est une application React moderne qui interagit avec plusieurs microservices backend Spring Boot pour offrir une expérience d'apprentissage complète avec trois rôles distincts :

- **Apprenant** : Parcourir les cours, s'inscrire, suivre la progression
- **Créateur** : Créer et gérer des cours, uploader du contenu
- **Administrateur** : Valider les cours, gérer les utilisateurs

## 🔧 Prérequis

- **Node.js** : v16.0 ou supérieur
- **npm** : v8.0 ou supérieur
- **Services backend** : Les 4 microservices Spring Boot doivent être en cours d'exécution

## 📦 Installation

```bash
# Cloner le repository
git clone <repository-url>
cd codelearnfront

# Installer les dépendances
npm install
```

## ⚙️ Configuration

### Variables d'environnement

1. Copiez le fichier `.env.example` vers `.env.development` :
```bash
cp .env.example .env.development
```

2. Modifiez les URLs des APIs selon votre environnement :

```env
# Développement local
REACT_APP_USER_API=http://localhost:8080/api
REACT_APP_APPRENANT_API=http://localhost:8081/api/apprenant
REACT_APP_CREATEUR_API=http://localhost:8082/api/createur
REACT_APP_ADMIN_API=http://localhost:8083/api/admin
```

### Configuration des microservices

Assurez-vous que les 4 services backend sont configurés et en cours d'exécution :

1. **User Service** (Port 8080) : Authentification et gestion des utilisateurs
2. **Apprenant Service** (Port 8081) : Fonctionnalités pour les apprenants
3. **Créateur Service** (Port 8082) : Fonctionnalités pour les créateurs
4. **Admin Service** (Port 8083) : Fonctionnalités administratives

## 🚀 Démarrage

### Mode développement

```bash
npm start
```

L'application sera accessible sur `http://localhost:3000`

### Build de production

```bash
npm run build
```

Les fichiers de production seront générés dans le dossier `build/`

### Lancer les tests

```bash
npm test
```

## 🏗️ Architecture

```
src/
├── assets/              # Images, styles, ressources statiques
├── components/          # Composants React réutilisables
│   ├── common/         # Composants communs (Header, Footer, etc.)
│   ├── auth/           # Composants d'authentification
│   ├── courses/        # Composants liés aux cours
│   └── ...
├── config/             # Configuration de l'application
│   ├── apiUrls.js     # URLs des APIs
│   ├── constants.js   # Constantes globales
│   └── routes.js      # Configuration des routes
├── context/            # Context API (state management)
│   ├── AuthContext.jsx
│   └── NotificationContext.jsx
├── hooks/              # Custom React hooks
│   ├── useApi.js
│   ├── useAuth.js
│   └── usePagination.js
├── pages/              # Pages de l'application
│   ├── Auth/          # Pages d'authentification
│   ├── Apprenant/     # Pages pour apprenants
│   ├── Creator/       # Pages pour créateurs
│   └── Admin/         # Pages pour administrateurs
├── services/           # Services API
│   ├── api/           # Configuration axios
│   ├── AuthService.js
│   ├── ApprenantService.js
│   ├── CreateurService.js
│   └── AdminService.js
├── utils/              # Fonctions utilitaires
│   ├── formatters.js
│   ├── validators.js
│   └── roleUtils.js
├── App.jsx             # Composant racine
└── index.js            # Point d'entrée
```

## ✨ Fonctionnalités

### Authentification
- ✅ Inscription avec sélection de rôle
- ✅ Connexion avec JWT
- ✅ Déconnexion
- ✅ Protection des routes par rôle
- ✅ Gestion automatique du token

### Apprenant
- ✅ Tableau de bord avec statistiques
- ✅ Catalogue de cours avec recherche et filtres
- ✅ Détails du cours avec modules
- ✅ Accès temporaire aux supports (PDF/Video)
- ✅ Suivi de progression
- ✅ Marquage des modules complétés

### Créateur
- ✅ Tableau de bord créateur
- ✅ Gestion des cours (CRUD)
- ✅ Upload de supports multimédia
- ✅ Gestion des modules
- ✅ Statistiques des cours

### Administrateur
- ✅ Tableau de bord admin
- ✅ Validation/Rejet des cours
- ✅ Gestion des utilisateurs
- ✅ Modification des rôles
- ✅ Statistiques globales

### Fonctionnalités techniques
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Pagination des listes
- ✅ Gestion d'erreurs centralisée
- ✅ Notifications toast
- ✅ Intercepteurs HTTP pour JWT
- ✅ Validation de formulaires (Formik + Yup)
- ✅ État de chargement
- ✅ React Query pour le cache

## 🐳 Déploiement

### Avec Docker

```dockerfile
# Dockerfile
FROM node:16-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Build et run

```bash
# Build l'image
docker build -t codelearn-frontend .

# Run le container
docker run -p 80:80 --name codelearn-frontend codelearn-frontend
```

### Variables d'environnement en production

Créez un fichier `.env.production` avec les URLs de production :

```env
REACT_APP_USER_API=https://api.codelearn.com/user
REACT_APP_APPRENANT_API=https://api.codelearn.com/apprenant
REACT_APP_CREATEUR_API=https://api.codelearn.com/createur
REACT_APP_ADMIN_API=https://api.codelearn.com/admin
```

## 🛠️ Technologies utilisées

### Core
- **React** 18.2 - Framework UI
- **React Router** 6.14 - Routing
- **Axios** 1.4 - HTTP client

### State Management & Data Fetching
- **Context API** - State management global
- **React Query** 4.29 - Server state management

### Formulaires & Validation
- **Formik** 2.4 - Gestion de formulaires
- **Yup** 1.2 - Validation de schémas

### UI & Styling
- **Tailwind CSS** 3.3 - Framework CSS utility-first
- **HeadlessUI** 1.7 - Composants accessibles
- **React Icons** 4.10 - Icônes
- **React Hot Toast** 2.4 - Notifications

### Utilities
- **date-fns** 2.30 - Manipulation de dates

## 📝 Scripts disponibles

```bash
# Démarrer en mode développement
npm start

# Build pour production
npm run build

# Lancer les tests
npm test

# Éjecter la configuration (attention, irréversible)
npm run eject

# Démarrer avec variables d'environnement spécifiques
npm run start:dev    # Utilise .env.development
npm run start:prod   # Utilise .env.production
```

## 🔐 Sécurité

- JWT stocké dans localStorage
- Intercepteurs Axios pour l'authentification automatique
- Protection des routes par rôle
- Expiration automatique du token
- Validation côté client et serveur

## 🌐 Support navigateur

- Chrome (dernière version)
- Firefox (dernière version)
- Safari (dernière version)
- Edge (dernière version)

## 📞 Support

Pour toute question ou problème :
- Email : support@codelearn.com
- Documentation API : `http://localhost:8080/swagger-ui.html`

## 📄 Licence

© 2024 CodeLearn. Tous droits réservés.

---

**Note** : Ce projet fait partie d'une architecture microservices. Assurez-vous que tous les services backend sont correctement configurés et accessibles.
