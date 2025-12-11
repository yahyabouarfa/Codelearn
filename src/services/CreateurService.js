import { createurApi } from './api/apiClient';

/**
 * Createur Service for Course Creator Operations
 * Backend API: http://localhost:8084/api/cours
 * Documentation: Backend README.md
 * Updated: December 10, 2025
 * 
 * Note: createur_id is hardcoded to 3 in backend for all operations
 */
export const CreateurService = {
  // ==================== COURSE MANAGEMENT ====================

  /**
   * Get all courses (no filtering by creator)
   * Endpoint: GET /api/cours/liste
   * Returns ALL courses from all creators
   * @returns {Promise<Array>} Array of courses
   */
  getAllCourses: async () => {
    try {
      const response = await createurApi.get('/cours/liste');
      console.log('getAllCourses response:', response.data);
      
      if (!Array.isArray(response.data)) {
        return [];
      }
      
      // Clean circular references in supports
      return response.data.map(course => ({
        id: course.id,
        titre: course.titre,
        description: course.description,
        createur: course.createur,
        valideParAdmin: course.valideParAdmin,
        dateCreation: course.dateCreation,
        dateModification: course.dateModification,
        supports: (course.supports || []).map(support => ({
          id: support.id,
          typeSupport: support.typeSupport,
          url: support.url,
          fileName: support.fileName
        }))
      }));
    } catch (error) {
      console.error('Error fetching all courses:', error);
      throw error;
    }
  },

  /**
   * Get courses filtered by current creator (createur_id = 3)
   * Endpoint: GET /api/cours/liste
   * Backend filters by createur_id = 3 when using createurApi
   * @returns {Promise<Array>} Array of creator's courses
   */
  getMyCourses: async () => {
    try {
      const response = await createurApi.get('/cours/liste');
      console.log('getMyCourses RAW response:', response.data);
      console.log('Is array?', Array.isArray(response.data));
      console.log('Length:', response.data?.length);
      
      if (!response.data || !Array.isArray(response.data)) {
        console.warn('Response is not an array, returning empty');
        return [];
      }
      
      // Clean circular references in supports
      const cleaned = response.data.map(course => {
        console.log('Processing course:', course.id, course.titre);
        
        // Handle supports array - may have circular reference
        let cleanSupports = [];
        if (course.supports && Array.isArray(course.supports)) {
          cleanSupports = course.supports.map(support => ({
            id: support.id,
            typeSupport: support.typeSupport,
            url: support.url,
            fileName: support.fileName
          }));
        }
        
        return {
          id: course.id,
          titre: course.titre,
          description: course.description,
          createur: course.createur,
          valideParAdmin: course.valideParAdmin,
          dateCreation: course.dateCreation,
          dateModification: course.dateModification,
          supports: cleanSupports
        };
      });
      
      console.log('getMyCourses CLEANED:', cleaned);
      console.log('Returning', cleaned.length, 'courses');
      return cleaned;
    } catch (error) {
      console.error('Error fetching my courses:', error);
      throw error;
    }
  },

  /**
   * Get course by ID (without supports)
   * Endpoint: GET /api/cours/{id}
   * @param {number} courseId - Course ID
   * @returns {Promise<Object>} Course object
   */
  getCourseById: async (courseId) => {
    try {
      const response = await createurApi.get(`/cours/${courseId}`);
      console.log('getCourseById response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching course:', error);
      if (error.response?.status === 404) {
        throw new Error('Cours non trouvé');
      }
      throw error;
    }
  },

  /**
   * Get supports for a specific course
   * Endpoint: GET /api/cours/{courseId}/supports
   * @param {number} courseId - Course ID
   * @returns {Promise<Array>} Array of support objects
   */
  getCourseSupports: async (courseId) => {
    try {
      console.log('Fetching supports for course:', courseId);
      const response = await createurApi.get(`/cours/${courseId}/supports`);
      console.log('getCourseSupports response:', response.data);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Error fetching course supports:', error);
      console.error('Error response:', error.response);
      // Return empty array on error instead of throwing
      return [];
    }
  },

  /**
   * Create new course (JSON only, no files)
   * Endpoint: POST /api/cours/publier
   * Note: createur_id is hardcoded to 3 in backend
   * @param {Object} courseData - { titre, description }
   * @returns {Promise<Object>} Created course (valideParAdmin: null)
   */
  createCourse: async (courseData) => {
    try {
      console.log('Creating course with data:', courseData);
      console.log('API Base URL:', createurApi.defaults.baseURL);
      
      const response = await createurApi.post('/cours/publier', {
        titre: courseData.titre,
        description: courseData.description
      });
      
      console.log('createCourse response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating course:', error);
      console.error('Error response:', error.response);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      throw error;
    }
  },

  /**
   * Create course with multiple files
   * Endpoint: POST /api/cours/publier/with-files
   * Note: createur_id is hardcoded to 3 in backend
   * @param {Object} courseData - { titre, description }
   * @param {Array<File>} files - Array of File objects
   * @param {Array<string>} types - Array of 'PDF', 'VIDEO', 'IMAGE', 'DOCUMENT'
   * @param {Function} onProgress - Progress callback (0-100)
   * @returns {Promise<Object>} Created course with supports
   */
  createCourseWithFiles: async (courseData, files = [], types = [], onProgress) => {
    try {
      console.log('Creating course with files:', {
        courseData,
        filesCount: files.length,
        types
      });
      
      const formData = new FormData();
      
      formData.append('titre', courseData.titre);
      formData.append('description', courseData.description);
      
      // Append files
      files.forEach((file, index) => {
        console.log(`Appending file ${index}:`, file.name, file.type, file.size);
        formData.append('files', file);
      });
      
      // Append types
      types.forEach((type, index) => {
        console.log(`Appending type ${index}:`, type);
        formData.append('typesSupport', type);
      });

      const config = {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: onProgress ? (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentCompleted);
        } : undefined
      };

      console.log('Sending request to:', createurApi.defaults.baseURL + '/cours/publier/with-files');
      const response = await createurApi.post('/cours/publier/with-files', formData, config);
      console.log('createCourseWithFiles response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating course with files:', error);
      console.error('Error response:', error.response);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      throw error;
    }
  },

  /**
   * Update existing course (JSON only, no files)
   * Endpoint: PUT /api/cours/modifier/{id}
   * IMPORTANT: valideParAdmin will be reset to NULL
   * @param {number} courseId - Course ID
   * @param {Object} courseData - { titre, description }
   * @returns {Promise<Object>} Updated course
   */
  updateCourse: async (courseId, courseData) => {
    try {
      const response = await createurApi.put(`/cours/modifier/${courseId}`, {
        titre: courseData.titre,
        description: courseData.description
      });
      console.log('updateCourse response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating course:', error);
      throw error;
    }
  },

  /**
   * Add multiple files to existing course
   * Endpoint: PUT /api/cours/modifier/{id}/add-files
   * IMPORTANT: valideParAdmin will be reset to NULL
   * @param {number} courseId - Course ID
   * @param {Array<File>} files - Array of File objects
   * @param {Array<string>} types - Array of 'PDF', 'VIDEO', 'IMAGE', 'DOCUMENT'
   * @param {Function} onProgress - Progress callback (0-100)
   * @returns {Promise<Object>} Updated course with new supports
   */
  addFilesToCourse: async (courseId, files = [], types = [], onProgress) => {
    try {
      const formData = new FormData();
      
      files.forEach(file => {
        formData.append('files', file);
      });
      
      types.forEach(type => {
        formData.append('typesSupport', type);
      });

      const config = {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: onProgress ? (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentCompleted);
        } : undefined
      };

      const response = await createurApi.put(`/cours/modifier/${courseId}/add-files`, formData, config);
      console.log('addFilesToCourse response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error adding files to course:', error);
      throw error;
    }
  },

  // ==================== SUPPORT MANAGEMENT ====================

  /**
   * Add support material (JSON only, external link)
   * Endpoint: POST /api/cours/{coursId}/supports
   * @param {number} courseId - Course ID
   * @param {Object} supportData - { typeSupport, lienRessource }
   * @returns {Promise<Object>} Created support
   */
  addSupport: async (courseId, supportData) => {
    try {
      const response = await createurApi.post(`/cours/${courseId}/supports`, {
        typeSupport: supportData.typeSupport,
        lienRessource: supportData.lienRessource
      });
      console.log('addSupport response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error adding support:', error);
      throw error;
    }
  },

  /**
   * Upload single support file to Cloudinary
   * Endpoint: POST /api/cours/{coursId}/supports/upload
   * @param {number} courseId - Course ID
   * @param {File} file - File to upload
   * @param {string} typeSupport - 'PDF', 'VIDEO', 'IMAGE', 'DOCUMENT'
   * @param {Function} onProgress - Progress callback (0-100)
   * @returns {Promise<Object>} Created support with Cloudinary URL
   */
  uploadSupport: async (courseId, file, typeSupport, onProgress) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('typeSupport', typeSupport);

      const config = {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: onProgress ? (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentCompleted);
        } : undefined
      };

      const response = await createurApi.post(`/cours/${courseId}/supports/upload`, formData, config);
      console.log('uploadSupport response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error uploading support:', error);
      throw error;
    }
  },

  /**
   * Test file upload to Cloudinary
   * Endpoint: POST /api/cours/test-upload
   * @param {File} file - File to test upload
   * @returns {Promise<Object>} Upload test result with URL
   */
  testUpload: async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await createurApi.post('/cours/test-upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      console.log('testUpload response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error testing upload:', error);
      throw error;
    }
  },
};

export default CreateurService;
