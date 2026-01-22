/**
 * API - Consolidated configuration
 * Endpoints, errors, settings and helpers
 */

/* Error codes and messages */
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

export const ERROR_MESSAGES = {
  NETWORK: 'Erreur de connexion. Veuillez vérifier votre internet.',
  TIMEOUT: 'La demande a expiré. Veuillez réessayer.',
  UNAUTHORIZED: 'Vous devez vous connecter pour accéder à cette ressource.',
  FORBIDDEN: "Vous n'avez pas les permissions pour accéder à cette ressource.",
  NOT_FOUND: "La ressource demandée n'existe pas.",
  SERVER_ERROR: 'Une erreur serveur est survenue. Veuillez réessayer plus tard.',
  UNKNOWN: 'Une erreur inconnue est survenue.',
};

/* API settings */
export const API_SETTINGS = {
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
  CACHE_DURATION: 300000,
};
