/**
 * API Error Messages and Status Codes
 */

// HTTP status codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};

// Error messages
export const ERROR_MESSAGES = {
  NETWORK: 'Erreur de connexion. Veuillez vérifier votre internet.',
  TIMEOUT: 'La demande a expiré. Veuillez réessayer.',
  UNAUTHORIZED: 'Vous devez vous connecter pour accéder à cette ressource.',
  FORBIDDEN: 'Vous n\'avez pas les permissions pour accéder à cette ressource.',
  NOT_FOUND: 'La ressource demandée n\'existe pas.',
  SERVER_ERROR: 'Une erreur serveur est survenue. Veuillez réessayer plus tard.',
  UNKNOWN: 'Une erreur inconnue est survenue.',
};

/**
 * Get error message for HTTP status code
 * @param {number} statusCode - HTTP status code
 * @returns {string} Error message
 */
export const getErrorMessage = (statusCode) => {
  const messageMap = {
    [HTTP_STATUS.BAD_REQUEST]: ERROR_MESSAGES.UNKNOWN,
    [HTTP_STATUS.UNAUTHORIZED]: ERROR_MESSAGES.UNAUTHORIZED,
    [HTTP_STATUS.FORBIDDEN]: ERROR_MESSAGES.FORBIDDEN,
    [HTTP_STATUS.NOT_FOUND]: ERROR_MESSAGES.NOT_FOUND,
    [HTTP_STATUS.CONFLICT]: ERROR_MESSAGES.UNKNOWN,
    [HTTP_STATUS.INTERNAL_SERVER_ERROR]: ERROR_MESSAGES.SERVER_ERROR,
  };
  return messageMap[statusCode] || ERROR_MESSAGES.UNKNOWN;
};