import PropTypes from 'prop-types';
import { Icons } from '../../../lib/icons';
import { usePairingForm } from '../../../hooks/usePairingForm';
import PairingSelectionFields from './PairingSelectionFields';
import PairingDateFields from './PairingDateFields';
import PairingFormActions from './PairingFormActions';

function PairingForm({ pairing, riders, horses, onSubmit, onCancel, riderId }) {
  const {
    // State
    formData,
    error,
    submitting,

    // Actions
    handleChange,
    validateForm,
    resetForm,

    // State setters
    setError,
    setSubmitting,
  } = usePairingForm(pairing, riderId);

  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      await onSubmit(formData);
    } catch (err) {
      console.error('Error submitting pairing form:', err);
      setError(err.message || 'Une erreur est survenue lors de la sauvegarde');
    } finally {
      setSubmitting(false);
    }
  };

  const isEdit = !!pairing;

  return (
    <form onSubmit={handleFormSubmit} className="pairing-form">
      {/* Error Alert */}
      {error && (
        <div className="alert alert-error" style={{ marginBottom: '20px' }}>
          <Icons.Warning style={{ marginRight: '8px' }} />
          <strong>Erreur:</strong> {error}
        </div>
      )}

      <PairingSelectionFields
        formData={formData}
        onChange={handleChange}
        riders={riders}
        horses={horses}
        riderId={riderId}
        isEdit={isEdit}
      />

      <PairingDateFields formData={formData} onChange={handleChange} />

      <PairingFormActions
        onSubmit={handleFormSubmit}
        onCancel={onCancel}
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
