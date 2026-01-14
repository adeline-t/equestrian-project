import { useState, useEffect } from 'react';

/**
 * Custom hook for managing package form state and validation
 * @param {Object} packageData - Existing package to edit (null for new package)
 * @param {string|number} riderId - Pre-selected rider ID
 * @param {Function} onSubmit - Submit callback
 * @returns {Object} Form state and handlers
 */
export function usePackageForm(packageData, riderId, onSubmit) {
  const [formData, setFormData] = useState({
    rider_id: '',
    services_per_week: 0,
    group_lessons_per_week: 0,
    is_active: true, // ✅ Ajouté
    activity_start_date: '', // ✅ Ajouté
    activity_end_date: '', // ✅ Ajouté
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (packageData) {
      setFormData({
        rider_id: packageData.rider_id?.toString() || '',
        services_per_week: Number(packageData.services_per_week) || 0,
        group_lessons_per_week: Number(packageData.group_lessons_per_week) || 0,
        is_active: packageData.is_active !== undefined ? Boolean(packageData.is_active) : true,
        activity_start_date: packageData.activity_start_date || '',
        activity_end_date: packageData.activity_end_date || '',
      });
    } else if (riderId) {
      setFormData({
        rider_id: riderId?.toString() || '',
        services_per_week: 0,
        group_lessons_per_week: 0,
        is_active: true,
        activity_start_date: '',
        activity_end_date: '',
      });
    } else {
      setFormData({
        rider_id: '',
        services_per_week: 0,
        group_lessons_per_week: 0,
        is_active: true,
        activity_start_date: '',
        activity_end_date: '',
      });
    }
  }, [packageData, riderId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    let processedValue = value;

    // Handle checkbox
    if (type === 'checkbox') {
      processedValue = checked;
    }
    // Handle numbers
    else if (name === 'services_per_week' || name === 'group_lessons_per_week') {
      const numValue = Number(value);
      processedValue = isNaN(numValue) || value === '' ? 0 : Math.max(0, numValue);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: processedValue,
    }));

    if (error) {
      setError('');
    }
  };

  const validateForm = () => {
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

      const submitData = {
        rider_id: Number(formData.rider_id),
        services_per_week: Number(formData.services_per_week) || 0,
        group_lessons_per_week: Number(formData.group_lessons_per_week) || 0,
        is_active: Boolean(formData.is_active),
        activity_start_date: formData.activity_start_date || null,
        activity_end_date: formData.activity_end_date || null,
      };

      console.log('📤 Submitting package data:', submitData);
      await onSubmit(submitData);
      console.log('✅ Package submitted successfully');
    } catch (err) {
      console.error('❌ Submit error:', err);
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setSubmitting(false);
    }
  };

  return {
    formData,
    error,
    submitting,
    handleChange,
    handleSubmit,
  };
}
