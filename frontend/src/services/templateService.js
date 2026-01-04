/**
 * Template Service - Handles all template-related API operations
 */
import { api } from './apiService';

export const templateService = {
  // Basic CRUD operations
  getAll: async () => {
    const response = await api.get('/templates');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/templates/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/templates', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/templates/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/templates/${id}`);
    return response.data;
  },

  // Template-specific operations
  duplicate: async (id, newData) => {
    const response = await api.post(`/templates/${id}/duplicate`, newData);
    return response.data;
  },

  generateLessons: async (id, startDate, endDate) => {
    const response = await api.post(`/templates/${id}/generate`, {
      start_date: startDate,
      end_date: endDate
    });
    return response.data;
  },

  previewLessons: async (id, startDate, endDate) => {
    const response = await api.get(`/templates/${id}/preview`, {
      params: { start_date: startDate, end_date: endDate }
    });
    return response.data;
  },

  // Recurrence operations
  validateRecurrence: async (data) => {
    const response = await api.post('/templates/validate-recurrence', data);
    return response.data;
  },

  getNextOccurrences: async (id, count = 10) => {
    const response = await api.get(`/templates/${id}/next-occurrences`, {
      params: { count }
    });
    return response.data;
  },

  // Statistics
  getStats: async () => {
    const response = await api.get('/templates/stats');
    return response.data;
  },

  // Filtering and search
  search: async (query) => {
    const response = await api.get('/templates/search', { params: { q: query } });
    return response.data;
  },

  filterByType: async (type) => {
    const response = await api.get('/templates', { params: { type } });
    return response.data;
  },

  filterByStatus: async (status) => {
    const response = await api.get('/templates', { params: { status } });
    return response.data;
  },

  // Bulk operations
  bulkCreate: async (templates) => {
    const response = await api.post('/templates/bulk', { templates });
    return response.data;
  },

  bulkUpdate: async (templates) => {
    const response = await api.put('/templates/bulk', { templates });
    return response.data;
  },

  bulkDelete: async (ids) => {
    const response = await api.delete('/templates/bulk', { data: { ids } });
    return response.data;
  },
};

export default templateService;