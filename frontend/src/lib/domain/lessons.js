/**
 * Lesson/Event Type Configuration
 * Maps to event_type ENUM in database
 */

import { Icons } from '../icons';

export const EVENT_TYPES = {
  LESSON: 'event',
  EVENT: 'event',
  BLOCKED: 'blocked',
  SERVICE: 'service',
  LOANER_FREE_TIME: 'loaner_free_time',
};

export const EVENT_TYPE_CONFIG = {
  [EVENT_TYPES.LESSON]: {
    value: 'event',
    label: 'Cours',
    icon: Icons.Horse,
    color: '#3b82f6', // blue
    description: 'Cours régulier',
  },
  [EVENT_TYPES.EVENT]: {
    value: 'event',
    label: 'Événement',
    icon: Icons.Calendar,
    color: '#8b5cf6', // purple
    description: 'Événement spécial',
  },
  [EVENT_TYPES.BLOCKED]: {
    value: 'blocked',
    label: 'Bloqué',
    icon: Icons.Blocked,
    color: '#6b7280', // gray
    description: 'Créneau bloqué',
  },
  [EVENT_TYPES.SERVICE]: {
    value: 'service',
    label: 'Service',
    icon: Icons.Settings,
    color: '#06b6d4', // cyan
    description: 'Service équestre',
  },
  [EVENT_TYPES.LOANER_FREE_TIME]: {
    value: 'loaner_free_time',
    label: 'Temps libre DP',
    icon: Icons.Clock,
    color: '#10b981', // green
    description: 'Temps libre demi-pension',
  },
};

/**
 * Get event type configuration
 */
export function getLessonTypeConfig(type) {
  return EVENT_TYPE_CONFIG[type] || EVENT_TYPE_CONFIG[EVENT_TYPES.LESSON];
}

/**
 * Get event type icon component
 */
export function getLessonTypeIcon(type) {
  const config = getLessonTypeConfig(type);
  return config.icon;
}

/**
 * Get event type color
 */
export function getLessonTypeColor(type) {
  const config = getLessonTypeConfig(type);
  return config.color;
}

/**
 * Get event type label
 */
export function getLessonTypeLabel(type) {
  const config = getLessonTypeConfig(type);
  return config.label;
}

/**
 * Get all event types for select options
 */
export function getLessonTypeOptions() {
  return Object.values(EVENT_TYPE_CONFIG).map((config) => ({
    value: config.value,
    label: config.label,
  }));
}

/**
 * Lesson/Event Status Configuration
 * Maps to event_status ENUM in planning_slots.slot_status
 */

import { Icons } from '../icons';

export const EVENT_STATUSES = {
  SCHEDULED: 'scheduled',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

export const EVENT_STATUS_CONFIG = {
  [EVENT_STATUSES.SCHEDULED]: {
    value: 'scheduled',
    label: 'Planifié',
    icon: Icons.Clock,
    color: '#64748b', // slate
    bgColor: '#f1f5f9',
    description: 'Cours planifié mais non confirmé',
  },
  [EVENT_STATUSES.CONFIRMED]: {
    value: 'confirmed',
    label: 'Confirmé',
    icon: Icons.Check,
    color: '#16a34a', // green
    bgColor: '#dcfce7',
    description: 'Cours confirmé',
  },
  [EVENT_STATUSES.COMPLETED]: {
    value: 'completed',
    label: 'Terminé',
    icon: Icons.CheckCircle,
    color: '#0891b2', // cyan
    bgColor: '#cffafe',
    description: 'Cours terminé',
  },
  [EVENT_STATUSES.CANCELLED]: {
    value: 'cancelled',
    label: 'Annulé',
    icon: Icons.Close,
    color: '#dc2626', // red
    bgColor: '#fee2e2',
    description: 'Cours annulé',
  },
};

/**
 * Get status configuration
 */
export function getStatusConfig(status) {
  return EVENT_STATUS_CONFIG[status] || EVENT_STATUS_CONFIG[EVENT_STATUSES.SCHEDULED];
}

/**
 * Get status badge configuration for UI
 */
export function getStatusBadge(status) {
  const config = getStatusConfig(status);
  return {
    label: config.label,
    icon: config.icon,
    color: config.color,
    bgColor: config.bgColor,
  };
}

/**
 * Get status icon component
 */
export function getStatusIcon(status) {
  const config = getStatusConfig(status);
  return config.icon;
}

/**
 * Get status color
 */
export function getStatusColor(status) {
  const config = getStatusConfig(status);
  return config.color;
}

/**
 * Get status label
 */
export function getStatusLabel(status) {
  const config = getStatusConfig(status);
  return config.label;
}

/**
 * Get all statuses for select options
 */
export function getStatusOptions() {
  return Object.values(EVENT_STATUS_CONFIG).map((config) => ({
    value: config.value,
    label: config.label,
  }));
}

/**
 * Lesson Formatters
 * Helper functions for formatting event/event data from new schema
 */

import { getLessonTypeColor } from '../../../domains/events/types';

/**
 * Get color for event card based on event type
 */
export function getLessonColor(eventType) {
  return getLessonTypeColor(eventType);
}

/**
 * Check if event should use compact layout
 * Compact when duration < 60 minutes
 */
export function shouldUseCompactLayout(event) {
  if (!event) return false;
  return event.duration_minutes < 60;
}

/**
 * Check if event is a blocked time slot
 */
export function isBlockedLesson(event) {
  if (!event) return false;
  return event.event_type === 'blocked';
}

/**
 * Check if event is cancelled
 */
export function isCancelledLesson(event) {
  if (!event) return false;
  return event.status === 'cancelled';
}

/**
 * Check if event is confirmed
 */
export function isConfirmedLesson(event) {
  if (!event) return false;
  return event.status === 'confirmed';
}

/**
 * Check if event is completed
 */
export function isCompletedLesson(event) {
  if (!event) return false;
  return event.status === 'completed';
}

/**
 * Get event display name
 */
export function getLessonDisplayName(event) {
  if (!event) return 'Cours';

  if (event.name) return event.name;

  // Generate name based on type
  switch (event.event_type) {
    case 'event':
      return 'Cours';
    case 'event':
      return 'Événement';
    case 'service':
      return 'Service';
    case 'loaner_free_time':
      return 'Temps libre DP';
    case 'blocked':
      return event.cancellation_reason || 'Période bloquée';
    default:
      return 'Activité';
  }
}

/**
 * Format participants count display
 */
export function formatParticipantsCount(event) {
  if (!event) return '';

  const count = event.participant_count || 0;
  const max = event.max_participants || 0;

  if (max === 0) return '';

  return `${count}/${max}`;
}

/**
 * Check if event has participants
 */
export function hasParticipants(event) {
  if (!event) return false;
  return (event.participant_count || 0) > 0;
}

/**
 * Check if event is full
 */
export function isLessonFull(event) {
  if (!event) return false;
  if (!event.max_participants || event.max_participants === 0) return false;

  return (event.participant_count || 0) >= event.max_participants;
}

/**
 * Get event capacity percentage
 */
export function getLessonCapacityPercentage(event) {
  if (!event || !event.max_participants || event.max_participants === 0) return 0;

  return Math.round(((event.participant_count || 0) / event.max_participants) * 100);
}
