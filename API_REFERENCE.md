# API Reference - Learning Platform Admin Backend

## Quick Start

### Base URL
```
http://localhost:8080/api/admin
```

### Prerequisites
- Backend server running (Spring Boot application)
- PostgreSQL database connected
- CORS enabled (all origins allowed)

---

## Authentication
Currently, the API does not require authentication. For production, implement Spring Security with JWT tokens.

---

## Endpoints Reference

### 📊 Database Health Check

#### GET /db-test
Test database connectivity and retrieve connection information.

**Request:**
```http
GET /api/admin/db-test HTTP/1.1
Host: localhost:8080
```

**Success Response (200 OK):**
```json
{
  "status": "SUCCESS",
  "connected": true,
  "databaseProductName": "PostgreSQL",
  "databaseProductVersion": "17.6",
  "driverName": "PostgreSQL JDBC Driver",
  "driverVersion": "42.7.0",
  "url": "jdbc:postgresql://...",
  "username": "neondb_owner"
}
```

**Error Response (500 Internal Server Error):**
```json
{
  "status": "ERROR",
  "connected": false,
  "error": "Connection timeout",
  "errorType": "SQLException"
}
```

---

### 👥 User Management

#### GET /users
List all users in the system.

**Request:**
```http
GET /api/admin/users HTTP/1.1
Host: localhost:8080
Accept: application/json
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "nom": "Dupont",
    "prenom": "Jean",
    "email": "jean.dupont@example.com",
    "role": "STUDENT",
    "actif": true
  },
  {
    "id": 2,
    "nom": "Martin",
    "prenom": "Marie",
    "email": "marie.martin@example.com",
    "role": "TEACHER",
    "actif": true
  }
]
```

**JavaScript Example:**
```javascript
const response = await fetch('http://localhost:8080/api/admin/users');
const users = await response.json();
console.log(users);
```

**Axios Example:**
```javascript
const { data: users } = await axios.get('http://localhost:8080/api/admin/users');
```

---

#### PUT /users/{id}/deactivate
Deactivate a user (soft delete).

**Request:**
```http
PUT /api/admin/users/1/deactivate HTTP/1.1
Host: localhost:8080
Content-Type: application/json
```

**Success Response (200 OK):**
```json
{
  "id": 1,
  "nom": "Dupont",
  "prenom": "Jean",
  "email": "jean.dupont@example.com",
  "role": "STUDENT",
  "actif": false
}
```

**Not Found Response (404):**
Empty response body.

**JavaScript Example:**
```javascript
const response = await fetch('http://localhost:8080/api/admin/users/1/deactivate', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json'
  }
});

if (response.ok) {
  const user = await response.json();
  console.log('User deactivated:', user);
} else {
  console.error('User not found');
}
```

**Axios Example:**
```javascript
try {
  const { data: user } = await axios.put(
    'http://localhost:8080/api/admin/users/1/deactivate'
  );
  console.log('User deactivated:', user);
} catch (error) {
  if (error.response?.status === 404) {
    console.error('User not found');
  }
}
```

---

### 📚 Course Management

#### GET /cours
List all courses regardless of validation status.

**Request:**
```http
GET /api/admin/cours HTTP/1.1
Host: localhost:8080
Accept: application/json
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "titre": "Introduction to Java",
    "description": "Learn Java programming from scratch",
    "createur": {
      "id": 2,
      "nom": "Martin",
      "prenom": "Marie",
      "email": "marie.martin@example.com",
      "role": "TEACHER",
      "actif": true
    },
    "valideParAdmin": true
  },
  {
    "id": 2,
    "titre": "Advanced Python",
    "description": "Deep dive into Python",
    "createur": {
      "id": 2,
      "nom": "Martin",
      "prenom": "Marie",
      "email": "marie.martin@example.com",
      "role": "TEACHER",
      "actif": true
    },
    "valideParAdmin": null
  }
]
```

**JavaScript Example:**
```javascript
const response = await fetch('http://localhost:8080/api/admin/cours');
const courses = await response.json();

// Filter by status
const pending = courses.filter(c => c.valideParAdmin === null);
const approved = courses.filter(c => c.valideParAdmin === true);
const rejected = courses.filter(c => c.valideParAdmin === false);
```

---

#### GET /cours/pending
List courses awaiting admin validation (valideParAdmin = null).

**Request:**
```http
GET /api/admin/cours/pending HTTP/1.1
Host: localhost:8080
Accept: application/json
```

**Response (200 OK):**
```json
[
  {
    "id": 2,
    "titre": "Advanced Python",
    "description": "Deep dive into Python",
    "createur": {
      "id": 2,
      "nom": "Martin",
      "prenom": "Marie",
      "email": "marie.martin@example.com",
      "role": "TEACHER",
      "actif": true
    },
    "valideParAdmin": null
  }
]
```

