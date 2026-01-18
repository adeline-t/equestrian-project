import { format } from 'date-fns';
import { calendarWeekApi } from './calendarWeekApi';

/**
 * Calendar Service
 * Business entry point for hooks
 */
export const calendarService = {
  getWeekData: async (weekStartDate) => {
    const formatted = format(weekStartDate, 'yyyy-MM-dd');
    return calendarWeekApi.getWeek(formatted);
  },
};
