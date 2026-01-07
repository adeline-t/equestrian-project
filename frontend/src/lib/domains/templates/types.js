/**
 * Template lesson type configurations
 * Re-exports from lessons/types to avoid duplication
 */
export {
  LESSON_TYPES,
  getLessonTypeIcon,
  getLessonTypeLabel,
  getLessonTypeConfig,
  isBlockedLesson,
  getLessonTypeMaxParticipants,
  getLessonTypeMinParticipants,
} from '../lessons/types.js';

/**
 * Get template lesson type by value (alias for compatibility)
 * @param {string} value - Lesson type value
 * @returns {Object} Lesson type configuration
 * @deprecated Use getLessonTypeConfig instead
 */
export const getTemplateLessonType = (value) => {
  return getLessonTypeConfig(value);
};