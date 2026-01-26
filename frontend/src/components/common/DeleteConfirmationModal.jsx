import React from 'react';
import PropTypes from 'prop-types';
import Modal from './Modal.jsx';
import { Icons } from '../../lib/icons';
import '../../styles/common.css';

/**
 * Unified Delete Confirmation Modal Component
 * Handles different item types with consistent UI using common Modal
 */
function DeleteConfirmationModal({
  isOpen,
  allowSoftDelete = true,
  onClose,
  onRemoveFromInventory = null,
  onPermanentDelete,
  itemType = 'package',
  itemName,
}) {
  const titles = {
    rider: 'ce cavalier',
    package: 'ce forfait',
    pairing: 'cette pension',
    horse: itemName ? itemName : 'ce cheval',
    event: itemName ? `l’événement "${itemName}"` : 'cet événement',
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      title={
        <div className="modal-title">
          <Icons.Warning />
          Supprimer {titles[itemType]}
        </div>
      }
      footer={null}
    >
      {allowSoftDelete ? (
        <p className="modal-body">
          Souhaitez-vous <strong>retirer</strong> cet élément ou le
          <strong> supprimer définitivement</strong> ?
        </p>
      ) : (
        <p className="modal-body">
          Souhaitez-vous <strong> supprimer définitivement</strong> ?
        </p>
      )}

      <div className="modal-footer">
        {allowSoftDelete && onRemoveFromInventory && (
          <button className="btn btn-secondary" onClick={onRemoveFromInventory}>
            Retirer
          </button>
        )}

        <button className="btn btn-danger" onClick={onPermanentDelete}>
          Supprimer définitivement
        </button>

        <button className="btn btn-cancel" onClick={onClose}>
          Annuler
        </button>
      </div>
    </Modal>
  );
}
export default DeleteConfirmationModal;
