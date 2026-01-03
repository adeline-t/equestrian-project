import React from 'react';
import PropTypes from 'prop-types';
import Portal from '../../../utils/Portal';
import { Icons } from '../../../utils/icons';
import '../../../styles/common/modal.css';
import '../../../styles/common/buttons.css';

function PairingDeleteModal({ isOpen, pairing, onClose, onRemove, onDelete }) {
  if (!isOpen || !pairing) return null;

  return (
    <Portal>
      <div
        className="modal-overlay"
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}
      >
        <div
          className="modal"
          onClick={(e) => e.stopPropagation()}
          style={{
            maxWidth: '500px',
          }}
        >
          <div className="modal-header">
            <h3>
              <Icons.Warning style={{ marginRight: '8px', color: '#ed8936' }} />
              Que faire avec cette pension ?
            </h3>
            <button className="modal-close" onClick={onClose}>
              <Icons.Close />
            </button>
          </div>
          <div style={{ padding: '20px' }}>
            <p style={{ marginBottom: '20px', color: '#4a5568' }}>
              Pension de <strong>{pairing.riders?.name || 'cavalier'}</strong> sur{' '}
              <strong>{pairing.horses?.name || 'cheval'}</strong>
            </p>
            <p style={{ marginBottom: '20px', color: '#4a5568' }}>
              Choisissez l'action à effectuer :
            </p>

            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ margin: '0 0 8px 0', color: '#2d3748' }}>
                <Icons.Remove style={{ marginRight: '8px' }} />
                Retirer de l'inventaire
              </h4>
              <p style={{ margin: '0 0 12px 0', color: '#718096', fontSize: '0.9rem' }}>
                La pension restera dans la base de données mais sera marquée comme inactive. La
                date de fin sera définie à aujourd'hui.
              </p>
              <button className="btn btn-warning" onClick={onRemove} style={{ width: '100%' }}>
                <Icons.Remove style={{ marginRight: '8px' }} />
                Retirer de l'inventaire
              </button>
            </div>

            <div
              style={{
                borderTop: '1px solid #e2e8f0',
                paddingTop: '20px',
                marginTop: '20px',
              }}
            >
              <h4 style={{ margin: '0 0 8px 0', color: '#2d3748' }}>
                <Icons.Delete style={{ marginRight: '8px' }} />
                Supprimer définitivement
              </h4>
              <p style={{ margin: '0 0 12px 0', color: '#718096', fontSize: '0.9rem' }}>
                La pension sera supprimée de la base de données de manière permanente. Cette action
                ne peut pas être annulée.
              </p>
              <button className="btn btn-danger" onClick={onDelete} style={{ width: '100%' }}>
                <Icons.Delete style={{ marginRight: '8px' }} />
                Supprimer définitivement
              </button>
            </div>

            <div style={{ marginTop: '20px' }}>
              <button className="btn btn-secondary" onClick={onClose} style={{ width: '100%' }}>
                <Icons.Cancel style={{ marginRight: '8px' }} />
                Annuler
              </button>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
}

PairingDeleteModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  pairing: PropTypes.shape({
    riders: PropTypes.shape({
      name: PropTypes.string,
    }),
    horses: PropTypes.shape({
      name: PropTypes.string,
    }),
  }),
  onClose: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default PairingDeleteModal;