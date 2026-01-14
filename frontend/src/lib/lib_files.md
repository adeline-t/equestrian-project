# 📁 Project Files Export

Generated on: Mon Jan 12 22:32:47 CET 2026

## 📄 api.js
**Path:** `config/api.js`

```
/**
 * API - Consolidated configuration
 * Endpoints, errors, settings and helpers
 */

export const AUTH = {
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  REFRESH: '/auth/refresh',
};

export const SLOTS = {
  LIST: '/planning_slots',
  CREATE: '/planning_slots',
  UPDATE: '/planning_slots/:id',
  DELETE: '/planning_slots/:id',
  GET: '/planning_slots/:id',
};

export const LESSONS = {
  LIST: '/lessons',
  CREATE: '/lessons',
  UPDATE: '/lessons/:id',
  DELETE: '/lessons/:id',
  GET: '/lessons/:id',
  PARTICIPANTS: '/lessons/:id/participants',
  ADD_PARTICIPANT: '/lessons/:id/participants',
  REMOVE_PARTICIPANT: '/lessons/:id/participants/:participantId',
};

export const HORSES = {
  LIST: '/horses',
  CREATE: '/horses',
  UPDATE: '/horses/:id',
  DELETE: '/horses/:id',
  GET: '/horses/:id',
  RIDERS: '/horses/:id/riders',
};

export const RIDERS = {
  LIST: '/riders',
  CREATE: '/riders',
  UPDATE: '/riders/:id',
  DELETE: '/riders/:id',
  GET: '/riders/:id',
  HORSES: '/riders/:id/horses',
  PACKAGES: '/riders/:id/packages',
};

export const PACKAGES = {
  LIST: '/packages',
  CREATE: '/packages',
  UPDATE: '/packages/:id',
  DELETE: '/packages/:id',
  GET: '/packages/:id',
};

export const PAIRINGS = {
  LIST: '/pairings',
  CREATE: '/pairings',
  UPDATE: '/pairings/:id',
  DELETE: '/pairings/:id',
  GET: '/pairings/:id',
};

export const API_ENDPOINTS = {
  AUTH,
  SLOTS,
  LESSONS,
  HORSES,
  RIDERS,
  PACKAGES,
  PAIRINGS,
};

/* Utilities */
export const buildEndpoint = (endpoint, params = {}) => {
  let url = endpoint;
  Object.keys(params).forEach((key) => {
    url = url.replace(`:${key}`, params[key]);
  });
  return url;
};

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

export const getErrorMessage = (statusCode) => {
  const messageMap = {
    [HTTP_STATUS.BAD_REQUEST]: ERROR_MESSAGES.UNKNOWN,
    [HTTP_STATUS.UNAUTHORIZED]: ERROR_MESSAGES.UNAUTHORIZED,
    [HTTP_STATUS.FORBIDDEN]: ERROR_MESSAGES.FORBIDDEN,
    [HTTP_STATUS.NOT_FOUND]: ERROR_MESSAGES.NOT_FOUND,
    [HTTP_STATUS.CONFLICT]: ERROR_MESSAGES.UNKNOWN,
    [HTTP_STATUS.INTERNAL_SERVER_ERROR]: ERROR_MESSAGES.SERVER_ERROR,
  };
  return messageMap[statusCode] || ERROR_MESSAGES.UNKNOWN;
};

/* API settings */
export const API_SETTINGS = {
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
  CACHE_DURATION: 300000,
};

export const getApiSetting = (key, defaultValue = null) => API_SETTINGS[key] ?? defaultValue;
```

---

## 📄 forms.js
**Path:** `config/forms.js`

