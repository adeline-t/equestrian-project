/**
 * Rider Service - Handles all rider-related API operations
 */
import api from './apiService';
import { createCrudOperations } from './apiService';
import { validateRiderForm } from '../lib/helpers/domains/riders/validators';

export const riderService = {
  // Basic CRUD operations
  ...createCrudOperations('riders'),

  // Override create to add validation
  create: async (data) => {
    // Validate form data
    const validation = validateRiderForm(data);
    if (!validation.isValid) {
      throw new Error(JSON.stringify(validation.errors));
    }

    const response = await api.post('/riders', data);
    return response.data;
  },

  // Override update to add validation
  update: async (id, data) => {
    // Validate form data
    const validation = validateRiderForm(data);
    if (!validation.isValid) {
      throw new Error(JSON.stringify(validation.errors));
    }

    const response = await api.put(`/riders/${id}`, data);
    return response.data;
  },

  // Rider-specific operations
  getHorses: async (id) => {
    const response = await api.get(`/riders/${id}/horses`);
    return response.data;
  },

  getPackages: async (id) => {
    const response = await api.get(`/riders/${id}/packages`);
    return response.data;
  },

  addHorse: async (riderId, horseId) => {
    const response = await api.post(`/riders/${riderId}/horses`, { horse_id: Number(horseId) });
    return response.data;
  },

  removeHorse: async (riderId, horseId) => {
    const response = await api.delete(`/riders/${riderId}/horses/${horseId}`);
    return response.data;
  },

  // Package operations with validation
  createPackage: async (riderId, packageData) => {
    const validatedData = {
      ...packageData,
      rider_id: Number(riderId),
      private_lesson_count: Number(packageData.private_lesson_count) || 0,
      joint_lesson_count: Number(packageData.joint_lesson_count) || 0,
      activity_start_date: packageData.activity_start_date || null,
      activity_end_date: packageData.activity_end_date || null,
    };

    const response = await api.post('/packages', validatedData);
    return response.data;
  },

  updatePackage: async (id, packageData) => {
    const validatedData = {
      ...packageData,
      rider_id: Number(packageData.rider_id),
      private_lesson_count: Number(packageData.private_lesson_count) || 0,
      joint_lesson_count: Number(packageData.joint_lesson_count) || 0,
      activity_start_date: packageData.activity_start_date || null,
      activity_end_date: packageData.activity_end_date || null,
    };

    const response = await api.put(`/packages/${id}`, validatedData);
    return response.data;
  },

  deletePackage: async (id) => {
    const response = await api.delete(`/packages/${id}`);
    return response.data;
  },

  // Package status helpers
  getPackageStats: async (packageId) => {
    const pkg = await api.get(`/packages/${packageId}`);
    return {
      remainingLessons: calculateTotalRemainingLessons(pkg.data),
      progress: calculatePackageProgress(pkg.data),
    };
  },

  // Statistics
  getStats: async () => {
    const response = await api.get('/riders/stats');
    return response.data;
  },

  // Filtering and search
  search: async (query) => {
    const response = await api.get('/riders/search', { params: { q: query } });
    return response.data;
  },

  filterByActivity: async (activity) => {
    const response = await api.get('/riders', { params: { activity } });
    return response.data;
  },
};

export default riderService;
