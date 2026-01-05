import PropTypes from 'prop-types';
import { useRiderForm } from '../../../../hooks/useRiderForm';
import BasicInfoFields from './BasicInfoFields';
import ActivityFields from './ActivityFields';
import FormActions from './FormActions';

function RiderForm({ rider, onSubmit, onCancel }) {
  const {
    // State
    formData,
    errors,
    submitting,

    // Actions
    handleChange,
    handleSubmit,
    handleCancel,
    validateForm,

    // State setters
    setErrors,
  } = useRiderForm(rider, onSubmit, onCancel);

  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) {
      return;
    }

    try {
      await handleSubmit(e);
    } catch (err) {
      setErrors({
        submit: err.message || 'Une erreur est survenue lors de la sauvegarde',
      });
    }
  };

  const isEdit = !!rider;

  return (
    <form onSubmit={handleFormSubmit} className="rider-form">
      <BasicInfoFields formData={formData} onChange={handleChange} errors={errors} />

      <ActivityFields formData={formData} onChange={handleChange} errors={errors} />

      <FormActions
        onSubmit={handleFormSubmit}
        onCancel={handleCancel}
        submitting={submitting}
        isEdit={isEdit}
        submitError={errors.submit}
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
