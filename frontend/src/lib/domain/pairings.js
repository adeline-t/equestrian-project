/* ------------------------------------------------------------------
 * Domain: Rider–Horse Pairings
 * ------------------------------------------------------------------ */

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
    cssClass: 'own',
    gradient: 'var(--gradient-primary)',
  },
  [RIDER_HORSE_LINK_TYPE.LOAN]: {
    value: 'loan',
    label: 'Pension',
    cssClass: 'loan',
    gradient: 'var(--gradient-warning)',
  },
};

/* -----------------------
 * Helpers (UI / métier)
 * ----------------------- */

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

export const validWeekDays = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

/**
 * Validate array of weekdays
 */
export const isValidLoanDays = (days) =>
  Array.isArray(days) && days.every((d) => validWeekDays.includes(d));

/**
 * Defensive helper to get loan days safely
 */
export const getLoanDays = (pairing) =>
  Array.isArray(pairing?.loan_days) ? pairing.loan_days : [];
