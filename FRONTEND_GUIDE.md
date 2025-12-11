# 🎨 Frontend Development Guide - Course Platform

## Overview

This guide shows you how to create a frontend application that:
1. **Lists all courses** (without supports for better performance)
2. **Shows course details** when clicked
3. **Loads supports separately** for the selected course

---

## 📋 Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [React Implementation](#react-implementation)
3. [Vanilla JavaScript Implementation](#vanilla-javascript-implementation)
4. [Vue.js Implementation](#vue-implementation)
5. [API Integration Guide](#api-integration-guide)
6. [Styling Examples](#styling-examples)

---

## Architecture Overview

### Data Flow

```
┌─────────────────────────────────────────────────────────┐
│  Step 1: Load All Courses (No Supports)                │
│  GET /api/cours/liste                                   │
│  → Fast, lightweight response                           │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│  Step 2: User Clicks on a Course                       │
│  → Navigate to course details page                      │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│  Step 3: Load Course Supports                          │
│  GET /api/cours/{id}/supports                           │
│  → Load only when needed                                │
└─────────────────────────────────────────────────────────┘
```

---

## React Implementation

### 1. Project Setup

```bash
npx create-react-app course-platform
cd course-platform
npm install axios react-router-dom
npm start
```

### 2. API Service (`src/services/courseService.js`)

```javascript
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/cours';

export const courseService = {
  // Get all courses (without supports)
  getAllCourses: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/liste`);
      return response.data;
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw error;
    }
  },

  // Get single course by ID (without supports)
  getCourseById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching course:', error);
      throw error;
    }
  },

  // Get supports for a specific course
  getCourseSupports: async (courseId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${courseId}/supports`);
      return response.data;
    } catch (error) {
      console.error('Error fetching course supports:', error);
      throw error;
    }
  },

  // Create a new course
  createCourse: async (courseData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/publier`, courseData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating course:', error);
      throw error;
    }
  },

  // Create course with files
  createCourseWithFiles: async (formData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/publier/with-files`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating course with files:', error);
      throw error;
    }
  }
};
```

### 3. Course List Component (`src/components/CourseList.js`)

```javascript
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { courseService } from '../services/courseService';
import './CourseList.css';

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const data = await courseService.getAllCourses();
      setCourses(data);
      setError(null);
    } catch (err) {
      setError('Failed to load courses. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCourseClick = (courseId) => {
    navigate(`/course/${courseId}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading courses...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button onClick={loadCourses}>Retry</button>
      </div>
    );
  }

  return (
    <div className="course-list-container">
      <div className="header">
        <h1>📚 Available Courses</h1>
        <button 
          className="btn-create"
          onClick={() => navigate('/create-course')}
        >
          + Create New Course
        </button>
      </div>

      {courses.length === 0 ? (
        <div className="empty-state">
          <p>No courses available yet.</p>
          <button onClick={() => navigate('/create-course')}>
            Create Your First Course
          </button>
        </div>
      ) : (
        <div className="courses-grid">
          {courses.map((course) => (
            <div 
              key={course.id} 
              className="course-card"
              onClick={() => handleCourseClick(course.id)}
            >
              <div className="course-header">
                <h2>{course.titre}</h2>
                {course.valideParAdmin === true && (
                  <span className="badge-approved">✓ Approved</span>
                )}
                {course.valideParAdmin === false && (
                  <span className="badge-rejected">✗ Rejected</span>
                )}
                {course.valideParAdmin === null && (
                  <span className="badge-pending">⏳ Pending</span>
                )}
              </div>
              
              <p className="course-description">
                {course.description || 'No description available'}
              </p>
              
              <div className="course-footer">
                <div className="course-meta">
                  <span className="meta-item">
                    👤 {course.createur?.nom || 'Unknown'}
                  </span>
                  <span className="meta-item">
                    📅 {formatDate(course.dateCreation)}
                  </span>
                </div>
                <button className="btn-view">
                  View Details →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseList;
```

### 4. Course Details Component (`src/components/CourseDetails.js`)

```javascript
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { courseService } from '../services/courseService';
import './CourseDetails.css';

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [supports, setSupports] = useState([]);
  const [loadingCourse, setLoadingCourse] = useState(true);
  const [loadingSupports, setLoadingSupports] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCourseData();
    loadCourseSupports();
  }, [id]);

  const loadCourseData = async () => {
    try {
      setLoadingCourse(true);
      const data = await courseService.getCourseById(id);
      setCourse(data);
      setError(null);
    } catch (err) {
      setError('Failed to load course details.');
      console.error(err);
    } finally {
      setLoadingCourse(false);
    }
  };

  const loadCourseSupports = async () => {
    try {
      setLoadingSupports(true);
      const data = await courseService.getCourseSupports(id);
      setSupports(data);
    } catch (err) {
      console.error('Failed to load supports:', err);
      setSupports([]);
    } finally {
      setLoadingSupports(false);
    }
  };

  const getFileIcon = (typeSupport) => {
    const icons = {
      PDF: '📄',
      VIDEO: '🎥',
      DOCUMENT: '📝',
      IMAGE: '🖼️',
      AUDIO: '🎵',
      LINK: '🔗'
    };
    return icons[typeSupport] || '📎';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loadingCourse) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading course details...</p>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="error-container">
        <p className="error-message">{error || 'Course not found'}</p>
        <button onClick={() => navigate('/')}>Back to Courses</button>
      </div>
    );
  }

  return (
    <div className="course-details-container">
      <button className="btn-back" onClick={() => navigate('/')}>
        ← Back to Courses
      </button>

      <div className="course-header-section">
        <div className="title-row">
          <h1>{course.titre}</h1>
          {course.valideParAdmin === true && (
            <span className="badge-approved-large">✓ Approved</span>
          )}
          {course.valideParAdmin === false && (
            <span className="badge-rejected-large">✗ Rejected</span>
          )}
          {course.valideParAdmin === null && (
            <span className="badge-pending-large">⏳ Pending Review</span>
          )}
        </div>

        <div className="course-meta-details">
          <div className="meta-item">
            <strong>👤 Created by:</strong> {course.createur?.nom || 'Unknown'}
          </div>
          <div className="meta-item">
            <strong>📧 Email:</strong> {course.createur?.email || 'N/A'}
          </div>
          <div className="meta-item">
            <strong>📅 Created:</strong> {formatDate(course.dateCreation)}
          </div>
          {course.dateModification && (
            <div className="meta-item">
              <strong>🔄 Last Modified:</strong> {formatDate(course.dateModification)}
            </div>
          )}
        </div>
      </div>

      <div className="course-description-section">
        <h2>Description</h2>
        <p>{course.description || 'No description available for this course.'}</p>
      </div>

      <div className="course-supports-section">
        <h2>📚 Course Materials ({supports.length})</h2>
        
        {loadingSupports ? (
          <div className="loading-supports">
            <div className="spinner-small"></div>
            <p>Loading course materials...</p>
          </div>
        ) : supports.length === 0 ? (
          <div className="empty-supports">
            <p>No course materials available yet.</p>
          </div>
        ) : (
          <div className="supports-grid">
            {supports.map((support) => (
              <div key={support.id} className="support-card">
                <div className="support-icon">
                  {getFileIcon(support.typeSupport)}
                </div>
                <div className="support-info">
                  <h3>{support.fileName || 'Untitled'}</h3>
                  <span className="support-type">{support.typeSupport}</span>
                </div>
                <a 
                  href={support.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-download"
                >
                  {support.typeSupport === 'VIDEO' ? 'Watch' : 'Download'}
                </a>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="action-buttons">
        <button 
          className="btn-edit"
          onClick={() => navigate(`/edit-course/${course.id}`)}
        >
          ✏️ Edit Course
        </button>
        <button 
          className="btn-add-support"
          onClick={() => navigate(`/add-support/${course.id}`)}
        >
          + Add Material
        </button>
      </div>
    </div>
  );
};

export default CourseDetails;
```

### 5. App Router (`src/App.js`)

```javascript
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CourseList from './components/CourseList';
import CourseDetails from './components/CourseDetails';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <div className="nav-container">
            <h1 className="nav-logo">🎓 Course Platform</h1>
          </div>
        </nav>
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<CourseList />} />
            <Route path="/course/:id" element={<CourseDetails />} />
          </Routes>
        </main>

        <footer className="footer">
          <p>© 2025 Course Platform - All Rights Reserved</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
```

### 6. Course List Styles (`src/components/CourseList.css`)

```css
.course-list-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.header h1 {
  color: #2c3e50;
  font-size: 2.5rem;
  margin: 0;
}

.btn-create {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-create:hover {
  background-color: #2980b9;
}

.courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
}

.course-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.course-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
  border-color: #3498db;
}

.course-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.course-header h2 {
  color: #2c3e50;
  font-size: 1.5rem;
  margin: 0;
  flex: 1;
}

.badge-approved {
  background-color: #27ae60;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  white-space: nowrap;
}

.badge-rejected {
  background-color: #e74c3c;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  white-space: nowrap;
}

.badge-pending {
  background-color: #f39c12;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  white-space: nowrap;
}

.course-description {
  color: #7f8c8d;
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.course-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid #ecf0f1;
}

.course-meta {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.meta-item {
  color: #95a5a6;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-view {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-view:hover {
  background-color: #2980b9;
}

.loading-container,
.error-container,
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-message {
  color: #e74c3c;
  font-size: 1.125rem;
  margin-bottom: 1rem;
}

.empty-state p {
  color: #7f8c8d;
  font-size: 1.125rem;
  margin-bottom: 1.5rem;
}

.empty-state button,
.error-container button {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.empty-state button:hover,
.error-container button:hover {
  background-color: #2980b9;
}

@media (max-width: 768px) {
  .courses-grid {
    grid-template-columns: 1fr;
  }

  .header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .header h1 {
    font-size: 2rem;
  }
}
```

### 7. Course Details Styles (`src/components/CourseDetails.css`)

```css
.course-details-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
}

.btn-back {
  background-color: #95a5a6;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-bottom: 2rem;
}

.btn-back:hover {
  background-color: #7f8c8d;
}

.course-header-section {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  gap: 1rem;
}

.title-row h1 {
  color: #2c3e50;
  font-size: 2.5rem;
  margin: 0;
  flex: 1;
}

.badge-approved-large {
  background-color: #27ae60;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  white-space: nowrap;
}

.badge-rejected-large {
  background-color: #e74c3c;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  white-space: nowrap;
}

.badge-pending-large {
  background-color: #f39c12;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  white-space: nowrap;
}

.course-meta-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.course-meta-details .meta-item {
  color: #7f8c8d;
  font-size: 0.95rem;
}

.course-meta-details .meta-item strong {
  color: #2c3e50;
  margin-right: 0.5rem;
}

.course-description-section {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.course-description-section h2 {
  color: #2c3e50;
  margin-top: 0;
  margin-bottom: 1rem;
}

.course-description-section p {
  color: #7f8c8d;
  line-height: 1.8;
  font-size: 1.05rem;
}

.course-supports-section {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.course-supports-section h2 {
  color: #2c3e50;
  margin-top: 0;
  margin-bottom: 1.5rem;
}

.loading-supports {
  text-align: center;
  padding: 2rem;
}

.spinner-small {
  border: 3px solid #f3f3f3;
  border-top: 3px solid #3498db;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

.empty-supports {
  text-align: center;
  padding: 3rem;
  color: #95a5a6;
}

.supports-grid {
  display: grid;
  gap: 1rem;
}

.support-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 2px solid #ecf0f1;
  border-radius: 8px;
  transition: all 0.3s;
}

.support-card:hover {
  border-color: #3498db;
  background-color: #f8f9fa;
}

.support-icon {
  font-size: 2.5rem;
  flex-shrink: 0;
}

.support-info {
  flex: 1;
}

.support-info h3 {
  color: #2c3e50;
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
}

.support-type {
  background-color: #ecf0f1;
  color: #7f8c8d;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}

.btn-download {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
  text-decoration: none;
  transition: background-color 0.3s;
}

.btn-download:hover {
  background-color: #2980b9;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.btn-edit,
.btn-add-support {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-edit {
  background-color: #f39c12;
  color: white;
}

.btn-edit:hover {
  background-color: #e67e22;
}

.btn-add-support {
  background-color: #27ae60;
  color: white;
}

.btn-add-support:hover {
  background-color: #229954;
}

@media (max-width: 768px) {
  .title-row {
    flex-direction: column;
    align-items: flex-start;
  }

  .title-row h1 {
    font-size: 1.75rem;
  }

  .course-meta-details {
    grid-template-columns: 1fr;
  }

  .support-card {
    flex-direction: column;
    text-align: center;
  }

  .action-buttons {
    flex-direction: column;
  }
}
```

### 8. Global App Styles (`src/App.css`)

```css
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #f5f7fa;
}

.App {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.navbar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.nav-logo {
  font-size: 1.75rem;
  font-weight: bold;
  margin: 0;
}

.main-content {
  flex: 1;
  padding: 2rem 0;
}

.footer {
  background-color: #2c3e50;
  color: white;
  text-align: center;
  padding: 1.5rem 0;
  margin-top: auto;
}

.footer p {
  margin: 0;
  font-size: 0.875rem;
}
```

---

## Vanilla JavaScript Implementation

### HTML Structure (`index.html`)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Course Platform</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <nav class="navbar">
    <div class="nav-container">
      <h1 class="nav-logo">🎓 Course Platform</h1>
    </div>
  </nav>

  <main class="main-content">
    <div id="app"></div>
  </main>

  <footer class="footer">
    <p>© 2025 Course Platform - All Rights Reserved</p>
  </footer>

  <script src="app.js"></script>
</body>
</html>
```

### JavaScript (`app.js`)

```javascript
const API_BASE_URL = 'http://localhost:8080/api/cours';

// State management
let currentView = 'list';
let currentCourseId = null;

// API Functions
const api = {
  getAllCourses: async () => {
    const response = await fetch(`${API_BASE_URL}/liste`);
    if (!response.ok) throw new Error('Failed to fetch courses');
    return response.json();
  },

  getCourseById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    if (!response.ok) throw new Error('Failed to fetch course');
    return response.json();
  },

  getCourseSupports: async (courseId) => {
    const response = await fetch(`${API_BASE_URL}/${courseId}/supports`);
    if (!response.ok) throw new Error('Failed to fetch supports');
    return response.json();
  }
};

// Utility Functions
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const getFileIcon = (typeSupport) => {
  const icons = {
    PDF: '📄',
    VIDEO: '🎥',
    DOCUMENT: '📝',
    IMAGE: '🖼️',
    AUDIO: '🎵',
    LINK: '🔗'
  };
  return icons[typeSupport] || '📎';
};

const getStatusBadge = (valideParAdmin) => {
  if (valideParAdmin === true) {
    return '<span class="badge-approved">✓ Approved</span>';
  } else if (valideParAdmin === false) {
    return '<span class="badge-rejected">✗ Rejected</span>';
  } else {
    return '<span class="badge-pending">⏳ Pending</span>';
  }
};

// Render Functions
const renderCourseList = async () => {
  const app = document.getElementById('app');
  app.innerHTML = '<div class="loading-container"><div class="spinner"></div><p>Loading courses...</p></div>';

  try {
    const courses = await api.getAllCourses();
    
    let html = `
      <div class="course-list-container">
        <div class="header">
          <h1>📚 Available Courses</h1>
        </div>
    `;

    if (courses.length === 0) {
      html += `
        <div class="empty-state">
          <p>No courses available yet.</p>
        </div>
      `;
    } else {
      html += '<div class="courses-grid">';
      
      courses.forEach(course => {
        html += `
          <div class="course-card" onclick="showCourseDetails(${course.id})">
            <div class="course-header">
              <h2>${course.titre}</h2>
              ${getStatusBadge(course.valideParAdmin)}
            </div>
            <p class="course-description">${course.description || 'No description available'}</p>
            <div class="course-footer">
              <div class="course-meta">
                <span class="meta-item">👤 ${course.createur?.nom || 'Unknown'}</span>
                <span class="meta-item">📅 ${formatDate(course.dateCreation)}</span>
              </div>
              <button class="btn-view">View Details →</button>
            </div>
          </div>
        `;
      });
      
      html += '</div>';
    }

    html += '</div>';
    app.innerHTML = html;
  } catch (error) {
    app.innerHTML = `
      <div class="error-container">
        <p class="error-message">Failed to load courses.</p>
        <button onclick="renderCourseList()">Retry</button>
      </div>
    `;
  }
};

const renderCourseDetails = async (courseId) => {
  const app = document.getElementById('app');
  app.innerHTML = '<div class="loading-container"><div class="spinner"></div><p>Loading course details...</p></div>';

  try {
    const [course, supports] = await Promise.all([
      api.getCourseById(courseId),
      api.getCourseSupports(courseId)
    ]);

    let html = `
      <div class="course-details-container">
        <button class="btn-back" onclick="renderCourseList()">← Back to Courses</button>
        
        <div class="course-header-section">
          <div class="title-row">
            <h1>${course.titre}</h1>
            ${getStatusBadge(course.valideParAdmin)}
          </div>
          <div class="course-meta-details">
            <div class="meta-item"><strong>👤 Created by:</strong> ${course.createur?.nom || 'Unknown'}</div>
            <div class="meta-item"><strong>📧 Email:</strong> ${course.createur?.email || 'N/A'}</div>
            <div class="meta-item"><strong>📅 Created:</strong> ${formatDate(course.dateCreation)}</div>
            ${course.dateModification ? `<div class="meta-item"><strong>🔄 Last Modified:</strong> ${formatDate(course.dateModification)}</div>` : ''}
          </div>
        </div>

        <div class="course-description-section">
          <h2>Description</h2>
          <p>${course.description || 'No description available for this course.'}</p>
        </div>

        <div class="course-supports-section">
          <h2>📚 Course Materials (${supports.length})</h2>
    `;

    if (supports.length === 0) {
      html += '<div class="empty-supports"><p>No course materials available yet.</p></div>';
    } else {
      html += '<div class="supports-grid">';
      
      supports.forEach(support => {
        html += `
          <div class="support-card">
            <div class="support-icon">${getFileIcon(support.typeSupport)}</div>
            <div class="support-info">
              <h3>${support.fileName || 'Untitled'}</h3>
              <span class="support-type">${support.typeSupport}</span>
            </div>
            <a href="${support.url}" target="_blank" rel="noopener noreferrer" class="btn-download">
              ${support.typeSupport === 'VIDEO' ? 'Watch' : 'Download'}
            </a>
          </div>
        `;
      });
      
      html += '</div>';
    }

    html += `
        </div>
      </div>
    `;

    app.innerHTML = html;
  } catch (error) {
    app.innerHTML = `
      <div class="error-container">
        <p class="error-message">Failed to load course details.</p>
        <button onclick="renderCourseList()">Back to Courses</button>
      </div>
    `;
  }
};

// Global functions for onclick handlers
window.showCourseDetails = (courseId) => {
  currentCourseId = courseId;
  currentView = 'details';
  renderCourseDetails(courseId);
};

window.renderCourseList = () => {
  currentView = 'list';
  currentCourseId = null;
  renderCourseList();
};

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  renderCourseList();
});
```

---

## Vue.js Implementation

### Vue Component - Course List (`CourseList.vue`)

```vue
<template>
  <div class="course-list-container">
    <div class="header">
      <h1>📚 Available Courses</h1>
    </div>

    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
      <p>Loading courses...</p>
    </div>

    <div v-else-if="error" class="error-container">
      <p class="error-message">{{ error }}</p>
      <button @click="loadCourses">Retry</button>
    </div>

    <div v-else-if="courses.length === 0" class="empty-state">
      <p>No courses available yet.</p>
    </div>

    <div v-else class="courses-grid">
      <div 
        v-for="course in courses" 
        :key="course.id"
        class="course-card"
        @click="goToCourseDetails(course.id)"
      >
        <div class="course-header">
          <h2>{{ course.titre }}</h2>
          <span 
            class="badge-approved" 
            v-if="course.valideParAdmin === true"
          >✓ Approved</span>
          <span 
            class="badge-rejected" 
            v-else-if="course.valideParAdmin === false"
          >✗ Rejected</span>
          <span 
            class="badge-pending" 
            v-else
          >⏳ Pending</span>
        </div>
        
        <p class="course-description">
          {{ course.description || 'No description available' }}
        </p>
        
        <div class="course-footer">
          <div class="course-meta">
            <span class="meta-item">
              👤 {{ course.createur?.nom || 'Unknown' }}
            </span>
            <span class="meta-item">
              📅 {{ formatDate(course.dateCreation) }}
            </span>
          </div>
          <button class="btn-view">View Details →</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { courseService } from '@/services/courseService';

export default {
  name: 'CourseList',
  setup() {
    const router = useRouter();
    const courses = ref([]);
    const loading = ref(true);
    const error = ref(null);

    const loadCourses = async () => {
      try {
        loading.value = true;
        error.value = null;
        courses.value = await courseService.getAllCourses();
      } catch (err) {
        error.value = 'Failed to load courses. Please try again.';
        console.error(err);
      } finally {
        loading.value = false;
      }
    };

    const goToCourseDetails = (courseId) => {
      router.push(`/course/${courseId}`);
    };

    const formatDate = (dateString) => {
      if (!dateString) return 'N/A';
      return new Date(dateString).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };

    onMounted(() => {
      loadCourses();
    });

    return {
      courses,
      loading,
      error,
      loadCourses,
      goToCourseDetails,
      formatDate
    };
  }
};
</script>

<style scoped>
/* Same CSS as React version */
</style>
```

---

## API Integration Best Practices

### 1. Error Handling

```javascript
const fetchWithErrorHandling = async (url, options = {}) => {
  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Resource not found');
      } else if (response.status === 500) {
        throw new Error('Server error. Please try again later.');
      } else {
        throw new Error(`Error: ${response.status}`);
      }
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
```

### 2. Loading States

```javascript
const [isLoading, setIsLoading] = useState({
  courses: false,
  supports: false
});

// Usage
setIsLoading(prev => ({ ...prev, courses: true }));
// ... fetch data
setIsLoading(prev => ({ ...prev, courses: false }));
```

### 3. Caching Strategy

```javascript
// Simple cache implementation
const cache = new Map();

const getCachedOrFetch = async (key, fetchFunction, ttl = 60000) => {
  const cached = cache.get(key);
  
  if (cached && Date.now() - cached.timestamp < ttl) {
    return cached.data;
  }
  
  const data = await fetchFunction();
  cache.set(key, { data, timestamp: Date.now() });
  return data;
};

// Usage
const courses = await getCachedOrFetch('courses', () => 
  courseService.getAllCourses()
);
```

---

## Performance Optimization Tips

1. **Lazy Load Supports**: Only fetch supports when user views course details
2. **Pagination**: Implement pagination for large course lists
3. **Debounce Search**: If implementing search, debounce input
4. **Image Optimization**: Lazy load course thumbnails if added
5. **Route Prefetching**: Prefetch course details on hover

---

## Testing with Mock Data

```javascript
// mockData.js
export const mockCourses = [
  {
    id: 1,
    titre: "Introduction to React",
    description: "Learn React from scratch",
    createur: { id: 3, nom: "John Doe", email: "john@example.com" },
    valideParAdmin: true,
    dateCreation: "2025-12-11T10:00:00"
  },
  {
    id: 2,
    titre: "Advanced Spring Boot",
    description: "Master Spring Boot development",
    createur: { id: 3, nom: "John Doe", email: "john@example.com" },
    valideParAdmin: null,
    dateCreation: "2025-12-10T15:30:00"
  }
];

export const mockSupports = [
  {
    id: 1,
    typeSupport: "PDF",
    url: "https://example.com/document.pdf",
    fileName: "React Basics.pdf"
  },
  {
    id: 2,
    typeSupport: "VIDEO",
    url: "https://example.com/video.mp4",
    fileName: "Tutorial Video.mp4"
  }
];
```

---

## CORS Configuration

If you encounter CORS issues, ensure your backend has proper CORS configuration:

```java
// Already configured in your CorsConfig.java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:3000", "http://localhost:5173")
                .allowedMethods("GET", "POST", "PUT", "DELETE")
                .allowedHeaders("*");
    }
}
```

---

## Deployment Checklist

- [ ] Update API_BASE_URL to production URL
- [ ] Enable production build optimizations
- [ ] Configure environment variables
- [ ] Test all API endpoints
- [ ] Implement proper authentication
- [ ] Add error tracking (e.g., Sentry)
- [ ] Optimize bundle size
- [ ] Add loading skeletons
- [ ] Implement retry logic
- [ ] Add analytics

---

## Next Steps

1. **Authentication**: Add login/logout functionality
2. **Create Course Form**: Implement course creation UI
3. **Edit Course**: Add course editing functionality
4. **File Upload**: Add support upload UI
5. **Search & Filter**: Add search and filtering capabilities
6. **Responsive Design**: Ensure mobile compatibility
7. **Admin Panel**: Create admin approval interface

---

**Happy Coding! 🚀**

