/**
 * Package status constants
 */
export const PACKAGE_STATUS = {
  ACTIVE: 'active',
  EXPIRED: 'expired',
  SUSPENDED: 'suspended',
};

export const PACKAGE_STATUS_LABELS = {
  [PACKAGE_STATUS.ACTIVE]: 'Actif',
  [PACKAGE_STATUS.EXPIRED]: 'Expiré',
  [PACKAGE_STATUS.SUSPENDED]: 'Suspendu',
};

/**
 * Get package status label
 * @param {string} status - Status value
 * @returns {string} Human-readable label
 */
export const getPackageStatusLabel = (status) => {
  return PACKAGE_STATUS_LABELS[status] || status;
};