export const RIDER_KIND_LABELS = {
  OWNER: {
    value: 'owner',
    label: 'Propriétaire',
    color: '#ed8936', // Orange
    gradient: 'var(--gradient-warning)',
    badgeClass: 'badge-owner',
  },
  CLUB: {
    value: 'club',
    label: 'Club',
    color: '#4299e1', // Blue
    gradient: 'var(--gradient-info)',
    badgeClass: 'badge-club',
  },
  BOARDER: {
    value: 'boarder',
    label: 'Pensionnaire',
    color: '#48bb78', // Green
    gradient: 'var(--gradient-success)',
    badgeClass: 'badge-boarder',
  },
};

/**
 * Get rider kind label
 * @param {string} kind - Rider kind value
 * @returns {string} Human-readable label
 */
export const getRiderKindLabel = (kind) => {
  const riderKind = Object.values(RIDER_KIND_LABELS).find((k) => k.value === kind);
  return riderKind?.label || kind;
};

/**
 * Get rider kind color
 * @param {string} kind - Rider kind value
 * @returns {string} Color hex code
 */
export const getRiderKindColor = (kind) => {
  const riderKind = Object.values(RIDER_KIND_LABELS).find((k) => k.value === kind);
  return riderKind?.color || '#6c757d';
};

/**
 * Get rider kind gradient
 * @param {string} kind - Rider kind value
 * @returns {string} CSS gradient variable
 */
export const getRiderKindGradient = (kind) => {
  const riderKind = Object.values(RIDER_KIND_LABELS).find((k) => k.value === kind);
  return riderKind?.gradient || 'var(--gradient-secondary)';
};

/**
 * Get rider kind badge class
 * @param {string} kind - Rider kind value
 * @returns {string} Badge CSS class
 */
export const getRiderKindBadgeClass = (kind) => {
  const riderKind = Object.values(RIDER_KIND_LABELS).find((k) => k.value === kind);
  return riderKind?.badgeClass || 'badge-secondary';
};

/**
 * Get rider kind configuration
 * @param {string} kind - Rider kind value
 * @returns {Object} Full rider kind configuration
 */
export const getRiderKindConfig = (kind) => {
  return Object.values(RIDER_KIND_LABELS).find((k) => k.value === kind);
};

/**
 * All rider kinds for iteration
 */
export const RIDER_KINDS = Object.values(RIDER_KIND_LABELS).map((k) => k.value);
