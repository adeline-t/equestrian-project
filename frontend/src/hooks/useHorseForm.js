import { useState, useEffect } from 'react';
import { HORSE_TYPES, OWNER_TYPES } from '../lib/domain/index.js';
import { validateHorseForm, getTodayISO } from '../lib/helpers/index.js';
import riderService from '../services/riderService.js';

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
      const data = await riderService.getAll();
      setRiders(data || []);
    } catch (err) {
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
    }
  }, [horse]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const validateForm = () => {
    const validation = validateHorseForm(formData);
    if (!validation.isValid) {
      setError(Object.values(validation.errors)[0]);
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
    formData,
    error,
    submitting,
    riders,
    loadingRiders,
    kindOptions: Object.values(HORSE_TYPES),
    ownershipOptions: Object.values(OWNER_TYPES),

    handleChange,
    validateForm,
    resetForm,

    setError,
    setSubmitting,
    setFormData,
  };
}
