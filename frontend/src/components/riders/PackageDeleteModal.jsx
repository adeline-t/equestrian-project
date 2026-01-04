import React from 'react';
import { Icons } from '../../utils/icons';

const PackageDeleteModal = ({ 
  isOpen, 
  onClose, 
  packageName, 
  onRemoveFromInventory, 
  onPermanentDelete 
}) => {
  if (!isOpen) return null;

  return (
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
            Que faire avec ce forfait ?
          </h3>
          <button className="modal-close" onClick={onClose}>
            <Icons.Close />
          </button>
        </div>
        
        <div style={{ padding: '20px' }}>
          <p style={{ marginBottom: '20px', color: '#4a5568' }}>
            Choisissez l'action à effectuer :
          </p>

          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ margin: '0 0 8px 0', color: '#2d3748' }}>
              <Icons.Remove style={{ marginRight: '8px' }} />
              Retirer de l'inventaire
            </h4>
            <p style={{ margin: '0 0 12px 0', color: '#718096', fontSize: '0.9rem' }}>
              Le forfait restera dans la base de données mais sera marqué comme inactif. La
              date de fin d'activité sera définie à aujourd'hui.
            </p>
            <button
              className="btn btn-warning"
              onClick={onRemoveFromInventory}
              style={{ width: '100%' }}
            >
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
              Le forfait sera supprimé de la base de données de manière permanente. Cette action
              ne peut pas être annulée.
            </p>
            <button
              className="btn btn-danger"
              onClick={onPermanentDelete}
              style={{ width: '100%' }}
            >
              <Icons.Delete style={{ marginRight: '8px' }} />
              Supprimer définitivement
            </button>
          </div>

          <div style={{ marginTop: '20px' }}>
            <button
              className="btn btn-secondary"
              onClick={onClose}
              style={{ width: '100%' }}
            >
              <Icons.Cancel style={{ marginRight: '4px' }} />
              Annuler
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageDeleteModal;