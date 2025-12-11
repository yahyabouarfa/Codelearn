# CodeLearn - Guide d'intégration des microservices

Ce document décrit l'architecture backend et comment le frontend React interagit avec chaque microservice.

## Architecture Microservices

```
┌─────────────────┐
│  React Frontend │
│   (Port 3000)   │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌────────┐  ┌────────────┐
│  User  │  │ Apprenant  │
│Service │  │  Service   │
│ :8080  │  │   :8081    │
└────────┘  └────────────┘
    │
    ▼         ▼
┌────────┐  ┌────────────┐
│Createur│  │   Admin    │
│Service │  │  Service   │
│ :8082  │  │   :8083    │
└────────┘  └────────────┘
    │
    ▼
┌─────────────┐
│ PostgreSQL  │
│   :5432     │
└─────────────┘
```

## 1. User Service (Port 8080)

### Responsabilités
- Authentification des utilisateurs
- Génération et validation des JWT
- Gestion des profils utilisateurs
- Contrôle d'accès basé sur les rôles

### Endpoints principaux

#### POST `/api/auth/login`
Authentification utilisateur
```json
// Request
{
  "email": "user@example.com",
  "password": "password123"
}

// Response
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "nom": "Dupont",
    "prenom": "Jean",
    "email": "user@example.com",
    "roles": ["APPRENANT"]
  }
}
```

#### POST `/api/auth/signup`
Inscription nouveau utilisateur
```json
// Request
{
  "nom": "Dupont",
  "prenom": "Jean",
  "email": "user@example.com",
  "password": "SecurePass123!",
  "role": "APPRENANT"
}

// Response
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { ... }
}
```

#### GET `/api/users/me`
Récupérer le profil de l'utilisateur connecté
```json
// Headers
Authorization: Bearer <token>

// Response
{
  "id": 1,
  "nom": "Dupont",
  "prenom": "Jean",
  "email": "user@example.com",
  "roles": ["APPRENANT"],
  "createdAt": "2024-01-15T10:30:00Z"
}
```

### Configuration Spring Boot
```yaml
# application.yml
server:
  port: 8080

spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/codelearn_users
    username: postgres
    password: postgres
  jpa:
    hibernate:
      ddl-auto: update

jwt:
  secret: your-256-bit-secret-key
  expiration: 86400000  # 24 hours
```

### Modèle de données
```java
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String nom;
    private String prenom;
    
    @Column(unique = true)
    private String email;
    
    private String password;  // BCrypt encoded
    
    @Enumerated(EnumType.STRING)
    private Role role;  // APPRENANT, CREATEUR, ADMIN
    
    @CreationTimestamp
    private LocalDateTime createdAt;
}
```

## 2. Apprenant Service (Port 8081)

### Responsabilités
- Gestion du catalogue de cours
- Inscription aux cours
- Suivi de progression
- Accès temporaire aux supports

### Endpoints principaux

#### GET `/api/apprenant/courses`
Liste des cours avec pagination et filtres
```
GET /api/apprenant/courses?query=java&page=0&size=10&language=JAVA

// Response
{
  "content": [
    {
      "id": 1,
      "titre": "Introduction à Java",
      "description": "Cours complet sur Java...",
      "language": "JAVA",
      "modulesCount": 10,
      "supportsCount": 15,
      "createur": {
        "id": 2,
        "nom": "Martin",
        "prenom": "Sophie"
      }
    }
  ],
  "totalPages": 5,
  "totalElements": 50,
  "number": 0,
  "size": 10
}
```

#### GET `/api/apprenant/courses/{id}`
Détails d'un cours avec modules et supports
```json
{
  "id": 1,
  "titre": "Introduction à Java",
  "description": "...",
  "language": "JAVA",
  "modules": [
    {
      "id": 1,
      "titre": "Variables et types",
      "description": "...",
      "ordre": 1,
      "completed": false
    }
  ],
  "supports": [
    {
      "id": 1,
      "titre": "Guide Java PDF",
      "type": "PDF",
      "ordre": 1
    }
  ],
  "progress": 30
}
```

#### POST `/api/apprenant/supports/{id}/access`
Demander l'accès temporaire à un support
```json
// Response
{
  "supportId": 1,
  "temporaryUrl": "https://storage.../file.pdf?token=...",
  "expiresAt": "2024-01-15T11:30:00Z",
  "type": "PDF"
}
```

#### POST `/api/apprenant/courses/{courseId}/modules/{moduleId}/complete`
Marquer un module comme complété
```json
// Response
{
  "moduleId": 1,
  "completedAt": "2024-01-15T10:30:00Z",
  "progress": 40  // New course progress percentage
}
```

### Configuration
```yaml
server:
  port: 8081

spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/codelearn_apprenant

support:
  url-expiry-minutes: 30
  storage-path: /uploads/supports
```

## 3. Createur Service (Port 8082)

### Responsabilités
- Création et modification de cours
- Gestion des modules
- Upload de supports (PDF/Video)
- Statistiques des cours

### Endpoints principaux

