# 📁 Project Files Export

Generated on: Mon Jan 26 21:28:05 CET 2026

## 📄 api.js
**Path:** `config/api.js`

```
/**
 * API - Consolidated configuration
 * Endpoints, errors, settings and helpers
 */

/* Error codes and messages */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};

export const ERROR_MESSAGES = {
  NETWORK: 'Erreur de connexion. Veuillez vérifier votre internet.',
  TIMEOUT: 'La demande a expiré. Veuillez réessayer.',
  UNAUTHORIZED: 'Vous devez vous connecter pour accéder à cette ressource.',
  FORBIDDEN: "Vous n'avez pas les permissions pour accéder à cette ressource.",
  NOT_FOUND: "La ressource demandée n'existe pas.",
  SERVER_ERROR: 'Une erreur serveur est survenue. Veuillez réessayer plus tard.',
  UNKNOWN: 'Une erreur inconnue est survenue.',
};

/* API settings */
export const API_SETTINGS = {
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
  CACHE_DURATION: 300000,
};
```

---

## 📄 index.js
**Path:** `config/index.js`

```
/**
 * Config barrel
 */
export * from './api.js';
export * from './ui.js';
```

---

## 📄 ui.js
**Path:** `config/ui.js`

```
/**
 * UI Constants - Unified
 * Toutes les couleurs sont dans base.css
 */

/* ============================================
   MODAL
   ============================================ */

export const MODAL_SIZES = {
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large',
  XLARGE: 'xlarge',
};

/* ============================================
   CARD STYLES
   ============================================ */

export const CARD_STYLES = {
  base: {
    border: 'none',
    borderRadius: '6px',
    color: 'white',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  compact: {
    minHeight: '40px',
    padding: '4px 6px',
  },
  standard: {
    minHeight: '60px',
    padding: '6px 8px',
  },
};

/* ============================================
   TEXT STYLES
   ============================================ */

export const TEXT_STYLES = {
  compact: {
    name: { fontSize: '10px', fontWeight: '500' },
    time: { fontSize: '9px' },
    label: { fontSize: '9px' },
  },
  standard: {
    name: { fontSize: '11px', fontWeight: '600' },
    time: { fontSize: '11px', fontWeight: '500' },
    label: { fontSize: '11px' },
    duration: { fontSize: '10px' },
  },
};

export function getSlotLayout(duration) {
  if (duration <= 59) return 'ultra-compact';
  if (duration <= 60) return 'compact';
  if (duration <= 90) return 'medium';
  return 'full';
}
```

---

## 📄 calendar.js
**Path:** `domain/calendar.js`

```
import { timeToMinutes } from '../helpers/formatters';

export function calculateSlotPosition(slot, HOUR_HEIGHT, START_HOUR) {
  if (!slot.start_time || !slot.end_time) return { top: 0, height: 0 };

  const startMinutes = timeToMinutes(slot.start_time);
  const endMinutes = timeToMinutes(slot.end_time);
  const startOffsetMinutes = startMinutes - START_HOUR * 60;
  const durationMinutes = endMinutes - startMinutes;

  const top = (startOffsetMinutes / 60) * HOUR_HEIGHT;
  const height = (durationMinutes / 60) * HOUR_HEIGHT;

  return { top, height };
}

export function calculateSelectionStyle(startTime, endTime, HOUR_HEIGHT, START_HOUR, END_HOUR) {
  if (!startTime || !endTime) return null;

  const startMinutes = timeToMinutes(startTime);
  const endMinutes = timeToMinutes(endTime);
  const top = ((Math.min(startMinutes, endMinutes) - START_HOUR * 60) / 60) * HOUR_HEIGHT;
  const height = (Math.abs(endMinutes - startMinutes) / 60) * HOUR_HEIGHT;

  return { top, height };
}

export function getValidSlots(slots, START_HOUR, END_HOUR) {
  if (!slots) return [];
  return slots.filter((slot) => {
    const startH = Number(slot.start_time?.split(':')[0]);
    return startH >= START_HOUR && startH < END_HOUR;
  });
}
```

