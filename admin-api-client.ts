/**
 * Learning Platform Admin API Client
 *
 * A TypeScript/JavaScript SDK for interacting with the Learning Platform Admin Backend.
 *
 * @example
 * ```typescript
 * import AdminAPI from './admin-api-client';
 *
 * const api = new AdminAPI('http://localhost:8080/api/admin');
 *
 * // Get all users
 * const users = await api.users.getAll();
 *
 * // Approve a course
 * await api.courses.approve(1);
 * ```
 */

// ============================================================
// TYPE DEFINITIONS
// ============================================================

export interface Utilisateur {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  motDePasse?: string;
  role: string;
  actif: boolean;
}

export interface Cours {
  id: number;
  titre: string;
  description: string;
  createur: Utilisateur;
  valideParAdmin: boolean | null;
}

export interface DatabaseTestResponse {
  status: 'SUCCESS' | 'ERROR';
  connected: boolean;
  databaseProductName?: string;
  databaseProductVersion?: string;
  driverName?: string;
  driverVersion?: string;
  url?: string;
  username?: string;
  error?: string;
  errorType?: string;
}

export interface APIConfig {
  baseURL?: string;
  timeout?: number;
  headers?: Record<string, string>;
  onError?: (error: Error) => void;
}

// ============================================================
// API CLIENT
// ============================================================

export default class AdminAPI {
  private baseURL: string;
  private timeout: number;
  private defaultHeaders: Record<string, string>;
  private onError?: (error: Error) => void;

  constructor(config: string | APIConfig = {}) {
    if (typeof config === 'string') {
      this.baseURL = config;
      this.timeout = 10000;
      this.defaultHeaders = { 'Content-Type': 'application/json' };
    } else {
      this.baseURL = config.baseURL || 'http://localhost:8080/api/admin';
      this.timeout = config.timeout || 10000;
      this.defaultHeaders = config.headers || { 'Content-Type': 'application/json' };
      this.onError = config.onError;
    }
  }

