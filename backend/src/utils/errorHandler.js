/**
 * Standardized Error Handler
 * Provides consistent error responses across all API endpoints
 */

import { jsonResponse, getSecurityHeaders } from '../db.js';

/**
 * Error types for consistent error handling
 */
export const ErrorTypes = {
  VALIDATION: 'Validation Error',
  NOT_FOUND: 'Not Found',
  DATABASE: 'Database Error',
  AUTHENTICATION: 'Authentication Error',
  AUTHORIZATION: 'Authorization Error',
  RATE_LIMIT: 'Rate Limit Exceeded',
  INTERNAL: 'Internal Server Error',
};

/**
 * HTTP status codes for different error types
 */
const ErrorStatusCodes = {
  [ErrorTypes.VALIDATION]: 400,
  [ErrorTypes.NOT_FOUND]: 404,
  [ErrorTypes.DATABASE]: 500,
  [ErrorTypes.AUTHENTICATION]: 401,
  [ErrorTypes.AUTHORIZATION]: 403,
  [ErrorTypes.RATE_LIMIT]: 429,
  [ErrorTypes.INTERNAL]: 500,
};

/**
 * Create a standardized error response
 * @param {string} errorType - Type of error from ErrorTypes
 * @param {string} message - Detailed error message
 * @param {string} context - Context where error occurred (e.g., 'riders.create')
 * @param {Object} details - Additional error details (optional)
 * @param {Object} env - Environment object (Cloudflare Workers)
 * @returns {Response} JSON response with error details
 */
export function createErrorResponse(errorType, message, context, details = null, env = {}) {
  const statusCode = ErrorStatusCodes[errorType] || 500;

  const errorResponse = {
    error: errorType,
    message,
    context,
    timestamp: new Date().toISOString(),
  };

  // Include extra details only if not production
  if (details && env.ENVIRONMENT !== 'production') {
    errorResponse.details = details;
  }

  console.error(`[${errorType}] ${context}: ${message}`, details || '');

  return jsonResponse(errorResponse, statusCode, getSecurityHeaders());
}

/**
 * Handle database errors with consistent formatting
 * @param {Error} error - Database error object
 * @param {string} context - Context where error occurred
 * @param {Object} env - Environment object
 * @returns {Response} JSON error response
 */
export function handleDatabaseError(error, context, env = {}) {
  // Check for specific database error types
  if (error.code === '23505') {
    return createErrorResponse(
      ErrorTypes.VALIDATION,
      'Cette entrée existe déjà',
      context,
      { code: error.code },
      env
    );
  }
  if (error.code === '23503') {
    return createErrorResponse(
      ErrorTypes.VALIDATION,
      'Référence invalide',
      context,
      { code: error.code },
      env
    );
  }
  if (error.code === '23502') {
    return createErrorResponse(
      ErrorTypes.VALIDATION,
      'Champ requis manquant',
      context,
      { code: error.code },
      env
    );
  }

  // Generic database error
  return createErrorResponse(
    ErrorTypes.DATABASE,
    'Erreur de base de données',
    context,
    { message: error.message },
    env
  );
}

/**
 * Handle validation errors
 * @param {string} message
 * @param {string} context
 * @param {Object} env
 * @param {Object} details
 */
export function handleValidationError(message, context, details = null, env = {}) {
  return createErrorResponse(ErrorTypes.VALIDATION, message, context, details, env);
}

/**
 * Handle not found errors
 * @param {string} resource
 * @param {string} context
 * @param {Object} env
 */
export function handleNotFoundError(resource, context, env = {}) {
  return createErrorResponse(ErrorTypes.NOT_FOUND, `${resource} non trouvé`, context, null, env);
}

/**
 * Handle rate limit errors
 * @param {string} context
 * @param {Object} env
 */
export function handleRateLimitError(context, env = {}) {
  return createErrorResponse(
    ErrorTypes.RATE_LIMIT,
    'Trop de requêtes. Veuillez réessayer plus tard.',
    context,
    null,
    env
  );
}

/**
 * Handle unexpected errors
 * @param {Error} error
 * @param {string} context
 * @param {Object} env
 */
export function handleUnexpectedError(error, context, env = {}) {
  return createErrorResponse(
    ErrorTypes.INTERNAL,
    "Une erreur inattendue s'est produite",
    context,
    { message: error.message, stack: error.stack },
    env
  );
}

/**
 * Wrap async handlers with error handling
 * @param {Function} handler
 * @param {string} context
 * @param {Object} env
 */
export function withErrorHandling(handler, context, env = {}) {
  return async (...args) => {
    try {
      return await handler(...args, env);
    } catch (error) {
      console.error(`Unhandled error in ${context}:`, error);
      return handleUnexpectedError(error, context, env);
    }
  };
}
