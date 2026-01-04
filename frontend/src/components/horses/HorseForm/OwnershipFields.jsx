import React from 'react';
import { Icons } from '../../../lib/libraries/icons.jsx';

const OwnershipFields = ({ formData, onChange, riders, loadingRiders, ownershipOptions }) => {
  return (
    <div className="form-section">
      <h3>Propriétaire</h3>

      <div className="form-group">
        <label>Possession *</label>
        <select
          value={formData.is_owned_by}
          onChange={(e) => onChange('is_owned_by', e.target.value)}
          className="form-select"
          required
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
          <label>Propriétaire *</label>
          {loadingRiders ? (
            <div className="loading" style={{ textAlign: 'center', padding: '12px' }}>
              <Icons.Loading className="spin" style={{ fontSize: '20px' }} />
              <p style={{ margin: '8px 0 0 0', fontSize: '0.875rem' }}>
                Chargement des cavaliers...
              </p>
            </div>
          ) : riders.length === 0 ? (
            <div className="alert alert-info">
              <Icons.Info style={{ marginRight: '8px' }} />
              Aucun cavalier disponible. Veuillez d'abord ajouter des cavaliers.
            </div>
          ) : (
            <select
              value={formData.owner_id || ''}
              onChange={(e) =>
                onChange('owner_id', e.target.value ? parseInt(e.target.value) : null)
              }
              className="form-select"
              required
            >
              <option value="">Sélectionner un propriétaire</option>
              {riders.map((rider) => (
                <option key={rider.id} value={rider.id}>
                  {rider.name}
                </option>
              ))}
            </select>
          )}
        </div>
      )}

      {formData.is_owned_by === 'Propriétaire' && formData.owner_id && (
        <div className="alert alert-success" style={{ marginTop: '12px' }}>
          <Icons.Check style={{ marginRight: '8px' }} />
          Ce cheval sera associé au cavalier sélectionné comme propriétaire.
        </div>
      )}
    </div>
  );
};

export default OwnershipFields;