---

## 📄 domain-constants.js
**Path:** `domain/domain-constants.js`

```
/**
 * Domain Constants - Simplified & Unified
 */

/* ============================================
   HORSES DOMAIN
   ============================================ */
export const HORSE_TYPES = {
  PONY: 'pony',
  HORSE: 'horse',
};

export const HORSE_TYPE_LABELS = {
  [HORSE_TYPES.PONY]: {
    value: HORSE_TYPES.PONY,
    label: 'Poney',
  },
  [HORSE_TYPES.HORSE]: {
    value: HORSE_TYPES.HORSE,
    label: 'Cheval',
  },
};

export const getHorseTypeConfig = (type) => HORSE_TYPE_LABELS[type] || null;
export const getHorseTypeLabel = (type) => getHorseTypeConfig(type)?.label ?? type;

/* ============================================
   OWNERSHIP TYPES
   ============================================ */
export const OWNER_TYPES = {
  LAURY: 'laury',
  PRIVATE_OWNER: 'private_owner',
  CLUB: 'club',
  OTHER: 'other',
};

export const OWNER_TYPE_LABELS = {
  [OWNER_TYPES.LAURY]: {
    value: OWNER_TYPES.LAURY,
    label: 'Laury',
  },
  [OWNER_TYPES.PRIVATE_OWNER]: {
    value: OWNER_TYPES.PRIVATE_OWNER,
    label: 'Propriétaire',
  },
  [OWNER_TYPES.CLUB]: {
    value: OWNER_TYPES.CLUB,
    label: 'Club',
  },
  [OWNER_TYPES.OTHER]: {
    value: OWNER_TYPES.OTHER,
    label: 'Autre',
  },
};

export const getOwnerTypeConfig = (type) =>
  OWNER_TYPE_LABELS[type] || OWNER_TYPE_LABELS[OWNER_TYPES.OTHER];
export const getOwnerTypeLabel = (type) => getOwnerTypeConfig(type)?.label ?? type;

/* ============================================
   RIDERS DOMAIN
   ============================================ */
export const RIDER_TYPES = {
  OWNER: 'owner',
  CLUB: 'club',
  LOANER: 'loaner',
};

export const RIDER_TYPE_LABELS = {
  [RIDER_TYPES.OWNER]: {
    value: RIDER_TYPES.OWNER,
    label: 'Propriétaire',
  },
  [RIDER_TYPES.CLUB]: {
    value: RIDER_TYPES.CLUB,
    label: 'Club',
  },
  [RIDER_TYPES.LOANER]: {
    value: RIDER_TYPES.LOANER,
    label: 'Pensionnaire',
  },
};

export const getRiderTypeConfig = (type) => RIDER_TYPE_LABELS[type] || null;
export const getRiderTypeLabel = (type) => getRiderTypeConfig(type)?.label ?? type;

/* ============================================
   PAIRINGS DOMAIN (Rider-Horse Links)
   ============================================ */
export const RIDER_HORSE_LINK_TYPE = {
  OWN: 'own',
  LOAN: 'loan',
};

export const RIDER_HORSE_LINK_LABELS = {
  [RIDER_HORSE_LINK_TYPE.OWN]: {
    value: 'own',
    label: 'Propriétaire',
  },
  [RIDER_HORSE_LINK_TYPE.LOAN]: {
    value: 'loan',
    label: 'Pension',
  },
};

export const getRiderHorseLinkConfig = (type) =>
  RIDER_HORSE_LINK_LABELS[type] || RIDER_HORSE_LINK_LABELS[RIDER_HORSE_LINK_TYPE.OWN];

export const getRiderHorseLinkLabel = (type) => getRiderHorseLinkConfig(type)?.label ?? type;

export const isLoanPairing = (pairingOrType) =>
  typeof pairingOrType === 'string'
    ? pairingOrType === RIDER_HORSE_LINK_TYPE.LOAN
    : pairingOrType?.link_type === RIDER_HORSE_LINK_TYPE.LOAN;

/* ============================================
   HORSE ASSIGNMENTS
   ============================================ */
export const HORSE_ASSIGNMENT_TYPES = {
  MANUAL: 'manual',
  AUTOMATIC: 'automatic',
};

export const HORSE_ASSIGNMENT_LABELS = {
  [HORSE_ASSIGNMENT_TYPES.MANUAL]: {
    value: HORSE_ASSIGNMENT_TYPES.MANUAL,
    label: 'Manuel',
  },
  [HORSE_ASSIGNMENT_TYPES.AUTOMATIC]: {
    value: HORSE_ASSIGNMENT_TYPES.AUTOMATIC,
    label: 'Automatique',
  },
};

export const getHorseAssignmentConfig = (type) => HORSE_ASSIGNMENT_LABELS[type] || null;
export const getHorseAssignmentLabel = (type) => getHorseAssignmentConfig(type)?.label ?? type;

/* ============================================
   STATUS TYPES
   ============================================ */
export const STATUS_TYPES = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

export const STATUS_LABELS = {
  [STATUS_TYPES.ACTIVE]: {
    value: 'active',
    label: 'Actif',
  },
  [STATUS_TYPES.INACTIVE]: {
    value: 'inactive',
    label: 'Inactif',
  },
  [STATUS_TYPES.PENDING]: {
    value: 'pending',
    label: 'En attente',
  },
  [STATUS_TYPES.COMPLETED]: {
    value: 'completed',
    label: 'Terminé',
  },
  [STATUS_TYPES.CANCELLED]: {
    value: 'cancelled',
    label: 'Annulé',
  },
};

export const getStatusConfig = (type) => STATUS_LABELS[type] || null;
export const getStatusLabel = (type) => getStatusConfig(type)?.label ?? type;

/* ============================================
   INSTRUCTORS
   ============================================ */
export const INSTRUCTORS = {
  1: 'Laury',
  2: 'Kévin',
  3: 'Julie',
  4: 'Capucine',
  0: 'Aucun',
};

export const INSTRUCTOR_LABELS = Object.fromEntries(
  Object.entries(INSTRUCTORS).map(([key, label]) => [
    key,
    {
      value: key,
      label,
    },
  ])
);

export const getInstructorConfig = (id) => INSTRUCTOR_LABELS[id] || null;
export const getInstructorLabel = (id) => getInstructorConfig(id)?.label ?? 'Autre';

/* -----------------------
 * Validation helpers
 * ----------------------- */
export const isValidLoanDaysPerWeek = (value) =>
  Number.isInteger(value) && value >= 1 && value <= 7;

export const WEEK_DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
export const WEEK_DAYS_EN = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

export const weekDayCodeToFr = (code) => {
  if (!code) return null;
  const idx = WEEK_DAYS_EN.indexOf(String(code).toLowerCase());
  return idx === -1 ? null : WEEK_DAYS[idx];
};

export const getLoanDays = (pairing) =>
  Array.isArray(pairing?.loan_days) ? pairing.loan_days : [];
```

