import PropTypes from 'prop-types';
import React from 'react';
import { useSlotEvent } from '../../hooks/useSlotEvent';
import { EVENT_TYPES, getEventTypeConfig, isBlockedEvent } from '../../lib/domain/events';
import { formatTime, formatDuration } from '../../lib/helpers/formatters';
import { Icons } from '../../lib/icons';
import '../../styles/features/calendar.css';
import { SLOT_STATUSES } from '../../lib/domain/events';

const shouldUseCompactLayout = (slot) => slot.duration_minutes < 60;

/* ------------------------------
   Status Badge Component
--------------------------------*/
function StatusBadge({ status }) {
  const config = getEventTypeConfig(status) || {};
  const Icon = config.icon || Icons.Info;
  const label = config.label || status;

  return (
    <div className={`status-badge status-${status}`} role="img" aria-label={label}>
      <Icon aria-hidden="true" />
    </div>
  );
}

StatusBadge.propTypes = {
  status: PropTypes.string.isRequired,
};

/* ------------------------------
   Participants Component
--------------------------------*/
function Participants({ count = 0, max = 0, isCompact = false }) {
  if (!max) return null;

  return (
    <div
      className={`participants ${isCompact ? 'compact' : 'standard'}`}
      role="img"
      aria-label={`${count}/${max} participants`}
    >
      <Icons.Users className="participants-icon" aria-hidden="true" />
      <span>
        {count}/{max}
      </span>
    </div>
  );
}

Participants.propTypes = {
  count: PropTypes.number,
  max: PropTypes.number,
  isCompact: PropTypes.bool,
};

/* ------------------------------
   Blocked Slot Content
--------------------------------*/
function BlockedSlotContent({ slot }) {
  return (
    <div className="blocked-slot-content">
      <div className="blocked-slot-header">
        <Icons.Blocked className="blocked-slot-icon" aria-hidden="true" />
        <span className="blocked-slot-label">Période bloquée</span>
      </div>
      <div className="blocked-slot-reason">{slot.cancellation_reason || 'Bloqué'}</div>
      <div className="blocked-slot-time">
        {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
      </div>
    </div>
  );
}

BlockedSlotContent.propTypes = {
  slot: PropTypes.object.isRequired,
};

/* ------------------------------
   Regular Slot Content
--------------------------------*/
function RegularSlotContent({ slot, isCompact }) {
  const participantCount = slot.event_participants?.length || 0;
  const maxParticipants = slot.events?.max_participants || 0;

  return (
    <div className="regular-slot-content">
      <div className="regular-slot-header">
        <StatusBadge status={slot.slot_status} />
        <span className={`regular-slot-name ${isCompact ? 'compact' : 'standard'}`}>
          {slot.events?.name || 'Événement'}
        </span>
      </div>

      <div className="regular-slot-footer">
        <div className={`regular-slot-time ${isCompact ? 'compact' : 'standard'}`}>
          {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
        </div>
        <Participants count={participantCount} max={maxParticipants} isCompact={isCompact} />
      </div>

      {!isCompact && slot.duration_minutes && (
        <div className="regular-slot-duration">{formatDuration(slot.duration_minutes)}</div>
      )}
    </div>
  );
}

RegularSlotContent.propTypes = {
  slot: PropTypes.object.isRequired,
  isCompact: PropTypes.bool,
};

/* ------------------------------
   EventCard Component
--------------------------------*/
function EventCard({ slot, onClick }) {
  if (!slot) return null;

  const { event, loading } = useSlotEvent(slot);
  const isCompact = shouldUseCompactLayout(slot);
  const blocked = isBlockedEvent(slot);
  const eventType = slot.events?.event_type ?? 'blocked';
  const displayName = slot.events?.name || 'Événement';

  const handleClick = (e) => {
    e.stopPropagation();
    onClick?.(slot);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick(e);
    }
  };

  return (
    <div
      className={`event-card ${isCompact ? 'compact' : 'standard'} ${blocked ? 'blocked' : ''} ${
        loading ? 'loading' : ''
      } event-type-${eventType}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`${displayName}, ${formatTime(slot.start_time)} - ${formatTime(slot.end_time)}`}
    >
      {blocked ? (
        <BlockedSlotContent slot={slot} />
      ) : (
        <RegularSlotContent slot={slot} isCompact={isCompact} />
      )}
    </div>
  );
}

EventCard.propTypes = {
  slot: PropTypes.shape({
    id: PropTypes.number.isRequired,
    slot_date: PropTypes.string,
    start_time: PropTypes.string.isRequired,
    end_time: PropTypes.string.isRequired,
    slot_status: PropTypes.oneOf([
      SLOT_STATUSES.SCHEDULED,
      SLOT_STATUSES.CONFIRMED,
      SLOT_STATUSES.COMPLETED,
      SLOT_STATUSES.CANCELLED,
    ]).isRequired,
    is_all_day: PropTypes.bool,
    duration_minutes: PropTypes.number,
    cancellation_reason: PropTypes.string,
    events: PropTypes.shape({
      id: PropTypes.number,
      event_type: PropTypes.oneOf(Object.values(EVENT_TYPES)),
      name: PropTypes.string,
      min_participants: PropTypes.number,
      max_participants: PropTypes.number,
    }),
    event_participants: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        rider_id: PropTypes.number,
        horse_id: PropTypes.number,
      })
    ),
  }).isRequired,
  onClick: PropTypes.func,
};

export default EventCard;
