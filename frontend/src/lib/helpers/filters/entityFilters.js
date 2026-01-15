/**
 * Entity Filter Utilities - Filter arrays of entities by activity status
 */

import { isActive } from './activityFilters';

/**
 * Filter packages to return only active ones
 * @param {Array} packages - Array of package objects
 * @returns {Array} Filtered array of active packages
 */
export function filterActivePackages(packages) {
  if (!packages || !Array.isArray(packages)) return [];
  return packages.filter((pkg) => pkg.is_active);
}

/**
 * Filter pairings to return only active ones (both pairing and horse must be active)
 * @param {Array} pairings - Array of pairing objects
 * @returns {Array} Filtered array of active pairings
 */
export function filterActivePairings(pairings) {
  if (!pairings || !Array.isArray(pairings)) return [];
  return pairings.filter((pairing) => {
    const pairingActive = isActive(pairing.pairing_start_date, pairing.pairing_end_date);
    const horseActive =
      pairing.horses &&
      isActive(pairing.horses.activity_start_date, pairing.horses.activity_end_date);
    return pairingActive && horseActive;
  });
}

/**
 * Filter riders to return only active ones
 * @param {Array} riders - Array of rider objects
 * @returns {Array} Filtered array of active riders
 */
export function filterActiveRiders(riders) {
  if (!riders || !Array.isArray(riders)) return [];
  return riders.filter((rider) => isActive(rider.activity_start_date, rider.activity_end_date));
}
