import React from 'react';
import PropTypes from 'prop-types';
import { Icons } from '../../../lib/icons';
import { getStatusBadge } from '../../../lib/domains/events/statuses';
import { getEventTypeColor } from '../../../lib/domains/events/types';
import { formatTime } from '../../../lib/helpers/shared/formatters/time';
import { formatDuration } from '../../../lib/helpers/shared/formatters/duration';
import { CARD_STYLES, TEXT_STYLES, LAYOUT_STYLES } from '../../../lib/config/ui/cardStyles';
import '../../../styles/components/calendar.css';

/**
 * SlotCard Component - Displays a planning slot
 * A slot can have an optional event (for lessons, services, etc.)
 * Or be a standalone blocked slot
 */

// Helper functions
const shouldUseCompactLayout = (slot) => slot.duration_minutes < 60;
const isBlockedSlot = (slot) => !slot.event_id || slot.event_type === 'blocked';

// Status Badge - based on planning_slots.slot_status
function StatusBadge({ status }) {
  const { icon: Icon, bgColor, color, label } = getStatusBadge(status);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '4px 4px',
        borderRadius: '10px',
        fontSize: '12px',
        backgroundColor: bgColor,
        color: color,
        whiteSpace: 'nowrap',
        flexShrink: 0,
        marginRight: '4px',
      }}
      role="img"
      aria-label={label}
    >
      <Icon aria-hidden="true" />
    </div>
  );
}

// Participants Display - from event_participants (only if slot has event)
function Participants({ count = 0, max = 0, isCompact = false }) {
  if (max === 0) return null;

  return (
    <div
      style={{ ...LAYOUT_STYLES.row, fontSize: isCompact ? '9px' : '11px' }}
      role="img"
      aria-label={`${count}/${max} participants`}
    >
      <Icons.Users
        style={{ fontSize: isCompact ? '9px' : '11px', flexShrink: 0 }}
        aria-hidden="true"
      />
      <span>
        {count}/{max}
      </span>
    </div>
  );
}

// Blocked Slot Content - slot without event
function BlockedSlotContent({ slot }) {
  return (
    <div style={{ ...LAYOUT_STYLES.column, height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <Icons.Blocked style={{ fontSize: '14px', color: '#e2e3e5' }} aria-hidden="true" />
        <span style={{ fontSize: '10px', color: 'white' }}>Période bloquée</span>
      </div>

      <span
        style={{
          ...TEXT_STYLES.standard.name,
          color: 'white',
          fontSize: '14px',
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          wordBreak: 'break-word',
          lineHeight: '1.2',
        }}
      >
        {slot.name || slot.cancellation_reason || 'Bloqué'}
      </span>

      <div style={{ ...TEXT_STYLES.standard.time, color: 'white', marginTop: 'auto' }}>
        {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
      </div>
    </div>
  );
}

// Regular Slot Content - slot with event
function RegularSlotContent({ slot, isCompact }) {
  const styles = TEXT_STYLES[isCompact ? 'compact' : 'standard'];

  return (
    <div style={{ ...LAYOUT_STYLES.column, height: '100%', justifyContent: 'space-between' }}>
      {/* Header: Status + Name */}
      <div style={{ display: 'flex', alignItems: 'flex-start', minHeight: 0 }}>
        <StatusBadge status={slot.status} />
        <span
          style={{
            ...styles.name,
            color: 'white',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            wordBreak: 'break-word',
            lineHeight: '1.2',
          }}
        >
          {slot.name || 'Créneau'}
        </span>
      </div>

      {/* Time + Participants */}
      <div style={{ ...LAYOUT_STYLES.spaceBetween }}>
        <div style={{ ...styles.time, color: 'white' }}>
          {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
        </div>
        <Participants
          count={slot.participant_count}
          max={slot.max_participants}
          isCompact={isCompact}
        />
      </div>

      {/* Duration (standard only) */}
      {!isCompact && slot.duration_minutes && (
        <div style={{ ...styles.duration, color: 'rgba(255,255,255,0.8)' }}>
          {formatDuration(slot.duration_minutes)}
        </div>
      )}
    </div>
  );
}

// Main SlotCard Component
function SlotCard({ slot, onClick }) {
  if (!slot) return null;

  const isCompact = shouldUseCompactLayout(slot);
  const isBlocked = isBlockedSlot(slot);

  // Color based on event_type (or gray for blocked)
  const backgroundColor = isBlocked ? '#6b7280' : getEventTypeColor(slot.event_type);

  const cardStyle = {
    ...CARD_STYLES.base,
    ...(isCompact ? CARD_STYLES.compact : CARD_STYLES.standard),
    backgroundColor,
  };

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
      className={`slot-card ${isCompact ? 'compact' : 'standard'} ${isBlocked ? 'blocked' : ''}`}
      style={cardStyle}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`${slot.name || 'Créneau'}, ${formatTime(slot.start_time)} - ${formatTime(
        slot.end_time
      )}`}
    >
      {isBlocked ? (
        <BlockedSlotContent slot={slot} />
      ) : (
        <RegularSlotContent slot={slot} isCompact={isCompact} />
      )}
    </div>
  );
}

SlotCard.propTypes = {
  slot: PropTypes.shape({
    // Planning slot data (always present)
    slot_id: PropTypes.number.isRequired,
    status: PropTypes.oneOf(['scheduled', 'confirmed', 'completed', 'cancelled']).isRequired,
    start_time: PropTypes.string.isRequired,
    end_time: PropTypes.string.isRequired,
    duration_minutes: PropTypes.number,
    is_all_day: PropTypes.bool,
    cancellation_reason: PropTypes.string,
    actual_instructor_id: PropTypes.number,

    // Event data (optional - NULL for blocked slots)
    event_id: PropTypes.number,
    event_type: PropTypes.oneOf(['lesson', 'event', 'blocked', 'service', 'loaner_free_time']),
    instructor_id: PropTypes.number,
    min_participants: PropTypes.number,
    max_participants: PropTypes.number,
    participant_count: PropTypes.number,

    // Display
    name: PropTypes.string,
  }).isRequired,
  onClick: PropTypes.func,
};

export default SlotCard;