```
/**
 * Forms - Consolidated configuration (schemas, settings)
 */

/* Field types */
export const FIELD_TYPES = {
  TEXT: 'text',
  EMAIL: 'email',
  PHONE: 'phone',
  NUMBER: 'number',
  DATE: 'date',
  TIME: 'time',
  SELECT: 'select',
  TEXTAREA: 'textarea',
  CHECKBOX: 'checkbox',
  RADIO: 'radio',
};

export const isValidFieldType = (type) => Object.values(FIELD_TYPES).includes(type);

export const getFieldTypeLabel = (type) => {
  const labels = {
    [FIELD_TYPES.TEXT]: 'Texte',
    [FIELD_TYPES.EMAIL]: 'Email',
    [FIELD_TYPES.PHONE]: 'Téléphone',
    [FIELD_TYPES.NUMBER]: 'Nombre',
    [FIELD_TYPES.DATE]: 'Date',
    [FIELD_TYPES.TIME]: 'Heure',
    [FIELD_TYPES.SELECT]: 'Liste déroulante',
    [FIELD_TYPES.TEXTAREA]: 'Zone de texte',
    [FIELD_TYPES.CHECKBOX]: 'Case à cocher',
    [FIELD_TYPES.RADIO]: 'Bouton radio',
  };
  return labels[type] || type;
};

/* Form settings */
export const FORM_SETTINGS = {
  AUTO_SAVE: false,
  CONFIRM_ON_LEAVE: true,
  RESET_ON_SUCCESS: false,
};
export const getFormSetting = (key, defaultValue = null) => FORM_SETTINGS[key] ?? defaultValue;

/* Schemas (horse, rider) */
export const HORSE_KINDS = ['horse', 'pony'];
export const OWNER_TYPES = ['laury', 'private_owner', 'club', 'other'];

export const HORSE_FORM_FIELDS = {
  name: { type: FIELD_TYPES.TEXT, label: 'Nom du cheval', required: true, maxLength: 100 },
  kind: { type: FIELD_TYPES.SELECT, label: 'Type de cheval', required: true, options: HORSE_KINDS },
  activity_start_date: {
    type: FIELD_TYPES.DATE,
    label: "Date de début d'activité",
    required: false,
  },
  activity_end_date: { type: FIELD_TYPES.DATE, label: "Date de fin d'activité", required: false },
  ownership_type: {
    type: FIELD_TYPES.SELECT,
    label: 'Propriétaire',
    required: true,
    options: OWNER_TYPES,
  },
  owner_id: {
    type: FIELD_TYPES.SELECT,
    label: 'Cavalier propriétaire',
    required: false,
    dependsOn: 'ownership_type',
    showWhen: 'private_owner',
  },
};

export const RIDER_TYPES = ['owner', 'club', 'boarder'];

export const RIDER_FORM_FIELDS = {
  name: { type: FIELD_TYPES.TEXT, label: 'Nom du cavalier', required: true, maxLength: 100 },
  email: { type: FIELD_TYPES.EMAIL, label: 'Email', required: false },
  phone: { type: FIELD_TYPES.PHONE, label: 'Téléphone', required: false },
  rider_type: {
    type: FIELD_TYPES.SELECT,
    label: 'Type de cavalier',
    required: true,
    options: RIDER_TYPES,
  },
  activity_start_date: {
    type: FIELD_TYPES.DATE,
    label: "Date de début d'activité",
    required: false,
  },
  activity_end_date: { type: FIELD_TYPES.DATE, label: "Date de fin d'activité", required: false },
};

export const getHorseFormField = (fieldName) => HORSE_FORM_FIELDS[fieldName] || null;
export const getHorseRequiredFields = () =>
  Object.entries(HORSE_FORM_FIELDS)
    .filter(([_, cfg]) => cfg.required)
    .map(([name]) => name);

export const getRiderFormField = (fieldName) => RIDER_FORM_FIELDS[fieldName] || null;
export const getRiderRequiredFields = () =>
  Object.entries(RIDER_FORM_FIELDS)
    .filter(([_, cfg]) => cfg.required)
    .map(([name]) => name);

export const PACKAGE_FORM_FIELDS = {
  rider_id: {
    type: FIELD_TYPES.SELECT,
    label: 'Cavalier',
    required: true,
  },
  services_per_week: {
    type: FIELD_TYPES.NUMBER,
    label: 'Services par semaine',
    required: true,
    min: 0,
  },
  group_lessons_per_week: {
    type: FIELD_TYPES.NUMBER,
    label: 'Cours collectifs par semaine',
    required: true,
    min: 0,
  },
  is_active: {
    type: FIELD_TYPES.CHECKBOX,
    label: 'Actif',
    required: false,
    defaultValue: true,
  },
  activity_start_date: {
    type: FIELD_TYPES.DATE,
    label: 'Date de début',
    required: false,
  },
  activity_end_date: {
    type: FIELD_TYPES.DATE,
    label: 'Date de fin',
    required: false,
  },
};

export const getPackageFormField = (fieldName) => PACKAGE_FORM_FIELDS[fieldName] || null;
export const getPackageRequiredFields = () =>
  Object.entries(PACKAGE_FORM_FIELDS)
    .filter(([_, cfg]) => cfg.required)
    .map(([name]) => name);

export const PAIRING_FORM_FIELDS = {
  rider_id: {
    type: FIELD_TYPES.SELECT,
    label: 'Cavalier',
    required: true,
  },
  horse_id: {
    type: FIELD_TYPES.SELECT,
    label: 'Cheval',
    required: true,
  },
  pairing_start_date: {
    type: FIELD_TYPES.DATE,
    label: 'Date de début',
    required: false,
  },
  pairing_end_date: {
    type: FIELD_TYPES.DATE,
    label: 'Date de fin',
    required: false,
  },
};

export const getPairingFormField = (fieldName) => PAIRING_FORM_FIELDS[fieldName] || null;
export const getPairingRequiredFields = () =>
  Object.entries(PAIRING_FORM_FIELDS)
    .filter(([_, cfg]) => cfg.required)
    .map(([name]) => name);
```

