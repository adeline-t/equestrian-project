/**
 * Helpers formatters barrel
 */

export * from './time.js';
export * from './date.js';
export * from './duration.js';

// Re-export for backward compatibility
export {
  timeToMinutes,
  minutesToTime,
  formatTime,
  formatTimeFlexible,
  formatTimeForInput,
  formatTimeForDatabase,
  calculateLessonStyle,
  calculateSelectionStyle,
  formatTimeForDisplay,
} from './time.js';

export { formatWeekTitle, formatDate, formatDateTime, formatDateForInput } from './date.js';

export { formatDuration, calculateDurationMinutes, addMinutesToTime } from './duration.js';
