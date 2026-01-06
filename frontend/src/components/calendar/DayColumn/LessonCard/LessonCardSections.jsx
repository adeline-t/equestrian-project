import React from 'react';
import PropTypes from 'prop-types';
import { Icons } from '../../../../lib/libraries/icons.jsx';
import { getStatusBadge } from '../../../../constants/lessonTypes.js';
import { formatTime } from '../../../../lib/helpers/formatters/time.js';
import { formatDuration } from '../../../../lib/helpers/formatters/duration.js';
import { TEXT_STYLES, LAYOUT_STYLES } from '../../../../lib/config/ui.js';

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
    >
      <IconComponent />
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
    <div style={{ ...LAYOUT_STYLES.row, fontSize }}>
      <Icons.Users style={{ fontSize, flexShrink: 0 }} />
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
export function HeaderSection({ lesson, isCompact = false }) {
  const styles = TEXT_STYLES[isCompact ? 'compact' : 'standard'];

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', minHeight: 0 }}>
      <StatusBadgeSection status={lesson.status} />
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
        {lesson.name || 'Cours'}
      </span>
    </div>
  );
}

HeaderSection.propTypes = {
  lesson: PropTypes.object.isRequired,
  isCompact: PropTypes.bool,
};

/**
 * Time section: Start - End + Participants
 */
export function TimeSection({ lesson, isCompact = false }) {
  const styles = TEXT_STYLES[isCompact ? 'compact' : 'standard'];

  return (
    <div style={{ ...LAYOUT_STYLES.spaceBetween }}>
      <div style={{ ...styles.time, color: 'white' }}>
        {formatTime(lesson.start_time)} - {formatTime(lesson.end_time)}
      </div>
      <ParticipantsSection
        count={lesson.participant_count}
        max={lesson.max_participants}
        isCompact={isCompact}
      />
    </div>
  );
}

TimeSection.propTypes = {
  lesson: PropTypes.object.isRequired,
  isCompact: PropTypes.bool,
};

/**
 * Duration section (standard only)
 */
export function DurationSection({ lesson }) {
  if (!lesson.duration_minutes) return null;

  return (
    <div style={{ ...TEXT_STYLES.standard.duration, color: 'rgba(255,255,255,0.8)' }}>
      {formatDuration(lesson.duration_minutes)}
    </div>
  );
}

DurationSection.propTypes = {
  lesson: PropTypes.object.isRequired,
};

/**
 * Blocked lesson section: Icon + Label + Time
 */
export function BlockedLessonSection({ lesson }) {
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
          {lesson.name}
        </span>
      </div>
      <div style={{ ...TEXT_STYLES.standard.time, color: 'white' }}>
        {formatTime(lesson.start_time)} - {formatTime(lesson.end_time)}
      </div>
    </div>
  );
}

BlockedLessonSection.propTypes = {
  lesson: PropTypes.object.isRequired,
};
