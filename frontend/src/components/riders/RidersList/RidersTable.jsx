import { Icons } from '../../../lib/icons';
import { getRiderKindLabel, getRiderKindBadgeClass } from '../../../lib/domains/riders/kinds';

const RidersTable = ({ riders, onViewDetails, onEdit, onDelete, getStatusBadge }) => {
  if (!riders.length) {
    return (
      <div className="empty-state">
        <Icons.User style={{ fontSize: '48px' }} />
        <h3>Aucun cavalier trouvé</h3>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Type</th>
            <th>Email</th>
            <th>Téléphone</th>
            <th>Début</th>
            <th>Fin</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {riders.map((rider) => {
            const statusLabel = getStatusBadge(rider);
            const statusClass = statusLabel === 'Actif' ? 'badge-success' : 'badge-secondary';

            return (
              <tr key={rider.id}>
                <td>
                  <strong>{rider.name}</strong>
                </td>

                <td>
                  <span className={`badge ${getRiderKindBadgeClass(rider.kind)}`}>
                    {getRiderKindLabel(rider.kind)}
                  </span>
                </td>

                <td>{rider.email || '-'}</td>
                <td>{rider.phone || '-'}</td>
                <td>{rider.activity_start_date || '-'}</td>
                <td>{rider.activity_end_date || '-'}</td>

                <td>
                  <span className={`badge ${statusClass}`}>{statusLabel}</span>
                </td>

                <td className="table-actions">
                  <button onClick={() => onViewDetails(rider.id)}>
                    <Icons.View /> Détails
                  </button>
                  <button onClick={() => onEdit(rider)}>
                    <Icons.Edit /> Modifier
                  </button>
                  <button onClick={() => onDelete(rider)}>
                    <Icons.Delete /> Supprimer
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default RidersTable;
