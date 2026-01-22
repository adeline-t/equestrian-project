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

// Filtres de type de cheval
export const HORSE_KIND_FILTERS = {
  ALL: 'all',
  HORSE: 'horse',
  PONY: 'pony',
};

// Filtres de type de propriétaire
export const OWNERSHIP_TYPE_FILTERS = {
  ALL: 'all',
  LAURY: 'laury',
  PRIVATE_OWNER: 'private_owner',
  CLUB: 'club',
  OTHER: 'other',
};
