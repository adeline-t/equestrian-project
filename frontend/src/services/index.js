/**
 * Services - Main Export
 */

// Core API service
export { default as api, createCrudOperations } from './apiService';

// Domain-specific services
export { horseService } from './horseService';
export { riderService } from './riderService';
export { lessonService } from './lessonService';
export { packageService } from './packageService';
export { pairingService } from './pairingService';
export { templateService } from './templateService';

// Calendar API (specialized)
export { templatesApi, lessonsApi, scheduleApi, generationApi } from './calendarApi';

// Legacy exports for backward compatibility
export { horseService as horsesApi } from './horseService';
export { riderService as ridersApi } from './riderService';
export { packageService as packagesApi } from './packageService';
export { pairingService as pairingsApi } from './pairingService';

// Utility API
export const utilityApi = {
  health: async () => {
    const { default: api } = await import('./apiService');
    return api.get('/health');
  },
};
