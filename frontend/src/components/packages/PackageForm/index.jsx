import React from 'react';
import PropTypes from 'prop-types';
import Portal from '../../../components/common/Portal';
import { Icons } from '../../../lib/libraries/icons.jsx';
import PackagePreview from './PackagePreview';
import { usePackageForm } from '../../../hooks/usePackageForm';
import '../../../styles/common/modal.css';
import '../../../styles/common/forms.css';
import '../../../styles/common/alerts.css';
import '../../../styles/common/buttons.css';
import '../../../styles/components/packages.css';

function PackageForm({
  package: packageData = null,
  riders = [],
  riderId = null,
  onSubmit,
  onCancel,
}) {
  const { formData, error, submitting, handleChange, handleSubmit } = usePackageForm(
    packageData,
    riderId,
    onSubmit
  );

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onCancel();
    }
  };

  const selectedRider = riders?.find((r) => r.id === parseInt(formData.rider_id));

  return (
    <Portal>
      <div className="modal-overlay" onClick={onCancel}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3>
              {packageData ? (
                <>
                  <Icons.Edit style={{ marginRight: '8px' }} />
                  Modifier le forfait
                </>
              ) : (
                <>
                  <Icons.Add style={{ marginRight: '8px' }} />
                  Nouveau forfait
                </>
              )}
            </h3>
            <button className="btn-close" onClick={onCancel}>
              <Icons.Close />
            </button>
          </div>

          <form onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
            <div className="modal-body">
              {error && (
                <div className="alert alert-error mb-20">
                  <Icons.Warning style={{ marginRight: '8px' }} />
                  {error}
                </div>
              )}

              <div className="form-group">
                <label htmlFor="rider_id">
                  <Icons.User style={{ marginRight: '4px' }} />
                  Cavalier <span style={{ color: '#e53e3e' }}>*</span>
                </label>
                <select
                  id="rider_id"
                  name="rider_id"
                  value={formData.rider_id}
                  onChange={handleChange}
                  disabled={submitting || !!riderId}
                  required
                >
                  <option value="">Sélectionner un cavalier</option>
                  {riders?.map((rider) => (
                    <option key={rider.id} value={rider.id}>
                      {rider.name} {rider.email && `(${rider.email})`}
                    </option>
                  ))}
                </select>
                {riderId && (
                  <small className="text-muted">
                    <Icons.Info style={{ fontSize: '0.75rem', marginRight: '4px' }} />
                    Le cavalier est pré-sélectionné
                  </small>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="private_lesson_count">
                  <Icons.PrivateLesson style={{ marginRight: '4px' }} />
                  Nombre de cours privés par semaine
                </label>
                <input
                  type="number"
                  id="private_lesson_count"
                  name="private_lesson_count"
                  value={formData.private_lesson_count}
                  onChange={handleChange}
                  min="0"
                  step="1"
                  disabled={submitting}
                />
                <small className="text-muted">
                  <Icons.Info style={{ fontSize: '0.75rem', marginRight: '4px' }} />
                  Cours individuels (1 cavalier)
                </small>
              </div>

              <div className="form-group">
                <label htmlFor="joint_lesson_count">
                  <Icons.GroupLesson style={{ marginRight: '4px' }} />
                  Nombre de cours collectifs par semaine
                </label>
                <input
                  type="number"
                  id="joint_lesson_count"
                  name="joint_lesson_count"
                  value={formData.joint_lesson_count}
                  onChange={handleChange}
                  min="0"
                  step="1"
                  disabled={submitting}
                />
                <small className="text-muted">
                  <Icons.Info style={{ fontSize: '0.75rem', marginRight: '4px' }} />
                  Cours en groupe (plusieurs cavaliers)
                </small>
              </div>

              <div className="form-group">
                <label htmlFor="activity_start_date">
                  <Icons.Calendar style={{ marginRight: '4px' }} />
                  Date de début
                </label>
                <input
                  type="date"
                  id="activity_start_date"
                  name="activity_start_date"
                  value={formData.activity_start_date}
                  onChange={handleChange}
                  max={formData.activity_end_date || undefined}
                  disabled={submitting}
                />
              </div>

              <div className="form-group">
                <label htmlFor="activity_end_date">
                  <Icons.Calendar style={{ marginRight: '4px' }} />
                  Date de fin
                </label>
                <input
                  type="date"
                  id="activity_end_date"
                  name="activity_end_date"
                  value={formData.activity_end_date}
                  onChange={handleChange}
                  min={formData.activity_start_date || undefined}
                  disabled={submitting}
                />
              </div>

              <PackagePreview formData={formData} selectedRider={selectedRider} />
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onCancel}
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
                    {packageData ? 'Mettre à jour' : 'Créer'} le forfait
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Portal>
  );
}

PackageForm.propTypes = {
  package: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    rider_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    private_lesson_count: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    joint_lesson_count: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    activity_start_date: PropTypes.string,
    activity_end_date: PropTypes.string,
  }),
  riders: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      email: PropTypes.string,
    })
  ),
  riderId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default PackageForm;
