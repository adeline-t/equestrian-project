/**
 * Calendar API - Adjusted for updated DB schema
 */
import axios from 'axios';
import { LESSON_STATUSES, LESSON_TYPES, PLANNING_SLOT_TYPES } from '../lib/domain/domain-constants';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787/api';

const calendarApi = axios.create({
  baseURL: `${API_BASE_URL}/calendar`,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

// Request interceptor
calendarApi.interceptors.request.use(
  (config) => {
    console.log(`🟢 Calendar API: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Lessons API - /calendar/lessons
 */
export const lessonsApi = {
  getAll: async (startDate, endDate, filters = {}) => {
    const params = { start_date: startDate, end_date: endDate, ...filters };
    const response = await calendarApi.get('/lessons', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await calendarApi.get(`/lessons/${id}`);
    return response.data;
  },

  create: async (data) => {
    const lessonType = LESSON_TYPES.find((t) => t.value === data.lesson_type);
    if (!lessonType) throw new Error('Type de leçon invalide');

    const validated = {
      planning_slot_id: Number(data.planning_slot_id),
      lesson_type: data.lesson_type,
      status: data.status || LESSON_STATUSES.SCHEDULED,
      instructor_id: Number(data.instructor_id),
      actual_instructor_id: data.actual_instructor_id ? Number(data.actual_instructor_id) : null,
      min_participants: data.min_participants ? Number(data.min_participants) : null,
      max_participants: data.max_participants
        ? Number(data.max_participants)
        : lessonType.defaultMax,
      cancellation_reason: data.cancellation_reason || null,
    };

    const response = await calendarApi.post('/lessons', validated);
    return response.data;
  },

  update: async (id, data) => {
    if (data.lesson_type && !LESSON_TYPES.find((t) => t.value === data.lesson_type)) {
      throw new Error('Type de leçon invalide');
    }

    const validated = {
      lesson_type: data.lesson_type,
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

    const response = await calendarApi.put(`/lessons/${id}`, validated);
    return response.data;
  },

  getParticipants: async (id) => {
    const response = await calendarApi.get(`/lessons/${id}/participants`);
    return response.data;
  },

  addParticipant: async (lessonId, participant) => {
    const validated = {
      rider_id: Number(participant.rider_id),
      horse_id: participant.horse_id ? Number(participant.horse_id) : null,
      horse_assignment_type: participant.horse_assignment_type,
    };
    const response = await calendarApi.post(`/lessons/${lessonId}/participants`, validated);
    return response.data;
  },

  removeParticipant: async (lessonId, participantId) => {
    const response = await calendarApi.delete(`/lessons/${lessonId}/participants/${participantId}`);
    return response.data;
  },

  getLessonTypes: () => LESSON_TYPES,
  getLessonStatuses: () => LESSON_STATUSES,
};

/**
 * Planning Slots API - /calendar/slots
 */
export const slotsApi = {
  getAll: async (params = {}) => {
    const response = await calendarApi.get('/slots', { params });
    return response.data;
  },

  create: async (data) => {
    const validated = {
      start_time: data.start_time,
      end_time: data.end_time,
      is_all_day: data.is_all_day || false,
      slot_status: data.slot_status,
      actual_instructor_id: data.actual_instructor_id ? Number(data.actual_instructor_id) : null,
      cancellation_reason: data.cancellation_reason || null,
    };

    if (!Object.values(PLANNING_SLOT_TYPES).includes(validated.slot_status)) {
      throw new Error('Status de slot invalide');
    }

    if (new Date(validated.end_time) <= new Date(validated.start_time)) {
      throw new Error('La date de fin doit être après la date de début');
    }

    const response = await calendarApi.post('/slots', validated);
    return response.data;
  },

  getSlotTypes: () => PLANNING_SLOT_TYPES,
};

export const recurrencesApi = {
  getAll: async () => {
    const response = await calendarApi.get('/recurrences');
    return response.data;
  },

  getById: async (id) => {
    const response = await calendarApi.get(`/recurrences/${id}`);
    return response.data;
  },

  create: async (data) => {
    const validated = {
      frequency: data.frequency,
      interval: data.interval ?? 1,
      by_week_days: Array.isArray(data.by_week_days) ? data.by_week_days : null,
      start_time: data.start_time ?? null,
      end_time: data.end_time ?? null,
    };
    const response = await calendarApi.post('/recurrences', validated);
    return response.data;
  },

  update: async (id, data) => {
    const validated = { ...data };
    const response = await calendarApi.put(`/recurrences/${id}`, validated);
    return response.data;
  },

  delete: async (id) => {
    const response = await calendarApi.delete(`/recurrences/${id}`);
    return response.data;
  },
};

export default { lessonsApi, slotsApi, recurrencesApi };
