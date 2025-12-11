# 🚀 Installation et Démarrage - CodeLearn Frontend

## ⚡ Installation Rapide (2 minutes)

```bash
# Naviguer vers le dossier du projet
cd c:\Users\yahya\Desktop\codelearnfront

# Installer toutes les dépendances
npm install

# Démarrer l'application
npm start
```

L'application sera accessible sur **http://localhost:3000**

## 📋 Vérification de l'installation

### 1. Vérifier Node.js et npm

```powershell
# Vérifier Node.js (minimum v16.0)
node --version

# Vérifier npm (minimum v8.0)
npm --version
```

Si Node.js n'est pas installé, téléchargez-le depuis : https://nodejs.org/

### 2. Structure des fichiers

Vérifiez que vous avez bien cette structure :

```
codelearnfront/
├── src/
├── public/
├── package.json
├── .env.example
├── .env.development
├── tailwind.config.js
└── README.md
```

## 🔧 Configuration

### Variables d'environnement

Le projet est déjà configuré avec `.env.development`. Si vous devez modifier les URLs des APIs :

```env
# Éditer .env.development
REACT_APP_USER_API=http://localhost:8080/api
REACT_APP_APPRENANT_API=http://localhost:8081/api/apprenant
REACT_APP_CREATEUR_API=http://localhost:8082/api/createur
REACT_APP_ADMIN_API=http://localhost:8083/api/admin
```

## ⚠️ Résolution des problèmes courants

### Problème 1: Erreur lors de `npm install`

```powershell
# Nettoyer le cache npm
npm cache clean --force

# Supprimer node_modules et package-lock.json
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json

# Réinstaller
npm install
```

### Problème 2: Port 3000 déjà utilisé

```powershell
# L'application démarrera sur le port 3001 automatiquement
# Ou arrêtez le processus utilisant le port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Problème 3: Erreurs Tailwind CSS

Les warnings concernant `@tailwind` sont normaux et n'affectent pas le fonctionnement.

### Problème 4: Module non trouvé

```powershell
# Réinstaller une dépendance spécifique
npm install <package-name>

# Exemple pour react-icons
npm install react-icons
```

## 🎯 Tester l'application

### Sans backend (Mode développement)

L'application démarrera mais les appels API échoueront. C'est normal si vous n'avez pas encore les backends.

### Avec backends simulés

Utilisez un outil comme JSON Server ou MockAPI pour simuler les backends :

```powershell
# Installer json-server
npm install -g json-server

# Créer un fichier db.json avec des données de test
# Lancer json-server
json-server --watch db.json --port 8080
```

## 📦 Dépendances installées

Le `npm install` installe automatiquement :

### Core
- react (18.2.0)
- react-dom (18.2.0)
- react-router-dom (6.14.0)

### API & State
- axios (1.4.0)
- @tanstack/react-query (4.29.0)

### Forms
- formik (2.4.0)
- yup (1.2.0)

### UI
- tailwindcss (3.3.0)
- @headlessui/react (1.7.0)
- react-icons (4.10.0)
- react-hot-toast (2.4.0)

### Utilities
- date-fns (2.30.0)
- react-quill (2.0.0)
- recharts (2.7.0)

Total : ~500 MB après installation

## 🏗️ Build pour production

```powershell
# Créer un build optimisé
npm run build

# Les fichiers seront dans le dossier build/
# Taille approximative : 2-3 MB
```

## 🐳 Utilisation avec Docker

### Build l'image Docker

```powershell
docker build -t codelearn-frontend .
```

### Lancer le container

```powershell
docker run -p 80:80 codelearn-frontend
```

### Avec Docker Compose (Stack complète)

```powershell
# Démarrer tous les services
docker-compose up -d

# Voir les logs du frontend
docker-compose logs -f frontend

# Arrêter tous les services
docker-compose down
```

## 📱 Tester sur mobile

### Option 1 : Réseau local

```powershell
# Trouver votre IP locale
ipconfig

# Accéder depuis mobile : http://<VOTRE_IP>:3000
# Exemple : http://192.168.1.100:3000
```

### Option 2 : Tunnel (ngrok)

```powershell
# Installer ngrok
choco install ngrok

# Créer un tunnel
ngrok http 3000

# Utiliser l'URL fournie (https://xxx.ngrok.io)
```

## 🔍 Vérifier que tout fonctionne

### Checklist

- [ ] `npm start` démarre sans erreur
- [ ] Browser s'ouvre sur http://localhost:3000
- [ ] Page de login s'affiche correctement
- [ ] Les styles Tailwind sont appliqués
- [ ] Navigation fonctionne (essayer /login, /register)
- [ ] Console browser sans erreurs critiques

### Tests rapides

```powershell
# Vérifier les dépendances
npm list --depth=0

# Vérifier les vulnérabilités
npm audit

# Corriger les vulnérabilités automatiquement
npm audit fix
```

## 📚 Prochaines étapes

1. **Familiarisez-vous avec le code**
   - Explorez `src/pages/` pour voir les composants
   - Regardez `src/services/` pour les appels API
   - Consultez `src/config/` pour la configuration

2. **Connectez les backends**
   - Suivez `BACKEND_INTEGRATION.md`
   - Démarrez les 4 microservices Spring Boot
   - Testez les appels API

3. **Personnalisez l'application**
   - Modifiez les couleurs dans `tailwind.config.js`
   - Ajoutez votre logo
   - Customisez les messages

## 💡 Commandes utiles

```powershell
# Voir la taille du bundle
npm run build
npm install -g source-map-explorer
source-map-explorer 'build/static/js/*.js'

# Analyser les dépendances
npm list
npm outdated

# Mettre à jour les dépendances
npm update

# Nettoyer complètement
Remove-Item -Recurse -Force node_modules, build
npm install
```

## 🆘 Besoin d'aide ?

### Documentation
- [README.md](./README.md) - Documentation complète
- [QUICKSTART.md](./QUICKSTART.md) - Guide rapide
- [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) - Vue d'ensemble

### Ressources
- React : https://react.dev
- Tailwind CSS : https://tailwindcss.com
- React Router : https://reactrouter.com

### Support
- Email : support@codelearn.com
- Issues GitHub : (ajoutez votre repo)

## ✅ Installation réussie !

Si vous êtes arrivé ici sans erreur, félicitations ! 🎉

Votre environnement de développement CodeLearn est prêt.

**Prochaine étape** : Consultez [QUICKSTART.md](./QUICKSTART.md) pour commencer à développer.

---

Dernière mise à jour : Décembre 2024
