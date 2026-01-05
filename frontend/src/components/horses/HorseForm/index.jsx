import React from 'react';
import PropTypes from 'prop-types';
import { useHorseForm } from '../../../hooks/useHorseForm';
import BasicInfoFields from './BasicInfoFields';
import OwnershipFields from './OwnershipFields';
import FormActions from './FormActions';
import { Icons } from '../../../lib/libraries/icons.jsx';

function HorseForm({ horse, onSubmit, onCancel }) {
  const {
    // State
    formData,
    error,
    submitting,
    riders,
    loadingRiders,
    ownershipOptions,

    // Actions
    handleChange,
    validateForm,
    resetForm,

    // State setters
    setError,
    setSubmitting,
  } = useHorseForm(horse);

  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Validate form using the hook's validation
    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      setError(''); // Clear any previous errors

      // Call the parent's onSubmit
      await onSubmit(formData);

      // Reset form on success
      resetForm();
    } catch (err) {
      // Use setError from the hook
      setError(err.message || 'Une erreur est survenue lors de la sauvegarde');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelClick = () => {
    resetForm();
    if (onCancel) {
      onCancel();
    }
  };

  const isEdit = !!horse;

  return (
    <form onSubmit={handleFormSubmit} className="horse-form">
      {/* Error Alert */}
      {error && (
        <div className="alert alert-error" style={{ marginBottom: '20px' }}>
          <Icons.Warning style={{ marginRight: '8px' }} />
          <strong>Erreur:</strong> {error}
        </div>
      )}

      <BasicInfoFields formData={formData} onChange={handleChange} />

      <OwnershipFields
        formData={formData}
        onChange={handleChange}
        riders={riders}
        loadingRiders={loadingRiders}
        ownershipOptions={ownershipOptions}
      />

      <FormActions
        onSubmit={handleFormSubmit}
        onCancel={handleCancelClick}
        submitting={submitting}
        isEdit={isEdit}
      />
    </form>
  );
}

HorseForm.propTypes = {
  horse: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default HorseForm;
