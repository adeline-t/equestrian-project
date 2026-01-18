/**
 * Lesson Service - Updated for DB schema
 */
import { LESSON_STATUSES, LESSON_TYPES } from '../lib/domain/domain-constants.js';
import { api, createCrudOperations } from './apiService.js';

const lessonService = {
  ...createCrudOperations('lessons'),

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

    const response = await api.post('/lessons', validated);
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

    const response = await api.put(`/lessons/${id}`, validated);
    return response.data;
  },

  getParticipants: async (id) => {
    const response = await api.get(`/lessons/${id}/participants`);
    return response.data;
  },

  addParticipant: async (lessonId, participant) => {
    const validated = {
      rider_id: Number(participant.rider_id),
      horse_id: participant.horse_id ? Number(participant.horse_id) : null,
      horse_assignment_type: participant.horse_assignment_type,
    };
    const response = await api.post(`/lessons/${lessonId}/participants`, validated);
    return response.data;
  },

  removeParticipant: async (lessonId, participantId) => {
    const response = await api.delete(`/lessons/${lessonId}/participants/${participantId}`);
    return response.data;
  },

  getByDateRange: async (startDate, endDate) => {
    const response = await api.get('/calendar/lessons', {
      params: { start_date: startDate, end_date: endDate },
    });
    return response.data;
  },

  getLessonTypes: () => LESSON_TYPES,
  getLessonStatuses: () => LESSON_STATUSES,
};

export default lessonService;
