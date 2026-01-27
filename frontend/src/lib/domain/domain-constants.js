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
