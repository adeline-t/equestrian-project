# 📁 Project Files Export

Generated on: Tue Jan 20 08:53:59 CET 2026

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

export const EVENTS = {
  LIST: '/events',
  CREATE: '/events',
  UPDATE: '/events/:id',
  DELETE: '/events/:id',
  GET: '/events/:id',
  PARTICIPANTS: '/events/:id/participants',
  ADD_PARTICIPANT: '/events/:id/participants',
  REMOVE_PARTICIPANT: '/events/:id/participants/:participantId',
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
  EVENTS,
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
// lib/config/forms.js

/**
 * Field types for forms
 */
export const FIELD_TYPES = {
  TEXT: 'text',
  NUMBER: 'number',
  EMAIL: 'email',
  SELECT: 'select',
  DATE: 'date',
  TIME: 'time',
  CHECKBOX: 'checkbox',
  RADIO: 'radio',
  TEXTAREA: 'textarea',
};

/**
 * Checks if a field type is valid
 * @param {string} type
 * @returns {boolean}
 */
export const isValidFieldType = (type) => Object.values(FIELD_TYPES).includes(type);

/**
 * Returns human-readable label for a field type
 * @param {string} type
 * @returns {string}
 */
export const getFieldTypeLabel = (type) => {
  const labels = {
    text: 'Texte',
    number: 'Nombre',
    email: 'Email',
    select: 'Sélecteur',
    date: 'Date',
    time: 'Heure',
    checkbox: 'Case à cocher',
    radio: 'Bouton radio',
    textarea: 'Zone de texte',
  };
  return labels[type] || type;
};

/**
 * Form settings: default values for forms
 */
export const FORM_SETTINGS = {
  requiredFields: [],
  maxLength: 255,
};

/**
 * Retrieves a specific form setting
 * @param {string} key
 * @returns {*}
 */
export const getFormSetting = (key) => FORM_SETTINGS[key];
```

---

## 📄 index.js
**Path:** `config/index.js`

```
/**
 * Config barrel
 */
export * from './api.js';
export * from './forms.js';
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
    [MODAL_SIZES.XLARGE]: 'xlarge',
  };
  return sizeMap[size] || sizeMap[MODAL_SIZES.MEDIUM];
};

/* ============================================
   DATE FORMATS
   ============================================ */

export const DATE_FORMATS = {
  DISPLAY: 'DD/MM/YYYY',
  INPUT: 'YYYY-MM-DD',
  TIME: 'HH:mm',
  DATETIME: 'DD/MM/YYYY HH:mm',
};

/* ============================================
   TABLE
   ============================================ */

export const TABLE_CONFIG = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
  MIN_SEARCH_LENGTH: 2,
};

/* ============================================
   LOADING STATES
   ============================================ */

export const LOADING_STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
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

export const getCardStyle = (layout) => ({
  ...CARD_STYLES.base,
  ...(CARD_STYLES[layout] || CARD_STYLES.standard),
});

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

export const getTextStyle = (layout, element) => {
  const layoutStyles = TEXT_STYLES[layout] || TEXT_STYLES.standard;
  return layoutStyles[element] || {};
};

/* ============================================
   LAYOUT STYLES
   ============================================ */

export const LAYOUT_STYLES = {
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  spaceBetween: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
};
```

---

## 📄 domain-constants.js
**Path:** `domain/domain-constants.js`

```
/**
 * Domain Constants - Unified & Complete
 *
 * Toutes les constantes métier de l'application
 * Les couleurs sont définies dans base.css via CSS variables
 * Ici on ne garde que les valeurs, labels et références CSS
 */

/* ============================================
   HORSES DOMAIN
   ============================================ */

export const HORSE_TYPES = {
  PONY: 'pony',
  HORSE: 'horse',
};

export const HORSE_KIND_LABELS = {
  [HORSE_TYPES.PONY]: {
    value: HORSE_TYPES.PONY,
    label: 'Poney',
    badgeClass: 'badge-pony',
    cssVar: '--color-pony-light',
  },
  [HORSE_TYPES.HORSE]: {
    value: HORSE_TYPES.HORSE,
    label: 'Cheval',
    badgeClass: 'badge-horse',
    cssVar: '--color-info',
  },
};

export const getHorseKindLabel = (kind) => HORSE_KIND_LABELS[kind]?.label || kind;

