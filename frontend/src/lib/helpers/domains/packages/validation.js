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
  
  // Import calculation function to avoid circular dependency
  const remaining = {
    private: (pkg.private_lesson_count || 0) - (pkg.private_lessons_used || 0),
    joint: (pkg.joint_lesson_count || 0) - (pkg.joint_lessons_used || 0),
  };
  
  return remaining.private > 0 || remaining.joint > 0;
};