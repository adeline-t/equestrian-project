import PropTypes from 'prop-types';
import { useHorseForm } from '../../hooks/index.js';
import {
  HORSE_TYPES,
  OWNER_TYPES,
  getHorseTypeLabel,
  getOwnerTypeLabel,
} from '../../lib/domain/domain-constants.js';
import { Icons } from '../../lib/icons.jsx';

/**
 * HorseForm - Form for creating/editing horses
 * Uses ownership_type (not is_owned_by)
 */
function HorseForm({ horse, onSubmit, onCancel }) {
  const {
    formData,
    error,
    submitting,
    riders,
    loadingRiders,
    kindOptions,
    ownershipOptions,
    handleChange,
    validateForm,
    resetForm,
    setError,
    setSubmitting,
  } = useHorseForm(horse);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      await onSubmit(formData);
      resetForm();
    } catch (err) {
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

  return (
    <form onSubmit={handleFormSubmit} className="horse-form">
      {/* Error Alert */}
      {error && (
        <div className="alert alert-error mb-20">
          <Icons.Warning />
          <strong>Erreur:</strong> {error}
        </div>
      )}

      {/* Basic Information */}
      <div className="form-section mb-20">
        <h3 className="mb-15">Informations générales</h3>

        <div className="form-group mb-15">
          <label htmlFor="name">
            Nom du cheval <span className="required">*</span>
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className={`form-input ${error && !formData.name ? 'error' : ''}`}
            placeholder="Entrez le nom du cheval"
            required
          />
        </div>

        <div className="form-group mb-15">
          <label>
            Type <span className="required">*</span>
          </label>

          <div className="segmented-control">
            {kindOptions.map((type) => {
              const label = type === HORSE_TYPES.HORSE ? 'Cheval' : 'Poney';

              const isActive = formData.kind === type;

              return (
                <button
                  key={type}
                  type="button"
                  className={`segment-btn ${isActive ? 'active' : ''}`}
                  onClick={() => handleChange('kind', type)}
                >
                  {getHorseTypeLabel(type)}
                </button>
              );
            })}
          </div>
        </div>

        <div className="form-group mb-15">
          <label>
            Propriétaire <span className="required">*</span>
          </label>

          <div className="segmented-control">
            {ownershipOptions.map((type) => {
              const isActive = formData.ownership_type === type;

              return (
                <button
                  key={type}
                  type="button"
                  className={`segment-btn ${isActive ? 'active' : ''}`}
                  onClick={() => handleChange('ownership_type', type)}
                >
                  {getOwnerTypeLabel(type)}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Activity Period */}
      <div className="form-section mb-20">
        <h3 className="mb-15">Période d'activité</h3>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="activity_start_date">Date de début</label>
            <input
              type="date"
              id="activity_start_date"
              value={formData.activity_start_date}
              onChange={(e) => handleChange('activity_start_date', e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="activity_end_date">Date de fin</label>
            <input
              type="date"
              id="activity_end_date"
              value={formData.activity_end_date}
              onChange={(e) => handleChange('activity_end_date', e.target.value)}
              className="form-input"
            />
            <small className="form-help">Laissez vide si toujours actif</small>
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="modal-footer">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleCancelClick}
          disabled={submitting}
        >
          <Icons.Cancel />
          Annuler
        </button>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? (
            <>
              <Icons.Loading className="spin" />
              Enregistrement...
            </>
          ) : (
            <>
              <Icons.Save />
              {horse ? 'Mettre à jour' : 'Créer'}
            </>
          )}
        </button>
      </div>
    </form>
  );
}

HorseForm.propTypes = {
  horse: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default HorseForm;