export const HORSE_KINDS = Object.values(HORSE_TYPES);

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
    cssVar: '--color-laury',
  },
  [OWNER_TYPES.PRIVATE_OWNER]: {
    value: OWNER_TYPES.PRIVATE_OWNER,
    label: 'Propriétaire',
    cssVar: '--color-success-medium',
  },
  [OWNER_TYPES.CLUB]: {
    value: OWNER_TYPES.CLUB,
    label: 'Club',
    cssVar: '--color-info',
  },
  [OWNER_TYPES.OTHER]: {
    value: OWNER_TYPES.OTHER,
    label: 'Autre',
    cssVar: '--color-warning-orange',
  },
};

export const getOwnerTypeLabel = (type) => OWNER_TYPE_LABELS[type]?.label || type;

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
    badgeClass: 'badge-rider-type',
    cssVar: '--color-warning-orange',
  },
  [RIDER_TYPES.CLUB]: {
    value: RIDER_TYPES.CLUB,
    label: 'Club',
    badgeClass: 'badge-rider-type',
    cssVar: '--color-info-blue',
  },
  [RIDER_TYPES.LOANER]: {
    value: RIDER_TYPES.LOANER,
    label: 'Pensionnaire',
    badgeClass: 'badge-rider-type',
    cssVar: '--color-success-medium',
  },
};

export const getRiderTypeLabel = (type) => RIDER_TYPE_LABELS[type]?.label || type;

/* ============================================
   PACKAGES DOMAIN
   ============================================ */

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
    cssVar: '--color-success-dark',
  },
  [PACKAGE_STATUS.UPCOMING]: {
    value: 'upcoming',
    label: 'À venir',
    cssClass: 'upcoming',
    cssVar: '--color-info-dark',
  },
  [PACKAGE_STATUS.EXPIRED]: {
    value: 'expired',
    label: 'Expiré',
    cssClass: 'expired',
    cssVar: '--color-gray-650',
  },
  [PACKAGE_STATUS.INACTIVE]: {
    value: 'inactive',
    label: 'Inactif',
    cssClass: 'inactive',
    cssVar: '--color-danger-dark',
  },
  [PACKAGE_STATUS.SUSPENDED]: {
    value: 'suspended',
    label: 'Suspendu',
    cssClass: 'suspended',
    cssVar: '--color-warning-dark',
  },
};

export const getPackageStatusLabel = (status) => PACKAGE_STATUS_LABELS[status] || status;

export const getPackageStatusConfig = (status) =>
  PACKAGE_STATUS_CONFIG[status] || PACKAGE_STATUS_CONFIG[PACKAGE_STATUS.INACTIVE];

export const isPackageActive = (status) => status === PACKAGE_STATUS.ACTIVE;

/* ============================================
   PAIRINGS DOMAIN (Rider-Horse Links)
   ============================================ */

export const RIDER_HORSE_LINK_TYPE = {
  OWN: 'own',
  LOAN: 'loan',
};

export const RIDER_HORSE_LINK_TYPE_LABELS = {
  [RIDER_HORSE_LINK_TYPE.OWN]: 'Propriétaire',
  [RIDER_HORSE_LINK_TYPE.LOAN]: 'Pension',
};

export const RIDER_HORSE_LINK_TYPE_CONFIG = {
  [RIDER_HORSE_LINK_TYPE.OWN]: {
    value: 'own',
    label: 'Propriétaire',
    badgeClass: 'badge-pairing', // Classe de base commune
    cssVar: '--color-warning-orange',
  },
  [RIDER_HORSE_LINK_TYPE.LOAN]: {
    value: 'loan',
    label: 'Pension',
    badgeClass: 'badge-pairing', // Classe de base commune
    cssVar: '--color-success-medium',
  },
};

export const getRiderHorseLinkLabel = (type) => RIDER_HORSE_LINK_TYPE_LABELS[type] || type;

export const getRiderHorseLinkConfig = (type) =>
  RIDER_HORSE_LINK_TYPE_CONFIG[type] || RIDER_HORSE_LINK_TYPE_CONFIG[RIDER_HORSE_LINK_TYPE.OWN];

export const isLoanPairing = (pairingOrType) =>
  typeof pairingOrType === 'string'
    ? pairingOrType === RIDER_HORSE_LINK_TYPE.LOAN
    : pairingOrType?.link_type === RIDER_HORSE_LINK_TYPE.LOAN;

