/**
 * Horse-related constants
 */

export const HORSE_KINDS = [
  { value: 'poney', label: 'Poney' },
  { value: 'cheval', label: 'Cheval' },
  { value: 'double_poney', label: 'Double Poney' },
];

export const HORSE_BREEDS = [
  'Selle Français',
  'Pur-sang',
  'Quarter Horse',
  'Appaloosa',
  'Paint Horse',
  'Connemara',
  'Welsh',
  'Shetland',
  'Autre',
];

export const HORSE_COLORS = [
  'Alezan',
  'Bai',
  'Noir',
  'Gris',
  'Blanc',
  'Palomino',
  'Isabelle',
  'Pie',
  'Rouan',
  'Autre',
];

/**
 * Get horse kind label
 * @param {string} kind - Horse kind value
 * @returns {string} Human-readable label
 */
export const getHorseKindLabel = (kind) => {
  const horseKind = HORSE_KINDS.find((k) => k.value === kind);
  return horseKind?.label || kind;
};