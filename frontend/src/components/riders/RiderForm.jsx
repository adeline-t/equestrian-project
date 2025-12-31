import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Icons } from '../../utils/icons';

function RiderForm({ rider, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    activity_start_date: '',
    activity_end_date: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (rider) {
      setFormData({
        name: rider.name || '',
        phone: rider.phone || '',
        email: rider.email || '',
        activity_start_date: rider.activity_start_date || '',
        activity_end_date: rider.activity_end_date || '',
      });
    } else {
      setFormData({
        name: '',
        phone: '',
        email: '',
        activity_start_date: '',
        activity_end_date: '',
      });
    }
  }, [rider]);

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

    if (formData.email && !formData.email.includes('@')) {
      setError('Veuillez entrer une adresse email valide');
      return false;
    }

    if (formData.phone && formData.phone.length < 10) {
      setError('Veuillez entrer un numéro de téléphone valide');
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
        phone: formData.phone.trim() || null,
        email: formData.email.trim().toLowerCase() || null,
        activity_start_date: formData.activity_start_date || null,
        activity_end_date: formData.activity_end_date || null,
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
      {error && (
        <div className="error">
          <Icons.Warning style={{ marginRight: '8px' }} />
          {error}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="name">
          <Icons.User style={{ marginRight: '4px' }} />
          Nom complet <span style={{ color: '#e53e3e' }}>*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="Ex: Jean Dupont"
          autoFocus
          disabled={submitting}
        />
      </div>

      <div className="form-group">
        <label htmlFor="phone">
          <Icons.Phone style={{ marginRight: '4px' }} />
          Téléphone
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Ex: 06 12 34 56 78"
          disabled={submitting}
        />
        <small
          style={{ color: '#718096', fontSize: '0.875rem', marginTop: '4px', display: 'block' }}
        >
          <Icons.Info style={{ fontSize: '0.75rem', marginRight: '4px' }} />
          Optionnel - Format: 10 chiffres minimum
        </small>
      </div>

      <div className="form-group">
        <label htmlFor="email">
          <Icons.Email style={{ marginRight: '4px' }} />
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Ex: jean.dupont@email.com"
          disabled={submitting}
        />
        <small
          style={{ color: '#718096', fontSize: '0.875rem', marginTop: '4px', display: 'block' }}
        >
          <Icons.Info style={{ fontSize: '0.75rem', marginRight: '4px' }} />
          Optionnel - Sera converti en minuscules
        </small>
      </div>

      <div className="form-group">
        <label htmlFor="activity_start_date">
          <Icons.Calendar style={{ marginRight: '4px' }} />
          Début d'activité
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
          Fin d'activité
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

      {/* Preview Section */}
      {formData.name && (
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
              Récapitulatif
            </h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Icons.User style={{ color: '#4299e1' }} />
              <strong style={{ color: '#2d3748' }}>{formData.name}</strong>
            </div>
            {formData.phone && (
              <p
                style={{
                  margin: '4px 0 0 24px',
                  color: '#718096',
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <Icons.Phone style={{ fontSize: '0.875rem' }} />
                {formData.phone}
              </p>
            )}
            {formData.email && (
              <p
                style={{
                  margin: '4px 0 0 24px',
                  color: '#718096',
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <Icons.Email style={{ fontSize: '0.875rem' }} />
                {formData.email.toLowerCase()}
              </p>
            )}
            {(formData.activity_start_date || formData.activity_end_date) && (
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
                Activité:
                {formData.activity_start_date && ` ${formData.activity_start_date}`}
                {formData.activity_end_date && ` → ${formData.activity_end_date}`}
                {!formData.activity_start_date &&
                  formData.activity_end_date &&
                  ` jusqu'au ${formData.activity_end_date}`}
              </p>
            )}
          </div>
        </div>
      )}

      <div className="flex gap-10 mt-20">
        <button type="submit" className="btn btn-success" disabled={submitting}>
          {submitting ? (
            <>
              <Icons.Loading className="spin" style={{ marginRight: '8px' }} />
              Enregistrement...
            </>
          ) : (
            <>
              <Icons.Save style={{ marginRight: '8px' }} />
              {rider ? 'Mettre à jour' : 'Créer'} le cavalier
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

RiderForm.propTypes = {
  rider: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    phone: PropTypes.string,
    email: PropTypes.string,
    activity_start_date: PropTypes.string,
    activity_end_date: PropTypes.string,
  }),
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

RiderForm.defaultProps = {
  rider: null,
};

export default RiderForm;
