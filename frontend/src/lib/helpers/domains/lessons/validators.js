/**
 * Lesson validation utilities
 */

/**
 * Validate lesson time range
 * @param {string} startTime - Start time in HH:MM format
 * @param {string} endTime - End time in HH:MM format
 * @returns {Object} Validation result with isValid and error message
 */
export const validateLessonTime = (startTime, endTime) => {
  if (!startTime || !endTime) {
    return {
      isValid: false,
      error: 'Les heures de début et de fin sont requises',
    };
  }

  if (startTime >= endTime) {
    return {
      isValid: false,
      error: "L'heure de fin doit être après l'heure de début",
    };
  }

  return { isValid: true, error: null };
};

/**
 * Validate lesson participants
 * @param {number} currentCount - Current participant count
 * @param {number} maxParticipants - Maximum allowed participants
 * @returns {Object} Validation result
 */
export const validateParticipantCount = (currentCount, maxParticipants) => {
  if (maxParticipants && currentCount >= maxParticipants) {
    return {
      isValid: false,
      error: 'Le nombre maximum de participants est atteint',
    };
  }

  return { isValid: true, error: null };
};

/**
 * Validate lesson form data
 * @param {Object} formData - Lesson form data
 * @returns {Object} Validation result with isValid and errors object
 */
export const validateLessonForm = (formData) => {
  const errors = {};

  // Name validation - now optional, will be auto-generated if empty
  // if (!formData.name || formData.name.trim() === '') {
  //   errors.name = 'Le nom du cours est requis';
  // }

  // Date validation
  if (!formData.lesson_date) {
    errors.lesson_date = 'La date du cours est requise';
  }

  // Time validation
  const timeValidation = validateLessonTime(formData.start_time, formData.end_time);
  if (!timeValidation.isValid) {
    errors.time = timeValidation.error;
  }

  // Type validation
  if (!formData.lesson_type) {
    errors.lesson_type = 'Le type de cours est requis';
  }

  // Participants validation
  if (formData.lesson_type !== 'blocked') {
    if (formData.min_participants && formData.max_participants) {
      if (parseInt(formData.min_participants) > parseInt(formData.max_participants)) {
        errors.participants = 'Le minimum ne peut pas être supérieur au maximum';
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};