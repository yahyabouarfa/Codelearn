# Quick Test JSON Reference

## Base URL
```
http://localhost:8081
```

---

## 1️⃣ Signup (Register) - Apprenant

**POST** `/api/auth/signup`

```json
{
  "nom": "Dupont",
  "prenom": "Jean",
  "email": "jean.dupont@example.com",
  "motDePasse": "password123",
  "role": "Apprenant"
}
```

---

## 2️⃣ Signup (Register) - Createur

**POST** `/api/auth/signup`

```json
{
  "nom": "Martin",
  "prenom": "Sophie",
  "email": "sophie.martin@example.com",
  "motDePasse": "password123",
  "role": "CreateurDeCours"
}
```

---

## 3️⃣ Signup (Register) - Admin

**POST** `/api/auth/signup`

```json
{
  "nom": "Admin",
  "prenom": "System",
  "email": "admin@example.com",
  "motDePasse": "admin123",
  "role": "Admin"
}
```

---

## 4️⃣ Login

**POST** `/api/auth/login`

```json
{
  "email": "jean.dupont@example.com",
  "motDePasse": "password123"
}
```

**Expected Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "email": "jean.dupont@example.com",
  "nom": "Dupont",
  "prenom": "Jean",
  "role": "Apprenant",
  "message": "Connexion réussie"
}
```

---

## 5️⃣ Logout

**POST** `/api/auth/logout`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
```

**Body:** None

---

## ⚠️ Important Notes

- **NO username field** - Use `email` for authentication
- Field name is `motDePasse` (not `password`)
- Roles: `Apprenant`, `CreateurDeCours`, `Admin`
- Port: **8081** (not 8080)
- Passwords are automatically hashed with BCrypt

---

## 🧪 Copy-Paste Test Data

### Test User 1
```json
{
  "nom": "Test1",
  "prenom": "User1",
  "email": "test1@example.com",
  "motDePasse": "Test123!",
  "role": "Apprenant"
}
```

### Test User 2
```json
{
  "nom": "Test2",
  "prenom": "User2",
  "email": "test2@example.com",
  "motDePasse": "Test123!",
  "role": "CreateurDeCours"
}
```

### Test Login
```json
{
  "email": "test1@example.com",
  "motDePasse": "Test123!"
}
```

---

## 🔍 SQL Queries to Verify

```sql
-- Check all users
SELECT id, nom, prenom, email, role FROM utilisateur;

-- Check specific user
SELECT * FROM utilisateur WHERE email = 'test1@example.com';

-- Verify password is hashed (should start with $2a$ or $2b$)
SELECT email, mot_de_passe FROM utilisateur;
```

---

## ✅ Quick Test Steps in Postman

1. **Create new request**
   - Method: POST
   - URL: `http://localhost:8081/api/auth/signup`
   - Headers: `Content-Type: application/json`
   - Body: Select "raw" → "JSON"
   - Paste signup JSON

2. **Send signup request**
   - Should return 200 OK with token

3. **Copy the token** from response

4. **Create login request**
   - Same setup, change URL to `/api/auth/login`
   - Use login JSON

5. **Test logout**
   - URL: `/api/auth/logout`
   - Add header: `Authorization: Bearer <paste_token>`
   - Send POST request

---

**Quick Reference** | December 10, 2025

