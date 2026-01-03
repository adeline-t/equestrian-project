/**
 * Time formatting utilities
 */

/**
 * Format time string to HH:MM format
 * @param {string} time - Time string (e.g., "14:30:00" or "14:30")
 * @returns {string} Formatted time in HH:MM format
 */
export const formatTime = (time) => {
  if (!time) return '';
  return time.substring(0, 5); // HH:MM format
};

/**
 * Parse time string to minutes since midnight
 * @param {string} time - Time string in HH:MM format
 * @returns {number} Minutes since midnight
 */
export const timeToMinutes = (time) => {
  if (!time) return 0;
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

/**
 * Convert minutes since midnight to time string
 * @param {number} minutes - Minutes since midnight
 * @returns {string} Time string in HH:MM format
 */
export const minutesToTime = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
};

/**
 * Add minutes to a time string
 * @param {string} time - Time string in HH:MM format
 * @param {number} minutesToAdd - Minutes to add
 * @returns {string} New time string in HH:MM format
 */
export const addMinutesToTime = (time, minutesToAdd) => {
  const totalMinutes = timeToMinutes(time) + minutesToAdd;
  return minutesToTime(totalMinutes);
};

/**
 * Calculate duration between two times
 * @param {string} startTime - Start time in HH:MM format
 * @param {string} endTime - End time in HH:MM format
 * @returns {number} Duration in minutes
 */
export const calculateDurationInMinutes = (startTime, endTime) => {
  if (!startTime || !endTime) return 0;
  
  const startMinutes = timeToMinutes(startTime);
  const endMinutes = timeToMinutes(endTime);
  
  return endMinutes - startMinutes;
};