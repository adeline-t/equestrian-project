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
 * Form validation messages
 */
export const VALIDATION_MESSAGES = {
  REQUIRED: 'Ce champ est requis',
  INVALID_EMAIL: "Format d'email invalide",
  INVALID_PHONE: 'Format de téléphone invalide',
  FORMAT_INVALID: 'Format invalide',
  MIN_LENGTH: 'Ce champ doit contenir au moins {min} caractères',
  MAX_LENGTH: 'Ce champ ne peut pas dépasser {max} caractères',
  INVALID_DATE: 'Date invalide',
  INVALID_TIME: 'Heure invalide',
};

/**
 * UI Validation Rules
 */
export const VALIDATION_RULES = {
  NAME: {
    minLength: 1,
    maxLength: 100,
    required: true,
  },
  EMAIL: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    required: false,
  },
  PHONE: {
    pattern: /^[\d\s\-+()]+$/,
    minLength: 10,
    required: false,
  },
  DESCRIPTION: {
    maxLength: 500,
    required: false,
  },
};

/**
 * Get validation message with parameters
 * @param {string} messageKey - Message key
 * @param {Object} params - Parameters to replace
 * @returns {string} Formatted message
 */
export const getValidationMessage = (messageKey, params = {}) => {
  let message = VALIDATION_MESSAGES[messageKey] || '';
  Object.keys(params).forEach((k) => {
    message = message.replace(`{${k}}`, params[k]);
  });
  return message;
};

/**
 * Format validation message for min/max length
 * @param {string} type - 'min' or 'max'
 * @param {number} value - Length value
 * @returns {string} Formatted message
 */
export const formatLengthMessage = (type, value) => {
  const key = type === 'min' ? 'MIN_LENGTH' : 'MAX_LENGTH';
  return getValidationMessage(key, { [type]: value });
};

/**
 * Validate value against rule
 * @param {*} value - Value to validate
 * @param {Object} rule - Validation rule
 * @returns {Object} Validation result
 */
export const validateRule = (value, rule) => {
  const errors = [];

  // Required check (handle undefined, null, empty string)
  if (rule.required && (value === undefined || value === null || value === '')) {
    errors.push(getValidationMessage('REQUIRED'));
    return { isValid: false, errors };
  }

  // If value is empty and not required, it's valid
  if (value === undefined || value === null || value === '') {
    return { isValid: true, errors };
  }

  // Min length check
  if (rule.minLength && value.length < rule.minLength) {
    errors.push(formatLengthMessage('min', rule.minLength));
  }

  // Max length check
  if (rule.maxLength && value.length > rule.maxLength) {
    errors.push(formatLengthMessage('max', rule.maxLength));
  }

  // Pattern check
  if (rule.pattern && !rule.pattern.test(value)) {
    if (rule === VALIDATION_RULES.EMAIL) {
      errors.push(getValidationMessage('INVALID_EMAIL'));
    } else if (rule === VALIDATION_RULES.PHONE) {
      errors.push(getValidationMessage('INVALID_PHONE'));
    } else {
      errors.push(getValidationMessage('FORMAT_INVALID'));
    }
  }

  return { isValid: errors.length === 0, errors };
};

/**
 * Get validation rule by name
 * @param {string} ruleName - Rule name
 * @returns {Object|null} Validation rule
 */
export const getValidationRule = (ruleName) => {
  return VALIDATION_RULES[ruleName] || null;
};

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
 * Rider validation utilities
 */

/**
 * Validate email format
 * @param {string} email - Email address
 * @returns {boolean} True if valid email format
 */
export const isValidEmail = (email) => {
  if (!email) return true; // Email is optional
  const emailRegex = VALIDATION_RULES.EMAIL.pattern;
  return emailRegex.test(email);
};

/**
 * Validate phone format
 * @param {string} phone - Phone number
 * @returns {boolean} True if valid phone format
 */
export const isValidPhone = (phone) => {
  if (!phone) return true; // Phone is optional
  const phoneRegex = VALIDATION_RULES.PHONE.pattern;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
};

// Extract allowed values from imported labels (defensive)
const ALLOWED_TYPES = Array.isArray(RIDER_TYPE_LABELS)
  ? RIDER_TYPE_LABELS.map((k) => k.value)
  : Object.values(RIDER_TYPE_LABELS || {}).map((k) => k.value);

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
    errors.rider_type = 'Le type doit être "owner", "club" ou "boarder"';
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
