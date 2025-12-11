# Postman API Tests for Codelearn Backend

## ⚙️ Configuration

**Base URL:** `http://localhost:8081`  
**Server Port:** `8081`  
**Database:** PostgreSQL (Neon)

> **⚠️ IMPORTANT:** This application does NOT use a separate `username` field. Users authenticate with their **email address**. The `getUsername()` method returns the email.

---

## 🔐 Authentication Endpoints

### 1. Signup (Register New User)

**POST** `/api/auth/signup`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**

#### Register as Apprenant (Learner)
```json
{
  "nom": "Dupont",
  "prenom": "Jean",
  "email": "jean.dupont@example.com",
  "motDePasse": "password123",
  "role": "Apprenant"
}
```

#### Register as Createur (Course Creator)
```json
{
  "nom": "Martin",
  "prenom": "Sophie",
  "email": "sophie.martin@example.com",
  "motDePasse": "password123",
  "role": "CreateurDeCours"
}
```

#### Register as Admin
```json
{
  "nom": "Admin",
  "prenom": "Super",
  "email": "admin@example.com",
  "motDePasse": "admin123",
  "role": "Admin"
}
```

**Expected Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJqZWFuLmR1cG9udEBleGFtcGxlLmNvbSIsImlhdCI6MTcwMjIzNDU2NywiZXhwIjoxNzAyMzIwOTY3fQ.signature",
  "email": "jean.dupont@example.com",
  "nom": "Dupont",
  "prenom": "Jean",
  "role": "Apprenant",
  "message": "Inscription réussie"
}
```

**Error Response (400 Bad Request):**
```json
{
  "token": null,
  "email": null,
  "nom": null,
  "prenom": null,
  "role": null,
  "message": "Un utilisateur avec cet email existe déjà"
}
```

---

### 2. Login

**POST** `/api/auth/login`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "email": "jean.dupont@example.com",
  "motDePasse": "password123"
}
```

**Expected Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJqZWFuLmR1cG9udEBleGFtcGxlLmNvbSIsImlhdCI6MTcwMjIzNDU2NywiZXhwIjoxNzAyMzIwOTY3fQ.signature",
  "email": "jean.dupont@example.com",
  "nom": "Dupont",
  "prenom": "Jean",
  "role": "Apprenant",
  "message": "Connexion réussie"
}
```

**Error Response (401 Unauthorized):**
```json
{
  "timestamp": "2025-12-10T22:00:00.000+00:00",
  "status": 401,
  "error": "Unauthorized",
  "message": "Bad credentials",
  "path": "/api/auth/login"
}
```

---

### 3. Logout

**POST** `/api/auth/logout`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <your_jwt_token>
```

**Body:** None

**Expected Response (200 OK):**
```json
{
  "token": null,
  "email": null,
  "nom": null,
  "prenom": null,
  "role": null,
  "message": "Déconnexion réussie"
}
```

---

## 📝 Test Scenarios

### Scenario 1: Complete User Registration and Login Flow

1. **Register a new user**
   - POST `/api/auth/signup` with the signup JSON
   - Save the returned `token` from the response

2. **Login with the same user**
   - POST `/api/auth/login` with the login JSON
   - Verify the token is returned

3. **Logout**
   - POST `/api/auth/logout` with `Authorization: Bearer <token>` header

---

### Scenario 2: Test Error Cases

#### 2.1 Register with duplicate email
- POST `/api/auth/signup` with an email that already exists
- Expected: 400 Bad Request

#### 2.2 Login with wrong password
```json
{
  "email": "jean.dupont@example.com",
  "motDePasse": "wrongpassword"
}
```
- Expected: 401 Unauthorized

#### 2.3 Login with non-existent user
```json
{
  "email": "notexist@example.com",
  "motDePasse": "password123"
}
```
- Expected: 401 Unauthorized

#### 2.4 Signup with missing fields
```json
{
  "email": "test@example.com",
  "motDePasse": "password123"
}
```
- Expected: 400 Bad Request (validation error)

#### 2.5 Signup with invalid email format
```json
{
  "nom": "Test",
  "prenom": "User",
  "email": "invalid-email",
  "motDePasse": "password123"
}
```
- Expected: 400 Bad Request (validation error)

---

## 🔑 Using JWT Token in Subsequent Requests

After login/signup, you'll receive a JWT token. For all protected endpoints (if any are added later), include this token in the header:

