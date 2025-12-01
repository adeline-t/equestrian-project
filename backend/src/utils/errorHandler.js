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
 * @returns {Response} JSON response with error details
 */
export function createErrorResponse(errorType, message, context, details = null) {
  const statusCode = ErrorStatusCodes[errorType] || 500;
  
  const errorResponse = {
    error: errorType,
    message: message,
    context: context,
    timestamp: new Date().toISOString(),
  };

  // Add details if provided (but don't expose sensitive info in production)
  if (details && process.env.ENVIRONMENT !== 'production') {
    errorResponse.details = details;
  }

  // Log error for monitoring
  console.error(`[${errorType}] ${context}: ${message}`, details || '');

  return jsonResponse(errorResponse, statusCode, getSecurityHeaders());
}

/**
 * Handle database errors with consistent formatting
 * @param {Error} error - Database error object
 * @param {string} context - Context where error occurred
 * @returns {Response} JSON error response
 */
export function handleDatabaseError(error, context) {
  // Check for specific database error types
  if (error.code === '23505') {
    // Unique constraint violation
    return createErrorResponse(
      ErrorTypes.VALIDATION,
      'Cette entrée existe déjà',
      context,
      { code: error.code }
    );
  }

  if (error.code === '23503') {
    // Foreign key violation
    return createErrorResponse(
      ErrorTypes.VALIDATION,
      'Référence invalide',
      context,
      { code: error.code }
    );
  }

  if (error.code === '23502') {
    // Not null violation
    return createErrorResponse(
      ErrorTypes.VALIDATION,
      'Champ requis manquant',
      context,
      { code: error.code }
    );
  }

  // Generic database error
  return createErrorResponse(
    ErrorTypes.DATABASE,
    'Erreur de base de données',
    context,
    { message: error.message }
  );
}

/**
 * Handle validation errors
 * @param {string} message - Validation error message
 * @param {string} context - Context where validation failed
 * @param {Object} details - Validation details (optional)
 * @returns {Response} JSON error response
 */
export function handleValidationError(message, context, details = null) {
  return createErrorResponse(ErrorTypes.VALIDATION, message, context, details);
}

/**
 * Handle not found errors
 * @param {string} resource - Resource that was not found
 * @param {string} context - Context where resource was requested
 * @returns {Response} JSON error response
 */
export function handleNotFoundError(resource, context) {
  return createErrorResponse(
    ErrorTypes.NOT_FOUND,
    `${resource} non trouvé`,
    context
  );
}

/**
 * Handle rate limit errors
 * @param {string} context - Context where rate limit was exceeded
 * @returns {Response} JSON error response
 */
export function handleRateLimitError(context) {
  return createErrorResponse(
    ErrorTypes.RATE_LIMIT,
    'Trop de requêtes. Veuillez réessayer plus tard.',
    context
  );
}

/**
 * Handle unexpected errors
 * @param {Error} error - Unexpected error object
 * @param {string} context - Context where error occurred
 * @returns {Response} JSON error response
 */
export function handleUnexpectedError(error, context) {
  return createErrorResponse(
    ErrorTypes.INTERNAL,
    'Une erreur inattendue s\'est produite',
    context,
    { message: error.message, stack: error.stack }
  );
}

/**
 * Wrap async handlers with error handling
 * @param {Function} handler - Async handler function
 * @param {string} context - Context for error reporting
 * @returns {Function} Wrapped handler with error handling
 */
export function withErrorHandling(handler, context) {
  return async (...args) => {
    try {
      return await handler(...args);
    } catch (error) {
      console.error(`Unhandled error in ${context}:`, error);
      return handleUnexpectedError(error, context);
    }
  };
}