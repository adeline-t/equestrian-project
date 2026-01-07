import React from 'react';
import PropTypes from 'prop-types';
import { Icons } from '../../../lib/icons';
import '../../../styles/common/buttons.css';

function PairingsList({ pairings, onAdd, onEdit, onDelete }) {
  return (
    <div className="section section-minimal">
      <div className="flex-between mb-15">
        <h3>
          <Icons.Horse style={{ marginRight: '8px' }} />
          Pension ({pairings.length})
        </h3>
        <button className="btn btn-primary btn-icon" onClick={onAdd} title="Ajouter une pension">
          <Icons.Add />
        </button>
      </div>

      {pairings.length === 0 ? (
        <p style={{ color: '#718096', margin: '0', fontSize: '0.9rem' }}>Aucune pension active</p>
      ) : (
        <div className="pairings-list">
          {pairings.map((pairing) => (
            <div key={pairing.id} className="pairing-item">
              <div className="pairing-info">
                <Icons.Horse style={{ marginRight: '8px', color: '#4299e1' }} />
                <span className="pairing-horse-name">{pairing.horses?.name || 'N/A'}</span>
              </div>
              <div className="pairing-actions">
                <button
                  className="btn btn-sm btn-secondary"
                  onClick={() => onEdit(pairing)}
                  title="Modifier"
                >
                  <Icons.Edit />
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => onDelete(pairing)}
                  title="Supprimer"
                >
                  <Icons.Delete />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

PairingsList.propTypes = {
  pairings: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      horses: PropTypes.shape({
        name: PropTypes.string,
      }),
    })
  ).isRequired,
  onAdd: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default PairingsList;