  /**
   * Make an HTTP request to the API
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.defaultHeaders,
          ...options.headers,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // Handle empty responses (204 No Content)
      if (response.status === 204) {
        return null as T;
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);

      const apiError = error instanceof Error ? error : new Error('Unknown error');

      if (this.onError) {
        this.onError(apiError);
      }

      throw apiError;
    }
  }

  // ============================================================
  // DATABASE METHODS
  // ============================================================

  public database = {
    /**
     * Test database connection
     * @returns Database connection information
     */
    test: async (): Promise<DatabaseTestResponse> => {
      return this.request<DatabaseTestResponse>('/db-test');
    },
  };

  // ============================================================
  // USER METHODS
  // ============================================================

  public users = {
    /**
     * Get all users
     * @returns Array of users
     */
    getAll: async (): Promise<Utilisateur[]> => {
      return this.request<Utilisateur[]>('/users');
    },

    /**
     * Get a user by ID
     * @param userId - User ID
     * @returns User object or null if not found
     */
    getById: async (userId: number): Promise<Utilisateur | null> => {
      try {
        const users = await this.users.getAll();
        return users.find(u => u.id === userId) || null;
      } catch {
        return null;
      }
    },

    /**
     * Deactivate a user
     * @param userId - User ID
     * @returns Updated user object
     */
    deactivate: async (userId: number): Promise<Utilisateur> => {
      return this.request<Utilisateur>(`/users/${userId}/deactivate`, {
        method: 'PUT',
      });
    },

    /**
     * Get active users only
     * @returns Array of active users
     */
    getActive: async (): Promise<Utilisateur[]> => {
      const users = await this.users.getAll();
      return users.filter(u => u.actif);
    },

    /**
     * Get inactive users only
     * @returns Array of inactive users
     */
    getInactive: async (): Promise<Utilisateur[]> => {
      const users = await this.users.getAll();
      return users.filter(u => !u.actif);
    },

    /**
     * Get users by role
     * @param role - User role (e.g., 'STUDENT', 'TEACHER', 'ADMIN')
     * @returns Array of users with the specified role
     */
    getByRole: async (role: string): Promise<Utilisateur[]> => {
      const users = await this.users.getAll();
      return users.filter(u => u.role === role);
    },
  };

  // ============================================================
  // COURSE METHODS
  // ============================================================

  public courses = {
    /**
     * Get all courses
     * @returns Array of courses
     */
    getAll: async (): Promise<Cours[]> => {
      return this.request<Cours[]>('/cours');
    },

    /**
     * Get pending courses (awaiting validation)
     * @returns Array of pending courses
     */
    getPending: async (): Promise<Cours[]> => {
      return this.request<Cours[]>('/cours/pending');
    },

    /**
     * Get approved courses
     * @returns Array of approved courses
     */
    getApproved: async (): Promise<Cours[]> => {
      return this.request<Cours[]>('/cours/approved');
    },

    /**
     * Get rejected courses
     * @returns Array of rejected courses
     */
    getRejected: async (): Promise<Cours[]> => {
      return this.request<Cours[]>('/cours/rejected');
    },

    /**
     * Approve a course
     * @param courseId - Course ID
     * @returns Updated course object
     */
    approve: async (courseId: number): Promise<Cours> => {
      return this.request<Cours>(`/cours/${courseId}/approve`, {
        method: 'POST',
      });
    },

    /**
     * Reject a course
     * @param courseId - Course ID
     * @returns Updated course object
     */
    reject: async (courseId: number): Promise<Cours> => {
      return this.request<Cours>(`/cours/${courseId}/reject`, {
        method: 'POST',
      });
    },

    /**
     * Get course by ID
     * @param courseId - Course ID
     * @returns Course object or null if not found
     */
    getById: async (courseId: number): Promise<Cours | null> => {
      try {
        const courses = await this.courses.getAll();
        return courses.find(c => c.id === courseId) || null;
      } catch {
        return null;
      }
    },

    /**
     * Get courses by creator ID
     * @param creatorId - Creator user ID
     * @returns Array of courses created by the specified user
     */
    getByCreator: async (creatorId: number): Promise<Cours[]> => {
      const courses = await this.courses.getAll();
      return courses.filter(c => c.createur?.id === creatorId);
    },

    /**
     * Search courses by title
     * @param query - Search query
     * @returns Array of matching courses
     */
    search: async (query: string): Promise<Cours[]> => {
      const courses = await this.courses.getAll();
      const lowerQuery = query.toLowerCase();
      return courses.filter(c =>
        c.titre.toLowerCase().includes(lowerQuery) ||
        c.description.toLowerCase().includes(lowerQuery)
      );
    },
  };

  // ============================================================
  // UTILITY METHODS
  // ============================================================

  /**
   * Get dashboard statistics
   * @returns Dashboard statistics
   */
  public async getStatistics() {
    const [users, courses, pending] = await Promise.all([
      this.users.getAll(),
      this.courses.getAll(),
      this.courses.getPending(),
    ]);

    return {
      users: {
        total: users.length,
        active: users.filter(u => u.actif).length,
        inactive: users.filter(u => !u.actif).length,
        byRole: {
          students: users.filter(u => u.role === 'STUDENT').length,
          teachers: users.filter(u => u.role === 'TEACHER').length,
          admins: users.filter(u => u.role === 'ADMIN').length,
        },
      },
      courses: {
        total: courses.length,
        pending: pending.length,
        approved: courses.filter(c => c.valideParAdmin === true).length,
        rejected: courses.filter(c => c.valideParAdmin === false).length,
      },
    };
  }

  /**
   * Batch approve courses
   * @param courseIds - Array of course IDs
   * @returns Array of updated courses
   */
  public async batchApproveCourses(courseIds: number[]): Promise<Cours[]> {
    const results = await Promise.all(
      courseIds.map(id => this.courses.approve(id))
    );
    return results;
  }

  /**
   * Batch reject courses
   * @param courseIds - Array of course IDs
   * @returns Array of updated courses
   */
  public async batchRejectCourses(courseIds: number[]): Promise<Cours[]> {
    const results = await Promise.all(
      courseIds.map(id => this.courses.reject(id))
    );
    return results;
  }

  /**
   * Check if API is reachable
   * @returns True if API is reachable, false otherwise
   */
  public async isHealthy(): Promise<boolean> {
    try {
      const response = await this.database.test();
      return response.status === 'SUCCESS';
    } catch {
      return false;
    }
  }
}

