import { useEffect, useState } from 'react';
import { HORSE_TYPES, OWNER_TYPES } from '../lib/domain/index.js';
import { validateHorseForm, getTodayISO } from '../lib/helpers/index.js';
import { riderService } from '../services';

/**
 * Custom hook for managing horse form data and operations
 * @param {Object} horse - The horse object for editing
 * @returns {Object} Form data, handlers, and state
 */
export function useHorseForm(horse) {
  const [formData, setFormData] = useState({
    name: '',
    kind: HORSE_TYPES.HORSE,
    activity_start_date: getTodayISO(),
    activity_end_date: '',
    ownership_type: OWNER_TYPES.PRIVATE_OWNER,
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [riders, setRiders] = useState([]);
  const [loadingRiders, setLoadingRiders] = useState(false);

  const loadRiders = async () => {
    try {
      setLoadingRiders(true);
      const ridersData = await riderService.getAll();
      setRiders(ridersData || []);
    } catch (err) {
      console.error('Error loading riders:', err);
      setError('Erreur lors du chargement des cavaliers');
    } finally {
      setLoadingRiders(false);
    }
  };

  useEffect(() => {
    loadRiders();
  }, []);

  useEffect(() => {
    if (horse) {
      setFormData({
        name: horse.name || '',
        kind: horse.kind || HORSE_TYPES.HORSE,
        activity_start_date: horse.activity_start_date || getTodayISO(),
        activity_end_date: horse.activity_end_date || '',
        ownership_type: horse.ownership_type || OWNER_TYPES.PRIVATE_OWNER,
      });
    } else {
      setFormData({
        name: '',
        kind: HORSE_TYPES.HORSE,
        activity_start_date: getTodayISO(),
        activity_end_date: '',
        ownership_type: OWNER_TYPES.PRIVATE_OWNER,
      });
    }
  }, [horse]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };

  const validateForm = () => {
    const validation = validateHorseForm(formData);
    if (!validation.isValid) {
      const firstError = Object.values(validation.errors)[0];
      setError(firstError);
      return false;
    }
    setError('');
    return true;
  };

  const resetForm = () => {
    setFormData({
      name: '',
      kind: HORSE_TYPES.HORSE,
      activity_start_date: getTodayISO(),
      activity_end_date: '',
      ownership_type: OWNER_TYPES.PRIVATE_OWNER,
    });
    setError('');
  };

  return {
    // State
    formData,
    error,
    submitting,
    riders,
    loadingRiders,
    kindOptions: Object.values(HORSE_TYPES),
    ownershipOptions: Object.values(OWNER_TYPES),

    // Actions
    handleChange,
    validateForm,
    resetForm,

    // State setters
    setError,
    setSubmitting,
    setFormData,
  };
}
