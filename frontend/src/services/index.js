/**
 * Services - Main Export
 */

// Core API service
export { api, createCrudOperations } from './apiService.js';

// Domain-specific services
export { default as horseService } from './horseService.js';
export { default as riderService } from './riderService.js';
export { default as lessonService } from './lessonService.js';
export { default as packageService } from './packageService.js';
export { default as pairingService } from './pairingService.js';
