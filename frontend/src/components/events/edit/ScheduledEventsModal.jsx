import React, { useMemo } from 'react';
import Modal from '../../common/Modal';
import { Icons } from '../../../lib/icons';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { getEventTypeConfig } from '../../../lib/domain/events';
import { useScheduledEvents } from '../../../hooks/useScheduledEvents';
import '../../../styles/components/events.css';

function ScheduledEventsModal({ onClose, onSlotClick }) {
  const { slots, loading, error } = useScheduledEvents();

  const handleSlotClick = (slot) => {
    onSlotClick?.({ slot: slot });
    onClose();
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

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Icons.Calendar />
          Événements en attente de validation ({slots.length})
        </div>
      }
      footer={
        <button className="event-modal-btn event-modal-btn-secondary" onClick={onClose}>
          <Icons.Close /> Fermer
        </button>
      }
      size="large"
    >
      {loading && (
        <div className="event-modal-loading-content">
          <Icons.Loading className="event-modal-spin" />
          <p>Chargement des événements...</p>
        </div>
      )}

      {error && (
        <div className="create-event-alert create-event-alert-error">
          <Icons.Warning /> {error}
        </div>
      )}

      {!loading && !error && slots.length === 0 && (
        <div className="participants-empty-state">
          <Icons.Calendar style={{ fontSize: '48px', color: 'var(--color-gray-400)' }} />
          <p>Aucun événement en attente</p>
        </div>
      )}

      {!loading && !error && slots.length > 0 && (
        <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          {sortedDates.map((date) => {
            const dateObj = parseISO(date);
            const formattedDate = format(dateObj, 'EEEE d MMMM yyyy', { locale: fr });
            const daySlots = groupedSlots[date].sort((a, b) => {
              const timeA = a.start_time || '00:00';
              const timeB = b.start_time || '00:00';
              return timeA.localeCompare(timeB);
            });

            return (
              <div key={date} style={{ marginBottom: '24px' }}>
                {/* Date Header */}
                <div
                  style={{
                    padding: '12px 16px',
                    background: 'var(--gradient-light)',
                    borderLeft: '4px solid var(--color-primary)',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: '12px',
                  }}
                >
                  <div
                    style={{
                      fontSize: '16px',
                      fontWeight: 600,
                      color: 'var(--color-gray-900)',
                      textTransform: 'capitalize',
                    }}
                  >
                    {formattedDate}
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--color-gray-600)' }}>
                    {daySlots.length} événement{daySlots.length > 1 ? 's' : ''}
                  </div>
                </div>

                {/* Events List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {daySlots.map((slot) => {
                    const eventTypeConfig = getEventTypeConfig(slot.event?.event_type);

                    // Fallback si pas de config trouvée
                    const config = eventTypeConfig || {
                      label: 'Événement',
                      icon: Icons.Calendar,
                      color: 'var(--color-gray-600)',
                    };

                    const EventTypeIcon = config.icon;

                    return (
                      <div
                        key={slot.id}
                        onClick={() => handleSlotClick(slot)}
                        style={{
                          padding: '16px',
                          background: 'var(--color-white)',
                          border: '1px solid var(--color-gray-200)',
                          borderRadius: 'var(--radius-md)',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = 'var(--color-primary)';
                          e.currentTarget.style.boxShadow = '0 2px 8px rgba(102, 126, 234, 0.15)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = 'var(--color-gray-200)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'start', gap: '12px' }}>
                          {/* Time */}
                          <div
                            style={{
                              minWidth: '100px',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '4px',
                            }}
                          >
                            <div
                              style={{
                                fontSize: '14px',
                                fontWeight: 600,
                                color: 'var(--color-primary)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                              }}
                            >
                              <Icons.Clock style={{ fontSize: '14px' }} />
                              {slot.is_all_day ? (
                                <span>Journée</span>
                              ) : (
                                <span>
                                  {slot.start_time} - {slot.end_time}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Event Details */}
                          <div style={{ flex: 1 }}>
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                marginBottom: '8px',
                              }}
                            >
                              <EventTypeIcon
                                style={{
                                  fontSize: '16px',
                                  color: config.color,
                                }}
                              />
                              <div
                                style={{
                                  fontSize: '15px',
                                  fontWeight: 600,
                                  color: 'var(--color-gray-900)',
                                }}
                              >
                                {slot.event.name || config.label}
                              </div>
                            </div>

                            {/* Metadata */}
                            <div
                              style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: '12px',
                                fontSize: '13px',
                                color: 'var(--color-gray-600)',
                              }}
                            >
                              {slot.event.instructor_id && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  <Icons.User style={{ fontSize: '12px' }} />
                                  {slot.event.instructor_id}
                                </div>
                              )}
                              {slot.participant_count > 0 && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  <Icons.Users style={{ fontSize: '12px' }} />
                                  {slot.participant_count} participant
                                  {slot.participant_count > 1 ? 's' : ''}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Arrow */}
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Icons.ChevronRight
                              style={{ fontSize: '20px', color: 'var(--color-gray-400)' }}
                            />
                          </div>
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
