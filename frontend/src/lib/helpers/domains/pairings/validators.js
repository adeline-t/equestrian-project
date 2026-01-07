/**
 * Pairing validation utilities
 */

/**
 * Validate pairing form data
 * @param {Object} formData - Pairing form data
 * @returns {Object} Validation result with isValid and errors object
 */
export const validatePairingForm = (formData) => {
  const errors = {};

  // Rider validation
  if (!formData.rider_id || isNaN(parseInt(formData.rider_id))) {
    errors.rider_id = 'Le cavalier est requis et doit être valide';
  }

  // Horse validation
  if (!formData.horse_id || isNaN(parseInt(formData.horse_id))) {
    errors.horse_id = 'Le cheval est requis et doit être valide';
  }

  // Start date validation - now optional
  // if (!formData.pairing_start_date) {
  //   errors.pairing_start_date = 'La date de début du pairing est requise';
  // }

  // Optional end date validation
  if (formData.pairing_end_date && formData.pairing_start_date) {
    const startDate = new Date(formData.pairing_start_date);
    const endDate = new Date(formData.pairing_end_date);
    
    if (endDate <= startDate) {
      errors.pairing_end_date = 'La date de fin doit être postérieure à la date de début';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};