export const isOwnPairing = (pairingOrType) =>
  typeof pairingOrType === 'string'
    ? pairingOrType === RIDER_HORSE_LINK_TYPE.OWN
    : pairingOrType?.link_type === RIDER_HORSE_LINK_TYPE.OWN;

/**
 * Returns a human-readable description for a pairing
 * Example:
 * - "Propriétaire"
 * - "Pension – 3 jours / semaine (lun, mer, ven)"
 */
export const getRiderHorseLinkDescription = (pairing) => {
  if (!pairing) return null;

  if (pairing.link_type === RIDER_HORSE_LINK_TYPE.LOAN) {
    const daysLabel =
      Array.isArray(pairing.loan_days) && pairing.loan_days.length > 0
        ? ` (${pairing.loan_days.join(', ')})`
        : '';
    return `Pension – ${pairing.loan_days_per_week} jour${
      pairing.loan_days_per_week > 1 ? 's' : ''
    } / semaine${daysLabel}`;
  }

  return getRiderHorseLinkLabel(pairing.link_type);
};

/* -----------------------
 * Validation helpers
 * ----------------------- */

export const isValidLoanDaysPerWeek = (value) =>
  Number.isInteger(value) && value >= 1 && value <= 7;

export const WEEK_DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

export const WEEK_DAYS_EN = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

/**
 * Convert weekday number (1=Mon .. 7=Sun) to code ('mon', 'tue', ...)
 * @param {number} n
 * @returns {string|null}
 */
export const weekDayNumberToCode = (n) => {
  if (!Number.isInteger(n) || n < 1 || n > 7) return null;
  return WEEK_DAYS_EN[n - 1];
};

/**
 * Convert weekday code ('mon','tue',...) to number (1..7)
 * @param {string|number} code
 * @returns {number|null}
 */
export const weekDayCodeToNumber = (code) => {
  if (typeof code === 'number') {
    return code >= 1 && code <= 7 ? code : null;
  }
  if (!code) return null;
  const s = String(code).toLowerCase();
  const idx = WEEK_DAYS_EN.indexOf(s);
  return idx === -1 ? null : idx + 1;
};

/**
 * Convert weekday code ('mon','tue',...) to French abbreviation ('Lun','Mar',...)
 * @param {string} code - weekday code
 * @returns {string|null} French abbreviation or null if invalid
 */
export const weekDayCodeToFr = (code) => {
  if (!code) return null;
  const idx = WEEK_DAYS_EN.indexOf(String(code).toLowerCase());
  return idx === -1 ? null : WEEK_DAYS[idx];
};

/**
 * Convert array of weekday codes to French abbreviations
 * @param {string[]} codes
 * @returns {string[]} Array of French abbreviations
 */
export const weekDaysCodesToFr = (codes) => {
  if (!Array.isArray(codes)) return [];
  return codes.map(weekDayCodeToFr).filter(Boolean);
};

/**
 * Defensive helper to get loan days safely (returns array or empty array)
 */
export const getLoanDays = (pairing) =>
  Array.isArray(pairing?.loan_days) ? pairing.loan_days : [];

/* ============================================
   EVENTS DOMAIN
   ============================================ */

export const HORSE_ASSIGNMENT_TYPES = {
  MANUAL: 'manual',
  AUTOMATIC: 'automatic',
};

export const PARTICIPATION_STATUSES = {
  CONFIRMED: 'confirmed',
  PENDING: 'pending',
  CANCELLED: 'cancelled',
};

export const PARTICIPATION_STATUS_LABELS = {
  [PARTICIPATION_STATUSES.CONFIRMED]: 'Confirmé',
  [PARTICIPATION_STATUSES.PENDING]: 'En attente',
  [PARTICIPATION_STATUSES.CANCELLED]: 'Annulé',
};

export const getParticipationStatusLabel = (status) =>
  PARTICIPATION_STATUS_LABELS[status] || status;

/**
 * Map participation status to DB fields (currently maps to is_cancelled)
 */
export const participationStatusToDb = (status) => ({
  is_cancelled: status === 'cancelled',
});

