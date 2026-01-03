import React from 'react';
import PropTypes from 'prop-types';
import '../../../styles/common/forms.css';

function ValiditySection({ formData, onChange }) {
  return (
    <div className="form-section">
      <h3>Période de validité</h3>
      <div className="form-row">
        <div className="form-group">
          <label>Date de début *</label>
          <input
            type="date"
            value={formData.valid_from}
            onChange={(e) => onChange('valid_from', e.target.value)}
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label>Date de fin (optionnelle)</label>
          <input
            type="date"
            value={formData.valid_until || ''}
            onChange={(e) => onChange('valid_until', e.target.value)}
            min={formData.valid_from}
            className="form-input"
          />
          <small className="text-muted">Laisser vide pour un template sans date de fin</small>
        </div>
      </div>
    </div>
  );
}

ValiditySection.propTypes = {
  formData: PropTypes.shape({
    valid_from: PropTypes.string.isRequired,
    valid_until: PropTypes.string,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default ValiditySection;