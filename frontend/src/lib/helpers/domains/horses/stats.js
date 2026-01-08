/**
 * Horse statistics and filtering utilities
 */

import { isActive } from '../../shared/filters/activityFilters.js';

/**
 * Calculate statistics for horses list
 * @param {Array} horses - Array of horse objects
 * @returns {Object} Statistics object
 */
export function calculateHorseStats(horses) {
  return {
    total: horses.length,
    horse: horses.filter((h) => h.kind === 'horse').length,
    pony: horses.filter((h) => h.kind === 'pony').length,
    active: horses.filter((h) => isActive(h.activity_start_date, h.activity_end_date)).length,
    inactive: horses.filter((h) => !isActive(h.activity_start_date, h.activity_end_date)).length,
  };
}
/**
 * Filter horses by kind
 * @param {Array} horses - Array of horse objects
 * @param {string} filter - Filter type ('all', 'horse', 'pony')
 * @returns {Array} Filtered horses
 */
export function filterHorsesByKind(horses, filter) {
  if (filter === 'all') return horses;
  return horses.filter((horse) => horse.kind === filter);
}

/**
 * Filter horses by activity status
 * @param {Array} horses - Array of horse objects
 * @param {string} filter - Filter type ('all', 'active', 'inactive')
 * @returns {Array} Filtered horses
 */
export function filterHorsesByStatus(horses, filter) {
  if (filter === 'all') return horses;
  if (filter === 'active') {
    return horses.filter((h) => isActive(h.activity_start_date, h.activity_end_date));
  }
  if (filter === 'inactive') {
    return horses.filter((h) => !isActive(h.activity_start_date, h.activity_end_date));
  }
  return horses;
}
