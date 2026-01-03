/**
 * Lesson status configurations
 */

export const LESSON_STATUSES = {
  SCHEDULED: 'scheduled',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  BLOCKED: 'blocked',
};

export const LESSON_STATUS_LABELS = {
  [LESSON_STATUSES.SCHEDULED]: 'Planifié',
  [LESSON_STATUSES.CONFIRMED]: 'Confirmé',
  [LESSON_STATUSES.COMPLETED]: 'Terminé',
  [LESSON_STATUSES.CANCELLED]: 'Annulé',
  [LESSON_STATUSES.BLOCKED]: 'Bloqué',
};

/**
 * Get status label
 * @param {string} status - Status value
 * @returns {string} Human-readable label
 */
export const getStatusLabel = (status) => {
  return LESSON_STATUS_LABELS[status] || status;
};

/**
 * Participation status configurations
 */
export const PARTICIPATION_STATUSES = {
  CONFIRMED: 'confirmed',
  PENDING: 'pending',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
};

export const PARTICIPATION_STATUS_LABELS = {
  [PARTICIPATION_STATUSES.CONFIRMED]: 'Confirmé',
  [PARTICIPATION_STATUSES.PENDING]: 'En attente',
  [PARTICIPATION_STATUSES.CANCELLED]: 'Annulé',
  [PARTICIPATION_STATUSES.COMPLETED]: 'Terminé',
};

/**
 * Horse assignment types
 */
export const HORSE_ASSIGNMENT_TYPES = {
  AUTO: 'auto',
  MANUAL: 'manual',
  NONE: 'none',
};