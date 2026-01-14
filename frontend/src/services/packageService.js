/**
 * Package Service - Handles all package-related API operations
 */
import { PACKAGE_STATUS, PACKAGE_STATUS_LABELS } from '../lib/domain/packages.js';
import { api, createCrudOperations } from './apiService.js';

const packageService = {
  // Basic CRUD operations
  ...createCrudOperations('packages'),

  /**
   * Create package with validation
   * @param {Object} data - Package data
   * @returns {Promise<Object>} Created package
   */
  create: async (data) => {
    const validatedData = {
      rider_id: Number(data.rider_id),
      services_per_week: Number(data.services_per_week) || 0,
      group_lessons_per_week: Number(data.group_lessons_per_week) || 0,
      is_active: data.is_active !== undefined ? Boolean(data.is_active) : true,
      activity_start_date: data.activity_start_date || null,
      activity_end_date: data.activity_end_date || null,
    };

    const response = await api.post('/packages', validatedData);
    return response.data;
  },

  /**
   * Update package with validation
   * @param {number} id - Package ID
   * @param {Object} data - Package data
   * @returns {Promise<Object>} Updated package
   */
  update: async (id, data) => {
    const validatedData = {
      rider_id: data.rider_id ? Number(data.rider_id) : undefined,
      services_per_week:
        data.services_per_week !== undefined ? Number(data.services_per_week) : undefined,
      group_lessons_per_week:
        data.group_lessons_per_week !== undefined ? Number(data.group_lessons_per_week) : undefined,
      is_active: data.is_active !== undefined ? Boolean(data.is_active) : undefined,
      activity_start_date:
        data.activity_start_date !== undefined ? data.activity_start_date : undefined,
      activity_end_date: data.activity_end_date !== undefined ? data.activity_end_date : undefined,
    };

    // Remove undefined values
    Object.keys(validatedData).forEach(
      (key) => validatedData[key] === undefined && delete validatedData[key]
    );

    const response = await api.put(`/packages/${id}`, validatedData);
    return response.data;
  },

  /**
   * Get packages for a rider
   * @param {number} riderId - Rider ID
   * @returns {Promise<Array>} Rider packages
   */
  getByRider: async (riderId) => {
    const response = await api.get(`/riders/${riderId}/packages`);
    return response.data;
  },

  /**
   * Create package for a specific rider
   * @param {number} riderId - Rider ID
   * @param {Object} packageData - Package data
   * @returns {Promise<Object>} Created package
   */
  createForRider: async (riderId, packageData) => {
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
   * Get package statuses
   * @returns {Object} Statuses and labels
   */
  getPackageStatuses: () => ({
    statuses: PACKAGE_STATUS,
    labels: PACKAGE_STATUS_LABELS,
  }),

  /**
   * Get package status label
   * @param {string} status - Status value
   * @returns {string} Status label
   */
  getPackageStatusLabel: (status) => PACKAGE_STATUS_LABELS[status] || status,
};

export default packageService;
