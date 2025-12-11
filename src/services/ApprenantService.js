import { apprenantApi } from './api/apiClient';
import { API_URLS } from '../config/apiUrls';

/**
 * Apprenant Service
 * Handles all API calls for the Apprenant (Student) module
 * Backend API: http://localhost:8082/api/apprenant
 */
const ApprenantService = {
  /**
   * Get all validated courses with pagination and search
   * Endpoint: GET /api/apprenant/courses
   * @param {Object} params - { query, page, size }
   * @returns {Promise<Object>} Paginated course list
   */
  getAllCourses: async (params = {}) => {
    try {
      const { query = '', page = 0, size = 12 } = params;
      const queryParams = new URLSearchParams();
      
      if (query) queryParams.append('query', query);
      queryParams.append('page', page.toString());
      queryParams.append('size', size.toString());

      console.log('Fetching apprenant courses with params:', params);
      const response = await apprenantApi.get(`${API_URLS.APPRENANT.COURSES}?${queryParams}`);
      console.log('getAllCourses response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw error;
    }
  },

  /**
   * Get course details by ID
   * Endpoint: GET /api/apprenant/courses/{id}
   * @param {number} courseId - Course ID
   * @returns {Promise<Object>} Course details with supports
   */
  getCourseById: async (courseId) => {
    try {
      console.log('Fetching course details for ID:', courseId);
      const response = await apprenantApi.get(API_URLS.APPRENANT.COURSE_DETAIL(courseId));
      console.log('getCourseById response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching course details:', error);
      if (error.response?.status === 404) {
        throw new Error('Cours non trouvé');
      }
      throw error;
    }
  },

  /**
   * Access a support material (get temporary download URL)
   * Endpoint: POST /api/apprenant/supports/{supportId}/access
   * @param {number} supportId - Support ID
   * @returns {Promise<Object>} { supportId, type, temporaryUrl, expiresAt }
   */
  accessSupport: async (supportId) => {
    try {
      console.log('Accessing support:', supportId);
      const response = await apprenantApi.post(API_URLS.APPRENANT.SUPPORT_ACCESS(supportId));
      console.log('accessSupport response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error accessing support:', error);
      if (error.response?.status === 404) {
        throw new Error('Support non trouvé');
      }
      throw error;
    }
  },

  /**
   * Mark a module as completed
   * Endpoint: POST /api/apprenant/courses/{courseId}/modules/{moduleId}/complete
   * @param {number} courseId - Course ID
   * @param {number} moduleId - Module ID
   * @returns {Promise<Object>} Completion data
   */
  completeModule: async (courseId, moduleId) => {
    try {
      console.log('Completing module:', { courseId, moduleId });
      const response = await apprenantApi.post(
        API_URLS.APPRENANT.COMPLETE_MODULE(courseId, moduleId)
      );
      console.log('completeModule response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error completing module:', error);
      throw error;
    }
  },
};

export default ApprenantService;
