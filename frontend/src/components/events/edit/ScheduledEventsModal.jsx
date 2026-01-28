import { useMemo, useState } from 'react';
import Modal from '../../common/Modal';
import { Icons } from '../../../lib/icons';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { getEventTypeConfig } from '../../../lib/domain/events';
import DomainBadge from '../../common/DomainBadge.jsx';
import { useEventScheduledList } from '../../../hooks/useEventScheduledList';
import '../../../styles/features/events/scheduled-events.css';
import { getInstructorConfig } from '../../../lib/domain/domain-constants.js';
import { shortName } from '../../../lib/helpers/index.js';

function ScheduledEventsModal({ onClose, onUpdate }) {
  const { slots, loading, error, actionLoading, actionError, validateSlot, deleteSlot } =
    useEventScheduledList();

  const [confirmDelete, setConfirmDelete] = useState(null);

  const handleValidate = async (slot, e) => {
    e.stopPropagation();
    const success = await validateSlot(slot.id);
    if (success && onUpdate) {
      onUpdate();
    }
  };

  const handleDelete = async (slot, e) => {
    e.stopPropagation();
    setConfirmDelete(slot.id);
  };

  const confirmDeleteAction = async () => {
    const success = await deleteSlot(confirmDelete);
    if (success) {
      setConfirmDelete(null);
      if (onUpdate) {
        onUpdate();
      }
    }
  };

  const groupedSlots = useMemo(() => {
    return slots.reduce((acc, slot) => {
      const date = slot.slot_date;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(slot);
      return acc;
    }, {});
  }, [slots]);

  const sortedDates = useMemo(() => {
    return Object.keys(groupedSlots).sort();
  }, [groupedSlots]);

  // Delete confirmation modal
  if (confirmDelete) {
    const slotToDelete = slots.find((s) => s.id === confirmDelete);
    const eventTypeConfig = getEventTypeConfig(slotToDelete?.events.event_type);

    return (
      <Modal
        isOpen
        onClose={() => setConfirmDelete(null)}
        title={
          <div className="modal-title-warning">
            <Icons.Warning /> Confirmer la suppression
          </div>
        }
        size="sm"
      >
        {actionError && (
          <div className="alert alert-error">
            <Icons.Warning /> {actionError}
          </div>
        )}

        <p style={{ textAlign: 'center', margin: 'var(--spacing-md) 0' }}>
          Êtes-vous sûr de vouloir supprimer cet événement ?
        </p>

        {slotToDelete && (
          <div className="info-card">
            <div className="info-card-body">
              <div className="info-item-modern">
                <div className="info-content">
                  <span className="info-label">Événement</span>
                  <span className="info-value">
                    {slotToDelete.events?.name || eventTypeConfig?.label || 'Événement'}
                  </span>
                </div>
              </div>
              <div className="info-item-modern">
                <div className="info-content">
                  <span className="info-label">Date</span>
                  <span className="info-value">
                    {format(parseISO(slotToDelete.slot_date), 'EEEE d MMMM yyyy', { locale: fr })}
                    {!slotToDelete.is_all_day && (
                      <>
                        {' '}
                        • {slotToDelete.start_time} - {slotToDelete.end_time}
                      </>
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="alert alert-danger">
          <Icons.Warning /> Cette action est irréversible.
        </div>

        <div className="modal-footer">
          <button
            className="btn btn-secondary"
            onClick={() => setConfirmDelete(null)}
            disabled={actionLoading === confirmDelete}
          >
            <Icons.Cancel /> Annuler
          </button>
          <button
            className="btn btn-danger"
            onClick={confirmDeleteAction}
            disabled={actionLoading === confirmDelete}
          >
            {actionLoading === confirmDelete ? (
              <>
                <Icons.Loading className="spin" /> Suppression...
              </>
            ) : (
              <>
                <Icons.Delete /> Supprimer
              </>
            )}
          </button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={
        <div className="modal-title">
          <span>Événements en attente de validation</span>
          <span className="badge count-badge warning">{slots.length}</span>
        </div>
      }
      size="lg"
    >
      {loading && (
        <div className="loading">
          <Icons.Loading className="spin" />
          <p>Chargement des événements...</p>
        </div>
      )}

      {error && (
        <div className="alert alert-error">
          <Icons.Warning /> {error}
        </div>
      )}

      {!loading && !error && slots.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Icons.Calendar />
          </div>
          <p>Aucun événement en attente</p>
        </div>
      )}

      {!loading && !error && slots.length > 0 && (
        <div className="scheduled-events-content">
          {sortedDates.map((date) => {
            const dateObj = parseISO(date);
            const formattedDate = format(dateObj, 'EEEE d MMMM yyyy', { locale: fr });
            const daySlots = groupedSlots[date].sort((a, b) => {
              const timeA = a.start_time || '00:00';
              const timeB = b.start_time || '00:00';
              return timeA.localeCompare(timeB);
            });

            return (
              <div key={date}>
                {/* Date Header */}
                <div className="info-card-header">
                  <Icons.Calendar />
                  <h3>{formattedDate}</h3>
                  <span className="count-badge">{daySlots.length}</span>
                </div>

                {/* Events List */}
                <div className="data-card">
                  {daySlots.map((slot) => {
                    const event = slot.events;
                    const eventTypeConfig = getEventTypeConfig(event.event_type);
                    const instructorConfig = getInstructorConfig(event.instructor_id);
                    const isProcessing = actionLoading === slot.id;

                    return (
                      <div
                        key={slot.id}
                        className={`card scheduled-event-card ${isProcessing ? 'processing' : ''}`}
                      >
                        {/* MAIN CONTENT */}
                        <div className="scheduled-event-main">
                          {/* Time */}
                          <div className="scheduled-event-time">
                            {slot.is_all_day ? (
                              <span className="info-value">Journée entière</span>
                            ) : (
                              <div className="scheduled-event-time-range">
                                <span className="info-value">{slot.start_time}</span>
                                <span className="info-label">{slot.end_time}</span>
                              </div>
                            )}
                          </div>

                          {/* Event Details */}
                          <div className="scheduled-event-details">
                            <div className="info-value">
                              {event.name || eventTypeConfig?.label || 'Événement'}
                            </div>

                            {/* Metadata */}
                            <div className="scheduled-event-metadata">
                              {eventTypeConfig && <DomainBadge config={eventTypeConfig} />}
                              {instructorConfig && <DomainBadge config={instructorConfig} />}
                            </div>
                          </div>

                          {/* Participants */}
                          {slot.event_participants?.length > 0 && (
                            <div className="scheduled-event-participants inline">
                              {slot.event_participants.map((participant, idx) => (
                                <span key={idx} className="participant-chip">
                                  {participant.rider_id ? (
                                    shortName(participant.riders.name)
                                  ) : (
                                    <b className="text-danger">N/A</b>
                                  )}

                                  <span className="text-muted">
                                    {participant.horse_id ? (
                                      shortName(participant.horses.name)
                                    ) : (
                                      <b className="text-danger">N/A</b>
                                    )}
                                  </span>
                                </span>
                              ))}
                            </div>
                          )}

                          {/* ACTIONS */}
                          <div className="card-actions">
                            <button
                              className="btn-icon-modern success"
                              onClick={(e) => handleValidate(slot, e)}
                              title="Valider"
                              disabled={isProcessing}
                            >
                              <Icons.Check />
                            </button>

                            <button
                              className="btn-icon-modern danger"
                              onClick={(e) => handleDelete(slot, e)}
                              disabled={isProcessing}
                              title="Supprimer"
                            >
                              <Icons.Delete />
                            </button>
                          </div>
                        </div>

                        {/* Created At */}
                        <div className="scheduled-event-created">
                          <span className="info-label">
                            Créé le{' '}
                            {format(parseISO(slot.created_at), 'dd/MM/yyyy à HH:mm', {
                              locale: fr,
                            })}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Modal>
  );
}

export default ScheduledEventsModal;