/* ============================================
   GENERAL STATUS
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
    value: STATUS_TYPES.ACTIVE,
    label: 'Actif',
    cssVar: '--color-success-medium',
  },
  [STATUS_TYPES.INACTIVE]: {
    value: STATUS_TYPES.INACTIVE,
    label: 'Inactif',
    cssVar: '--color-gray-600',
  },
  [STATUS_TYPES.PENDING]: {
    value: STATUS_TYPES.PENDING,
    label: 'En attente',
    cssVar: '--color-warning-orange',
  },
  [STATUS_TYPES.COMPLETED]: {
    value: STATUS_TYPES.COMPLETED,
    label: 'Terminé',
    cssVar: '--color-primary-purple',
  },
  [STATUS_TYPES.CANCELLED]: {
    value: STATUS_TYPES.CANCELLED,
    label: 'Annulé',
    cssVar: '--color-danger-medium',
  },
};

export const getStatusLabel = (status) => STATUS_LABELS[status]?.label || status;

export const INSTRUCTORS = {
  1: 'Laury',
  2: 'Kévin',
  3: 'Julie',
  4: 'Capucine',
  0: 'Autre',
};
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

/**
 * Check if an item is in the past
 * @param {string} endDate - Activity end date
 * @returns {boolean} True if the item is in the past
 */
export function isPast(endDate) {
  if (!endDate) return false;
  const end = new Date(endDate);
  const now = new Date();
  return end < now;
}

/**
 * Check if an item is in the future
 * @param {string} startDate - Activity start date
 * @returns {boolean} True if the item is in the future
 */
export function isFuture(startDate) {
  if (!startDate) return false;
  const start = new Date(startDate);
  const now = new Date();
  return start > now;
}
```

---

## 📄 entityFilters.js
**Path:** `helpers/filters/entityFilters.js`

```
/**
 * Entity Filter Utilities - Filter arrays of entities by activity status
 */

import { isActive } from './activityFilters';
import { EVENT_TYPES } from '../../domain/events';

/* -------------------------------------------------------
 * ACTIVE ENTITY FILTERS
 * ----------------------------------------------------- */

export function filterActivePackages(packages) {
  if (!Array.isArray(packages)) return [];
  return packages.filter((pkg) => pkg.is_active);
}

export function filterActivePairings(pairings) {
  if (!Array.isArray(pairings)) return [];

  return pairings.filter((pairing) => {
    const pairingActive = isActive(pairing.pairing_start_date, pairing.pairing_end_date);

    const horseObj = pairing.horse || pairing.horses || null;
    const horseActive =
      horseObj && typeof horseObj === 'object'
        ? isActive(horseObj.activity_start_date, horseObj.activity_end_date)
        : true;

    return pairingActive && horseActive;
  });
}

export function filterActiveRiders(riders) {
  if (!Array.isArray(riders)) return [];
  return riders.filter((rider) => isActive(rider.activity_start_date, rider.activity_end_date));
}

/* -------------------------------------------------------
 * CALENDAR FILTER CONFIGURATION
 * (semantic → DB event_type mapping)
 * ----------------------------------------------------- */

export const CALENDAR_EVENT_TYPE_FILTERS = [
  { value: 'all', label: 'Tous les types' },

  {
    value: 'lessons',
    label: 'Cours',
    eventTypes: [EVENT_TYPES.PRIVATE_LESSON, EVENT_TYPES.GROUPED_LESSON],
  },

  {
    value: EVENT_TYPES.SPECIAL,
    label: 'Événements spéciaux',
    eventTypes: [EVENT_TYPES.SPECIAL],
  },

  {
    value: EVENT_TYPES.COMPETITION,
    label: 'Compétitions',
    eventTypes: [EVENT_TYPES.COMPETITION],
  },

  {
    value: EVENT_TYPES.SERVICE,
    label: 'Services',
    eventTypes: [EVENT_TYPES.SERVICE],
  },

  {
    value: EVENT_TYPES.LOANER_FREE_TIME,
    label: 'Temps libre DP',
    eventTypes: [EVENT_TYPES.LOANER_FREE_TIME],
  },

  {
    value: EVENT_TYPES.BLOCKED,
    label: 'Bloqués',
    eventTypes: [EVENT_TYPES.BLOCKED],
  },
];

export const CALENDAR_STATUS_FILTERS = [
  { value: 'all', label: 'Tous les statuts' },
  { value: 'scheduled', label: 'Planifiés' },
  { value: 'confirmed', label: 'Confirmés' },
  { value: 'completed', label: 'Terminés' },
  { value: 'cancelled', label: 'Annulés' },
];

export const CALENDAR_DEFAULT_FILTERS = {
  eventType: 'all',
  status: 'all',
};

