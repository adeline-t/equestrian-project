/**
 * Consolidated Form Validation Module
 *
 * Combines config/forms and helpers/validators into one file:
 * - validation messages and rules
 * - generic helpers: getValidationMessage, formatLengthMessage, validateRule
 * - domain validators: horse and rider
 */

import { RIDER_TYPE_LABELS } from '../domain/index.js';

/**
 * Horse validation utilities
 */

/**
 * Validate horse form data
 * @param {Object} formData - Horse form data
 * @returns {Object} Validation result with isValid and errors object
 */
export const validateHorseForm = (formData) => {
  const errors = {};

  // Name validation
  if (!formData.name || formData.name.trim() === '') {
    errors.name = 'Le nom du cheval est requis';
  }

  // Kind validation
  if (!formData.kind) {
    errors.kind = 'Le type de cheval est requis';
  }

  // Owner validation (if provided, must be valid integer)
  if (formData.owner_id && isNaN(parseInt(formData.owner_id, 10))) {
    errors.owner_id = 'Le propriétaire sélectionné est invalide';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate rider form data
 * @param {Object} formData - Rider form data
 * @returns {Object} Validation result with isValid and errors object
 */
export const validateRiderForm = (formData) => {
  const errors = {};

  // Name validation
  if (!formData.name || formData.name.trim() === '') {
    errors.name = 'Le nom du cavalier est requis';
  }

  // Type validation
  if (!formData.rider_type) {
    errors.rider_type = 'Le type de cavalier est requis';
  } else if (!ALLOWED_TYPES.includes(formData.rider_type)) {
    errors.rider_type = 'Le type doit être "owner", "club" ou "loaner"';
  }

  // Email validation
  if (formData.email && !isValidEmail(formData.email)) {
    errors.email = getValidationMessage('INVALID_EMAIL');
  }

  // Phone validation
  if (formData.phone && !isValidPhone(formData.phone)) {
    errors.phone = `${getValidationMessage('INVALID_PHONE')} (minimum 10 chiffres)`;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Filter and normalize slots for the calendar
export function getValidSlots(slots, startHour, endHour) {
  if (!Array.isArray(slots)) return [];
  return slots.filter((slot) => {
    if (slot.start_time == null || slot.end_time == null) return false;

    // Ensure start and end are numbers (minutes since 0:00)
    const startMinutes =
      typeof slot.start_time === 'number' ? slot.start_time : parseTime(slot.start_time);
    const endMinutes = typeof slot.end_time === 'number' ? slot.end_time : parseTime(slot.end_time);
    if (startMinutes >= endMinutes) return false;

    // Ensure slot is within calendar hours
    if (startMinutes / 60 >= endHour || endMinutes / 60 <= startHour) return false;

    return true;
  });
}

// Helper to parse "HH:mm" strings to minutes
function parseTime(timeStr) {
  if (!timeStr) return 0;
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}
