import React from 'react';

const ActivityFields = ({ formData, onChange }) => {
  return (
    <div className="form-section">
      <h3>Période d'activité</h3>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="activity_start_date">Date de début *</label>
          <input
            type="date"
            id="activity_start_date"
            name="activity_start_date"
            value={formData.activity_start_date}
            onChange={onChange}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="activity_end_date">Date de fin</label>
          <input
            type="date"
            id="activity_end_date"
            name="activity_end_date"
            value={formData.activity_end_date}
            onChange={onChange}
            className="form-input"
          />
          <small className="form-help">
            Laissez vide si le cavalier est toujours actif
          </small>
        </div>
      </div>

      <div className="alert alert-info" style={{ marginTop: '16px' }}>
        ℹ️ Le cavalier sera considéré comme actif entre la date de début et la date de fin
        (si spécifiée). Les dates ne sont pas strictes - elles servent principalement de
        référence pour l'organisation des activités.
      </div>
    </div>
  );
};

export default ActivityFields;