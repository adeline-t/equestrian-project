/**
 * Lesson type configurations (Shared between lessons and templates)
 */
import { Icons } from '../../icons';

/**
 * Lesson type configurations
 */
export const LESSON_TYPES = {
  PRIVATE: {
    value: 'private',
    label: 'Cours particulier',
    icon: Icons.PrivateLesson,
    color: '#007bff',
    defaultMax: 1,
    minP: 1,
    maxP: 1,
  },
  GROUP: {
    value: 'group',
    label: 'Cours collectif',
    icon: Icons.GroupLesson,
    color: '#28a745',
    defaultMax: 6,
    minP: 2,
    maxP: 8,
  },
  TRAINING: {
    value: 'training',
    label: 'Stage',
    icon: Icons.Training,
    color: '#ffc107',
    defaultMax: 10,
    minP: 3,
    maxP: 12,
  },
  COMPETITION: {
    value: 'competition',
    label: 'Concours',
    icon: Icons.Competition,
    color: '#dc3545',
    defaultMax: 20,
    minP: 1,
    maxP: null,
  },
  EVENT: {
    value: 'event',
    label: 'Événement',
    icon: Icons.Event,
    color: '#6f42c1',
    defaultMax: 50,
    minP: 1,
    maxP: null,
  },
  BLOCKED: {
    value: 'blocked',
    label: 'Période bloquée',
    icon: Icons.Blocked,
    color: '#6c757d',
    defaultMax: null,
    minP: 0,
    maxP: 0,
  },
};

/**
 * Get lesson type icon component
 * @param {string} type - Lesson type value
 * @returns {Component} Icon component
 */
export const getLessonTypeIcon = (type) => {
  const lessonType = Object.values(LESSON_TYPES).find((t) => t.value === type);
  return lessonType?.icon || Icons.Calendar;
};

/**
 * Get lesson type label
 * @param {string} type - Lesson type value
 * @param {boolean} short - Use short label with emoji
 * @returns {string} Human-readable label
 */
export const getLessonTypeLabel = (type, short = false) => {
  const lessonType = Object.values(LESSON_TYPES).find((t) => t.value === type);
  if (short) {
    return lessonType?.labelShort || type;
  }
  return lessonType?.label || type;
};

/**
 * Get lesson type configuration
 * @param {string} type - Lesson type value
 * @returns {Object} Full lesson type configuration
 */
export const getLessonTypeConfig = (type) => {
  return Object.values(LESSON_TYPES).find((t) => t.value === type);
};

/**
 * Check if lesson type is blocked
 * @param {string} type - Lesson type value
 * @returns {boolean} True if blocked type
 */
export const isBlockedLesson = (type) => {
  return type === LESSON_TYPES.BLOCKED.value;
};

/**
 * Horse assignment types
 */
export const HORSE_ASSIGNMENT_TYPES = {
  AUTO: 'auto',
  MANUAL: 'manual',
  NONE: 'none',
};

/**
 * Get lesson type max participants
 * @param {string} type - Lesson type value
 * @returns {number|null} Max participants or null if unlimited
 */
export const getLessonTypeMaxParticipants = (type) => {
  const config = getLessonTypeConfig(type);
  return config?.maxP || config?.defaultMax || null;
};

/**
 * Get lesson type min participants
 * @param {string} type - Lesson type value
 * @returns {number} Min participants
 */
export const getLessonTypeMinParticipants = (type) => {
  const config = getLessonTypeConfig(type);
  return config?.minP || 0;
};
