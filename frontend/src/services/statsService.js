import { calendarApi } from './api.js';
import { format, startOfMonth, endOfMonth, eachWeekOfInterval, endOfWeek } from 'date-fns';
import { fr } from 'date-fns/locale';

export const statsService = {
  // -----------------
  // Monthly stats
  // -----------------
  getMonthlyStats: async (month) => {
    const monthStr = typeof month === 'string' ? month : format(month, 'yyyy-MM');
    const response = await calendarApi.get('/stats/monthly', { params: { month: monthStr } });
    return response.data;
  },

  getHorseStats: async (month) => {
    const monthStr = typeof month === 'string' ? month : format(month, 'yyyy-MM');
    const response = await calendarApi.get('/stats/horses', { params: { month: monthStr } });
    return response.data;
  },

  getRiderStats: async (month) => {
    const monthStr = typeof month === 'string' ? month : format(month, 'yyyy-MM');
    const response = await calendarApi.get('/stats/riders', { params: { month: monthStr } });
    return response.data;
  },

  // -----------------
  // Weekly rider usage (nouveau endpoint)
  // -----------------
  getRiderWeeklyUsage: async (monthOrParams) => {
    let params = {};

    if (typeof monthOrParams === 'string' || monthOrParams instanceof Date) {
      // Si c'est un mois, on transforme en 'YYYY-MM'
      const monthStr =
        typeof monthOrParams === 'string' ? monthOrParams : format(monthOrParams, 'yyyy-MM');
      params.month = monthStr;
    } else if (typeof monthOrParams === 'object') {
      // Si c'est un objet de params optionnels (firstWeekStart, lastWeekEnd, etc.)
      params = monthOrParams;
    }

    const response = await calendarApi.get('/stats/weekly', { params });
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
