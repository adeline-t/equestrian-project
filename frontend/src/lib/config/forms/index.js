/**
 * Forms Configuration - Main Export
 */

export * from './fields';
export * from './validation';
export * from './settings';
export * from './schemas';

// Re-export for backward compatibility
export { FIELD_TYPES, isValidFieldType, getFieldTypeLabel } from './fields';
export { 
  VALIDATION_MESSAGES, 
  getValidationMessage, 
  formatLengthMessage 
} from './validation';
export { FORM_SETTINGS, getFormSetting } from './settings';
export { 
  HORSE_FORM_FIELDS, 
  getHorseFormField, 
  getHorseRequiredFields,
  RIDER_FORM_FIELDS,
  getRiderFormField,
  getRiderRequiredFields,
} from './schemas';