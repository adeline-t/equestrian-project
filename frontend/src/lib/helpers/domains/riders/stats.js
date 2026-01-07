/**
 * Rider statistics and filtering utilities
 */

import { isActive } from '../../shared/filters/activityFilters.js';

/**
 * Calculate statistics for riders list
 * @param {Array} riders - Array of rider objects
 * @returns {Object} Statistics object
 */
export function calculateRiderStats(riders) {
  return {
    total: riders.length,
    active: riders.filter((r) => isActive(r.activity_start_date, r.activity_end_date)).length,
    inactive: riders.filter((r) => !isActive(r.activity_start_date, r.activity_end_date)).length,
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