**JavaScript Example:**
```javascript
const response = await fetch('http://localhost:8080/api/admin/cours/pending');
const pendingCourses = await response.json();
console.log(`${pendingCourses.length} courses awaiting review`);
```

---

#### GET /cours/approved
List courses that have been approved by admin (valideParAdmin = true).

**Request:**
```http
GET /api/admin/cours/approved HTTP/1.1
Host: localhost:8080
Accept: application/json
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "titre": "Introduction to Java",
    "description": "Learn Java programming from scratch",
    "createur": {
      "id": 2,
      "nom": "Martin",
      "prenom": "Marie",
      "email": "marie.martin@example.com",
      "role": "TEACHER",
      "actif": true
    },
    "valideParAdmin": true
  }
]
```

---

#### GET /cours/rejected
List courses that have been rejected by admin (valideParAdmin = false).

**Request:**
```http
GET /api/admin/cours/rejected HTTP/1.1
Host: localhost:8080
Accept: application/json
```

**Response (200 OK):**
```json
[
  {
    "id": 3,
    "titre": "Spam Course",
    "description": "Inappropriate content",
    "createur": {
      "id": 5,
      "nom": "Spammer",
      "prenom": "Bob",
      "email": "spam@example.com",
      "role": "TEACHER",
      "actif": false
    },
    "valideParAdmin": false
  }
]
```

---

#### POST /cours/{id}/approve
Approve a pending course (sets valideParAdmin to true).

**Request:**
```http
POST /api/admin/cours/2/approve HTTP/1.1
Host: localhost:8080
Content-Type: application/json
```

**Success Response (200 OK):**
```json
{
  "id": 2,
  "titre": "Advanced Python",
  "description": "Deep dive into Python",
  "createur": {
    "id": 2,
    "nom": "Martin",
    "prenom": "Marie",
    "email": "marie.martin@example.com",
    "role": "TEACHER",
    "actif": true
  },
  "valideParAdmin": true
}
```

**Not Found Response (404):**
Empty response body.

**JavaScript Example:**
```javascript
const response = await fetch('http://localhost:8080/api/admin/cours/2/approve', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
});

if (response.ok) {
  const course = await response.json();
  console.log('Course approved:', course);
} else {
  console.error('Course not found');
}
```

**Axios Example:**
```javascript
try {
  const { data: course } = await axios.post(
    'http://localhost:8080/api/admin/cours/2/approve'
  );
  console.log('Course approved:', course);
} catch (error) {
  if (error.response?.status === 404) {
    console.error('Course not found');
  }
}
```

---

#### POST /cours/{id}/reject
Reject a pending course (sets valideParAdmin to false).

**Request:**
```http
POST /api/admin/cours/2/reject HTTP/1.1
Host: localhost:8080
Content-Type: application/json
```

**Success Response (200 OK):**
```json
{
  "id": 2,
  "titre": "Advanced Python",
  "description": "Deep dive into Python",
  "createur": {
    "id": 2,
    "nom": "Martin",
    "prenom": "Marie",
    "email": "marie.martin@example.com",
    "role": "TEACHER",
    "actif": true
  },
  "valideParAdmin": false
}
```

**Not Found Response (404):**
Empty response body.

**JavaScript Example:**
```javascript
const response = await fetch('http://localhost:8080/api/admin/cours/2/reject', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
});

if (response.ok) {
  const course = await response.json();
  console.log('Course rejected:', course);
} else {
  console.error('Course not found');
}
```

---

## Data Models

### Utilisateur (User)
```typescript
interface Utilisateur {
  id: number;                    // Unique identifier
  nom: string;                   // Last name
  prenom: string;                // First name
  email: string;                 // Email address (unique)
  motDePasse?: string;           // Password (never returned in API responses)
  role: string;                  // User role (e.g., "STUDENT", "TEACHER", "ADMIN")
  actif: boolean;                // Active status (true = active, false = deactivated)
}
```

### Cours (Course)
```typescript
interface Cours {
  id: number;                    // Unique identifier
  titre: string;                 // Course title
  description: string;           // Course description
  createur: Utilisateur;         // Course creator (nested user object)
  valideParAdmin: boolean | null; // Validation status:
                                 //   null  = pending
                                 //   true  = approved
                                 //   false = rejected
}
```

### DatabaseTestResponse
```typescript
interface DatabaseTestResponse {
  status: "SUCCESS" | "ERROR";
  connected: boolean;
  databaseProductName?: string;
  databaseProductVersion?: string;
  driverName?: string;
  driverVersion?: string;
  url?: string;
  username?: string;
  error?: string;
  errorType?: string;
}
```

