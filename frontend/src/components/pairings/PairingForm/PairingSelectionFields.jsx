import React from 'react';
import PropTypes from 'prop-types';
import { Icons } from '../../../lib/libraries/icons.jsx';
import InfoTooltip from '../../common/InfoTooltip';

const PairingSelectionFields = ({ formData, onChange, riders, horses, riderId, isEdit }) => {
  // Filter active horses
  const availableHorses =
    horses?.filter((horse) => {
      const now = new Date().toISOString().split('T')[0];
      const isActive =
        (!horse.activity_start_date || horse.activity_start_date <= now) &&
        (!horse.activity_end_date || horse.activity_end_date >= now);
      return isActive;
    }) || [];

  // Get the selected rider - use formData.rider_id for current value
  const selectedRider = riders?.find((r) => r.id === (riderId || formData.rider_id));

  // Get the selected horse
  const selectedHorse = horses?.find((h) => h.id === formData.horse_id);

  // Check if rider select should be disabled
  const isRiderLocked = !!riderId || isEdit;
  const isHorseLocked = isEdit;

  return (
    <div className="form-section">
      <h3>Sélection du cavalier et du cheval</h3>

      {/* Rider Selection */}
      <div className="form-group">
        <label htmlFor="rider_id" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          Cavalier <span className="required">*</span>
          {isRiderLocked && (
            <InfoTooltip
              message={
                isEdit
                  ? 'Le cavalier ne peut pas être modifié. Pour changer de cavalier, veuillez terminer cette pension et en créer une nouvelle.'
                  : 'Le cavalier est défini et ne peut pas être modifié'
              }
              position="right"
            />
          )}
        </label>
        {isRiderLocked ? (
          <div className="form-input-static">
            <Icons.User style={{ marginRight: '8px' }} />
            {selectedRider?.name}
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
      </div>

      {/* Horse Selection */}
      <div className="form-group">
        <label htmlFor="horse_id" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          Cheval <span className="required">*</span>
          {isHorseLocked && (
            <InfoTooltip
              message="Le cheval ne peut pas être modifié. Pour changer de cheval, veuillez terminer cette pension et en créer une nouvelle avec le cheval souhaité."
              position="right"
            />
          )}
        </label>
        {isHorseLocked ? (
          <div className="form-input-static">
            <Icons.Horse style={{ marginRight: '8px' }} />
            {selectedHorse?.name}
            <span className={`badge badge-${selectedHorse?.kind}`} style={{ marginLeft: '8px' }}>
              {selectedHorse?.kind === 'horse' ? 'Cheval' : 'Poney'}
            </span>
          </div>
        ) : availableHorses.length === 0 ? (
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
  isEdit: PropTypes.bool,
};

export default PairingSelectionFields;
