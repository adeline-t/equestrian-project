import { useState, useEffect } from 'react';
import { validatePackageForm } from '../lib/helpers/validators';

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
    private_lesson_count: 0,
    joint_lesson_count: 0,
    activity_start_date: '',
    activity_end_date: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (packageData) {
      setFormData({
        rider_id: packageData.rider_id?.toString() || '',
        private_lesson_count: Number(packageData.private_lesson_count) || 0,
        joint_lesson_count: Number(packageData.joint_lesson_count) || 0,
        activity_start_date: packageData.activity_start_date || '',
        activity_end_date: packageData.activity_end_date || '',
      });
    } else if (riderId) {
      setFormData({
        rider_id: riderId?.toString() || '',
        private_lesson_count: 0,
        joint_lesson_count: 0,
        activity_start_date: '',
        activity_end_date: '',
      });
    } else {
      setFormData({
        rider_id: '',
        private_lesson_count: 0,
        joint_lesson_count: 0,
        activity_start_date: '',
        activity_end_date: '',
      });
    }
  }, [packageData, riderId]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    let processedValue = value;

    if (name === 'private_lesson_count' || name === 'joint_lesson_count') {
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
    const validation = validatePackageForm(formData);

    if (!validation.isValid) {
      const firstError = Object.values(validation.errors)[0];
      setError(firstError);
      return false;
    }

    setError('');
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
        private_lesson_count: Number(formData.private_lesson_count) || 0,
        joint_lesson_count: Number(formData.joint_lesson_count) || 0,
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
