import {
  RIDER_HORSE_LINK_TYPE,
  isValidLoanDays,
  isValidLoanDaysPerWeek,
} from '../lib/domain/domain-constants.js';
import { api, createCrudOperations } from './apiService.js';

const pairingService = {
  ...createCrudOperations('pairings'),

  _normalizePayload: (data) => {
    const payload = {
      rider_id: data.rider_id !== undefined ? Number(data.rider_id) : undefined,
      horse_id: data.horse_id !== undefined ? Number(data.horse_id) : undefined,
      pairing_start_date: data.pairing_start_date ?? undefined,
      pairing_end_date: data.pairing_end_date ?? undefined,
      link_type: data.link_type ?? RIDER_HORSE_LINK_TYPE.OWN,
      loan_days_per_week:
        data.loan_days_per_week !== undefined ? Number(data.loan_days_per_week) : undefined,
      loan_days: Array.isArray(data.loan_days) ? data.loan_days : undefined,
    };

    // link_type validation
    if (!Object.values(RIDER_HORSE_LINK_TYPE).includes(payload.link_type)) {
      delete payload.link_type;
    }

    // loan_days_per_week validation
    if (payload.link_type === RIDER_HORSE_LINK_TYPE.LOAN) {
      if (!isValidLoanDaysPerWeek(payload.loan_days_per_week)) {
        delete payload.loan_days_per_week;
      }
      if (!isValidLoanDays(payload.loan_days)) {
        delete payload.loan_days;
      }
    } else {
      delete payload.loan_days_per_week;
      delete payload.loan_days;
    }

    Object.keys(payload).forEach((key) => payload[key] === undefined && delete payload[key]);
    return payload;
  },

  create: async (data) => {
    const payload = pairingService._normalizePayload(data);
    if (!payload.rider_id || !payload.horse_id) {
      throw new Error('rider_id et horse_id sont requis');
    }
    const response = await api.post('/pairings', payload);
    return response.data;
  },

  update: async (id, data) => {
    const payload = pairingService._normalizePayload(data);
    if (!id || isNaN(Number(id))) throw new Error('ID de pairing invalide');
    const response = await api.put(`/pairings/${id}`, payload);
    return response.data;
  },

  getByRider: async (riderId) => {
    if (!riderId || isNaN(Number(riderId))) throw new Error('ID cavalier invalide');
    const response = await api.get(`/riders/${riderId}/horses`);
    return response.data;
  },

  getByHorse: async (horseId) => {
    if (!horseId || isNaN(Number(horseId))) throw new Error('ID cheval invalide');
    const response = await api.get(`/horses/${horseId}/riders`);
    return response.data;
  },
};

export default pairingService;
