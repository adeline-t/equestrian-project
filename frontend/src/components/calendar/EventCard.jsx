import PropTypes from 'prop-types';
import { useSlotEvent } from '../../hooks/useSlotEvent';
import { CARD_STYLES, LAYOUT_STYLES, TEXT_STYLES } from '../../lib/config/ui';
import { EVENT_TYPES, getEventTypeColor, getStatusBadge } from '../../lib/domain/events.js';
import { formatDuration, formatTime } from '../../lib/helpers/formatters';
import { Icons } from '../../lib/icons';
import '../../styles/components/calendar.css';

// helpers unchanged, just rename param from event -> slot where relevant
const shouldUseCompactLayout = (slot) => slot.duration_minutes < 60;
const isBlockedEvent = (slot) => slot.event_type === 'blocked';

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

function BlockedEventContent({ slot, display }) {
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
        {display.name || display.cancellation_reason || 'Bloqué'}
      </span>

      <div style={{ ...TEXT_STYLES.standard.time, color: 'white', marginTop: 'auto' }}>
        {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
      </div>
    </div>
  );
}

function RegularEventContent({ slot, display, isCompact }) {
  const styles = TEXT_STYLES[isCompact ? 'compact' : 'standard'];

  return (
    <div style={{ ...LAYOUT_STYLES.column, height: '100%', justifyContent: 'space-between' }}>
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
          {display.name || 'Événement'}
        </span>
      </div>

      <div style={{ ...LAYOUT_STYLES.spaceBetween }}>
        <div style={{ ...styles.time, color: 'white' }}>
          {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
        </div>
        <Participants
          count={display.participant_count}
          max={display.max_participants}
          isCompact={isCompact}
        />
      </div>

      {!isCompact && slot.duration_minutes && (
        <div style={{ ...styles.duration, color: 'rgba(255,255,255,0.8)' }}>
          {formatDuration(slot.duration_minutes)}
        </div>
      )}
    </div>
  );
}

function EventCard({ slot, onClick }) {
  if (!slot) return null;

  const { event, loading } = useSlotEvent(slot);
  const display = event || slot; // use slot fields until event is loaded

  const isCompact = shouldUseCompactLayout(slot);
  const isBlocked = isBlockedEvent(slot);
  const backgroundColor = getEventTypeColor(slot.event_type);

  const cardStyle = {
    ...CARD_STYLES.base,
    ...(isCompact ? CARD_STYLES.compact : CARD_STYLES.standard),
    backgroundColor,
    opacity: loading ? 0.7 : 1,
  };

  const handleClick = (e) => {
    e.stopPropagation();
    // pass slot + event to the click handler so the modal has everything
    onClick?.({ slot, event });
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
      aria-label={`${display.name || 'Événement'}, ${formatTime(slot.start_time)} - ${formatTime(
        slot.end_time
      )}`}
    >
      {isBlocked ? (
        <BlockedEventContent slot={slot} display={display} />
      ) : (
        <RegularEventContent slot={slot} display={display} isCompact={isCompact} />
      )}
    </div>
  );
}

EventCard.propTypes = {
  slot: PropTypes.shape({
    slot_id: PropTypes.number.isRequired,
    event_id: PropTypes.number,
    name: PropTypes.string,
    event_type: PropTypes.oneOf(Object.values(EVENT_TYPES)).isRequired,
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
