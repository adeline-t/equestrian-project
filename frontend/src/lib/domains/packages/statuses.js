/**
 * Package status constants
 */
export const PACKAGE_STATUS = {
  ACTIVE: 'active',
  UPCOMING: 'upcoming',
  EXPIRED: 'expired',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
};

export const PACKAGE_STATUS_LABELS = {
  [PACKAGE_STATUS.ACTIVE]: 'Actif',
  [PACKAGE_STATUS.UPCOMING]: 'À venir',
  [PACKAGE_STATUS.EXPIRED]: 'Expiré',
  [PACKAGE_STATUS.INACTIVE]: 'Inactif',
  [PACKAGE_STATUS.SUSPENDED]: 'Suspendu',
};

export const PACKAGE_STATUS_CONFIG = {
  [PACKAGE_STATUS.ACTIVE]: {
    value: 'active',
    label: 'Actif',
    cssClass: 'active',
    gradient: 'var(--gradient-success)',
  },
  [PACKAGE_STATUS.UPCOMING]: {
    value: 'upcoming',
    label: 'À venir',
    cssClass: 'upcoming',
    gradient: 'var(--gradient-info)',
  },
  [PACKAGE_STATUS.EXPIRED]: {
    value: 'expired',
    label: 'Expiré',
    cssClass: 'expired',
    gradient: 'var(--gradient-secondary)',
  },
  [PACKAGE_STATUS.INACTIVE]: {
    value: 'inactive',
    label: 'Inactif',
    cssClass: 'inactive',
    gradient: 'var(--gradient-danger)',
  },
  [PACKAGE_STATUS.SUSPENDED]: {
    value: 'suspended',
    label: 'Suspendu',
    cssClass: 'suspended',
    gradient: 'var(--gradient-warning)',
  },
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
 * Get package status configuration
 * @param {string} status - Status value
 * @returns {Object} Status configuration with label, cssClass, gradient
 */
export const getPackageStatusConfig = (status) => {
  return PACKAGE_STATUS_CONFIG[status] || PACKAGE_STATUS_CONFIG[PACKAGE_STATUS.INACTIVE];
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

/**
 * Check if package is upcoming
 * @param {string} status - Status value
 * @returns {boolean} True if upcoming
 */
export const isPackageUpcoming = (status) => {
  return status === PACKAGE_STATUS.UPCOMING;
};
