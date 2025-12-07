import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

function HorseForm({ horse, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    kind: 'horse',
    activity_start_date: '',
    activity_end_date: '',
    is_owned_by_laury: false,
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (horse) {
      setFormData({
        name: horse.name || '',
        kind: horse.kind || 'horse',
        activity_start_date: horse.activity_start_date || '',
        activity_end_date: horse.activity_end_date || '',
        is_owned_by_laury: horse.is_owned_by_laury || false,
      });
    } else {
      setFormData({
        name: '',
        kind: 'horse',
        activity_start_date: '',
        activity_end_date: '',
        is_owned_by_laury: false,
      });
    }
  }, [horse]);

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
    if (!formData.name.trim()) {
      setError('Le nom est requis');
      return false;
    }

    if (formData.name.trim().length < 2) {
      setError('Le nom doit contenir au moins 2 caractères');
      return false;
    }

    if (!formData.kind) {
      setError('Le type est requis');
      return false;
    }

    // Validate date logic
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
      const submitData = {
        ...formData,
        name: formData.name.trim(),
        kind: formData.kind,
        activity_start_date: formData.activity_start_date || null,
        activity_end_date: formData.activity_end_date || null,
        is_owned_by_laury: formData.is_owned_by_laury || false,
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

  return (
    <form onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
      {error && <div className="error">⚠️ {error}</div>}

      <div className="form-group">
        <label htmlFor="name">
          Nom <span style={{ color: '#e53e3e' }}>*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="Ex: Jolly Jumper"
          autoFocus
          disabled={submitting}
        />
      </div>

      <div className="form-group">
        <label htmlFor="kind">
          Type <span style={{ color: '#e53e3e' }}>*</span>
        </label>
        <select
          id="kind"
          name="kind"
          value={formData.kind}
          onChange={handleChange}
          required
          disabled={submitting}
        >
          <option value="horse">🐴 Cheval</option>
          <option value="pony">🦄 Poney</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="activity_start_date">Début d'activité</label>
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
        <label htmlFor="activity_end_date">Fin d'activité</label>
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

      <div className="form-group">
        <label htmlFor="is_owned_by_laury">Est-ce que ce cheval/poney appartient à Laury ?</label>
        <input
          type="checkbox"
          id="is_owned_by_laury"
          name="is_owned_by_laury"
          checked={formData.is_owned_by_laury}
          onChange={handleChange}
          disabled={submitting}
        />
      </div>

      <div className="form-group">
        <div
          style={{
            padding: '16px',
            background: '#f7fafc',
            borderRadius: '8px',
            border: '2px solid #e2e8f0',
          }}
        >
          <h4 style={{ margin: '0 0 8px 0', color: '#4a5568' }}>Récapitulatif</h4>
          <p style={{ margin: '0', color: '#718096' }}>
            {formData.kind === 'horse' ? '🐴' : '🦄'} <strong>{formData.name || 'Nom'}</strong> -
            {formData.kind === 'horse' ? ' Cheval' : ' Poney'}
          </p>
          {formData.activity_start_date && (
            <p style={{ margin: '4px 0 0 0', color: '#718096', fontSize: '0.9rem' }}>
              Activité: {formData.activity_start_date}
              {formData.activity_end_date && ` → ${formData.activity_end_date}`}
            </p>
          )}
        </div>
      </div>

      <div className="flex gap-10 mt-20">
        <button type="submit" className="btn btn-success" disabled={submitting}>
          {submitting ? (
            <>
              <span className="loading-spinner"></span>
              Enregistrement...
            </>
          ) : (
            <>
              ✓ {horse ? 'Mettre à jour' : 'Créer'} le{' '}
              {formData.kind === 'horse' ? 'cheval' : 'poney'}
            </>
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

HorseForm.propTypes = {
  horse: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    kind: PropTypes.oneOf(['horse', 'pony']),
    activity_start_date: PropTypes.string,
    activity_end_date: PropTypes.string,
  }),
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

HorseForm.defaultProps = {
  horse: null,
};

export default HorseForm;
