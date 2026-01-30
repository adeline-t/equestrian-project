import PropTypes from 'prop-types';
import { Icons } from '../../lib/icons';
import { usePackageForm } from '../../hooks/usePackageForm.js';

/**
 * PackageForm - Formulaire de forfait
 * Props:
 *  - initialPackage : objet du forfait à éditer (ou null pour création)
 *  - riderId : id du cavalier
 *  - onSubmit : fonction (riderId, packageData) => Promise
 *  - onCancel : fonction pour fermer/annuler
 */
function PackageForm({ initialPackage = null, riderId, onSubmit, onCancel }) {
  const { formData, error, submitting, handleChange, handleSubmit } = usePackageForm(
    initialPackage,
    riderId,
    onSubmit
  );

  const isEdit = !!initialPackage;

  return (
    <form onSubmit={handleSubmit} className="entity-form" noValidate>
      {error && (
        <div className="alert alert-error">
          <Icons.Warning />
          <span>{error}</span>
        </div>
      )}

      <div className="form-section">
        <h3>Détails du forfait</h3>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="services_per_week">
              Services / semaine <span className="required">*</span>
            </label>
            <input
              type="number"
              id="services_per_week"
              name="services_per_week"
              value={formData.services_per_week}
              onChange={handleChange}
              min="0"
              step="1"
              disabled={submitting}
              className="form-input"
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="private_lessons_per_week">
              Cours particuliers / semaine <span className="required">*</span>
            </label>
            <input
              type="number"
              id="private_lessons_per_week"
              name="private_lessons_per_week"
              value={formData.private_lessons_per_week}
              onChange={handleChange}
              min="0"
              step="1"
              disabled={submitting}
              className="form-input"
              required
            />
          </div>
        </div>
      </div>

      <div className="modal-footer">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onCancel}
          disabled={submitting}
        >
          <Icons.Cancel /> Annuler
        </button>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? (
            <>
              <Icons.Loading className="spin" />
              Enregistrement...
            </>
          ) : (
            <>
              <Icons.Save /> {isEdit ? 'Modifier' : 'Créer'}
            </>
          )}
        </button>
      </div>
    </form>
  );
}

PackageForm.propTypes = {
  initialPackage: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    services_per_week: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    private_lessons_per_week: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    is_active: PropTypes.bool,
  }),
  riderId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default PackageForm;
