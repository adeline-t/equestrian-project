/**
 * API Endpoints Configuration
 */

// Authentication endpoints
export const AUTH = {
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  REFRESH: '/auth/refresh',
};

// Lessons endpoints
export const LESSONS = {
  LIST: '/lessons',
  CREATE: '/lessons',
  UPDATE: '/lessons/:id',
  DELETE: '/lessons/:id',
  GET: '/lessons/:id',
};

// Horses endpoints
export const HORSES = {
  LIST: '/horses',
  CREATE: '/horses',
  UPDATE: '/horses/:id',
  DELETE: '/horses/:id',
  GET: '/horses/:id',
  RIDERS: '/horses/:id/riders',
};

// Riders endpoints
export const RIDERS = {
  LIST: '/riders',
  CREATE: '/riders',
  UPDATE: '/riders/:id',
  DELETE: '/riders/:id',
  GET: '/riders/:id',
  HORSES: '/riders/:id/horses',
  PACKAGES: '/riders/:id/packages',
};

// Packages endpoints
export const PACKAGES = {
  LIST: '/packages',
  CREATE: '/packages',
  UPDATE: '/packages/:id',
  DELETE: '/packages/:id',
  GET: '/packages/:id',
};

// Pairings endpoints
export const PAIRINGS = {
  LIST: '/pairings',
  CREATE: '/pairings',
  UPDATE: '/pairings/:id',
  DELETE: '/pairings/:id',
  GET: '/pairings/:id',
};

// Templates endpoints
export const TEMPLATES = {
  LIST: '/templates',
  CREATE: '/templates',
  UPDATE: '/templates/:id',
  DELETE: '/templates/:id',
  GET: '/templates/:id',
};

// All endpoints combined
export const API_ENDPOINTS = {
  AUTH,
  LESSONS,
  HORSES,
  RIDERS,
  PACKAGES,
  PAIRINGS,
  TEMPLATES,
};

/**
 * Build endpoint URL with parameters
 * @param {string} endpoint - Endpoint template
 * @param {Object} params - Parameters to replace
 * @returns {string} Formatted endpoint URL
 */
export const buildEndpoint = (endpoint, params = {}) => {
  let url = endpoint;
  Object.keys(params).forEach((key) => {
    url = url.replace(`:${key}`, params[key]);
  });
  return url;
};