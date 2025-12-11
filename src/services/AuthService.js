import { userApi } from './api/apiClient';
import { API_URLS } from '../config/apiUrls';

/**
 * Authentication Service
 * Handles user authentication and registration
 */
export const AuthService = {
  /**
   * Login user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise} User data with JWT token
   */
  login: async (email, password) => {
    const response = await userApi.post(API_URLS.USER.LOGIN, { 
      email, 
      motDePasse: password 
    });
    return response.data;
  },

  /**
   * Register new user
   * @param {Object} userData - User registration data
   * @returns {Promise} User data with JWT token
   */
  register: async (userData) => {
    const { password, ...rest } = userData;
    const response = await userApi.post(API_URLS.USER.REGISTER, {
      ...rest,
      motDePasse: password
    });
    return response.data;
  },

  /**
   * Logout user
   * @returns {Promise}
   */
  logout: async () => {
    try {
      await userApi.post(API_URLS.USER.LOGOUT);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem(process.env.REACT_APP_TOKEN_KEY);
      localStorage.removeItem(process.env.REACT_APP_REFRESH_TOKEN_KEY);
    }
  },

  /**
   * Get current user profile
   * @returns {Promise} Current user data
   */
  getCurrentUser: async () => {
    const response = await userApi.get(API_URLS.USER.PROFILE);
    return response.data;
  },

  /**
   * Check if user is authenticated
   * @returns {boolean}
   */
  isAuthenticated: () => {
    return !!localStorage.getItem(process.env.REACT_APP_TOKEN_KEY);
  },

  /**
   * Get stored token
   * @returns {string|null}
   */
  getToken: () => {
    return localStorage.getItem(process.env.REACT_APP_TOKEN_KEY);
  },

  /**
   * Store token
   * @param {string} token
   */
  setToken: (token) => {
    localStorage.setItem(process.env.REACT_APP_TOKEN_KEY, token);
  },

  /**
   * Remove token
   */
  removeToken: () => {
    localStorage.removeItem(process.env.REACT_APP_TOKEN_KEY);
    localStorage.removeItem(process.env.REACT_APP_REFRESH_TOKEN_KEY);
  },
};

export default AuthService;
