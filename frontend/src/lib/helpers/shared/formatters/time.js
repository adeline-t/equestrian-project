/**
 * Time formatting and calculation utilities
 */

/**
 * Convert time string to minutes
 * @param {string} timeStr - Time in HH:MM format
 * @returns {number} Total minutes
 */
export function timeToMinutes(timeStr) {
  if (!timeStr) return 0;
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + (minutes || 0);
}

/**
 * Convert minutes to time string
 * @param {number} minutes - Total minutes
 * @returns {string} Time in HH:MM format
 */
export function minutesToTime(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

/**
 * Format time string for display
 * @param {string} timeStr - Time in HH:MM format
 * @returns {string} Formatted time
 */
export function formatTime(timeStr) {
  if (!timeStr) return '';
  const [hours, minutes] = timeStr.split(':');
  return `${hours}:${minutes}`;
}

/**
 * Calculate lesson style positioning
 * @param {Object} lesson - Lesson object
 * @param {number} HOUR_HEIGHT - Height of one hour in pixels
 * @param {number} START_HOUR - Calendar start hour
 * @param {number} END_HOUR - Calendar end hour
 * @returns {Object} Style object with top and height
 */
export function calculateLessonStyle(lesson, HOUR_HEIGHT = 60, START_HOUR = 8, END_HOUR = 22) {
  if (!lesson?.start_time || !lesson?.end_time) {
    return { display: 'none' };
  }

  const startMinutes = timeToMinutes(lesson.start_time);
  const endMinutes = timeToMinutes(lesson.end_time);
  const dayStartMinutes = START_HOUR * 60;
  const dayEndMinutes = END_HOUR * 60;

  // Check if lesson is outside visible hours
  if (endMinutes <= dayStartMinutes || startMinutes >= dayEndMinutes) {
    return { display: 'none' };
  }

  // Clamp start and end to visible hours
  const clampedStart = Math.max(startMinutes, dayStartMinutes);
  const clampedEnd = Math.min(endMinutes, dayEndMinutes);

  const top = (clampedStart - dayStartMinutes) * (HOUR_HEIGHT / 60);
  const height = (clampedEnd - clampedStart) * (HOUR_HEIGHT / 60);

  return {
    top: `${top}px`,
    height: `${height}px`,
  };
}

/**
 * Calculate selection style positioning
 * @param {string} selectionStart - Start time in HH:MM format
 * @param {string} selectionEnd - End time in HH:MM format
 * @param {number} HOUR_HEIGHT - Height of one hour in pixels
 * @param {number} START_HOUR - Calendar start hour
 * @param {number} END_HOUR - Calendar end hour
 * @returns {Object|null} Style object or null if invalid
 */
export function calculateSelectionStyle(
  selectionStart,
  selectionEnd,
  HOUR_HEIGHT = 60,
  START_HOUR = 8,
  END_HOUR = 22
) {
  if (!selectionStart || !selectionEnd) return null;

  const startMinutes = timeToMinutes(selectionStart);
  const endMinutes = timeToMinutes(selectionEnd);
  const dayStartMinutes = START_HOUR * 60;
  const dayEndMinutes = END_HOUR * 60;

  // Ensure start is before end
  const minMinutes = Math.min(startMinutes, endMinutes);
  const maxMinutes = Math.max(startMinutes, endMinutes);

  if (maxMinutes <= dayStartMinutes || minMinutes >= dayEndMinutes) {
    return null;
  }

  const clampedStart = Math.max(minMinutes, dayStartMinutes);
  const clampedEnd = Math.min(maxMinutes, dayEndMinutes);

  const top = (clampedStart - dayStartMinutes) * (HOUR_HEIGHT / 60);
  const height = (clampedEnd - clampedStart) * (HOUR_HEIGHT / 60);

  return {
    top: `${top}px`,
    height: `${height}px`,
  };
}
