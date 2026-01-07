/**
 * Template Service - Handles all template-related API operations
 */
import api from './apiService';
import { createCrudOperations } from './apiService';
import { LESSON_TYPES } from '../lib/domains/lessons/types';
import { RECURRENCE_FREQUENCIES } from '../lib/domains/templates/recurrence';

export const templateService = {
  // Basic CRUD operations
  ...createCrudOperations('templates'),

  // Override create to add validation
  create: async (data) => {
    // Validate lesson type
    const lessonType = LESSON_TYPES.find((t) => t.value === data.type);
    if (!lessonType) {
      throw new Error('Type de leçon invalide');
    }

    // Validate recurrence type if provided
    if (data.recurrence_type) {
      const recurrenceType = RECURRENCE_FREQUENCIES.find((t) => t.value === data.recurrence_type);
      if (!recurrenceType) {
        throw new Error('Type de récurrence invalide');
      }
    }

    // Ensure numeric fields
    const validatedData = {
      ...data,
      max_participants: Number(data.max_participants) || lessonType.defaultMax,
    };

    const response = await api.post('/templates', validatedData);
    return response.data;
  },

  // Override update to add validation
  update: async (id, data) => {
    // Validate lesson type if provided
    if (data.type) {
      const lessonType = LESSON_TYPES.find((t) => t.value === data.type);
      if (!lessonType) {
        throw new Error('Type de leçon invalide');
      }
    }

    // Validate recurrence type if provided
    if (data.recurrence_type) {
      const recurrenceType = RECURRENCE_FREQUENCIES.find((t) => t.value === data.recurrence_type);
      if (!recurrenceType) {
        throw new Error('Type de récurrence invalide');
      }
    }

    // Ensure numeric fields
    const validatedData = {
      ...data,
      max_participants: data.max_participants ? Number(data.max_participants) : undefined,
    };

    const response = await api.put(`/templates/${id}`, validatedData);
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
      end_date: endDate,
    });
    return response.data;
  },

  previewLessons: async (id, startDate, endDate) => {
    const response = await api.get(`/templates/${id}/preview`, {
      params: { start_date: startDate, end_date: endDate },
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
      params: { count },
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

  // Helper methods using domain constants
  getLessonTypes: () => LESSON_TYPES,
  getRecurrenceTypes: () => RECURRENCE_FREQUENCIES,

  // Get lesson type config by value
  getLessonTypeConfig: (typeValue) => {
    return LESSON_TYPES.find((t) => t.value === typeValue);
  },

  // Get recurrence type config by value
  getRecurrenceTypeConfig: (recurrenceValue) => {
    return RECURRENCE_FREQUENCIES.find((t) => t.value === recurrenceValue);
  },
};

export default templateService;