---

## 📄 ui.js
**Path:** `config/ui.js`

```
/**
 * UI - Consolidated configuration
 */

export const MODAL_SIZES = { SMALL: 'small', MEDIUM: 'medium', LARGE: 'large' };

export const DATE_FORMATS = {
  DISPLAY: 'DD/MM/YYYY',
  INPUT: 'YYYY-MM-DD',
  TIME: 'HH:mm',
  DATETIME: 'DD/MM/YYYY HH:mm',
};

export const TABLE_CONFIG = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
  MIN_SEARCH_LENGTH: 2,
};

export const STATUS_COLORS = {
  ACTIVE: '#48bb78',
  INACTIVE: '#f56565',
  PENDING: '#ed8936',
  COMPLETED: '#4299e1',
  CANCELLED: '#718096',
};

export const LOADING_STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
};

export const CARD_STYLES = {
  base: {
    border: 'none',
    borderRadius: '6px',
    color: 'white',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  compact: { minHeight: '40px', padding: '4px 6px' },
  standard: { minHeight: '60px', padding: '6px 8px' },
};

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

export const LAYOUT_STYLES = {
  row: { display: 'flex', alignItems: 'center', gap: '4px' },
  spaceBetween: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  column: { display: 'flex', flexDirection: 'column', gap: '4px' },
};

export const MODAL_CONFIG = {
  defaultSize: MODAL_SIZES.MEDIUM,
  closeOnOverlay: true,
  animationDuration: 300,
};

export const getModalSizeClass = (size) => {
  const sizeMap = {
    [MODAL_SIZES.SMALL]: 'small',
    [MODAL_SIZES.MEDIUM]: 'medium',
    [MODAL_SIZES.LARGE]: 'large',
  };
  return sizeMap[size] || sizeMap[MODAL_SIZES.MEDIUM];
};

export const getCardStyle = (layout) => ({
  ...CARD_STYLES.base,
  ...(CARD_STYLES[layout] || CARD_STYLES.standard),
});

export const getTextStyle = (layout, element) => {
  const layoutStyles = TEXT_STYLES[layout] || TEXT_STYLES.standard;
  return layoutStyles[element] || {};
};
```

