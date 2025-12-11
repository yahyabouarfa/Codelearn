# 🎓 Learning Platform Admin Backend - Frontend Integration Guide

Welcome to the **Learning Platform Admin Backend** frontend integration documentation! This repository contains everything you need to build a frontend application that interacts with the Admin API.

## 📚 Documentation Overview

This repository includes comprehensive documentation for frontend developers:

### 1. **FRONTEND_GUIDE.md** - Complete Development Guide
The most comprehensive guide covering:
- API endpoints with full examples
- Data models and TypeScript interfaces
- Frontend examples in React, Vue, Angular, and Vanilla JS
- Error handling patterns
- Best practices and optimization tips
- Pagination, caching, and debouncing strategies

👉 **[Read the Frontend Guide](./FRONTEND_GUIDE.md)**

### 2. **API_REFERENCE.md** - Quick API Reference
A concise reference guide with:
- All endpoints with request/response examples
- HTTP status codes
- cURL commands for testing
- Complete code examples for API integration
- Environment configuration

👉 **[Read the API Reference](./API_REFERENCE.md)**

### 3. **frontend-example.html** - Live Demo
A fully functional HTML/CSS/JavaScript demo that you can:
- Open directly in your browser
- Use as a template for your own application
- Test all API endpoints interactively
- See real-time data from the backend

👉 **[Open the Demo](./frontend-example.html)**

### 4. **POSTMAN_TESTS.md** - Postman Collection
API testing documentation with Postman collections.

👉 **[View Postman Tests](./POSTMAN_TESTS.md)**

---

## 🚀 Quick Start

### Prerequisites
- The backend Spring Boot application must be running
- Default URL: `http://localhost:8080`
- Database connection must be active

### Step 1: Test the Backend
Open your browser and navigate to:
```
http://localhost:8080/api/admin/db-test
```

You should see a JSON response indicating database connectivity.

### Step 2: Try the Demo
1. Open `frontend-example.html` in your web browser
2. Click "Test Connection" to verify backend connectivity
3. Explore the different tabs (Users, Courses, etc.)
4. Try approving or rejecting courses

### Step 3: Build Your Application
Choose your preferred framework and follow the examples:

- **React/TypeScript**: See FRONTEND_GUIDE.md → React Component Examples
- **Vue.js**: See FRONTEND_GUIDE.md → Vue.js Example
- **Angular**: See FRONTEND_GUIDE.md → Angular Example
- **Vanilla JS**: Use frontend-example.html as a starting point

---

## 🌐 API Overview

### Base URL
```
http://localhost:8080/api/admin
```

### Available Endpoints

#### Database
- `GET /db-test` - Test database connection

#### Users
- `GET /users` - List all users
- `PUT /users/{id}/deactivate` - Deactivate a user

#### Courses
- `GET /cours` - List all courses
- `GET /cours/pending` - List pending courses
- `GET /cours/approved` - List approved courses
- `GET /cours/rejected` - List rejected courses
- `POST /cours/{id}/approve` - Approve a course
- `POST /cours/{id}/reject` - Reject a course

---

## 💻 Code Examples

### Fetch API (Vanilla JavaScript)
```javascript
// Get all users
const response = await fetch('http://localhost:8080/api/admin/users');
const users = await response.json();
console.log(users);

// Approve a course
await fetch('http://localhost:8080/api/admin/cours/1/approve', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' }
});
```

### Axios
```javascript
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/admin';

// Get pending courses
const { data: courses } = await axios.get(`${API_URL}/cours/pending`);

// Deactivate user
await axios.put(`${API_URL}/users/1/deactivate`);
```

### React Hook
```typescript
import { useState, useEffect } from 'react';

function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8080/api/admin/users')
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      });
  }, []);

  return { users, loading };
}
```

---

## 📊 Data Models

### User (Utilisateur)
```typescript
interface Utilisateur {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role: string;
  actif: boolean;
}
```

### Course (Cours)
```typescript
interface Cours {
  id: number;
  titre: string;
  description: string;
  createur: Utilisateur;
  valideParAdmin: boolean | null;  // null=pending, true=approved, false=rejected
}
```

---

## 🎯 Common Use Cases

### 1. Display All Users
```javascript
const users = await fetch('http://localhost:8080/api/admin/users')
  .then(res => res.json());

users.forEach(user => {
  console.log(`${user.prenom} ${user.nom} - ${user.email}`);
});
```

### 2. Moderate Courses
```javascript
// Get courses awaiting review
const pending = await fetch('http://localhost:8080/api/admin/cours/pending')
  .then(res => res.json());

// Approve first course
if (pending.length > 0) {
  await fetch(`http://localhost:8080/api/admin/cours/${pending[0].id}/approve`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });
}
```

### 3. Dashboard Statistics
```javascript
async function getDashboardStats() {
  const [users, courses, pending] = await Promise.all([
    fetch('http://localhost:8080/api/admin/users').then(r => r.json()),
    fetch('http://localhost:8080/api/admin/cours').then(r => r.json()),
    fetch('http://localhost:8080/api/admin/cours/pending').then(r => r.json())
  ]);

  return {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.actif).length,
    totalCourses: courses.length,
    pendingCourses: pending.length
  };
}
```

---

## 🔧 Configuration

### Development Environment
```javascript
const config = {
  apiUrl: 'http://localhost:8080/api/admin',
  timeout: 10000
};
```

### Production Environment
```javascript
const config = {
  apiUrl: process.env.REACT_APP_API_URL || 'https://api.yourapp.com/api/admin',
  timeout: 10000
};
```

---

## 🛠️ Development Tools

### Browser DevTools
- Network tab to inspect API requests
- Console for debugging
- React DevTools for React applications

### Recommended Extensions
- **Postman**: API testing
- **JSON Viewer**: Format JSON responses
- **Redux DevTools**: State management debugging (if using Redux)

### Testing
```bash
# Test with cURL
curl http://localhost:8080/api/admin/users

