/**
 * Horse kind constants
 */

export const HORSE_KIND_LABELS = [
  { value: 'pony', label: 'Poney' },
  { value: 'horse', label: 'Cheval' },
];

/**
 * Get horse kind label
 * @param {string} kind - Horse kind value
 * @returns {string} Human-readable label
 */
export const getHorseKindLabel = (kind) => {
  const horseKind = HORSE_KIND_LABELS.find((k) => k.value === kind);
  return horseKind?.label || kind;
};