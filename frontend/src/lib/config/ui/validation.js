/**
 * UI Validation Rules
 */

// Form validation rules
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
 * Validate value against rule
 * @param {*} value - Value to validate
 * @param {Object} rule - Validation rule
 * @returns {Object} Validation result
 */
export const validateRule = (value, rule) => {
  const errors = [];

  // Required check
  if (rule.required && (!value || value === '')) {
    errors.push('Ce champ est requis');
    return { isValid: false, errors };
  }

  // Skip other checks if value is empty and not required
  if (!value || value === '') {
    return { isValid: true, errors: [] };
  }

  // Min length check
  if (rule.minLength && value.length < rule.minLength) {
    errors.push(`Minimum ${rule.minLength} caractères requis`);
  }

  // Max length check
  if (rule.maxLength && value.length > rule.maxLength) {
    errors.push(`Maximum ${rule.maxLength} caractères autorisés`);
  }

  // Pattern check
  if (rule.pattern && !rule.pattern.test(value)) {
    errors.push('Format invalide');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Get validation rule by name
 * @param {string} ruleName - Rule name
 * @returns {Object|null} Validation rule
 */
export const getValidationRule = (ruleName) => {
  return VALIDATION_RULES[ruleName] || null;
};