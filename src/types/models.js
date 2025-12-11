/**
 * Type Definitions for CodeLearn API
 * 
 * These types represent the data models used in the application.
 * Can be converted to TypeScript interfaces if needed.
 */

/**
 * Course Model
 * @typedef {Object} Course
 * @property {number} id - Unique identifier
 * @property {string} titre - Course title
 * @property {string} description - Course description
 * @property {string} [createurNom] - Creator's name
 * @property {number} [createurId] - Creator's ID
 * @property {Module[]} modules - Array of course modules
 * @property {Support[]} supports - Array of pedagogical supports
 * @property {string} [status] - Course status (EN_ATTENTE, VALIDE, REJETE)
 * @property {string} [createdAt] - Creation date (ISO string)
 * @property {string} [updatedAt] - Last update date (ISO string)
 */

/**
 * Module Model
 * @typedef {Object} Module
 * @property {number} id - Unique identifier (equals supportpedagogique.id in backend)
 * @property {string} titre - Module title
 * @property {string} [description] - Module description
 * @property {number} ordre - Module order/sequence number
 * @property {boolean} completed - Whether the user has completed this module
 * @property {string} [completedAt] - Completion date (ISO string)
 */

/**
 * Support (Resource) Model
 * @typedef {Object} Support
 * @property {number} id - Unique identifier
 * @property {string} nom - Support name
 * @property {string} type - Support type (PDF, VIDEO, DOCUMENT, etc.)
 * @property {string} [description] - Support description
 * @property {string} urlStockage - Storage URL for the support file
 */

/**
 * User Model
 * @typedef {Object} User
 * @property {number} id - Unique identifier
 * @property {string} email - User email
 * @property {string} nom - Last name
 * @property {string} prenom - First name
 * @property {string} role - User role (Apprenant, CreateurDeCours, Administrateur)
 * @property {string} [createdAt] - Registration date (ISO string)
 */

/**
 * Paginated Response Model
 * @typedef {Object} PageResponse
 * @property {Array} content - Array of items for current page
 * @property {number} totalPages - Total number of pages
 * @property {number} totalElements - Total number of items
 * @property {number} number - Current page number (0-indexed)
 * @property {number} size - Page size
 * @property {boolean} first - Whether this is the first page
 * @property {boolean} last - Whether this is the last page
 */

/**
 * Support Access Response Model
 * @typedef {Object} SupportAccessResponse
 * @property {string} temporaryUrl - Temporary URL to access the support (expires in 30 minutes)
 * @property {string} expiresAt - Expiration timestamp (ISO string)
 */

/**
 * Module Completion Response Model
 * @typedef {Object} ModuleCompletionResponse
 * @property {boolean} success - Whether the completion was successful
 * @property {string} completedAt - Completion timestamp (ISO string)
 * @property {string} message - Success message
 */

/**
 * API Error Response Model
 * @typedef {Object} ApiError
 * @property {string} message - Error message
 * @property {number} status - HTTP status code
 * @property {string} [error] - Error type
 * @property {string} [path] - Request path
 * @property {string} timestamp - Error timestamp (ISO string)
 */

// Export empty object to make this a module
export {};
