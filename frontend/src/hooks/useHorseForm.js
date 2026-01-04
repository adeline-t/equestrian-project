import { useState, useEffect } from 'react';
import { riderService, horseService } from '../services';
import { validateHorseForm } from '../lib/helpers/validators';

/**
 * Custom hook for managing horse form data and operations
 * @param {Object} horse - The horse object for editing
 * @returns {Object} Form data, handlers, and state
 */
export function useHorseForm(horse) {
  const [formData, setFormData] = useState({
    name: '',
    kind: 'horse',
    activity_start_date: '',
    activity_end_date: '',
    is_owned_by: 'Propriétaire',
    owner_id: null,
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [riders, setRiders] = useState([]);
  const [loadingRiders, setLoadingRiders] = useState(false);

  const ownershipOptions = [
    { value: 'Laury', label: 'Laury' },
    { value: 'Propriétaire', label: 'Propriétaire' },
    { value: 'Club', label: 'Club' },
  ];

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
        kind: horse.kind || 'horse',
        activity_start_date: horse.activity_start_date || '',
        activity_end_date: horse.activity_end_date || '',
        is_owned_by: horse.is_owned_by || 'Propriétaire',
        owner_id: horse.owner_id || null,
      });
    } else {
      setFormData({
        name: '',
        kind: 'horse',
        activity_start_date: '',
        activity_end_date: '',
        is_owned_by: 'Propriétaire',
        owner_id: null,
      });
    }
  }, [horse]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setError(''); // Clear error on any change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Use centralized validation
    const validation = validateHorseForm(formData);
    if (!validation.isValid) {
      const firstError = Object.values(validation.errors)[0];
      setError(firstError);
      return;
    }

    try {
      setSubmitting(true);
      await onSubmit(formData);
    } catch (err) {
      setError(err.message || 'Une erreur est survenue');
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
      kind: 'horse',
      activity_start_date: '',
      activity_end_date: '',
      is_owned_by: 'Propriétaire',
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
    ownershipOptions,

    // Actions
    handleChange,
    handleSubmit,
    handleCancel,
    resetForm,
    
    // State setters
    setError,
  };
}