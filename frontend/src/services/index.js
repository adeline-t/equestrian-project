/**
 * Unified Services Export
 * Clean separation: Services handle API calls, Hooks handle state management
 */

// Core API service
export { api } from './apiService';

// Domain-specific services
export { default as horseService } from './horseService';
export { default as riderService } from './riderService';
export { default as lessonService } from './lessonService';
export { default as packageService } from './packageService';
export { default as pairingService } from './pairingService';
export { default as templateService } from './templateService';

// Legacy exports for backward compatibility
export const ridersApi = riderService;
export const horsesApi = horseService;
export const pairingsApi = pairingService;
export const packagesApi = packageService;
export const utilityApi = {
  health: async () => {
    const { api } = await import('./apiService');
    const response = await api.get('/health');
    return response.data;
  },
  docs: async () => {
    const { api } = await import('./apiService');
    const response = await api.get('/docs');
    return response.data;
  },
};