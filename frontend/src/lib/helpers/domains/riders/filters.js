/**
 * Rider-specific filter utilities
 */

import { isActive } from '../../shared/filters/activityFilters.js';

/**
 * Calculate statistics for riders list
 * @param {Array} riders - Array of rider objects
 * @returns {Object} Statistics object with counts
 */
export function calculateRiderStatsWithPackages(riders) {
  return {
    total: riders.length,
    active: riders.filter((r) => isActive(r.activity_start_date, r.activity_end_date)).length,
    withActivePackages: riders.filter(
      (r) =>
        r.packages &&
        r.packages.filter((p) => isActive(p.activity_start_date, p.activity_end_date)).length > 0
    ).length,
  };
}

/**
 * Get active items for a rider
 * @param {Object} rider - Rider object
 * @returns {Object} Active items
 */
export function getRiderActiveItems(rider) {
  return {
    packages: rider.packages
      ? rider.packages.filter((p) => isActive(p.activity_start_date, p.activity_end_date))
      : [],
    pairings: rider.pairings
      ? rider.pairings.filter((p) => isActive(p.pairing_start_date, p.pairing_end_date))
      : [],
    horses: rider.horses
      ? rider.horses.filter((h) => isActive(h.activity_start_date, h.activity_end_date))
      : [],
  };
}
