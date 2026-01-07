import React from 'react';
import PropTypes from 'prop-types';
import { Icons } from '../../../lib/icons';
import InfoTooltip from '../../common/InfoTooltip';

const PairingDateFields = ({ formData, onChange }) => {
  return (
    <div className="form-section">
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <h3 style={{ margin: 0 }}>Période de la pension</h3>
        <InfoTooltip
          message="La pension permettra à ce cavalier de monter ce cheval pendant la période spécifiée. Les dates ne sont pas strictes - elles servent principalement de référence pour l'organisation."
          position="bottom"
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="pairing_start_date">
            Date de début <span className="required">*</span>
          </label>
          <input
            type="date"
            id="pairing_start_date"
            name="pairing_start_date"
            value={formData.pairing_start_date}
            onChange={onChange}
            className="form-input"
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
            className="form-input"
          />
          <small className="form-help">Laissez vide si la pension est toujours active</small>
        </div>
      </div>
    </div>
  );
};

PairingDateFields.propTypes = {
  formData: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default PairingDateFields;
