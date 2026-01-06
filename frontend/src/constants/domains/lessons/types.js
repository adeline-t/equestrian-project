import { Icons } from '../../../lib/libraries/icons.jsx';

/**
 * Lesson type configurations
 */
export const LESSON_TYPES = [
  {
    value: 'private',
    label: 'Cours particulier',
    icon: Icons.PrivateLesson,
    color: '#007bff',
    defaultMax: 1,
  },
  {
    value: 'group',
    label: 'Cours collectif',
    icon: Icons.GroupLesson,
    color: '#28a745',
    defaultMax: 6,
  },
  {
    value: 'training',
    label: 'Stage',
    icon: Icons.Training,
    color: '#ffc107',
    defaultMax: 10,
  },
  {
    value: 'competition',
    label: 'Concours',
    icon: Icons.Competition,
    color: '#dc3545',
    defaultMax: 20,
  },
  {
    value: 'event',
    label: 'Événement',
    icon: Icons.Event,
    color: '#6f42c1',
    defaultMax: 50,
  },
  {
    value: 'blocked',
    label: 'Période bloquée',
    icon: Icons.Blocked,
    color: '#6c757d',
    defaultMax: null,
  },
];

/**
 * Get lesson type icon component
 */
export const getLessonTypeIcon = (type) => {
  const lessonType = LESSON_TYPES.find((t) => t.value === type);
  return lessonType?.icon || Icons.Calendar;
};

/**
 * Get lesson type label
 */
export const getLessonTypeLabel = (type) => {
  const lessonType = LESSON_TYPES.find((t) => t.value === type);
  return lessonType?.label || type;
};

/**
 * Get lesson type configuration
 */
export const getLessonTypeConfig = (type) => {
  return LESSON_TYPES.find((t) => t.value === type);
};

/**
 * Check if lesson type is blocked
 */
export const isBlockedLesson = (type) => {
  return type === 'blocked';
};

/**
 * Horse assignment types
 */
export const HORSE_ASSIGNMENT_TYPES = {
  AUTO: 'auto',
  MANUAL: 'manual',
  NONE: 'none',
};