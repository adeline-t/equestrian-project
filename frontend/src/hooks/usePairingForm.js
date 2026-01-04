import { useState, useEffect } from 'react';
import { validatePairingForm } from '../lib/helpers/validators';

/**
 * Custom hook for managing pairing form data and operations
 * @param {Object} pairing - The pairing object for editing
 * @param {string|number} riderId - Pre-selected rider ID (optional)
 * @returns {Object} Form data, handlers, and state
 */
export function usePairingForm(pairing, riderId) {
  const [formData, setFormData] = useState({
    rider_id: '',
    horse_id: '',
    pairing_start_date: '',
    pairing_end_date: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (pairing) {
      setFormData({
        rider_id: pairing.rider_id?.toString() || '',
        horse_id: pairing.horse_id?.toString() || '',
        pairing_start_date: pairing.pairing_start_date || '',
        pairing_end_date: pairing.pairing_end_date || '',
      });
    } else {
      setFormData({
        rider_id: riderId?.toString() || '',
        horse_id: '',
        pairing_start_date: '',
        pairing_end_date: '',
      });
    }
  }, [pairing, riderId]);

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
    const validation = validatePairingForm(formData);
    if (!validation.isValid) {
      const firstError = Object.values(validation.errors)[0];
      setError(firstError);
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
      rider_id: riderId?.toString() || '',
      horse_id: '',
      pairing_start_date: '',
      pairing_end_date: '',
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