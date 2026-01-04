import React from 'react';
import PropTypes from 'prop-types';
import { usePairingForm } from '../../hooks/usePairingForm';
import PairingSelectionFields from './PairingForm/PairingSelectionFields';
import PairingDateFields from './PairingForm/PairingDateFields';
import PairingFormActions from './PairingForm/PairingFormActions';
import { Icons } from '../../lib/libraries/icons.jsx';

function PairingForm({ pairing, riders, horses, onSubmit, onCancel, riderId }) {
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
  } = usePairingForm(pairing, riderId);

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

  const isEdit = !!pairing;

  return (
    <form onSubmit={handleFormSubmit} className="pairing-form">
      <PairingSelectionFields
        formData={formData}
        onChange={handleChange}
        riders={riders}
        horses={horses}
        error={error}
        riderId={riderId}
      />

      <PairingDateFields formData={formData} onChange={handleChange} error={error} />

      <PairingFormActions
        onSubmit={handleFormSubmit}
        onCancel={handleCancel}
        submitting={submitting}
        isEdit={isEdit}
      />
    </form>
  );
}

PairingForm.propTypes = {
  pairing: PropTypes.object,
  riders: PropTypes.array.isRequired,
  horses: PropTypes.array.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  riderId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default PairingForm;
