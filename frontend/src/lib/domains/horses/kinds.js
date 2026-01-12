/**
 * Horse kind constants
 */
export const HORSE_KIND_LABELS = {
  PONY: {
    value: 'pony',
    label: 'Poney',
    color: '#ed64a6',
    gradient: 'var(--gradient-pony)',
    badgeClass: 'badge-pony',
  },
  HORSE: {
    value: 'horse',
    label: 'Cheval',
    color: '#4299e1',
    gradient: 'var(--gradient-info)',
    badgeClass: 'badge-horse',
  },
};

/**
 * Get horse kind label
 * @param {string} kind - Horse kind value
 * @returns {string} Human-readable label
 */
export const getHorseKindLabel = (kind) => {
  const horseKind = Object.values(HORSE_KIND_LABELS).find((k) => k.value === kind);
  return horseKind?.label || kind;
};

/**
 * Get horse kind color
 * @param {string} kind - Horse kind value
 * @returns {string} Color hex code
 */
export const getHorseKindColor = (kind) => {
  const horseKind = Object.values(HORSE_KIND_LABELS).find((k) => k.value === kind);
  return horseKind?.color || '#6c757d';
};

/**
 * Get horse kind gradient
 * @param {string} kind - Horse kind value
 * @returns {string} CSS gradient variable
 */
export const getHorseKindGradient = (kind) => {
  const horseKind = Object.values(HORSE_KIND_LABELS).find((k) => k.value === kind);
  return horseKind?.gradient || 'var(--gradient-secondary)';
};

/**
 * Get horse kind badge class
 * @param {string} kind - Horse kind value
 * @returns {string} Badge CSS class
 */
export const getHorseKindBadgeClass = (kind) => {
  const horseKind = Object.values(HORSE_KIND_LABELS).find((k) => k.value === kind);
  return horseKind?.badgeClass || 'badge-secondary';
};

/**
 * Get horse kind configuration
 * @param {string} kind - Horse kind value
 * @returns {Object} Full horse kind configuration
 */
export const getHorseKindConfig = (kind) => {
  return Object.values(HORSE_KIND_LABELS).find((k) => k.value === kind);
};

/**
 * Check if horse is a pony
 * @param {string} kind - Horse kind value
 * @returns {boolean} True if pony
 */
export const isPony = (kind) => {
  return kind === HORSE_KIND_LABELS.PONY.value;
};

/**
 * Check if horse is a horse
 * @param {string} kind - Horse kind value
 * @returns {boolean} True if horse
 */
export const isHorse = (kind) => {
  return kind === HORSE_KIND_LABELS.HORSE.value;
};

/**
 * All horse kinds for iteration
 */
export const HORSE_KINDS = Object.values(HORSE_KIND_LABELS).map((k) => k.value);
