/**
 * Form Field Types and Configuration
 */

// Form field types
export const FIELD_TYPES = {
  TEXT: 'text',
  EMAIL: 'email',
  PHONE: 'phone',
  NUMBER: 'number',
  DATE: 'date',
  TIME: 'time',
  SELECT: 'select',
  TEXTAREA: 'textarea',
  CHECKBOX: 'checkbox',
  RADIO: 'radio',
};

/**
 * Check if field type is valid
 * @param {string} type - Field type
 * @returns {boolean} True if valid
 */
export const isValidFieldType = (type) => {
  return Object.values(FIELD_TYPES).includes(type);
};

/**
 * Get field type display label
 * @param {string} type - Field type
 * @returns {string} Display label
 */
export const getFieldTypeLabel = (type) => {
  const labels = {
    [FIELD_TYPES.TEXT]: 'Texte',
    [FIELD_TYPES.EMAIL]: 'Email',
    [FIELD_TYPES.PHONE]: 'Téléphone',
    [FIELD_TYPES.NUMBER]: 'Nombre',
    [FIELD_TYPES.DATE]: 'Date',
    [FIELD_TYPES.TIME]: 'Heure',
    [FIELD_TYPES.SELECT]: 'Liste déroulante',
    [FIELD_TYPES.TEXTAREA]: 'Zone de texte',
    [FIELD_TYPES.CHECKBOX]: 'Case à cocher',
    [FIELD_TYPES.RADIO]: 'Bouton radio',
  };
  return labels[type] || type;
};