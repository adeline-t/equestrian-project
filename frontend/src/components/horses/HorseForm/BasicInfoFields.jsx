import React from 'react';

const BasicInfoFields = ({ formData, onChange, error }) => {
  return (
    <div className="form-section">
      <h3>Informations générales</h3>
      
      <div className="form-group">
        <label>Nom du cheval *</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => onChange('name', e.target.value)}
          className={`form-input ${error && !formData.name.trim() ? 'error' : ''}`}
          placeholder="Entrez le nom du cheval"
          required
        />
      </div>

      <div className="form-group">
        <label>Type *</label>
        <select
          value={formData.kind}
          onChange={(e) => onChange('kind', e.target.value)}
          className="form-select"
          required
        >
          <option value="horse">Cheval</option>
          <option value="pony">Poney</option>
        </select>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Date de début d'activité *</label>
          <input
            type="date"
            value={formData.activity_start_date}
            onChange={(e) => onChange('activity_start_date', e.target.value)}
            className={`form-input ${error && !formData.activity_start_date ? 'error' : ''}`}
            required
          />
        </div>

        <div className="form-group">
          <label>Date de fin d'activité</label>
          <input
            type="date"
            value={formData.activity_end_date}
            onChange={(e) => onChange('activity_end_date', e.target.value)}
            className="form-input"
          />
        </div>
      </div>

      {error && (
        <div className="alert alert-error" style={{ marginTop: '16px' }}>
          <strong>Erreur:</strong> {error}
        </div>
      )}
    </div>
  );
};

export default BasicInfoFields;