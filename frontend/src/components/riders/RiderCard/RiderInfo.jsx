import React from 'react';
import PropTypes from 'prop-types';
import { Icons } from '../../../lib/icons';
import { isActive } from '../../../lib/helpers/shared/filters';
import { getRiderKindLabel } from '../../../lib/domains/riders/kinds';
import '../../../styles/common/badges.css';

function RiderInfo({ rider }) {
  const getStatusBadge = (start, end) => (
    <span className={`badge ${isActive(start, end) ? 'badge-success' : 'badge-secondary'}`}>
      {isActive(start, end) ? 'Actif' : 'Inactif'}
    </span>
  );

  return (
    <div className="rider-info-section mb-30">
      <h3>
        <Icons.Info style={{ marginRight: '8px' }} /> Informations
      </h3>
      <div className="info-grid">
        <div className="info-item">
          <span className="info-label">Email:</span>
          <span className="info-value">{rider.email || '-'}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Téléphone:</span>
          <span className="info-value">{rider.phone || '-'}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Type:</span>
          <span className={`badge badge-${rider.kind}`}>{getRiderKindLabel(rider.kind)}</span>
        </div>
      </div>
      <div className="date-status-row" style={{ marginTop: '15px' }}>
        <div className="date-status-item">
          <span className="info-label">Début:</span>
          <span className="info-value">{rider.activity_start_date || '-'}</span>
        </div>
        <div className="date-status-item">
          <span className="info-label">Fin:</span>
          <span className="info-value">{rider.activity_end_date || '-'}</span>
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
    kind: PropTypes.oneOf(['owner', 'club', 'boarder']),
    activity_start_date: PropTypes.string,
    activity_end_date: PropTypes.string,
  }).isRequired,
};

export default RiderInfo;
