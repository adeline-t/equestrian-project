/**
 * Date utility helpers
 */

/**
 * Get today's date in ISO format (YYYY-MM-DD)
 * @returns {string} Today's date in ISO format
 */
export const getTodayISO = () => {
  return new Date().toISOString().split('T')[0];
};

/**
 * Get current datetime in ISO format
 * @returns {string} Current datetime in ISO format
 */
export const getNowISO = () => {
  return new Date().toISOString();
};
