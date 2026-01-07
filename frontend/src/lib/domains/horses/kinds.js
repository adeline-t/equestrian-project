/**
 * Horse kind constants
 */
export const HORSE_KIND_LABELS = {
  PONY: {
    value: 'pony',
    label: 'Poney',
  },
  HORSE: {
    value: 'horse',
    label: 'Cheval',
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
