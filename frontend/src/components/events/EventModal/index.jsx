import { useState } from 'react';
import { useEventDetails } from '../../../hooks/useEventDetails';
import { useEventEdit } from '../../../hooks/useEventEdit';
import { Icons } from '../../../lib/icons';
import '../../../styles/components/events.css';
import Portal from '../../common/Portal';
import EventDetailsTab from './EventDetailsTab';
import EventEditForm from './EventEditForm';
import ParticipantsTab from './ParticipantsTab';

function EventModal({ slotId, onClose, onUpdate }) {
  const [activeTab, setActiveTab] = useState('details');
  const { slot, event, participants, loading, error, refresh } = useEventDetails(slotId);
  const { isEditing, editData, saving, editError, startEdit, handleChange, saveEdit, cancelEdit } =
    useEventEdit(slot, event);

  const handleSave = async () => {
    const success = await saveEdit(slotId, event?.id, refresh);
    if (success) {
      onUpdate?.();
      setIsEditing(false);
    }
  };

  if (loading) return <EventModalLoading onClose={onClose} />;
  if (error || !slot) return <EventModalError error={error} onClose={onClose} />;

  const participantCount = participants?.length || 0;
  const isBlocked = event?.event_type === 'blocked';

  return (
    <Portal>
      <div className="event-modal-overlay" onClick={onClose}>
        <div className="event-modal-content" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="event-modal-header">
            <div className="event-modal-header-content">
              <h2 className="event-modal-title">{event?.name || 'Créneau'}</h2>
              <div className="event-modal-subtitle">
                {slot.start_time.slice(11, 16)} - {slot.end_time.slice(11, 16)}
                {slot.is_all_day && <span className="event-all-day-badge">Journée entière</span>}
              </div>
            </div>
            <button className="event-modal-close" onClick={onClose} aria-label="Fermer">
              <Icons.Close />
            </button>
          </div>

          {/* Tabs */}
          {!isEditing && (
            <div className="event-modal-tabs">
              <button
                className={`event-modal-tab ${activeTab === 'details' ? 'active' : ''}`}
                onClick={() => setActiveTab('details')}
              >
                <Icons.Info /> Détails
              </button>
              {event && !isBlocked && (
                <button
                  className={`event-modal-tab ${activeTab === 'participants' ? 'active' : ''}`}
                  onClick={() => setActiveTab('participants')}
                >
                  <Icons.Users /> Participants
                  {participantCount > 0 && (
                    <span className="event-tab-badge">{participantCount}</span>
                  )}
                </button>
              )}
            </div>
          )}

          {/* Body */}
          <div className="event-modal-body">
            {editError && (
              <div className="create-event-alert create-event-alert-error">
                <Icons.Warning className="create-event-alert-icon" />
                {editError}
              </div>
            )}

            {isEditing ? (
              <EventEditForm editData={editData} handleChange={handleChange} />
            ) : (
              <>
                {activeTab === 'details' && <EventDetailsTab slot={slot} event={event} />}
                {activeTab === 'participants' && !isBlocked && (
                  <ParticipantsTab participants={participants} event={event} onUpdate={refresh} />
                )}
              </>
            )}
          </div>

          {/* Footer */}
          <div className="event-modal-footer">
            {isEditing ? (
              <>
                <button
                  className="event-modal-btn event-modal-btn-secondary"
                  onClick={cancelEdit}
                  disabled={saving}
                >
                  <Icons.Cancel /> Annuler
                </button>
                <button
                  className="event-modal-btn event-modal-btn-primary"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <Icons.Loading className="event-modal-spin" />
                      Sauvegarde...
                    </>
                  ) : (
                    <>
                      <Icons.Check /> Sauvegarder
                    </>
                  )}
                </button>
              </>
            ) : (
              <div className="event-modal-footer-actions">
                <button className="event-modal-btn event-modal-btn-secondary" onClick={onClose}>
                  <Icons.Close /> Fermer
                </button>
                <button className="event-modal-btn event-modal-btn-primary" onClick={startEdit}>
                  <Icons.Edit /> Modifier
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Portal>
  );
}

// Loading Modal
const EventModalLoading = ({ onClose }) => (
  <Portal>
    <div className="event-modal-overlay" onClick={onClose}>
      <div className="event-modal-content event-modal-loading">
        <div className="event-modal-loading-content">
          <Icons.Loading className="event-modal-spin" />
          <p>Chargement des détails...</p>
        </div>
      </div>
    </div>
  </Portal>
);

// Error Modal
const EventModalError = ({ error, onClose }) => (
  <Portal>
    <div className="event-modal-overlay" onClick={onClose}>
      <div className="event-modal-content event-modal-error">
        <div className="event-modal-error-content">
          <Icons.Warning />
          <p>{error || 'Erreur lors du chargement'}</p>
        </div>
        <button className="event-modal-btn event-modal-btn-secondary" onClick={onClose}>
          <Icons.Close /> Fermer
        </button>
      </div>
    </div>
  </Portal>
);

export default EventModal;
