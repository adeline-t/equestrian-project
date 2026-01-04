import React from 'react';
import { Icons } from '../../../lib/libraries/icons.jsx';

const PairingDateFields = ({ formData, onChange, error }) => {
  return (
    <div className="form-section">
      <h3>Période du pairing</h3>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="pairing_start_date">Date de début *</label>
          <input
            type="date"
            id="pairing_start_date"
            name="pairing_start_date"
            value={formData.pairing_start_date}
            onChange={onChange}
            className={`form-input ${error && !formData.pairing_start_date ? 'error' : ''}`}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="pairing_end_date">Date de fin</label>
          <input
            type="date"
            id="pairing_end_date"
            name="pairing_end_date"
            value={formData.pairing_end_date}
            onChange={onChange}
            className={`form-input ${error?.includes('postérieure') ? 'error' : ''}`}
          />
          <small className="form-help">Laissez vide si le pairing est toujours actif</small>
        </div>
      </div>

      {error && (error.includes('début') || error.includes('postérieure')) && (
        <div className="alert alert-error" style={{ marginTop: '12px' }}>
          <strong>Erreur:</strong> {error}
        </div>
      )}

      <div className="alert alert-info" style={{ marginTop: '16px' }}>
        <Icons.Info style={{ marginRight: '8px' }} />
        Le pairing permettra à ce cavalier de monter ce cheval pendant la période spécifiée. Les
        dates ne sont pas strictes - elles servent principalement de référence pour l'organisation.
      </div>
    </div>
  );
};

export default PairingDateFields;
