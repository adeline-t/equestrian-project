import { useCreateEvent } from '../../../hooks/useCreateEvent';
import { Icons } from '../../../lib/icons.jsx';
import '../../../styles/components/events.css';
import Modal from '../../common/Modal.jsx';
import EventForm from './EventForm.jsx';
import ParticipantsForm from './ParticipantsForm.jsx';

function CreateEventModal({ onClose, onSuccess, initialDate, initialStartTime, initialEndTime }) {
  const eventForm = useCreateEvent();
  const {
    formData,
    loading,
    error,
    createEvent,
    participants,
    addParticipant,
    removeParticipant,
    updateParticipant,
  } = eventForm;

  const handleSubmit = async () => {
    const result = await createEvent();
    if (result?.success) {
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
          <Icons.Add className="create-event-modal-icon" />
          Créer un événement
        </span>
      }
      size="large"
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
            className="create-event-btn create-event-btn-primary"
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
                <Icons.Check className="create-event-btn-icon" />
                Créer
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

      <EventForm
        {...eventForm}
        initialDate={initialDate}
        initialStartTime={initialStartTime}
        initialEndTime={initialEndTime}
      />

      <div className="create-event-section">
        <h2 className="create-event-section-title">Participants</h2>
        <ParticipantsForm
          participants={participants}
          addParticipant={addParticipant}
          removeParticipant={removeParticipant}
          updateParticipant={updateParticipant}
        />
      </div>
    </Modal>
  );
}

export default CreateEventModal;
