/**
 * Filter options constants (Consolidated)
 */

import { RIDER_KIND_LABELS } from './riders/kinds';

/**
 * Calendar lesson type filter options
 */
export const CALENDAR_LESSON_TYPE_FILTERS = [
  { value: 'all', label: 'Tous les types' },
  { value: 'private', label: 'Cours Particulier' },
  { value: 'group', label: 'Cours Collectif' },
  { value: 'training', label: 'Stage' },
  { value: 'competition', label: 'Concours' },
  { value: 'event', label: 'Événement' },
];

/**
 * Calendar status filter options
 */
export const CALENDAR_STATUS_FILTERS = [
  { value: 'all', label: 'Tous les statuts' },
  { value: 'scheduled', label: 'Planifiés' },
  { value: 'confirmed', label: 'Confirmés' },
  { value: 'cancelled', label: 'Annulés' },
];

/**
 * Template lesson type filter options
 */
export const TEMPLATE_LESSON_TYPE_FILTERS = [
  { value: 'all', label: 'Tous les types' },
  { value: 'private', label: 'Cours Particulier' },
  { value: 'group', label: 'Cours Collectif' },
  { value: 'training', label: 'Stage' },
  { value: 'competition', label: 'Concours' },
  { value: 'event', label: 'Événement' },
  { value: 'blocked', label: 'Plage Bloquée' },
];

/**
 * Template status filter options
 */
export const TEMPLATE_STATUS_FILTERS = [
  { value: 'all', label: 'Tous les statuts' },
  { value: 'active', label: 'Actifs seulement' },
  { value: 'inactive', label: 'Inactifs seulement' },
];

/**
 * Horse filter options
 */
export const HORSE_KIND_FILTERS = {
  ALL: 'all',
  HORSE: 'horse',
  PONY: 'pony',
};

/**
 * Activity status filter options
 */
export const ACTIVITY_STATUS_FILTERS = {
  ALL: 'all',
  ACTIVE: 'active',
  INACTIVE: 'inactive',
};

/**
 * Package status filter options
 */
export const PACKAGE_STATUS_FILTERS = {
  ALL: 'all',
  ACTIVE: 'active',
  EXPIRED: 'expired',
  SUSPENDED: 'suspended',
};

/**
 * Pairing status filter options
 */
export const PAIRING_STATUS_FILTERS = {
  ALL: 'all',
  ACTIVE: 'active',
  INACTIVE: 'inactive',
};

/**
 * Generic filter options - Common values used across the app
 */
export const COMMON_FILTERS = {
  ALL: 'all',
  ACTIVE: 'active',
  INACTIVE: 'inactive',
};

/**
 * Rider kind filters
 * Includes an "ALL" option plus all rider kind types
 */
export const RIDER_KIND_FILTERS = [
  { value: 'all', label: 'Tous types' },
  { value: RIDER_KIND_LABELS.OWNER.value, label: RIDER_KIND_LABELS.OWNER.label },
  { value: RIDER_KIND_LABELS.CLUB.value, label: RIDER_KIND_LABELS.CLUB.label },
  { value: RIDER_KIND_LABELS.BOARDER.value, label: RIDER_KIND_LABELS.BOARDER.label },
];