---

## HTTP Status Codes

| Code | Status | Description |
|------|--------|-------------|
| 200 | OK | Request successful, data returned |
| 404 | Not Found | Resource (user/course) not found |
| 500 | Internal Server Error | Database connection error or server error |

---

## CORS Configuration

The backend allows requests from any origin with the following settings:

- **Allowed Origins**: `*` (all origins)
- **Allowed Methods**: GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD
- **Allowed Headers**: All headers
- **Credentials**: Allowed
- **Max Age**: 3600 seconds (1 hour)

---

## Error Handling Best Practices

### Example Error Handler
```javascript
async function safeApiCall(url, options = {}) {
  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Resource not found');
      } else if (response.status === 500) {
        throw new Error('Server error');
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Usage
try {
  const users = await safeApiCall('http://localhost:8080/api/admin/users');
  console.log(users);
} catch (error) {
  alert(`Failed to load users: ${error.message}`);
}
```

---

## Complete Examples

### React Hook Example
```typescript
import { useState, useEffect } from 'react';

interface Course {
  id: number;
  titre: string;
  description: string;
  createur: any;
  valideParAdmin: boolean | null;
}

const usePendingCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8080/api/admin/cours/pending');
      const data = await response.json();
      setCourses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const approveCourse = async (courseId: number) => {
    const response = await fetch(`http://localhost:8080/api/admin/cours/${courseId}/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    if (response.ok) {
      await loadCourses();
      return true;
    }
    return false;
  };

  const rejectCourse = async (courseId: number) => {
    const response = await fetch(`http://localhost:8080/api/admin/cours/${courseId}/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    if (response.ok) {
      await loadCourses();
      return true;
    }
    return false;
  };

  useEffect(() => {
    loadCourses();
  }, []);

  return { courses, loading, error, approveCourse, rejectCourse, reload: loadCourses };
};

export default usePendingCourses;
```

### Fetch API Wrapper
```javascript
class AdminAPI {
  constructor(baseURL = 'http://localhost:8080/api/admin') {
    this.baseURL = baseURL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return response.status === 204 ? null : response.json();
  }

  // Database
  testDatabase() {
    return this.request('/db-test');
  }

  // Users
  getUsers() {
    return this.request('/users');
  }

  deactivateUser(userId) {
    return this.request(`/users/${userId}/deactivate`, { method: 'PUT' });
  }

  // Courses
  getAllCourses() {
    return this.request('/cours');
  }

  getPendingCourses() {
    return this.request('/cours/pending');
  }

  getApprovedCourses() {
    return this.request('/cours/approved');
  }

  getRejectedCourses() {
    return this.request('/cours/rejected');
  }

  approveCourse(courseId) {
    return this.request(`/cours/${courseId}/approve`, { method: 'POST' });
  }

  rejectCourse(courseId) {
    return this.request(`/cours/${courseId}/reject`, { method: 'POST' });
  }
}

// Usage
const api = new AdminAPI();

async function init() {
  const users = await api.getUsers();
  const pendingCourses = await api.getPendingCourses();
  
  console.log('Users:', users);
  console.log('Pending courses:', pendingCourses);
}
```

---

## Testing with cURL

### Test Database
```bash
curl http://localhost:8080/api/admin/db-test
```

### Get All Users
```bash
curl http://localhost:8080/api/admin/users
```

### Deactivate User
```bash
curl -X PUT http://localhost:8080/api/admin/users/1/deactivate
```

### Get Pending Courses
```bash
curl http://localhost:8080/api/admin/cours/pending
```

### Approve Course
```bash
curl -X POST http://localhost:8080/api/admin/cours/1/approve
```

### Reject Course
```bash
curl -X POST http://localhost:8080/api/admin/cours/1/reject
```

---

## Environment Configuration

### Development
```javascript
const API_BASE_URL = 'http://localhost:8080/api/admin';
```

### Production
```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://api.yourapp.com/api/admin';
```

### Using .env file (React/Vite)
```env
VITE_API_URL=http://localhost:8080/api/admin
```

```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL;
```

---

## Notes

1. **No Authentication**: Currently, the API doesn't require authentication. For production, implement JWT or OAuth2.

2. **Course Validation States**:
   - `null`: Pending review
   - `true`: Approved
   - `false`: Rejected

3. **Soft Delete**: User deactivation is a soft delete (actif = false), not a hard delete.

4. **CORS**: All origins are allowed. Restrict this in production.

5. **Error Handling**: Always check response status and handle 404/500 errors appropriately.

---

**Last Updated**: December 10, 2025  
**Backend Version**: 0.0.1-SNAPSHOT

