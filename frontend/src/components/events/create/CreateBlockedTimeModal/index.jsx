import { useCreateBlockedTime } from '../../../../hooks/useCreateBlockedTime.js';
import { Icons } from '../../../../lib/icons.jsx';
import '../../../../styles/components/events.css';
import Modal from '../../../common/Modal.jsx';
import BlockedTimeForm from './BlockedTimeForm.jsx';

function CreateBlockedTimeModal({ onClose, onSuccess, initialDate }) {
  const { loading, error, createBlockedTime } = useCreateBlockedTime();

  const handleSubmit = async () => {
    const result = await createBlockedTime();
    if (result.success) {
      onSuccess?.();
      onClose();
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={
        <span className="create-event-modal-title">
          <Icons.Blocked className="create-event-modal-icon" />
          Bloquer une période
        </span>
      }
      size="medium"
      footer={
        <div className="create-event-modal-footer">
          <button
            type="button"
            className="create-event-btn create-event-btn-secondary"
            onClick={onClose}
            disabled={loading}
          >
            <Icons.Cancel className="create-event-btn-icon" />
            Annuler
          </button>
          <button
            type="button"
            className="create-event-btn create-event-btn-danger"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <>
                <Icons.Loading className="create-event-spin create-event-btn-icon" />
                Création...
              </>
            ) : (
              <>
                <Icons.Add className="create-event-btn-icon" />
                Bloquer
              </>
            )}
          </button>
        </div>
      }
    >
      {error && (
        <div className="create-event-alert create-event-alert-error">
          <Icons.Warning className="create-event-alert-icon" />
          {error}
        </div>
      )}

      <div className="create-event-alert create-event-alert-warning">
        <Icons.Info className="create-event-alert-icon" />
        Cette période sera bloquée et aucun cours ne pourra être créé pendant ce créneau.
      </div>

      <BlockedTimeForm initialDate={initialDate} />
    </Modal>
  );
}

export default CreateBlockedTimeModal;