---

## 📄 events.js
**Path:** `domain/events.js`

```
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
  },

  [EVENT_TYPES.GROUPED_LESSON]: {
    value: EVENT_TYPES.GROUPED_LESSON,
    label: 'Cours collectif',
    description: 'Cours en groupe',
    icon: Icons.GroupLesson,
    slotClass: 'slot-grouped',
  },

  [EVENT_TYPES.SPECIAL]: {
    value: EVENT_TYPES.SPECIAL,
    label: 'Spécial',
    description: 'Événement spécial',
    icon: Icons.Lesson,
    slotClass: 'slot-special',
  },

  [EVENT_TYPES.COMPETITION]: {
    value: EVENT_TYPES.COMPETITION,
    label: 'Compétition',
    description: 'Compétition',
    icon: Icons.Competition,
    slotClass: 'slot-competition',
  },

  [EVENT_TYPES.BLOCKED]: {
    value: EVENT_TYPES.BLOCKED,
    label: 'Bloqué',
    description: 'Créneau bloqué',
    icon: Icons.Blocked,
    slotClass: 'slot-blocked',
  },

  [EVENT_TYPES.SERVICE]: {
    value: EVENT_TYPES.SERVICE,
    label: 'Service',
    description: 'Service équestre',
    icon: Icons.Service,
    slotClass: 'slot-service',
  },

  [EVENT_TYPES.LOANER_FREE_TIME]: {
    value: EVENT_TYPES.LOANER_FREE_TIME,
    label: 'Temps libre DP',
    description: 'Temps libre demi-pension',
    icon: Icons.Horse,
    slotClass: 'slot-loaner',
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
```

