import { useState } from 'react';
import Modal from '../../../common/Modal';
import { Icons } from '../../../../lib/icons';
import { useEventBlockedEdit } from '../../../../hooks/useEventBlockedEdit';
import BlockedEventForm from './BlockedEventForm';
import BlockedEventDisplay from './BlockedEventDisplay';
import DeleteConfirmationModal from '../../../common/DeleteConfirmationModal';

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
          <div className="modal-title-error">
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
        <div className="alert alert-error">
          <Icons.Warning />
          <p>{error || 'Erreur lors du chargement'}</p>
        </div>
      </Modal>
    );
  }

  return (
    <>
      <Modal
        isOpen
        onClose={onClose}
        title={
          <div className="modal-title">
            <Icons.Blocked /> Période bloquée
            {!isEditing && (
              <div className="header-actions-group">
                <button
                  className="btn-icon-modern"
                  onClick={startEdit}
                  title="Modifier l'événement"
                >
                  <Icons.Edit />
                </button>
                <button
                  className="btn-icon-modern danger"
                  onClick={() => setShowDeleteConfirm(true)}
                  title="Supprimer l'événement"
                >
                  <Icons.Delete />
                </button>
              </div>
            )}
          </div>
        }
        footer={
          isEditing && (
            <div className="modal-footer">
              {/* Left side - Delete button */}
              <button
                className="btn btn-danger"
                onClick={() => setShowDeleteConfirm(true)}
                disabled={saving || deleting}
              >
                <Icons.Delete /> Supprimer
              </button>

              {/* Right side - Edit/Save buttons */}
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
            </div>
          )
        }
        size="lg"
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

      <DeleteConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)} // ✅ CORRECTION ICI
        onPermanentDelete={handleDelete}
        itemType="event"
        itemName={event?.name}
        allowSoftDelete={false} // Pas besoin de soft delete pour les événements
      />
    </>
  );
}

export default BlockedEventModal;