---

## 📄 horses.js
**Path:** `domain/horses.js`

```
/**
 * Domain: Horses (aligné DB)
 */
export const HORSE_TYPES = { PONY: 'pony', HORSE: 'horse' };
export const HORSE_KIND_LABELS = {
  [HORSE_TYPES.PONY]: {
    value: HORSE_TYPES.PONY,
    label: 'Poney',
    color: '#ed64a6',
    gradient: 'var(--gradient-pony)',
    badgeClass: 'badge-pony',
  },
  [HORSE_TYPES.HORSE]: {
    value: HORSE_TYPES.HORSE,
    label: 'Cheval',
    color: '#4299e1',
    gradient: 'var(--gradient-info)',
    badgeClass: 'badge-horse',
  },
};
export const getHorseKindLabel = (k) => HORSE_KIND_LABELS[k]?.label || k;
export const HORSE_KINDS = Object.values(HORSE_TYPES);

export const OWNER_TYPES = {
  LAURY: 'laury',
  PRIVATE_OWNER: 'private_owner',
  CLUB: 'club',
  OTHER: 'other',
};
export const OWNER_TYPE_LABELS = {
  [OWNER_TYPES.LAURY]: { value: OWNER_TYPES.LAURY, label: 'Laury' },
  [OWNER_TYPES.PRIVATE_OWNER]: { value: OWNER_TYPES.PRIVATE_OWNER, label: 'Propriétaire' },
  [OWNER_TYPES.CLUB]: { value: OWNER_TYPES.CLUB, label: 'Club' },
  [OWNER_TYPES.OTHER]: { value: OWNER_TYPES.OTHER, label: 'Autre' },
};
export const getOwnerTypeLabel = (t) => OWNER_TYPE_LABELS[t]?.label || t;
```

---

## 📄 lessons.js
**Path:** `domain/lessons.js`

```
/**
 * Domain: Lessons (aligné DB)
 */
export const PLANNING_SLOT_TYPES = {
  LESSON: 'lesson',
  BLOCKED: 'blocked',
  SERVICE: 'service',
  BOARDER_FREE_TIME: 'boarder_free_time',
};

export const LESSON_STATUSES = {
  SCHEDULED: 'scheduled',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  BLOCKED: 'blocked',
};

export const LESSON_TYPES = [
  { value: 'private', label: 'Cours particulier', defaultMax: 1, minP: 1, maxP: 1 },
  { value: 'group', label: 'Cours collectif', defaultMax: 6, minP: 2, maxP: 8 },
  { value: 'training', label: 'Stage', defaultMax: 10, minP: 3, maxP: 12 },
  { value: 'competition', label: 'Concours', defaultMax: 20, minP: 1, maxP: null },
  { value: 'event', label: 'Événement', defaultMax: 50, minP: 1, maxP: null },
  { value: 'blocked', label: 'Période bloquée', defaultMax: null, minP: 0, maxP: 0 },
];

export const HORSE_ASSIGNMENT_TYPES = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  BACKUP: 'backup',
};
```

---

## 📄 packages.js
**Path:** `domain/packages.js`

