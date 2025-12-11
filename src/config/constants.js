/**
 * Application constants
 */
export const ROLES = {
  // Original role names (for backward compatibility)
  APPRENANT: 'Apprenant',
  CREATEUR: 'CreateurDeCours',
  ADMIN: 'Administrateur',
  
  // Backend API role names (port 8083)
  STUDENT: 'STUDENT',
  TEACHER: 'TEACHER',
  ADMIN_API: 'ADMIN',
};

export const COURSE_STATUS = {
  DRAFT: 'DRAFT',
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
};

export const SUPPORT_TYPES = {
  PDF: 'PDF',
  VIDEO: 'VIDEO',
};

export const PROGRAMMING_LANGUAGES = [
  { value: 'JAVA', label: 'Java' },
  { value: 'PYTHON', label: 'Python' },
  { value: 'JAVASCRIPT', label: 'JavaScript' },
  { value: 'TYPESCRIPT', label: 'TypeScript' },
  { value: 'CSHARP', label: 'C#' },
  { value: 'CPP', label: 'C++' },
  { value: 'PHP', label: 'PHP' },
  { value: 'RUBY', label: 'Ruby' },
  { value: 'GO', label: 'Go' },
  { value: 'RUST', label: 'Rust' },
  { value: 'KOTLIN', label: 'Kotlin' },
  { value: 'SWIFT', label: 'Swift' },
];

export const PAGINATION = {
  DEFAULT_PAGE: 0,
  DEFAULT_SIZE: parseInt(process.env.REACT_APP_DEFAULT_PAGE_SIZE) || 10,
  SIZE_OPTIONS: [5, 10, 20, 50],
};

export const FILE_UPLOAD = {
  MAX_SIZE_MB: 100,
  ALLOWED_VIDEO_TYPES: ['video/mp4', 'video/mpeg', 'video/quicktime'],
  ALLOWED_PDF_TYPES: ['application/pdf'],
};

export const TOAST_MESSAGES = {
  SUCCESS: {
    LOGIN: 'Connexion réussie!',
    LOGOUT: 'Déconnexion réussie!',
    REGISTER: 'Inscription réussie!',
    COURSE_CREATED: 'Cours créé avec succès!',
    COURSE_UPDATED: 'Cours mis à jour avec succès!',
    COURSE_DELETED: 'Cours supprimé avec succès!',
    MODULE_COMPLETED: 'Module complété!',
    PROFILE_UPDATED: 'Profil mis à jour!',
  },
  ERROR: {
    GENERIC: 'Une erreur est survenue. Veuillez réessayer.',
    NETWORK: 'Erreur de connexion au serveur.',
    UNAUTHORIZED: 'Session expirée. Veuillez vous reconnecter.',
    FORBIDDEN: 'Vous n\'avez pas les permissions nécessaires.',
    NOT_FOUND: 'Ressource introuvable.',
    VALIDATION: 'Veuillez vérifier les champs du formulaire.',
  },
};

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  
  // Apprenant routes - Validated courses only
  APPRENANT_DASHBOARD: '/apprenant/dashboard',
  COURSE_CATALOG: '/apprenant/courses',
  COURSE_DETAIL: '/apprenant/courses/:id',
  
  // Creator routes
  CREATOR_DASHBOARD: '/creator/dashboard',
  CREATE_COURSE: '/creator/courses/new',
  EDIT_COURSE: '/creator/courses/:id/edit',
  MY_COURSES: '/creator/courses',
  
  // Admin routes
  ADMIN_DASHBOARD: '/admin/dashboard',
  USER_MANAGEMENT: '/admin/users',
  COURSE_VALIDATION: '/admin/courses/validation',
  
  // Common routes
  PROFILE: '/profile',
  UNAUTHORIZED: '/unauthorized',
  NOT_FOUND: '/404',
};

export default {
  ROLES,
  COURSE_STATUS,
  SUPPORT_TYPES,
  PROGRAMMING_LANGUAGES,
  PAGINATION,
  FILE_UPLOAD,
  TOAST_MESSAGES,
  ROUTES,
};
