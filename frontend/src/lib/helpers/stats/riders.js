/**
 * Rider statistics and filtering utilities
 */

import { isActive } from '../filters/activityFilters';

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
