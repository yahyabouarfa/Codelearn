import { userApi } from './api/apiClient';
import { API_URLS } from '../config/apiUrls';

/**
 * User Service
 * Handles user profile and user management operations
 */
export const UserService = {
  /**
   * Get all users (Admin only)
   * @param {number} page - Page number
   * @param {number} size - Page size
   * @returns {Promise} Paginated list of users
   */
  getAllUsers: async (page = 0, size = 10) => {
    const response = await userApi.get(API_URLS.USER.USERS, {
      params: { page, size },
    });
    return response.data;
  },

  /**
   * Get user by ID
   * @param {number} userId - User ID
   * @returns {Promise} User data
   */
  getUserById: async (userId) => {
    const response = await userApi.get(`${API_URLS.USER.USERS}/${userId}`);
    return response.data;
  },

  /**
   * Update user profile
   * @param {number} userId - User ID
   * @param {Object} userData - Updated user data
   * @returns {Promise} Updated user data
   */
  updateUser: async (userId, userData) => {
    const response = await userApi.put(API_URLS.USER.UPDATE_PROFILE(userId), userData);
    return response.data;
  },

  /**
   * Delete user
   * @param {number} userId - User ID
   * @returns {Promise}
   */
  deleteUser: async (userId) => {
    const response = await userApi.delete(API_URLS.USER.DELETE_USER(userId));
    return response.data;
  },

  /**
   * Update current user profile
   * @param {Object} userData - Updated user data
   * @returns {Promise} Updated user data
   */
  updateProfile: async (userData) => {
    const response = await userApi.put(API_URLS.USER.PROFILE, userData);
    return response.data;
  },

  /**
   * Change password
   * @param {Object} passwordData - { currentPassword, newPassword }
   * @returns {Promise}
   */
  changePassword: async (passwordData) => {
    const response = await userApi.post(`${API_URLS.USER.PROFILE}/change-password`, passwordData);
    return response.data;
  },
};

export default UserService;
