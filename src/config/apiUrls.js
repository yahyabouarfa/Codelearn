/**
 * Centralized API URL configuration for all microservices
 */
export const API_URLS = {
  // User Authentication Service
  USER: {
    BASE: process.env.REACT_APP_USER_API,
    LOGIN: '/auth/login',
    REGISTER: '/auth/signup',
    LOGOUT: '/auth/logout',
    PROFILE: '/users/me',
    USERS: '/users',
    UPDATE_PROFILE: (id) => `/users/${id}`,
    DELETE_USER: (id) => `/users/${id}`,
  },
  
  // Apprenant (Learner) Service
  APPRENANT: {
    BASE: process.env.REACT_APP_APPRENANT_API,
    COURSES: '/courses',
    COURSES_VALIDATED: '/courses/validated', // Only validated courses
    COURSE_DETAIL: (id) => `/courses/${id}`,
    COURSE_DETAIL_VALIDATED: (id) => `/courses/validated/${id}`, // Validated course with direct download URLs
    SUPPORT_ACCESS: (supportId) => `/supports/${supportId}/access`,
    COMPLETE_MODULE: (courseId, moduleId) => `/courses/${courseId}/modules/${moduleId}/complete`,
  },
  
  // Createur (Course Creator) Service - Port 8084
  CREATEUR: {
    BASE: process.env.REACT_APP_CREATEUR_API,
    // Course Management
    LIST_COURS: '/cours/liste',
    PUBLISH_COURS: '/cours/publier', // createur_id hardcoded to 3 in backend
    PUBLISH_COURS_WITH_FILES: '/cours/publier/with-files', // createur_id hardcoded to 3 in backend
    MODIFY_COURS: (id) => `/cours/modifier/${id}`,
    ADD_FILES_TO_COURS: (id) => `/cours/modifier/${id}/add-files`,
    // Support Management
    ADD_SUPPORT: (coursId) => `/cours/${coursId}/supports`,
    UPLOAD_SUPPORT: (coursId) => `/cours/${coursId}/supports/upload`,
  },
  
  // Admin Service
  ADMIN: {
    BASE: process.env.REACT_APP_ADMIN_API,
    DB_TEST: '/db-test',
    USERS: '/users',
    DEACTIVATE_USER: (id) => `/users/${id}/deactivate`,
    COURSES: '/cours',
    PENDING_COURSES: '/cours/pending',
    APPROVED_COURSES: '/cours/approved',
    REJECTED_COURSES: '/cours/rejected',
    APPROVE_COURSE: (id) => `/cours/${id}/approve`,
    REJECT_COURSE: (id) => `/cours/${id}/reject`,
  }
};

export default API_URLS;
