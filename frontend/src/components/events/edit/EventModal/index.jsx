import PropTypes from 'prop-types';
import { useState } from 'react';
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
import DomainBadge from '../../../common/DomainBadge';
import Modal from '../../../common/Modal';
import DeleteConfirmationModal from '../../../common/DeleteConfirmationModal';
import { useAppMode } from '../../../../context/AppMode.jsx';
import ParticipantsForm from '../../create/CreateEventModal/ParticipantsForm';
import EventEditForm from './EventEditForm';
import EventParticipantRow from './EventParticipantRow';

export default function EventModal({ slotId, onClose, onDelete }) {
  const { slot, event, participants, loading, error, reload } = useEventDetails(slotId);
  const { mode, currentRider } = useAppMode();

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancellationReason, setCancellationReason] = useState('');

  const participantActions = useEventParticipantActions(async (msg) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(''), 3000);
    reload();
  });

  const eventEdit = useEventEdit(slot, event, async () => {
    setSuccessMessage('Événement modifié avec succès');
    setTimeout(() => setSuccessMessage(''), 3000);
    reload();
  });

  const handleDeleteEvent = async () => {
    const success = await eventEdit.deleteSlot(slot.id);
    if (success) {
      onDelete?.();
      onClose();
    }
  };

  const handleCancelEvent = async () => {
    if (!cancellationReason.trim()) {
      setErrorMessage("Veuillez indiquer une raison d'annulation");
      return;
    }
    const success = await eventEdit.cancelSlot(slot.id, cancellationReason);
    if (success) {
      setShowCancelConfirm(false);
      setSuccessMessage('Événement annulé avec succès');
      setTimeout(() => setSuccessMessage(''), 3000);
      reload();
    }
  };

  if (loading) {
    return (
      <Modal isOpen onClose={onClose} size="lg">
        <div className="loading">
          <Icons.Loading className="spin" />
          <p>Chargement...</p>
        </div>
      </Modal>
    );
  }

  if (error || !slot || !event) {
    return (
      <Modal isOpen onClose={onClose} size="sm">
        <div className="error">
          <div className="error-icon">
            <Icons.Warning />
          </div>
          <h3>{error || 'Événement non trouvé'}</h3>
        </div>
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
    event.event_type === EVENT_TYPES.PRIVATE_LESSON ||
    event.event_type === EVENT_TYPES.LOANER_FREE_TIME;

  const canEditParticipant = (riderId) => {
    if (mode === 'admin') return true;
    if (!currentRider) return false;
    return currentRider.id === riderId;
  };

  const canAddParticipant = participants.length < (event.max_participants ?? 1);

  return (
    <>
      <Modal
        isOpen={true}
        onClose={onClose}
        size="xl"
        title={
          <div className="modal-header">
            <div className="info-card-avatar">
              <Icons.Lesson />
            </div>

            <div className="modal-header-text">
              <h2>{event?.name || eventTypeConfig.label}</h2>
              <div className="detail-card-meta">
                {eventTypeConfig && <DomainBadge config={eventTypeConfig} />}
                {slotStatusConfig && <DomainBadge config={slotStatusConfig} />}
              </div>
            </div>

            <div className="header-actions-group">
              {canEditEvent && (
                <button
                  className="btn-icon-modern"
                  onClick={eventEdit.startEdit}
                  title="Modifier l'événement"
                >
                  <Icons.Edit />
                </button>
              )}
              {mode === 'admin' && slot.slot_status !== SLOT_STATUSES.CANCELLED && (
                <button
                  className="btn-icon-modern warning"
                  onClick={() => setShowCancelConfirm(true)}
                  title="Annuler l'événement"
                >
                  <Icons.Cancel />
                </button>
              )}
              {mode === 'admin' && (
                <button
                  className="btn-icon-modern danger"
                  onClick={() => setShowDeleteConfirm(true)}
                  title="Supprimer l'événement"
                >
                  <Icons.Delete />
                </button>
              )}
            </div>
          </div>
        }
      >
        <div className="modal-content-scrollable">
          {/* Messages */}
          {successMessage && (
            <div className="alert alert-success">
              <Icons.Check />
              <span>{successMessage}</span>
            </div>
          )}
          {(errorMessage || eventEdit.error) && (
            <div className="alert alert-error">
              <Icons.Warning />
              <span>{errorMessage || eventEdit.error}</span>
            </div>
          )}

          <div className="layout-grid-content">
            {/* SIDEBAR */}
            <div className="layout-sidebar-content">
              {/* Informations */}
              <div className="info-card">
                <div className="info-card-header">
                  <Icons.Info />
                  <h3>Informations</h3>
                </div>
                <div className="info-card-body">
                  <div className="info-item-modern">
                    <div className="info-content">
                      <span className="info-label">Type d'événement</span>
                      <div className="info-value">
                        <DomainBadge config={eventTypeConfig} />
                      </div>
                    </div>
                  </div>

                  <div className="info-item-modern">
                    <div className="info-content">
                      <span className="info-label">Statut</span>
                      <div className="info-value">
                        <DomainBadge config={slotStatusConfig} />
                      </div>
                    </div>
                  </div>

                  {slot.slot_status === SLOT_STATUSES.CANCELLED && slot.cancellation_reason && (
                    <div className="info-item-modern">
                      <div className="info-icon info-icon-warning">
                        <Icons.Warning />
                      </div>
                      <div className="info-content">
                        <span className="info-label">Raison annulation</span>
                        <span className="info-value">{slot.cancellation_reason}</span>
                      </div>
                    </div>
                  )}

                  <div className="info-item-modern">
                    <div className="info-content">
                      <span className="info-label">Enseignant</span>
                      <div className="info-value">
                        <DomainBadge config={instructorConfig} />
                      </div>
                    </div>
                  </div>

                  {slot.actual_instructor_id &&
                    slot.actual_instructor_id !== event.instructor_id && (
                      <div className="info-item-modern">
                        <div className="info-icon info-icon-warning">
                          <Icons.User />
                        </div>
                        <div className="info-content">
                          <span className="info-label">Remplacé par</span>
                          <div className="info-value">
                            <DomainBadge config={actualInstructorConfig} />
                          </div>
                        </div>
                      </div>
                    )}
                </div>
              </div>

              {/* Horaires */}
              <div className="info-card">
                <div className="info-card-header">
                  <Icons.Calendar />
                  <h3>Horaires</h3>
                </div>
                <div className="info-card-body">
                  <div className="info-item-modern">
                    <div className="info-content">
                      <span className="info-label">Date</span>
                      <span className="info-value">{formatDate(slot.slot_date)}</span>
                    </div>
                  </div>

                  <div className="info-item-modern">
                    <div className="info-content">
                      <span className="info-label">Heures</span>
                      <span className="info-value">
                        {slot.is_all_day
                          ? 'Journée entière'
                          : `${slot.start_time} - ${slot.end_time}`}
                      </span>
                    </div>
                  </div>

                  {!slot.is_all_day && (
                    <div className="info-item-modern">
                      <div className="info-icon info-icon-info">
                        <Icons.Clock />
                      </div>
                      <div className="info-content">
                        <span className="info-label">Durée</span>
                        <span className="info-value">{formatDuration(duration)}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Stats participants */}
              <div className="info-card">
                <div className="info-card-header">
                  <Icons.Users />
                  <h3>Capacité</h3>
                </div>
                <div className="info-card-body">
                  <div className="stat-display">
                    <span className="stat-number">{participants.length}</span>
                    <span className="stat-separator">/</span>
                    <span className="stat-total">{event.max_participants || '∞'}</span>
                  </div>
                  <p className="stat-label">participants inscrits</p>
                </div>
              </div>
            </div>

            {/* MAIN */}
            <div className="layout-main-content">
              {/* Participants */}
              <div className="data-card">
                <div className="data-card-header">
                  <div className="data-card-title">
                    <h3>Participants</h3>
                    <span className="count-badge">{participants.length}</span>
                  </div>
                  {canAddParticipant && (
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => participantActions.handleCreate()}
                    >
                      <Icons.Add />
                      Ajouter
                    </button>
                  )}
                </div>

                <div className="data-card-body">
                  {participants.length === 0 ? (
                    <div className="empty-state-small">
                      <Icons.Users />
                      <p>Aucun participant</p>
                    </div>
                  ) : (
                    <div className="pairings-list-modern">
                      {participants.map((p) => (
                        <EventParticipantRow
                          key={p.id}
                          participant={p}
                          canEdit={canEditParticipant(p.rider_id)}
                          onEdit={() => participantActions.handleEdit(p)}
                          onDelete={() => participantActions.handleDeleteClick(p)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Metadata footer */}
          <div className="metadata-footer">
            <Icons.Calendar />
            <span className="text-muted">Créé le {formatDate(slot.created_at)}</span>
          </div>
        </div>
      </Modal>

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
              if (!riderId && !horseId) return;
              participantActions.handleSubmit(slot.id, riderId, horseId).then(() => reload());
            }}
            updateParticipant={(id, riderId, horseId) => {
              if (!riderId && !horseId) return;
              participantActions.handleSubmit(slot.id, riderId, horseId).then(() => reload());
            }}
            removeParticipant={(id) => participantActions.handleDeleteClick({ id })}
          />
        </Modal>
      )}

      {/* Participant Delete Modal */}
      <DeleteConfirmationModal
        isOpen={participantActions.showDeleteModal}
        onClose={participantActions.closeDeleteModal}
        onPermanentDelete={() => {
          if (!participantActions.participantToDelete?.id) return;
          participantActions.handleRemove(participantActions.participantToDelete.id).then(() => {
            setSuccessMessage('Participant supprimé');
            setTimeout(() => setSuccessMessage(''), 3000);
            reload();
          });
        }}
        itemType="participant"
        itemName="ce participant"
        allowSoftDelete={false}
      />

      {/* Event Edit Modal */}
      {eventEdit.isEditing && (
        <Modal isOpen={true} onClose={eventEdit.cancelEdit} title="Modifier l'événement" size="lg">
          {eventEdit.error && (
            <div className="alert alert-error">
              <Icons.Warning /> {eventEdit.error}
            </div>
          )}
          <EventEditForm
            editData={eventEdit.editData}
            onChange={eventEdit.handleChange}
            onCancel={eventEdit.cancelEdit}
            onSubmit={() => eventEdit.saveEdit(slot.id, event.id)}
            disabled={eventEdit.saving}
          />
        </Modal>
      )}

      {/* Cancel Event Modal */}
      {showCancelConfirm && (
        <Modal
          isOpen={true}
          onClose={() => setShowCancelConfirm(false)}
          title={
            <div className="modal-title-warning">
              <Icons.Warning /> Annuler l'événement
            </div>
          }
          size="sm"
        >
          <div className="form-section">
            <p className="text-muted">
              L'événement sera annulé mais restera visible dans l'historique.
            </p>

            <div className="form-group">
              <label htmlFor="cancellation-reason">
                Raison de l'annulation <span className="text-danger">*</span>
              </label>
              <textarea
                id="cancellation-reason"
                className="form-input"
                placeholder="Ex : Météo défavorable, indisponibilité..."
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={() => setShowCancelConfirm(false)}>
              <Icons.Cancel /> Annuler
            </button>
            <button
              className="btn btn-warning"
              onClick={handleCancelEvent}
              disabled={!cancellationReason.trim()}
            >
              <Icons.Check /> Confirmer l'annulation
            </button>
          </div>
        </Modal>
      )}

      {/* Delete Event Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onPermanentDelete={handleDeleteEvent}
        itemType="event"
        itemName={event.name}
        allowSoftDelete={false}
      />
    </>
  );
}

EventModal.propTypes = {
  slotId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onClose: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
