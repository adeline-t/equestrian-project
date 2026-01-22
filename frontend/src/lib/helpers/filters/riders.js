/**
 * Rider-specific filter utilities
 */

import { isActive } from './activityFilters.js';
import { ACTIVITY_STATUS_FILTERS, COMMON_FILTERS } from './activityFilters.js';

/**
 * Filter riders based on criteria
 * @param {Array} riders - array of riders
 * @param {Object} filters - filter criteria
 * @param {string} filters.activityStatus - activity status filter (ACTIVITY_STATUS_FILTERS)
 * @param {string} filters.riderType - rider type filter (owner, club, loaner, or 'all')
 * @returns {Array} filtered riders
 */
export const filterRiders = (riders, filters = {}) => {
  if (!riders || !Array.isArray(riders)) {
    return [];
  }

  let filtered = [...riders];

  // Filter by activity status
  if (filters.activityStatus) {
    if (filters.activityStatus === ACTIVITY_STATUS_FILTERS.ACTIVE) {
      filtered = filtered.filter((rider) =>
        isActive(rider.activity_start_date, rider.activity_end_date)
      );
    } else if (filters.activityStatus === ACTIVITY_STATUS_FILTERS.INACTIVE) {
      filtered = filtered.filter(
        (rider) => !isActive(rider.activity_start_date, rider.activity_end_date)
      );
    }
    // If ACTIVITY_STATUS_FILTERS.ALL, no filtering needed
  }

  // Filter by rider type
  if (filters.riderType && filters.riderType !== COMMON_FILTERS.ALL) {
    filtered = filtered.filter((rider) => rider.rider_type === filters.riderType);
  }

  return filtered;
};
