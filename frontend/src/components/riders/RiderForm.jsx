import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

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
          ⚠️ {error}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="name">
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
        <label htmlFor="phone">Téléphone</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Ex: 06 12 34 56 78"
          disabled={submitting}
        />
      </div>

      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Ex: jean.dupont@email.com"
          disabled={submitting}
        />
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

      <div className="flex gap-10 mt-20">
        <button 
          type="submit" 
          className="btn btn-success" 
          disabled={submitting}
        >
          {submitting ? (
            <>
              <span className="loading-spinner"></span>
              Enregistrement...
            </>
          ) : (
            <>
              ✓ {rider ? 'Mettre à jour' : 'Créer'} le cavalier
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

RiderForm.propTypes = {
  rider: PropTypes.shape({
    id: PropTypes.string,
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