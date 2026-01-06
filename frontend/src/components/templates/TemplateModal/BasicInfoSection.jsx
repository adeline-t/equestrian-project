import React from 'react';
import PropTypes from 'prop-types';
import { LESSON_TYPES } from '../../../constants/domains/templates/types.js';
import '../../../styles/common/forms.css';
import '../../../styles/common/alerts.css';

function BasicInfoSection({ formData, onChange, isBlocked }) {
  return (
    <div className="form-section">
      <h3>Informations générales</h3>

      <div className="form-group">
        <label>Nom du cours *</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => onChange('name', e.target.value)}
          required
          placeholder="Ex: Cours collectif débutants - Lundi soir"
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea
          value={formData.description || ''}
          onChange={(e) => onChange('description', e.target.value)}
          rows="3"
          placeholder="Description du cours..."
          className="form-textarea"
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Type de cours *</label>
          <select
            value={formData.lesson_type}
            onChange={(e) => onChange('lesson_type', e.target.value)}
            required
            className="form-select"
          >
            {LESSON_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Heure de début *</label>
          <input
            type="time"
            value={formData.start_time}
            onChange={(e) => onChange('start_time', e.target.value)}
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label>Durée (minutes) *</label>
          <input
            type="number"
            value={formData.duration_minutes}
            onChange={(e) => onChange('duration_minutes', parseInt(e.target.value) || 60)}
            min="15"
            step="15"
            required
            className="form-input"
          />
        </div>
      </div>

      {isBlocked && (
        <div className="alert alert-info">
          ℹ️ Les plages bloquées empêchent toute réservation de cours sur ce créneau. Elles
          peuvent être annulées ponctuellement pour permettre des cours exceptionnels.
        </div>
      )}
    </div>
  );
}

BasicInfoSection.propTypes = {
  formData: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    lesson_type: PropTypes.string.isRequired,
    start_time: PropTypes.string.isRequired,
    duration_minutes: PropTypes.number.isRequired,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  isBlocked: PropTypes.bool.isRequired,
};

export default BasicInfoSection;