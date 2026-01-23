import { format, parseISO } from 'date-fns';
import { calendarApi } from './api';
import { timeToMinutes, minutesToTime } from '../lib/helpers/formatters';

/**
 * Normalize start_time / end_time to HH:MM format
 */
function normalizeTimeToHHMM(timeValue) {
  if (!timeValue) return '00:00';
  if (typeof timeValue === 'string') {
    const parts = timeValue.split(':');
    if (parts.length >= 2) return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}`;
  }
  return '00:00';
}

/**
 * Enrich slot with normalized times only
 */
function enrichSlot(slot) {
  if (!slot) return slot;

  return {
    ...slot,
    start_time: normalizeTimeToHHMM(slot.start_time),
    end_time: normalizeTimeToHHMM(slot.end_time),
  };
}

export const calendarService = {
  getWeekData: async (weekStartDate) => {
    const start = format(weekStartDate, 'yyyy-MM-dd');
    const response = await calendarApi.get('/week', { params: { start } });
    return {
      ...response.data,
      days: (response.data.days || []).map((day) => ({
        ...day,
        slots: (day.slots || []).map(enrichSlot),
      })),
    };
  },

  getAllSlots: async () => {
    const response = await calendarApi.get('/slots');
    return (response.data || []).map(enrichSlot);
  },

  getSlot: async (id) => {
    const response = await calendarApi.get(`/slots/${id}`);
    return enrichSlot(response.data);
  },

  getSlotFullDetails: async (id) => {
    const response = await calendarApi.get(`/slots/${id}/full-details`);
    return response.data;
  },

  getScheduledSlots: async () => {
    const response = await calendarApi.get('/slots/scheduled');
    return (response.data || []).map(enrichSlot);
  },

  // -----------------------------
  // POST / PUT now send DB-ready formats directly
  // -----------------------------
  createSlot: async (payload) => {
    // payload.slot_date: "YYYY-MM-DD"
    // payload.start_time / end_time: "HH:mm:ss"
    const response = await calendarApi.post('/slots', payload);
    return enrichSlot(response.data);
  },

  updateSlot: async (id, payload) => {
    // payload.slot_date: "YYYY-MM-DD"
    // payload.start_time / end_time: "HH:mm:ss"
    const response = await calendarApi.put(`/slots/${id}`, payload);
    return enrichSlot(response.data);
  },

  cancelSlot: async (id, payload) => {
    // payload attendu :
    // { cancellation_reason: string }

    const response = await calendarApi.put(`/slots/${id}/cancel`, {
      cancellation_reason: payload.cancellation_reason,
    });

    return enrichSlot(response.data);
  },

  deleteSlot: async (id) => {
    const response = await calendarApi.delete(`/slots/${id}`);
    return response.data;
  },

  getAllEvents: async () => {
    const response = await calendarApi.get('/events');
    return response.data;
  },

  getEvent: async (id) => {
    const response = await calendarApi.get(`/events/${id}`);
    return response.data;
  },

  createEvent: async (payload) => {
    const response = await calendarApi.post('/events', payload);
    return response.data;
  },

  updateEvent: async (id, payload) => {
    const response = await calendarApi.put(`/events/${id}`, payload);
    return response.data;
  },

  deleteEvent: async (id) => {
    const response = await calendarApi.delete(`/events/${id}`);
    return response.data;
  },

  getAllParticipants: async () => {
    const response = await calendarApi.get('/participants');
    return response.data;
  },

  getParticipant: async (id) => {
    const response = await calendarApi.get(`/participants/${id}`);
    return response.data;
  },

  addParticipant: async (payload) => {
    const response = await calendarApi.post('/participants', payload);
    return response.data;
  },

  updateParticipant: async (id, payload) => {
    const response = await calendarApi.put(`/participants/${id}`, payload);
    return response.data;
  },

  removeParticipant: async (id) => {
    const response = await calendarApi.delete(`/participants/${id}`);
    return response.data;
  },

  getAllRecurrences: async () => {
    const response = await calendarApi.get('/recurrences');
    return response.data;
  },

  getRecurrence: async (id) => {
    const response = await calendarApi.get(`/recurrences/${id}`);
    return response.data;
  },

  createRecurrence: async (payload) => {
    const response = await calendarApi.post('/recurrences', payload);
    return response.data;
  },

  updateRecurrence: async (id, payload) => {
    const response = await calendarApi.put(`/recurrences/${id}`, payload);
    return response.data;
  },

  deleteRecurrence: async (id) => {
    const response = await calendarApi.delete(`/recurrences/${id}`);
    return response.data;
  },
};
