import React from 'react';
import { Icons } from '../../lib/libraries/icons';

const RidersTable = ({ 
  riders, 
  onViewDetails, 
  onEdit, 
  onDelete, 
  formatDate, 
  getStatusBadge 
}) => {
  if (riders.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">
          <Icons.User style={{ fontSize: '48px' }} />
        </div>
        <h3>Aucun cavalier trouvé</h3>
        <p>Commencez par ajouter votre premier cavalier</p>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Email</th>
            <th>Téléphone</th>
            <th>Début d'activité</th>
            <th>Fin d'activité</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {riders.map((rider) => (
            <tr key={rider.id}>
              <td>
                <strong>{rider.name}</strong>
              </td>
              <td>{rider.email || '-'}</td>
              <td>{rider.phone || '-'}</td>
              <td>{formatDate(rider.activity_start_date)}</td>
              <td>{formatDate(rider.activity_end_date)}</td>
              <td>
                <span className={`badge ${getStatusBadge(rider.activity_start_date, rider.activity_end_date) === 'Actif' ? 'badge-success' : 'badge-secondary'}`}>
                  {getStatusBadge(rider.activity_start_date, rider.activity_end_date)}
                </span>
              </td>
              <td className="actions">
                <button 
                  className="btn btn-info btn-sm" 
                  onClick={() => onViewDetails(rider.id)}
                  title="Voir les détails"
                >
                  <Icons.View /> Détails
                </button>
                <button 
                  className="btn btn-secondary btn-sm" 
                  onClick={() => onEdit(rider)}
                  title="Modifier"
                >
                  <Icons.Edit /> Modifier
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => onDelete(rider)}
                  title="Supprimer"
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

export default RidersTable;