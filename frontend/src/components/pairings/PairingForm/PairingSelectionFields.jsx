import React from 'react';
import { Icons } from '../../../lib/libraries/icons.jsx';

const PairingSelectionFields = ({ formData, onChange, riders, horses, error, riderId }) => {
  const availableHorses = horses?.filter((horse) => horse.statut === 'actif') || [];

  return (
    <div className="form-section">
      <h3>Sélection du cavalier et du cheval</h3>

      <div className="form-group">
        <label htmlFor="rider_id">Cavalier *</label>
        {riderId ? (
          <div className="form-input-static">
            <Icons.User style={{ marginRight: '8px' }} />
            {riders?.find((r) => r.id === parseInt(riderId))?.name || 'Cavalier sélectionné'}
          </div>
        ) : (
          <select
            id="rider_id"
            name="rider_id"
            value={formData.rider_id}
            onChange={onChange}
            className={`form-select ${error && !formData.rider_id ? 'error' : ''}`}
            required
          >
            <option value="">Sélectionner un cavalier</option>
            {riders?.map((rider) => (
              <option key={rider.id} value={rider.id}>
                {rider.name}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="horse_id">Cheval *</label>
        {availableHorses.length === 0 ? (
          <div className="alert alert-warning">
            <Icons.Warning style={{ marginRight: '8px' }} />
            Aucun cheval actif disponible. Veuillez d'abord activer des chevaux.
          </div>
        ) : (
          <select
            id="horse_id"
            name="horse_id"
            value={formData.horse_id}
            onChange={onChange}
            className={`form-select ${error && !formData.horse_id ? 'error' : ''}`}
            required
          >
            <option value="">Sélectionner un cheval</option>
            {availableHorses.map((horse) => (
              <option key={horse.id} value={horse.id}>
                {horse.name} ({horse.kind === 'horse' ? 'Cheval' : 'Poney'})
              </option>
            ))}
          </select>
        )}
      </div>

      {error && (error.includes('cavalier') || error.includes('cheval')) && (
        <div className="alert alert-error" style={{ marginTop: '12px' }}>
          <strong>Erreur:</strong> {error}
        </div>
      )}
    </div>
  );
};

export default PairingSelectionFields;
