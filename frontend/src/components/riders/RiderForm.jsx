import PropTypes from 'prop-types';
import { useRiderForm } from '../../hooks';
import { getRiderTypeLabel } from '../../lib/domain/domain-constants.js';
import { Icons } from '../../lib/icons.jsx';

/**
 * RiderForm - Formulaire pour créer ou éditer un cavalier
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
    <form onSubmit={handleSubmit} className="entity-form">
      {/* Erreur générale */}
      {errors.submit && (
        <div className="alert alert-error">
          <Icons.Warning />
          <strong>Erreur :</strong> {errors.submit}
        </div>
      )}

      {/* Informations générales */}
      <div className="form-section">
        <h3>Informations générales</h3>

        {/* Nom */}
        <div className="form-group">
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
              <Icons.Warning /> {errors.name}
            </span>
          )}
        </div>

        {/* Type de cavalier */}
        <div className="form-group">
          <label>
            Type de cavalier <span className="required">*</span>
          </label>
          <div className="segmented-control">
            {riderTypeOptions.map((type) => {
              const isActiveBtn = formData.rider_type === type;
              return (
                <button
                  key={type}
                  type="button"
                  className={`segment-btn ${isActiveBtn ? 'active' : ''}`}
                  onClick={() => handleChange({ target: { name: 'rider_type', value: type } })}
                >
                  {getRiderTypeLabel(type)}
                </button>
              );
            })}
          </div>
          {errors.rider_type && (
            <span className="error-message">
              <Icons.Warning /> {errors.rider_type}
            </span>
          )}
        </div>

        {/* Email et téléphone */}
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
                <Icons.Warning /> {errors.email}
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
                <Icons.Warning /> {errors.phone}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Période d'activité */}
      <div className="form-section">
        <h3>Période d'activité</h3>
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
                <Icons.Warning /> {errors.activity_start_date}
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
                <Icons.Warning /> {errors.activity_end_date}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="modal-footer">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleCancel}
          disabled={submitting}
        >
          <Icons.Cancel /> Annuler
        </button>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? (
            <>
              <Icons.Loading className="spin" /> Enregistrement...
            </>
          ) : (
            <>
              <Icons.Save /> {rider ? 'Mettre à jour' : 'Créer'}
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
