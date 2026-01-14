/**
 * Pairing Service - Handles all pairing-related API operations
 */
import { api, createCrudOperations } from './apiService.js';

const pairingService = {
  // Basic CRUD operations
  ...createCrudOperations('pairings'),

  /**
   * Create pairing with validation
   * @param {Object} data - Pairing data
   * @returns {Promise<Object>} Created pairing
   */
  create: async (data) => {
    const validatedData = {
      rider_id: Number(data.rider_id),
      horse_id: Number(data.horse_id),
      pairing_start_date: data.pairing_start_date || null,
      pairing_end_date: data.pairing_end_date || null,
    };

    const response = await api.post('/pairings', validatedData);
    return response.data;
  },

  /**
   * Update pairing with validation
   * @param {number} id - Pairing ID
   * @param {Object} data - Pairing data
   * @returns {Promise<Object>} Updated pairing
   */
  update: async (id, data) => {
    const validatedData = {
      rider_id: data.rider_id ? Number(data.rider_id) : undefined,
      horse_id: data.horse_id ? Number(data.horse_id) : undefined,
      pairing_start_date:
        data.pairing_start_date !== undefined ? data.pairing_start_date : undefined,
      pairing_end_date: data.pairing_end_date !== undefined ? data.pairing_end_date : undefined,
    };

    // Remove undefined values
    Object.keys(validatedData).forEach(
      (key) => validatedData[key] === undefined && delete validatedData[key]
    );

    const response = await api.put(`/pairings/${id}`, validatedData);
    return response.data;
  },

  /**
   * Get pairings by rider
   * @param {number} riderId - Rider ID
   * @returns {Promise<Array>} Rider pairings
   */
  getByRider: async (riderId) => {
    const response = await api.get(`/riders/${riderId}/horses`);
    return response.data;
  },

  /**
   * Get pairings by horse
   * @param {number} horseId - Horse ID
   * @returns {Promise<Array>} Horse pairings
   */
  getByHorse: async (horseId) => {
    const response = await api.get(`/horses/${horseId}/riders`);
    return response.data;
  },
};

export default pairingService;
