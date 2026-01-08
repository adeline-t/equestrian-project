import { Icons } from '../../icons';

/**
 * Lesson status configurations
 */
export const LESSON_STATUSES = {
  SCHEDULED: 'scheduled',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  BLOCKED: 'blocked',
};

export const STATUS_BADGES = {
  scheduled: {
    label: 'Planifié',
    icon: Icons.Calendar,
    color: '#ff9500ff',
    bgColor: '#ffffffff',
  },
  confirmed: {
    label: 'Confirmé',
    icon: Icons.Check,
    color: '#28a745',
    bgColor: '#d4edda',
  },
  cancelled: {
    label: 'Annulé',
    icon: Icons.Close,
    color: '#721c24',
    bgColor: '#f8d7da',
  },
  blocked: {
    label: 'Bloqué',
    icon: Icons.Blocked,
    color: '#6c757d',
    bgColor: '#e2e3e5',
  },
};

/**
 * Get status badge configuration
 * @param {string} status - Status value
 * @returns {Object} Badge configuration with label, icon, color, bgColor
 */
export const getStatusBadge = (status) => {
  return STATUS_BADGES[status] || STATUS_BADGES.scheduled;
};

/**
 * Get status label
 * @param {string} status - Status value
 * @returns {string} Human-readable label
 */
export const getStatusLabel = (status) => {
  return STATUS_BADGES[status]?.label || status;
};

/**
 * Check if lesson is scheduled
 * @param {string} status - Status value
 * @returns {boolean} True if scheduled
 */
export const isLessonScheduled = (status) => {
  return status === LESSON_STATUSES.SCHEDULED;
};

/**
 * Check if lesson is confirmed
 * @param {string} status - Status value
 * @returns {boolean} True if confirmed
 */
export const isLessonConfirmed = (status) => {
  return status === LESSON_STATUSES.CONFIRMED;
};

/**
 * Check if lesson is cancelled
 * @param {string} status - Status value
 * @returns {boolean} True if cancelled
 */
export const isLessonCancelled = (status) => {
  return status === LESSON_STATUSES.CANCELLED;
};

/**
 * Check if lesson is blocked
 * @param {string} status - Status value
 * @returns {boolean} True if blocked
 */
export const isLessonBlocked = (status) => {
  return status === LESSON_STATUSES.BLOCKED;
};

/**
 * Check if lesson can be modified
 * @param {string} status - Status value
 * @returns {boolean} True if lesson can be modified
 */
export const isLessonModifiable = (status) => {
  return !isLessonCancelled(status);
};