#### POST `/api/createur/courses`
Créer un nouveau cours
```json
// Request
{
  "titre": "Introduction à Python",
  "description": "Cours complet Python...",
  "language": "PYTHON",
  "modules": [
    {
      "titre": "Variables",
      "description": "Comprendre les variables",
      "ordre": 1
    }
  ]
}

// Response
{
  "id": 5,
  "titre": "Introduction à Python",
  "status": "DRAFT",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

#### PUT `/api/createur/courses/{id}`
Mettre à jour un cours
```json
// Request
{
  "titre": "Python Avancé",
  "description": "...",
  "language": "PYTHON"
}
```

#### POST `/api/createur/courses/{courseId}/supports`
Upload un support de cours (multipart/form-data)
```
POST /api/createur/courses/1/supports
Content-Type: multipart/form-data

file: [binary]
titre: Guide Python
type: PDF

// Response
{
  "id": 10,
  "titre": "Guide Python",
  "type": "PDF",
  "fileSize": 2048576,
  "uploadedAt": "2024-01-15T10:30:00Z"
}
```

#### GET `/api/createur/courses/mine`
Liste des cours du créateur
```json
{
  "content": [
    {
      "id": 1,
      "titre": "Introduction à Java",
      "status": "APPROVED",
      "studentsCount": 45,
      "modulesCount": 10
    }
  ],
  "totalElements": 5
}
```

### Configuration
```yaml
server:
  port: 8082

spring:
  servlet:
    multipart:
      max-file-size: 100MB
      max-request-size: 100MB

file:
  upload-dir: /app/uploads
  allowed-types:
    video: mp4,mpeg,mov
    pdf: pdf
```

## 4. Admin Service (Port 8083)

### Responsabilités
- Validation/Rejet des cours
- Gestion des utilisateurs
- Modification des rôles
- Statistiques globales

### Endpoints principaux

#### GET `/api/admin/courses/pending`
Liste des cours en attente de validation
```json
{
  "content": [
    {
      "id": 3,
      "titre": "JavaScript ES6",
      "createur": {
        "id": 5,
        "nom": "Bernard",
        "prenom": "Marie"
      },
      "submittedAt": "2024-01-15T10:00:00Z",
      "modulesCount": 8
    }
  ]
}
```

#### POST `/api/admin/courses/{id}/validate`
Valider un cours
```json
// Request
{
  "comments": "Excellent contenu, approuvé"
}

// Response
{
  "id": 3,
  "status": "APPROVED",
  "validatedAt": "2024-01-15T10:30:00Z"
}
```

#### POST `/api/admin/courses/{id}/reject`
Rejeter un cours
```json
// Request
{
  "reason": "Le contenu nécessite plus de détails..."
}

// Response
{
  "id": 3,
  "status": "REJECTED",
  "rejectedAt": "2024-01-15T10:30:00Z",
  "rejectionReason": "..."
}
```

#### GET `/api/admin/users`
Liste tous les utilisateurs
```json
{
  "content": [
    {
      "id": 1,
      "nom": "Dupont",
      "prenom": "Jean",
      "email": "jean@example.com",
      "role": "APPRENANT",
      "active": true
    }
  ],
  "totalElements": 150
}
```

#### PUT `/api/admin/users/{id}/role`
Modifier le rôle d'un utilisateur
```json
// Request
{
  "role": "CREATEUR"
}
```

### Configuration
```yaml
server:
  port: 8083

admin:
  auto-approve: false
  notification-email: admin@codelearn.com
```

## Authentification JWT

### Flow d'authentification

1. **Login** : L'utilisateur s'authentifie via `/api/auth/login`
2. **Token** : Le backend retourne un JWT
3. **Storage** : Le frontend stocke le token dans `localStorage`
4. **Requêtes** : Chaque requête inclut le token dans le header `Authorization`

### Structure du JWT
```
Header:
{
  "alg": "HS256",
  "typ": "JWT"
}

Payload:
{
  "sub": "user@example.com",
  "userId": 1,
  "roles": ["APPRENANT"],
  "iat": 1705315800,
  "exp": 1705402200
}
```

### Implémentation côté frontend

```javascript
// Axios interceptor
api.interceptors.request.use(config => {
  const token = localStorage.getItem('codelearn_access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

## Gestion des erreurs

### Codes HTTP utilisés
- `200` : Succès
- `201` : Création réussie
- `400` : Erreur de validation
- `401` : Non authentifié
- `403` : Accès refusé
- `404` : Ressource introuvable
- `422` : Entité non traitable
- `500` : Erreur serveur

### Format des erreurs
```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Le titre du cours est requis",
  "path": "/api/createur/courses"
}
```

## Déploiement complet

### Avec Docker Compose

```bash
# Démarrer tous les services
docker-compose up -d

# Vérifier les logs
docker-compose logs -f

# Arrêter tous les services
docker-compose down
```

### Ordre de démarrage
1. PostgreSQL
2. User Service
3. Services métier (Apprenant, Créateur, Admin)
4. Frontend React

## Tests d'intégration

### Avec curl

```bash
# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","password":"password123"}'

# Get courses (avec token)
curl -X GET http://localhost:8081/api/apprenant/courses \
  -H "Authorization: Bearer <token>"
```

### Avec Postman

Importez la collection Postman fournie avec chaque service pour tester les endpoints.

## Support & Documentation

- **Swagger UI** : Disponible sur chaque service
  - User: http://localhost:8080/swagger-ui.html
  - Apprenant: http://localhost:8081/swagger-ui.html
  - Createur: http://localhost:8082/swagger-ui.html
  - Admin: http://localhost:8083/swagger-ui.html

---

**Note importante** : Ce document décrit les contrats d'API attendus. Chaque service backend Spring Boot doit implémenter ces endpoints pour assurer le bon fonctionnement du frontend.