/* -------------------------------------------------------
 * EVENT FILTER LOGIC
 * ----------------------------------------------------- */

export function filterLessons(events, filters) {
  if (!Array.isArray(events)) return [];

  return events.filter((event) => {
    // ---- Event type filter
    if (filters.eventType !== 'all') {
      const filterConfig = CALENDAR_EVENT_TYPE_FILTERS.find((f) => f.value === filters.eventType);

      if (!filterConfig || !filterConfig.eventTypes?.includes(event.event_type)) {
        return false;
      }
    }

    // ---- Status filter
    if (filters.status !== 'all' && event.status !== filters.status) {
      return false;
    }

    return true;
  });
}
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
 * Get active items for a rider
 * @param {Object} rider - Rider object
 * @returns {Object} Active items
 */
export function getRiderActiveItems(rider) {
  return {
    packages: rider.packages ? rider.packages.filter((p) => p.is_active) : [],
    pairings: rider.pairings
      ? rider.pairings.filter((p) => isActive(p.pairing_start_date, p.pairing_end_date))
      : [],
    horses: rider.horses
      ? rider.horses.filter((h) => isActive(h.activity_start_date, h.activity_end_date))
      : [],
  };
}

/**
 * Filter riders by status
 * @param {Array} riders - Array of rider objects
 * @param {string} filter - Filter type ('all', 'active', 'inactive')
 * @returns {Array} Filtered riders
 */
export function filterRidersByStatus(riders, filter) {
  if (filter === 'all') return riders;
  return riders.filter((rider) => {
    const isActiveRider = isActive(rider.activity_start_date, rider.activity_end_date);
    return filter === 'active' ? isActiveRider : !isActiveRider;
  });
}

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
 * Helpers formatters barrel
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

// Dans lib/helpers/formatters.js

/**
 * Convertit une chaîne "HH:MM" en minutes depuis minuit
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
 * Convertit des minutes depuis minuit en format "HH:MM"
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
 * Calculate event style positioning
 * @param {Object} event - Lesson object
 * @param {number} HOUR_HEIGHT - Height of one hour in pixels
 * @param {number} START_HOUR - Calendar start hour
 * @param {number} END_HOUR - Calendar end hour
 * @returns {Object} Style object with top and height
 */
export function calculateLessonStyle(event, HOUR_HEIGHT = 60, START_HOUR = 8, END_HOUR = 22) {
  if (!event?.start_time || !event?.end_time) {
    return { display: 'none' };
  }

  const startMinutes = timeToMinutes(event.start_time);
  const endMinutes = timeToMinutes(event.end_time);
  const dayStartMinutes = START_HOUR * 60;
  const dayEndMinutes = END_HOUR * 60;

  // Check if event is outside visible hours
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

## 📄 index.js
**Path:** `helpers/index.js`

```
/**
 * Helpers barrel
 */

export * from './ui.js';
export * from './utils.js';
export * from './validators.js';
export * from './formatters/index.js';
export * from './filters/activityFilters.js';
export * from './filters/entityFilters.js';
export * from './filters/riders.js';
export * from './stats/riders.js';
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

/**
 * Calculate statistics for riders list
 * @param {Array} riders - Array of rider objects
 * @returns {Object} Statistics object with counts
 */
export function calculateRiderStatsWithPackages(riders) {
  return {
    total: riders.length,
    active: riders.filter((r) => isActive(r.activity_start_date, r.activity_end_date)).length,
    withActivePackages: riders.filter(
      (r) => r.packages && r.packages.filter((p) => p.is_active).length > 0
    ).length,
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

import { RIDER_TYPE_LABELS } from '../domain/index.js';

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
const ALLOWED_TYPES = Array.isArray(RIDER_TYPE_LABELS)
  ? RIDER_TYPE_LABELS.map((k) => k.value)
  : Object.values(RIDER_TYPE_LABELS || {}).map((k) => k.value);

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
  } else if (!ALLOWED_TYPES.includes(formData.rider_type)) {
    errors.rider_type = 'Le type doit être "owner", "club" ou "loaner"';
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
 * Library root barrel
 *
 * Usage:
 * import { API_ENDPOINTS, HORSE_TYPES, formatDate, getCardStyle } from 'frontend/src/lib';
 */

export * as config from './config/index.js';
export * as domain from './domain/index.js';
export * as helpers from './helpers/index.js';
```

---

