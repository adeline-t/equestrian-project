/**
 * Domain: Lessons (aligné DB)
 */
export const PLANNING_SLOT_TYPES = {
  LESSON: 'lesson',
  BLOCKED: 'blocked',
  SERVICE: 'service',
  BOARDER_FREE_TIME: 'boarder_free_time',
};

export const LESSON_STATUSES = {
  SCHEDULED: 'scheduled',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  BLOCKED: 'blocked',
};

export const LESSON_TYPES = [
  { value: 'private', label: 'Cours particulier', defaultMax: 1, minP: 1, maxP: 1 },
  { value: 'group', label: 'Cours collectif', defaultMax: 6, minP: 2, maxP: 8 },
  { value: 'training', label: 'Stage', defaultMax: 10, minP: 3, maxP: 12 },
  { value: 'competition', label: 'Concours', defaultMax: 20, minP: 1, maxP: null },
  { value: 'event', label: 'Événement', defaultMax: 50, minP: 1, maxP: null },
  { value: 'blocked', label: 'Période bloquée', defaultMax: null, minP: 0, maxP: 0 },
];

export const HORSE_ASSIGNMENT_TYPES = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  BACKUP: 'backup',
};
