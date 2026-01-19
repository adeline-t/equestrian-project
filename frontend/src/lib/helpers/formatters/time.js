/**
 * Time formatting and calculation utilities
 */

// Dans lib/helpers/formatters.js

/**
 * Convertit une chaîne "HH:MM" en minutes depuis minuit
 */
export function timeToMinutes(timeStr) {
  if (typeof timeStr !== 'string') {
    console.warn('timeToMinutes received non-string:', timeStr);
    return 0;
  }

  const [hours, minutes] = timeStr.split(':').map(Number);

  if (isNaN(hours) || isNaN(minutes)) {
    console.warn('timeToMinutes could not parse:', timeStr);
    return 0;
  }

  return hours * 60 + minutes;
}

/**
 * Convertit des minutes depuis minuit en format "HH:MM"
 */
export function minutesToTime(minutes) {
  if (typeof minutes !== 'number' || isNaN(minutes)) {
    console.warn('minutesToTime received invalid input:', minutes);
    return '00:00';
  }

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
 * Calculate event style positioning
 * @param {Object} event - Lesson object
 * @param {number} HOUR_HEIGHT - Height of one hour in pixels
 * @param {number} START_HOUR - Calendar start hour
 * @param {number} END_HOUR - Calendar end hour
 * @returns {Object} Style object with top and height
 */
export function calculateLessonStyle(event, HOUR_HEIGHT = 60, START_HOUR = 8, END_HOUR = 22) {
  if (!event?.start_time || !event?.end_time) {
    return { display: 'none' };
  }

  const startMinutes = timeToMinutes(event.start_time);
  const endMinutes = timeToMinutes(event.end_time);
  const dayStartMinutes = START_HOUR * 60;
  const dayEndMinutes = END_HOUR * 60;

  // Check if event is outside visible hours
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
