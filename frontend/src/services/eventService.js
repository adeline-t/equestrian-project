/**
 * Lesson Service - Updated for DB schema
 */
import { EVENT_STATUSES, EVENT_TYPES } from '../lib/domain/domain-constants.js';
import { api, createCrudOperations } from './apiService.js';

const eventService = {
  ...createCrudOperations('events'),

  create: async (data) => {
    const eventType = EVENT_TYPES.find((t) => t.value === data.event_type);
    if (!eventType) throw new Error('Type de leçon invalide');

    const validated = {
      planning_slot_id: Number(data.planning_slot_id),
      event_type: data.event_type,
      status: data.status || EVENT_STATUSES.SCHEDULED,
      instructor_id: Number(data.instructor_id),
      actual_instructor_id: data.actual_instructor_id ? Number(data.actual_instructor_id) : null,
      min_participants: data.min_participants ? Number(data.min_participants) : null,
      max_participants: data.max_participants
        ? Number(data.max_participants)
        : eventType.defaultMax,
      cancellation_reason: data.cancellation_reason || null,
    };

    const response = await api.post('/events', validated);
    return response.data;
  },

  update: async (id, data) => {
    if (data.event_type && !EVENT_TYPES.find((t) => t.value === data.event_type)) {
      throw new Error('Type de leçon invalide');
    }

    const validated = {
      event_type: data.event_type,
      status: data.status,
      instructor_id: data.instructor_id ? Number(data.instructor_id) : undefined,
      actual_instructor_id: data.actual_instructor_id
        ? Number(data.actual_instructor_id)
        : undefined,
      min_participants: data.min_participants ? Number(data.min_participants) : undefined,
      max_participants: data.max_participants ? Number(data.max_participants) : undefined,
      cancellation_reason: data.cancellation_reason,
    };

    Object.keys(validated).forEach((k) => validated[k] === undefined && delete validated[k]);

    const response = await api.put(`/events/${id}`, validated);
    return response.data;
  },

  getParticipants: async (id) => {
    const response = await api.get(`/events/${id}/participants`);
    return response.data;
  },

  addParticipant: async (eventId, participant) => {
    const validated = {
      rider_id: Number(participant.rider_id),
      horse_id: participant.horse_id ? Number(participant.horse_id) : null,
      horse_assignment_type: participant.horse_assignment_type,
    };
    const response = await api.post(`/events/${eventId}/participants`, validated);
    return response.data;
  },

  removeParticipant: async (eventId, participantId) => {
    const response = await api.delete(`/events/${eventId}/participants/${participantId}`);
    return response.data;
  },

  getByDateRange: async (startDate, endDate) => {
    const response = await api.get('/calendar/events', {
      params: { start_date: startDate, end_date: endDate },
    });
    return response.data;
  },

  getLessonTypes: () => EVENT_TYPES,
  getLessonStatuses: () => EVENT_STATUSES,
};

export default eventService;
