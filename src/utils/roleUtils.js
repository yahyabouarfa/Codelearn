import { ROLES } from '../config/constants';

/**
 * Role utility functions
 */

/**
 * Check if user has specific role
 * @param {Object} user - User object
 * @param {string} role - Role to check
 * @returns {boolean}
 */
export const hasRole = (user, role) => {
  if (!user) {
    console.log('hasRole: no user');
    return false;
  }
  
  console.log('hasRole check:', { 
    userRole: user.role, 
    requiredRole: role, 
    match: user.role === role,
    userRoleType: typeof user.role,
    requiredRoleType: typeof role
  });
  
  // Check if user has a roles array
  if (user.roles) {
    if (Array.isArray(user.roles)) {
      return user.roles.includes(role);
    }
    return user.roles === role;
  }
  
  // Check single role field
  if (user.role) {
    return user.role === role;
  }
  
  return false;
};

/**
 * Check if user has any of the specified roles
 * @param {Object} user - User object
 * @param {Array} roles - Array of roles to check
 * @returns {boolean}
 */
export const hasAnyRole = (user, roles) => {
  if (!user) return false;
  return roles.some(role => hasRole(user, role));
};

/**
 * Check if user has all specified roles
 * @param {Object} user - User object
 * @param {Array} roles - Array of roles to check
 * @returns {boolean}
 */
export const hasAllRoles = (user, roles) => {
  if (!user) return false;
  return roles.every(role => hasRole(user, role));
};

/**
 * Check if user is admin
 * @param {Object} user - User object
 * @returns {boolean}
 */
export const isAdmin = (user) => {
  return hasRole(user, ROLES.ADMIN);
};

/**
 * Check if user is creator
 * @param {Object} user - User object
 * @returns {boolean}
 */
export const isCreator = (user) => {
  return hasRole(user, ROLES.CREATEUR);
};

/**
 * Check if user is learner
 * @param {Object} user - User object
 * @returns {boolean}
 */
export const isApprenant = (user) => {
  return hasRole(user, ROLES.APPRENANT);
};

/**
 * Get user's primary role
 * @param {Object} user - User object
 * @returns {string|null}
 */
export const getPrimaryRole = (user) => {
  if (!user) return null;
  
  if (Array.isArray(user.roles) && user.roles.length > 0) {
    // Priority: ADMIN > CREATEUR > APPRENANT
    if (user.roles.includes(ROLES.ADMIN)) return ROLES.ADMIN;
    if (user.roles.includes(ROLES.CREATEUR)) return ROLES.CREATEUR;
    if (user.roles.includes(ROLES.APPRENANT)) return ROLES.APPRENANT;
    return user.roles[0];
  }
  
  return user.roles || user.role || null;
};

/**
 * Get role display name
 * @param {string} role - Role constant
 * @returns {string}
 */
export const getRoleDisplayName = (role) => {
  const roleNames = {
    [ROLES.ADMIN]: 'Administrateur',
    [ROLES.CREATEUR]: 'Créateur de cours',
    [ROLES.APPRENANT]: 'Apprenant',
  };
  return roleNames[role] || role;
};

/**
 * Get default route for user role
 * @param {Object} user - User object
 * @returns {string}
 */
export const getDefaultRouteForRole = (user) => {
  if (!user) return '/login';
  
  const primaryRole = getPrimaryRole(user);
  
  switch (primaryRole) {
    case ROLES.ADMIN:
      return '/admin/courses/validation';
    case ROLES.CREATEUR:
      return '/creator/courses';
    case ROLES.APPRENANT:
      return '/apprenant/dashboard';
    default:
      return '/';
  }
};

export const roleUtils = {
  hasRole,
  hasAnyRole,
  hasAllRoles,
  isAdmin,
  isCreator,
  isApprenant,
  getPrimaryRole,
  getRoleDisplayName,
  getDefaultRouteForRole,
};

export default roleUtils;
