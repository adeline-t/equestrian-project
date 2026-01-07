/**
 * API Configuration - Main Export
 */

export * from './endpoints';
export * from './errors';
export * from './settings';

// Re-export original API_ENDPOINTS for backward compatibility
export { API_ENDPOINTS } from './endpoints';
export { HTTP_STATUS, ERROR_MESSAGES, getErrorMessage } from './errors';
export { API_SETTINGS, getApiSetting } from './settings';