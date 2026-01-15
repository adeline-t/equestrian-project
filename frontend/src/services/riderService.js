/**
 * Rider Service - Handles all rider-related API operations
 */
import { RIDER_TYPES } from '../lib/domain/domain-constants.js';
import { validateRiderForm } from '../lib/helpers/index.js';
import { api, createCrudOperations } from './apiService.js';

const riderService = {
  // Basic CRUD operations
  ...createCrudOperations('riders'),

  /**
   * Create rider with validation
   * @param {Object} data - Rider data
   * @returns {Promise<Object>} Created rider
   */
  create: async (data) => {
    const validation = validateRiderForm(data);
    if (!validation.isValid) {
      throw new Error(JSON.stringify(validation.errors));
    }

    // Validate rider_type
    if (!Object.values(RIDER_TYPES).includes(data.rider_type)) {
      throw new Error(
        JSON.stringify({
          rider_type: 'Le type doit être "owner", "club" ou "boarder"',
        })
      );
    }

    const validatedData = {
      name: data.name.trim(),
      rider_type: data.rider_type,
      phone: data.phone?.trim() || null,
      email: data.email?.trim().toLowerCase() || null,
      activity_start_date: data.activity_start_date || null,
      activity_end_date: data.activity_end_date || null,
    };

    const response = await api.post('/riders', validatedData);
    return response.data;
  },

  /**
   * Update rider with validation
   * @param {number} id - Rider ID
   * @param {Object} data - Rider data
   * @returns {Promise<Object>} Updated rider
   */
  update: async (id, data) => {
    const validation = validateRiderForm(data);
    if (!validation.isValid) {
      throw new Error(JSON.stringify(validation.errors));
    }

    // Validate rider_type if provided
    if (data.rider_type && !Object.values(RIDER_TYPES).includes(data.rider_type)) {
      throw new Error(
        JSON.stringify({
          rider_type: 'Le type doit être "owner", "club" ou "boarder"',
        })
      );
    }

    const validatedData = {
      name: data.name?.trim(),
      rider_type: data.rider_type,
      phone: data.phone?.trim() || null,
      email: data.email?.trim().toLowerCase() || null,
      activity_start_date: data.activity_start_date || null,
      activity_end_date: data.activity_end_date || null,
    };

    // Remove undefined values
    Object.keys(validatedData).forEach(
      (key) => validatedData[key] === undefined && delete validatedData[key]
    );

    const response = await api.put(`/riders/${id}`, validatedData);
    return response.data;
  },

  /**
   * Get horses for a rider
   * @param {number} id - Rider ID
   * @returns {Promise<Array>} Rider horses
   */
  getHorses: async (id) => {
    const response = await api.get(`/riders/${id}/horses`);
    return response.data;
  },

  /**
   * Get packages for a rider
   * @param {number} id - Rider ID
   * @returns {Promise<Array>} Rider packages
   */
  getPackages: async (id) => {
    const response = await api.get(`/riders/${id}/packages`);
    return response.data;
  },

  /**
   * Create package for a rider
   * @param {number} riderId - Rider ID
   * @param {Object} packageData - Package data
   * @returns {Promise<Object>} Created package
   */
  createPackage: async (riderId, packageData) => {
    const validatedData = {
      rider_id: Number(riderId),
      services_per_week: Number(packageData.services_per_week) || 0,
      group_lessons_per_week: Number(packageData.group_lessons_per_week) || 0,
      is_active: packageData.is_active !== undefined ? Boolean(packageData.is_active) : true,
      activity_start_date: packageData.activity_start_date || null,
      activity_end_date: packageData.activity_end_date || null,
    };

    const response = await api.post('/packages', validatedData);
    return response.data;
  },

  /**
   * Get rider types
   * @returns {Array} Rider types
   */
  getRiderTypes: () => Object.values(RIDER_TYPES),
};

export default riderService;
