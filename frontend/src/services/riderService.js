/**
 * Rider Service - Handles all rider-related API operations
 */
import api from './apiService';
import { createCrudOperations } from './apiService';
import { validateRiderForm } from '../lib/helpers/domains/riders/validators';
import { RIDER_KIND_LABELS } from '../lib/domains/riders/kinds';

// Extract allowed values from constants
const RIDER_KINDS = Object.values(RIDER_KIND_LABELS).map((k) => k.value);

const normalizeRiderData = (data) => {
  const normalized = { ...data };

  // Validate kind
  if (!RIDER_KINDS.includes(normalized.kind)) {
    throw new Error(
      JSON.stringify({
        kind: 'Le type doit être "owner", "club" ou "boarder"',
      })
    );
  }

  return normalized;
};

export const riderService = {
  // Basic CRUD operations
  ...createCrudOperations('riders'),

  /**
   * Create rider with validation
   */
  create: async (data) => {
    const validation = validateRiderForm(data);
    if (!validation.isValid) {
      throw new Error(JSON.stringify(validation.errors));
    }

    // Default kind
    if (!data.kind) {
      data.kind = RIDER_KIND_LABELS.BOARDER.value;
    }

    const normalizedData = normalizeRiderData(data);

    const response = await api.post('/riders', normalizedData);
    return response.data;
  },

  /**
   * Update rider with validation
   */
  update: async (id, data) => {
    const validation = validateRiderForm(data);
    if (!validation.isValid) {
      throw new Error(JSON.stringify(validation.errors));
    }

    const normalizedData = normalizeRiderData(data);

    const response = await api.put(`/riders/${id}`, normalizedData);
    return response.data;
  },

  /**
   * Rider-specific operations
   */
  getHorses: async (id) => {
    const response = await api.get(`/riders/${id}/horses`);
    return response.data;
  },

  getPackages: async (id) => {
    const response = await api.get(`/riders/${id}/packages`);
    return response.data;
  },

  addHorse: async (riderId, horseId) => {
    const response = await api.post(`/riders/${riderId}/horses`, {
      horse_id: Number(horseId),
    });
    return response.data;
  },

  removeHorse: async (riderId, horseId) => {
    const response = await api.delete(`/riders/${riderId}/horses/${horseId}`);
    return response.data;
  },

  /**
   * Package operations
   */
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

  /**
   * Statistics
   */
  getStats: async () => {
    const response = await api.get('/riders/stats');
    return response.data;
  },

  /**
   * Filtering and search
   */
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
