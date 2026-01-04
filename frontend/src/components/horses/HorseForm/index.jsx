import React, { useState, useEffect } from 'react';
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
    handleSubmit,
    handleCancel,

    // State setters
    setError,
  } = useHorseForm(horse);

  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!formData.name.trim()) {
      setError('Le nom du cheval est requis');
      return;
    }

    if (!formData.activity_start_date) {
      setError("La date de début d'activité est requise");
      return;
    }

    if (formData.is_owned_by === 'Propriétaire' && !formData.owner_id) {
      setError('Veuillez sélectionner un propriétaire');
      return;
    }

    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err.message || 'Une erreur est survenue');
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
        onCancel={handleCancel}
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
