# Guide de démarrage rapide - CodeLearn

## Installation rapide (5 minutes)

### 1. Prérequis
```bash
# Vérifier Node.js
node --version  # Doit être >= 16.0

# Vérifier npm
npm --version   # Doit être >= 8.0
```

### 2. Installation

```bash
# Cloner et installer
cd codelearnfront
npm install
```

### 3. Configuration

Créez un fichier `.env.development` à la racine :

```env
REACT_APP_USER_API=http://localhost:8080/api
REACT_APP_APPRENANT_API=http://localhost:8081/api/apprenant
REACT_APP_CREATEUR_API=http://localhost:8082/api/createur
REACT_APP_ADMIN_API=http://localhost:8083/api/admin
REACT_APP_TOKEN_KEY=codelearn_access_token
REACT_APP_APP_NAME=CodeLearn
```

### 4. Démarrage

```bash
npm start
```

L'application démarre sur **http://localhost:3000**

## Comptes de test

### Apprenant
```
Email: apprenant@test.com
Password: Test123!
```

### Créateur
```
Email: createur@test.com
Password: Test123!
```

### Admin
```
Email: admin@test.com
Password: Test123!
```

## Structure du projet

```
codelearnfront/
├── src/
│   ├── components/     # Composants réutilisables
│   ├── pages/          # Pages de l'app
│   ├── services/       # Services API
│   ├── context/        # State management
│   ├── hooks/          # Custom hooks
│   ├── utils/          # Utilitaires
│   └── config/         # Configuration
├── public/             # Fichiers statiques
├── .env.example        # Template variables d'environnement
└── package.json        # Dépendances
```

## Commandes principales

```bash
# Développement
npm start

# Build production
npm run build

# Tests
npm test

# Avec Docker
docker-compose up
```

## Troubleshooting

### Le backend ne répond pas
✅ Vérifiez que les 4 microservices backend sont démarrés
✅ Vérifiez les URLs dans `.env.development`

### Erreur 401 (Non autorisé)
✅ Le token JWT a expiré, reconnectez-vous
✅ Vérifiez la configuration JWT côté backend

### Les uploads de fichiers échouent
✅ Vérifiez la limite de taille dans le backend (default: 100MB)
✅ Vérifiez les types de fichiers autorisés

### Page blanche après build
✅ Vérifiez la configuration nginx
✅ Vérifiez les chemins dans le `package.json`

## Prochaines étapes

1. ✅ Parcourir le catalogue de cours
2. ✅ Créer un cours (compte créateur)
3. ✅ Valider des cours (compte admin)
4. ✅ Suivre votre progression

## Support

📧 Email: support@codelearn.com
📚 Documentation: [README.md](./README.md)
🔧 Backend: [BACKEND_INTEGRATION.md](./BACKEND_INTEGRATION.md)

---

Bon apprentissage avec CodeLearn! 🚀
