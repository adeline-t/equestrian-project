import { isActive } from '../filters/activityFilters';

/**
 * Calculate statistics for horses list
 * @param {Array} horses - Array of horse objects
 * @returns {Object} Statistics object with counts
 */
export function calculateHorseStats(horses) {
  return {
    total: horses.length,
    horses: horses.filter((h) => h.kind === 'horse').length,
    ponies: horses.filter((h) => h.kind === 'pony').length,
    active: horses.filter((h) => isActive(h.activity_start_date, h.activity_end_date)).length,
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
