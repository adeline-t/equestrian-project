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
 * EventCard Component - Consolidated
 * Displays an event card with all sections in one file
 */

// Helper to determine layout
const shouldUseCompactLayout = (event) => event.duration_minutes < 60;
const isBlockedEvent = (event) => event.event_type === 'blocked';

// Status Badge
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

// Participants Display
function Participants({ count = 0, max = 0, isCompact = false }) {
  if (max === 0) return null;

  return (
    <div
      style={{ ...LAYOUT_STYLES.row, fontSize: isCompact ? '9px' : '11px' }}
      role="img"
      aria-label={`${count}/${max} participants`}
    >
      <Icons.Users style={{ fontSize: isCompact ? '9px' : '11px', flexShrink: 0 }} aria-hidden="true" />
      <span>{count}/{max}</span>
    </div>
  );
}

// Blocked Event Content
function BlockedEventContent({ event }) {
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
        {event.name || event.cancellation_reason || 'Bloqué'}
      </span>
      
      <div style={{ ...TEXT_STYLES.standard.time, color: 'white', marginTop: 'auto' }}>
        {formatTime(event.start_time)} - {formatTime(event.end_time)}
      </div>
    </div>
  );
}

// Regular Event Content
function RegularEventContent({ event, isCompact }) {
  const styles = TEXT_STYLES[isCompact ? 'compact' : 'standard'];
  
  return (
    <div style={{ ...LAYOUT_STYLES.column, height: '100%', justifyContent: 'space-between' }}>
      {/* Header: Status + Name */}
      <div style={{ display: 'flex', alignItems: 'flex-start', minHeight: 0 }}>
        <StatusBadge status={event.status} />
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
          {event.name || 'Événement'}
        </span>
      </div>

      {/* Time + Participants */}
      <div style={{ ...LAYOUT_STYLES.spaceBetween }}>
        <div style={{ ...styles.time, color: 'white' }}>
          {formatTime(event.start_time)} - {formatTime(event.end_time)}
        </div>
        <Participants 
          count={event.participant_count} 
          max={event.max_participants} 
          isCompact={isCompact}
        />
      </div>

      {/* Duration (standard only) */}
      {!isCompact && event.duration_minutes && (
        <div style={{ ...styles.duration, color: 'rgba(255,255,255,0.8)' }}>
          {formatDuration(event.duration_minutes)}
        </div>
      )}
    </div>
  );
}

// Main EventCard Component
function EventCard({ event, onClick }) {
  if (!event) return null;

  const isCompact = shouldUseCompactLayout(event);
  const isBlocked = isBlockedEvent(event);
  const backgroundColor = getEventTypeColor(event.event_type);

  const cardStyle = {
    ...CARD_STYLES.base,
    ...(isCompact ? CARD_STYLES.compact : CARD_STYLES.standard),
    backgroundColor,
  };

  const handleClick = (e) => {
    e.stopPropagation();
    onClick?.(event);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick(e);
    }
  };

  return (
    <div
      className={`event-card ${isCompact ? 'compact' : 'standard'} ${isBlocked ? 'blocked' : ''}`}
      style={cardStyle}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`${event.name || 'Événement'}, ${formatTime(event.start_time)} - ${formatTime(event.end_time)}`}
    >
      {isBlocked ? (
        <BlockedEventContent event={event} />
      ) : (
        <RegularEventContent event={event} isCompact={isCompact} />
      )}
    </div>
  );
}

EventCard.propTypes = {
  event: PropTypes.shape({
    slot_id: PropTypes.number.isRequired,
    event_id: PropTypes.number,
    name: PropTypes.string,
    event_type: PropTypes.oneOf(['lesson', 'event', 'blocked', 'service', 'loaner_free_time']).isRequired,
    status: PropTypes.oneOf(['scheduled', 'confirmed', 'completed', 'cancelled']).isRequired,
    start_time: PropTypes.string.isRequired,
    end_time: PropTypes.string.isRequired,
    duration_minutes: PropTypes.number,
    participant_count: PropTypes.number,
    max_participants: PropTypes.number,
    cancellation_reason: PropTypes.string,
  }).isRequired,
  onClick: PropTypes.func,
};

export default EventCard;
