import React, { useState } from 'react';
import Modal from '../../../common/Modal';
import { Icons } from '../../../../lib/icons';
import { useBlockedEventEdit } from '../../../../hooks/useBlockedEventEdit';
import BlockedEventForm from './BlockedEventForm';
import BlockedEventDisplay from './BlockedEventDisplay';

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
  } = useBlockedEventEdit(slotId);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  console.log('[Modal] render', { slot, event, loading, error });

  const handleDelete = async () => {
    const success = await deleteSlot();
    if (success) {
      if (onUpdate) onUpdate();
      onClose();
    }
  };

  if (loading) {
    return (
      <Modal isOpen onClose={onClose} title="Chargement" size="medium">
        <div className="event-modal-loading-content">
          <Icons.Loading className="event-modal-spin" />
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
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: 'var(--color-danger)',
            }}
          >
            <Icons.Warning /> Erreur
          </div>
        }
        footer={
          <button className="event-modal-btn event-modal-btn-secondary" onClick={onClose}>
            <Icons.Close /> Fermer
          </button>
        }
        size="medium"
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
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: 'var(--color-danger)',
            }}
          >
            <Icons.Warning /> Confirmer la suppression
          </div>
        }
        footer={
          <>
            <button
              className="event-modal-btn event-modal-btn-secondary"
              onClick={() => setShowDeleteConfirm(false)}
              disabled={deleting}
            >
              <Icons.Cancel /> Annuler
            </button>
            <button
              className="event-modal-btn event-modal-btn-danger"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? (
                <>
                  <Icons.Loading className="event-modal-spin" /> Suppression...
                </>
              ) : (
                <>
                  <Icons.Delete /> Supprimer
                </>
              )}
            </button>
          </>
        }
        size="small"
      >
        {deleteError && (
          <div
            className="create-event-alert create-event-alert-error"
            style={{ marginBottom: '16px' }}
          >
            <Icons.Warning /> {deleteError}
          </div>
        )}
        <p>Êtes-vous sûr de vouloir supprimer cette période bloquée ?</p>
        <p style={{ marginTop: '12px', color: 'var(--color-danger-medium-dark)', fontWeight: 500 }}>
          Cette action est irréversible.
        </p>
      </Modal>
    );
  }

  const modalFooter = (
    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
      {/* Left side - Delete button */}
      <button
        className="event-modal-btn event-modal-btn-danger"
        onClick={() => setShowDeleteConfirm(true)}
        disabled={saving || deleting}
      >
        <Icons.Delete /> Supprimer
      </button>

      {/* Right side - Edit/Save buttons */}
      <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
        {isEditing ? (
          <>
            <button
              className="event-modal-btn event-modal-btn-secondary"
              onClick={cancelEdit}
              disabled={saving}
            >
              <Icons.Cancel /> Annuler
            </button>
            <button
              className="event-modal-btn event-modal-btn-primary"
              onClick={saveEdit}
              disabled={saving}
            >
              {saving ? (
                <>
                  <Icons.Loading className="event-modal-spin" /> Sauvegarde...
                </>
              ) : (
                <>
                  <Icons.Check /> Sauvegarder
                </>
              )}
            </button>
          </>
        ) : (
          <button className="event-modal-btn event-modal-btn-primary" onClick={startEdit}>
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Icons.Blocked /> Période bloquée
        </div>
      }
      footer={modalFooter}
      size="medium"
    >
      {editError && (
        <div className="create-event-alert create-event-alert-error">
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
