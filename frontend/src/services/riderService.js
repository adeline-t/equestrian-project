/**
 * Rider Service - Handles all rider-related API operations
 */
import { api } from './apiService';

export const riderService = {
  // Basic CRUD operations
  getAll: async () => {
    const response = await api.get('/riders');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/riders/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/riders', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/riders/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/riders/${id}`);
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
    const response = await api.post(`/riders/${riderId}/horses`, { horse_id: horseId });
    return response.data;
  },

  removeHorse: async (riderId, horseId) => {
    const response = await api.delete(`/riders/${riderId}/horses/${horseId}`);
    return response.data;
  },

  // Package operations
  createPackage: async (riderId, packageData) => {
    const validatedData = {
      ...packageData,
      rider_id: Number(riderId),
      private_lesson_count: Number(packageData.private_lesson_count) || 0,
      joint_lesson_count: Number(packageData.joint_lesson_count) || 0,
    };

    const response = await api.post('/packages', validatedData);
    return response.data;
  },

  updatePackage: async (id, packageData) => {
    const validatedData = {
      ...packageData,
      private_lesson_count: Number(packageData.private_lesson_count) || 0,
      joint_lesson_count: Number(packageData.joint_lesson_count) || 0,
    };

    const response = await api.put(`/packages/${id}`, validatedData);
    return response.data;
  },

  deletePackage: async (id) => {
    const response = await api.delete(`/packages/${id}`);
    return response.data;
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