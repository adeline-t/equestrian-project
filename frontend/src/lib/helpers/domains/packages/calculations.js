/**
 * Package calculation utilities
 */

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