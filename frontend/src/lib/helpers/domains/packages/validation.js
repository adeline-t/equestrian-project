/**
 * Package validation utilities
 */

/**
 * Check if package is active
 * @param {Object} pkg - Package object
 * @returns {boolean} True if package is active
 */
export const isPackageActive = (pkg) => {
  if (!pkg) return false;

  const now = new Date();
  const startDate = pkg.activity_start_date ? new Date(pkg.activity_start_date) : null;
  const endDate = pkg.activity_end_date ? new Date(pkg.activity_end_date) : null;

  if (startDate && now < startDate) return false;
  if (endDate && now > endDate) return false;

  return true;
};

/**
 * Check if package is expired
 * @param {Object} pkg - Package object
 * @returns {boolean} True if package is expired
 */
export const isPackageExpired = (pkg) => {
  if (!pkg) return false;

  const now = new Date();
  const endDate = pkg.activity_end_date ? new Date(pkg.activity_end_date) : null;

  if (endDate && now > endDate) return true;

  return false;
};

/**
 * Check if package is future (not started yet)
 * @param {Object} pkg - Package object
 * @returns {boolean} True if package is in the future
 */
export const isPackageFuture = (pkg) => {
  if (!pkg) return false;

  const now = new Date();
  const startDate = pkg.activity_start_date ? new Date(pkg.activity_start_date) : null;

  return startDate && now < startDate;
};
