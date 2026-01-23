import { useMemo, useState } from 'react';
import Modal from '../../common/Modal';
import { Icons } from '../../../lib/icons';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { getEventTypeConfig } from '../../../lib/domain/events';
import { getInstructorConfig } from '../../../lib/domain/domain-constants';
import DomainBadge from '../../common/DomainBadge.jsx';
import { useEventScheduledList } from '../../../hooks/useEventScheduledList';
import '../../../styles/features/events.css';

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
          <span className="modal-title-danger">
            <Icons.Warning /> Confirmer la suppression
          </span>
        }
        footer={
          <>
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
          </>
        }
        size="small"
      >
        <div className="scheduled-delete-content">
          {actionError && (
            <div className="alert alert-error">
              <Icons.Warning /> {actionError}
            </div>
          )}

          <p>Êtes-vous sûr de vouloir supprimer cet événement ?</p>

          {slotToDelete && (
            <div className="scheduled-delete-event">
              <strong>{slotToDelete.event?.name || eventTypeConfig?.label || 'Événement'}</strong>
              <br />
              {format(parseISO(slotToDelete.slot_date), 'EEEE d MMMM yyyy', { locale: fr })}
              {!slotToDelete.is_all_day && (
                <>
                  {' '}
                  • {slotToDelete.start_time} - {slotToDelete.end_time}
                </>
              )}
            </div>
          )}

          <p className="scheduled-delete-warning">Cette action est irréversible.</p>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={
        <div className="modal-title-with-icon">
          <Icons.Calendar />
          Événements en attente de validation ({slots.length})
        </div>
      }
      footer={<></>}
      size="large"
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
          <Icons.Calendar className="empty-state-icon" />
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
              <div key={date} className="section-compact">
                {/* Date Header */}
                <div className="scheduled-date-header">
                  <div className="scheduled-date-title">{formattedDate}</div>
                  <div className="scheduled-date-count">
                    {daySlots.length} événement{daySlots.length > 1 ? 's' : ''}
                  </div>
                </div>

                {/* Events List */}
                <div className="scheduled-events-list">
                  {daySlots.map((slot) => {
                    const event = slot.events;
                    const eventTypeConfig = getEventTypeConfig(event.event_type);
                    const EventTypeIcon = eventTypeConfig?.icon || Icons.Calendar;
                    const isProcessing = actionLoading === slot.id;

                    return (
                      <div
                        key={slot.id}
                        className={`card scheduled-event-card ${isProcessing ? 'processing' : ''}`}
                      >
                        {/* MAIN CONTENT (defines height) */}
                        <div className="scheduled-event-main">
                          {/* Time */}
                          <div className="scheduled-event-box scheduled-event-time">
                            <div className="scheduled-event-time-label">
                              {slot.is_all_day ? (
                                <span>Journée</span>
                              ) : (
                                <div className="scheduled-event-time-range">
                                  <span>{slot.start_time}</span>
                                  <span>{slot.end_time}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Event Details */}
                          <div className="scheduled-event-box scheduled-event-details">
                            <div className="scheduled-event-header">
                              <div className="scheduled-event-title">
                                {event.name || eventTypeConfig?.label || 'Événement'}
                              </div>
                            </div>

                            {/* Metadata */}
                            <div className="scheduled-event-metadata">
                              <div className="scheduled-event-metadata-item">
                                <EventTypeIcon className="metadata-icon" />
                                {eventTypeConfig && <DomainBadge config={eventTypeConfig} />}
                                {slot.actual_instructor_name && (
                                  <>
                                    <span className="scheduled-event-separator">•</span>
                                    <Icons.User />
                                    {slot.actual_instructor_name}
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Participants */}
                          {slot.event_participants?.length > 0 && (
                            <div className="scheduled-event-box scheduled-event-participants">
                              <div className="scheduled-event-participants-list">
                                {slot.event_participants.map((participant, idx) => (
                                  <div key={idx} className="scheduled-event-participant">
                                    <span>{participant.riders.name}</span>
                                    {participant.horse_id && (
                                      <>
                                        <span className="scheduled-event-separator">•</span>
                                        <span>{participant.horses.name}</span>
                                      </>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* ACTIONS (now perfectly alignable) */}
                          <div className="scheduled-event-actions">
                            <button
                              className="btn-icon-modern success"
                              onClick={(e) => handleValidate(slot, e)}
                              title="Valider"
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
                          Créé le{' '}
                          {format(parseISO(slot.created_at), 'dd/MM/yyyy à HH:mm', { locale: fr })}
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
