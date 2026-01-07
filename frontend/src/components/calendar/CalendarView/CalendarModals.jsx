import React from 'react';
import PropTypes from 'prop-types';
import LessonModal from '../../lessons/LessonModal';
import SingleLessonModal from '../../lessons/SingleLessonModal';
import BlockedTimeModal from '../../lessons/BlockedTimeModal.jsx';

/**
 * Calendar Modals Component
 * Handles all modal rendering for calendar operations
 */
function CalendarModals({
  showLessonModal,
  showSingleLessonModal,
  showBlockedTimeModal,
  selectedLesson,
  onCloseLessonModal,
  onCloseSingleLessonModal,
  onCloseBlockedTimeModal,
  onModalSuccess,
}) {
  return (
    <>
      {/* LessonModal for viewing/editing existing lessons */}
      {showLessonModal && selectedLesson && selectedLesson.id && (
        <LessonModal
          lesson={selectedLesson}
          onClose={onCloseLessonModal}
          onUpdate={onModalSuccess}
        />
      )}

      {/* SingleLessonModal for creating new lessons */}
      {showSingleLessonModal && (
        <SingleLessonModal
          lesson={null}
          onClose={onCloseSingleLessonModal}
          onSuccess={onModalSuccess}
          initialDate={selectedLesson?.date}
          initialStartTime={selectedLesson?.start_time}
          initialEndTime={selectedLesson?.end_time}
        />
      )}

      {/* BlockedTimeModal for creating blocked time */}
      {showBlockedTimeModal && (
        <BlockedTimeModal
          blockedTime={null}
          onClose={onCloseBlockedTimeModal}
          onSuccess={onModalSuccess}
        />
      )}
    </>
  );
}

CalendarModals.propTypes = {
  showLessonModal: PropTypes.bool.isRequired,
  showSingleLessonModal: PropTypes.bool.isRequired,
  showBlockedTimeModal: PropTypes.bool.isRequired,
  selectedLesson: PropTypes.object,
  onCloseLessonModal: PropTypes.func.isRequired,
  onCloseSingleLessonModal: PropTypes.func.isRequired,
  onCloseBlockedTimeModal: PropTypes.func.isRequired,
  onModalSuccess: PropTypes.func.isRequired,
};

export default CalendarModals;
