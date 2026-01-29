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
    description: 'Cours individuel',
    icon: Icons.PrivateLesson,
    slotClass: 'slot-private',
    max_participants: 1,
  },

  [EVENT_TYPES.GROUPED_LESSON]: {
    value: EVENT_TYPES.GROUPED_LESSON,
    label: 'Cours collectif',
    description: 'Cours en groupe',
    icon: Icons.GroupLesson,
    slotClass: 'slot-grouped',
    max_participants: 6,
  },

  [EVENT_TYPES.SPECIAL]: {
    value: EVENT_TYPES.SPECIAL,
    label: 'Spécial',
    description: 'Événement spécial',
    icon: Icons.Lesson,
    slotClass: 'slot-special',
    max_participants: 1,
  },

  [EVENT_TYPES.COMPETITION]: {
    value: EVENT_TYPES.COMPETITION,
    label: 'Compétition',
    description: 'Compétition',
    icon: Icons.Competition,
    slotClass: 'slot-competition',
    max_participants: 6,
  },

  [EVENT_TYPES.BLOCKED]: {
    value: EVENT_TYPES.BLOCKED,
    label: 'Bloqué',
    description: 'Créneau bloqué',
    icon: Icons.Blocked,
    slotClass: 'slot-blocked',
    max_participants: 0,
  },

  [EVENT_TYPES.SERVICE]: {
    value: EVENT_TYPES.SERVICE,
    label: 'Service',
    description: 'Service équestre',
    icon: Icons.Service,
    slotClass: 'slot-service',
    max_participants: 1,
  },

  [EVENT_TYPES.LOANER_FREE_TIME]: {
    value: EVENT_TYPES.LOANER_FREE_TIME,
    label: 'Temps libre DP',
    description: 'Temps libre demi-pension',
    icon: Icons.Horse,
    slotClass: 'slot-loaner',
    max_participants: 1,
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

export function getEventTypesOptionForMode(mode) {
  if (mode === 'admin') {
    return getEventTypeOptions().filter((o) => o.value !== EVENT_TYPES.BLOCKED);
  }

  return getEventTypeOptions().filter((o) =>
    [EVENT_TYPES.PRIVATE_LESSON, EVENT_TYPES.LOANER_FREE_TIME, EVENT_TYPES.SERVICE].includes(
      o.value
    )
  );
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
