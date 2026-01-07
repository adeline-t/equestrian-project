import React from 'react';
import PropTypes from 'prop-types';
import { Icons } from '../../../lib/icons';
import { isActive } from '../../../lib/helpers/shared/filters';
import { getHorseKindLabel } from '../../../lib/domains/horses/kinds';
import '../../../styles/common/badges.css';
import '../../../styles/common/buttons.css';

function HorsesTable({ horses, onEdit, onDelete, onRidersClick }) {
  const getStatusBadge = (startDate, endDate) => {
    const active = isActive(startDate, endDate);
    return (
      <span className={`badge ${active ? 'badge-success' : 'badge-secondary'}`}>
        {active ? 'Actif' : 'Inactif'}
      </span>
    );
  };

  const getOwnershipLabel = (ownership) => {
    return `${ownership}`;
  };

  return (
    <div className="table-responsive">
      <table className="table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Type</th>
            <th>Propriétaire</th>
            <th>Cavaliers Actifs</th>
            <th>Début d'activité</th>
            <th>Fin d'activité</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {horses.map((horse) => (
            <tr key={horse.id}>
              <td>
                <strong>{horse.name}</strong>
              </td>
              <td>
                <span className={`badge badge-${horse.kind}`}>
                  {getHorseKindLabel(horse.kind) || horse.kind}
                </span>
              </td>
              <td>
                <span className="badge badge-info">{getOwnershipLabel(horse.is_owned_by)}</span>
              </td>
              <td>
                <span
                  className={`badge badge-info ${horse.active_riders_count > 0 ? 'clickable' : ''}`}
                  onClick={() => onRidersClick(horse)}
                  style={{
                    cursor: horse.active_riders_count > 0 ? 'pointer' : 'default',
                    userSelect: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                  title={horse.active_riders_count > 0 ? 'Cliquez pour voir les cavaliers' : ''}
                >
                  <Icons.Users style={{ fontSize: '0.875rem' }} />
                  {horse.active_riders_count || 0}
                </span>
              </td>
              <td>{horse.activity_start_date || '-'}</td>
              <td>{horse.activity_end_date || '-'}</td>
              <td>{getStatusBadge(horse.activity_start_date, horse.activity_end_date)}</td>
              <td className="actions">
                <button className="btn btn-secondary btn-sm" onClick={() => onEdit(horse)}>
                  <Icons.Edit /> Modifier
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => onDelete(horse)}>
                  <Icons.Delete /> Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

HorsesTable.propTypes = {
  horses: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      kind: PropTypes.string,
      is_owned_by: PropTypes.string,
      active_riders_count: PropTypes.number,
      activity_start_date: PropTypes.string,
      activity_end_date: PropTypes.string,
    })
  ).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onRidersClick: PropTypes.func.isRequired,
};

export default HorsesTable;
