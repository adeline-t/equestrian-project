import { useState } from 'react';
import { useEventDetails } from '../../../hooks/useEventDetails';
import { useEventEdit } from '../../../hooks/useEventEdit.js';
import { Icons } from '../../../lib/icons';
import '../../../styles/components/events.css';
import Portal from '../../common/Portal';
import EventDetailsTab from './EventDetailTab';
import EventEditForm from './EventEditForm';

function EventModal({ slotId, onClose, onUpdate }) {
  const [activeTab, setActiveTab] = useState('details');

  const { slot, event, loading, error, refresh } = useEventDetails(slotId);
  const { isEditing, editData, saving, editError, startEdit, handleChange, saveEdit, cancelEdit } =
    useEventEdit(slot, event);

  const handleSave = async () => {
    const success = await saveEdit(slotId, event?.id, refresh);
    if (success) {
      onUpdate?.();
      setActiveTab('details');
    }
  };

  if (loading) return <EventModalLoading onClose={onClose} />;
  if (error || !slot) return <EventModalError error={error} onClose={onClose} />;

  return (
    <Portal>
      <div className="event-modal-overlay" onClick={onClose}>
        <div className="event-modal-content" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="event-modal-header">
            <h2 className="event-modal-title">
              {event?.name || 'Créneau'} - {slot.start_time.slice(11, 16)}
            </h2>
            <button className="event-modal-close" onClick={onClose}>
              <Icons.Close />
            </button>
          </div>

          {/* Tabs */}
          <div className="event-modal-tabs">
            <button
              className={`event-modal-tab ${activeTab === 'details' ? 'active' : ''}`}
              onClick={() => setActiveTab('details')}
            >
              <Icons.Info /> {isEditing ? 'Modifier' : 'Détails'}
            </button>
          </div>

          {/* Body */}
          <div className="event-modal-body">
            {activeTab === 'details' &&
              (isEditing ? (
                <EventEditForm editData={editData} handleChange={handleChange} />
              ) : (
                <EventDetailsTab slot={slot} event={event} />
              ))}
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
                  Annuler
                </button>
                <button
                  className="event-modal-btn event-modal-btn-primary"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? 'Sauvegarde...' : 'Sauvegarder'}
                </button>
              </>
            ) : (
              <button className="event-modal-btn event-modal-btn-primary" onClick={startEdit}>
                <Icons.Edit /> Modifier
              </button>
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
    <div className="event-modal-overlay">
      <div className="event-modal-content event-modal-loading">
        <div className="event-modal-loading-content">
          <Icons.Loading className="event-modal-spin" />
          <p>Chargement...</p>
        </div>
      </div>
    </div>
  </Portal>
);

// Error Modal
const EventModalError = ({ error, onClose }) => (
  <Portal>
    <div className="event-modal-overlay">
      <div className="event-modal-content event-modal-error">
        <div className="event-modal-error-content">
          <Icons.Warning />
          <p>{error || 'Erreur inconnue'}</p>
        </div>
        <button className="event-modal-btn event-modal-btn-secondary" onClick={onClose}>
          Fermer
        </button>
      </div>
    </div>
  </Portal>
);

export default EventModal;
