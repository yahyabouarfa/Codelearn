# Authentication System Guide

## Overview

This application uses **email-based authentication** with JWT tokens. There is **NO separate username field**.

## Database Structure

### Utilisateur Table

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Unique user ID |
| `nom` | VARCHAR | NOT NULL | Last name |
| `prenom` | VARCHAR | NOT NULL | First name |
| `email` | VARCHAR | UNIQUE, NOT NULL | Email (used as username) |
| `mot_de_passe` | VARCHAR | NOT NULL | BCrypt hashed password |
| `role` | VARCHAR | NOT NULL | Role enum value |

### Important Notes

- ✅ **Email is the username**: Users authenticate using their email address
- ✅ **No username field**: The `username` column does NOT exist in the database
- ✅ **UserDetails.getUsername()** returns the `email` field
- ✅ **Passwords are hashed**: Using BCrypt with strength 10

## Authentication Flow

### 1. Signup (Registration)

**Endpoint:** `POST /api/auth/signup`

**Request Fields:**
```json
{
  "nom": "string (required)",
  "prenom": "string (required)",
  "email": "string (required, valid email format)",
  "motDePasse": "string (required)",
  "role": "Role enum (optional, defaults to Apprenant)"
}
```

**Process:**
1. Validate request fields
2. Check if email already exists
3. Hash the password using BCrypt
4. Create new Utilisateur entity
5. Save to database
6. Generate JWT token
7. Return AuthResponse with token

**Response:**
```json
{
  "token": "JWT token string",
  "email": "user@example.com",
  "nom": "Dupont",
  "prenom": "Jean",
  "role": "Apprenant",
  "message": "Inscription réussie"
}
```

### 2. Login

**Endpoint:** `POST /api/auth/login`

**Request Fields:**
```json
{
  "email": "string (required, valid email format)",
  "motDePasse": "string (required)"
}
```

**Process:**
1. Validate credentials using AuthenticationManager
2. Load user by email from database
3. Verify password (BCrypt comparison)
4. Generate new JWT token
5. Return AuthResponse with token

**Response:** Same as signup

### 3. Logout

**Endpoint:** `POST /api/auth/logout`

**Headers:** `Authorization: Bearer <token>`

**Process:**
- JWT logout is typically handled client-side (remove token)
- Server just returns success message
- Optional: Implement token blacklisting for enhanced security

## Roles

### Available Roles (Enum)

1. **Apprenant** (Learner/Student)
   - Default role if not specified
   - Can enroll in courses
   - Can view content and complete exercises

2. **CreateurDeCours** (Course Creator/Instructor)
   - Can create and manage courses
   - Can create chapters and exercises
   - Can view student progress

3. **Admin** (Administrator)
   - Full system access
   - Can manage all users and content

### Role Format in Database

Stored as STRING enum: `Apprenant`, `CreateurDeCours`, `Admin`

### Role in JWT

Stored as authority with `ROLE_` prefix: `ROLE_Apprenant`, `ROLE_CreateurDeCours`, `ROLE_Admin`

## Security Configuration

### Public Endpoints (No Authentication Required)

- `POST /api/auth/signup`
- `POST /api/auth/login`

### Protected Endpoints (Authentication Required)

- `POST /api/auth/logout`
- Any future endpoints (courses, chapters, exercises, etc.)

### JWT Token

**Format:** `Bearer <token>`

**Token Structure:**
```
eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyQGV4YW1wbGUuY29tIiwiaWF0IjoxNzAyMjM0NTY3LCJleHAiOjE3MDIzMjA5Njd9.signature
```

**Claims:**
- `sub`: Email (username)
- `iat`: Issued at timestamp
- `exp`: Expiration timestamp (24 hours from issue)

**Token Expiration:** 24 hours (86400000 milliseconds)

## Password Security

### Hashing

- **Algorithm:** BCrypt
- **Strength:** 10 rounds
- **Implementation:** Spring Security's `PasswordEncoder`

### Example Hash

Plain text: `password123`  
Hashed: `$2a$10$N9qo8uLOickgx2ZMRZoMye.IjzL.Y7pEQjWZ8PQCQJm7KpYc6QpOG`

### Verification

Passwords are **never** stored in plain text. BCrypt automatically handles:
- Salt generation
- Hashing
- Verification (comparing plain text with hash)

## Common Confusion Points

### ❌ Wrong: Using "username" field

