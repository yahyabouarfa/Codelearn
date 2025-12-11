import axios from 'axios';
import { API_URLS } from '../../config/apiUrls';
import toast from 'react-hot-toast';
import { TOAST_MESSAGES } from '../../config/constants';

/**
 * Create axios instances for each microservice
 */
export const userApi = axios.create({
  baseURL: API_URLS.USER.BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

export const apprenantApi = axios.create({
  baseURL: API_URLS.APPRENANT.BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

export const createurApi = axios.create({
  baseURL: API_URLS.CREATEUR.BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

export const adminApi = axios.create({
  baseURL: API_URLS.ADMIN.BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

// Debug: Log all API base URLs
console.log('=== API CLIENT CONFIGURATION ===');
console.log('User API Base URL:', API_URLS.USER.BASE);
console.log('Apprenant API Base URL:', API_URLS.APPRENANT.BASE);
console.log('Createur API Base URL:', API_URLS.CREATEUR.BASE);
console.log('Admin API Base URL:', API_URLS.ADMIN.BASE);
console.log('Full Createur API config:', {
  baseURL: createurApi.defaults.baseURL,
  timeout: createurApi.defaults.timeout,
  headers: createurApi.defaults.headers
});

/**
 * Request interceptor to add JWT token and user ID
 */
const addAuthToken = (config) => {
  const token = localStorage.getItem(process.env.REACT_APP_TOKEN_KEY);
  const user = localStorage.getItem('user');
  
  console.log('=== AUTH TOKEN INTERCEPTOR ===');
  console.log('Request to:', config.url);
  console.log('Token key used:', process.env.REACT_APP_TOKEN_KEY);
  console.log('Token exists:', !!token);
  console.log('Full token:', token);
  console.log('Token length:', token ? token.length : 0);
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('Authorization header set:', config.headers.Authorization.substring(0, 30) + '...');
  } else {
    console.warn('No token found in localStorage!');
  }
  
  // Add user ID header if available
  if (user) {
    try {
      const userData = JSON.parse(user);
      if (userData.id) {
        config.headers['X-User-Id'] = userData.id;
        console.log('Added X-User-Id header:', userData.id);
      }
    } catch (e) {
      console.error('Error parsing user data:', e);
    }
  }
  
  console.log('=== END INTERCEPTOR ===');
  return config;
};

/**
 * Request error handler
 */
const handleRequestError = (error) => {
  console.error('Request Error:', error);
  return Promise.reject(error);
};

/**
 * Response interceptor to handle errors
 */
const handleResponse = (response) => {
  return response;
};

/**
 * Response error handler
 */
const handleResponseError = (error) => {
  if (!error.response) {
    // Network error
    toast.error(TOAST_MESSAGES.ERROR.NETWORK);
    return Promise.reject(error);
  }

  const { status, data } = error.response;

  switch (status) {
    case 401:
      // Unauthorized - token expired or invalid
      console.warn('401 Unauthorized error:', error.config?.url);
      
      // Only logout and redirect for user authentication API (port 8081)
      // Other microservices might not require auth or have different auth
      if (error.config?.baseURL?.includes('8081')) {
        toast.error(TOAST_MESSAGES.ERROR.UNAUTHORIZED);
        localStorage.removeItem(process.env.REACT_APP_TOKEN_KEY);
        localStorage.removeItem(process.env.REACT_APP_REFRESH_TOKEN_KEY);
        localStorage.removeItem('user');
        
        // Redirect to login if not already there
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      } else {
        // For other services, just show error without logging out
        toast.error(data?.message || 'Erreur d\'authentification avec le service');
      }
      break;

    case 403:
      // Forbidden - insufficient permissions
      toast.error(TOAST_MESSAGES.ERROR.FORBIDDEN);
      break;

    case 404:
      // Not found
      toast.error(data?.message || TOAST_MESSAGES.ERROR.NOT_FOUND);
      break;

    case 422:
    case 400:
      // Validation error
      toast.error(data?.message || TOAST_MESSAGES.ERROR.VALIDATION);
      break;

    case 500:
    case 502:
    case 503:
      // Server error
      toast.error(data?.message || TOAST_MESSAGES.ERROR.GENERIC);
      break;

    default:
      toast.error(data?.message || TOAST_MESSAGES.ERROR.GENERIC);
  }

  return Promise.reject(error);
};

/**
 * Apply interceptors to all API instances
 */
[userApi, apprenantApi, createurApi, adminApi].forEach(api => {
  // Request interceptors
  api.interceptors.request.use(addAuthToken, handleRequestError);
  
  // Response interceptors
  api.interceptors.response.use(handleResponse, handleResponseError);
});

/**
 * Create a multipart form data API instance for file uploads
 */
export const createMultipartApi = (baseApi) => {
  return {
    ...baseApi,
    postFormData: (url, formData, onUploadProgress) => {
      return baseApi.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress,
      });
    },
    putFormData: (url, formData, onUploadProgress) => {
      return baseApi.put(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress,
      });
    },
  };
};

export default {
  userApi,
  apprenantApi,
  createurApi,
  adminApi,
  createMultipartApi,
};
