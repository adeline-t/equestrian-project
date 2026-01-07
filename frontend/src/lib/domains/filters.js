/**
 * Filter options constants (Consolidated)
 */

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