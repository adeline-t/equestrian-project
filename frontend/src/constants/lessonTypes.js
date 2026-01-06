import { Icons } from '../lib/libraries/icons.jsx';

/**
 * Lesson type configurations
 */
export const LESSON_TYPES = [
  {
    value: 'private',
    label: 'Cours particulier',
    icon: Icons.PrivateLesson,
    color: '#007bff',
    defaultMax: 1,
  },
  {
    value: 'group',
    label: 'Cours collectif',
    icon: Icons.GroupLesson,
    color: '#28a745',
    defaultMax: 6,
  },
  {
    value: 'training',
    label: 'Stage',
    icon: Icons.Training,
    color: '#ffc107',
    defaultMax: 10,
  },
  {
    value: 'competition',
    label: 'Concours',
    icon: Icons.Competition,
    color: '#dc3545',
    defaultMax: 20,
  },
  {
    value: 'event',
    label: 'Événement',
    icon: Icons.Event,
    color: '#6f42c1',
    defaultMax: 50,
  },
  {
    value: 'blocked',
    label: 'Période bloquée',
    icon: Icons.Blocked,
    color: '#6c757d',
    defaultMax: null,
  },
];

/**
 * Get lesson type icon component
 */
export const getLessonTypeIcon = (type) => {
  const lessonType = LESSON_TYPES.find((t) => t.value === type);
  return lessonType?.icon || Icons.Calendar;
};

/**
 * Get lesson type label
 */
export const getLessonTypeLabel = (type) => {
  const lessonType = LESSON_TYPES.find((t) => t.value === type);
  return lessonType?.label || type;
};

/**
 * Get lesson type configuration
 */
export const getLessonTypeConfig = (type) => {
  return LESSON_TYPES.find((t) => t.value === type);
};

/**
 * Check if lesson type is blocked
 */
export const isBlockedLesson = (type) => {
  return type === 'blocked';
};

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
