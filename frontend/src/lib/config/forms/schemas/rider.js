/**
 * Rider Form Schema
 */

import { FIELD_TYPES } from '../fields.js';

export const RIDER_FORM_FIELDS = {
  name: {
    type: FIELD_TYPES.TEXT,
    label: 'Nom du cavalier',
    required: true,
    maxLength: 100,
  },
  email: {
    type: FIELD_TYPES.EMAIL,
    label: 'Email',
    required: false,
  },
  phone: {
    type: FIELD_TYPES.PHONE,
    label: 'Téléphone',
    required: false,
  },
  address: {
    type: FIELD_TYPES.TEXTAREA,
    label: 'Adresse',
    required: false,
    maxLength: 500,
  },
};

/**
 * Get rider form field configuration
 * @param {string} fieldName - Field name
 * @returns {Object|null} Field configuration
 */
export const getRiderFormField = (fieldName) => {
  return RIDER_FORM_FIELDS[fieldName] || null;
};

/**
 * Get all required rider form fields
 * @returns {Array} Array of required field names
 */
export const getRiderRequiredFields = () => {
  return Object.entries(RIDER_FORM_FIELDS)
    .filter(([_, config]) => config.required)
    .map(([name]) => name);
};