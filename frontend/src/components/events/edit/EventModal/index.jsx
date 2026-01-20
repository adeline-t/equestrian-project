import { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useEventDetails } from '../../../../hooks/useEventDetails';
import { useEventEdit } from '../../../../hooks/useEventEdit';
import { getEventTypeLabel, getStatusLabel } from '../../../../lib/domain/events';
import { Icons } from '../../../../lib/icons';
import '../../../../styles/components/events.css';
import Modal from '../../../common/Modal';
import EventDetailsTab from './EventDetailsTab';
import EventEditForm from './EventEditForm';
import ParticipantsTab from './ParticipantsTab';
import RecurrenceTab from './RecurrenceTab';

function EventModal({ slotId, onClose, onUpdate }) {
  const [activeTab, setActiveTab] = useState('details');
  const { slot, event, participants, recurrence, loading, error, refresh } =
    useEventDetails(slotId);
  const { isEditing, editData, saving, editError, startEdit, handleChange, saveEdit, cancelEdit } =
    useEventEdit(slot, event);

  const handleSave = async () => {
    const success = await saveEdit(slotId, event?.id, refresh);
    if (success) {
      onUpdate?.();
      setIsEditing(false);
    }
  };

  if (loading) return <EventModalLoading isOpen onClose={onClose} />;
  if (error || !slot) return <EventModalError isOpen error={error} onClose={onClose} />;

  const participantCount = participants?.length || 0;
  const isBlocked = event?.event_type === 'blocked';
  const hasRecurrence = !!recurrence;

  // Calculer le nombre d'onglets disponibles
  const availableTabs = [
    'details',
    ...(event && !isBlocked ? ['participants'] : []),
    ...(hasRecurrence ? ['recurrence'] : []),
  ];
  const showTabs = availableTabs.length > 1 && !isEditing;

  // Titre du modal avec badges
  const modalTitle = (
    <div className="event-modal-title-section">
      <div className="event-modal-title-main">
        {event?.name || getEventTypeLabel(event?.event_type || slot?.event_type)}
      </div>
      <div className="event-modal-title-badges">
        {hasRecurrence && (
          <span className="event-badge event-badge-recurrence">
            <Icons.Repeat /> Récurrent
          </span>
        )}
        <span className={`event-badge event-badge-status event-badge-${slot.slot_status}`}>
          {getStatusLabel(slot.slot_status)}
        </span>
      </div>
      <div className="event-modal-subtitle">
        <div className="event-modal-meta-item">
          <Icons.Calendar className="event-modal-meta-icon" />
          <span>{format(parseISO(slot.start_time), 'EEEE dd MMMM yyyy', { locale: fr })}</span>
        </div>
        <div className="event-modal-meta-item">
          <Icons.Clock className="event-modal-meta-icon" />
          <span>
            {slot.is_all_day
              ? 'Journée entière'
              : `${slot.start_time.slice(11, 16)} - ${slot.end_time.slice(11, 16)}`}
          </span>
        </div>
        {event && !isBlocked && (
          <div className="event-modal-meta-item">
            <Icons.Users className="event-modal-meta-icon" />
            <span>
              {participantCount} / {event.max_participants || '∞'} participants
            </span>
          </div>
        )}
      </div>
    </div>
  );

  // Footer avec boutons
  const modalFooter = isEditing ? (
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
    <>
      <button className="event-modal-btn event-modal-btn-secondary" onClick={onClose}>
        <Icons.Close /> Fermer
      </button>
      <button className="event-modal-btn event-modal-btn-primary" onClick={startEdit}>
        <Icons.Edit /> Modifier
      </button>
    </>
  );

  return (
    <Modal isOpen={true} onClose={onClose} title={modalTitle} footer={modalFooter} size="large">
      {/* Tabs - uniquement si plusieurs onglets */}
      {showTabs && (
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
              {participantCount > 0 && <span className="event-tab-badge">{participantCount}</span>}
            </button>
          )}
          {hasRecurrence && (
            <button
              className={`event-modal-tab ${activeTab === 'recurrence' ? 'active' : ''}`}
              onClick={() => setActiveTab('recurrence')}
            >
              <Icons.Repeat /> Récurrence
            </button>
          )}
        </div>
      )}

      {/* Body */}
      <div className="event-modal-body-content">
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
            {activeTab === 'recurrence' && hasRecurrence && (
              <RecurrenceTab recurrence={recurrence} slot={slot} />
            )}
          </>
        )}
      </div>
    </Modal>
  );
}

// Loading Modal
const EventModalLoading = ({ isOpen, onClose }) => (
  <Modal isOpen={isOpen} onClose={onClose} title="Chargement" size="medium">
    <div className="event-modal-loading-content">
      <Icons.Loading className="event-modal-spin" />
      <p>Chargement des détails...</p>
    </div>
  </Modal>
);

// Error Modal
const EventModalError = ({ isOpen, error, onClose }) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    title={
      <div
        style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-danger)' }}
      >
        <Icons.Warning />
        Erreur
      </div>
    }
    footer={
      <button className="event-modal-btn event-modal-btn-secondary" onClick={onClose}>
        <Icons.Close /> Fermer
      </button>
    }
    size="medium"
  >
    <p>{error || 'Erreur lors du chargement'}</p>
  </Modal>
);

export default EventModal;
