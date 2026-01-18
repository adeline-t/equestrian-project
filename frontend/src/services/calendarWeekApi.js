import { calendarApi } from './calendarApi';

/**
 * Calendar – Week endpoints
 * This is what useCalendarView consumes
 */
export const calendarWeekApi = {
  /**
   * GET /calendar/week
   */
  getWeek: async (startDate) => {
    const response = await calendarApi.get('/week', {
      params: { start: startDate },
    });
    return response.data;
  },
};
