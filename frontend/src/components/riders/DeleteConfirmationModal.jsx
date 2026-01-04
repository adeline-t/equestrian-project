import React from 'react';
import { Icons } from '../../utils/icons';
import * as commonStyles from '../../styles/common/common.module.css';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, riderName }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1000 }}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
        <div className="modal-header">
          <h3>
            <Icons.Warning style={{ marginRight: '8px', color: '#ed8936' }} />
            Confirmer la suppression
          </h3>
          <button className="modal-close" onClick={onClose}>
            <Icons.Close />
          </button>
        </div>
        
        <div style={{ padding: '20px' }}>
          <p style={{ marginBottom: '20px', color: '#4a5568' }}>
            Êtes-vous sûr de vouloir supprimer {riderName} ?
          </p>
          <p style={{ marginBottom: '20px', color: '#718096', fontSize: '0.9rem' }}>
            Cette action est irréversible et supprimera définitivement le cavalier et toutes ses données associées.
          </p>

          <div style={{ marginBottom: '20px' }}>
            <button
              className="btn btn-danger"
              onClick={onConfirm}
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
              <Icons.Cancel style={{ marginRight: '8px' }} />
              Annuler
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;