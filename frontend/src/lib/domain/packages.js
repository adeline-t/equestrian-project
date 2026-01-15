/**
 * Domain: Packages
 *
 * No structural change required; kept for completeness.
 */

export const PACKAGE_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
};

export const PACKAGE_STATUS_LABELS = {
  [PACKAGE_STATUS.ACTIVE]: 'Actif',
  [PACKAGE_STATUS.INACTIVE]: 'Inactif',
};

export const PACKAGE_STATUS_CONFIG = {
  [PACKAGE_STATUS.ACTIVE]: {
    value: 'active',
    label: 'Actif',
    cssClass: 'active',
    gradient: 'var(--gradient-success)',
  },
  [PACKAGE_STATUS.INACTIVE]: {
    value: 'inactive',
    label: 'Inactif',
    cssClass: 'inactive',
    gradient: 'var(--gradient-danger)',
  },
};

export const getPackageStatusLabel = (status) => PACKAGE_STATUS_LABELS[status] || status;
export const getPackageStatusConfig = (status) =>
  PACKAGE_STATUS_CONFIG[status] || PACKAGE_STATUS_CONFIG[PACKAGE_STATUS.INACTIVE];

export const isPackageActive = (status) => status === PACKAGE_STATUS.ACTIVE;