```
/**
 * Domain: Packages
 *
 * No structural change required; kept for completeness.
 */

export const PACKAGE_STATUS = {
  ACTIVE: 'active',
  UPCOMING: 'upcoming',
  EXPIRED: 'expired',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
};

export const PACKAGE_STATUS_LABELS = {
  [PACKAGE_STATUS.ACTIVE]: 'Actif',
  [PACKAGE_STATUS.UPCOMING]: 'À venir',
  [PACKAGE_STATUS.EXPIRED]: 'Expiré',
  [PACKAGE_STATUS.INACTIVE]: 'Inactif',
  [PACKAGE_STATUS.SUSPENDED]: 'Suspendu',
};

export const PACKAGE_STATUS_CONFIG = {
  [PACKAGE_STATUS.ACTIVE]: {
    value: 'active',
    label: 'Actif',
    cssClass: 'active',
    gradient: 'var(--gradient-success)',
  },
  [PACKAGE_STATUS.UPCOMING]: {
    value: 'upcoming',
    label: 'À venir',
    cssClass: 'upcoming',
    gradient: 'var(--gradient-info)',
  },
  [PACKAGE_STATUS.EXPIRED]: {
    value: 'expired',
    label: 'Expiré',
    cssClass: 'expired',
    gradient: 'var(--gradient-secondary)',
  },
  [PACKAGE_STATUS.INACTIVE]: {
    value: 'inactive',
    label: 'Inactif',
    cssClass: 'inactive',
    gradient: 'var(--gradient-danger)',
  },
  [PACKAGE_STATUS.SUSPENDED]: {
    value: 'suspended',
    label: 'Suspendu',
    cssClass: 'suspended',
    gradient: 'var(--gradient-warning)',
  },
};

export const getPackageStatusLabel = (status) => PACKAGE_STATUS_LABELS[status] || status;
export const getPackageStatusConfig = (status) =>
  PACKAGE_STATUS_CONFIG[status] || PACKAGE_STATUS_CONFIG[PACKAGE_STATUS.INACTIVE];

export const isPackageActive = (status) => status === PACKAGE_STATUS.ACTIVE;
export const isPackageExpired = (status) => status === PACKAGE_STATUS.EXPIRED;
export const isPackageSuspended = (status) => status === PACKAGE_STATUS.SUSPENDED;
export const isPackageUpcoming = (status) => status === PACKAGE_STATUS.UPCOMING;
```

---

## 📄 riders.js
**Path:** `domain/riders.js`

```
/**
 * Domain: Riders (aligné DB)
 */
export const RIDER_TYPES = { OWNER: 'owner', CLUB: 'club', BOARDER: 'boarder' };
export const RIDER_KIND_LABELS = {
  [RIDER_TYPES.OWNER]: {
    value: RIDER_TYPES.OWNER,
    label: 'Propriétaire',
    color: '#ed8936',
    badgeClass: 'badge-owner',
  },
  [RIDER_TYPES.CLUB]: {
    value: RIDER_TYPES.CLUB,
    label: 'Club',
    color: '#4299e1',
    badgeClass: 'badge-club',
  },
  [RIDER_TYPES.BOARDER]: {
    value: RIDER_TYPES.BOARDER,
    label: 'Pensionnaire',
    color: '#48bb78',
    badgeClass: 'badge-boarder',
  },
};
export const getRiderKindLabel = (k) => RIDER_KIND_LABELS[k]?.label || k;
export const RIDER_KINDS = Object.values(RIDER_TYPES);
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
 * Format week title
 * @param {Object} weekData - Week data with period
 * @returns {string} Formatted week title
 */
export function formatWeekTitle(weekData) {
  if (!weekData || !weekData.period) return 'Chargement...';

  const start = new Date(weekData.period.start);
  const end = new Date(weekData.period.end);

  // Validate dates before formatting
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return 'Semaine en cours';
  }

  return `Semaine du ${format(start, 'dd MMMM', { locale: fr })} au ${format(end, 'dd MMMM yyyy', {
    locale: fr,
  })}`;
}

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

/**
 * Add minutes to a time string
 * @param {string} timeStr - Time in HH:MM format
 * @param {number} minutesToAdd - Minutes to add
 * @returns {string} New time in HH:MM format
 */
export function addMinutesToTime(timeStr, minutesToAdd) {
  if (!timeStr) return '';

  const [hours, minutes] = timeStr.split(':').map(Number);
  let totalMinutes = hours * 60 + minutes + minutesToAdd;

  // Handle day overflow (24 hours = 1440 minutes)
  totalMinutes = totalMinutes % 1440;

  const newHours = Math.floor(totalMinutes / 60);
  const newMinutes = totalMinutes % 60;

  return `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`;
}
```

