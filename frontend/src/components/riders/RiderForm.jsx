import React from 'react';
import PropTypes from 'prop-types';
import { useRiderForm } from '../../hooks/useRiderForm';
import BasicInfoFields from './RiderForm/BasicInfoFields';
import ActivityFields from './RiderForm/ActivityFields';
import FormActions from './RiderForm/FormActions';
import { Icons } from '../../lib/libraries/icons.jsx';

function RiderForm({ rider, onSubmit, onCancel }) {
  const {
    // State
    formData,
    error,
    submitting,

    // Actions
    handleChange,
    handleSubmit,
    handleCancel,
    validateForm,

    // State setters
    setError,
  } = useRiderForm(rider);

  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err.message || 'Une erreur est survenue lors de la sauvegarde');
    }
  };

  const isEdit = !!rider;

  return (
    <form onSubmit={handleFormSubmit} className="rider-form">
      <BasicInfoFields formData={formData} onChange={handleChange} error={error} />

      <ActivityFields formData={formData} onChange={handleChange} />

      <FormActions
        onSubmit={handleFormSubmit}
        onCancel={handleCancel}
        submitting={submitting}
        isEdit={isEdit}
      />
    </form>
  );
}

RiderForm.propTypes = {
  rider: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default RiderForm;