---

## 📄 index.js
**Path:** `domain/index.js`

```
/**
 * Domain barrel
 */

export * from './domain-constants.js';
export * from './events.js';
```

---

## 📄 date-utils.js
**Path:** `helpers/date-utils.js`

```
/**
 * Date utility helpers
 */

/**
 * Get today's date in ISO format (YYYY-MM-DD)
 * @returns {string} Today's date in ISO format
 */
export const getTodayISO = () => {
  return new Date().toISOString().split('T')[0];
};

/**
 * Get current datetime in ISO format
 * @returns {string} Current datetime in ISO format
 */
export const getNowISO = () => {
  return new Date().toISOString();
};
```

---

## 📄 activityFilters.js
**Path:** `helpers/filters/activityFilters.js`

```
/**
 * Activity Filters - Check if entities are active based on dates
 */

/**
 * Activity status filter options
 */
export const ACTIVITY_STATUS_FILTERS = {
  ALL: 'all',
  ACTIVE: 'active',
  INACTIVE: 'inactive',
};

/**
 * Generic filter options - Common values used across the app
 */
export const COMMON_FILTERS = {
  ALL: 'all',
  ACTIVE: 'active',
  INACTIVE: 'inactive',
};

/**
 * Check if an item is currently active based on start and end dates
 * @param {string} startDate - Activity start date (ISO string or date string)
 * @param {string} endDate - Activity end date (ISO string or date string)
 * @returns {boolean} True if the item is active
 */
export function isActive(startDate, endDate) {
  const now = new Date();
  const start = startDate ? new Date(startDate) : null;
  const end = endDate ? new Date(endDate) : null;

  if (start && start > now) return false;
  if (end && end < now) return false;
  return true;
}

// Filtres de type de cheval
export const HORSE_KIND_FILTERS = {
  ALL: 'all',
  HORSE: 'horse',
  PONY: 'pony',
};

// Filtres de type de propriétaire
export const OWNERSHIP_TYPE_FILTERS = {
  ALL: 'all',
  LAURY: 'laury',
  PRIVATE_OWNER: 'private_owner',
  CLUB: 'club',
  OTHER: 'other',
};
```

---

## 📄 riders.js
**Path:** `helpers/filters/riders.js`

```
/**
 * Rider-specific filter utilities
 */

import { isActive } from './activityFilters.js';
import { ACTIVITY_STATUS_FILTERS, COMMON_FILTERS } from './activityFilters.js';

/**
 * Filter riders based on criteria
 * @param {Array} riders - array of riders
 * @param {Object} filters - filter criteria
 * @param {string} filters.activityStatus - activity status filter (ACTIVITY_STATUS_FILTERS)
 * @param {string} filters.riderType - rider type filter (owner, club, loaner, or 'all')
 * @returns {Array} filtered riders
 */
export const filterRiders = (riders, filters = {}) => {
  if (!riders || !Array.isArray(riders)) {
    return [];
  }

  let filtered = [...riders];

  // Filter by activity status
  if (filters.activityStatus) {
    if (filters.activityStatus === ACTIVITY_STATUS_FILTERS.ACTIVE) {
      filtered = filtered.filter((rider) =>
        isActive(rider.activity_start_date, rider.activity_end_date)
      );
    } else if (filters.activityStatus === ACTIVITY_STATUS_FILTERS.INACTIVE) {
      filtered = filtered.filter(
        (rider) => !isActive(rider.activity_start_date, rider.activity_end_date)
      );
    }
    // If ACTIVITY_STATUS_FILTERS.ALL, no filtering needed
  }

  // Filter by rider type
  if (filters.riderType && filters.riderType !== COMMON_FILTERS.ALL) {
    filtered = filtered.filter((rider) => rider.rider_type === filters.riderType);
  }

  return filtered;
};
```

