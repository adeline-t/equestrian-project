import React from 'react';
import { Icons } from '../../lib/libraries/icons.jsx';

const PackagesTable = ({
  packages,
  onEdit,
  onDelete,
  formatDate,
  getStatusBadge,
  getRiderName,
}) => {
  if (packages.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">
          <Icons.Packages style={{ fontSize: '48px' }} />
        </div>
        <h3>Aucun forfait trouvé</h3>
        <p>Commencez par ajouter votre premier forfait</p>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Cavalier</th>
            <th>Type</th>
            <th>Cours particuliers</th>
            <th>Prestations</th>
            <th>Date de début</th>
            <th>Date de fin</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {packages.map((pkg) => (
            <tr key={pkg.id}>
              <td>
                <span className="badge badge-info">#{pkg.id}</span>
              </td>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Icons.User style={{ fontSize: '0.875rem', color: '#4299e1' }} />
                  {getRiderName(pkg.rider_id)}
                </div>
              </td>
              <td>{pkg.type || 'Standard'}</td>
              <td>
                <span className="lesson-badge">{pkg.private_lesson_count || 0}</span>
              </td>
              <td>
                <span className="lesson-badge">{pkg.joint_lesson_count || 0}</span>
              </td>
              <td>{formatDate(pkg.activity_start_date)}</td>
              <td>{formatDate(pkg.activity_end_date)}</td>
              <td>
                <span
                  className={`badge ${
                    getStatusBadge(pkg.activity_start_date, pkg.activity_end_date) === 'Actif'
                      ? 'badge-success'
                      : 'badge-secondary'
                  }`}
                >
                  {getStatusBadge(pkg.activity_start_date, pkg.activity_end_date)}
                </span>
              </td>
              <td className="actions">
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => onEdit(pkg)}
                  title="Modifier"
                >
                  <Icons.Edit /> Modifier
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => onDelete(pkg)}
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

export default PackagesTable;
