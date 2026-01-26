import PropTypes from 'prop-types';
import { getSlotLayout } from '../../lib/config/ui';
import { getInstructorLabel } from '../../lib/domain/domain-constants';
import { getEventTypeConfig, getStatusConfig } from '../../lib/domain/events';
import { formatDuration, formatTime } from '../../lib/helpers/formatters';
import { Icons } from '../../lib/icons';
import '../../styles/features/calendar/calendar.css';

function SlotContent({ slot }) {
  const duration = slot.duration_minutes || 0;
  const layout = getSlotLayout(duration);

  const eventType = slot.events?.event_type || 'blocked';
  const eventConfig = getEventTypeConfig(eventType);

  const statusConfig = getStatusConfig(slot.slot_status);
  const StatusIcon = statusConfig?.icon || Icons.Info;

  const participants = slot.event_participants?.length || 0;
  const maxParticipants = slot.events?.max_participants || 0;

  return (
    <div className={`slot-content`} data-type={eventType} data-layout={layout}>
      {/* HEADER */}
      <div className="slot-header">
        <span className="slot-title">{slot.events.name || eventConfig.label}</span>

        <StatusIcon className="slot-status-icon" />
      </div>

      {/* INSTRUCTOR */}
      {slot.events?.instructor_id && (
        <div className="slot-instructor">
          <Icons.Tag />
          <span>{getInstructorLabel(slot.events.instructor)}</span>
        </div>
      )}

      {/* TIME */}
      <div className="slot-time">
        {formatTime(slot.start_time)} – {formatTime(slot.end_time)}
        {layout !== 'ultra-compact' && (
          <span className="slot-duration">· {formatDuration(duration)}</span>
        )}
      </div>

      {/* PARTICIPANTS */}
      {maxParticipants > 0 && (
        <div className="slot-participants">
          <Icons.Users />
          <span>
            {participants}/{maxParticipants}
          </span>
        </div>
      )}
    </div>
  );
}

SlotContent.propTypes = {
  slot: PropTypes.object.isRequired,
};

export default SlotContent;
