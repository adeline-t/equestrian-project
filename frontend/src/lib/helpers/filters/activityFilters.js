/**
 * Activity Filters - Check if entities are active based on dates
 */

/**
 * Activity status filter options
 */
export const ACTIVITY_STATUS_FILTERS = {
  ALL: 'all',
  ACTIVE: 'active',
  INACTIVE: 'inactive',
};

/**
 * Generic filter options - Common values used across the app
 */
export const COMMON_FILTERS = {
  ALL: 'all',
  ACTIVE: 'active',
  INACTIVE: 'inactive',
};

/**
 * Check if an item is currently active based on start and end dates
 * @param {string} startDate - Activity start date (ISO string or date string)
 * @param {string} endDate - Activity end date (ISO string or date string)
 * @returns {boolean} True if the item is active
 */
export function isActive(startDate, endDate) {
  const now = new Date();
  const start = startDate ? new Date(startDate) : null;
  const end = endDate ? new Date(endDate) : null;

  if (start && start > now) return false;
  if (end && end < now) return false;
  return true;
}

/**
 * Check if an item is in the past
 * @param {string} endDate - Activity end date
 * @returns {boolean} True if the item is in the past
 */
export function isPast(endDate) {
  if (!endDate) return false;
  const end = new Date(endDate);
  const now = new Date();
  return end < now;
}

/**
 * Check if an item is in the future
 * @param {string} startDate - Activity start date
 * @returns {boolean} True if the item is in the future
 */
export function isFuture(startDate) {
  if (!startDate) return false;
  const start = new Date(startDate);
  const now = new Date();
  return start > now;
}
