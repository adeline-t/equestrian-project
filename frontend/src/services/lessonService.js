/**
 * Lesson Service - Handles all lesson-related API operations
 */
import { LESSON_STATUSES, LESSON_TYPES } from '../lib/domain/lessons.js';
import { api, createCrudOperations } from './apiService.js';

const lessonService = {
  // Basic CRUD operations for /lessons
  ...createCrudOperations('lessons'),

  /**
   * Create lesson with validation
   * @param {Object} data - Lesson data
   * @returns {Promise<Object>} Created lesson
   */
  create: async (data) => {
    const lessonType = LESSON_TYPES.find((t) => t.value === data.lesson_type);
    if (!lessonType) {
      throw new Error('Type de leçon invalide');
    }

    const validatedData = {
      planning_slot_id: Number(data.planning_slot_id),
      lesson_type: data.lesson_type,
      status: data.status || 'scheduled',
      instructor_id: Number(data.instructor_id),
      actual_instructor_id: data.actual_instructor_id ? Number(data.actual_instructor_id) : null,
      min_participants: data.min_participants ? Number(data.min_participants) : null,
      max_participants: data.max_participants
        ? Number(data.max_participants)
        : lessonType.defaultMax,
      cancellation_reason: data.cancellation_reason || null,
      is_modified: data.is_modified || false,
      modified_fields: data.modified_fields || null,
    };

    const response = await api.post('/lessons', validatedData);
    return response.data;
  },

  /**
   * Update lesson with validation
   * @param {number} id - Lesson ID
   * @param {Object} data - Lesson data
   * @returns {Promise<Object>} Updated lesson
   */
  update: async (id, data) => {
    if (data.lesson_type) {
      const lessonType = LESSON_TYPES.find((t) => t.value === data.lesson_type);
      if (!lessonType) {
        throw new Error('Type de leçon invalide');
      }
    }

    const validatedData = {
      lesson_type: data.lesson_type,
      status: data.status,
      instructor_id: data.instructor_id ? Number(data.instructor_id) : undefined,
      actual_instructor_id: data.actual_instructor_id
        ? Number(data.actual_instructor_id)
        : undefined,
      min_participants: data.min_participants ? Number(data.min_participants) : undefined,
      max_participants: data.max_participants ? Number(data.max_participants) : undefined,
      cancellation_reason: data.cancellation_reason,
      is_modified: data.is_modified,
      modified_fields: data.modified_fields,
    };

    // Remove undefined values
    Object.keys(validatedData).forEach(
      (key) => validatedData[key] === undefined && delete validatedData[key]
    );

    const response = await api.put(`/lessons/${id}`, validatedData);
    return response.data;
  },

  /**
   * Get participants for a lesson
   * @param {number} id - Lesson ID
   * @returns {Promise<Array>} Lesson participants
   */
  getParticipants: async (id) => {
    const response = await api.get(`/lessons/${id}/participants`);
    return response.data;
  },

  /**
   * Add participant to a lesson
   * @param {number} lessonId - Lesson ID
   * @param {Object} participantData - Participant data
   * @returns {Promise<Object>} Added participant
   */
  addParticipant: async (lessonId, participantData) => {
    const validatedData = {
      rider_id: Number(participantData.rider_id),
      horse_id: participantData.horse_id ? Number(participantData.horse_id) : null,
      horse_assignment_type: participantData.horse_assignment_type || 'primary',
    };

    const response = await api.post(`/lessons/${lessonId}/participants`, validatedData);
    return response.data;
  },

  /**
   * Remove participant from a lesson
   * @param {number} lessonId - Lesson ID
   * @param {number} participantId - Participant ID
   * @returns {Promise<Object>} Deletion result
   */
  removeParticipant: async (lessonId, participantId) => {
    const response = await api.delete(`/lessons/${lessonId}/participants/${participantId}`);
    return response.data;
  },

  /**
   * Get lessons by date range
   * @param {string} startDate - Start date (ISO format)
   * @param {string} endDate - End date (ISO format)
   * @returns {Promise<Array>} Lessons in date range
   */
  getByDateRange: async (startDate, endDate) => {
    const response = await api.get('/calendar/lessons', {
      params: { start_date: startDate, end_date: endDate },
    });
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

  /**
   * Get lesson type configuration
   * @param {string} typeValue - Lesson type value
   * @returns {Object|undefined} Lesson type config
   */
  getLessonTypeConfig: (typeValue) => LESSON_TYPES.find((t) => t.value === typeValue),
};

export default lessonService;
