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

/**
 * Check if participation is confirmed
 * @param {string} status - Status value
 * @returns {boolean} True if confirmed
 */
export const isParticipationConfirmed = (status) => {
  return status === PARTICIPATION_STATUSES.CONFIRMED;
};

/**
 * Check if participation is pending
 * @param {string} status - Status value
 * @returns {boolean} True if pending
 */
export const isParticipationPending = (status) => {
  return status === PARTICIPATION_STATUSES.PENDING;
};

/**
 * Check if participation is cancelled
 * @param {string} status - Status value
 * @returns {boolean} True if cancelled
 */
export const isParticipationCancelled = (status) => {
  return status === PARTICIPATION_STATUSES.CANCELLED;
};

/**
 * Check if participation is completed
 * @param {string} status - Status value
 * @returns {boolean} True if completed
 */
export const isParticipationCompleted = (status) => {
  return status === PARTICIPATION_STATUSES.COMPLETED;
};