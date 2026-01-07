/**
 * Pairing statistics and filtering utilities
 */

import { isActive } from '../../shared/filters/activityFilters.js';

/**
 * Calculate statistics for pairings list
 * @param {Array} pairings - Array of pairing objects
 * @returns {Object} Statistics object
 */
export function calculatePairingStats(pairings) {
  return {
    total: pairings.length,
    active: pairings.filter((p) => isActive(p.pairing_start_date, p.pairing_end_date)).length,
    inactive: pairings.filter((p) => !isActive(p.pairing_start_date, p.pairing_end_date)).length,
  };
}

/**
 * Filter pairings by status
 * @param {Array} pairings - Array of pairing objects
 * @param {string} filter - Filter type ('all', 'active', 'inactive')
 * @returns {Array} Filtered pairings
 */
export function filterPairingsByStatus(pairings, filter) {
  if (filter === 'all') return pairings;
  return pairings.filter((pairing) => {
    const isActivePairing = isActive(pairing.pairing_start_date, pairing.pairing_end_date);
    return filter === 'active' ? isActivePairing : !isActivePairing;
  });
}
