/**
 * Package-related constants
 */

export const PACKAGE_TYPES = {
  PRIVATE: 'private',
  JOINT: 'joint',
  MIXED: 'mixed',
};

export const PACKAGE_STATUS = {
  ACTIVE: 'active',
  EXPIRED: 'expired',
  SUSPENDED: 'suspended',
};

/**
 * Calculate remaining lessons in a package
 * @param {Object} pkg - Package object
 * @returns {Object} Remaining lessons by type
 */
export const calculateRemainingLessons = (pkg) => {
  return {
    private: (pkg.private_lesson_count || 0) - (pkg.private_lessons_used || 0),
    joint: (pkg.joint_lesson_count || 0) - (pkg.joint_lessons_used || 0),
  };
};

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
  
  const remaining = calculateRemainingLessons(pkg);
  return remaining.private > 0 || remaining.joint > 0;
};