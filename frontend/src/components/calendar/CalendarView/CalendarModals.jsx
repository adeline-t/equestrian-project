import React from 'react';
import PropTypes from 'prop-types';
import CreateEventModal from '../../events/EventModal';
import ShowEventModal from '../../events/SingleEventModal';

/**
 * Calendar Modals Component
 * Handles all modal rendering for calendar operations
 * Updated for new schema: planning_slots + events
 */
function CalendarModals({
  showEventModal: showCreateEventModal,
  showSingleEventModal: showEventModal,
  showBlockedTimeModal,
  selectedEvent,
  onCloseEventModal,
  onCloseSingleEventModal,
  onCloseBlockedTimeModal,
  onModalSuccess,
}) {
  return (
    <>
      {/* ShowEventModal for viewing/editing existing events */}
      {showCreateEventModal &&
        selectedEvent &&
        (selectedEvent.event_id || selectedEvent.slot_id) && (
          <CreateEventModal
            event={selectedEvent}
            onClose={onCloseEventModal}
            onUpdate={onModalSuccess}
          />
        )}

      {/* CreateEventModal for creating new events */}
      {showEventModal && (
        <ShowEventModal
          event={null}
          onClose={onCloseSingleEventModal}
          onSuccess={onModalSuccess}
          initialDate={selectedEvent?.date}
          initialStartTime={selectedEvent?.start_time}
          initialEndTime={selectedEvent?.end_time}
        />
      )}
    </>
  );
}

CalendarModals.propTypes = {
  showEventModal: PropTypes.bool.isRequired,
  showSingleEventModal: PropTypes.bool.isRequired,
  showBlockedTimeModal: PropTypes.bool.isRequired,
  selectedEvent: PropTypes.shape({
    slot_id: PropTypes.number,
    event_id: PropTypes.number,
    date: PropTypes.string,
    start_time: PropTypes.string,
    end_time: PropTypes.string,
  }),
  onCloseEventModal: PropTypes.func.isRequired,
  onCloseSingleEventModal: PropTypes.func.isRequired,
  onCloseBlockedTimeModal: PropTypes.func.isRequired,
  onModalSuccess: PropTypes.func.isRequired,
};

export default CalendarModals;
