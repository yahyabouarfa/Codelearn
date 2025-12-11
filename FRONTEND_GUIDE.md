# Frontend Development Guide - Learning Platform Admin API

## Table of Contents
1. [Overview](#overview)
2. [Base Configuration](#base-configuration)
3. [API Endpoints](#api-endpoints)
4. [Data Models](#data-models)
5. [Frontend Examples](#frontend-examples)
6. [Error Handling](#error-handling)
7. [Best Practices](#best-practices)

---

## Overview

This guide provides comprehensive documentation for integrating with the Learning Platform Admin Backend API. The API is built with Spring Boot and provides endpoints for managing users and courses in a learning management system.

### Key Features
- User Management (CRUD operations)
- Course Supervision & Moderation
- Three-state course validation system (Pending, Approved, Rejected)
- Database health checks
- CORS enabled for all origins

---

## Base Configuration

### Backend Information
- **Base URL**: `http://localhost:8080` (adjust port based on your application.properties)
- **API Prefix**: `/api/admin`
- **Database**: PostgreSQL (Neon)
- **CORS**: Enabled for all origins with credentials support

### Supported HTTP Methods
- GET
- POST
- PUT
- DELETE
- PATCH
- OPTIONS
- HEAD

### Headers Required
```javascript
{
  "Content-Type": "application/json",
  "Accept": "application/json"
}
```

---

## API Endpoints

### 1. Database Health Check

#### Test Database Connection
```
GET /api/admin/db-test
```

**Description**: Verify database connectivity and retrieve connection information.

**Response (Success - 200 OK)**:
```json
{
  "status": "SUCCESS",
  "connected": true,
  "databaseProductName": "PostgreSQL",
  "databaseProductVersion": "17.6",
  "driverName": "PostgreSQL JDBC Driver",
  "driverVersion": "42.7.0",
  "url": "jdbc:postgresql://ep-spring-cell-ab4f8r2p-pooler.eu-west-2.aws.neon.tech:5432/neondb",
  "username": "neondb_owner"
}
```

**Response (Error - 500 Internal Server Error)**:
```json
{
  "status": "ERROR",
  "connected": false,
  "error": "Connection timeout",
  "errorType": "SQLException"
}
```

---

### 2. User Management Endpoints

#### List All Users
```
GET /api/admin/users
```

**Description**: Retrieve a list of all users in the system.

**Response (200 OK)**:
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

---

#### Deactivate User
```
PUT /api/admin/users/{id}/deactivate
```

**Description**: Soft-delete a user by setting their active status to false.

**URL Parameters**:
- `id` (Long): User ID

**Response (200 OK)**:
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

**Response (404 Not Found)**: Empty response when user doesn't exist

---

### 3. Course Management Endpoints

#### List All Courses
```
GET /api/admin/cours
```

**Description**: Retrieve all courses regardless of validation status.

**Response (200 OK)**:
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

---

#### List Pending Courses
```
GET /api/admin/cours/pending
```

**Description**: Retrieve courses awaiting admin validation (valideParAdmin = null).

**Response (200 OK)**:
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

---

#### List Approved Courses
```
GET /api/admin/cours/approved
```

**Description**: Retrieve courses that have been approved by admin (valideParAdmin = true).

**Response (200 OK)**:
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

#### List Rejected Courses
```
GET /api/admin/cours/rejected
```

**Description**: Retrieve courses that have been rejected by admin (valideParAdmin = false).

**Response (200 OK)**:
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

#### Approve Course
```
POST /api/admin/cours/{id}/approve
```

**Description**: Approve a pending course (sets valideParAdmin to true).

**URL Parameters**:
- `id` (Long): Course ID

**Response (200 OK)**:
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

**Response (404 Not Found)**: Empty response when course doesn't exist

---

#### Reject Course
```
POST /api/admin/cours/{id}/reject
```

**Description**: Reject a pending course (sets valideParAdmin to false).

**URL Parameters**:
- `id` (Long): Course ID

**Response (200 OK)**:
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

**Response (404 Not Found)**: Empty response when course doesn't exist

---

## Data Models

### Utilisateur (User)
```typescript
interface Utilisateur {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  motDePasse?: string;  // Never returned in responses, only used for creation
  role: string;  // e.g., "STUDENT", "TEACHER", "ADMIN"
  actif: boolean;
}
```

### Cours (Course)
```typescript
interface Cours {
  id: number;
  titre: string;
  description: string;
  createur: Utilisateur;
  valideParAdmin: boolean | null;  // null = pending, true = approved, false = rejected
}
```

### Database Test Response
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

## Frontend Examples

### React/TypeScript Example

#### 1. API Service Setup
```typescript
// services/api.ts
const API_BASE_URL = 'http://localhost:8080/api/admin';

export const api = {
  // Database health check
  async testDatabase() {
    const response = await fetch(`${API_BASE_URL}/db-test`);
    return response.json();
  },

  // User management
  async getAllUsers() {
    const response = await fetch(`${API_BASE_URL}/users`);
    return response.json();
  },

  async deactivateUser(userId: number) {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/deactivate`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' }
    });
    if (response.ok) {
      return response.json();
    }
    throw new Error('User not found');
  },

  // Course management
  async getAllCourses() {
    const response = await fetch(`${API_BASE_URL}/cours`);
    return response.json();
  },

  async getPendingCourses() {
    const response = await fetch(`${API_BASE_URL}/cours/pending`);
    return response.json();
  },

  async getApprovedCourses() {
    const response = await fetch(`${API_BASE_URL}/cours/approved`);
    return response.json();
  },

  async getRejectedCourses() {
    const response = await fetch(`${API_BASE_URL}/cours/rejected`);
    return response.json();
  },

  async approveCourse(courseId: number) {
    const response = await fetch(`${API_BASE_URL}/cours/${courseId}/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    if (response.ok) {
      return response.json();
    }
    throw new Error('Course not found');
  },

  async rejectCourse(courseId: number) {
    const response = await fetch(`${API_BASE_URL}/cours/${courseId}/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    if (response.ok) {
      return response.json();
    }
    throw new Error('Course not found');
  }
};
```

#### 2. React Component Examples

**Users List Component**
```typescript
// components/UsersList.tsx
import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

interface User {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role: string;
  actif: boolean;
}

export const UsersList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await api.getAllUsers();
      setUsers(data);
    } catch (err) {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async (userId: number) => {
    try {
      await api.deactivateUser(userId);
      await loadUsers(); // Reload list
    } catch (err) {
      alert('Failed to deactivate user');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Users Management</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Active</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.prenom} {user.nom}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.actif ? '✓' : '✗'}</td>
              <td>
                {user.actif && (
                  <button onClick={() => handleDeactivate(user.id)}>
                    Deactivate
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
```

**Pending Courses Component**
```typescript
// components/PendingCourses.tsx
import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

interface Course {
  id: number;
  titre: string;
  description: string;
  createur: {
    id: number;
    nom: string;
    prenom: string;
    email: string;
  };
  valideParAdmin: boolean | null;
}

export const PendingCourses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPendingCourses();
  }, []);

  const loadPendingCourses = async () => {
    try {
      setLoading(true);
      const data = await api.getPendingCourses();
      setCourses(data);
    } catch (err) {
      console.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (courseId: number) => {
    try {
      await api.approveCourse(courseId);
      await loadPendingCourses(); // Reload list
    } catch (err) {
      alert('Failed to approve course');
    }
  };

  const handleReject = async (courseId: number) => {
    try {
      await api.rejectCourse(courseId);
      await loadPendingCourses(); // Reload list
    } catch (err) {
      alert('Failed to reject course');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Pending Courses ({courses.length})</h2>
      {courses.length === 0 ? (
        <p>No pending courses</p>
      ) : (
        <div className="courses-grid">
          {courses.map(course => (
            <div key={course.id} className="course-card">
              <h3>{course.titre}</h3>
              <p>{course.description}</p>
              <p className="creator">
                By: {course.createur.prenom} {course.createur.nom}
              </p>
              <div className="actions">
                <button 
                  className="approve" 
                  onClick={() => handleApprove(course.id)}
                >
                  ✓ Approve
                </button>
                <button 
                  className="reject" 
                  onClick={() => handleReject(course.id)}
                >
                  ✗ Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
```

---

### Vanilla JavaScript Example

```javascript
// api.js
const API_BASE_URL = 'http://localhost:8080/api/admin';

// Get all pending courses
async function getPendingCourses() {
  try {
    const response = await fetch(`${API_BASE_URL}/cours/pending`);
    const courses = await response.json();
    displayCourses(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
  }
}

// Approve a course
async function approveCourse(courseId) {
  try {
    const response = await fetch(`${API_BASE_URL}/cours/${courseId}/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    if (response.ok) {
      alert('Course approved successfully!');
      getPendingCourses(); // Refresh list
    } else {
      alert('Failed to approve course');
    }
  } catch (error) {
    console.error('Error approving course:', error);
  }
}

// Display courses in HTML
function displayCourses(courses) {
  const container = document.getElementById('courses-container');
  container.innerHTML = '';
  
  courses.forEach(course => {
    const courseDiv = document.createElement('div');
    courseDiv.className = 'course-card';
    courseDiv.innerHTML = `
      <h3>${course.titre}</h3>
      <p>${course.description}</p>
      <p>Creator: ${course.createur.prenom} ${course.createur.nom}</p>
      <button onclick="approveCourse(${course.id})">Approve</button>
      <button onclick="rejectCourse(${course.id})">Reject</button>
    `;
    container.appendChild(courseDiv);
  });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  getPendingCourses();
});
```

---

### Vue.js Example

```vue
<!-- components/CourseModerator.vue -->
<template>
  <div class="course-moderator">
    <h2>Course Moderation</h2>
    
    <div class="tabs">
      <button @click="activeTab = 'pending'" 
              :class="{ active: activeTab === 'pending' }">
        Pending ({{ pendingCount }})
      </button>
      <button @click="activeTab = 'approved'" 
              :class="{ active: activeTab === 'approved' }">
        Approved
      </button>
      <button @click="activeTab = 'rejected'" 
              :class="{ active: activeTab === 'rejected' }">
        Rejected
      </button>
    </div>

    <div v-if="loading" class="loading">Loading...</div>
    
    <div v-else class="courses-grid">
      <div v-for="course in displayedCourses" 
           :key="course.id" 
           class="course-card">
        <h3>{{ course.titre }}</h3>
        <p>{{ course.description }}</p>
        <p class="creator">
          By: {{ course.createur.prenom }} {{ course.createur.nom }}
        </p>
        
        <div v-if="activeTab === 'pending'" class="actions">
          <button @click="approveCourse(course.id)" class="approve">
            Approve
          </button>
          <button @click="rejectCourse(course.id)" class="reject">
            Reject
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';

export default {
  name: 'CourseModerator',
  setup() {
    const API_BASE_URL = 'http://localhost:8080/api/admin';
    const activeTab = ref('pending');
    const loading = ref(false);
    const pendingCourses = ref([]);
    const approvedCourses = ref([]);
    const rejectedCourses = ref([]);

    const pendingCount = computed(() => pendingCourses.value.length);
    
    const displayedCourses = computed(() => {
      switch(activeTab.value) {
        case 'pending': return pendingCourses.value;
        case 'approved': return approvedCourses.value;
        case 'rejected': return rejectedCourses.value;
        default: return [];
      }
    });

    const loadPendingCourses = async () => {
      loading.value = true;
      try {
        const response = await fetch(`${API_BASE_URL}/cours/pending`);
        pendingCourses.value = await response.json();
      } catch (error) {
        console.error('Error loading pending courses:', error);
      } finally {
        loading.value = false;
      }
    };

    const loadApprovedCourses = async () => {
      const response = await fetch(`${API_BASE_URL}/cours/approved`);
      approvedCourses.value = await response.json();
    };

    const loadRejectedCourses = async () => {
      const response = await fetch(`${API_BASE_URL}/cours/rejected`);
      rejectedCourses.value = await response.json();
    };

    const approveCourse = async (courseId) => {
      try {
        const response = await fetch(`${API_BASE_URL}/cours/${courseId}/approve`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
        if (response.ok) {
          await loadPendingCourses();
          await loadApprovedCourses();
        }
      } catch (error) {
        console.error('Error approving course:', error);
      }
    };

    const rejectCourse = async (courseId) => {
      try {
        const response = await fetch(`${API_BASE_URL}/cours/${courseId}/reject`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
        if (response.ok) {
          await loadPendingCourses();
          await loadRejectedCourses();
        }
      } catch (error) {
        console.error('Error rejecting course:', error);
      }
    };

    onMounted(() => {
      loadPendingCourses();
      loadApprovedCourses();
      loadRejectedCourses();
    });

    return {
      activeTab,
      loading,
      pendingCount,
      displayedCourses,
      approveCourse,
      rejectCourse
    };
  }
};
</script>
```

---

### Angular Example

```typescript
// services/admin.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Utilisateur {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role: string;
  actif: boolean;
}

interface Cours {
  id: number;
  titre: string;
  description: string;
  createur: Utilisateur;
  valideParAdmin: boolean | null;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:8080/api/admin';

  constructor(private http: HttpClient) {}

  // Users
  getAllUsers(): Observable<Utilisateur[]> {
    return this.http.get<Utilisateur[]>(`${this.apiUrl}/users`);
  }

  deactivateUser(userId: number): Observable<Utilisateur> {
    return this.http.put<Utilisateur>(
      `${this.apiUrl}/users/${userId}/deactivate`, 
      {}
    );
  }

  // Courses
  getAllCourses(): Observable<Cours[]> {
    return this.http.get<Cours[]>(`${this.apiUrl}/cours`);
  }

  getPendingCourses(): Observable<Cours[]> {
    return this.http.get<Cours[]>(`${this.apiUrl}/cours/pending`);
  }

  getApprovedCourses(): Observable<Cours[]> {
    return this.http.get<Cours[]>(`${this.apiUrl}/cours/approved`);
  }

  getRejectedCourses(): Observable<Cours[]> {
    return this.http.get<Cours[]>(`${this.apiUrl}/cours/rejected`);
  }

  approveCourse(courseId: number): Observable<Cours> {
    return this.http.post<Cours>(
      `${this.apiUrl}/cours/${courseId}/approve`, 
      {}
    );
  }

  rejectCourse(courseId: number): Observable<Cours> {
    return this.http.post<Cours>(
      `${this.apiUrl}/cours/${courseId}/reject`, 
      {}
    );
  }

  testDatabase(): Observable<any> {
    return this.http.get(`${this.apiUrl}/db-test`);
  }
}
```

```typescript
// components/pending-courses.component.ts
import { Component, OnInit } from '@angular/core';
import { AdminService } from '../services/admin.service';

@Component({
  selector: 'app-pending-courses',
  templateUrl: './pending-courses.component.html',
  styleUrls: ['./pending-courses.component.css']
})
export class PendingCoursesComponent implements OnInit {
  courses: any[] = [];
  loading = false;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.loading = true;
    this.adminService.getPendingCourses().subscribe({
      next: (data) => {
        this.courses = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading courses:', error);
        this.loading = false;
      }
    });
  }

  approveCourse(courseId: number): void {
    this.adminService.approveCourse(courseId).subscribe({
      next: () => {
        this.loadCourses(); // Refresh list
      },
      error: (error) => {
        console.error('Error approving course:', error);
      }
    });
  }

  rejectCourse(courseId: number): void {
    this.adminService.rejectCourse(courseId).subscribe({
      next: () => {
        this.loadCourses(); // Refresh list
      },
      error: (error) => {
        console.error('Error rejecting course:', error);
      }
    });
  }
}
```

---

## Error Handling

### Common HTTP Status Codes

| Status Code | Meaning | When It Occurs |
|------------|---------|----------------|
| 200 OK | Success | Request completed successfully |
| 404 Not Found | Resource not found | User/Course ID doesn't exist |
| 500 Internal Server Error | Server error | Database connection issues, unexpected errors |

### Frontend Error Handling Pattern

```typescript
async function safeApiCall<T>(apiFunction: () => Promise<T>): Promise<T | null> {
  try {
    return await apiFunction();
  } catch (error) {
    if (error instanceof TypeError) {
      console.error('Network error:', error);
      alert('Network error. Please check your connection.');
    } else {
      console.error('API error:', error);
      alert('An error occurred. Please try again.');
    }
    return null;
  }
}

// Usage
const users = await safeApiCall(() => api.getAllUsers());
if (users) {
  // Handle success
}
```

---

## Best Practices

### 1. Environment Configuration
```typescript
// config.ts
const config = {
  apiBaseUrl: import.meta.env.VITE_API_URL || 'http://localhost:8080/api/admin',
  timeout: 10000
};

export default config;
```

### 2. Loading States
Always show loading indicators when fetching data:
```typescript
const [loading, setLoading] = useState(false);
const [data, setData] = useState(null);
const [error, setError] = useState(null);
```

### 3. Optimistic Updates
For better UX, update the UI immediately and revert on error:
```typescript
const handleDeactivate = async (userId: number) => {
  // Optimistically update UI
  setUsers(users.map(u => 
    u.id === userId ? { ...u, actif: false } : u
  ));
  
  try {
    await api.deactivateUser(userId);
  } catch (error) {
    // Revert on error
    setUsers(users);
    alert('Failed to deactivate user');
  }
};
```

### 4. Debouncing for Search/Filter
```typescript
import { debounce } from 'lodash';

const searchCourses = debounce(async (query: string) => {
  const courses = await api.getAllCourses();
  const filtered = courses.filter(c => 
    c.titre.toLowerCase().includes(query.toLowerCase())
  );
  setCourses(filtered);
}, 300);
```

### 5. Request Cancellation (React)
```typescript
useEffect(() => {
  const abortController = new AbortController();
  
  fetch(`${API_URL}/cours`, {
    signal: abortController.signal
  })
    .then(res => res.json())
    .then(data => setCourses(data))
    .catch(err => {
      if (err.name !== 'AbortError') {
        console.error(err);
      }
    });
  
  return () => abortController.abort();
}, []);
```

### 6. Caching Strategy
```typescript
// Simple in-memory cache
const cache = new Map();

async function getCachedData(key: string, fetcher: () => Promise<any>) {
  if (cache.has(key)) {
    return cache.get(key);
  }
  
  const data = await fetcher();
  cache.set(key, data);
  
  // Clear cache after 5 minutes
  setTimeout(() => cache.delete(key), 5 * 60 * 1000);
  
  return data;
}

// Usage
const users = await getCachedData('users', () => api.getAllUsers());
```

### 7. Pagination (Frontend)
```typescript
function usePagination<T>(items: T[], itemsPerPage: number = 10) {
  const [currentPage, setCurrentPage] = useState(1);
  
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = items.slice(startIndex, endIndex);
  
  return {
    currentItems,
    currentPage,
    totalPages,
    setCurrentPage,
    nextPage: () => setCurrentPage(p => Math.min(p + 1, totalPages)),
    prevPage: () => setCurrentPage(p => Math.max(p - 1, 1))
  };
}
```

---

## Quick Reference

### Complete API Endpoints Summary

```
Database:
  GET    /api/admin/db-test                    - Test database connection

Users:
  GET    /api/admin/users                      - List all users
  PUT    /api/admin/users/{id}/deactivate      - Deactivate user

Courses:
  GET    /api/admin/cours                      - List all courses
  GET    /api/admin/cours/pending              - List pending courses
  GET    /api/admin/cours/approved             - List approved courses
  GET    /api/admin/cours/rejected             - List rejected courses
  POST   /api/admin/cours/{id}/approve         - Approve course
  POST   /api/admin/cours/{id}/reject          - Reject course
```

### Course Validation States

| State | valideParAdmin | Meaning |
|-------|---------------|---------|
| Pending | `null` | Awaiting admin review |
| Approved | `true` | Approved by admin |
| Rejected | `false` | Rejected by admin |

---

## Additional Resources

### Testing with cURL

```bash
# Test database connection
curl http://localhost:8080/api/admin/db-test

# Get all users
curl http://localhost:8080/api/admin/users

# Deactivate user
curl -X PUT http://localhost:8080/api/admin/users/1/deactivate

# Get pending courses
curl http://localhost:8080/api/admin/cours/pending

# Approve course
curl -X POST http://localhost:8080/api/admin/cours/1/approve

# Reject course
curl -X POST http://localhost:8080/api/admin/cours/1/reject
```

### Postman Collection

See `POSTMAN_TESTS.md` for a complete Postman collection with all endpoints.

---

## Support & Contributing

For issues, questions, or contributions, please contact the backend development team.

**Last Updated**: December 10, 2025
**API Version**: 0.0.1-SNAPSHOT

