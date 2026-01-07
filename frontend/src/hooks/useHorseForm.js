import { useState, useEffect } from 'react';
import { riderService } from '../services';
import { validateHorseForm } from '../lib/helpers/domains/horses/validators';
import { OWNER_TYPES } from '../lib/domains/horses/owners';
import { HORSE_KIND_LABELS } from '../lib/domains/horses/kinds';

/**
 * Custom hook for managing horse form data and operations
 * @param {Object} horse - The horse object for editing
 * @returns {Object} Form data, handlers, and state
 */
export function useHorseForm(horse) {
  const [formData, setFormData] = useState({
    name: '',
    kind: HORSE_KIND_LABELS.HORSE.value,
    activity_start_date: '',
    activity_end_date: '',
    is_owned_by: OWNER_TYPES.OWNER.value,
    owner_id: null,
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
        kind: horse.kind || HORSE_KIND_LABELS.HORSE.value,
        activity_start_date: horse.activity_start_date || '',
        activity_end_date: horse.activity_end_date || '',
        is_owned_by: horse.is_owned_by || OWNER_TYPES.OWNER.value,
        owner_id: horse.owner_id || null,
      });
    } else {
      setFormData({
        name: '',
        kind: HORSE_KIND_LABELS.HORSE.value,
        activity_start_date: '',
        activity_end_date: '',
        is_owned_by: OWNER_TYPES.OWNER.value,
        owner_id: null,
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
    // Use centralized validation
    const validation = validateHorseForm(formData);
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
      name: '',
      kind: HORSE_KIND_LABELS.HORSE.value,
      activity_start_date: '',
      activity_end_date: '',
      is_owned_by: OWNER_TYPES.OWNER.value,
      owner_id: null,
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
    kindOptions: Object.values(HORSE_KIND_LABELS),
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