---

## 📄 index.js
**Path:** `helpers/formatters/index.js`

```
/**
 * Shared Formatters - Main Export
 */

export * from './time.js';
export * from './date.js';
export * from './duration.js';

// Re-export for backward compatibility
export {
  timeToMinutes,
  minutesToTime,
  formatTime,
  calculateLessonStyle,
  calculateSelectionStyle,
} from './time.js';
export { formatWeekTitle, formatDate, formatDateTime } from './date.js';
export { formatDuration } from './duration.js';
```

---

## 📄 time.js
**Path:** `helpers/formatters/time.js`

```
/**
 * Time formatting and calculation utilities
 */

/**
 * Convert time string to minutes
 * @param {string} timeStr - Time in HH:MM format
 * @returns {number} Total minutes
 */
export function timeToMinutes(timeStr) {
  if (!timeStr) return 0;
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + (minutes || 0);
}

/**
 * Convert minutes to time string
 * @param {number} minutes - Total minutes
 * @returns {string} Time in HH:MM format
 */
export function minutesToTime(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

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
 * Calculate lesson style positioning
 * @param {Object} lesson - Lesson object
 * @param {number} HOUR_HEIGHT - Height of one hour in pixels
 * @param {number} START_HOUR - Calendar start hour
 * @param {number} END_HOUR - Calendar end hour
 * @returns {Object} Style object with top and height
 */
export function calculateLessonStyle(lesson, HOUR_HEIGHT = 60, START_HOUR = 8, END_HOUR = 22) {
  if (!lesson?.start_time || !lesson?.end_time) {
    return { display: 'none' };
  }

  const startMinutes = timeToMinutes(lesson.start_time);
  const endMinutes = timeToMinutes(lesson.end_time);
  const dayStartMinutes = START_HOUR * 60;
  const dayEndMinutes = END_HOUR * 60;

  // Check if lesson is outside visible hours
  if (endMinutes <= dayStartMinutes || startMinutes >= dayEndMinutes) {
    return { display: 'none' };
  }

  // Clamp start and end to visible hours
  const clampedStart = Math.max(startMinutes, dayStartMinutes);
  const clampedEnd = Math.min(endMinutes, dayEndMinutes);

  const top = (clampedStart - dayStartMinutes) * (HOUR_HEIGHT / 60);
  const height = (clampedEnd - clampedStart) * (HOUR_HEIGHT / 60);

  return {
    top: `${top}px`,
    height: `${height}px`,
  };
}

/**
 * Calculate selection style positioning
 * @param {string} selectionStart - Start time in HH:MM format
 * @param {string} selectionEnd - End time in HH:MM format
 * @param {number} HOUR_HEIGHT - Height of one hour in pixels
 * @param {number} START_HOUR - Calendar start hour
 * @param {number} END_HOUR - Calendar end hour
 * @returns {Object|null} Style object or null if invalid
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

## 📄 ui.js
**Path:** `helpers/ui.js`

```
/**
 * Helpers: ui
 */
import { CARD_STYLES, TEXT_STYLES, MODAL_SIZES } from '../config/ui.js';

export const getCardStyle = (layout) => ({
  ...CARD_STYLES.base,
  ...(CARD_STYLES[layout] || CARD_STYLES.standard),
});

export const getTextStyle = (layout, element) => {
  const layoutStyles = TEXT_STYLES[layout] || TEXT_STYLES.standard;
  return layoutStyles[element] || {};
};

export const getModalSizeClass = (size) => {
  const sizeMap = {
    [MODAL_SIZES.SMALL]: 'small',
    [MODAL_SIZES.MEDIUM]: 'medium',
    [MODAL_SIZES.LARGE]: 'large',
  };
  return sizeMap[size] || sizeMap[MODAL_SIZES.MEDIUM];
};
```

---

## 📄 utils.js
**Path:** `helpers/utils.js`

```
/**
 * Helpers: utils
 */

