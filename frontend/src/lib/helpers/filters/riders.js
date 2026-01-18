/**
 * Rider-specific filter utilities
 */

import { isActive } from './activityFilters.js';
import { ACTIVITY_STATUS_FILTERS, COMMON_FILTERS } from './activityFilters.js';

/**
 * Get active items for a rider
 * @param {Object} rider - Rider object
 * @returns {Object} Active items
 */
export function getRiderActiveItems(rider) {
  return {
    packages: rider.packages ? rider.packages.filter((p) => p.is_active) : [],
    pairings: rider.pairings
      ? rider.pairings.filter((p) => isActive(p.pairing_start_date, p.pairing_end_date))
      : [],
    horses: rider.horses
      ? rider.horses.filter((h) => isActive(h.activity_start_date, h.activity_end_date))
      : [],
  };
}

/**
 * Filter riders by status
 * @param {Array} riders - Array of rider objects
 * @param {string} filter - Filter type ('all', 'active', 'inactive')
 * @returns {Array} Filtered riders
 */
export function filterRidersByStatus(riders, filter) {
  if (filter === 'all') return riders;
  return riders.filter((rider) => {
    const isActiveRider = isActive(rider.activity_start_date, rider.activity_end_date);
    return filter === 'active' ? isActiveRider : !isActiveRider;
  });
}

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
