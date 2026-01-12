/**
 * Horse Service - Handles all horse-related API operations
 */
import api from './apiService';
import { createCrudOperations } from './apiService';
import { validateHorseForm } from '../lib/helpers/domains/horses/validators';

export const horseService = {
  // Basic CRUD operations
  ...createCrudOperations('horses'),

  /**
   * Create horse with validation
   */
  create: async (data) => {
    const validation = validateHorseForm(data);
    if (!validation.isValid) {
      throw new Error(JSON.stringify(validation.errors));
    }

    const validatedData = {
      ...data,
    };

    const response = await api.post('/horses', validatedData);
    return response.data;
  },

  /**
   * Update horse with validation
   */
  update: async (id, data) => {
    const validation = validateHorseForm(data);
    if (!validation.isValid) {
      throw new Error(JSON.stringify(validation.errors));
    }

    const validatedData = {
      ...data,
    };

    const response = await api.put(`/horses/${id}`, validatedData);
    return response.data;
  },

  /**
   * Horse-specific operations
   */
  getRiders: async (id) => {
    const response = await api.get(`/horses/${id}/riders`);
    return response.data;
  },

  addRider: async (horseId, riderId) => {
    const response = await api.post(`/horses/${horseId}/riders`, {
      rider_id: Number(riderId),
    });
    return response.data;
  },

  removeRider: async (horseId, riderId) => {
    const response = await api.delete(`/horses/${horseId}/riders/${riderId}`);
    return response.data;
  },

  /**
   * Bulk operations
   */
  bulkUpdate: async (horses) => {
    const response = await api.put('/horses/bulk', { horses });
    return response.data;
  },

  /**
   * Statistics
   */
  getStats: async () => {
    const response = await api.get('/horses/stats');
    return response.data;
  },

  /**
   * Filtering and search
   */
  search: async (query) => {
    const response = await api.get('/horses/search', { params: { q: query } });
    return response.data;
  },

  filterByStatus: async (status) => {
    const response = await api.get('/horses', { params: { status } });
    return response.data;
  },
};

export default horseService;
