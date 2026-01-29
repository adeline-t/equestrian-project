import { format } from 'date-fns';
import { calendarApi } from './api.js';

/**
 * Normalize HH:mm format
 */
function normalizeTimeToHHMM(time) {
  if (!time) return '00:00';
  if (typeof time === 'string') {
    const parts = time.split(':');
    if (parts.length >= 2) return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}`;
  }
  return '00:00';
}

function enrichSlot(slot) {
  if (!slot) return slot;
  return {
    ...slot,
    start_time: normalizeTimeToHHMM(slot.start_time),
    end_time: normalizeTimeToHHMM(slot.end_time),
  };
}

export const calendarService = {
  // -----------------
  // Week
  // -----------------
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

  // -----------------
  // Slots
  // -----------------
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

  createSlot: (payload) => calendarApi.post('/slots', payload).then((r) => enrichSlot(r.data)),

  updateSlot: (id, payload) =>
    calendarApi.put(`/slots/${id}`, payload).then((r) => enrichSlot(r.data)),

  cancelSlot: (id, payload) =>
    calendarApi
      .put(`/slots/${id}/cancel`, { cancellation_reason: payload.cancellation_reason })
      .then((r) => enrichSlot(r.data)),

  deleteSlot: (id) => calendarApi.delete(`/slots/${id}`).then((r) => r.data),

  // -----------------
  // Events
  // -----------------
  getAllEvents: () => calendarApi.get('/events').then((r) => r.data),

  getEvent: (id) => calendarApi.get(`/events/${id}`).then((r) => r.data),

  createEvent: (payload) => calendarApi.post('/events', payload).then((r) => r.data),

  updateEvent: (id, payload) => calendarApi.put(`/events/${id}`, payload).then((r) => r.data),

  deleteEvent: (id) => calendarApi.delete(`/events/${id}`).then((r) => r.data),

  // -----------------
  // Participants
  // -----------------
  getAllParticipants: () => calendarApi.get('/participants').then((r) => r.data),

  getParticipant: (id) => calendarApi.get(`/participants/${id}`).then((r) => r.data),

  addParticipant: (payload) => calendarApi.post('/participants', payload).then((r) => r.data),

  updateParticipant: (id, payload) =>
    calendarApi.put(`/participants/${id}`, payload).then((r) => r.data),

  removeParticipant: (id) => calendarApi.delete(`/participants/${id}`).then((r) => r.data),

  // -----------------
  // Recurrences
  // -----------------
  getAllRecurrences: () => calendarApi.get('/recurrences').then((r) => r.data),

  getRecurrence: (id) => calendarApi.get(`/recurrences/${id}`).then((r) => r.data),

  getRecurrencesByEvent: (eventId) =>
    calendarApi.get('/recurrences', { params: { event_id: eventId } }).then((r) => r.data),

  createRecurrence: (payload) => calendarApi.post('/recurrences', payload).then((r) => r.data),

  updateRecurrence: (id, payload) =>
    calendarApi.put(`/recurrences/${id}`, payload).then((r) => r.data),

  deleteRecurrence: (id) => calendarApi.delete(`/recurrences/${id}`).then((r) => r.data),
};
