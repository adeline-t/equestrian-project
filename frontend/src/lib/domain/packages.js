/**
 * Domain: Packages
 *
 * No structural change required; kept for completeness.
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

export const getPackageStatusLabel = (status) => PACKAGE_STATUS_LABELS[status] || status;
export const getPackageStatusConfig = (status) =>
  PACKAGE_STATUS_CONFIG[status] || PACKAGE_STATUS_CONFIG[PACKAGE_STATUS.INACTIVE];

export const isPackageActive = (status) => status === PACKAGE_STATUS.ACTIVE;
export const isPackageExpired = (status) => status === PACKAGE_STATUS.EXPIRED;
export const isPackageSuspended = (status) => status === PACKAGE_STATUS.SUSPENDED;
export const isPackageUpcoming = (status) => status === PACKAGE_STATUS.UPCOMING;
