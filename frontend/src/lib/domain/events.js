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
    icon: Icons.PrivateLesson,
    description: 'Cours individuel',
  },

  [EVENT_TYPES.GROUPED_LESSON]: {
    value: EVENT_TYPES.GROUPED_LESSON,
    label: 'Cours collectif',
    icon: Icons.GroupLesson,
    description: 'Cours en groupe',
  },

  [EVENT_TYPES.SPECIAL]: {
    value: EVENT_TYPES.SPECIAL,
    label: 'Spécial',
    icon: Icons.Lesson,
    description: 'Événement spécial',
  },

  [EVENT_TYPES.COMPETITION]: {
    value: EVENT_TYPES.COMPETITION,
    label: 'Compétition',
    icon: Icons.Competition,
    description: 'Compétition',
  },

  [EVENT_TYPES.BLOCKED]: {
    value: EVENT_TYPES.BLOCKED,
    label: 'Bloqué',
    icon: Icons.Blocked,
    description: 'Créneau bloqué',
  },

  [EVENT_TYPES.SERVICE]: {
    value: EVENT_TYPES.SERVICE,
    label: 'Service',
    icon: Icons.Service,
    description: 'Service équestre',
  },

  [EVENT_TYPES.LOANER_FREE_TIME]: {
    value: EVENT_TYPES.LOANER_FREE_TIME,
    label: 'Temps libre DP',
    icon: Icons.Horse,
    description: 'Temps libre demi-pension',
  },
};

/* -------------------------------------------------------
 * EVENT TYPE HELPERS
 * ----------------------------------------------------- */

export function getEventTypeConfig(type) {
  return EVENT_TYPE_CONFIG[type] || null;
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
    description: 'Planifié mais non confirmé',
  },
  [SLOT_STATUSES.CONFIRMED]: {
    value: 'confirmed',
    label: 'Confirmé',
    icon: Icons.Check,
    description: 'Confirmé',
  },
  [SLOT_STATUSES.COMPLETED]: {
    value: 'completed',
    label: 'Terminé',
    icon: Icons.CheckCircle,
    description: 'Terminé',
  },
  [SLOT_STATUSES.CANCELLED]: {
    value: 'cancelled',
    label: 'Annulé',
    icon: Icons.Close,
    description: 'Annulé',
  },
};

/* -------------------------------------------------------
 * STATUS HELPERS
 * ----------------------------------------------------- */

export function getStatusConfig(status) {
  return SLOT_STATUS_CONFIG[status] || SLOT_STATUS_CONFIG[SLOT_STATUSES.SCHEDULED];
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

export function isBlockedEvent(event) {
  return event?.event_type === EVENT_TYPES.BLOCKED;
}
