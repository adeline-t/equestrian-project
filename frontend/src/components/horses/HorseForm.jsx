import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ridersApi } from '../../services/api';

function HorseForm({ horse, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    kind: 'horse',
    activity_start_date: '',
    activity_end_date: '',
    is_owned_by: 'Propriétaire',
    owner_id: null,
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [riders, setRiders] = useState([]);
  const [loadingRiders, setLoadingRiders] = useState(false);

  const ownershipOptions = [
    { value: 'Laury', label: 'Laury' },
    { value: 'Propriétaire', label: 'Propriétaire' },
    { value: 'Club', label: 'Club' },
  ];

  // Load riders when component mounts
  useEffect(() => {
    loadRiders();
  }, []);

  // Load horse data when horse prop changes
  useEffect(() => {
    if (horse) {
      setFormData({
        name: horse.name || '',
        kind: horse.kind || 'horse',
        activity_start_date: horse.activity_start_date || '',
        activity_end_date: horse.activity_end_date || '',
        is_owned_by: horse.is_owned_by || 'Propriétaire',
        owner_id: horse.owner_id || null,
      });
    } else {
      setFormData({
        name: '',
        kind: 'horse',
        activity_start_date: '',
        activity_end_date: '',
        is_owned_by: 'Propriétaire',
        owner_id: null,
      });
    }
  }, [horse]);

  const loadRiders = async () => {
    try {
      setLoadingRiders(true);
      const data = await ridersApi.getAll();
      setRiders(data || []);
    } catch (err) {
      console.error('Error loading riders:', err);
      setError('Erreur lors du chargement des cavaliers');
    } finally {
      setLoadingRiders(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = {
        ...prev,
        [name]: value,
      };

      // Reset owner_id if is_owned_by changes to something other than 'Propriétaire'
      if (name === 'is_owned_by' && value !== 'Propriétaire') {
        updated.owner_id = null;
      }

      return updated;
    });

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

    if (!formData.is_owned_by) {
      setError('Le propriétaire est requis');
      return false;
    }

    // Validate owner_id if is_owned_by is 'Propriétaire'
    if (formData.is_owned_by === 'Propriétaire' && !formData.owner_id) {
      setError('Veuillez sélectionner un propriétaire');
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
        name: formData.name.trim(),
        kind: formData.kind,
        activity_start_date: formData.activity_start_date || null,
        activity_end_date: formData.activity_end_date || null,
        is_owned_by: formData.is_owned_by,
        owner_id: formData.is_owned_by === 'Propriétaire' ? formData.owner_id : null,
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

  const getOwnershipLabel = (value) => {
    return ownershipOptions.find((opt) => opt.value === value)?.label || value;
  };

  const getOwnerName = (ownerId) => {
    if (!ownerId) return 'Non sélectionné';
    const owner = riders.find((r) => r.id === ownerId);
    return owner ? owner.name : 'Non sélectionné';
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
        <label htmlFor="is_owned_by">
          Propriétaire <span style={{ color: '#e53e3e' }}>*</span>
        </label>
        <select
          id="is_owned_by"
          name="is_owned_by"
          value={formData.is_owned_by}
          onChange={handleChange}
          required
          disabled={submitting}
        >
          {ownershipOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {formData.is_owned_by === 'Propriétaire' && (
        <div className="form-group">
          <label htmlFor="owner_id">
            Sélectionner le propriétaire <span style={{ color: '#e53e3e' }}>*</span>
          </label>
          {loadingRiders ? (
            <div style={{ padding: '8px', color: '#718096' }}>Chargement des cavaliers...</div>
          ) : riders.length === 0 ? (
            <div style={{ padding: '8px', color: '#e53e3e' }}>Aucun cavalier disponible</div>
          ) : (
            <select
              id="owner_id"
              name="owner_id"
              value={formData.owner_id || ''}
              onChange={handleChange}
              required
              disabled={submitting}
            >
              <option value="">-- Sélectionner un propriétaire --</option>
              {riders.map((rider) => (
                <option key={rider.id} value={rider.id}>
                  {rider.name}
                </option>
              ))}
            </select>
          )}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="activity_start_date">Arrivée</label>
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
        <label htmlFor="activity_end_date">Sortie</label>
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
            <strong>{formData.name || 'Nom'}</strong> -
            {formData.kind === 'horse' ? ' Cheval' : ' Poney'} -{' '}
            {getOwnershipLabel(formData.is_owned_by)}
          </p>
          {formData.is_owned_by === 'Propriétaire' && (
            <p style={{ margin: '4px 0 0 0', color: '#718096', fontSize: '0.9rem' }}>
              Propriétaire: <strong>{getOwnerName(formData.owner_id)}</strong>
            </p>
          )}
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
    is_owned_by: PropTypes.oneOf(['Laury', 'Propriétaire', 'Club']),
    owner_id: PropTypes.number,
  }),
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

HorseForm.defaultProps = {
  horse: null,
};

export default HorseForm;