// ============================================================
// FACTORY FUNCTIONS
// ============================================================

/**
 * Create an API client instance
 * @param config - API configuration
 * @returns AdminAPI instance
 */
export function createAdminAPI(config?: string | APIConfig): AdminAPI {
  return new AdminAPI(config);
}

// ============================================================
// USAGE EXAMPLES
// ============================================================

/*

// Example 1: Basic Usage
import AdminAPI from './admin-api-client';

const api = new AdminAPI('http://localhost:8080/api/admin');

// Get all users
const users = await api.users.getAll();
console.log(users);

// Get pending courses
const pendingCourses = await api.courses.getPending();

// Approve a course
await api.courses.approve(1);

// Deactivate a user
await api.users.deactivate(5);


// Example 2: With Configuration
import { createAdminAPI } from './admin-api-client';

const api = createAdminAPI({
  baseURL: 'http://localhost:8080/api/admin',
  timeout: 15000,
  onError: (error) => {
    console.error('API Error:', error.message);
    alert('An error occurred. Please try again.');
  }
});

const stats = await api.getStatistics();
console.log('Dashboard stats:', stats);


// Example 3: React Hook
import { useState, useEffect } from 'react';
import AdminAPI from './admin-api-client';

const api = new AdminAPI();

function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.users.getAll()
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { users, loading, error };
}


// Example 4: Vue Composable
import { ref, onMounted } from 'vue';
import AdminAPI from './admin-api-client';

const api = new AdminAPI();

export function usePendingCourses() {
  const courses = ref([]);
  const loading = ref(true);

  const loadCourses = async () => {
    loading.value = true;
    courses.value = await api.courses.getPending();
    loading.value = false;
  };

  const approveCourse = async (id) => {
    await api.courses.approve(id);
    await loadCourses();
  };

  onMounted(loadCourses);

  return { courses, loading, approveCourse };
}


// Example 5: Error Handling
const api = new AdminAPI({
  baseURL: 'http://localhost:8080/api/admin',
  onError: (error) => {
    if (error.message.includes('Failed to fetch')) {
      console.error('Backend server is not running');
    } else if (error.message.includes('404')) {
      console.error('Resource not found');
    } else {
      console.error('API error:', error);
    }
  }
});

try {
  const users = await api.users.getAll();
} catch (error) {
  // Error already handled by onError callback
}


// Example 6: Batch Operations
const api = new AdminAPI();

// Approve multiple courses at once
const courseIds = [1, 2, 3, 4, 5];
const approvedCourses = await api.batchApproveCourses(courseIds);
console.log(`Approved ${approvedCourses.length} courses`);


// Example 7: Search and Filter
const api = new AdminAPI();

// Search courses
const searchResults = await api.courses.search('javascript');

// Get users by role
const teachers = await api.users.getByRole('TEACHER');

// Get courses by creator
const teacherCourses = await api.courses.getByCreator(2);


// Example 8: Dashboard Statistics
const api = new AdminAPI();

const stats = await api.getStatistics();
console.log('Total users:', stats.users.total);
console.log('Active users:', stats.users.active);
console.log('Pending courses:', stats.courses.pending);
console.log('Teachers:', stats.users.byRole.teachers);

*/

