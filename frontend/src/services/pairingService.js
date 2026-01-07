/**
 * Pairing Service - Handles all pairing-related API operations
 */
import api from './apiService';
import { createCrudOperations } from './apiService';
import { validatePairingForm } from '../lib/helpers/domains/pairings/validators';
import { calculatePairingStats } from '../lib/helpers/domains/pairings/stats';

export const pairingService = {
  // Basic CRUD operations
  ...createCrudOperations('pairings'),

  // Override create to add validation
  create: async (data) => {
    // Validate form data
    const validation = validatePairingForm(data);
    if (!validation.isValid) {
      throw new Error(JSON.stringify(validation.errors));
    }

    const validatedData = {
      ...data,
      rider_id: Number(data.rider_id),
      horse_id: Number(data.horse_id),
    };

    const response = await api.post('/pairings', validatedData);
    return response.data;
  },

  // Override update to add validation
  update: async (id, data) => {
    // Validate form data
    const validation = validatePairingForm(data);
    if (!validation.isValid) {
      throw new Error(JSON.stringify(validation.errors));
    }

    const validatedData = {
      ...data,
      rider_id: data.rider_id ? Number(data.rider_id) : undefined,
      horse_id: data.horse_id ? Number(data.horse_id) : undefined,
    };

    const response = await api.put(`/pairings/${id}`, validatedData);
    return response.data;
  },

  // Pairing-specific operations
  getByRider: async (riderId) => {
    const response = await api.get(`/riders/${riderId}/pairings`);
    return response.data;
  },

  getByHorse: async (horseId) => {
    const response = await api.get(`/horses/${horseId}/pairings`);
    return response.data;
  },

  getByRiderAndHorse: async (riderId, horseId) => {
    const response = await api.get(`/pairings/lookup`, {
      params: { rider_id: riderId, horse_id: horseId }
    });
    return response.data;
  },

  // Date range operations
  getByDateRange: async (startDate, endDate) => {
    const response = await api.get('/pairings', {
      params: { start_date: startDate, end_date: endDate }
    });
    return response.data;
  },

  // Status operations
  activate: async (id) => {
    const response = await api.put(`/pairings/${id}/activate`);
    return response.data;
  },

  deactivate: async (id) => {
    const response = await api.put(`/pairings/${id}/deactivate`);
    return response.data;
  },

  // Statistics
  getStats: async () => {
    const response = await api.get('/pairings/stats');
    return response.data;
  },

  // Filtering and search
  search: async (query) => {
    const response = await api.get('/pairings/search', { params: { q: query } });
    return response.data;
  },

  filterByStatus: async (status) => {
    const response = await api.get('/pairings', { params: { status } });
    return response.data;
  },

  // Bulk operations
  bulkCreate: async (pairings) => {
    const response = await api.post('/pairings/bulk', { pairings });
    return response.data;
  },

  bulkUpdate: async (pairings) => {
    const response = await api.put('/pairings/bulk', { pairings });
    return response.data;
  },

  bulkDelete: async (ids) => {
    const response = await api.delete('/pairings/bulk', { data: { ids } });
    return response.data;
  },

  // Helper methods using helper functions
  getPairingStats: async (riderId, horseId) => {
    const pairing = await pairingService.getByRiderAndHorse(riderId, horseId);
    if (pairing) {
      return calculatePairingStats(pairing);
    }
    return null;
  },
};

export default pairingService;