/**
 * Calendar API - Specialized endpoints for calendar operations
 */
import axios from 'axios';
import { LESSON_TYPES, LESSON_STATUSES, PLANNING_SLOT_TYPES } from '../lib/domain/lessons.js';

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
  /**
   * Get all lessons in date range
   * @param {string} startDate - Start date
   * @param {string} endDate - End date
   * @param {Object} filters - Additional filters
   * @returns {Promise<Array>} Lessons
   */
  getAll: async (startDate, endDate, filters = {}) => {
    const params = { start_date: startDate, end_date: endDate, ...filters };
    const response = await calendarApi.get('/lessons', { params });
    return response.data;
  },

  /**
   * Get lesson by ID
   * @param {number} id - Lesson ID
   * @returns {Promise<Object>} Lesson
   */
  getById: async (id) => {
    const response = await calendarApi.get(`/lessons/${id}`);
    return response.data;
  },

  /**
   * Create lesson
   * @param {Object} data - Lesson data
   * @returns {Promise<Object>} Created lesson
   */
  create: async (data) => {
    const lessonType = LESSON_TYPES.find((t) => t.value === data.lesson_type);
    if (!lessonType) {
      throw new Error('Type de leçon invalide');
    }

    const validated = {
      planning_slot_id: Number(data.planning_slot_id),
      lesson_type: data.lesson_type,
      status: data.status || 'scheduled',
      instructor_id: Number(data.instructor_id),
      actual_instructor_id: data.actual_instructor_id ? Number(data.actual_instructor_id) : null,
      min_participants: data.min_participants ? Number(data.min_participants) : null,
      max_participants: Number(data.max_participants) || lessonType.defaultMax,
      cancellation_reason: data.cancellation_reason || null,
      is_modified: data.is_modified || false,
      modified_fields: data.modified_fields || null,
    };

    const response = await calendarApi.post('/lessons', validated);
    return response.data;
  },

  /**
   * Update lesson
   * @param {number} id - Lesson ID
   * @param {Object} data - Lesson data
   * @returns {Promise<Object>} Updated lesson
   */
  update: async (id, data) => {
    const response = await calendarApi.put(`/lessons/${id}`, data);
    return response.data;
  },

  /**
   * Add participant to lesson
   * @param {number} lessonId - Lesson ID
   * @param {Object} participant - Participant data
   * @returns {Promise<Object>} Added participant
   */
  addParticipant: async (lessonId, participant) => {
    const validated = {
      rider_id: Number(participant.rider_id),
      horse_id: participant.horse_id ? Number(participant.horse_id) : null,
      horse_assignment_type: participant.horse_assignment_type || 'primary',
    };
    const response = await calendarApi.post(`/lessons/${lessonId}/participants`, validated);
    return response.data;
  },

  /**
   * Remove participant from lesson
   * @param {number} lessonId - Lesson ID
   * @param {number} participantId - Participant ID (rider_id)
   * @returns {Promise<Object>} Deletion result
   */
  removeParticipant: async (lessonId, participantId) => {
    const response = await calendarApi.delete(`/lessons/${lessonId}/participants/${participantId}`);
    return response.data;
  },

  /**
   * Get lesson types
   * @returns {Array} Lesson types
   */
  getLessonTypes: () => LESSON_TYPES,

  /**
   * Get lesson statuses
   * @returns {Object} Lesson statuses
   */
  getLessonStatuses: () => LESSON_STATUSES,
};

/**
 * Planning Slots API - /calendar/slots
 */
export const slotsApi = {
  /**
   * Get all slots
   * @param {Object} params - Query parameters
   * @returns {Promise<Array>} Slots
   */
  getAll: async (params = {}) => {
    const response = await calendarApi.get('/slots', { params });
    return response.data;
  },

  /**
   * Create slot
   * @param {Object} data - Slot data
   * @returns {Promise<Object>} Created slot
   */
  create: async (data) => {
    const validated = {
      start_at: data.start_at,
      end_at: data.end_at,
      all_day: data.all_day || false,
      type: data.type,
    };

    // Validate type
    if (!Object.values(PLANNING_SLOT_TYPES).includes(validated.type)) {
      throw new Error('Type de slot invalide');
    }

    // Validate end_at > start_at
    if (new Date(validated.end_at) <= new Date(validated.start_at)) {
      throw new Error('La date de fin doit être après la date de début');
    }

    const response = await calendarApi.post('/slots', validated);
    return response.data;
  },

  /**
   * Get slot types
   * @returns {Object} Slot types
   */
  getSlotTypes: () => PLANNING_SLOT_TYPES,
};

/**
 * Schedule API (if implemented in backend)
 */
export const scheduleApi = {
  /**
   * Get week schedule
   * @param {string} date - Date in week
   * @param {boolean} excludeBlocked - Exclude blocked periods
   * @returns {Promise<Object>} Week data
   */
  getWeek: async (date, excludeBlocked = false) => {
    const response = await calendarApi.get('/schedule/week', {
      params: { date, exclude_blocked: excludeBlocked ? 'true' : undefined },
    });
    return response.data;
  },
};

export default { lessonsApi, slotsApi, scheduleApi };
