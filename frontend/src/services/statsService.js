import { api } from './api.js';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachWeekOfInterval,
  endOfWeek,
  startOfWeek,
} from 'date-fns';
import { fr } from 'date-fns/locale';

export const statsService = {
  // -----------------
  // Monthly stats
  // -----------------
  getMonthlyStats: async (month) => {
    const monthStr = typeof month === 'string' ? month : format(month, 'yyyy-MM');
    const response = await api.get('/stats/monthly', { params: { month: monthStr } });
    return response.data;
  },

  getHorseStats: async (month) => {
    const monthStr = typeof month === 'string' ? month : format(month, 'yyyy-MM');
    const response = await api.get('/stats/horses', { params: { month: monthStr } });
    return response.data;
  },

  getRiderStats: async (month) => {
    const monthStr = typeof month === 'string' ? month : format(month, 'yyyy-MM');
    const response = await api.get('/stats/riders', { params: { month: monthStr } });
    return response.data;
  },

  getSlotStats: async (monthOrParams) => {
    let params = {};

    if (typeof monthOrParams === 'string' || monthOrParams instanceof Date) {
      const monthStr =
        typeof monthOrParams === 'string' ? monthOrParams : format(monthOrParams, 'yyyy-MM');
      params.month = monthStr;
    } else if (typeof monthOrParams === 'object') {
      params = monthOrParams;
      // Ensure month is formatted correctly if it's a Date
      if (params.month instanceof Date) {
        params.month = format(params.month, 'yyyy-MM');
      }
    }

    const response = await api.get('/stats/slots', { params });
    console.info('getSlotStats', response.data);
    return response.data;
  },

  // -----------------
  // Weekly rider usage
  // -----------------
  getRiderWeeklyUsage: async (monthOrParams) => {
    let params = {};

    if (typeof monthOrParams === 'string' || monthOrParams instanceof Date) {
      const monthStr =
        typeof monthOrParams === 'string' ? monthOrParams : format(monthOrParams, 'yyyy-MM');
      params.month = monthStr;
    } else if (typeof monthOrParams === 'object') {
      params = monthOrParams;
    }

    const response = await api.get('/stats/weekly', { params });
    return response.data;
  },

  // -----------------
  // Monthly billing
  // -----------------
  getRiderMonthlyBilling: async (month) => {
    const monthStr = typeof month === 'string' ? month : format(month, 'yyyy-MM');
    const response = await api.get('/stats/rider-billing', { params: { month: monthStr } });
    return response.data;
  },

  // -----------------
  // Utilities: weeks of month
  // -----------------
  getWeeksOfMonth: (month) => {
    const date = typeof month === 'string' ? new Date(`${month}-01`) : month;
    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(date);
    const firstWeekStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const lastWeekEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const weeks = eachWeekOfInterval(
      { start: firstWeekStart, end: lastWeekEnd },
      { weekStartsOn: 1 }
    );

    return weeks.map((weekStart, index) => ({
      weekNumber: index + 1,
      startDate: format(weekStart, 'yyyy-MM-dd'),
      endDate: format(endOfWeek(weekStart, { weekStartsOn: 1 }), 'yyyy-MM-dd'),
      label: `S${index + 1} (${format(weekStart, 'dd MMM', { locale: fr })})`,
    }));
  },
};

export default statsService;
