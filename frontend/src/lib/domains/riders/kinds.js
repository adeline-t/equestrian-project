/**
 * Rider kinds (types de cavaliers)
 * - owner: Propriétaire
 * - club: Club
 * - boarder: Pensionnaire
 */

export const RIDER_KIND_LABELS = {
  OWNER: {
    value: 'owner',
    label: 'Propriétaire',
  },
  CLUB: {
    value: 'club',
    label: 'Club',
  },
  BOARDER: {
    value: 'boarder',
    label: 'Pensionnaire',
  },
};

/**
 * Get human-readable label for a rider kind
 * @param {string} kind - rider kind value
 * @returns {string} label
 */
export const getRiderKindLabel = (kind) => {
  const entry = Object.values(RIDER_KIND_LABELS).find((k) => k.value === kind);
  return entry ? entry.label : kind;
};

/**
 * Get badge CSS class for a rider kind
 * @param {string} kind - rider kind value
 * @returns {string} CSS class
 */
export const getRiderKindBadgeClass = (kind) => {
  const classes = {
    owner: 'badge-primary',
    club: 'badge-info',
    boarder: 'badge-secondary',
  };
  return classes[kind] || 'badge-secondary';
};
