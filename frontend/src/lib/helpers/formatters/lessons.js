/**
 * Lesson Card Helper Functions
 */

import { LESSON_TYPES } from '../../../constants/lessonTypes.js';

/**
 * Get lesson card background color based on lesson type
 * @param {string} lessonType - Type of lesson
 * @returns {string} Hex color code
 */
export const getLessonColor = (lessonType) => {
  const lessonTypeConfig = LESSON_TYPES.find((t) => t.value === lessonType);
  return lessonTypeConfig?.color || '#6c757d';
};

/**
 * Check if lesson is short (compact display)
 */
export const isShortLesson = (lesson) => {
  if (!lesson.duration_minutes) return true;
  return lesson.duration_minutes <= 76;
};

/**
 * Check if lesson is blocked type
 */
export const isBlockedLesson = (lesson) => {
  return lesson.lesson_type === 'blocked';
};

/**
 * Determine if card should use compact layout
 */
export const shouldUseCompactLayout = (lesson) => {
  return isShortLesson(lesson) && !isBlockedLesson(lesson);
};
