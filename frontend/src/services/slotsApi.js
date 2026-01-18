import { calendarApi } from './calendarApi';

export const slotsApi = {
  create: async (data) => {
    const payload = {
      start_time: data.start_time,
      end_time: data.end_time,
      is_all_day: data.is_all_day || false,
      cancellation_reason: data.cancellation_reason ?? null,
      actual_instructor_id: data.actual_instructor_id ? Number(data.actual_instructor_id) : null,
    };

    if (new Date(payload.end_time) <= new Date(payload.start_time)) {
      throw new Error('La date de fin doit être après la date de début');
    }

    const response = await calendarApi.post('/slots', payload);
    return response.data;
  },
};
