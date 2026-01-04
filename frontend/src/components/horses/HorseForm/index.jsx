import React, { useState } from 'react';
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
  } = useHorseForm(horse);
  const [localSubmitting, setLocalSubmitting] = useState(false);

  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form using the hook's validation
    if (!validateForm()) {
      return;
    }

    try {
      setLocalSubmitting(true);
      await onSubmit(formData);
    } catch (err) {
      setError(err.message || 'Une erreur est survenue');
      throw err;
    } finally {
      setLocalSubmitting(false);
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
      <BasicInfoFields formData={formData} onChange={handleChange} error={error} />

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
        submitting={localSubmitting}
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