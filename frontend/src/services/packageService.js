import { api, createCrudOperations } from './api.js';

const packageService = {
  ...createCrudOperations('packages'),

  create: async (data) => {
    const payload = {
      rider_id: Number(data.rider_id),
      services_per_week: Number(data.services_per_week),
      group_lessons_per_week: Number(data.group_lessons_per_week),
      is_active: data.is_active ?? true,
    };

    try {
      const response = await api.post('/packages', payload);
      return response.data;
    } catch (error) {
      if (error.response?.status === 409) {
        const e = new Error(error.response.data.message);
        e.code = 'ACTIVE_PACKAGE_EXISTS';
        e.existingPackage = error.response.data.existingPackage;
        throw e;
      }
      throw error;
    }
  },

  createForRider: async (riderId, data) => {
    return packageService.create({
      ...data,
      rider_id: riderId,
    });
  },

  delete: async (id) => {
    try {
      const response = await api.delete(`/packages/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting package:', error);
      throw error;
    }
  },

  getByRider: async (riderId) => {
    const response = await api.get(`/riders/${riderId}/packages`);
    return response.data;
  },
};

export default packageService;
