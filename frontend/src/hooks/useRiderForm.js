import { useState, useEffect } from 'react';

/**
 * Custom hook for managing rider form data and operations
 * @param {Object} rider - The rider object for editing
 * @returns {Object} Form data, handlers, and state
 */
export function useRiderForm(rider) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    activity_start_date: '',
    activity_end_date: '',
  });
  const [error, setError] = useState('');
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
      setFormData({
        name: '',
        phone: '',
        email: '',
        activity_start_date: '',
        activity_end_date: '',
      });
    }
  }, [rider]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Le nom du cavalier est requis');
      return false;
    }

    if (!formData.email.trim()) {
      setError('L\'email du cavalier est requis');
      return false;
    }

    if (!formData.activity_start_date) {
      setError('La date de début d\'activité est requise');
      return false;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Veuillez entrer une adresse email valide');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      await onSubmit(formData);
    } catch (err) {
      setError(err.message || 'Une erreur est survenue lors de la sauvegarde');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setError('');
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
    setError('');
  };

  return {
    // State
    formData,
    error,
    submitting,

    // Actions
    handleChange,
    handleSubmit,
    handleCancel,
    validateForm,
    resetForm,
    
    // State setters
    setError,
  };
}