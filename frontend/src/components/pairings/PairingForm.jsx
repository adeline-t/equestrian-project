import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

function PairingForm({ pairing, riders, horses, onSubmit, onCancel }) {
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
        rider_id: '',
        horse_id: '',
        pairing_start_date: '',
        pairing_end_date: '',
      });
    }
  }, [pairing]);

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

  const getKindEmoji = (kind) => {
    return kind === 'horse' ? '🐴' : '🦄';
  };

  const getKindLabel = (kind) => {
    return kind === 'horse' ? 'Cheval' : 'Poney';
  };

  return (
    <form onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
      {error && <div className="error">⚠️ {error}</div>}

      <div className="form-group">
        <label htmlFor="rider_id">
          Cavalier <span style={{ color: '#e53e3e' }}>*</span>
        </label>
        <select
          id="rider_id"
          name="rider_id"
          value={formData.rider_id}
          onChange={handleChange}
          required
          disabled={submitting || !!pairing}
        >
          <option value="">Sélectionnez un cavalier</option>
          {riders.map((rider) => (
            <option key={rider.id} value={rider.id}>
              👤 {rider.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="horse_id">
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
              {getKindEmoji(horse.kind)} {horse.name} ({getKindLabel(horse.kind)})
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="pairing_start_date">Date de début d'pairing</label>
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
        <label htmlFor="pairing_end_date">Date de fin d'pairing</label>
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
            <h4 style={{ margin: '0 0 12px 0', color: '#4a5568' }}>Aperçu de l'pairing</h4>
            <p style={{ margin: '0', color: '#718096', fontWeight: '500' }}>
              👤 <strong>{getSelectedRider()?.name || 'Cavalier'}</strong>
              {' ↔ '}
              {getKindEmoji(getSelectedHorse()?.kind)}{' '}
              <strong>{getSelectedHorse()?.name || 'Cheval'}</strong>
            </p>
            {getSelectedHorse() && (
              <p style={{ margin: '4px 0 0 0', color: '#718096', fontSize: '0.9rem' }}>
                Type: {getKindLabel(getSelectedHorse().kind)}
              </p>
            )}
            {formData.pairing_start_date && (
              <p style={{ margin: '4px 0 0 0', color: '#718096', fontSize: '0.9rem' }}>
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
              <span className="loading-spinner"></span>
              Enregistrement...
            </>
          ) : (
            <>✓ {pairing ? 'Mettre à jour' : 'Créer'} l'pairing</>
          )}
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onCancel}
          disabled={submitting}
        >
          Annuler
        </button>
      </div>
    </form>
  );
}

PairingForm.propTypes = {
  pairing: PropTypes.shape({
    id: PropTypes.string,
    rider_id: PropTypes.string,
    horse_id: PropTypes.string,
    pairing_start_date: PropTypes.string,
    pairing_end_date: PropTypes.string,
  }),
  riders: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  horses: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      kind: PropTypes.oneOf(['horse', 'pony']),
    })
  ).isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

PairingForm.defaultProps = {
  pairing: null,
};

export default PairingForm;
