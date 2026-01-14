// lib/config/forms.js

/**
 * Field types for forms
 */
export const FIELD_TYPES = {
  TEXT: 'text',
  NUMBER: 'number',
  EMAIL: 'email',
  SELECT: 'select',
  DATE: 'date',
  TIME: 'time',
  CHECKBOX: 'checkbox',
  RADIO: 'radio',
  TEXTAREA: 'textarea',
};

/**
 * Checks if a field type is valid
 * @param {string} type
 * @returns {boolean}
 */
export const isValidFieldType = (type) => Object.values(FIELD_TYPES).includes(type);

/**
 * Returns human-readable label for a field type
 * @param {string} type
 * @returns {string}
 */
export const getFieldTypeLabel = (type) => {
  const labels = {
    text: 'Texte',
    number: 'Nombre',
    email: 'Email',
    select: 'Sélecteur',
    date: 'Date',
    time: 'Heure',
    checkbox: 'Case à cocher',
    radio: 'Bouton radio',
    textarea: 'Zone de texte',
  };
  return labels[type] || type;
};

/**
 * Form settings: default values for forms
 */
export const FORM_SETTINGS = {
  requiredFields: [],
  maxLength: 255,
};

/**
 * Retrieves a specific form setting
 * @param {string} key
 * @returns {*}
 */
export const getFormSetting = (key) => FORM_SETTINGS[key];
