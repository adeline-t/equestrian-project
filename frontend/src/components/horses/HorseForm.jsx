import PropTypes from 'prop-types';
import { useHorseForm } from '../../hooks/index.js';
import { HORSE_TYPES, OWNER_TYPES } from '../../lib/domain/index.js';
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
          <Icons.Warning style={{ marginRight: '8px' }} />
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
          <label htmlFor="kind">
            Type <span className="required">*</span>
          </label>
          <select
            id="kind"
            value={formData.kind}
            onChange={(e) => handleChange('kind', e.target.value)}
            className="form-input"
            required
          >
            <option value={HORSE_TYPES.HORSE}>Cheval</option>
            <option value={HORSE_TYPES.PONY}>Poney</option>
          </select>
        </div>

        <div className="form-group mb-15">
          <label htmlFor="ownership_type">
            Propriétaire <span className="required">*</span>
          </label>
          <select
            id="ownership_type"
            value={formData.ownership_type}
            onChange={(e) => handleChange('ownership_type', e.target.value)}
            className="form-input"
            required
          >
            {ownershipOptions.map((type) => (
              <option key={type} value={type}>
                {type === OWNER_TYPES.LAURY && 'Laury'}
                {type === OWNER_TYPES.PRIVATE_OWNER && 'Propriétaire privé'}
                {type === OWNER_TYPES.CLUB && 'Club'}
                {type === OWNER_TYPES.OTHER && 'Autre'}
              </option>
            ))}
          </select>
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
          <Icons.Cancel style={{ marginRight: '8px' }} />
          Annuler
        </button>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? (
            <>
              <Icons.Loading className="spin" style={{ marginRight: '8px' }} />
              Enregistrement...
            </>
          ) : (
            <>
              <Icons.Save style={{ marginRight: '8px' }} />
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
