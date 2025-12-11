# Configuration API et Proxy

## Architecture des Services

Le projet CodeLearn utilise une architecture microservices avec les services suivants:

### Services Backend

1. **Service Utilisateur** (User API)
   - URL: `http://192.168.11.156:8081/api`
   - Responsabilités:
     - Authentification (login, register)
     - Gestion des utilisateurs
     - Génération et validation JWT

2. **Service Apprenant** (Learner API)
   - URL: `http://192.168.11.169:8080/api/apprenant`
   - Responsabilités:
     - Recherche de cours
     - Détails des cours
     - Complétion des modules
     - Accès aux supports pédagogiques

3. **Service Créateur** (Creator API)
   - URL: `http://192.168.11.169:8080/api/createur`
   - Responsabilités:
     - Création de cours
     - Gestion des cours
     - Upload de supports

4. **Service Admin** (Admin API)
   - URL: `http://192.168.11.169:8080/api/admin`
   - Responsabilités:
     - Validation des cours
     - Gestion des utilisateurs
     - Statistiques globales

## Configuration des Variables d'Environnement

### .env.development (Développement)
```env
REACT_APP_USER_API_URL=http://192.168.11.156:8081/api
REACT_APP_APPRENANT_API_URL=http://192.168.11.169:8080/api/apprenant
REACT_APP_CREATOR_API_URL=http://192.168.11.169:8080/api/createur
REACT_APP_ADMIN_API_URL=http://192.168.11.169:8080/api/admin
```

### .env.production (Production)
```env
REACT_APP_USER_API_URL=https://api.codelearn.com/user
REACT_APP_APPRENANT_API_URL=https://api.codelearn.com/apprenant
REACT_APP_CREATOR_API_URL=https://api.codelearn.com/createur
REACT_APP_ADMIN_API_URL=https://api.codelearn.com/admin
```

## Configuration CORS

Le backend doit autoriser les requêtes depuis l'origine du frontend.

### Configuration Spring Boot (Backend)

```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins(
                    "http://localhost:3000",
                    "http://192.168.11.156:3000",
                    "https://codelearn.com"
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }
}
```

### Configuration Nginx (Proxy Inverse - Optionnel)

Si vous utilisez Nginx comme proxy inverse:

```nginx
server {
    listen 80;
    server_name api.codelearn.com;

    location /user {
        proxy_pass http://192.168.11.156:8081/api;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        
        # CORS Headers
        add_header 'Access-Control-Allow-Origin' 'http://192.168.11.156:3000' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'Authorization, Content-Type' always;
        add_header 'Access-Control-Allow-Credentials' 'true' always;
    }

    location /apprenant {
        proxy_pass http://192.168.11.169:8080/api/apprenant;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        
        # CORS Headers
        add_header 'Access-Control-Allow-Origin' 'http://192.168.11.156:3000' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'Authorization, Content-Type' always;
        add_header 'Access-Control-Allow-Credentials' 'true' always;
    }
}
```

## Endpoints API

### Service Apprenant

#### GET /courses
Recherche de cours avec pagination

**Query Parameters:**
- `search` (optional): Terme de recherche
- `page` (default: 0): Numéro de page
- `size` (default: 10): Taille de page

**Response:**
```json
{
  "content": [
    {
      "id": 1,
      "titre": "Introduction à Python",
      "description": "Apprenez les bases de Python",
      "createurNom": "Jean Dupont",
      "modules": [],
      "supports": []
    }
  ],
  "totalPages": 5,
  "totalElements": 50,
  "number": 0,
  "size": 10
}
```

#### GET /courses/{id}
Détails d'un cours spécifique

**Response:**
```json
{
  "id": 1,
  "titre": "Introduction à Python",
  "description": "Apprenez les bases de Python",
  "createurNom": "Jean Dupont",
  "modules": [
    {
      "id": 1,
      "titre": "Variables et Types",
      "description": "Introduction aux variables",
      "ordre": 1,
      "completed": false
    }
  ],
  "supports": [
    {
      "id": 1,
      "nom": "Guide Python.pdf",
      "type": "PDF",
      "description": "Guide complet",
      "urlStockage": "..."
    }
  ]
}
```

#### POST /supports/{id}/access
Demande d'accès à un support pédagogique

**Response:**
```json
{
  "temporaryUrl": "https://storage.example.com/...",
  "expiresAt": "2024-01-15T14:30:00Z"
}
```

**Note:** L'URL temporaire expire après 30 minutes.

#### POST /courses/{courseId}/modules/{moduleId}/complete
Marque un module comme complété

**Response:**
```json
{
  "success": true,
  "completedAt": "2024-01-15T14:00:00Z",
  "message": "Module complété avec succès"
}
```

## Gestion des Erreurs

### Structure d'Erreur Standard

```json
{
  "message": "Ressource non trouvée",
  "status": 404,
  "error": "Not Found",
  "path": "/api/apprenant/courses/999",
  "timestamp": "2024-01-15T14:00:00Z"
}
```

### Codes d'Erreur Courants

- **400 Bad Request**: Données invalides
- **401 Unauthorized**: Token manquant ou invalide
- **403 Forbidden**: Accès refusé
- **404 Not Found**: Ressource introuvable
- **500 Internal Server Error**: Erreur serveur

## Authentification

### Flux d'Authentification

1. **Login**: POST `/api/utilisateurs/login`
   - Envoie email et motDePasse
   - Reçoit un JWT token

2. **Stockage du Token**
   - Le token est stocké dans `localStorage` sous la clé `codelearn_access_token`

3. **Utilisation du Token**
   - Toutes les requêtes API incluent le header:
     ```
     Authorization: Bearer {token}
     ```

4. **Expiration**
   - Les tokens expirent après 24 heures
   - L'utilisateur doit se reconnecter

### Intercepteurs Axios

Les intercepteurs Axios gèrent automatiquement:
- L'ajout du token d'authentification
- La gestion des erreurs 401 (redirection vers login)
- Le rafraîchissement de token (si implémenté)

## Réseau et Accès

### Configuration Réseau Locale

Pour rendre le frontend accessible via IP:

**package.json:**
```json
{
  "scripts": {
    "start": "set HOST=0.0.0.0&& react-scripts start"
  }
}
```

### Accès au Frontend
- Localhost: `http://localhost:3000`
- IP Locale: `http://192.168.11.156:3000`

### Accès au Backend
- Service User: `http://192.168.11.156:8081`
- Service Apprenant: `http://192.168.11.169:8080`

## Dépannage

### ERR_BLOCKED_BY_CLIENT
- Causé par des extensions de navigateur (AdBlock, Privacy Badger)
- Solution: Désactiver les extensions ou utiliser le mode navigation privée

### CORS Errors
- Vérifier que le backend autorise l'origine du frontend
- Vérifier la configuration CORS dans Spring Boot
- Vérifier les headers `Access-Control-Allow-*`

### Connection Refused
- Vérifier que les services backend sont démarrés
- Vérifier les ports dans les URLs
- Vérifier le pare-feu Windows/Linux

### Token Expired
- Les tokens JWT expirent après 24h
- L'utilisateur doit se reconnecter
- Implémenter un refresh token si nécessaire
