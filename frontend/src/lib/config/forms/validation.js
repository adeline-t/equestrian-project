/**
 * Form Validation Messages and Rules
 */

// Form validation messages
export const VALIDATION_MESSAGES = {
  REQUIRED: 'Ce champ est requis',
  INVALID_EMAIL: 'Format d\'email invalide',
  INVALID_PHONE: 'Format de téléphone invalide',
  MIN_LENGTH: 'Ce champ doit contenir au moins {min} caractères',
  MAX_LENGTH: 'Ce champ ne peut pas dépasser {max} caractères',
  INVALID_DATE: 'Date invalide',
  INVALID_TIME: 'Heure invalide',
};

/**
 * Get validation message with parameters
 * @param {string} messageKey - Message key
 * @param {Object} params - Parameters to replace
 * @returns {string} Formatted message
 */
export const getValidationMessage = (messageKey, params = {}) => {
  let message = VALIDATION_MESSAGES[messageKey] || '';
  
  Object.keys(params).forEach((key) => {
    message = message.replace(`{${key}}`, params[key]);
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