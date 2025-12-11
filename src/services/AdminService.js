import { adminApi } from './api/apiClient';
import { API_URLS } from '../config/apiUrls';

/**
 * Admin Service
 * Handles admin operations - course validation, user management
 * Based on backend API documentation (port 8083)
 */
export const AdminService = {
  /**
   * Test database connection
   * @returns {Promise} Database connection status
   */
  testConnection: async () => {
    const response = await adminApi.get(API_URLS.ADMIN.DB_TEST);
    return response.data;
  },

  // ==================== USER MANAGEMENT ====================

  /**
   * Get all users
   * @returns {Promise} List of all users
   */
  getAllUsers: async () => {
    const response = await adminApi.get(API_URLS.ADMIN.USERS);
    return response.data;
  },

  /**
   * Deactivate a user (soft delete - sets actif to false)
   * @param {number} userId - User ID
   * @returns {Promise} Deactivated user object
   */
  deactivateUser: async (userId) => {
    const response = await adminApi.put(API_URLS.ADMIN.DEACTIVATE_USER(userId));
    return response.data;
  },

  // ==================== COURSE MANAGEMENT ====================

  /**
   * Get all courses
   * @returns {Promise} List of all courses
   */
  getAllCourses: async () => {
    const response = await adminApi.get(API_URLS.ADMIN.COURSES);
    return response.data;
  },

  /**
   * Get pending courses (valideParAdmin = null)
   * @returns {Promise} List of pending courses
   */
  getPendingCourses: async () => {
    const response = await adminApi.get(API_URLS.ADMIN.PENDING_COURSES);
    return response.data;
  },

  /**
   * Get approved courses (valideParAdmin = true)
   * @returns {Promise} List of approved courses
   */
  getApprovedCourses: async () => {
    const response = await adminApi.get(API_URLS.ADMIN.APPROVED_COURSES);
    return response.data;
  },

  /**
   * Get rejected courses (valideParAdmin = false)
   * @returns {Promise} List of rejected courses
   */
  getRejectedCourses: async () => {
    const response = await adminApi.get(API_URLS.ADMIN.REJECTED_COURSES);
    return response.data;
  },

  /**
   * Approve a course (sets valideParAdmin to true)
   * @param {number} courseId - Course ID
   * @returns {Promise} Approved course
   */
  approveCourse: async (courseId) => {
    const response = await adminApi.post(API_URLS.ADMIN.APPROVE_COURSE(courseId));
    return response.data;
  },

  /**
   * Reject a course (sets valideParAdmin to false)
   * @param {number} courseId - Course ID
   * @returns {Promise} Rejected course
   */
  rejectCourse: async (courseId) => {
    const response = await adminApi.post(API_URLS.ADMIN.REJECT_COURSE(courseId));
    return response.data;
  },
};

export default AdminService;
