/**
 * Package validation utilities
 */

/**
 * Validate package form data
 * @param {Object} formData - Package form data
 * @returns {Object} Validation result with isValid and errors object
 */
export const validatePackageForm = (formData) => {
  const errors = {};

  // Rider validation
  if (!formData.rider_id) {
    errors.rider_id = 'Le cavalier est requis';
  }

  // Lesson counts validation
  const privateCount = parseInt(formData.private_lesson_count) || 0;
  const jointCount = parseInt(formData.joint_lesson_count) || 0;

  if (privateCount < 0) {
    errors.private_lesson_count = 'Le nombre de cours particuliers ne peut pas être négatif';
  }

  if (jointCount < 0) {
    errors.joint_lesson_count = 'Le nombre de cours collectifs ne peut pas être négatif';
  }

  if (privateCount === 0 && jointCount === 0) {
    errors.lesson_count = 'Au moins un type de cours doit avoir une quantité supérieure à 0';
  }

  // Date validation
  if (formData.activity_start_date && formData.activity_end_date) {
    const startDate = new Date(formData.activity_start_date);
    const endDate = new Date(formData.activity_end_date);

    if (endDate < startDate) {
      errors.dates = 'La date de fin doit être après la date de début';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};