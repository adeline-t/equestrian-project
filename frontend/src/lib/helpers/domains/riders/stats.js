/**
 * Rider statistics and filtering utilities
 */

import { isActive } from '../../shared/filters/activityFilters.js';

/**
 * Calculate riders statistics
 * @param {Array} riders - array of riders
 * @returns {Object} statistics (total, active, inactive)
 */
export const calculateRiderStats = (riders) => {
  if (!riders || !Array.isArray(riders)) {
    return { total: 0, active: 0, inactive: 0 };
  }

  const total = riders.length;
  const active = riders.filter((r) => isActive(r.activity_start_date, r.activity_end_date)).length;
  const inactive = total - active;

  return { total, active, inactive };
};

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
