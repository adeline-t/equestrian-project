/**
 * Horse owner type constants
 */
export const OWNER_TYPES = {
  LAURY: {
    value: 'Laury',
    label: 'Laury',
  },
  OWNER: {
    value: 'Propriétaire',
    label: 'Propriétaire',
  },
  CLUB: {
    value: 'Club',
    label: 'Club',
  },
};

/**
 * Get owner type label
 * @param {string} type - Owner type value
 * @returns {string} Human-readable label
 */
export const getOwnerTypeLabel = (type) => {
  const ownerType = Object.values(OWNER_TYPES).find((o) => o.value === type);
  return ownerType?.label || type;
};

/**
 * Check if owner is Laury
 * @param {string} type - Owner type value
 * @returns {boolean} True if Laury
 */
export const isLaury = (type) => {
  return type === OWNER_TYPES.LAURY.value;
};

/**
 * Check if owner is a club
 * @param {string} type - Owner type value
 * @returns {boolean} True if club
 */
export const isClub = (type) => {
  return type === OWNER_TYPES.CLUB.value;
};
