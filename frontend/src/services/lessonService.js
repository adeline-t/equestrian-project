/**
 * Lesson Service - Handles all lesson-related API operations
 */
import { api } from './apiService';

export const lessonService = {
  // Basic CRUD operations
  getAll: async (params = {}) => {
    const response = await api.get('/lessons', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/lessons/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/lessons', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/lessons/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/lessons/${id}`);
    return response.data;
  },

  // Lesson-specific operations
  getParticipants: async (id) => {
    const response = await api.get(`/lessons/${id}/participants`);
    return response.data;
  },

  addParticipant: async (lessonId, participantData) => {
    const response = await api.post(`/lessons/${lessonId}/participants`, participantData);
    return response.data;
  },

  removeParticipant: async (lessonId, participantId) => {
    const response = await api.delete(`/lessons/${lessonId}/participants/${participantId}`);
    return response.data;
  },

  // Calendar operations
  getByDateRange: async (startDate, endDate) => {
    const response = await api.get('/lessons/calendar', {
      params: { start_date: startDate, end_date: endDate }
    });
    return response.data;
  },

  getByWeek: async (year, week) => {
    const response = await api.get('/lessons/week', {
      params: { year, week }
    });
    return response.data;
  },

  // Statistics
  getStats: async (params = {}) => {
    const response = await api.get('/lessons/stats', { params });
    return response.data;
  },

  // Blocking operations
  blockTimeSlot: async (data) => {
    const response = await api.post('/lessons/block', data);
    return response.data;
  },

  unblockTimeSlot: async (id) => {
    const response = await api.delete(`/lessons/block/${id}`);
    return response.data;
  },

  // Bulk operations
  bulkCreate: async (lessons) => {
    const response = await api.post('/lessons/bulk', { lessons });
    return response.data;
  },

  bulkUpdate: async (lessons) => {
    const response = await api.put('/lessons/bulk', { lessons });
    return response.data;
  },

  // Filtering and search
  search: async (query) => {
    const response = await api.get('/lessons/search', { params: { q: query } });
    return response.data;
  },

  filterByType: async (type) => {
    const response = await api.get('/lessons', { params: { type } });
    return response.data;
  },

  filterByStatus: async (status) => {
    const response = await api.get('/lessons', { params: { status } });
    return response.data;
  },
};

export default lessonService;