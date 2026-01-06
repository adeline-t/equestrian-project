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
 * Get participation status label
 * @param {string} status - Status value
 * @returns {string} Human-readable label
 */
export const getParticipationStatusLabel = (status) => {
  return PARTICIPATION_STATUS_LABELS[status] || status;
};