---

## 📄 date.js
**Path:** `helpers/formatters/date.js`

```
/**
 * Date formatting utilities
 */

import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

/**
 * Format date for display
 * @param {Date|string} date - Date to format
 * @param {string} formatStr - Format string (default: 'dd/MM/yyyy')
 * @returns {string} Formatted date
 */
export function formatDate(date, formatStr = 'dd/MM/yyyy') {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, formatStr, { locale: fr });
}

/**
 * Format date and time
 * @param {Date|string} date - Date to format
 * @param {string} formatStr - Format string (default: 'dd/MM/yyyy HH:mm')
 * @returns {string} Formatted date and time
 */
export function formatDateTime(date, formatStr = 'dd/MM/yyyy HH:mm') {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, formatStr, { locale: fr });
}
```

---

## 📄 duration.js
**Path:** `helpers/formatters/duration.js`

```
/**
 * Duration formatting utilities
 */

/**
 * Format duration in minutes to readable string
 * @param {number} minutes - Duration in minutes
 * @returns {string} Formatted duration (e.g., "1h30min", "45min", "2h")
 */
export function formatDuration(minutes) {
  if (!minutes || minutes <= 0) return '';

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) {
    return `${mins}min`;
  }

  if (mins === 0) {
    return `${hours}h`;
  }

  return `${hours}h${mins}min`;
}

/**
 * Calculate duration between two times
 * @param {string} startTime - Start time in HH:MM format
 * @param {string} endTime - End time in HH:MM format
 * @returns {number} Duration in minutes
 */
export function calculateDurationMinutes(startTime, endTime) {
  if (!startTime || !endTime) return 0;

  const timeToMinutes = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + (minutes || 0);
  };

  const startMinutes = timeToMinutes(startTime);
  const endMinutes = timeToMinutes(endTime);

  return Math.max(0, endMinutes - startMinutes);
}
```

---

## 📄 index.js
**Path:** `helpers/formatters/index.js`

```
/**
 * Helpers formatters barrel
 */

export * from './time.js';
export * from './date.js';
export * from './duration.js';
export * from './name.js';
```

---

## 📄 name.js
**Path:** `helpers/formatters/name.js`

```
export function shortName(value = '') {
  if (typeof value !== 'string') return '';

  const parts = value.trim().split(/\s+/);

  if (parts.length === 0) return '';

  return parts
    .map((word, index) => (index === 0 ? word : word.charAt(0).toUpperCase() + ''))
    .join(' ');
}
```

---

## 📄 time.js
**Path:** `helpers/formatters/time.js`

