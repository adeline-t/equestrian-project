import React from 'react';
import PropTypes from 'prop-types';
import { Icons } from '../../../lib/libraries/icons.jsx';

const PairingSelectionFields = ({ formData, onChange, riders, horses, riderId }) => {
  // Filter active horses
  const availableHorses =
    horses?.filter((horse) => {
      const now = new Date().toISOString().split('T')[0];
      const isActive =
        (!horse.activity_start_date || horse.activity_start_date <= now) &&
        (!horse.activity_end_date || horse.activity_end_date >= now);
      return isActive;
    }) || [];

  // Get the selected rider name if riderId is provided
  const selectedRiderName = riderId ? riders?.find((r) => r.id === parseInt(riderId))?.name : null;

  // Check if rider select should be disabled
  const isRiderLocked = !!riderId;

  return (
    <div className="form-section">
      <h3>Sélection du cavalier et du cheval</h3>

      {/* Rider Selection */}
      <div className="form-group">
        <label htmlFor="rider_id">
          Cavalier <span className="required">*</span>
        </label>
        {isRiderLocked ? (
          <div className="form-input-static">
            <Icons.User style={{ marginRight: '8px' }} />
            {selectedRiderName || 'Cavalier sélectionné'}
          </div>
        ) : (
          <select
            id="rider_id"
            name="rider_id"
            value={formData.rider_id || ''}
            onChange={onChange}
            className="form-select"
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
        {isRiderLocked && (
          <small className="form-help">Le cavalier est défini et ne peut pas être modifié</small>
        )}
      </div>

      {/* Horse Selection */}
      <div className="form-group">
        <label htmlFor="horse_id">
          Cheval <span className="required">*</span>
        </label>
        {availableHorses.length === 0 ? (
          <div className="alert alert-warning">
            <Icons.Warning style={{ marginRight: '8px' }} />
            Aucun cheval actif disponible. Veuillez d'abord activer des chevaux.
          </div>
        ) : (
          <select
            id="horse_id"
            name="horse_id"
            value={formData.horse_id || ''}
            onChange={onChange}
            className="form-select"
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
    </div>
  );
};

PairingSelectionFields.propTypes = {
  formData: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  riders: PropTypes.array.isRequired,
  horses: PropTypes.array.isRequired,
  riderId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default PairingSelectionFields;
