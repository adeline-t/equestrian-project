/**
 * Event Type & Status Configuration
 * Maps to event_type and event_status ENUMs in database
 */

import { Icons } from '../icons';

/* -------------------------------------------------------
 * EVENT TYPES
 * ----------------------------------------------------- */

export const EVENT_TYPES = {
  PRIVATE_LESSON: 'private_lesson',
  GROUPED_LESSON: 'grouped_lesson',
  SPECIAL: 'special',
  COMPETITION: 'competition',
  BLOCKED: 'blocked',
  SERVICE: 'service',
  LOANER_FREE_TIME: 'loaner_free_time',
};

export const EVENT_TYPE_CONFIG = {
  [EVENT_TYPES.PRIVATE_LESSON]: {
    value: EVENT_TYPES.PRIVATE_LESSON,
    label: 'Cours particulier',
    icon: Icons.Horse,
    color: '#3b82f6',
    description: 'Cours individuel',
  },

  [EVENT_TYPES.GROUPED_LESSON]: {
    value: EVENT_TYPES.GROUPED_LESSON,
    label: 'Cours collectif',
    icon: Icons.Users,
    color: '#2563eb',
    description: 'Cours en groupe',
  },

  [EVENT_TYPES.SPECIAL]: {
    value: EVENT_TYPES.SPECIAL,
    label: 'Spécial',
    icon: Icons.Star,
    color: '#8b5cf6',
    description: 'Événement spécial',
  },

  [EVENT_TYPES.COMPETITION]: {
    value: EVENT_TYPES.COMPETITION,
    label: 'Compétition',
    icon: Icons.Trophy,
    color: '#f59e0b',
    description: 'Compétition',
  },

  [EVENT_TYPES.BLOCKED]: {
    value: EVENT_TYPES.BLOCKED,
    label: 'Bloqué',
    icon: Icons.Blocked,
    color: '#6b7280',
    description: 'Créneau bloqué',
  },

  [EVENT_TYPES.SERVICE]: {
    value: EVENT_TYPES.SERVICE,
    label: 'Service',
    icon: Icons.Settings,
    color: '#06b6d4',
    description: 'Service équestre',
  },

  [EVENT_TYPES.LOANER_FREE_TIME]: {
    value: EVENT_TYPES.LOANER_FREE_TIME,
    label: 'Temps libre DP',
    icon: Icons.Clock,
    color: '#10b981',
    description: 'Temps libre demi-pension',
  },
};

/* -------------------------------------------------------
 * EVENT TYPE HELPERS
 * ----------------------------------------------------- */

export function getEventTypeConfig(type) {
  return EVENT_TYPE_CONFIG[type] || null;
}

export function getEventTypeIcon(type) {
  return getEventTypeConfig(type)?.icon;
}

export function getEventTypeColor(type) {
  return getEventTypeConfig(type)?.color;
}

export function getEventTypeLabel(type) {
  return getEventTypeConfig(type)?.label;
}

export function getEventTypeOptions() {
  return Object.values(EVENT_TYPE_CONFIG).map((config) => ({
    value: config.value,
    label: config.label,
  }));
}

/* -------------------------------------------------------
 * SLOT STATUSES
 * ----------------------------------------------------- */

export const SLOT_STATUSES = {
  SCHEDULED: 'scheduled',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

export const SLOT_STATUS_CONFIG = {
  [SLOT_STATUSES.SCHEDULED]: {
    value: 'scheduled',
    label: 'Planifié',
    icon: Icons.Clock,
    color: '#64748b',
    bgColor: '#f1f5f9',
    description: 'Planifié mais non confirmé',
  },
  [SLOT_STATUSES.CONFIRMED]: {
    value: 'confirmed',
    label: 'Confirmé',
    icon: Icons.Check,
    color: '#16a34a',
    bgColor: '#dcfce7',
    description: 'Confirmé',
  },
  [SLOT_STATUSES.COMPLETED]: {
    value: 'completed',
    label: 'Terminé',
    icon: Icons.CheckCircle,
    color: '#0891b2',
    bgColor: '#cffafe',
    description: 'Terminé',
  },
  [SLOT_STATUSES.CANCELLED]: {
    value: 'cancelled',
    label: 'Annulé',
    icon: Icons.Close,
    color: '#dc2626',
    bgColor: '#fee2e2',
    description: 'Annulé',
  },
};

/* -------------------------------------------------------
 * STATUS HELPERS
 * ----------------------------------------------------- */

export function getStatusConfig(status) {
  return SLOT_STATUS_CONFIG[status] || SLOT_STATUS_CONFIG[SLOT_STATUSES.SCHEDULED];
}

export function getStatusBadge(status) {
  const config = getStatusConfig(status);
  return {
    label: config.label,
    icon: config.icon,
    color: config.color,
    bgColor: config.bgColor,
  };
}

export function getStatusIcon(status) {
  return getStatusConfig(status)?.icon;
}

export function getStatusColor(status) {
  return getStatusConfig(status)?.color;
}

export function getStatusLabel(status) {
  return getStatusConfig(status)?.label;
}

export function getStatusOptions() {
  return Object.values(SLOT_STATUS_CONFIG).map((config) => ({
    value: config.value,
    label: config.label,
  }));
}

/* -------------------------------------------------------
 * EVENT FORMATTERS
 * ----------------------------------------------------- */

export function getEventColor(eventType) {
  return getEventTypeColor(eventType);
}

export function shouldUseCompactLayout(event) {
  return event && event.duration_minutes < 60;
}

export function isBlockedEvent(event) {
  return event?.event_type === EVENT_TYPES.BLOCKED;
}

// helpers/eventsHelpers.js
export function isBlockedEventFull(selectedEvent) {
  if (!selectedEvent) return false;

  // Vérifie d'abord le slot
  if (selectedEvent.slot?.event_type === 'blocked') return true;

  // Vérifie l'event complet si disponible
  if (selectedEvent.event?.event_type === 'blocked') return true;

  return false;
}

export function isCancelledEvent(event) {
  return event?.status === SLOT_STATUSES.CANCELLED;
}

export function isConfirmedEvent(event) {
  return event?.status === SLOT_STATUSES.CONFIRMED;
}

export function isCompletedEvent(event) {
  return event?.status === SLOT_STATUSES.COMPLETED;
}

export function getEventDisplayName(event) {
  if (!event) return 'Cours';
  if (event.name) return event.name;

  switch (event.event_type) {
    case EVENT_TYPES.PRIVATE_LESSON:
      return 'Cours particulier';
    case EVENT_TYPES.GROUPED_LESSON:
      return 'Cours collectif';
    case EVENT_TYPES.SPECIAL:
      return 'Événement spécial';
    case EVENT_TYPES.COMPETITION:
      return 'Compétition';
    case EVENT_TYPES.SERVICE:
      return 'Service';
    case EVENT_TYPES.LOANER_FREE_TIME:
      return 'Temps libre DP';
    case EVENT_TYPES.BLOCKED:
      return event.cancellation_reason || 'Période bloquée';
    default:
      return 'Activité';
  }
}

export function formatParticipantsCount(event) {
  if (!event) return '';
  const count = event.participant_count || 0;
  const max = event.max_participants || 0;
  return max > 0 ? `${count}/${max}` : '';
}

export function hasParticipants(event) {
  return (event?.participant_count || 0) > 0;
}

export function isEventFull(event) {
  if (!event || !event.max_participants) return false;
  return (event.participant_count || 0) >= event.max_participants;
}

export function getEventCapacityPercentage(event) {
  if (!event || !event.max_participants) return 0;
  return Math.round(((event.participant_count || 0) / event.max_participants) * 100);
}
