import React from 'react';
import PropTypes from 'prop-types';
import { Icons } from '../../../utils/icons';
import '../../../styles/common/modal.css';
import '../../../styles/common/buttons.css';

function DeleteConfirmationModal({
  isOpen,
  onClose,
  onRemoveFromInventory,
  onPermanentDelete,
  itemType = 'forfait',
  itemName,
}) {
  if (!isOpen) return null;

  const labels = {
    forfait: {
      title: 'Que faire avec ce forfait ?',
      removeText: "Retirer de l'inventaire",
      removeDescription:
        "Le forfait restera dans la base de données mais sera marqué comme inactif. La date de fin d'activité sera définie à aujourd'hui.",
      deleteDescription:
        'Le forfait sera supprimé de la base de données de manière permanente. Cette action ne peut pas être annulée.',
    },
    pension: {
      title: 'Que faire avec cette pension ?',
      removeText: "Retirer de l'inventaire",
      removeDescription:
        "La pension restera sauvegardée mais sera marquée comme inactive. La date de fin sera définie à aujourd'hui.",
      deleteDescription:
        'Les données de la pension seront supprimées de manière permanente. Cette action ne peut pas être annulée.',
    },
  };

  const label = labels[itemType] || labels.forfait;

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      style={{
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
            {label.title}
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
              {label.removeText}
            </h4>
            <p style={{ margin: '0 0 12px 0', color: '#718096', fontSize: '0.9rem' }}>
              {label.removeDescription}
            </p>
            <button
              className="btn btn-warning"
              onClick={onRemoveFromInventory}
              style={{ width: '100%' }}
            >
              <Icons.Remove style={{ marginRight: '8px' }} />
              {label.removeText}
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
              {label.deleteDescription}
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
              <Icons.Cancel style={{ marginRight: '8px' }} />
              Annuler
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

DeleteConfirmationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onRemoveFromInventory: PropTypes.func.isRequired,
  onPermanentDelete: PropTypes.func.isRequired,
  itemType: PropTypes.oneOf(['forfait', 'pension']),
  itemName: PropTypes.string,
};

export default DeleteConfirmationModal;