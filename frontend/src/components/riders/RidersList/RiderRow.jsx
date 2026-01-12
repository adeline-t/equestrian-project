import { useState } from 'react';
import PropTypes from 'prop-types';
import { Icons } from '../../../lib/icons';
import { getRiderKindLabel, getRiderKindConfig } from '../../../lib/domains/riders/kinds';

const RiderRow = ({ rider, onViewDetails, onEdit, onDelete, getStatusBadge }) => {
  const [showMenu, setShowMenu] = useState(false);
  const statusLabel = getStatusBadge(rider);
  const statusClass = statusLabel === 'Actif' ? 'badge-success' : 'badge-secondary';
  const kindConfig = getRiderKindConfig(rider.kind);

  const handleRowClick = () => {
    // Only trigger on desktop (mobile uses menu)
    if (window.innerWidth > 768) {
      onViewDetails(rider.id);
    }
  };

  return (
    <>
      <tr className="rider-row" onClick={handleRowClick}>
        <td>
          <strong>{rider.name}</strong>
        </td>
        <td>
          <span
            className="badge badge-kind"
            data-kind={rider.kind}
            style={{
              '--kind-color': kindConfig?.color,
              '--kind-gradient': kindConfig?.gradient,
            }}
          >
            {getRiderKindLabel(rider.kind)}
          </span>
        </td>
        <td>{rider.email || '-'}</td>
        <td>{rider.phone || '-'}</td>
        <td>
          <span className={`badge ${statusClass}`}>{statusLabel}</span>
        </td>
        <td className="table-actions" onClick={(e) => e.stopPropagation()}>
          {/* Desktop: Hover icons */}
          <div className="action-buttons action-buttons-desktop">
            <button
              className="btn-icon btn-icon-view"
              onClick={() => onViewDetails(rider.id)}
              title="Voir les détails"
            >
              <Icons.View />
            </button>
            <button
              className="btn-icon btn-icon-edit"
              onClick={() => onEdit(rider)}
              title="Modifier"
            >
              <Icons.Edit />
            </button>
            <button
              className="btn-icon btn-icon-delete"
              onClick={() => onDelete(rider)}
              title="Supprimer"
            >
              <Icons.Delete />
            </button>
          </div>

          {/* Mobile: Menu button */}
          <div className="action-buttons action-buttons-mobile">
            <button
              className="btn-icon btn-menu"
              onClick={() => setShowMenu(!showMenu)}
              title="Actions"
            >
              <Icons.Settings />
            </button>
          </div>
        </td>
      </tr>

      {/* Mobile menu */}
      {showMenu && (
        <>
          <div className="menu-backdrop" onClick={() => setShowMenu(false)} />
          <div className="actions-menu-mobile">
            <button
              onClick={() => {
                onViewDetails(rider.id);
                setShowMenu(false);
              }}
            >
              <Icons.View /> Voir les détails
            </button>
            <button
              onClick={() => {
                onEdit(rider);
                setShowMenu(false);
              }}
            >
              <Icons.Edit /> Modifier
            </button>
            <button
              className="menu-delete"
              onClick={() => {
                onDelete(rider);
                setShowMenu(false);
              }}
            >
              <Icons.Delete /> Supprimer
            </button>
          </div>
        </>
      )}
    </>
  );
};

RiderRow.propTypes = {
  rider: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    kind: PropTypes.string.isRequired,
    email: PropTypes.string,
    phone: PropTypes.string,
  }).isRequired,
  onViewDetails: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  getStatusBadge: PropTypes.func.isRequired,
};

export default RiderRow;
