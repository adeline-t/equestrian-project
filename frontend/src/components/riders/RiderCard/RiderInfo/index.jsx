import React from 'react';
import PropTypes from 'prop-types';
import { Icons } from '../../../lib/libraries/icons.jsx';
import { isActive } from '../../../lib/helpers/filters/activityFilters.js';
import '../../../styles/common/badges.css';

function RiderInfo({ rider }) {
  const getStatusBadge = (startDate, endDate) => {
    const active = isActive(startDate, endDate);
    return (
      <span className={`badge ${active ? 'badge-success' : 'badge-secondary'}`}>
        {active ? 'Actif' : 'Inactif'}
      </span>
    );
  };

  return (
    <div className="rider-info-section mb-30">
      <h3>
        <Icons.Info style={{ marginRight: '8px' }} />
        Informations
      </h3>
      <div className="info-grid">
        <div className="info-item">
          <span className="info-label">
            <Icons.Email style={{ marginRight: '4px' }} />
            Email:
          </span>
          <span className="info-value">{rider.email || '-'}</span>
        </div>
        <div className="info-item">
          <span className="info-label">
            <Icons.Phone style={{ marginRight: '4px' }} />
            Téléphone:
          </span>
          <span className="info-value">{rider.phone || '-'}</span>
        </div>
      </div>
      <div className="date-status-row" style={{ marginTop: '15px' }}>
        <div className="date-status-item">
          <span className="info-label">
            <Icons.Calendar style={{ marginRight: '4px' }} />
            Début:
          </span>
          <span className="info-value"></span>
        </div>
        <div className="date-status-item">
          <span className="info-label">
            <Icons.Calendar style={{ marginRight: '4px' }} />
            Fin:
          </span>
          <span className="info-value"></span>
        </div>
        <div className="date-status-item">
          <span className="info-label">Statut:</span>
          {getStatusBadge(rider.activity_start_date, rider.activity_end_date)}
        </div>
      </div>
    </div>
  );
}

RiderInfo.propTypes = {
  rider: PropTypes.shape({
    email: PropTypes.string,
    phone: PropTypes.string,
    activity_start_date: PropTypes.string,
    activity_end_date: PropTypes.string,
  }).isRequired,
};

export default RiderInfo;
