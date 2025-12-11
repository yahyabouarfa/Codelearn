# Postman Tests for Admin API

Base URL: `http://localhost:8083/api/admin`

---

## 1. Database Connection Test

### Test Database Connection
- **Method:** GET
- **URL:** `http://localhost:8083/api/admin/db-test`
- **Description:** Tests if the database connection is working
- **Expected Response:** 200 OK
```json
{
  "status": "SUCCESS",
  "connected": true,
  "databaseProductName": "PostgreSQL",
  "databaseProductVersion": "...",
  "driverName": "...",
  "driverVersion": "...",
  "url": "...",
  "username": "..."
}
```

---

## 2. User Management Tests

### 2.1 List All Users
- **Method:** GET
- **URL:** `http://localhost:8083/api/admin/users`
- **Description:** Retrieves all users
- **Expected Response:** 200 OK
```json
[
  {
    "id": 1,
    "nom": "Doe",
    "prenom": "John",
    "email": "john@example.com",
    "motDePasse": "...",
    "role": "Administrateur",
    "actif": true
  }
]
```

### 2.2 Deactivate User
- **Method:** PUT
- **URL:** `http://localhost:8083/api/admin/users/{id}/deactivate`
- **Example:** `http://localhost:8083/api/admin/users/1/deactivate`
- **Description:** Deactivates a user (soft delete - sets actif to false)
- **Expected Response:** 200 OK
```json
{
  "id": 1,
  "nom": "Doe",
  "prenom": "John",
  "email": "john@example.com",
  "motDePasse": "...",
  "role": "Administrateur",
  "actif": false
}
```
- **Error Response (User Not Found):** 404 Not Found

---

## 3. Course Management Tests

### 3.1 List All Courses
- **Method:** GET
- **URL:** `http://localhost:8083/api/admin/cours`
- **Description:** Retrieves all courses
- **Expected Response:** 200 OK
```json
[
  {
    "id": 1,
    "titre": "Java Basics",
    "description": "Learn Java fundamentals",
    "createurId": 1,
    "valideParAdmin": null
  }
]
```

### 3.2 List Pending Courses
- **Method:** GET
- **URL:** `http://localhost:8083/api/admin/cours/pending`
- **Description:** Lists courses awaiting approval (valideParAdmin = null)
- **Expected Response:** 200 OK
```json
[
  {
    "id": 2,
    "titre": "Python Basics",
    "description": "Learn Python",
    "createurId": 2,
    "valideParAdmin": null
  }
]
```

### 3.3 List Rejected Courses
- **Method:** GET
- **URL:** `http://localhost:8083/api/admin/cours/rejected`
- **Description:** Lists rejected courses (valideParAdmin = false)
- **Expected Response:** 200 OK
```json
[
  {
    "id": 3,
    "titre": "Bad Course",
    "description": "This was rejected",
    "createurId": 3,
    "valideParAdmin": false
  }
]
```

### 3.4 List Approved Courses
- **Method:** GET
- **URL:** `http://localhost:8083/api/admin/cours/approved`
- **Description:** Lists approved courses (valideParAdmin = true)
- **Expected Response:** 200 OK
```json
[
  {
    "id": 1,
    "titre": "Java Basics",
    "description": "Learn Java fundamentals",
    "createurId": 1,
    "valideParAdmin": true
  }
]
```

---

## 4. Course Moderation Tests

### 4.1 Approve Course
- **Method:** POST
- **URL:** `http://localhost:8083/api/admin/cours/{id}/approve`
- **Example:** `http://localhost:8083/api/admin/cours/2/approve`
- **Description:** Approves a course (sets valideParAdmin to true)
- **Expected Response:** 200 OK
```json
{
  "id": 2,
  "titre": "Python Basics",
  "description": "Learn Python",
  "createurId": 2,
  "valideParAdmin": true
}
```
- **Error Response (Course Not Found):** 404 Not Found

### 4.2 Reject Course
- **Method:** POST
- **URL:** `http://localhost:8083/api/admin/cours/{id}/reject`
- **Example:** `http://localhost:8083/api/admin/cours/3/reject`
- **Description:** Rejects a course (sets valideParAdmin to false)
- **Expected Response:** 200 OK
```json
{
  "id": 3,
  "titre": "Bad Course",
  "description": "This was rejected",
  "createurId": 3,
  "valideParAdmin": false
}
```
- **Error Response (Course Not Found):** 404 Not Found

