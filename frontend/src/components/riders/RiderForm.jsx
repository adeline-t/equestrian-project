import PropTypes from 'prop-types';
import { useRiderForm } from '../../hooks';
import { RIDER_TYPES } from '../../lib/domain/riders.js';
import { Icons } from '../../lib/icons.jsx';

/**
 * RiderForm - Form for creating/editing riders
 */
function RiderForm({ rider, onSubmit, onCancel }) {
  const {
    formData,
    errors,
    submitting,
    riderTypeOptions,
    handleChange,
    handleSubmit,
    handleCancel,
  } = useRiderForm(rider, onSubmit, onCancel);

  return (
    <form onSubmit={handleSubmit} className="rider-form">
      {/* Error Alert */}
      {errors.submit && (
        <div className="alert alert-error mb-20">
          <Icons.Warning style={{ marginRight: '8px' }} />
          <strong>Erreur:</strong> {errors.submit}
        </div>
      )}

      {/* Basic Information */}
      <div className="form-section mb-20">
        <h3 className="mb-15">Informations générales</h3>

        <div className="form-group mb-15">
          <label htmlFor="name">
            Nom complet <span className="required">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`form-input ${errors.name ? 'error' : ''}`}
            placeholder="Entrez le nom complet"
            required
          />
          {errors.name && (
            <span className="error-message">
              <Icons.Warning style={{ marginRight: '4px' }} />
              {errors.name}
            </span>
          )}
        </div>

        <div className="form-group mb-15">
          <label htmlFor="rider_type">
            Type de cavalier <span className="required">*</span>
          </label>
          <select
            id="rider_type"
            name="rider_type"
            value={formData.rider_type}
            onChange={handleChange}
            className={`form-input ${errors.rider_type ? 'error' : ''}`}
            required
          >
            {riderTypeOptions.map((type) => (
              <option key={type} value={type}>
                {type === RIDER_TYPES.OWNER && 'Propriétaire'}
                {type === RIDER_TYPES.CLUB && 'Club'}
                {type === RIDER_TYPES.BOARDER && 'Pensionnaire'}
              </option>
            ))}
          </select>
          {errors.rider_type && (
            <span className="error-message">
              <Icons.Warning style={{ marginRight: '4px' }} />
              {errors.rider_type}
            </span>
          )}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`form-input ${errors.email ? 'error' : ''}`}
              placeholder="cavalier@exemple.com"
            />
            {errors.email && (
              <span className="error-message">
                <Icons.Warning style={{ marginRight: '4px' }} />
                {errors.email}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="phone">Téléphone</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`form-input ${errors.phone ? 'error' : ''}`}
              placeholder="06 12 34 56 78"
            />
            {errors.phone && (
              <span className="error-message">
                <Icons.Warning style={{ marginRight: '4px' }} />
                {errors.phone}
              </span>
            )}
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
              name="activity_start_date"
              value={formData.activity_start_date}
              onChange={handleChange}
              className={`form-input ${errors.activity_start_date ? 'error' : ''}`}
            />
            {errors.activity_start_date && (
              <span className="error-message">
                <Icons.Warning style={{ marginRight: '4px' }} />
                {errors.activity_start_date}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="activity_end_date">Date de fin</label>
            <input
              type="date"
              id="activity_end_date"
              name="activity_end_date"
              value={formData.activity_end_date}
              onChange={handleChange}
              className={`form-input ${errors.activity_end_date ? 'error' : ''}`}
            />
            <small className="form-help">Laissez vide si toujours actif</small>
            {errors.activity_end_date && (
              <span className="error-message">
                <Icons.Warning style={{ marginRight: '4px' }} />
                {errors.activity_end_date}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="modal-footer">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleCancel}
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
              {rider ? 'Mettre à jour' : 'Créer'}
            </>
          )}
        </button>
      </div>
    </form>
  );
}

RiderForm.propTypes = {
  rider: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default RiderForm;
