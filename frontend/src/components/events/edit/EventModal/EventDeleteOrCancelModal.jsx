import { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from '../../../common/Modal';
import { Icons } from '../../../../lib/icons';

export default function EventDeleteOrCancelModal({
  isOpen,
  onClose,
  onCancel,
  onDelete,
  eventName,
  loading = false,
}) {
  const [mode, setMode] = useState('cancel'); // 'cancel' | 'delete'
  const [reason, setReason] = useState('');

  const canSubmitCancel = reason.trim().length > 0;

  const handleConfirm = async () => {
    if (mode === 'cancel') {
      await onCancel(reason);
    } else {
      await onDelete();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Icons.Warning />
          {eventName ? `Gestion de "${eventName}"` : "Gestion de l'événement"}
        </div>
      }
    >
      {/* Segmented control */}
      <div className="segmented-control mb-16">
        <button
          className={`segment ${mode === 'cancel' ? 'active' : ''}`}
          onClick={() => setMode('cancel')}
        >
          Annuler
        </button>
        <button
          className={`segment danger ${mode === 'delete' ? 'active' : ''}`}
          onClick={() => setMode('delete')}
        >
          Supprimer
        </button>
      </div>

      {/* Annulation */}
      {mode === 'cancel' && (
        <>
          <p className="text-muted mb-8">
            L’événement sera annulé mais restera visible dans l’historique.
          </p>

          <label className="form-label">Raison de l’annulation</label>
          <textarea
            className="form-textarea"
            placeholder="Ex : Météo défavorable, indisponibilité de l’enseignant…"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
          />
        </>
      )}

      {/* Suppression */}
      {mode === 'delete' && (
        <p className="text-danger">
          Cette action supprimera définitivement l’événement et toutes ses données.
          <strong> Elle est irréversible.</strong>
        </p>
      )}

      {/* Actions */}
      <div className="modal-footer">
        <button className="btn btn-secondary" onClick={onClose} disabled={loading}>
          Annuler
        </button>

        <button
          className={`btn ${mode === 'delete' ? 'btn-danger' : 'btn-warning'}`}
          onClick={handleConfirm}
          disabled={loading || (mode === 'cancel' && !canSubmitCancel)}
        >
          {mode === 'delete' ? 'Supprimer définitivement' : 'Confirmer l’annulation'}
        </button>
      </div>
    </Modal>
  );
}

EventDeleteOrCancelModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  eventName: PropTypes.string,
  loading: PropTypes.bool,
};
