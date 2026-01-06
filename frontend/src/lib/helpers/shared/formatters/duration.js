/**
 * Duration formatting utilities
 */

/**
 * Format duration in minutes to human-readable string
 * @param {number} minutes - Duration in minutes
 * @returns {string} Formatted duration (e.g., "1h 30min", "45 min")
 */
export const formatDuration = (minutes) => {
  if (!minutes || minutes <= 0) return '0 min';

  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${remainingMinutes}min`;
};

/**
 * Calculate and format duration between two times
 * @param {string} startTime - Start time in HH:MM format
 * @param {string} endTime - End time in HH:MM format
 * @returns {string} Formatted duration
 */
export const calculateDuration = (startTime, endTime) => {
  if (!startTime || !endTime) return '0 min';

  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);

  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;

  const durationMinutes = endMinutes - startMinutes;

  return formatDuration(durationMinutes);
};