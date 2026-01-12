/**
 * Rider validation utilities
 */
import { RIDER_KIND_LABELS } from '../../../domains/riders/kinds';

/**
 * Validate email format
 * @param {string} email - Email address
 * @returns {boolean} True if valid email format
 */
export const isValidEmail = (email) => {
  if (!email) return true; // Email is optional
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone format
 * @param {string} phone - Phone number
 * @returns {boolean} True if valid phone format
 */
export const isValidPhone = (phone) => {
  if (!phone) return true; // Phone is optional
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
};

// Extract allowed values
const ALLOWED_KINDS = Object.values(RIDER_KIND_LABELS).map((k) => k.value);

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

  // Kind validation
  if (!formData.kind) {
    errors.kind = 'Le type de cavalier est requis';
  } else if (!ALLOWED_KINDS.includes(formData.kind)) {
    errors.kind = 'Le type doit être "owner", "club" ou "boarder"';
  }

  // Email validation
  if (formData.email && !isValidEmail(formData.email)) {
    errors.email = "Format d'email invalide";
  }

  // Phone validation
  if (formData.phone && !isValidPhone(formData.phone)) {
    errors.phone = 'Format de téléphone invalide (minimum 10 chiffres)';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