/**
 * Build endpoint URL with parameters
 * @param {string} endpoint
 * @param {Object} params
 * @returns {string}
 */
export const buildEndpoint = (endpoint, params = {}) => {
  let url = endpoint;
  Object.keys(params).forEach((key) => {
    url = url.replace(`:${key}`, params[key]);
  });
  return url;
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

import { RIDER_KIND_LABELS } from '../../../domains/riders/kinds';

/**
 * Form validation messages
 */
export const VALIDATION_MESSAGES = {
  REQUIRED: 'Ce champ est requis',
  INVALID_EMAIL: "Format d'email invalide",
  INVALID_PHONE: 'Format de téléphone invalide',
  FORMAT_INVALID: 'Format invalide',
  MIN_LENGTH: 'Ce champ doit contenir au moins {min} caractères',
  MAX_LENGTH: 'Ce champ ne peut pas dépasser {max} caractères',
  INVALID_DATE: 'Date invalide',
  INVALID_TIME: 'Heure invalide',
};

/**
 * UI Validation Rules
 */
export const VALIDATION_RULES = {
  NAME: {
    minLength: 1,
    maxLength: 100,
    required: true,
  },
  EMAIL: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    required: false,
  },
  PHONE: {
    pattern: /^[\d\s\-+()]+$/,
    minLength: 10,
    required: false,
  },
  DESCRIPTION: {
    maxLength: 500,
    required: false,
  },
};

/**
 * Get validation message with parameters
 * @param {string} messageKey - Message key
 * @param {Object} params - Parameters to replace
 * @returns {string} Formatted message
 */
export const getValidationMessage = (messageKey, params = {}) => {
  let message = VALIDATION_MESSAGES[messageKey] || '';
  Object.keys(params).forEach((k) => {
    message = message.replace(`{${k}}`, params[k]);
  });
  return message;
};

/**
 * Format validation message for min/max length
 * @param {string} type - 'min' or 'max'
 * @param {number} value - Length value
 * @returns {string} Formatted message
 */
export const formatLengthMessage = (type, value) => {
  const key = type === 'min' ? 'MIN_LENGTH' : 'MAX_LENGTH';
  return getValidationMessage(key, { [type]: value });
};

/**
 * Validate value against rule
 * @param {*} value - Value to validate
 * @param {Object} rule - Validation rule
 * @returns {Object} Validation result
 */
export const validateRule = (value, rule) => {
  const errors = [];

  // Required check (handle undefined, null, empty string)
  if (rule.required && (value === undefined || value === null || value === '')) {
    errors.push(getValidationMessage('REQUIRED'));
    return { isValid: false, errors };
  }

  // If value is empty and not required, it's valid
  if (value === undefined || value === null || value === '') {
    return { isValid: true, errors };
  }

  // Min length check
  if (rule.minLength && value.length < rule.minLength) {
    errors.push(formatLengthMessage('min', rule.minLength));
  }

  // Max length check
  if (rule.maxLength && value.length > rule.maxLength) {
    errors.push(formatLengthMessage('max', rule.maxLength));
  }

  // Pattern check
  if (rule.pattern && !rule.pattern.test(value)) {
    if (rule === VALIDATION_RULES.EMAIL) {
      errors.push(getValidationMessage('INVALID_EMAIL'));
    } else if (rule === VALIDATION_RULES.PHONE) {
      errors.push(getValidationMessage('INVALID_PHONE'));
    } else {
      errors.push(getValidationMessage('FORMAT_INVALID'));
    }
  }

  return { isValid: errors.length === 0, errors };
};

/**
 * Get validation rule by name
 * @param {string} ruleName - Rule name
 * @returns {Object|null} Validation rule
 */
export const getValidationRule = (ruleName) => {
  return VALIDATION_RULES[ruleName] || null;
};

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
 * Rider validation utilities
 */

/**
 * Validate email format
 * @param {string} email - Email address
 * @returns {boolean} True if valid email format
 */
