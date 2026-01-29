import PropTypes from 'prop-types';
import React from 'react';

/**
 * EventModals - Lazy loading de toutes les modales du calendrier
 */
export default function EventModals({
  showSlotModal,
  showCreateEventModal,
  showCreateBlockedModal,
  showScheduledModal,
  selectedSlot,
  isSelectedSlotBlocked,
  createEventData,
  onCloseSlotModal,
  onCloseCreateEventModal,
  onCloseCreateBlockedModal,
  onCloseScheduledModal,
  onModalSuccess,
}) {
  const BlockedEventModal = React.lazy(() => import('../../events/edit/BlockedEventModal'));
  const EventModal = React.lazy(() => import('../../events/edit/EventModal'));
  const CreateEventModal = React.lazy(() => import('../../events/create/CreateEventModal'));
  const CreateBlockedTimeModal = React.lazy(() =>
    import('../../events/create/CreateBlockedTimeModal')
  );
  const ScheduledEventsModal = React.lazy(() => import('../../events/edit/ScheduledEventsModal'));

  return (
    <React.Suspense fallback={<div>Chargement…</div>}>
      {/* Modale d'édition de slot */}
      {showSlotModal &&
        selectedSlot &&
        (isSelectedSlotBlocked ? (
          <BlockedEventModal
            slotId={selectedSlot.id}
            onClose={onCloseSlotModal}
            onSave={onModalSuccess}
            onUpdate={onModalSuccess}
          />
        ) : (
          <EventModal
            slotId={selectedSlot.id}
            onClose={onCloseSlotModal}
            onDelete={onModalSuccess}
          />
        ))}

      {/* Modale de création d'événement */}
      {showCreateEventModal && createEventData && (
        <CreateEventModal
          initialDate={createEventData.date}
          initialStartTime={createEventData.start_time}
          initialEndTime={createEventData.end_time}
          onClose={onCloseCreateEventModal}
          onSuccess={onModalSuccess}
        />
      )}

      {/* Modale de création de temps bloqué */}
      {showCreateBlockedModal && (
        <CreateBlockedTimeModal onClose={onCloseCreateBlockedModal} onSuccess={onModalSuccess} />
      )}

      {/* Modale des événements planifiés */}
      {showScheduledModal && (
        <ScheduledEventsModal onClose={onCloseScheduledModal} onUpdate={onModalSuccess} />
      )}
    </React.Suspense>
  );
}

EventModals.propTypes = {
  showSlotModal: PropTypes.bool,
  showCreateEventModal: PropTypes.bool,
  showCreateBlockedModal: PropTypes.bool,
  showScheduledModal: PropTypes.bool,
  selectedSlot: PropTypes.object,
  isSelectedSlotBlocked: PropTypes.bool,
  createEventData: PropTypes.object,
  onCloseSlotModal: PropTypes.func.isRequired,
  onCloseCreateEventModal: PropTypes.func.isRequired,
  onCloseCreateBlockedModal: PropTypes.func.isRequired,
  onCloseScheduledModal: PropTypes.func.isRequired,
  onModalSuccess: PropTypes.func.isRequired,
};
