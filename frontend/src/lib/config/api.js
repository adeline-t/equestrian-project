/**
 * API Configuration Constants
 */

// API endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
  },
  
  // Lessons
  LESSONS: {
    LIST: '/lessons',
    CREATE: '/lessons',
    UPDATE: '/lessons/:id',
    DELETE: '/lessons/:id',
    GET: '/lessons/:id',
  },
  
  // Horses
  HORSES: {
    LIST: '/horses',
    CREATE: '/horses',
    UPDATE: '/horses/:id',
    DELETE: '/horses/:id',
    GET: '/horses/:id',
    RIDERS: '/horses/:id/riders',
  },
  
  // Riders
  RIDERS: {
    LIST: '/riders',
    CREATE: '/riders',
    UPDATE: '/riders/:id',
    DELETE: '/riders/:id',
    GET: '/riders/:id',
    HORSES: '/riders/:id/horses',
    PACKAGES: '/riders/:id/packages',
  },
  
  // Packages
  PACKAGES: {
    LIST: '/packages',
    CREATE: '/packages',
    UPDATE: '/packages/:id',
    DELETE: '/packages/:id',
    GET: '/packages/:id',
  },
  
  // Pairings
  PAIRINGS: {
    LIST: '/pairings',
    CREATE: '/pairings',
    UPDATE: '/pairings/:id',
    DELETE: '/pairings/:id',
    GET: '/pairings/:id',
  },
  
  // Templates
  TEMPLATES: {
    LIST: '/templates',
    CREATE: '/templates',
    UPDATE: '/templates/:id',
    DELETE: '/templates/:id',
    GET: '/templates/:id',
  },
};

// API settings
export const API_SETTINGS = {
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
  CACHE_DURATION: 300000, // 5 minutes
};

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