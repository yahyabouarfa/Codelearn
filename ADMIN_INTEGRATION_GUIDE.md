# 🔧 Admin API Integration Guide

## ✅ Changes Made

Your frontend has been updated to integrate with the Admin backend API running on **port 8083**.

### 1. **Environment Configuration**
- Created `.env` file for development
- Updated `.env.production` to point to `http://localhost:8083/api/admin`

### 2. **API Configuration (`src/config/apiUrls.js`)**
Updated admin endpoints to match the backend API:
- `GET /db-test` - Test database connection
- `GET /users` - Get all users
- `POST /users` - Create user
- `PUT /users/{id}` - Update user
- `DELETE /users/{id}` - Delete user
- `GET /cours` - Get all courses
- `GET /cours/pending` - Get pending courses
- `POST /cours` - Create course
- `PUT /cours/{id}` - Update course
- `POST /cours/{id}/approve` - Approve course
- `POST /cours/{id}/reject` - Reject course

### 3. **AdminService (`src/services/AdminService.js`)**
Completely rewritten to match the backend API:
- User management methods (CRUD operations)
- Course management methods (CRUD operations)
- Course approval/rejection methods
- Database connection test method

### 4. **UserManagement Page**
Updated to work with backend data structure:
- Supports both `ADMIN/TEACHER/STUDENT` and old role names
- Handles null `nom/prenom` fields (displays username instead)
- Shows username as fallback when names are missing
- Updated role filters to use backend role names

### 5. **CourseValidation Page**
Updated validation logic:
- Uses `approveCourse()` and `rejectCourse()` methods
- Handles `createur` object structure from backend
- Shows creator username and email properly
- Better error handling

---

## 🚀 Quick Start

### 1. Verify Backend is Running
```powershell
# Test if backend is accessible
Invoke-RestMethod -Uri "http://localhost:8083/api/admin/db-test" -Method Get
```

Expected response:
```json
{
  "status": "SUCCESS",
  "connected": true,
  "databaseProductName": "PostgreSQL"
}
```

### 2. Install Dependencies (if not already done)
```powershell
cd c:\Users\yahya\Desktop\Codelearnappp\codelearnfront
npm install
```

### 3. Start Frontend
```powershell
npm start
```

---

## 📋 Testing the Integration

### Test User Management

#### Get All Users
```javascript
import { AdminService } from './services/AdminService';

// Get all users
const users = await AdminService.getAllUsers();
console.log('Users:', users);
```

#### Create a User
```javascript
const newUser = {
  username: "johndoe",
  email: "john@example.com",
  role: "STUDENT",
  motDePasse: "password123"
};

const createdUser = await AdminService.createUser(newUser);
console.log('Created:', createdUser);
```

#### Update a User
```javascript
const updatedData = {
  username: "johndoe_updated",
  email: "john.updated@example.com",
  role: "TEACHER",
  motDePasse: "newPassword123"
};

const updatedUser = await AdminService.updateUser(1, updatedData);
console.log('Updated:', updatedUser);
```

#### Delete a User
```javascript
await AdminService.deleteUser(1);
console.log('User deleted');
```

### Test Course Management

#### Get All Courses
```javascript
const courses = await AdminService.getAllCourses();
console.log('Courses:', courses);
```

#### Get Pending Courses
```javascript
const pendingCourses = await AdminService.getPendingCourses();
console.log('Pending courses:', pendingCourses);
```

#### Create a Course
```javascript
const newCourse = {
  titre: "React for Beginners",
  description: "Learn React from scratch"
};

const createdCourse = await AdminService.createCourse(newCourse);
console.log('Created:', createdCourse);
```

#### Approve a Course
```javascript
const approvedCourse = await AdminService.approveCourse(1);
console.log('Approved:', approvedCourse);
// approvedCourse.valideParAdmin will be true
```

