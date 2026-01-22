import React from 'react';
import PropTypes from 'prop-types';
import Modal from './Modal.jsx';
import { Icons } from '../../lib/icons';
import '../../styles/app.css';

/**
 * Unified Delete Confirmation Modal Component
 * Handles different item types with consistent UI using common Modal
 */
function DeleteConfirmationModal({
  isOpen,
  onClose,
  onRemoveFromInventory,
  onPermanentDelete,
  itemType = 'forfait',
  itemName,
}) {
  const labels = {
    cavalier: {
      title: 'Que faire avec ce cavalier ?',
      removeText: "Retirer de l'inventaire",
      removeDescription:
        "Le cavalier restera dans la base de données mais sera marqué comme inactif. La date de fin d'activité sera définie à aujourd'hui.",
      deleteDescription:
        'Le cavalier sera supprimé de la base de données de manière permanente. Cette action ne peut pas être annulée.',
    },
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
        'Les données de la pension seront supprimées de la base de données de manière permanente. Cette action ne peut pas être annulée.',
    },
    cheval: {
      title: itemName ? `Que faire avec ${itemName} ?` : 'Que faire avec ce cheval ?',
      removeText: "Retirer de l'inventaire",
      removeDescription:
        "Le cheval restera dans la base de données mais sera marqué comme inactif. La date de fin d'activité sera définie à aujourd'hui.",
      deleteDescription:
        'Le cheval sera supprimé de la base de données de manière permanente. Cette action ne peut pas être annulée.',
    },
  };

  const label = labels[itemType] || labels.forfait;

  const footer = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div>
        <h4
          style={{
            margin: '0 0 8px 0',
            color: 'var(--color-gray-800)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Icons.Remove style={{ flexShrink: 0 }} />
          {label.removeText}
        </h4>
        <p style={{ margin: '0 0 12px 0', color: 'var(--color-gray-500)', fontSize: '0.9rem' }}>
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

      <div style={{ borderTop: '1px solid var(--color-gray-200)', paddingTop: '12px' }}>
        <h4
          style={{
            margin: '0 0 8px 0',
            color: 'var(--color-gray-800)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Icons.Delete style={{ flexShrink: 0 }} />
          Supprimer définitivement
        </h4>
        <p style={{ margin: '0 0 12px 0', color: 'var(--color-gray-500)', fontSize: '0.9rem' }}>
          {label.deleteDescription}
        </p>
        <button className="btn btn-danger" onClick={onPermanentDelete} style={{ width: '100%' }}>
          <Icons.Delete style={{ marginRight: '8px' }} />
          Supprimer définitivement
        </button>
      </div>

      <button className="btn btn-secondary" onClick={onClose} style={{ width: '100%' }}>
        <Icons.Cancel style={{ marginRight: '8px' }} />
        Annuler
      </button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Icons.Warning style={{ color: 'var(--color-warning-orange)', flexShrink: 0 }} />
          {label.title}
        </div>
      }
      footer={footer}
      size="small"
    >
      <p style={{ marginBottom: '20px', color: 'var(--color-gray-650)' }}>
        Choisissez l'action à effectuer :
      </p>
    </Modal>
  );
}

DeleteConfirmationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onRemoveFromInventory: PropTypes.func.isRequired,
  onPermanentDelete: PropTypes.func.isRequired,
  itemType: PropTypes.oneOf(['forfait', 'pension', 'cheval', 'cavalier']),
  itemName: PropTypes.string,
};

export default DeleteConfirmationModal;