# Test with httpie
http localhost:8080/api/admin/users
```

---

## ⚠️ Important Notes

### CORS
- CORS is enabled for all origins in development
- Restrict origins in production for security

### Authentication
- Currently, no authentication is required
- Implement JWT or OAuth2 for production

### Course Validation States
- `null`: Pending (awaiting admin review)
- `true`: Approved by admin
- `false`: Rejected by admin

### Soft Delete
- User deactivation sets `actif = false`
- Users are not deleted from the database

---

## 🎨 UI/UX Recommendations

### Loading States
Always show loading indicators:
```javascript
const [loading, setLoading] = useState(true);

{loading ? <Spinner /> : <DataTable data={data} />}
```

### Error Handling
Display user-friendly error messages:
```javascript
try {
  const data = await fetchData();
} catch (error) {
  showNotification('Failed to load data. Please try again.', 'error');
}
```

### Confirmation Dialogs
Confirm destructive actions:
```javascript
const handleDeactivate = (userId) => {
  if (confirm('Are you sure you want to deactivate this user?')) {
    deactivateUser(userId);
  }
};
```

### Real-time Updates
Refresh data after actions:
```javascript
const handleApprove = async (courseId) => {
  await approveCourse(courseId);
  await loadPendingCourses(); // Refresh list
};
```

---

## 📱 Responsive Design Tips

### Mobile-First Approach
```css
/* Mobile (default) */
.card { width: 100%; }

/* Tablet */
@media (min-width: 768px) {
  .card { width: 48%; }
}

/* Desktop */
@media (min-width: 1024px) {
  .card { width: 32%; }
}
```

### Touch-Friendly Buttons
```css
.btn {
  min-height: 44px;
  min-width: 44px;
  padding: 12px 24px;
}
```

---

## 🔍 Debugging Tips

### Network Errors
```javascript
fetch(url)
  .then(res => {
    console.log('Response status:', res.status);
    console.log('Response headers:', res.headers);
    return res.json();
  })
  .catch(err => {
    console.error('Network error:', err);
    console.error('Error type:', err.constructor.name);
  });
```

### CORS Issues
If you see CORS errors:
1. Ensure backend is running
2. Check if CORS is properly configured in backend
3. Use browser DevTools Network tab to inspect preflight requests

### Backend Not Running
```javascript
fetch(url)
  .catch(err => {
    if (err instanceof TypeError && err.message.includes('Failed to fetch')) {
      alert('Backend server is not running. Please start it on port 8080.');
    }
  });
```

---

## 📦 Recommended Libraries

### State Management
- **React**: Redux, Zustand, Jotai
- **Vue**: Vuex, Pinia
- **Angular**: NgRx, Akita

### HTTP Clients
- **Axios**: Feature-rich HTTP client
- **React Query**: Data fetching & caching
- **SWR**: React hooks for data fetching

### UI Components
- **React**: Material-UI, Ant Design, Chakra UI
- **Vue**: Vuetify, Element Plus, Quasar
- **Angular**: Angular Material, PrimeNG

### Form Handling
- **React**: React Hook Form, Formik
- **Vue**: VeeValidate
- **Angular**: Reactive Forms

---

## 🚀 Deployment

### Frontend Deployment
Popular hosting options:
- **Vercel**: For React, Next.js, Vue
- **Netlify**: For static sites and SPAs
- **GitHub Pages**: For static HTML/CSS/JS
- **Firebase Hosting**: For all frameworks

### Environment Variables
Create `.env` file:
```env
VITE_API_URL=https://your-backend.com/api/admin
REACT_APP_API_URL=https://your-backend.com/api/admin
```

---

## 📞 Support

For questions or issues:
1. Check the documentation files in this repository
2. Review the code examples in `frontend-example.html`
3. Test endpoints using Postman (see POSTMAN_TESTS.md)
4. Contact the backend development team

---

## 📄 License

This project is part of the Learning Platform application.

---

## 🤝 Contributing

To contribute frontend improvements:
1. Fork the repository
2. Create a feature branch
3. Add your improvements
4. Submit a pull request

---

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [Vue.js Documentation](https://vuejs.org)
- [Angular Documentation](https://angular.io)
- [MDN Web Docs - Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [Axios Documentation](https://axios-http.com)

---

**Happy Coding! 🚀**

For detailed information, please refer to:
- [Complete Frontend Guide](./FRONTEND_GUIDE.md)
- [API Reference](./API_REFERENCE.md)
- [Live Demo](./frontend-example.html)