#### Reject a Course
```javascript
const rejectedCourse = await AdminService.rejectCourse(1);
console.log('Rejected:', rejectedCourse);
// rejectedCourse.valideParAdmin will be false
```

---

## 🔑 Data Models

### User (from Backend)
```typescript
interface User {
  id: number;
  nom: string | null;          // Can be null
  prenom: string | null;       // Can be null
  username: string;            // Always present
  email: string;               // Always present
  motDePasse: string;          // Hashed password
  role: string;                // "ADMIN", "TEACHER", or "STUDENT"
}
```

### Course (from Backend)
```typescript
interface Course {
  id: number;
  titre: string;
  description: string;
  createur: User | null;       // Can be null
  valideParAdmin: boolean;     // Approval status
}
```

### Create User Request
```typescript
interface CreateUserDto {
  username: string;      // Required, max 50 chars
  email: string;         // Required, valid email
  role: string;          // Required: "ADMIN", "TEACHER", "STUDENT"
  motDePasse?: string;   // Optional, defaults to "password123"
}
```

### Create Course Request
```typescript
interface CreateCourseDto {
  titre: string;         // Required, max 150 chars
  description: string;   // Required, max 5000 chars
}
```

---

## ⚙️ Role Mapping

Your frontend now supports both old and new role names:

| Backend Role | Frontend Display | Old Name |
|--------------|------------------|----------|
| `ADMIN` | Admin | `Administrateur` |
| `TEACHER` | Créateur | `CreateurDeCours` |
| `STUDENT` | Apprenant | `Apprenant` |

---

## 🎯 Using the Admin Pages

### User Management Page (`/admin/users`)
- View all users with search and filter
- See total users, students, and teachers
- Delete users (with confirmation)
- Users without `nom`/`prenom` show their username
- Role badges display correctly for backend roles

### Course Validation Page (`/admin/courses/validation`)
- View all pending courses (where `valideParAdmin: false`)
- See course details in modal
- Approve or reject courses
- Approved courses get `valideParAdmin: true`
- Rejected courses stay with `valideParAdmin: false`

---

## 🐛 Troubleshooting

### Backend Not Responding
```powershell
# Check if backend is running
netstat -ano | findstr :8083

# Test connection
Invoke-RestMethod -Uri "http://localhost:8083/api/admin/db-test" -Method Get
```

### CORS Errors
The backend is configured to allow all origins. If you still get CORS errors:
1. Verify backend is running on port 8083
2. Check browser console for exact error
3. Ensure you're using the correct URL

### 404 Not Found
- Double-check the endpoint URL in `apiUrls.js`
- Verify the ID exists for endpoints with `{id}`
- Ensure `/api/admin` prefix is included

### Data Not Displaying
- Check if backend returns data: `await AdminService.getAllUsers()`
- Verify data structure matches expected format
- Check browser console for errors
- Ensure fields like `nom`, `prenom` can be null

---

## 📝 Important Notes

### Default Values
- New users without password get `"password123"` as default
- New courses are automatically set to `valideParAdmin: false`
- `nom` and `prenom` can be `null` (backend allows this)

### Validation Rules
**Users:**
- `username`: Required, max 50 characters
- `email`: Required, valid email format
- `role`: Required (`ADMIN`, `TEACHER`, or `STUDENT`)
- `motDePasse`: Optional, min 6 characters

**Courses:**
- `titre`: Required, max 150 characters
- `description`: Required, max 5000 characters

### API Responses
- `200 OK` - Success
- `201 Created` - Resource created
- `204 No Content` - Delete success (empty response)
- `400 Bad Request` - Validation error
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

---

## 🎉 You're All Set!

Your frontend is now fully configured to work with the Admin backend API on port 8083. All endpoints are properly mapped, and the UI components are updated to handle the backend data structure.

**Next Steps:**
1. Start the backend on port 8083
2. Start the frontend with `npm start`
3. Navigate to admin pages and test functionality
4. Check console for any errors

**Happy Coding!** 🚀
