import { useState, useEffect } from 'react';
import { validateRiderForm } from '../lib/helpers/domains/riders/validators';

/**
 * Custom hook for managing rider form data and operations
 * @param {Object} rider - The rider object for editing
 * @param {Function} onSubmit - Callback function when form is submitted
 * @param {Function} onCancel - Callback function when form is cancelled
 * @returns {Object} Form data, handlers, and state
 */
export function useRiderForm(rider, onSubmit, onCancel) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    activity_start_date: '',
    activity_end_date: '',
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
      });
    } else {
      resetForm();
    }
  }, [rider]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
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

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      if (onSubmit) {
        await onSubmit(formData);
      }
    } catch (err) {
      setErrors({
        submit: err.message || 'Une erreur est survenue lors de la sauvegarde',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setErrors({});
    if (onCancel) {
      onCancel();
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      activity_start_date: '',
      activity_end_date: '',
    });
    setErrors({});
  };

  return {
    // State
    formData,
    errors,
    submitting,

    // Actions
    handleChange,
    handleSubmit,
    handleCancel,
    validateForm,
    resetForm,

    // State setters
    setErrors,
    setFormData,
  };
}
