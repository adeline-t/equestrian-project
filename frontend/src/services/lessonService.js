/**
 * Lesson Service - Handles all lesson-related API operations
 */
import api from './apiService';
import { createCrudOperations } from './apiService';
import { validateLessonForm } from '../lib/helpers/domains/lessons/validators';
import { LESSON_TYPES } from '../lib/domains/lessons/types';
import { LESSON_STATUSES } from '../lib/domains/lessons/statuses';
import { PARTICIPATION_STATUSES } from '../lib/domains/lessons/participation';

export const lessonService = {
  // Basic CRUD operations
  ...createCrudOperations('lessons'),

  // Override create to add validation
  create: async (data) => {
    // Validate form data
    const validation = validateLessonForm(data);
    if (!validation.isValid) {
      throw new Error(JSON.stringify(validation.errors));
    }

    // Validate lesson type
    const lessonType = LESSON_TYPES.find((t) => t.value === data.type);
    if (!lessonType) {
      throw new Error('Type de leçon invalide');
    }

    // Ensure numeric fields
    const validatedData = {
      ...data,
      max_participants: Number(data.max_participants) || lessonType.defaultMax,
    };

    const response = await api.post('/lessons', validatedData);
    return response.data;
  },

  // Override update to add validation
  update: async (id, data) => {
    // Validate form data
    const validation = validateLessonForm(data);
    if (!validation.isValid) {
      throw new Error(JSON.stringify(validation.errors));
    }

    // Validate lesson type if provided
    if (data.type) {
      const lessonType = LESSON_TYPES.find((t) => t.value === data.type);
      if (!lessonType) {
        throw new Error('Type de leçon invalide');
      }
    }

    // Ensure numeric fields
    const validatedData = {
      ...data,
      max_participants: data.max_participants ? Number(data.max_participants) : undefined,
    };

    const response = await api.put(`/lessons/${id}`, validatedData);
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
      params: { start_date: startDate, end_date: endDate },
    });
    return response.data;
  },

  getByWeek: async (year, week) => {
    const response = await api.get('/lessons/week', {
      params: { year, week },
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

  // Helper methods using domain constants
  getLessonTypes: () => LESSON_TYPES,
  getLessonStatuses: () => LESSON_STATUSES,
  getParticipationStatuses: () => PARTICIPATION_STATUSES,

  // Get lesson type config by value
  getLessonTypeConfig: (typeValue) => {
    return LESSON_TYPES.find((t) => t.value === typeValue);
  },
};

export default lessonService;