```
/**
 * Time formatting and calculation utilities
 */

import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

/* ============================================
   CORE TIME CONVERSION
   ============================================ */

/**
 * Convert "HH:MM" string to minutes since midnight
 * @param {string} timeStr - Time in HH:MM format
 * @returns {number} Minutes since midnight
 */
export function timeToMinutes(timeStr) {
  if (typeof timeStr !== 'string') {
    console.warn('timeToMinutes received non-string:', timeStr);
    return 0;
  }

  const [hours, minutes] = timeStr.split(':').map(Number);

  if (isNaN(hours) || isNaN(minutes)) {
    console.warn('timeToMinutes could not parse:', timeStr);
    return 0;
  }

  return hours * 60 + minutes;
}

/**
 * Convert minutes since midnight to "HH:MM" format
 * @param {number} minutes - Minutes since midnight
 * @returns {string} Time in HH:MM format
 */
export function minutesToTime(minutes) {
  if (typeof minutes !== 'number' || isNaN(minutes)) {
    console.warn('minutesToTime received invalid input:', minutes);
    return '00:00';
  }

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

/* ============================================
   TIME FORMATTING
   ============================================ */

/**
 * Format time string for display
 * @param {string} timeStr - Time in HH:MM format
 * @returns {string} Formatted time
 */
export function formatTime(timeStr) {
  if (!timeStr) return '';
  const [hours, minutes] = timeStr.split(':');
  return `${hours}:${minutes}`;
}

/**
 * Format time from either ISO datetime string or HH:MM string
 * @param {string} value - ISO datetime or HH:MM time string
 * @returns {string} Formatted time in HH:MM format
 */
export function formatTimeFlexible(value) {
  if (!value) return '';
  try {
    // If it's a full datetime, extract time
    if (value.includes('T')) {
      const date = new Date(value);
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${hours}:${minutes}`;
    }
    // If it's already just time (HH:MM:SS or HH:MM)
    return value.slice(0, 5);
  } catch {
    return value;
  }
}

/**
 * Format time string to HH:MM for time input
 * Handles HH:MM:SS from database
 * @param {string} timeStr - Time in HH:MM:SS or HH:MM format
 * @returns {string} Time in HH:MM format
 */
export function formatTimeForInput(timeStr) {
  if (!timeStr) return '';
  return String(timeStr).slice(0, 5);
}

/**
 * Format time from input to HH:MM:SS for database
 * @param {string} timeStr - Time in HH:MM format from input
 * @returns {string} Time in HH:MM:SS format
 */
export function formatTimeForDatabase(timeStr) {
  if (!timeStr) return '';
  // If already has seconds, return as is
  if (timeStr.length === 8) return timeStr;
  // Otherwise append :00
  return `${timeStr}:00`;
}

/* ============================================
   CALENDAR POSITIONING
   ============================================ */

/**
 * Calculate selection style positioning for calendar
 * @param {string} selectionStart - Start time in HH:MM format
 * @param {string} selectionEnd - End time in HH:MM format
 * @param {number} HOUR_HEIGHT - Height of one hour in pixels (default: 60)
 * @param {number} START_HOUR - Calendar start hour (default: 8)
 * @param {number} END_HOUR - Calendar end hour (default: 22)
 * @returns {Object|null} Style object with top and height, or null if invalid
 */
export function calculateSelectionStyle(
  selectionStart,
  selectionEnd,
  HOUR_HEIGHT = 60,
  START_HOUR = 8,
  END_HOUR = 22
) {
  if (!selectionStart || !selectionEnd) return null;

  const startMinutes = timeToMinutes(selectionStart);
  const endMinutes = timeToMinutes(selectionEnd);
  const dayStartMinutes = START_HOUR * 60;
  const dayEndMinutes = END_HOUR * 60;

  // Ensure start is before end
  const minMinutes = Math.min(startMinutes, endMinutes);
  const maxMinutes = Math.max(startMinutes, endMinutes);

  if (maxMinutes <= dayStartMinutes || minMinutes >= dayEndMinutes) {
    return null;
  }

  const clampedStart = Math.max(minMinutes, dayStartMinutes);
  const clampedEnd = Math.min(maxMinutes, dayEndMinutes);

  const top = (clampedStart - dayStartMinutes) * (HOUR_HEIGHT / 60);
  const height = (clampedEnd - clampedStart) * (HOUR_HEIGHT / 60);

  return {
    top: `${top}px`,
    height: `${height}px`,
  };
}
```

---

## 📄 index.js
**Path:** `helpers/index.js`

```
/**
 * Helpers barrel
 */

