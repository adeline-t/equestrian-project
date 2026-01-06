import { Icons } from '../../../lib/libraries/icons.jsx';

/**
 * Lesson status configurations
 */
export const LESSON_STATUSES = {
  SCHEDULED: 'scheduled',
  CONFIRMED: 'confirmed',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
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
  in_progress: {
    label: 'En cours',
    icon: Icons.Clock,
    color: '#0c5460',
    bgColor: '#d1ecf1',
  },
  completed: {
    label: 'Terminé',
    icon: Icons.Check,
    color: '#155724',
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
 */
export const getStatusBadge = (status) => {
  return STATUS_BADGES[status] || STATUS_BADGES.scheduled;
};

/**
 * Get status label
 */
export const getStatusLabel = (status) => {
  return STATUS_BADGES[status]?.label || status;
};