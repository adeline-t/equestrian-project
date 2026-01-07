/**
 * Lesson filtering utilities
 */

/**
 * Filter lessons by type and status
 * @param {Array} lessons - Array of lesson objects
 * @param {Object} filters - Filter criteria
 * @param {string} filters.lessonType - Lesson type filter ('all' or specific type)
 * @param {string} filters.status - Status filter ('all' or specific status)
 * @param {boolean} filters.showBlocked - Whether to show blocked lessons
 * @returns {Array} Filtered lessons
 */
export function filterLessons(lessons, filters = {}) {
  if (!lessons || !Array.isArray(lessons)) return [];

  const { lessonType = 'all', status = 'all', showBlocked = true } = filters;

  return lessons.filter((lesson) => {
    // Filter by lesson type
    if (lessonType !== 'all' && lesson.lesson_type !== lessonType) {
      return false;
    }

    // Filter by status
    if (status !== 'all' && lesson.status !== status) {
      return false;
    }

    // Filter blocked lessons
    if (!showBlocked && lesson.lesson_type === 'blocked') {
      return false;
    }

    return true;
  });
}

/**
 * Filter lessons by date range
 * @param {Array} lessons - Array of lesson objects
 * @param {string} startDate - Start date (ISO format)
 * @param {string} endDate - End date (ISO format)
 * @returns {Array} Filtered lessons
 */
export function filterLessonsByDateRange(lessons, startDate, endDate) {
  if (!lessons || !Array.isArray(lessons)) return [];

  const start = new Date(startDate);
  const end = new Date(endDate);

  return lessons.filter((lesson) => {
    if (!lesson.lesson_date) return false;
    const lessonDate = new Date(lesson.lesson_date);
    return lessonDate >= start && lessonDate <= end;
  });
}

/**
 * Filter lessons by time range
 * @param {Array} lessons - Array of lesson objects
 * @param {string} startTime - Start time (HH:MM format)
 * @param {string} endTime - End time (HH:MM format)
 * @returns {Array} Filtered lessons
 */
export function filterLessonsByTimeRange(lessons, startTime, endTime) {
  if (!lessons || !Array.isArray(lessons)) return [];

  return lessons.filter((lesson) => {
    if (!lesson.start_time || !lesson.end_time) return false;
    return lesson.start_time >= startTime && lesson.end_time <= endTime;
  });
}

/**
 * Group lessons by date
 * @param {Array} lessons - Array of lesson objects
 * @returns {Object} Lessons grouped by date
 */
export function groupLessonsByDate(lessons) {
  if (!lessons || !Array.isArray(lessons)) return {};

  return lessons.reduce((acc, lesson) => {
    const date = lesson.lesson_date || 'unknown';
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(lesson);
    return acc;
  }, {});
}
