/**
 * Horse Service - Handles all horse-related API operations
 */
import { HORSE_TYPES, OWNER_TYPES } from '../lib/domain/domain-constants.js';
import { validateHorseForm } from '../lib/helpers/index.js';
import { api, createCrudOperations } from './apiService.js';

const horseService = {
  // Basic CRUD operations
  ...createCrudOperations('horses'),

  /**
   * Create horse with validation
   * @param {Object} data - Horse data
   * @returns {Promise<Object>} Created horse
   */
  create: async (data) => {
    const validation = validateHorseForm(data);
    if (!validation.isValid) {
      throw new Error(JSON.stringify(validation.errors));
    }

    // Validate ownership_type
    if (!Object.values(OWNER_TYPES).includes(data.ownership_type)) {
      throw new Error(
        JSON.stringify({
          ownership_type: 'Le propriétaire doit être "laury", "private_owner", "club" ou "other"',
        })
      );
    }

    // Validate kind
    if (!Object.values(HORSE_TYPES).includes(data.kind)) {
      throw new Error(
        JSON.stringify({
          kind: 'Le type doit être "horse" ou "pony"',
        })
      );
    }

    const validatedData = {
      name: data.name.trim(),
      kind: data.kind,
      ownership_type: data.ownership_type,
      activity_start_date: data.activity_start_date || null,
      activity_end_date: data.activity_end_date || null,
    };

    const response = await api.post('/horses', validatedData);
    return response.data;
  },

  /**
   * Update horse with validation
   * @param {number} id - Horse ID
   * @param {Object} data - Horse data
   * @returns {Promise<Object>} Updated horse
   */
  update: async (id, data) => {
    const validation = validateHorseForm(data);
    if (!validation.isValid) {
      throw new Error(JSON.stringify(validation.errors));
    }

    // Validate ownership_type if provided
    if (data.ownership_type && !Object.values(OWNER_TYPES).includes(data.ownership_type)) {
      throw new Error(
        JSON.stringify({
          ownership_type: 'Le propriétaire doit être "laury", "private_owner", "club" ou "other"',
        })
      );
    }

    // Validate kind if provided
    if (data.kind && !Object.values(HORSE_TYPES).includes(data.kind)) {
      throw new Error(
        JSON.stringify({
          kind: 'Le type doit être "horse" ou "pony"',
        })
      );
    }

    const validatedData = {
      name: data.name?.trim(),
      kind: data.kind,
      ownership_type: data.ownership_type,
      activity_start_date: data.activity_start_date || null,
      activity_end_date: data.activity_end_date || null,
    };

    // Remove undefined values
    Object.keys(validatedData).forEach(
      (key) => validatedData[key] === undefined && delete validatedData[key]
    );

    const response = await api.put(`/horses/${id}`, validatedData);
    return response.data;
  },

  /**
   * Get riders for a horse
   * @param {number} id - Horse ID
   * @returns {Promise<Array>} Horse riders
   */
  getRiders: async (id) => {
    const response = await api.get(`/horses/${id}/riders`);
    return response.data;
  },

  /**
   * Get horse types
   * @returns {Array} Horse types
   */
  getHorseTypes: () => Object.values(HORSE_TYPES),

  /**
   * Get owner types
   * @returns {Array} Owner types
   */
  getOwnerTypes: () => Object.values(OWNER_TYPES),
};

export default horseService;
