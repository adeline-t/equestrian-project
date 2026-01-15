import { useEffect, useState } from 'react';
import { RIDER_TYPES } from '../lib/domain/index.js';
import { validateRiderForm } from '../lib/helpers/index.js';

/**
 * Custom hook for managing rider form data and operations
 * @param {Object} rider - The rider object for editing
 * @param {Function} onSubmit - Submit handler
 * @param {Function} onCancel - Cancel handler
 * @returns {Object} Form data, handlers, and state
 */
export function useRiderForm(rider, onSubmit, onCancel) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    activity_start_date: '',
    activity_end_date: '',
    rider_type: RIDER_TYPES.BOARDER,
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (rider) {
      setFormData({
        name: rider.name || '',
        phone: rider.phone || '',
        email: rider.email || '',
        activity_start_date: rider.activity_start_date || '',
        activity_end_date: rider.activity_end_date || '',
        rider_type: rider.rider_type || RIDER_TYPES.BOARDER, // ✅ Renommé
      });
    } else {
      resetForm();
    }
  }, [rider]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const validation = validateRiderForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return false;
    }
    setErrors({});
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    if (!validateForm()) return;

    try {
      setSubmitting(true);
      if (onSubmit) await onSubmit(formData);
    } catch (err) {
      setErrors({ submit: err.message || 'Une erreur est survenue lors de la sauvegarde' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setErrors({});
    if (onCancel) onCancel();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      activity_start_date: '',
      activity_end_date: '',
      rider_type: RIDER_TYPES.BOARDER,
    });
    setErrors({});
  };

  return {
    formData,
    errors,
    submitting,
    riderTypeOptions: Object.values(RIDER_TYPES), // ✅ Ajouté
    handleChange,
    handleSubmit,
    handleCancel,
    validateForm,
    resetForm,
    setErrors,
    setFormData,
  };
}