```json
{
  "username": "john123",
  "password": "password123"
}
```

**Problem:** The database has no `username` column. The field is named `email`.

### ✅ Correct: Using "email" field

```json
{
  "email": "john@example.com",
  "motDePasse": "password123"
}
```

**Why:** The `Utilisateur` entity uses `email` as the unique identifier and `getUsername()` returns the email.

### Field Names (French)

| English | French (Used in Code) |
|---------|----------------------|
| password | `motDePasse` |
| last name | `nom` |
| first name | `prenom` |
| email | `email` (same) |

## Testing Authentication

### Test Scenario 1: Complete Flow

```bash
# 1. Signup
POST http://localhost:8081/api/auth/signup
Content-Type: application/json

{
  "nom": "Test",
  "prenom": "User",
  "email": "test@example.com",
  "motDePasse": "Test123!",
  "role": "Apprenant"
}

# Response: Save the token
# token: "eyJhbGci..."

# 2. Login with same credentials
POST http://localhost:8081/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "motDePasse": "Test123!"
}

# 3. Use token for protected endpoints
POST http://localhost:8081/api/auth/logout
Authorization: Bearer eyJhbGci...
```

### Test Scenario 2: Error Cases

```bash
# Duplicate email (should fail)
POST http://localhost:8081/api/auth/signup
{
  "email": "test@example.com",  # Already exists
  "nom": "Another",
  "prenom": "User",
  "motDePasse": "password"
}
# Expected: 400 Bad Request

# Wrong password (should fail)
POST http://localhost:8081/api/auth/login
{
  "email": "test@example.com",
  "motDePasse": "wrongpassword"
}
# Expected: 401 Unauthorized

# Invalid email format (should fail)
POST http://localhost:8081/api/auth/signup
{
  "email": "notanemail",
  "nom": "Test",
  "prenom": "User",
  "motDePasse": "password"
}
# Expected: 400 Bad Request (validation error)
```

## Database Queries for Verification

### Check if user exists
```sql
SELECT * FROM utilisateur WHERE email = 'test@example.com';
```

### View all users with roles
```sql
SELECT id, nom, prenom, email, role 
FROM utilisateur 
ORDER BY id DESC;
```

### Check password hash format
```sql
SELECT email, 
       SUBSTRING(mot_de_passe, 1, 10) as hash_prefix
FROM utilisateur;
-- Should show: $2a$10$ or $2b$10$
```

### Count users by role
```sql
SELECT role, COUNT(*) as count
FROM utilisateur
GROUP BY role;
```

## Frontend Integration

### Storing JWT Token

```javascript
// After successful login/signup
const response = await fetch('http://localhost:8081/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    motDePasse: 'password123'
  })
});

const data = await response.json();

// Store token in localStorage
localStorage.setItem('jwt_token', data.token);
localStorage.setItem('user_email', data.email);
localStorage.setItem('user_role', data.role);
```

### Using Token in Requests

```javascript
const token = localStorage.getItem('jwt_token');

const response = await fetch('http://localhost:8081/api/protected-endpoint', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

### Logout

```javascript
// Call logout endpoint
await fetch('http://localhost:8081/api/auth/logout', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

// Remove token from storage
localStorage.removeItem('jwt_token');
localStorage.removeItem('user_email');
localStorage.removeItem('user_role');

// Redirect to login page
window.location.href = '/login';
```

## Troubleshooting

### Issue: "Cannot find username in database"

**Cause:** Trying to use a `username` field that doesn't exist

**Solution:** Use `email` instead:
```json
{
  "email": "user@example.com",
  "motDePasse": "password123"
}
```

### Issue: "403 Forbidden on /api/auth/signup"

**Cause:** Security config blocking public endpoints

**Solution:** Check `SecurityConfig.java`:
```java
.requestMatchers("/api/auth/**").permitAll()
```

### Issue: "Password not hashed in database"

**Cause:** PasswordEncoder not being used

**Solution:** Verify in `UtilisateurService.signup()`:
```java
.motDePasse(passwordEncoder.encode(request.getMotDePasse()))
```

### Issue: "Token not working after login"

**Cause:** Token not included in Authorization header

**Solution:** Add header:
```
Authorization: Bearer <your_token_here>
```

---

**Last Updated:** December 10, 2025  
**Application:** Codelearn Backend  
**Framework:** Spring Boot 3.x with Spring Security

