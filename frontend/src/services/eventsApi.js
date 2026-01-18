import { calendarApi } from './calendarApi';
import { EVENT_TYPES, SLOT_STATUSES } from '../lib/domains/events';

export const eventsApi = {
  getById: async (id) => {
    const response = await calendarApi.get(`/events/${id}`);
    return response.data;
  },

  create: async (data) => {
    if (!Object.values(EVENT_TYPES).includes(data.event_type)) {
      throw new Error('Type d’événement invalide');
    }

    const payload = {
      planning_slot_id: Number(data.planning_slot_id),
      event_type: data.event_type,
      status: data.status || SLOT_STATUSES.SCHEDULED,
      instructor_id: Number(data.instructor_id),
      actual_instructor_id: data.actual_instructor_id ? Number(data.actual_instructor_id) : null,
      min_participants: data.min_participants ?? null,
      max_participants: data.max_participants ?? null,
      cancellation_reason: data.cancellation_reason ?? null,
    };

    const response = await calendarApi.post('/events', payload);
    return response.data;
  },

  update: async (id, data) => {
    if (data.event_type && !Object.values(EVENT_TYPES).includes(data.event_type)) {
      throw new Error('Type d’événement invalide');
    }

    const payload = {
      event_type: data.event_type,
      status: data.status,
      instructor_id: data.instructor_id ? Number(data.instructor_id) : undefined,
      actual_instructor_id: data.actual_instructor_id
        ? Number(data.actual_instructor_id)
        : undefined,
      min_participants: data.min_participants,
      max_participants: data.max_participants,
      cancellation_reason: data.cancellation_reason,
    };

    Object.keys(payload).forEach((k) => payload[k] === undefined && delete payload[k]);

    const response = await calendarApi.put(`/events/${id}`, payload);
    return response.data;
  },

  getParticipants: async (id) => {
    const response = await calendarApi.get(`/events/${id}/participants`);
    return response.data;
  },

  addParticipant: async (eventId, participant) => {
    const payload = {
      rider_id: Number(participant.rider_id),
      horse_id: participant.horse_id ? Number(participant.horse_id) : null,
      horse_assignment_type: participant.horse_assignment_type,
    };

    const response = await calendarApi.post(`/events/${eventId}/participants`, payload);
    return response.data;
  },

  removeParticipant: async (eventId, participantId) => {
    const response = await calendarApi.delete(`/events/${eventId}/participants/${participantId}`);
    return response.data;
  },
};
