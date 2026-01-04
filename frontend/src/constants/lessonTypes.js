import { Icons } from '../lib/libraries/icons.jsx';

/**
 * Lesson type configurations
 */
export const LESSON_TYPES = [
  {
    value: 'private',
    label: 'Cours particulier',
    icon: Icons.PrivateLesson,
    defaultMax: 1,
  },
  {
    value: 'group',
    label: 'Cours collectif',
    icon: Icons.GroupLesson,
    defaultMax: 6,
  },
  {
    value: 'training',
    label: 'Stage',
    icon: Icons.Training,
    defaultMax: 10,
  },
  {
    value: 'competition',
    label: 'Concours',
    icon: Icons.Competition,
    defaultMax: 20,
  },
  {
    value: 'event',
    label: 'Événement',
    icon: Icons.Event,
    defaultMax: 50,
  },
  {
    value: 'blocked',
    label: 'Période bloquée',
    icon: Icons.Blocked,
    defaultMax: null,
  },
];

/**
 * Get lesson type icon component
 * @param {string} type - Lesson type
 * @returns {React.Component} Icon component
 */
export const getLessonTypeIcon = (type) => {
  const lessonType = LESSON_TYPES.find((t) => t.value === type);
  return lessonType?.icon || Icons.Calendar;
};

/**
 * Get lesson type label
 * @param {string} type - Lesson type
 * @returns {string} Human-readable label
 */
export const getLessonTypeLabel = (type) => {
  const lessonType = LESSON_TYPES.find((t) => t.value === type);
  return lessonType?.label || type;
};

/**
 * Get lesson type configuration
 * @param {string} type - Lesson type
 * @returns {Object} Lesson type configuration
 */
export const getLessonTypeConfig = (type) => {
  return LESSON_TYPES.find((t) => t.value === type);
};

/**
 * Check if lesson type is blocked
 * @param {string} type - Lesson type
 * @returns {boolean} True if blocked type
 */
export const isBlockedLesson = (type) => {
  return type === 'blocked';
};
