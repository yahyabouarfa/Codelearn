/**
 * Centralized error handling for API calls
 */
export const handleApiError = (error, customMessage = null) => {
  console.error('API Error:', error);

  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    
    return {
      status,
      message: customMessage || data?.message || 'Une erreur est survenue',
      errors: data?.errors || null,
      data: data,
    };
  } else if (error.request) {
    // Request made but no response received
    return {
      status: 0,
      message: customMessage || 'Impossible de contacter le serveur',
      errors: null,
      data: null,
    };
  } else {
    // Something else happened
    return {
      status: -1,
      message: customMessage || error.message || 'Une erreur inconnue est survenue',
      errors: null,
      data: null,
    };
  }
};

/**
 * Extract error message from API error
 */
export const getErrorMessage = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return 'Une erreur est survenue';
};

/**
 * Check if error is network error
 */
export const isNetworkError = (error) => {
  return !error.response && error.request;
};

/**
 * Check if error is authentication error
 */
export const isAuthError = (error) => {
  return error.response?.status === 401;
};

/**
 * Check if error is authorization error
 */
export const isAuthorizationError = (error) => {
  return error.response?.status === 403;
};

/**
 * Check if error is validation error
 */
export const isValidationError = (error) => {
  return error.response?.status === 400 || error.response?.status === 422;
};

export default {
  handleApiError,
  getErrorMessage,
  isNetworkError,
  isAuthError,
  isAuthorizationError,
  isValidationError,
};
