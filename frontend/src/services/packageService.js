/**
 * Package Service - Handles all package-related API operations
 */
import api from './apiService';
import { createCrudOperations } from './apiService';
import { validatePackageForm } from '../lib/helpers/domains/packages/validators';
import { PACKAGE_STATUS, PACKAGE_STATUS_LABELS } from '../lib/domains/packages/statuses';

export const packageService = {
  // Basic CRUD operations
  ...createCrudOperations('packages'),

  // Override create to add validation
  create: async (data) => {
    // Validate form data
    const validation = validatePackageForm(data);
    if (!validation.isValid) {
      throw new Error(JSON.stringify(validation.errors));
    }

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

  // Override update to add validation
  update: async (id, data) => {
    // Validate form data
    const validation = validatePackageForm(data);
    if (!validation.isValid) {
      throw new Error(JSON.stringify(validation.errors));
    }

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

  // Helper methods using domain constants and calculations
  getPackageStatuses: () => ({ statuses: PACKAGE_STATUS, labels: PACKAGE_STATUS_LABELS }),

  // Calculate remaining lessons for a package
  getRemainingLessons: async (packageId) => {
    const pkg = await packageService.getById(packageId);
    return calculateRemainingLessons(pkg);
  },

  // Calculate total remaining lessons for a package
  getTotalRemaining: async (packageId) => {
    const pkg = await packageService.getById(packageId);
    return calculateTotalRemainingLessons(pkg);
  },

  // Calculate package progress percentage
  getProgress: async (packageId) => {
    const pkg = await packageService.getById(packageId);
    return calculatePackageProgress(pkg);
  },

  // Get package status label
  getPackageStatusLabel: (status) => {
    return PACKAGE_STATUS_LABELS[status] || status;
  },
};

export default packageService;