**Authorization Header:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJqZWFuLmR1cG9udEBleGFtcGxlLmNvbSIsImlhdCI6MTcwMjIzNDU2NywiZXhwIjoxNzAyMzIwOTY3fQ.signature
```

---

## 📋 Postman Collection Setup

### Environment Variables

Create a Postman environment with these variables:

| Variable | Initial Value | Current Value |
|----------|---------------|---------------|
| `base_url` | `http://localhost:8081` | `http://localhost:8081` |
| `jwt_token` | | (will be set automatically) |

### Auto-save JWT Token

In the **Tests** tab of the signup/login requests, add this script:

```javascript
// Save the JWT token to environment variable
if (pm.response.code === 200) {
    var jsonData = pm.response.json();
    if (jsonData.token) {
        pm.environment.set("jwt_token", jsonData.token);
        console.log("Token saved: " + jsonData.token);
    }
}
```

Then in protected requests, use:
```
Authorization: Bearer {{jwt_token}}
```

---

## 🧪 Quick Test Data

### Test User 1 (Apprenant)
```json
{
  "nom": "Dupont",
  "prenom": "Jean",
  "email": "jean.dupont@test.com",
  "motDePasse": "Test123!",
  "role": "Apprenant"
}
```

### Test User 2 (Createur)
```json
{
  "nom": "Bernard",
  "prenom": "Marie",
  "email": "marie.bernard@test.com",
  "motDePasse": "Test123!",
  "role": "CreateurDeCours"
}
```

### Test User 3 (Admin)
```json
{
  "nom": "Admin",
  "prenom": "System",
  "email": "admin@test.com",
  "motDePasse": "Admin123!",
  "role": "Admin"
}
```

---

## 🔍 Testing Password Hashing

To verify passwords are hashed:

1. Register a user with a known password
2. Check the database directly:
   ```sql
   SELECT id, nom, prenom, email, mot_de_passe, role FROM utilisateur WHERE email = 'test@example.com';
   ```
3. The `mot_de_passe` field should show a BCrypt hash starting with `$2a$` or `$2b$`
4. Example: `$2a$10$N9qo8uLOickgx2ZMRZoMye.IjzL.Y7pEQjWZ8PQCQJm7KpYc6QpOG`

### Database Schema

The `utilisateur` table has these columns:
- `id` (BIGINT, Primary Key)
- `nom` (VARCHAR)
- `prenom` (VARCHAR)
- `email` (VARCHAR, UNIQUE) - **Used as username for authentication**
- `mot_de_passe` (VARCHAR) - BCrypt hashed password
- `role` (VARCHAR) - Enum: Apprenant, CreateurDeCours, Admin

---

## 🌐 Testing from Other Devices (Network Access)

Since your server is configured with `server.address=0.0.0.0`, you can test from other devices on the same network:

1. Find your local IP address:
   ```powershell
   ipconfig
   ```
   Look for `IPv4 Address` (e.g., `192.168.1.100`)

2. Use this as your base URL:
   ```
   http://192.168.1.100:8081/api/auth/signup
   ```

3. Make sure your firewall allows port 8081

---

## ✅ Success Checklist

- [ ] Signup with new user returns token
- [ ] Signup with duplicate email returns error
- [ ] Login with correct credentials returns token
- [ ] Login with wrong password returns 401
- [ ] Logout returns success message
- [ ] Password is hashed in database (not plain text)
- [ ] JWT token is valid and can be decoded
- [ ] API accessible from localhost:8081
- [ ] API accessible from network IP (if needed)

---

## 🐛 Common Issues

### Issue: Port 8080 already in use
**Solution:** Your app uses port 8081, not 8080. Use `http://localhost:8081`

### Issue: 403 Forbidden on /api/auth/signup
**Solution:** Check SecurityConfig - `/api/auth/**` should be permitted

### Issue: CORS error from frontend
**Solution:** CorsConfig is set to allow all origins (`allowedOrigins("*")`)

### Issue: Cannot connect from another device
**Solution:** Check firewall settings and ensure using correct network IP

### Issue: Token expired
**Solution:** JWT tokens expire after 24 hours. Login again to get new token

---

## 📊 Expected Status Codes

| Endpoint | Success | Error Cases |
|----------|---------|-------------|
| POST /api/auth/signup | 200 OK | 400 (duplicate/validation) |
| POST /api/auth/login | 200 OK | 401 (wrong credentials) |
| POST /api/auth/logout | 200 OK | 401 (no token) |

---

**Last Updated:** December 10, 2025  
**Spring Boot Version:** 3.x  
**Java Version:** 17

