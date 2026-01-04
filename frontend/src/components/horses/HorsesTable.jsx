import React from 'react';
import { Icons } from '../../lib/libraries/icons';

const HorsesTable = ({ 
  horses, 
  onEdit, 
  onDelete, 
  onRidersClick, 
  formatDate, 
  getStatusBadge, 
  getKindLabel, 
  getOwnershipLabel 
}) => {
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
                  {getKindLabel(horse.kind)}
                </span>
              </td>
              <td>
                <span className="badge badge-info">
                  {getOwnershipLabel(horse.is_owned_by)}
                </span>
              </td>
              <td>
                <span
                  className={`badge badge-info ${
                    horse.active_riders_count > 0 ? 'clickable' : ''
                  }`}
                  onClick={() => handleRidersClick(horse)}
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
              <td>{formatDate(horse.activity_start_date)}</td>
              <td>{formatDate(horse.activity_end_date)}</td>
              <td>{getStatusBadge(horse.activity_start_date, horse.activity_end_date)}</td>
              <td className="actions">
                <button className="btn btn-secondary btn-sm" onClick={() => onEdit(horse)}>
                  <Icons.Edit /> Modifier
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => onDelete(horse)}
                >
                  <Icons.Delete /> Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HorsesTable;