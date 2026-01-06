import { useState, useEffect } from 'react';
import { validatePairingForm } from '../lib/helpers/domains/pairings/validators';

/**
 * Custom hook for managing pairing form data and operations
 * @param {Object} pairing - The pairing object for editing
 * @param {string|number} riderId - Pre-selected rider ID (optional)
 * @returns {Object} Form data, handlers, and state
 */
export function usePairingForm(pairing, riderId) {
  const [formData, setFormData] = useState({
    rider_id: null,
    horse_id: null,
    pairing_start_date: '',
    pairing_end_date: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (pairing) {
      // Editing mode
      setFormData({
        rider_id: pairing.rider_id ? parseInt(pairing.rider_id) : null,
        horse_id: pairing.horse_id ? parseInt(pairing.horse_id) : null,
        pairing_start_date: pairing.pairing_start_date || '',
        pairing_end_date: pairing.pairing_end_date || '',
      });
    } else if (riderId) {
      // Creating mode with pre-filled riderId
      setFormData({
        rider_id: parseInt(riderId),
        horse_id: null,
        pairing_start_date: '',
        pairing_end_date: '',
      });
    } else {
      // Creating mode without pre-filled data
      setFormData({
        rider_id: null,
        horse_id: null,
        pairing_start_date: '',
        pairing_end_date: '',
      });
    }
  }, [pairing, riderId]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Convert to number for rider_id and horse_id
    const finalValue =
      name === 'rider_id' || name === 'horse_id' ? (value ? parseInt(value) : null) : value;

    setFormData((prev) => ({
      ...prev,
      [name]: finalValue,
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
    setError(''); // Clear error if validation passes
    return true;
  };

  const resetForm = () => {
    setFormData({
      rider_id: riderId ? parseInt(riderId) : null,
      horse_id: null,
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
    validateForm,
    resetForm,

    // State setters
    setError,
    setSubmitting,
  };
}
