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
    const horseObj = pairing.horse || pairing.horses || null;
    const horseActive =
      horseObj && typeof horseObj === 'object'
        ? isActive(horseObj.activity_start_date, horseObj.activity_end_date)
        : true;
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

/**
 * Calendar Filters Configuration
 * Updated for new schema with event_type and event_status
 */

export const CALENDAR_EVENT_TYPE_FILTERS = [
  { value: 'all', label: 'Tous les types' },
  { value: 'lesson', label: 'Cours' },
  { value: 'event', label: 'Événements' },
  { value: 'service', label: 'Services' },
  { value: 'loaner_free_time', label: 'Temps libre DP' },
  { value: 'blocked', label: 'Bloqués' },
];

export const CALENDAR_STATUS_FILTERS = [
  { value: 'all', label: 'Tous les statuts' },
  { value: 'scheduled', label: 'Planifiés' },
  { value: 'confirmed', label: 'Confirmés' },
  { value: 'completed', label: 'Terminés' },
  { value: 'cancelled', label: 'Annulés' },
];

export const CALENDAR_DEFAULT_FILTERS = {
  eventType: 'all',
  status: 'all',
};

/**
 * Filter events based on filter criteria
 */
export function filterLessons(events, filters) {
  if (!events || !Array.isArray(events)) {
    return [];
  }

  return events.filter((event) => {
    // Filter by event type
    if (filters.eventType !== 'all' && event.event_type !== filters.eventType) {
      return false;
    }

    // Filter by status
    if (filters.status !== 'all' && event.status !== filters.status) {
      return false;
    }

    return true;
  });
}
