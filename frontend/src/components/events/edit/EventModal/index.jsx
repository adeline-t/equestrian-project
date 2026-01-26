import PropTypes from 'prop-types';
import { useEventDetails } from '../../../../hooks/useEventDetails';
import { useEventEdit } from '../../../../hooks/useEventEdit';
import { useEventParticipantActions } from '../../../../hooks/useEventParticipantActions';
import { getInstructorConfig } from '../../../../lib/domain';
import {
  EVENT_TYPES,
  SLOT_STATUSES,
  getEventTypeConfig,
  getStatusConfig,
} from '../../../../lib/domain/events';
import { calculateDurationMinutes, formatDate, formatDuration } from '../../../../lib/helpers';
import { Icons } from '../../../../lib/icons';
import '../../../../styles/features/events/event-modal.css';
import DomainBadge from '../../../common/DomainBadge';
import Modal from '../../../common/Modal';
import { useAppMode } from '../../../../context/AppMode.jsx';
import ParticipantsForm from '../../create/CreateEventModal/ParticipantsForm';
import EventDeleteOrCancelModal from './EventDeleteOrCancelModal';
import EventEditForm from './EventEditForm';
import EventParticipantRow from './EventParticipantRow';

export default function EventModal({ slotId, onClose, onDelete }) {
  const { slot, event, participants, loading, error, reload, deleteSlot } = useEventDetails(slotId);

  const { mode, currentRider } = useAppMode();

  const participantActions = useEventParticipantActions(async (msg) => {
    reload(); // reload participants
  });

  const eventEdit = useEventEdit(slot, event, async () => {
    reload();
  });

  const handleDeleteEvent = async () => {
    const success = await eventEdit.deleteSlot(slot.id);

    if (success) {
      eventEdit.setShowDeleteModal(false); // ferme DeleteConfirmationModal
      onDelete?.(); // notifie CalendarView
      onClose(); // ferme EventModal
    }
  };

  if (loading) {
    return (
      <Modal isOpen onClose={onClose} size="md" title="Chargement…">
        <div className="loading-state">Chargement…</div>
      </Modal>
    );
  }

  if (error || !slot || !event) {
    return (
      <Modal isOpen onClose={onClose} size="md" title="Erreur">
        <p>{error || 'Erreur de chargement'}</p>
      </Modal>
    );
  }

  const duration = calculateDurationMinutes(slot.start_time, slot.end_time);
  const eventTypeConfig = getEventTypeConfig(event.event_type);
  const slotStatusConfig = getStatusConfig(slot.slot_status);
  const instructorConfig = getInstructorConfig(event.instructor_id);
  const actualInstructorConfig = getInstructorConfig(slot.actual_instructor_id);
  const canEditEvent =
    mode === 'admin' ||
    slot.events.event_type === EVENT_TYPES.PRIVATE_LESSON ||
    slot.events.event_type === EVENT_TYPES.LOANER_FREE_TIME;

  const canEditParticipant = (riderId) => {
    if (mode === 'admin') return true;
    if (!currentRider) return false;
    return currentRider.id === riderId;
  };
  const canAddParticipant = participants.length < (event.max_participants ?? 1);

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      size="xl"
      title={
        <div className="event-modal-header">
          <div className="event-modal-avatar">
            <Icons.Lesson />
          </div>

          <div className="event-modal-title-text">
            <h2>{event?.name || eventTypeConfig.label}</h2>
            <div className="event-modal-created">créé le {formatDate(slot?.created_at)}</div>
          </div>

          <div className="event-modal-actions">
            {canEditEvent && (
              <button
                className="btn-icon-modern"
                onClick={eventEdit.startEdit}
                title="Modifier l'événement"
              >
                <Icons.Edit />
              </button>
            )}
            {mode === 'admin' && (
              <button
                className="btn-icon-modern danger"
                onClick={eventEdit.openDeleteModal}
                title="Supprimer l'événement"
              >
                <Icons.Delete />
              </button>
            )}
          </div>
        </div>
      }
    >
      <div className="event-modal-content">
        <div className="event-modal-grid">
          {/* SIDEBAR */}
          <div className="event-modal-sidebar">
            <div className="info-card">
              <div className="info-card-header">
                <h3>Informations</h3>
              </div>
              <div className="info-card-body">
                <div className="info-item-modern info-content">
                  <span className="info-label">Type</span>
                  <DomainBadge config={eventTypeConfig} />
                  <DomainBadge config={slotStatusConfig} />
                </div>

                {slot.slot_status === SLOT_STATUSES.CANCELLED && slot.cancellation_reason && (
                  <div className="info-item-modern info-content">
                    <span className="info-label">Raison annulation</span>
                    <span className="info-value">{slot.cancellation_reason}</span>
                  </div>
                )}

                <div className="info-item-modern info-content">
                  <span className="info-label">Enseignant</span>
                  <DomainBadge config={instructorConfig} />
                </div>

                {slot.actual_instructor_id && slot.actual_instructor_id !== event.instructor_id && (
                  <div className="info-item-modern info-content">
                    <span className="info-label">Remplacé par</span>
                    <DomainBadge config={actualInstructorConfig} />
                  </div>
                )}
              </div>
            </div>

            <div className="info-card">
              <div className="info-card-header">
                <h3>Horaires</h3>
              </div>
              <div className="info-card-body">
                <div className="info-item-modern info-content">
                  <span className="info-label">Date</span>
                  <span className="info-value">{slot.slot_date}</span>
                </div>

                <div className="info-item-modern info-content">
                  <span className="info-label">Heures</span>
                  <span className="info-value">
                    {slot.is_all_day ? 'Journée entière' : `${slot.start_time} - ${slot.end_time}`}
                  </span>
                </div>

                <div className="info-item-modern info-content">
                  <span className="info-label">Durée</span>
                  <span className="info-value">{formatDuration(duration)}</span>
                </div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-label">
                <h3>Participants</h3>
              </div>
              <div className="stat-number">
                {participants.length} {slot.max_participants && <>/ {slot.max_participants}</>}
              </div>
            </div>
          </div>

          {/* MAIN */}
          <div className="event-modal-main">
            <div className="data-card">
              <div className="data-card-header">
                <div className="data-card-title">
                  <Icons.Users />
                  <h3>Participants</h3>
                </div>
                {canAddParticipant && (
                  <>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => participantActions.handleCreate()}
                    >
                      <Icons.Add />
                      <span>Ajouter</span>
                    </button>
                  </>
                )}
              </div>

              <div className="data-card-body">
                {participants.length === 0 ? (
                  <div className="empty-state-small">
                    <Icons.Users />
                    <p>Aucun participant</p>
                  </div>
                ) : (
                  <div className="participants-grid">
                    {participants.map((p, idx) => (
                      <EventParticipantRow
                        key={p.id}
                        participant={p}
                        canEdit={canEditParticipant(p.id)}
                        onEdit={() => participantActions.handleEdit(p)} // opens edit form
                        onDelete={() => participantActions.handleDeleteClick(p)} // opens delete confirmation
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Bloc récurrence désactivé */}
            {false && (
              <div className="event-box" style={{ marginTop: 16 }}>
                <div className="event-box-header">
                  <div className="event-box-title">
                    <Icons.Clock />
                    <h3>Récurrence</h3>
                  </div>
                </div>
                <div className="event-box-body">
                  <h3>Ajouter ou gérer la récurrence de cet événement</h3>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Participant Modal */}
      {participantActions.showModal && (
        <Modal
          isOpen={true}
          onClose={participantActions.closeModal}
          title={
            participantActions.editingParticipant ? 'Modifier participant' : 'Ajouter participant'
          }
          size="md"
        >
          <ParticipantsForm
            participants={participants}
            canAddParticipant={!participantActions.editingParticipant}
            addParticipant={(riderId, horseId) => {
              if (!riderId || !horseId) return console.warn('Rider ou Horse ID manquant');
              participantActions.handleSubmit(slot.id, riderId, horseId).then(() => reload());
            }}
            updateParticipant={(id, riderId, horseId) => {
              if (!riderId || !horseId) return console.warn('Rider ou Horse ID manquant');
              participantActions.handleSubmit(slot.id, riderId, horseId).then(() => reload());
            }}
            removeParticipant={(id) => participantActions.setShowDeleteModal({ id })}
          />
        </Modal>
      )}

      {/* Participant Delete Modal */}
      {participantActions.showDeleteModal && (
        <Modal
          isOpen={true}
          onClose={participantActions.closeDeleteModal}
          title="Supprimer participant"
          size="sm"
        >
          <p>Voulez-vous vraiment supprimer ce participant ?</p>
          <button
            onClick={() => {
              if (!participantActions.participantToDelete?.id) return;
              participantActions
                .handleRemove(participantActions.participantToDelete.id)
                .then(() => reload());
            }}
          >
            Oui
          </button>

          <button onClick={participantActions.closeDeleteModal}>Annuler</button>
        </Modal>
      )}

      {eventEdit.isEditing && (
        <Modal
          isOpen={true}
          onClose={eventEdit.cancelEdit}
          title={`Modifier l'événement`}
          size="xl"
        >
          {eventEdit.error && <div className="alert alert-danger mb-10">{eventEdit.error}</div>}
          <EventEditForm
            editData={eventEdit.editData} // <-- ici
            onChange={eventEdit.handleChange} // <-- ici
            onCancel={eventEdit.cancelEdit} // <-- ici
            onSubmit={() => {
              eventEdit.saveEdit(slot.id, event.id);
            }}
            disabled={eventEdit.saving} // <-- ici
          />
        </Modal>
      )}

      <EventDeleteOrCancelModal
        isOpen={eventEdit.showDeleteModal}
        eventName={event.name}
        loading={eventEdit.isDeleting}
        onClose={() => eventEdit.setShowDeleteModal(false)}
        onCancel={async (reason) => {
          const success = await eventEdit.cancelSlot(slot.id, reason);
          if (success) {
            onDelete?.();
            onClose();
          }
        }}
        onDelete={async () => {
          const success = await handleDeleteEvent();
          if (success) {
            onDelete?.();
            onClose();
          }
        }}
      />
    </Modal>
  );
}

EventModal.propTypes = {
  slotId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onClose: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