export * from './validators.js';
export * from './formatters/index.js';
export * from './filters/activityFilters.js';
export * from './filters/riders.js';
export * from './stats/riders.js';
export * from './date-utils.js';
```

---

## 📄 riders.js
**Path:** `helpers/stats/riders.js`

```
/**
 * Rider statistics and filtering utilities
 */

import { isActive } from '../filters/activityFilters';

/**
 * Calculate riders statistics
 * @param {Array} riders - array of riders
 * @returns {Object} statistics (total, active, inactive)
 */
export const calculateRiderStats = (riders) => {
  if (!riders || !Array.isArray(riders)) {
    return { total: 0, active: 0, inactive: 0 };
  }

  const total = riders.length;
  const active = riders.filter((r) => isActive(r.activity_start_date, r.activity_end_date)).length;
  const inactive = total - active;

  return { total, active, inactive };
};
```

---

## 📄 validators.js
**Path:** `helpers/validators.js`

```
/**
 * Consolidated Form Validation Module
 *
 * Combines config/forms and helpers/validators into one file:
 * - validation messages and rules
 * - generic helpers: getValidationMessage, formatLengthMessage, validateRule
 * - domain validators: horse and rider
 */

import { EVENT_TYPES, RIDER_TYPE_LABELS, RIDER_TYPES } from '../domain/index.js';
import { calculateDurationMinutes } from './formatters/duration.js';

/**
 * Horse validation utilities
 */

/**
 * Validate horse form data
 * @param {Object} formData - Horse form data
 * @returns {Object} Validation result with isValid and errors object
 */
