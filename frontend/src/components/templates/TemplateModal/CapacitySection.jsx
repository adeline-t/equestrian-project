import React from 'react';
import PropTypes from 'prop-types';
import '../../../styles/common/forms.css';

function CapacitySection({ formData, onChange }) {
  return (
    <div className="form-section">
      <h3>Capacité</h3>
      <div className="form-row">
        <div className="form-group">
          <label>Participants minimum *</label>
          <input
            type="number"
            value={formData.min_participants}
            onChange={(e) => onChange('min_participants', parseInt(e.target.value) || 1)}
            min="1"
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label>
            Participants maximum {formData.lesson_type === 'competition' && '(optionnel)'}
          </label>
          <input
            type="number"
            value={formData.max_participants || ''}
            onChange={(e) => {
              const val = e.target.value;
              onChange('max_participants', val === '' ? null : parseInt(val));
            }}
            min={formData.min_participants}
            placeholder={formData.lesson_type === 'competition' ? 'Illimité' : 'Nombre maximum'}
            className="form-input"
          />
          {formData.lesson_type === 'competition' && (
            <small className="text-muted">
              Laisser vide pour un nombre illimité de participants
            </small>
          )}
        </div>
      </div>
    </div>
  );
}

CapacitySection.propTypes = {
  formData: PropTypes.shape({
    lesson_type: PropTypes.string.isRequired,
    min_participants: PropTypes.number.isRequired,
    max_participants: PropTypes.number,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default CapacitySection;