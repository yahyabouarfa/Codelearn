# Frontend Integration Guide - CodeLearn API

## 📋 Table of Contents
- [Overview](#overview)
- [Base Configuration](#base-configuration)
- [Authentication Flow](#authentication-flow)
- [API Endpoints](#api-endpoints)
- [Data Models](#data-models)
- [Request Examples](#request-examples)
- [Error Handling](#error-handling)
- [Integration Examples](#integration-examples)

---

## 🌐 Overview

**Base URL:** `http://localhost:8081` (or `http://<YOUR_IP>:8081` for network access)

**API Prefix:** `/api/auth`

**Authentication Type:** JWT Bearer Token

**CORS:** Enabled for all origins (any frontend can access)

---

## ⚙️ Base Configuration

### Backend Server Details
- **Port:** `8081`
- **Host:** `0.0.0.0` (accessible from network)
- **Database:** PostgreSQL (Neon Cloud)
- **Session Management:** Stateless (JWT-based)

### CORS Configuration
- ✅ **All origins allowed** (`*`)
- ✅ **All methods allowed** (GET, POST, PUT, DELETE, PATCH, OPTIONS)
- ✅ **All headers allowed**
- ✅ **Credentials supported**

---

## 🔐 Authentication Flow

### How JWT Authentication Works

1. **User Signs Up** → Backend creates user & returns JWT token
2. **User Logs In** → Backend validates credentials & returns JWT token
3. **Store Token** → Frontend stores token (localStorage/sessionStorage)
4. **Authenticated Requests** → Include token in `Authorization` header
5. **User Logs Out** → Frontend removes token (client-side)

### Token Storage (Recommended)
```javascript
// Store token
localStorage.setItem('token', response.token);
localStorage.setItem('user', JSON.stringify(response));

// Get token
const token = localStorage.getItem('token');

// Remove token (logout)
localStorage.removeItem('token');
localStorage.removeItem('user');
```

---

## 🛠️ API Endpoints

### 1. **Sign Up (Register)**

Create a new user account.

- **URL:** `POST /api/auth/signup`
- **Authentication Required:** ❌ No
- **Content-Type:** `application/json`

**Request Body:**
```json
{
  "nom": "Doe",
  "prenom": "John",
  "email": "john.doe@example.com",
  "motDePasse": "SecurePassword123!",
  "role": "Apprenant"
}
```

**Role Options:**
- `"Apprenant"` - Student/Learner
- `"CreateurDeCours"` - Course Creator
- `"Administrateur"` - Administrator

**Success Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "email": "john.doe@example.com",
  "nom": "Doe",
  "prenom": "John",
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
  "message": "Email déjà utilisé"
}
```

**Validation Errors:**
- Missing `nom`: "Le nom est obligatoire"
- Missing `prenom`: "Le prénom est obligatoire"
- Missing `email`: "L'email est obligatoire"
- Invalid `email`: "Format d'email invalide"
- Missing `motDePasse`: "Le mot de passe est obligatoire"

---

### 2. **Login**

Authenticate existing user.

- **URL:** `POST /api/auth/login`
- **Authentication Required:** ❌ No
- **Content-Type:** `application/json`

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "motDePasse": "SecurePassword123!"
}
```

**Success Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "email": "john.doe@example.com",
  "nom": "Doe",
  "prenom": "John",
  "role": "Apprenant",
  "message": "Connexion réussie"
}
```

**Error Response (401 Unauthorized):**
```json
{
  "message": "Email ou mot de passe incorrect"
}
```

**Validation Errors:**
- Missing `email`: "L'email est obligatoire"
- Invalid `email`: "Format d'email invalide"
- Missing `motDePasse`: "Le mot de passe est obligatoire"

---

### 3. **Logout**

Logout user (client-side token removal).

- **URL:** `POST /api/auth/logout`
- **Authentication Required:** ⚠️ Optional (can be called anytime)
- **Content-Type:** `application/json`

**Request Body:** None

**Success Response (200 OK):**
```json
{
  "message": "Déconnexion réussie"
}
```

**Note:** With JWT, logout is primarily handled client-side by removing the token from storage. This endpoint is provided for consistency but doesn't invalidate the token server-side.

---

## 📊 Data Models

### User (Utilisateur)

```typescript
interface Utilisateur {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  motDePasse: string; // Hashed with BCrypt (never returned in responses)
  role: "Administrateur" | "Apprenant" | "CreateurDeCours";
  actif: boolean;
}
```

### Signup Request

```typescript
interface SignupRequest {
  nom: string;         // Required
  prenom: string;      // Required
  email: string;       // Required, must be valid email
  motDePasse: string;  // Required, will be hashed
  role: "Administrateur" | "Apprenant" | "CreateurDeCours"; // Optional
}
```

### Login Request

```typescript
interface LoginRequest {
  email: string;       // Required, must be valid email
  motDePasse: string;  // Required
}
```

### Auth Response

```typescript
interface AuthResponse {
  token: string | null;     // JWT token
  email: string | null;
  nom: string | null;
  prenom: string | null;
  role: string | null;
  message: string;          // Success/error message
}
```

---

## 🔧 Request Examples

### JavaScript/TypeScript (Fetch API)

#### Sign Up (Apprenant)
```javascript
async function signup(nom, prenom, email, motDePasse) {
  try {
    const response = await fetch('http://localhost:8081/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nom,
        prenom,
        email,
        motDePasse,
        role: 'Apprenant'
      })
    });

    const data = await response.json();
    
    if (response.ok && data.token) {
      // Store token
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      return { success: true, data };
    } else {
      return { success: false, message: data.message };
    }
  } catch (error) {
    return { success: false, message: 'Network error' };
  }
}

// Usage
const result = await signup('Doe', 'John', 'john@example.com', 'Password123!');
```

#### Sign Up (Course Creator)
```javascript
async function signupCreator(nom, prenom, email, motDePasse) {
  try {
    const response = await fetch('http://localhost:8081/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nom,
        prenom,
        email,
        motDePasse,
        role: 'CreateurDeCours'
      })
    });

    const data = await response.json();
    
    if (response.ok && data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      return { success: true, data };
    } else {
      return { success: false, message: data.message };
    }
  } catch (error) {
    return { success: false, message: 'Network error' };
  }
}
```

#### Login
```javascript
async function login(email, motDePasse) {
  try {
    const response = await fetch('http://localhost:8081/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        motDePasse
      })
    });

    const data = await response.json();
    
    if (response.ok && data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      return { success: true, data };
    } else {
      return { success: false, message: data.message };
    }
  } catch (error) {
    return { success: false, message: 'Network error' };
  }
}