export const validateHorseForm = (formData) => {
  const errors = {};

  // Name validation
  if (!formData.name || formData.name.trim() === '') {
    errors.name = 'Le nom du cheval est requis';
  }

  // Kind validation
  if (!formData.kind) {
    errors.kind = 'Le type de cheval est requis';
  }

  // Owner validation (if provided, must be valid integer)
  if (formData.owner_id && isNaN(parseInt(formData.owner_id, 10))) {
    errors.owner_id = 'Le propriétaire sélectionné est invalide';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate rider form data
 * @param {Object} formData - Rider form data
 * @returns {Object} Validation result with isValid and errors object
 */
export const validateRiderForm = (formData) => {
  const errors = {};

  // Name validation
  if (!formData.name || formData.name.trim() === '') {
    errors.name = 'Le nom du cavalier est requis';
  }

  // Type validation
  if (!formData.rider_type) {
    errors.rider_type = 'Le type de cavalier est requis';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Filter and normalize slots for the calendar
export function getValidSlots(slots, startHour, endHour) {
  if (!Array.isArray(slots)) return [];
  return slots.filter((slot) => {
    if (slot.start_time == null || slot.end_time == null) return false;

    // Ensure start and end are numbers (minutes since 0:00)
    const startMinutes =
      typeof slot.start_time === 'number' ? slot.start_time : parseTime(slot.start_time);
    const endMinutes = typeof slot.end_time === 'number' ? slot.end_time : parseTime(slot.end_time);
    if (startMinutes >= endMinutes) return false;

    // Ensure slot is within calendar hours
    if (startMinutes / 60 >= endHour || endMinutes / 60 <= startHour) return false;

    return true;
  });
}

// Helper to parse "HH:mm" strings to minutes
function parseTime(timeStr) {
  if (!timeStr) return 0;
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

// lib/validators/eventEdit.js

/**
 * Validation pour l'édition d'un événement
 * Retourne un tableau de messages d'erreur
 */
export function validateEventEdit(editData) {
  const errors = [];

  return errors;
}

export const validateEventForm = (formData, participants) => {
  const errors = {};

  // Required fields validation
  if (!formData.event_date) errors.event_date = 'La date est requise';
  if (!formData.start_time && !formData.is_all_day)
    errors.start_time = "L'heure de début est requise";
  if (!formData.end_time && !formData.is_all_day) errors.end_time = "L'heure de fin est requise";
  if (!formData.event_type) errors.event_type = "Le type d'événement est requis";
  if (!formData.slot_status) errors.slot_status = 'Le statut est requis';

  // Time validation (only if not all-day)
  if (!formData.is_all_day && formData.start_time && formData.end_time) {
    const duration = calculateDurationMinutes(formData.start_time, formData.end_time);
    if (duration <= 0) {
      errors.end_time = "L'heure de fin doit être après l'heure de début";
    }
  }

  // Participants validation (only if not blocked)
  if (formData.event_type !== EVENT_TYPES.BLOCKED) {
    const min = parseInt(formData.min_participants || 0);
    const max = parseInt(formData.max_participants || 0);
    if (min > max) errors.min_participants = 'Le minimum ne peut pas dépasser le maximum';
    if (participants && participants.length > max)
      errors.participants = `Il y a ${participants.length} participants mais le maximum est de ${max}`;
  }

  return { isValid: Object.keys(errors).length === 0, errors };
};
```

---

## 📄 icons.jsx
**Path:** `icons.jsx`

```
import {
  FaArrowCircleRight,
  FaArrowUp,
  FaAward,
  FaBan,
  FaCalendar,
  FaCalendarAlt,
  FaCalendarDay,
  FaCheck,
  FaCheckCircle,
  FaChevronDown,
  FaChevronLeft,
  FaChevronRight,
  FaClock,
  FaClone,
  FaCog,
  FaEnvelope,
  FaExclamationTriangle,
  FaEye,
  FaFilter,
  FaGraduationCap,
  FaHorseHead,
  FaInfoCircle,
  FaLink,
  FaList,
  FaLocationArrow,
  FaPencilAlt,
  FaPhone,
  FaPlus,
  FaSave,
  FaShoppingBasket,
  FaSpinner,
  FaTag,
  FaTimes,
  FaTrash,
  FaUser,
  FaUserGraduate,
  FaUsers,
  FaLock,
  FaArrowDown,
  FaChartBar,
  FaBars, // ✨ NOUVEAU
  FaSignOutAlt,
} from 'react-icons/fa';

export const Icons = {
  Add: FaPlus,
  Award: FaAward,
  Blocked: FaBan,
  Calendar: FaCalendarAlt,
  Cancel: FaBan,
  Check: FaCheck,
  CheckCircle: FaCheckCircle,
  ChevronDown: FaChevronDown,
  ChevronLeft: FaChevronLeft,
  ChevronRight: FaChevronRight,
  Clock: FaClock,
  Close: FaTimes,
  Competition: FaAward,
  Date: FaCalendar,
  Delete: FaTrash,
  Edit: FaPencilAlt,
  Email: FaEnvelope,
  Event: FaCalendarDay,
  Filter: FaFilter,
  GroupLesson: FaUsers,
  Horse: FaHorseHead,
  Info: FaInfoCircle,
  Lesson: FaGraduationCap,
  Link: FaLink,
  List: FaList,
  Loading: FaSpinner,
  Location: FaLocationArrow,
  Packages: FaShoppingBasket,
  Phone: FaPhone,
  PrivateLesson: FaUserGraduate,
  Remove: FaArrowUp,
  Repeat: FaArrowCircleRight,
  Save: FaSave,
  Service: FaShoppingBasket,
  Settings: FaCog,
  Tag: FaTag,
  Template: FaClone,
  Training: FaGraduationCap,
  User: FaUser,
  Users: FaUsers,
  View: FaEye,
  Warning: FaExclamationTriangle,
  Lock: FaLock,
  ArrowDown: FaArrowDown,
  BarChart: FaChartBar,
  Menu: FaBars,
  X: FaTimes, // (alias de Close)
  LogOut: FaSignOutAlt,
};

export const renderIcon = (Icon, props = {}) => {
  return <Icon {...props} />;
};

export default Icons;
```

---

