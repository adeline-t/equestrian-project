/**
 * Package Service - Handles all package-related API operations
 */
import { api } from './apiService';

export const packageService = {
  // Basic CRUD operations
  getAll: async () => {
    const response = await api.get('/packages');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/packages/${id}`);
    return response.data;
  },

  create: async (data) => {
    const validatedData = {
      ...data,
      rider_id: Number(data.rider_id),
      private_lesson_count: Number(data.private_lesson_count) || 0,
      joint_lesson_count: Number(data.joint_lesson_count) || 0,
      activity_start_date: data.activity_start_date || null,
      activity_end_date: data.activity_end_date || null,
    };

    const response = await api.post('/packages', validatedData);
    return response.data;
  },

  update: async (id, data) => {
    const validatedData = {
      ...data,
      rider_id: Number(data.rider_id),
      private_lesson_count: Number(data.private_lesson_count) || 0,
      joint_lesson_count: Number(data.joint_lesson_count) || 0,
      activity_start_date: data.activity_start_date || null,
      activity_end_date: data.activity_end_date || null,
    };

    const response = await api.put(`/packages/${id}`, validatedData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/packages/${id}`);
    return response.data;
  },

  // Package-specific operations
  getLessons: async (id) => {
    const response = await api.get(`/packages/${id}/lessons`);
    return response.data;
  },

  addLesson: async (id, lessonData) => {
    const response = await api.post(`/packages/${id}/lessons`, lessonData);
    return response.data;
  },

  removeLesson: async (id, lessonId) => {
    const response = await api.delete(`/packages/${id}/lessons/${lessonId}`);
    return response.data;
  },

  // Statistics
  getStats: async () => {
    const response = await api.get('/packages/stats');
    return response.data;
  },

  // Rider-specific packages
  getByRider: async (riderId) => {
    const response = await api.get(`/riders/${riderId}/packages`);
    return response.data;
  },

  createForRider: async (riderId, packageData) => {
    const validatedData = {
      ...packageData,
      rider_id: Number(riderId),
      private_lesson_count: Number(packageData.private_lesson_count) || 0,
      joint_lesson_count: Number(packageData.joint_lesson_count) || 0,
    };

    const response = await api.post('/packages', validatedData);
    return response.data;
  },

  // Filtering and search
  search: async (query) => {
    const response = await api.get('/packages/search', { params: { q: query } });
    return response.data;
  },

  filterByStatus: async (status) => {
    const response = await api.get('/packages', { params: { status } });
    return response.data;
  },

  filterByType: async (type) => {
    const response = await api.get('/packages', { params: { type } });
    return response.data;
  },
};

export default packageService;