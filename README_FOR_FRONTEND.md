# Codelearn Backend API - Frontend Integration Guide

## 📋 Table of Contents
1. [Overview](#overview)
2. [Server Configuration](#server-configuration)
3. [Authentication System](#authentication-system)
4. [API Endpoints](#api-endpoints)
5. [Data Models](#data-models)
6. [Error Handling](#error-handling)
7. [CORS Configuration](#cors-configuration)
8. [Frontend Implementation Guide](#frontend-implementation-guide)
9. [Testing & Examples](#testing--examples)

---

## Overview

This is a **Spring Boot 3.x** REST API backend for the Codelearn application with JWT-based authentication. The backend handles user management, authentication, and will support courses, chapters, and exercises.

### Technology Stack
- **Framework:** Spring Boot 3.x
- **Language:** Java 17
- **Database:** PostgreSQL (Neon Cloud)
- **Security:** Spring Security + JWT
- **Authentication:** Email-based (no separate username)
- **Password Hashing:** BCrypt

---

## Server Configuration

### Base URLs

| Environment | URL |
|------------|-----|
| **Local Development** | `http://localhost:8081` |
| **Network Access** | `http://<server-ip>:8081` |

### Port
```
8081
```

### Server Settings
- **Address:** `0.0.0.0` (accessible from any network interface)
- **Context Path:** `/`
- **CORS:** Enabled for all origins

---

## Authentication System

### 🔑 Key Authentication Details

#### No Username Field
⚠️ **IMPORTANT:** This API does **NOT** use a separate `username` field. Users authenticate with their **email address**.

```javascript
// ❌ WRONG - No username field
{ "username": "john123", "password": "..." }

// ✅ CORRECT - Use email
{ "email": "john@example.com", "motDePasse": "..." }
```

#### Field Names (French)
| English | French (API) |
|---------|-------------|
| password | `motDePasse` |
| first name | `prenom` |
| last name | `nom` |
| email | `email` |
| active | `actif` |

#### JWT Token
- **Format:** `Bearer <token>`
- **Expiration:** 24 hours
- **Storage:** Store in `localStorage` or secure cookie
- **Usage:** Include in `Authorization` header for protected routes

---

## API Endpoints

### 1️⃣ Signup (User Registration)

**Endpoint:** `POST /api/auth/signup`

**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
  "nom": "Dupont",
  "prenom": "Jean",
  "email": "jean.dupont@example.com",
  "motDePasse": "password123",
  "role": "Apprenant"
}
```

**Available Roles:**
- `Apprenant` - Student/Learner (default)
- `CreateurDeCours` - Course Creator/Instructor
- `Administrateur` - Administrator

**Success Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJqZWFuLmR1cG9udEBleGFtcGxlLmNvbSIsImlhdCI6MTcwMjIzNDU2NywiZXhwIjoxNzAyMzIwOTY3fQ...",
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

**Validation Errors (400 Bad Request):**
```json
{
  "timestamp": "2025-12-10T22:00:00.000+00:00",
  "status": 400,
  "error": "Bad Request",
  "message": "L'email est obligatoire",
  "path": "/api/auth/signup"
}
```

**Validation Rules:**
- `nom`: Required, non-blank
- `prenom`: Required, non-blank
- `email`: Required, valid email format, unique
- `motDePasse`: Required, non-blank
- `role`: Optional (defaults to `Apprenant`)

---

### 2️⃣ Login

**Endpoint:** `POST /api/auth/login`

**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
  "email": "jean.dupont@example.com",
  "motDePasse": "password123"
}
```

**Success Response (200 OK):**
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

### 3️⃣ Logout

**Endpoint:** `POST /api/auth/logout`

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9..."
}
```

**Request Body:** None

**Success Response (200 OK):**
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

**Note:** JWT logout is primarily handled client-side by removing the token from storage.

---

## Data Models

### User (Utilisateur)

```typescript
interface User {
  id: number;                    // Auto-generated
  nom: string;                   // Last name
  prenom: string;                // First name
  email: string;                 // Email (unique, used as username)
  motDePasse: string;            // Password (hashed with BCrypt)
  role: Role;                    // User role enum
  actif: boolean;                // Account active status (default: true)
}
```

### Role Enum

```typescript
enum Role {
  Apprenant = "Apprenant",              // Student
  CreateurDeCours = "CreateurDeCours",  // Instructor
  Administrateur = "Administrateur"     // Admin
}
```

### AuthResponse

```typescript
interface AuthResponse {
  token: string | null;       // JWT token
  email: string | null;       // User email
  nom: string | null;         // Last name
  prenom: string | null;      // First name
  role: string | null;        // Role as string
  message: string;            // Success/error message
}
```

### SignupRequest

```typescript
interface SignupRequest {
  nom: string;                // Required
  prenom: string;             // Required
  email: string;              // Required, valid email format
  motDePasse: string;         // Required
  role?: Role;                // Optional (defaults to Apprenant)
}
```

### LoginRequest

```typescript
interface LoginRequest {
  email: string;              // Required, valid email format
  motDePasse: string;         // Required
}
```

---

## Error Handling

### HTTP Status Codes

| Status | Meaning | When It Occurs |
|--------|---------|----------------|
| 200 | OK | Successful request |
| 400 | Bad Request | Validation error, duplicate email |
| 401 | Unauthorized | Invalid credentials, missing/invalid token |
| 403 | Forbidden | Access denied (shouldn't occur on auth endpoints) |
| 500 | Internal Server Error | Server error (check logs) |

### Error Response Format

```typescript
interface ErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
}
```

**Example:**
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

## CORS Configuration

### Allowed Origins
```
* (All origins)
```

### Allowed Methods
```
GET, POST, PUT, DELETE, OPTIONS, PATCH
```

### Allowed Headers
```
* (All headers including Authorization)
```

### Credentials
```
allowCredentials: true
```

**What this means for frontend:**
- ✅ You can call the API from any domain
- ✅ You can use any HTTP method
- ✅ You can send any headers (including Authorization)
- ✅ Cookies and credentials are supported

---

## Frontend Implementation Guide

### 1. Authentication Service (React/Vue/Angular)

```typescript
// api/authService.ts

const API_BASE_URL = 'http://localhost:8081/api/auth';

interface SignupData {
  nom: string;
  prenom: string;
  email: string;
  motDePasse: string;
  role?: 'Apprenant' | 'CreateurDeCours' | 'Administrateur';
}

interface LoginData {
  email: string;
  motDePasse: string;
}

interface AuthResponse {
  token: string | null;
  email: string | null;
  nom: string | null;
  prenom: string | null;
  role: string | null;
  message: string;
}

export const authService = {
  // Signup
  async signup(data: SignupData): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Signup failed');
    }

    const result = await response.json();
    
    // Store token if signup successful
    if (result.token) {
      localStorage.setItem('jwt_token', result.token);
      localStorage.setItem('user_email', result.email);
      localStorage.setItem('user_role', result.role);
      localStorage.setItem('user_nom', result.nom);
      localStorage.setItem('user_prenom', result.prenom);
    }

    return result;
  },

  // Login
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    const result = await response.json();
    
    // Store token if login successful
    if (result.token) {
      localStorage.setItem('jwt_token', result.token);
      localStorage.setItem('user_email', result.email);
      localStorage.setItem('user_role', result.role);
      localStorage.setItem('user_nom', result.nom);
      localStorage.setItem('user_prenom', result.prenom);
    }

    return result;
  },

  // Logout
  async logout(): Promise<void> {
    const token = localStorage.getItem('jwt_token');
    
    if (token) {
      try {
        await fetch(`${API_BASE_URL}/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      } catch (error) {
        console.error('Logout request failed:', error);
      }
    }

    // Always clear local storage
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_nom');
    localStorage.removeItem('user_prenom');
  },

  // Get current token
  getToken(): string | null {
    return localStorage.getItem('jwt_token');
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!localStorage.getItem('jwt_token');
  },

  // Get current user info
  getCurrentUser() {
    return {
      email: localStorage.getItem('user_email'),
      nom: localStorage.getItem('user_nom'),
      prenom: localStorage.getItem('user_prenom'),
      role: localStorage.getItem('user_role'),
    };
  },
};
```

---

### 2. API Client with Token Interceptor

```typescript
// api/apiClient.ts

const API_BASE_URL = 'http://localhost:8081';

export async function apiCall(
  endpoint: string,
  options: RequestInit = {}
): Promise<any> {
  const token = localStorage.getItem('jwt_token');

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  // Add token if available
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Handle 401 Unauthorized - token expired or invalid
  if (response.status === 401) {
    localStorage.clear();
    window.location.href = '/login';
    throw new Error('Session expired. Please login again.');
  }

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Request failed');
  }

  return response.json();
}
```

---

### 3. React Hook Example

```typescript
// hooks/useAuth.ts

import { useState } from 'react';
import { authService } from '../api/authService';

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signup = async (data: SignupData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.signup(data);
      return response;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const login = async (data: LoginData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.login(data);
      return response;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
      window.location.href = '/login';
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    signup,
    login,
    logout,
    loading,
    error,
    isAuthenticated: authService.isAuthenticated(),
    currentUser: authService.getCurrentUser(),
  };
}
```

---

### 4. Protected Route Component (React)

```typescript
// components/ProtectedRoute.tsx

import { Navigate } from 'react-router-dom';
import { authService } from '../api/authService';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const isAuthenticated = authService.isAuthenticated();
  const currentUser = authService.getCurrentUser();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && currentUser.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}

// Usage:
// <ProtectedRoute>
//   <Dashboard />
// </ProtectedRoute>
//
// <ProtectedRoute requiredRole="Administrateur">
//   <AdminPanel />
// </ProtectedRoute>
```

---

### 5. Login Form Example (React)

```typescript
// components/LoginForm.tsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, motDePasse });
      navigate('/dashboard');
    } catch (err) {
      // Error is handled by useAuth hook
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      
      <div>
        <label htmlFor="password">Mot de passe:</label>
        <input
          id="password"
          type="password"
          value={motDePasse}
          onChange={(e) => setMotDePasse(e.target.value)}
          required
        />
      </div>

      {error && <div className="error">{error}</div>}

      <button type="submit" disabled={loading}>
        {loading ? 'Connexion...' : 'Se connecter'}
      </button>
    </form>
  );
}
```

---

### 6. Signup Form Example (React)

```typescript
// components/SignupForm.tsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function SignupForm() {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    motDePasse: '',
    role: 'Apprenant' as const,
  });
  
  const { signup, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signup(formData);
      navigate('/dashboard');
    } catch (err) {
      // Error is handled by useAuth hook
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="nom">Nom:</label>
        <input
          id="nom"
          name="nom"
          type="text"
          value={formData.nom}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="prenom">Prénom:</label>
        <input
          id="prenom"
          name="prenom"
          type="text"
          value={formData.prenom}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="motDePasse">Mot de passe:</label>
        <input
          id="motDePasse"
          name="motDePasse"
          type="password"
          value={formData.motDePasse}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="role">Rôle:</label>
        <select
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
        >
          <option value="Apprenant">Apprenant (Étudiant)</option>
          <option value="CreateurDeCours">Créateur de cours</option>
          <option value="Administrateur">Administrateur</option>
        </select>
      </div>

      {error && <div className="error">{error}</div>}

      <button type="submit" disabled={loading}>
        {loading ? 'Inscription...' : "S'inscrire"}
      </button>
    </form>
  );
}
```

---

## Testing & Examples

### Using Fetch API

```javascript
// Signup
const signupResponse = await fetch('http://localhost:8081/api/auth/signup', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    nom: 'Dupont',
    prenom: 'Jean',
    email: 'jean@example.com',
    motDePasse: 'password123',
    role: 'Apprenant'
  }),
});

const signupData = await signupResponse.json();
console.log('Token:', signupData.token);

// Login
const loginResponse = await fetch('http://localhost:8081/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'jean@example.com',
    motDePasse: 'password123'
  }),
});

const loginData = await loginResponse.json();
localStorage.setItem('jwt_token', loginData.token);

// Logout
await fetch('http://localhost:8081/api/auth/logout', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${loginData.token}`,
  },
});
```

---

### Using Axios

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8081',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwt_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Signup
const signupResponse = await api.post('/api/auth/signup', {
  nom: 'Dupont',
  prenom: 'Jean',
  email: 'jean@example.com',
  motDePasse: 'password123',
  role: 'Apprenant'
});

// Login
const loginResponse = await api.post('/api/auth/login', {
  email: 'jean@example.com',
  motDePasse: 'password123'
});

localStorage.setItem('jwt_token', loginResponse.data.token);

// Logout
await api.post('/api/auth/logout');
```

---

## Quick Reference

### Environment Variables (.env)

```bash
REACT_APP_API_BASE_URL=http://localhost:8081
REACT_APP_API_TIMEOUT=10000
```

### Key Points Checklist

- ✅ Use `email` field, NOT `username`
- ✅ Use `motDePasse` field, NOT `password`
- ✅ Port is `8081`, NOT `8080`
- ✅ Token format: `Bearer <token>`
- ✅ Store token in `localStorage` or secure cookie
- ✅ Include `Authorization` header for protected routes
- ✅ Handle 401 errors by redirecting to login
- ✅ Clear localStorage on logout
- ✅ Passwords are automatically hashed (BCrypt)
- ✅ All origins allowed (CORS enabled)

### Common Mistakes to Avoid

❌ Using `username` instead of `email`  
❌ Using `password` instead of `motDePasse`  
❌ Wrong port (8080 instead of 8081)  
❌ Missing `Bearer` prefix in Authorization header  
❌ Not clearing localStorage on logout  
❌ Not handling token expiration (401 errors)

---

## Database Schema Reference

```sql
CREATE TABLE utilisateur (
  id BIGSERIAL PRIMARY KEY,
  nom VARCHAR(255) NOT NULL,
  prenom VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  mot_de_passe VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL,
  actif BOOLEAN NOT NULL DEFAULT true,
  
  CONSTRAINT utilisateur_email_key UNIQUE (email),
  CONSTRAINT utilisateur_role_check CHECK (
    (role = ANY (ARRAY['Administrateur', 'Apprenant', 'CreateurDeCours']))
  )
);
```

---

## Support & Contact

### Documentation Files
- `AUTHENTICATION_GUIDE.md` - Detailed authentication system explanation
- `POSTMAN_TESTS.md` - Complete Postman test collection
- `QUICK_TEST_REFERENCE.md` - Quick JSON test examples

### Testing the API
Use Postman, Insomnia, or `curl` to test endpoints before integrating with frontend.

### Example cURL Commands

```bash
# Signup
curl -X POST http://localhost:8081/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Test",
    "prenom": "User",
    "email": "test@example.com",
    "motDePasse": "password123",
    "role": "Apprenant"
  }'

# Login
curl -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "motDePasse": "password123"
  }'

# Logout (replace TOKEN with actual token)
curl -X POST http://localhost:8081/api/auth/logout \
  -H "Authorization: Bearer TOKEN"
```

---

**Last Updated:** December 10, 2025  
**Backend Version:** 1.0.0  
**Spring Boot:** 3.x  
**Java:** 17

---

## Changelog

### Version 1.0.0 (December 10, 2025)
- ✅ Initial release
- ✅ Email-based authentication
- ✅ JWT token system (24-hour expiration)
- ✅ User signup, login, logout
- ✅ Role-based access (Apprenant, CreateurDeCours, Administrateur)
- ✅ BCrypt password hashing
- ✅ CORS enabled for all origins
- ✅ PostgreSQL database integration

