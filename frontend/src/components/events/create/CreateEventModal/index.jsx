import { useEventCreate } from '../../../../hooks/useEventCreate.js';
import { useParticipantList } from '../../../../hooks/useParticipantList.js';
import { Icons } from '../../../../lib/icons.jsx';
import Modal from '../../../common/Modal.jsx';
import EventForm from './EventForm.jsx';
import ParticipantsForm from './ParticipantsForm.jsx';

function CreateEventModal({ onClose, onSuccess, initialDate, initialStartTime, initialEndTime }) {
  // Event form logic
  const eventForm = useEventCreate(initialDate, initialStartTime, initialEndTime);
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
        <div className="modal-title">
          <Icons.Add />
          Créer un événement
        </div>
      }
      size="xl"
    >
      <div className="entity-form">
        {error && (
          <div className="alert alert-error">
            <Icons.Warning />
            {error}
          </div>
        )}

        <div className="layout-grid-content event">
          <div className="layout-sidebar-content">
            <EventForm
              formData={formData}
              handleFormChange={handleFormChange}
              setFormData={setFormData}
            />
          </div>

          <div className="layout-main-content">
            <ParticipantsForm
              participants={participants}
              canAddParticipant={true}
              addParticipant={addParticipant}
              removeParticipant={removeParticipant}
              updateParticipant={updateParticipant}
            />
          </div>
        </div>

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
      </div>
    </Modal>
  );
}

export default CreateEventModal;
