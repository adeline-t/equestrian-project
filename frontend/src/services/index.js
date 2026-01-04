/**
 * Unified Services Export
 * Clean separation: Services handle API calls, Hooks handle state management
 */

// Core API service
export { api } from './apiService';

// Domain-specific services
import horseServiceDefault from './horseService';
export const horseService = horseServiceDefault;

import riderServiceDefault from './riderService';
export const riderService = riderServiceDefault;

import lessonServiceDefault from './lessonService';
export const lessonService = lessonServiceDefault;

import packageServiceDefault from './packageService';
export const packageService = packageServiceDefault;

import pairingServiceDefault from './pairingService';
export const pairingService = pairingServiceDefault;

import templateServiceDefault from './templateService';
export const templateService = templateServiceDefault;

// Legacy exports for backward compatibility
export const ridersApi = riderServiceDefault;
export const horsesApi = horseServiceDefault;
export const pairingsApi = pairingServiceDefault;
export const packagesApi = packageServiceDefault;
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