export const isValidEmail = (email) => {
  if (!email) return true; // Email is optional
  const emailRegex = VALIDATION_RULES.EMAIL.pattern;
  return emailRegex.test(email);
};

/**
 * Validate phone format
 * @param {string} phone - Phone number
 * @returns {boolean} True if valid phone format
 */
export const isValidPhone = (phone) => {
  if (!phone) return true; // Phone is optional
  const phoneRegex = VALIDATION_RULES.PHONE.pattern;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
};

// Extract allowed values from imported labels (defensive)
const ALLOWED_KINDS = Array.isArray(RIDER_KIND_LABELS)
  ? RIDER_KIND_LABELS.map((k) => k.value)
  : Object.values(RIDER_KIND_LABELS || {}).map((k) => k.value);

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

  // Kind validation
  if (!formData.kind) {
    errors.kind = 'Le type de cavalier est requis';
  } else if (!ALLOWED_KINDS.includes(formData.kind)) {
    errors.kind = 'Le type doit être "owner", "club" ou "boarder"';
  }

  // Email validation
  if (formData.email && !isValidEmail(formData.email)) {
    errors.email = getValidationMessage('INVALID_EMAIL');
  }

  // Phone validation
  if (formData.phone && !isValidPhone(formData.phone)) {
    errors.phone = `${getValidationMessage('INVALID_PHONE')} (minimum 10 chiffres)`;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
```

---

## 📄 icons.jsx
**Path:** `icons.jsx`

```
import {
  FaPlus,
  FaPencilAlt,
  FaTrash,
  FaEye,
  FaHorseHead,
  FaCalendarAlt,
  FaClone,
  FaCheck,
  FaTimes,
  FaExclamationTriangle,
  FaArrowUp,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaCalendar,
  FaList,
  FaLink,
  FaChevronDown,
  FaChevronLeft,
  FaChevronRight,
  FaUsers,
  FaInfoCircle,
  FaSave,
  FaBan,
  FaSpinner,
  FaGraduationCap,
  FaShoppingBasket,
  FaUserGraduate,
  FaAward,
  FaLocationArrow,
  FaClock,
  FaCalendarDay,
  FaArrowCircleRight,
  FaCog,
  FaTag,
  FaFilter,
} from 'react-icons/fa';

export const Icons = {
  Add: FaPlus,
  Edit: FaPencilAlt,
  Delete: FaTrash,
  View: FaEye,
  Horse: FaHorseHead,
  Calendar: FaCalendarAlt,
  Template: FaClone,
  Check: FaCheck,
  Close: FaTimes,
  Warning: FaExclamationTriangle,
  Remove: FaArrowUp,
  User: FaUser,
  Users: FaUsers,
  Phone: FaPhone,
  Email: FaEnvelope,
  Date: FaCalendar,
  List: FaList,
  Link: FaLink,
  ChevronDown: FaChevronDown,
  ChevronLeft: FaChevronLeft,
  ChevronRight: FaChevronRight,
  Info: FaInfoCircle,
  Save: FaSave,
  Cancel: FaBan,
  Loading: FaSpinner,
  Lesson: FaGraduationCap,
  Packages: FaShoppingBasket,
  PrivateLesson: FaUserGraduate,
  GroupLesson: FaUsers,
  Service: FaShoppingBasket,
  Clock: FaClock,
  Location: FaLocationArrow,
  Competition: FaAward,
  Training: FaGraduationCap,
  Event: FaCalendarDay,
  Blocked: FaBan,
  Repeat: FaArrowCircleRight,
  Settings: FaCog,
  Tag: FaTag,
  Filter: FaFilter,
};

export const renderIcon = (Icon, props = {}) => {
  return <Icon {...props} />;
};

export default Icons;```

---

## 📄 index.js
**Path:** `index.js`

```
/**
 * Centralized export for all constants and services
 */

// Export all domain-organized constants
export * from './domains';

// Export all services
export * from './services';

export { default as icons } from './icons';
```

---

