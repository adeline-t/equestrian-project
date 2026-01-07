/**
 * Lesson Card Helper Functions
 */

import { LESSON_TYPES } from '../../../domains/lessons/types';

/**
 * Get lesson card background color based on lesson type
 */
export const getLessonColor = (lessonType) => {
  // Convert object to array of values
  const lessonTypesArray = Object.values(LESSON_TYPES);
  const config = lessonTypesArray.find((t) => t.value === lessonType);
  return config?.color || '#6c757d';
};

/**
 * Check if lesson is short (compact display)
 * @param {Object} lesson - Lesson object
 * @returns {boolean} True if lesson is short
 */
export const isShortLesson = (lesson) => {
  if (!lesson.duration_minutes) return true;
  return lesson.duration_minutes < 60;
};

/**
 * Check if lesson is blocked type
 * @param {Object} lesson - Lesson object
 * @returns {boolean} True if lesson is blocked
 */
export const isBlockedLesson = (lesson) => {
  return lesson.lesson_type === 'blocked';
};

/**
 * Determine if card should use compact layout
 * @param {Object} lesson - Lesson object
 * @returns {boolean} True if should use compact layout
 */
export const shouldUseCompactLayout = (lesson) => {
  return isShortLesson(lesson) && !isBlockedLesson(lesson);
};

/**
 * Get lesson layout type
 * @param {Object} lesson - Lesson object
 * @returns {string} 'compact' or 'standard'
 */
export const getLessonLayout = (lesson) => {
  return shouldUseCompactLayout(lesson) ? 'compact' : 'standard';
};
