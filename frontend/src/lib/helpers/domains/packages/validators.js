/**
 * Package validation rules
 */

import { validatePackageForm } from './packageValidators';

// Re-export the existing validator for consistency
export { validatePackageForm };

/**
 * Validate package data
 * @param {Object} data - Package data to validate
 * @returns {Object} Validation result with isValid and errors
 */
export const validatePackageData = (data) => {
  const errors = {};
  
  // Validate required fields
  if (!data.rider_id) {
    errors.rider_id = 'Le cavalier est requis';
  }
  
  if (!data.activity_start_date) {
    errors.activity_start_date = 'La date de début est requise';
  }
  
  if (data.activity_end_date && data.activity_start_date) {
    const startDate = new Date(data.activity_start_date);
    const endDate = new Date(data.activity_end_date);
    if (endDate < startDate) {
      errors.activity_end_date = 'La date de fin doit être après la date de début';
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};