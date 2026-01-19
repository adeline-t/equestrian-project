/**
 * Entity Filter Utilities - Filter arrays of entities by activity status
 */

import { isActive } from './activityFilters';
import { EVENT_TYPES } from '../../domain/events';

/* -------------------------------------------------------
 * ACTIVE ENTITY FILTERS
 * ----------------------------------------------------- */

export function filterActivePackages(packages) {
  if (!Array.isArray(packages)) return [];
  return packages.filter((pkg) => pkg.is_active);
}

export function filterActivePairings(pairings) {
  if (!Array.isArray(pairings)) return [];

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

export function filterActiveRiders(riders) {
  if (!Array.isArray(riders)) return [];
  return riders.filter((rider) => isActive(rider.activity_start_date, rider.activity_end_date));
}

/* -------------------------------------------------------
 * CALENDAR FILTER CONFIGURATION
 * (semantic → DB event_type mapping)
 * ----------------------------------------------------- */

export const CALENDAR_EVENT_TYPE_FILTERS = [
  { value: 'all', label: 'Tous les types' },

  {
    value: 'lessons',
    label: 'Cours',
    eventTypes: [EVENT_TYPES.PRIVATE_LESSON, EVENT_TYPES.GROUPED_LESSON],
  },

  {
    value: EVENT_TYPES.SPECIAL,
    label: 'Événements spéciaux',
    eventTypes: [EVENT_TYPES.SPECIAL],
  },

  {
    value: EVENT_TYPES.COMPETITION,
    label: 'Compétitions',
    eventTypes: [EVENT_TYPES.COMPETITION],
  },

  {
    value: EVENT_TYPES.SERVICE,
    label: 'Services',
    eventTypes: [EVENT_TYPES.SERVICE],
  },

  {
    value: EVENT_TYPES.LOANER_FREE_TIME,
    label: 'Temps libre DP',
    eventTypes: [EVENT_TYPES.LOANER_FREE_TIME],
  },

  {
    value: EVENT_TYPES.BLOCKED,
    label: 'Bloqués',
    eventTypes: [EVENT_TYPES.BLOCKED],
  },
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

/* -------------------------------------------------------
 * EVENT FILTER LOGIC
 * ----------------------------------------------------- */

export function filterLessons(events, filters) {
  if (!Array.isArray(events)) return [];

  return events.filter((event) => {
    // ---- Event type filter
    if (filters.eventType !== 'all') {
      const filterConfig = CALENDAR_EVENT_TYPE_FILTERS.find((f) => f.value === filters.eventType);

      if (!filterConfig || !filterConfig.eventTypes?.includes(event.event_type)) {
        return false;
      }
    }

    // ---- Status filter
    if (filters.status !== 'all' && event.status !== filters.status) {
      return false;
    }

    return true;
  });
}
