/**
 * Lesson type options for templates
 */
export const LESSON_TYPES = [
  { value: 'private', label: '👤 Cours Particulier', maxP: 1, minP: 1 },
  { value: 'group', label: '👥 Cours Collectif', maxP: 8, minP: 2 },
  { value: 'training', label: '🎓 Stage', maxP: 12, minP: 3 },
  { value: 'competition', label: '🏆 Concours', maxP: null, minP: 1 },
  { value: 'event', label: '🎉 Événement', maxP: null, minP: 1 },
  { value: 'blocked', label: '🛫 Plage Bloquée', maxP: 0, minP: 0 },
];

/**
 * Get template lesson type by value
 * @param {string} value - Lesson type value
 * @returns {Object} Lesson type configuration
 */
export const getTemplateLessonType = (value) => {
  return LESSON_TYPES.find((type) => type.value === value);
};