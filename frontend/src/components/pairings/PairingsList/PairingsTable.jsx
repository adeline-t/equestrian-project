import React from 'react';
import PropTypes from 'prop-types';
import { Icons } from '../../../lib/libraries/icons.jsx';
import { isActive } from '../../../lib/helpers/filters/activityFilters.js';
import { HORSE_KIND_LABELS } from '../../../constants/horses.js';
import '../../../styles/common/badges.css';
import '../../../styles/common/buttons.css';

function PairingsTable({ pairings, onEdit, onDelete }) {
  const getStatusBadge = (startDate, endDate) => {
    const active = isActive(startDate, endDate);
    return (
      <span className={`badge ${active ? 'badge-success' : 'badge-secondary'}`}>
        {active ? 'Actif' : 'Inactif'}
      </span>
    );
  };

  return (
    <div className="table-responsive">
      <table className="table">
        <thead>
          <tr>
            <th>Cavalier</th>
            <th>Cheval</th>
            <th>Type</th>
            <th>Début</th>
            <th>Fin</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {pairings.map((pairing) => (
            <tr key={pairing.id}>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {pairing.riders?.name || 'N/A'}
                </div>
              </td>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {pairing.horses?.name || 'N/A'}
                </div>
              </td>
              <td>
                <span className={`badge badge-${pairing.horses?.kind}`}>
                  {HORSE_KIND_LABELS[pairing.horses?.kind] || pairing.horses?.kind}
                </span>
              </td>
              <td>{pairing.pairing_start_date || '-'}</td>
              <td>{pairing.pairing_end_date || '-'}</td>
              <td>{getStatusBadge(pairing.pairing_start_date, pairing.pairing_end_date)}</td>
              <td className="actions">
                <button className="btn btn-secondary btn-sm" onClick={() => onEdit(pairing)}>
                  <Icons.Edit style={{ marginRight: '4px' }} />
                  Modifier
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => onDelete(pairing)}>
                  <Icons.Delete style={{ marginRight: '4px' }} />
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

PairingsTable.propTypes = {
  pairings: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      riders: PropTypes.shape({
        name: PropTypes.string,
      }),
      horses: PropTypes.shape({
        name: PropTypes.string,
        kind: PropTypes.string,
      }),
      pairing_start_date: PropTypes.string,
      pairing_end_date: PropTypes.string,
    })
  ).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default PairingsTable;
