/**
 * Package type constants
 */
export const PACKAGE_TYPES = {
  PRIVATE: 'private',
  JOINT: 'joint',
  MIXED: 'mixed',
};

export const PACKAGE_TYPE_LABELS = {
  [PACKAGE_TYPES.PRIVATE]: 'Privé',
  [PACKAGE_TYPES.JOINT]: 'Collectif',
  [PACKAGE_TYPES.MIXED]: 'Mixte',
};

/**
 * Get package type label
 * @param {string} type - Package type value
 * @returns {string} Human-readable label
 */
export const getPackageTypeLabel = (type) => {
  return PACKAGE_TYPE_LABELS[type] || type;
};