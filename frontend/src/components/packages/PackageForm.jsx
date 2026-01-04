import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Portal from '../../components/common/Portal';
import { Icons } from '../../lib/libraries/icons.jsx';
import './package.css';

function PackageForm({
  package: packageData = null,
  riders = [],
  riderId = null,
  onSubmit,
  onCancel,
}) {
  const [formData, setFormData] = useState({
    rider_id: '',
    private_lesson_count: 0,
    joint_lesson_count: 0,
    activity_start_date: '',
    activity_end_date: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (packageData) {
      setFormData({
        rider_id: packageData.rider_id?.toString() || riderId?.toString() || '',
        private_lesson_count: Number(packageData.private_lesson_count) || 0,
        joint_lesson_count: Number(packageData.joint_lesson_count) || 0,
        activity_start_date: packageData.activity_start_date || '',
        activity_end_date: packageData.activity_end_date || '',
      });
    } else {
      setFormData({
        rider_id: riderId?.toString() || '',
        private_lesson_count: 0,
        joint_lesson_count: 0,
        activity_start_date: '',
        activity_end_date: '',
      });
    }
  }, [packageData, riderId]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    let processedValue = value;

    // Handle number inputs - ensure they're always numbers, never empty strings
    if (name === 'private_lesson_count' || name === 'joint_lesson_count') {
      const numValue = Number(value);
      processedValue = isNaN(numValue) || value === '' ? 0 : Math.max(0, numValue);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: processedValue,
    }));

    if (error) {
      setError('');
    }
  };

  const validateForm = () => {
    if (!formData.rider_id) {
      setError('Veuillez sélectionner un cavalier');
      return false;
    }

    const privateCount = Number(formData.private_lesson_count) || 0;
    const jointCount = Number(formData.joint_lesson_count) || 0;

    if (privateCount === 0 && jointCount === 0) {
      setError('Au moins un type de cours est requis (valeur > 0)');
      return false;
    }

    if (privateCount < 0 || jointCount < 0) {
      setError('Les nombres ne peuvent pas être négatifs');
      return false;
    }

    if (formData.activity_start_date && formData.activity_end_date) {
      const startDate = new Date(formData.activity_start_date);
      const endDate = new Date(formData.activity_end_date);

      if (startDate > endDate) {
        setError('La date de début doit être antérieure à la date de fin');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);

      // Ensure all numeric fields are actual numbers
      const submitData = {
        rider_id: Number(formData.rider_id),
        private_lesson_count: Number(formData.private_lesson_count) || 0,
        joint_lesson_count: Number(formData.joint_lesson_count) || 0,
        activity_start_date: formData.activity_start_date || null,
        activity_end_date: formData.activity_end_date || null,
      };

      console.log('=== FORM SUBMISSION DEBUG ===');
      console.log('submitData:', submitData);
      console.log('Types:', {
        rider_id: typeof submitData.rider_id,
        private_lesson_count: typeof submitData.private_lesson_count,
        joint_lesson_count: typeof submitData.joint_lesson_count,
      });

      await onSubmit(submitData);
    } catch (err) {
      console.error('Submit error:', err);
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setSubmitting(false);
    }
  };

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
                  <small
                    style={{
                      color: '#718096',
                      fontSize: '0.875rem',
                      marginTop: '4px',
                      display: 'block',
                    }}
                  >
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
                <small
                  style={{
                    color: '#718096',
                    fontSize: '0.875rem',
                    marginTop: '4px',
                    display: 'block',
                  }}
                >
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
                <small
                  style={{
                    color: '#718096',
                    fontSize: '0.875rem',
                    marginTop: '4px',
                    display: 'block',
                  }}
                >
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

              {/* Preview */}
              {(formData.rider_id ||
                formData.private_lesson_count > 0 ||
                formData.joint_lesson_count > 0) && (
                <div className="form-group">
                  <div
                    style={{
                      padding: '16px',
                      background: '#f7fafc',
                      borderRadius: '8px',
                      border: '2px solid #e2e8f0',
                    }}
                  >
                    <h4
                      style={{
                        margin: '0 0 12px 0',
                        color: '#4a5568',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <Icons.Info />
                      Aperçu du forfait
                    </h4>
                    {selectedRider && (
                      <p
                        style={{
                          margin: '4px 0',
                          color: '#2d3748',
                          fontWeight: '600',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        <Icons.User style={{ color: '#4299e1' }} />
                        Pour: <strong>{selectedRider.name}</strong>
                      </p>
                    )}
                    {formData.private_lesson_count > 0 && (
                      <p
                        style={{
                          margin: '8px 0 4px 24px',
                          color: '#718096',
                          fontWeight: '500',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        <Icons.PrivateLesson style={{ fontSize: '0.875rem' }} />
                        <strong>{formData.private_lesson_count}</strong> cours privé(s) par semaine
                      </p>
                    )}
                    {formData.joint_lesson_count > 0 && (
                      <p
                        style={{
                          margin: '4px 0 4px 24px',
                          color: '#718096',
                          fontWeight: '500',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        <Icons.GroupLesson style={{ fontSize: '0.875rem' }} />
                        <strong>{formData.joint_lesson_count}</strong> cours collectif(s) par
                        semaine
                      </p>
                    )}
                    {formData.activity_start_date && (
                      <p
                        style={{
                          margin: '8px 0 0 24px',
                          color: '#718096',
                          fontSize: '0.9rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        <Icons.Calendar style={{ fontSize: '0.875rem' }} />
                        Depuis: {formData.activity_start_date}
                        {formData.activity_end_date && ` → ${formData.activity_end_date}`}
                      </p>
                    )}
                  </div>
                </div>
              )}
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
