/**
 * Horse Form Schema
 */

import { FIELD_TYPES } from '../fields.js';

export const HORSE_FORM_FIELDS = {
  name: {
    type: FIELD_TYPES.TEXT,
    label: 'Nom du cheval',
    required: true,
    maxLength: 100,
  },
  kind: {
    type: FIELD_TYPES.SELECT,
    label: 'Type de cheval',
    required: true,
    options: ['horse', 'pony'],
  },
  activity_start_date: {
    type: FIELD_TYPES.DATE,
    label: 'Date de début d\'activité',
    required: true,
  },
  activity_end_date: {
    type: FIELD_TYPES.DATE,
    label: 'Date de fin d\'activité',
    required: false,
  },
  is_owned_by: {
    type: FIELD_TYPES.SELECT,
    label: 'Propriétaire',
    required: true,
    options: ['Laury', 'Propriétaire', 'Club'],
  },
  owner_id: {
    type: FIELD_TYPES.SELECT,
    label: 'Cavalier propriétaire',
    required: false,
    dependsOn: 'is_owned_by',
    showWhen: 'Propriétaire',
  },
};

/**
 * Get horse form field configuration
 * @param {string} fieldName - Field name
 * @returns {Object|null} Field configuration
 */
export const getHorseFormField = (fieldName) => {
  return HORSE_FORM_FIELDS[fieldName] || null;
};

/**
 * Get all required horse form fields
 * @returns {Array} Array of required field names
 */
export const getHorseRequiredFields = () => {
  return Object.entries(HORSE_FORM_FIELDS)
    .filter(([_, config]) => config.required)
    .map(([name]) => name);
};