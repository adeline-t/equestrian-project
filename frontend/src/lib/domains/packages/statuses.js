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

/**
 * Check if package is active
 * @param {string} status - Status value
 * @returns {boolean} True if active
 */
export const isPackageActive = (status) => {
  return status === PACKAGE_STATUS.ACTIVE;
};

/**
 * Check if package is expired
 * @param {string} status - Status value
 * @returns {boolean} True if expired
 */
export const isPackageExpired = (status) => {
  return status === PACKAGE_STATUS.EXPIRED;
};

/**
 * Check if package is suspended
 * @param {string} status - Status value
 * @returns {boolean} True if suspended
 */
export const isPackageSuspended = (status) => {
  return status === PACKAGE_STATUS.SUSPENDED;
};