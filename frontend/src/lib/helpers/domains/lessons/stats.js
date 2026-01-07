/**
 * Lesson statistics utilities
 */

import {
  isLessonConfirmed,
  isLessonBlocked,
  isLessonCompleted,
} from '../../../domains/lessons/statuses';

/**
 * Calculate calendar statistics
 * @param {Object} weekData - Week data with days and lessons
 * @returns {Object} Statistics object
 */
export function calculateCalendarStats(weekData) {
  if (!weekData || !weekData.days) {
    return { total: 0, confirmed: 0, blocked: 0, completed: 0 };
  }

  // Flatten all lessons from all days
  const allLessons = weekData.days.flatMap((day) => day.lessons || []);

  return {
    total: allLessons.length,
    confirmed: allLessons.filter((l) => isLessonConfirmed(l.status)).length,
    blocked: allLessons.filter((l) => isLessonBlocked(l.status)).length,
    completed: allLessons.filter((l) => isLessonCompleted(l.status)).length,
  };
}

/**
 * Calculate day statistics
 * @param {Array} lessons - Array of lesson objects
 * @returns {Object} Statistics object
 */
export function calculateDayStats(lessons) {
  if (!lessons || !Array.isArray(lessons)) {
    return { total: 0, confirmed: 0, blocked: 0, completed: 0 };
  }

  return {
    total: lessons.length,
    confirmed: lessons.filter((l) => isLessonConfirmed(l.status)).length,
    blocked: lessons.filter((l) => isLessonBlocked(l.status)).length,
    completed: lessons.filter((l) => isLessonCompleted(l.status)).length,
  };
}

/**
 * Get lesson count by type
 * @param {Array} lessons - Array of lesson objects
 * @returns {Object} Count by lesson type
 */
export function getLessonCountByType(lessons) {
  if (!lessons || !Array.isArray(lessons)) {
    return {};
  }

  return lessons.reduce((acc, lesson) => {
    const type = lesson.lesson_type || 'unknown';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});
}

/**
 * Get lesson count by status
 * @param {Array} lessons - Array of lesson objects
 * @returns {Object} Count by status
 */
export function getLessonCountByStatus(lessons) {
  if (!lessons || !Array.isArray(lessons)) {
    return {};
  }

  return lessons.reduce((acc, lesson) => {
    const status = lesson.status || 'unknown';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});
}
