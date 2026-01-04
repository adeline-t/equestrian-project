/**
 * Horse Service - Handles all horse-related API operations
 */
import { api } from './apiService';

export const horseService = {
  // Basic CRUD operations
  getAll: async () => {
    const response = await api.get('/horses');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/horses/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/horses', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/horses/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/horses/${id}`);
    return response.data;
  },

  // Horse-specific operations
  getRiders: async (id) => {
    const response = await api.get(`/horses/${id}/riders`);
    return response.data;
  },

  addRider: async (horseId, riderId) => {
    const response = await api.post(`/horses/${horseId}/riders`, { rider_id: riderId });
    return response.data;
  },

  removeRider: async (horseId, riderId) => {
    const response = await api.delete(`/horses/${horseId}/riders/${riderId}`);
    return response.data;
  },

  // Bulk operations
  bulkUpdate: async (horses) => {
    const response = await api.put('/horses/bulk', { horses });
    return response.data;
  },

  // Statistics
  getStats: async () => {
    const response = await api.get('/horses/stats');
    return response.data;
  },

  // Filtering and search
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