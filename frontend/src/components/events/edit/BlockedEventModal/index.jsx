import { useState } from 'react';
import Modal from '../../../common/Modal';
import { Icons } from '../../../../lib/icons';
import { useEventBlockedEdit } from '../../../../hooks/useEventBlockedEdit';
import BlockedEventForm from './BlockedEventForm';
import BlockedEventDisplay from './BlockedEventDisplay';
import '../../../../styles/features/events/event-modal.css';

function BlockedEventModal({ slotId, onClose, onUpdate }) {
  const {
    slot,
    event,
    loading,
    error,
    isEditing,
    editError,
    saving,
    deleting,
    deleteError,
    startEdit,
    cancelEdit,
    saveEdit,
    deleteSlot,
    handleChange,
    editData,
  } = useEventBlockedEdit(slotId);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = async () => {
    const success = await deleteSlot();
    if (success) {
      if (onUpdate) onUpdate();
      onClose();
    }
  };

  if (loading) {
    return (
      <Modal isOpen onClose={onClose} title="Chargement" size="md">
        <div className="modal-loading">
          <Icons.Loading className="spin" />
          <p>Chargement des détails...</p>
        </div>
      </Modal>
    );
  }

  if (error || !slot) {
    return (
      <Modal
        isOpen
        onClose={onClose}
        title={
          <div className="modal-title-danger">
            <Icons.Warning /> Erreur
          </div>
        }
        footer={
          <button className="btn btn-secondary" onClick={onClose}>
            <Icons.Close /> Fermer
          </button>
        }
        size="md"
      >
        <p>{error || 'Erreur lors du chargement'}</p>
      </Modal>
    );
  }

  // Delete confirmation modal
  if (showDeleteConfirm) {
    return (
      <Modal
        isOpen
        onClose={() => setShowDeleteConfirm(false)}
        title={
          <div className="modal-title-danger">
            <Icons.Warning /> Confirmer la suppression
          </div>
        }
        footer={
          <>
            <button
              className="btn btn-secondary"
              onClick={() => setShowDeleteConfirm(false)}
              disabled={deleting}
            >
              <Icons.Cancel /> Annuler
            </button>
            <button className="btn btn-danger" onClick={handleDelete} disabled={deleting}>
              {deleting ? (
                <>
                  <Icons.Loading className="spin" /> Suppression...
                </>
              ) : (
                <>
                  <Icons.Delete /> Supprimer
                </>
              )}
            </button>
          </>
        }
        size="sm"
      >
        {deleteError && (
          <div className="alert alert-error mb-16">
            <Icons.Warning /> {deleteError}
          </div>
        )}
        <p>Êtes-vous sûr de vouloir supprimer cette période bloquée ?</p>
        <p className="text-danger mt-12">Cette action est irréversible.</p>
      </Modal>
    );
  }

  const modalFooter = (
    <div className="modal-footer-split">
      {/* Left side - Delete button */}
      <button
        className="btn btn-danger"
        onClick={() => setShowDeleteConfirm(true)}
        disabled={saving || deleting}
      >
        <Icons.Delete /> Supprimer
      </button>

      {/* Right side - Edit/Save buttons */}
      <div className="modal-footer-actions">
        {isEditing ? (
          <>
            <button className="btn btn-secondary" onClick={cancelEdit} disabled={saving}>
              <Icons.Cancel /> Annuler
            </button>
            <button className="btn btn-primary" onClick={saveEdit} disabled={saving}>
              {saving ? (
                <>
                  <Icons.Loading className="spin" /> Sauvegarde...
                </>
              ) : (
                <>
                  <Icons.Check /> Sauvegarder
                </>
              )}
            </button>
          </>
        ) : (
          <button className="btn btn-primary" onClick={startEdit}>
            <Icons.Edit /> Modifier
          </button>
        )}
      </div>
    </div>
  );

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={
        <div className="modal-title-with-icon">
          <Icons.Blocked /> Période bloquée
        </div>
      }
      footer={modalFooter}
      size="md"
    >
      {editError && (
        <div className="alert alert-error">
          <Icons.Warning /> {editError}
        </div>
      )}
      {isEditing ? (
        <BlockedEventForm editData={editData} handleChange={handleChange} />
      ) : (
        <BlockedEventDisplay slot={slot} event={event} />
      )}
    </Modal>
  );
}

export default BlockedEventModal;
