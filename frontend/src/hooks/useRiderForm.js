import { useState, useEffect } from 'react';
import { validateRiderForm } from '../lib/helpers/domains/riders/validators';

/**
 * Custom hook for managing rider form data and operations
 */
export function useRiderForm(rider, onSubmit, onCancel) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    activity_start_date: '',
    activity_end_date: '',
    kind: 'boarder',
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
        kind: rider.kind || 'boarder',
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
      kind: 'boarder',
    });
    setErrors({});
  };

  return {
    formData,
    errors,
    submitting,
    handleChange,
    handleSubmit,
    handleCancel,
    validateForm,
    resetForm,
    setErrors,
    setFormData,
  };
}
