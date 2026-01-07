/**
 * Lesson validation utilities
 */
import { LESSON_TYPES } from '../../../domains/lessons/types';

/**
 * Validate lesson time range
 * @param {string} startTime - Start time in HH:MM format
 * @param {string} endTime - End time in HH:MM format
 * @returns {Object} Validation result with isValid and error message
 */
export const validateLessonTime = (startTime, endTime) => {
  if (!startTime || !endTime) {
    return {
      isValid: false,
      error: 'Les heures de début et de fin sont requises',
    };
  }

  if (startTime >= endTime) {
    return {
      isValid: false,
      error: "L'heure de fin doit être après l'heure de début",
    };
  }

  return { isValid: true, error: null };
};

/**
 * Validate lesson participants
 * @param {number} currentCount - Current participant count
 * @param {number} maxParticipants - Maximum allowed participants
 * @returns {Object} Validation result
 */
export const validateParticipantCount = (currentCount, maxParticipants) => {
  if (maxParticipants && currentCount >= maxParticipants) {
    return {
      isValid: false,
      error: 'Le nombre maximum de participants est atteint',
    };
  }

  return { isValid: true, error: null };
};

/**
 * Validate lesson form data
 * @param {Object} formData - Lesson form data
 * @returns {Object} Validation result with isValid and errors object
 */
export const validateLessonForm = (formData) => {
  const errors = {};

  // Date validation
  if (!formData.lesson_date) {
    errors.lesson_date = 'La date du cours est requise';
  }

  // Time validation
  const timeValidation = validateLessonTime(formData.start_time, formData.end_time);
  if (!timeValidation.isValid) {
    errors.time = timeValidation.error;
  }

  // Type validation
  if (!formData.type) {
    errors.type = 'Le type de cours est requis';
  } else {
    // Validate that type exists in LESSON_TYPES
    const lessonType = Object.values(LESSON_TYPES).find((t) => t.value === formData.type);
    if (!lessonType) {
      errors.type = 'Type de cours invalide';
    }
  }

  // Participants validation
  if (formData.type !== 'blocked') {
    if (formData.min_participants && formData.max_participants) {
      if (parseInt(formData.min_participants) > parseInt(formData.max_participants)) {
        errors.participants = 'Le minimum ne peut pas être supérieur au maximum';
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate lesson is within visible hours
 * @param {Object} lesson - Lesson object
 * @param {number} START_HOUR - Calendar start hour
 * @param {number} END_HOUR - Calendar end hour
 * @returns {boolean} True if lesson is visible
 */
export const isLessonVisible = (lesson, START_HOUR = 8, END_HOUR = 22) => {
  if (!lesson?.start_time || !lesson?.end_time) return false;

  const timeToMinutes = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + (minutes || 0);
  };

  const startMinutes = timeToMinutes(lesson.start_time);
  const endMinutes = timeToMinutes(lesson.end_time);
  const dayStartMinutes = START_HOUR * 60;
  const dayEndMinutes = END_HOUR * 60;

  return !(endMinutes <= dayStartMinutes || startMinutes >= dayEndMinutes);
};

/**
 * Get valid lessons for display
 * @param {Array} lessons - Array of lesson objects
 * @param {number} START_HOUR - Calendar start hour
 * @param {number} END_HOUR - Calendar end hour
 * @returns {Array} Valid lessons
 */
export const getValidLessons = (lessons, START_HOUR = 8, END_HOUR = 22) => {
  if (!lessons || !Array.isArray(lessons)) return [];

  return lessons.filter((lesson) => isLessonVisible(lesson, START_HOUR, END_HOUR));
};