// Usage
const result = await login('john@example.com', 'Password123!');
```

#### Logout
```javascript
async function logout() {
  try {
    const response = await fetch('http://localhost:8081/api/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    // Remove token regardless of response
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    return { success: true };
  } catch (error) {
    // Still remove token on error
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return { success: true };
  }
}
```

#### Making Authenticated Requests (Future Endpoints)
```javascript
async function getProtectedData() {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('No token found');
  }

  const response = await fetch('http://localhost:8081/api/some-protected-endpoint', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });

  if (response.status === 401) {
    // Token expired or invalid
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    throw new Error('Unauthorized - please login again');
  }

  return await response.json();
}
```

---

### React Example (with Axios)

#### Install Axios
```bash
npm install axios
```

#### Create API Service (`src/services/api.js`)
```javascript
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  signup: async (data) => {
    const response = await api.post('/auth/signup', data);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },

  logout: async () => {
    await api.post('/auth/logout');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
};

export default api;
```

#### React Login Component Example
```jsx
import React, { useState } from 'react';
import { authService } from '../services/api';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.login({ email, motDePasse });
      
      if (response.token) {
        // Redirect to dashboard
        window.location.href = '/dashboard';
      } else {
        setError(response.message || 'Login failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={motDePasse}
          onChange={(e) => setMotDePasse(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Login'}
        </button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
}

export default LoginPage;
```

#### React Signup Component (Apprenant)
```jsx
import React, { useState } from 'react';
import { authService } from '../services/api';

function SignupApprenantPage() {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    motDePasse: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.signup({
        ...formData,
        role: 'Apprenant'
      });
      
      if (response.token) {
        window.location.href = '/dashboard';
      } else {
        setError(response.message || 'Signup failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Sign Up as Student</h2>
      <form onSubmit={handleSignup}>
        <input
          type="text"
          name="nom"
          placeholder="Last Name"
          value={formData.nom}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="prenom"
          placeholder="First Name"
          value={formData.prenom}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="motDePasse"
          placeholder="Password"
          value={formData.motDePasse}
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Sign Up'}
        </button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
}

export default SignupApprenantPage;
```

#### Protected Route Component
```jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '../services/api';

function ProtectedRoute({ children, allowedRoles }) {
  const isAuthenticated = authService.isAuthenticated();
  const user = authService.getCurrentUser();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
}

export default ProtectedRoute;

// Usage in App.js
<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  } 
/>

<Route 
  path="/admin" 
  element={
    <ProtectedRoute allowedRoles={['Administrateur']}>
      <AdminPanel />
    </ProtectedRoute>
  } 
/>
```

---

## ⚠️ Error Handling

### HTTP Status Codes

| Status Code | Meaning | When It Happens |
|-------------|---------|-----------------|
| 200 | OK | Request successful |
| 400 | Bad Request | Validation error, email already exists |
| 401 | Unauthorized | Invalid credentials, expired token |
| 403 | Forbidden | Access denied |
| 500 | Internal Server Error | Server error |

### Common Errors

#### Signup Errors
```json
{
  "message": "Email déjà utilisé"
}
```

#### Login Errors
```json
{
  "message": "Email ou mot de passe incorrect"
}
```

#### Validation Errors (400)
```json
{
  "timestamp": "2025-12-10T10:30:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "errors": {
    "email": "Format d'email invalide",
    "motDePasse": "Le mot de passe est obligatoire"
  }
}
```

---

## 🔑 Security Notes

### Password Security
✅ **Passwords are hashed** using BCrypt before storage
✅ **Never stored in plain text**
✅ **Cannot be retrieved** - only compared during login

### JWT Token
- **Expiration:** 24 hours (86400000 ms)
- **Algorithm:** HS256
- **Contains:** User email, role, expiration
- **Send in header:** `Authorization: Bearer <token>`

### Best Practices
1. ✅ Always use HTTPS in production
2. ✅ Store tokens in localStorage or httpOnly cookies
3. ✅ Don't expose tokens in URLs
4. ✅ Implement token refresh mechanism (future)
5. ✅ Clear tokens on logout
6. ✅ Validate token expiration on frontend
7. ✅ Handle 401 errors globally (redirect to login)

---

## 📱 Testing with Postman

### Collection Variables
```
base_url: http://localhost:8081
token: (will be set automatically after login)
```

### 1. Test Signup (Apprenant)
**POST** `{{base_url}}/api/auth/signup`

**Body (JSON):**
```json
{
  "nom": "Dupont",
  "prenom": "Marie",
  "email": "marie.dupont@example.com",
  "motDePasse": "SecurePass123!",
  "role": "Apprenant"
}
```

### 2. Test Signup (Course Creator)
**POST** `{{base_url}}/api/auth/signup`

**Body (JSON):**
```json
{
  "nom": "Martin",
  "prenom": "Pierre",
  "email": "pierre.martin@example.com",
  "motDePasse": "CreatorPass123!",
  "role": "CreateurDeCours"
}
```

### 3. Test Login
**POST** `{{base_url}}/api/auth/login`

**Body (JSON):**
```json
{
  "email": "marie.dupont@example.com",
  "motDePasse": "SecurePass123!"
}
```

**Tests Script (auto-save token):**
```javascript
if (pm.response.code === 200) {
    var jsonData = pm.response.json();
    if (jsonData.token) {
        pm.collectionVariables.set("token", jsonData.token);
    }
}
```

### 4. Test Logout
**POST** `{{base_url}}/api/auth/logout`

---

## 🚀 Quick Start Checklist

### Backend Setup
- [x] Server running on port 8081
- [x] Database connected (PostgreSQL)
- [x] JWT configured
- [x] CORS enabled for all origins
- [x] Password hashing enabled (BCrypt)

### Frontend Setup
- [ ] Install HTTP client (axios/fetch)
- [ ] Configure API base URL (`http://localhost:8081/api`)
- [ ] Create auth service/context
- [ ] Implement signup form (with role selection)
- [ ] Implement login form
- [ ] Implement logout function
- [ ] Set up token storage (localStorage)
- [ ] Add Authorization header to protected requests
- [ ] Handle 401 errors (redirect to login)
- [ ] Create protected routes

---

## 📞 Support & Contact

### Endpoints Summary

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | `/api/auth/signup` | ❌ No | Register new user |
| POST | `/api/auth/login` | ❌ No | Login user |
| POST | `/api/auth/logout` | ❌ No | Logout user |

### Server Info
- **Port:** 8081
- **Network Access:** ✅ Available (0.0.0.0)
- **Local Access:** http://localhost:8081
- **Network Access:** http://YOUR_IP:8081

---

## 🎯 Next Steps

After implementing authentication, you may want to add:
- Password reset functionality
- Email verification
- Token refresh mechanism
- User profile management
- Role-based access control for other endpoints
- Course management endpoints (for CreateurDeCours)
- Learning progress endpoints (for Apprenant)

---

**Generated for:** CodeLearn Backend API  
**Version:** 1.0  
**Last Updated:** December 10, 2025