---

## Test Sequence (Recommended Order)

### Step 1: Verify System Health
1. **Test Database Connection** - Ensure DB is connected

### Step 2: User Management
2. **List All Users** - See existing users
3. **Deactivate User** - Test soft delete functionality
4. **List All Users Again** - Verify user has actif=false

### Step 3: Course Overview
5. **List All Courses** - See all courses
6. **List Pending Courses** - See courses awaiting approval
7. **List Rejected Courses** - See rejected courses
8. **List Approved Courses** - See approved courses

### Step 4: Course Moderation
9. **Approve Course** - Approve a pending course
10. **List Approved Courses** - Verify it appears in approved list
11. **Reject Course** - Reject a course
12. **List Rejected Courses** - Verify it appears in rejected list

---

## Postman Collection JSON

You can import this into Postman:

```json
{
  "info": {
    "name": "Admin API Tests",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "1. DB Connection Test",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "http://localhost:8083/api/admin/db-test",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8083",
          "path": ["api", "admin", "db-test"]
        }
      }
    },
    {
      "name": "2. List All Users",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "http://localhost:8083/api/admin/users",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8083",
          "path": ["api", "admin", "users"]
        }
      }
    },
    {
      "name": "3. Deactivate User",
      "request": {
        "method": "PUT",
        "header": [],
        "url": {
          "raw": "http://localhost:8083/api/admin/users/1/deactivate",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8083",
          "path": ["api", "admin", "users", "1", "deactivate"]
        }
      }
    },
    {
      "name": "4. List All Courses",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "http://localhost:8083/api/admin/cours",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8083",
          "path": ["api", "admin", "cours"]
        }
      }
    },
    {
      "name": "5. List Pending Courses",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "http://localhost:8083/api/admin/cours/pending",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8083",
          "path": ["api", "admin", "cours", "pending"]
        }
      }
    },
    {
      "name": "6. List Rejected Courses",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "http://localhost:8083/api/admin/cours/rejected",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8083",
          "path": ["api", "admin", "cours", "rejected"]
        }
      }
    },
    {
      "name": "7. List Approved Courses",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "http://localhost:8083/api/admin/cours/approved",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8083",
          "path": ["api", "admin", "cours", "approved"]
        }
      }
    },
    {
      "name": "8. Approve Course",
      "request": {
        "method": "POST",
        "header": [],
        "url": {
          "raw": "http://localhost:8083/api/admin/cours/1/approve",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8083",
          "path": ["api", "admin", "cours", "1", "approve"]
        }
      }
    },
    {
      "name": "9. Reject Course",
      "request": {
        "method": "POST",
        "header": [],
        "url": {
          "raw": "http://localhost:8083/api/admin/cours/1/reject",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8083",
          "path": ["api", "admin", "cours", "1", "reject"]
        }
      }
    }
  ]
}
```

---

## Quick cURL Commands

### Test DB Connection
```bash
curl -X GET http://localhost:8083/api/admin/db-test
```

### List All Users
```bash
curl -X GET http://localhost:8083/api/admin/users
```

### Deactivate User (ID: 1)
```bash
curl -X PUT http://localhost:8083/api/admin/users/1/deactivate
```

### List All Courses
```bash
curl -X GET http://localhost:8083/api/admin/cours
```

### List Pending Courses
```bash
curl -X GET http://localhost:8083/api/admin/cours/pending
```

### Approve Course (ID: 1)
```bash
curl -X POST http://localhost:8083/api/admin/cours/1/approve
```

### Reject Course (ID: 1)
```bash
curl -X POST http://localhost:8083/api/admin/cours/1/reject
```

---

## Notes

1. **Port:** Make sure your application is running on port 8083
2. **Database:** Ensure PostgreSQL is running and connected
3. **IDs:** Replace `{id}` with actual IDs from your database
4. **Soft Delete:** Deactivating users doesn't delete them, just sets `actif=false`
5. **Course States:** Courses have 3 states:
   - `null` = Pending approval
   - `true` = Approved
   - `false` = Rejected

