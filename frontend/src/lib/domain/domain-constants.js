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
