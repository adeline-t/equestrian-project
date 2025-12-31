import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Icons } from '../../utils/icons';

function PairingForm({ pairing, riders, horses, onSubmit, onCancel, riderId }) {
  const [formData, setFormData] = useState({
    rider_id: '',
    horse_id: '',
    pairing_start_date: '',
    pairing_end_date: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (pairing) {
      setFormData({
        rider_id: pairing.rider_id?.toString() || '',
        horse_id: pairing.horse_id?.toString() || '',
        pairing_start_date: pairing.pairing_start_date || '',
        pairing_end_date: pairing.pairing_end_date || '',
      });
    } else {
      setFormData({
        rider_id: riderId?.toString() || '',
        horse_id: '',
        pairing_start_date: '',
        pairing_end_date: '',
      });
    }
  }, [pairing, riderId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };

  const validateForm = () => {
    if (!formData.rider_id) {
      setError('Le cavalier est requis');
      return false;
    }

    if (!formData.horse_id) {
      setError('Le cheval est requis');
      return false;
    }

    // Validate date logic
    if (formData.pairing_start_date && formData.pairing_end_date) {
      const startDate = new Date(formData.pairing_start_date);
      const endDate = new Date(formData.pairing_end_date);

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
      const submitData = {
        ...formData,
        rider_id: parseInt(formData.rider_id),
        horse_id: parseInt(formData.horse_id),
        pairing_start_date: formData.pairing_start_date || null,
        pairing_end_date: formData.pairing_end_date || null,
      };
      await onSubmit(submitData);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onCancel();
    }
  };

  const getSelectedRider = () => {
    return riders.find((r) => r.id.toString() === formData.rider_id);
  };

  const getSelectedHorse = () => {
    return horses.find((h) => h.id.toString() === formData.horse_id);
  };

  const getKindLabel = (kind) => {
    return kind === 'horse' ? 'Cheval' : 'Poney';
  };

  return (
    <form onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
      {error && (
        <div className="error">
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
          required
          disabled={submitting || !!pairing || !!riderId}
        >
          <option value="">Sélectionnez un cavalier</option>
          {riders.map((rider) => (
            <option key={rider.id} value={rider.id}>
              {rider.name}
            </option>
          ))}
        </select>
        {riderId && (
          <small
            style={{ color: '#718096', fontSize: '0.875rem', marginTop: '4px', display: 'block' }}
          >
            <Icons.Info style={{ fontSize: '0.75rem', marginRight: '4px' }} />
            Le cavalier est pré-sélectionné
          </small>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="horse_id">
          <Icons.Horse style={{ marginRight: '4px' }} />
          Cheval <span style={{ color: '#e53e3e' }}>*</span>
        </label>
        <select
          id="horse_id"
          name="horse_id"
          value={formData.horse_id}
          onChange={handleChange}
          required
          disabled={submitting || !!pairing}
        >
          <option value="">Sélectionnez un cheval</option>
          {horses.map((horse) => (
            <option key={horse.id} value={horse.id}>
              {horse.name} ({getKindLabel(horse.kind)})
            </option>
          ))}
        </select>
        {pairing && (
          <small
            style={{ color: '#718096', fontSize: '0.875rem', marginTop: '4px', display: 'block' }}
          >
            <Icons.Info style={{ fontSize: '0.75rem', marginRight: '4px' }} />
            Le cavalier et le cheval ne peuvent pas être modifiés
          </small>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="pairing_start_date">
          <Icons.Calendar style={{ marginRight: '4px' }} />
          Date de début
        </label>
        <input
          type="date"
          id="pairing_start_date"
          name="pairing_start_date"
          value={formData.pairing_start_date}
          onChange={handleChange}
          max={formData.pairing_end_date || undefined}
          disabled={submitting}
        />
      </div>

      <div className="form-group">
        <label htmlFor="pairing_end_date">
          <Icons.Calendar style={{ marginRight: '4px' }} />
          Date de fin
        </label>
        <input
          type="date"
          id="pairing_end_date"
          name="pairing_end_date"
          value={formData.pairing_end_date}
          onChange={handleChange}
          min={formData.pairing_start_date || undefined}
          disabled={submitting}
        />
      </div>

      {/* Preview */}
      {formData.rider_id && formData.horse_id && (
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
              Aperçu
            </h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 8px 0' }}>
              <Icons.User style={{ color: '#4299e1' }} />
              <strong>{getSelectedRider()?.name || 'Cavalier'}</strong>
              <Icons.Link style={{ color: '#718096', fontSize: '0.875rem' }} />
              <Icons.Horse style={{ color: '#48bb78' }} />
              <strong>{getSelectedHorse()?.name || 'Cheval'}</strong>
            </div>
            {getSelectedHorse() && (
              <p style={{ margin: '4px 0 0 24px', color: '#718096', fontSize: '0.9rem' }}>
                Type:{' '}
                <span className={`badge badge-${getSelectedHorse().kind}`}>
                  {getKindLabel(getSelectedHorse().kind)}
                </span>
              </p>
            )}
            {formData.pairing_start_date && (
              <p
                style={{
                  margin: '8px 0 0 24px',
                  color: '#718096',
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <Icons.Calendar style={{ fontSize: '0.875rem' }} />
                Période: {formData.pairing_start_date}
                {formData.pairing_end_date && ` → ${formData.pairing_end_date}`}
              </p>
            )}
          </div>
        </div>
      )}

      <div className="flex gap-10 mt-20">
        <button
          type="submit"
          className="btn btn-success"
          disabled={submitting || !formData.rider_id || !formData.horse_id}
        >
          {submitting ? (
            <>
              <Icons.Loading className="spin" style={{ marginRight: '8px' }} />
              Enregistrement...
            </>
          ) : (
            <>
              <Icons.Save style={{ marginRight: '8px' }} />
              {pairing ? 'Mettre à jour' : 'Créer'} la pension
            </>
          )}
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onCancel}
          disabled={submitting}
        >
          <Icons.Cancel style={{ marginRight: '8px' }} />
          Annuler
        </button>
      </div>
    </form>
  );
}

PairingForm.propTypes = {
  pairing: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    rider_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    horse_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    pairing_start_date: PropTypes.string,
    pairing_end_date: PropTypes.string,
  }),
  riders: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  horses: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      kind: PropTypes.oneOf(['horse', 'pony']),
    })
  ).isRequired,
  riderId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

PairingForm.defaultProps = {
  pairing: null,
  riderId: null,
};

export default PairingForm;
