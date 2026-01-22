import { useCreateEvent } from '../../../../hooks/useCreateEvent.js';
import { useParticipantList } from '../../../../hooks/useParticipantList.js';
import { Icons } from '../../../../lib/icons.jsx';
import '../../../../styles/features/events.css';
import Modal from '../../../common/Modal.jsx';
import EventForm from './EventForm.jsx';
import ParticipantsForm from './ParticipantsForm.jsx';

function CreateEventModal({ onClose, onSuccess, initialDate, initialStartTime, initialEndTime }) {
  // Event form logic
  const eventForm = useCreateEvent(initialDate, initialStartTime, initialEndTime);
  const { formData, setFormData, handleFormChange, createEvent, loading, error } = eventForm;

  // Participants logic
  const participantList = useParticipantList();
  const { participants, addParticipant, removeParticipant, updateParticipant } = participantList;

  const handleSubmit = async () => {
    const result = await createEvent(participants);
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
        <div className="modal-title-with-icon">
          <Icons.Add />
          Créer un événement
        </div>
      }
      size="large"
      footer={
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
            <Icons.Cancel />
            Annuler
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <>
                <Icons.Loading className="spin" />
                Création...
              </>
            ) : (
              <>
                <Icons.Check />
                Créer
              </>
            )}
          </button>
        </div>
      }
    >
      {error && (
        <div className="alert alert-error">
          <Icons.Warning />
          {error}
        </div>
      )}

      <EventForm
        formData={formData}
        handleFormChange={handleFormChange}
        setFormData={setFormData}
      />

      <ParticipantsForm
        participants={participants}
        addParticipant={addParticipant}
        removeParticipant={removeParticipant}
        updateParticipant={updateParticipant}
      />
    </Modal>
  );
}

export default CreateEventModal;
