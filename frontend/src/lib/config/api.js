/**
 * API - Consolidated configuration
 * Endpoints, errors, settings and helpers
 */

export const AUTH = {
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  REFRESH: '/auth/refresh',
};

export const SLOTS = {
  LIST: '/planning_slots',
  CREATE: '/planning_slots',
  UPDATE: '/planning_slots/:id',
  DELETE: '/planning_slots/:id',
  GET: '/planning_slots/:id',
};

export const EVENTS = {
  LIST: '/events',
  CREATE: '/events',
  UPDATE: '/events/:id',
  DELETE: '/events/:id',
  GET: '/events/:id',
  PARTICIPANTS: '/events/:id/participants',
  ADD_PARTICIPANT: '/events/:id/participants',
  REMOVE_PARTICIPANT: '/events/:id/participants/:participantId',
};

export const HORSES = {
  LIST: '/horses',
  CREATE: '/horses',
  UPDATE: '/horses/:id',
  DELETE: '/horses/:id',
  GET: '/horses/:id',
  RIDERS: '/horses/:id/riders',
};

export const RIDERS = {
  LIST: '/riders',
  CREATE: '/riders',
  UPDATE: '/riders/:id',
  DELETE: '/riders/:id',
  GET: '/riders/:id',
  HORSES: '/riders/:id/horses',
  PACKAGES: '/riders/:id/packages',
};

export const PACKAGES = {
  LIST: '/packages',
  CREATE: '/packages',
  UPDATE: '/packages/:id',
  DELETE: '/packages/:id',
  GET: '/packages/:id',
};

export const PAIRINGS = {
  LIST: '/pairings',
  CREATE: '/pairings',
  UPDATE: '/pairings/:id',
  DELETE: '/pairings/:id',
  GET: '/pairings/:id',
};

export const API_ENDPOINTS = {
  AUTH,
  SLOTS,
  EVENTS,
  HORSES,
  RIDERS,
  PACKAGES,
  PAIRINGS,
};

/* Utilities */
export const buildEndpoint = (endpoint, params = {}) => {
  let url = endpoint;
  Object.keys(params).forEach((key) => {
    url = url.replace(`:${key}`, params[key]);
  });
  return url;
};

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

/* API settings */
export const API_SETTINGS = {
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
  CACHE_DURATION: 300000,
};

export const getApiSetting = (key, defaultValue = null) => API_SETTINGS[key] ?? defaultValue;
