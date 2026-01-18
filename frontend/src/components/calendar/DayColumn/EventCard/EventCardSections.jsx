import React from 'react';
import PropTypes from 'prop-types';
import { Icons } from '../../../../lib/icons.jsx';
import { getStatusBadge } from '../../../../lib/domains/events/statuses.js';
import { formatTime } from '../../../../lib/helpers/shared/formatters/time';
import { formatDuration } from '../../../../lib/helpers/shared/formatters/duration';
import { TEXT_STYLES, LAYOUT_STYLES } from '../../../../lib/config/ui/cardStyles';

/**
 * Status badge section
 */
export function StatusBadgeSection({ status }) {
  const badgeConfig = getStatusBadge(status);
  const IconComponent = badgeConfig.icon;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '4px 4px',
        borderRadius: '10px',
        fontSize: '12px',
        backgroundColor: badgeConfig.bgColor,
        color: badgeConfig.color,
        whiteSpace: 'nowrap',
        flexShrink: 0,
        marginRight: '4px',
      }}
      role="img"
      aria-label={badgeConfig.label}
    >
      <IconComponent aria-hidden="true" />
    </div>
  );
}

StatusBadgeSection.propTypes = {
  status: PropTypes.string.isRequired,
};

/**
 * Participants section
 */
export function ParticipantsSection({ count, max, isCompact = false }) {
  if (max === 0) return null;

  const fontSize = isCompact ? '9px' : '11px';

  return (
    <div
      style={{ ...LAYOUT_STYLES.row, fontSize }}
      role="img"
      aria-label={`${count}${max ? `/${max}` : ''} participants`}
    >
      <Icons.Users style={{ fontSize, flexShrink: 0 }} aria-hidden="true" />
      <span>
        {count}
        {max && `/${max}`}
      </span>
    </div>
  );
}

ParticipantsSection.propTypes = {
  count: PropTypes.number,
  max: PropTypes.number,
  isCompact: PropTypes.bool,
};

/**
 * Header section: Status Badge + Name (max 2 lines)
 */
export function HeaderSection({ event, isCompact = false }) {
  const styles = TEXT_STYLES[isCompact ? 'compact' : 'standard'];

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', minHeight: 0 }}>
      <StatusBadgeSection status={event.status} />
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
          whiteSpace: 'normal',
        }}
      >
        {event.name || 'Cours'}
      </span>
    </div>
  );
}

HeaderSection.propTypes = {
  event: PropTypes.object.isRequired,
  isCompact: PropTypes.bool,
};

/**
 * Time section: Start - End + Participants
 */
export function TimeSection({ event, isCompact = false }) {
  const styles = TEXT_STYLES[isCompact ? 'compact' : 'standard'];

  return (
    <div style={{ ...LAYOUT_STYLES.spaceBetween }}>
      <div
        style={{ ...styles.time, color: 'white' }}
        role="img"
        aria-label={`De ${formatTime(event.start_time)} à ${formatTime(event.end_time)}`}
      >
        {formatTime(event.start_time)} - {formatTime(event.end_time)}
      </div>
      <ParticipantsSection
        count={event.participant_count}
        max={event.max_participants}
        isCompact={isCompact}
      />
    </div>
  );
}

TimeSection.propTypes = {
  event: PropTypes.object.isRequired,
  isCompact: PropTypes.bool,
};

/**
 * Duration section (standard only)
 */
export function DurationSection({ event }) {
  if (!event.duration_minutes) return null;

  return (
    <div
      style={{ ...TEXT_STYLES.standard.duration, color: 'rgba(255,255,255,0.8)' }}
      role="img"
      aria-label={`Durée: ${formatDuration(event.duration_minutes)}`}
    >
      {formatDuration(event.duration_minutes)}
    </div>
  );
}

DurationSection.propTypes = {
  event: PropTypes.object.isRequired,
};

/**
 * Blocked event section: Icon + Label + Time
 */
export function BlockedEventSection({ event }) {
  return (
    <div style={{ ...LAYOUT_STYLES.column, height: '100%' }}>
      <div style={{ display: 'flex', minHeight: 0 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            fontSize: '14px',
            color: '#e2e3e5',
            whiteSpace: 'nowrap',
            marginRight: '4px',
          }}
          aria-hidden="true"
        >
          <Icons.Blocked />
        </div>
        <span
          style={{
            ...TEXT_STYLES.standard.name,
            fontSize: '10px',
            color: 'white',
          }}
        >
          Période bloquée
        </span>
      </div>
      <div>
        <span
          style={{
            ...TEXT_STYLES.standard.name,
            color: 'white',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            wordBreak: 'break-word',
            lineHeight: '1.2',
            whiteSpace: 'normal',
            fontSize: '14px',
          }}
        >
          {event.name}
        </span>
      </div>
      <div
        style={{ ...TEXT_STYLES.standard.time, color: 'white' }}
        role="img"
        aria-label={`De ${formatTime(event.start_time)} à ${formatTime(event.end_time)}`}
      >
        {formatTime(event.start_time)} - {formatTime(event.end_time)}
      </div>
    </div>
  );
}

BlockedEventSection.propTypes = {
  event: PropTypes.object.isRequired,
};
