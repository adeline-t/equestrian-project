/**
 * Statistics Service - Handles monthly stats for horses and riders
 */
import { calendarApi } from './api.js';
import {
  format,
  startOfWeek,
  endOfWeek,
  eachWeekOfInterval,
  startOfMonth,
  endOfMonth,
} from 'date-fns';
import { fr } from 'date-fns/locale';

const statsService = {
  /**
   * Get monthly statistics for a specific month
   * @param {Date|string} month - The month to get stats for (YYYY-MM format or Date)
   * @returns {Promise<Object>} Monthly statistics
   */
  getMonthlyStats: async (month) => {
    const monthStr = typeof month === 'string' ? month : format(month, 'yyyy-MM');
    const response = await calendarApi.get('/stats/monthly', {
      params: { month: monthStr },
    });
    return response.data;
  },

  /**
   * Get horse statistics for a month
   * @param {Date|string} month - The month to get stats for
   * @returns {Promise<Array>} Horse statistics by week
   */
  getHorseStats: async (month) => {
    const monthStr = typeof month === 'string' ? month : format(month, 'yyyy-MM');
    const response = await calendarApi.get('/stats/horses', {
      params: { month: monthStr },
    });
    return response.data;
  },

  /**
   * Get rider statistics for a month
   * @param {Date|string} month - The month to get stats for
   * @returns {Promise<Array>} Rider statistics by week and event type
   */
  getRiderStats: async (month) => {
    const monthStr = typeof month === 'string' ? month : format(month, 'yyyy-MM');
    const response = await calendarApi.get('/stats/riders', {
      params: { month: monthStr },
    });
    return response.data;
  },

  /**
   * Get weeks of a month (including partial weeks from adjacent months)
   * @param {Date|string} month - The month (YYYY-MM format or Date)
   * @returns {Array<Object>} Array of week objects with start and end dates
   */
  getWeeksOfMonth: (month) => {
    const date = typeof month === 'string' ? new Date(`${month}-01`) : month;
    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(date);

    // Get the start of the first week (Monday) and end of the last week (Sunday)
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

  /**
   * Format stats data for display
   * @param {Object} statsData - Raw stats data from API
   * @returns {Object} Formatted stats data
   */
  formatStatsData: (statsData) => {
    if (!statsData) return null;

    return {
      horses:
        statsData.horses?.map((horse) => ({
          ...horse,
          totalEvents: horse.weeks?.reduce((sum, week) => sum + week.eventCount, 0) || 0,
        })) || [],
      riders:
        statsData.riders?.map((rider) => ({
          ...rider,
          totalEvents:
            rider.weeks?.reduce((sum, week) => {
              return sum + Object.values(week.eventsByType || {}).reduce((s, c) => s + c, 0);
            }, 0) || 0,
        })) || [],
    };
  },
};

export default statsService;
