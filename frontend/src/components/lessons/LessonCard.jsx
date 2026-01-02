import React from 'react';
import { Icons } from '../../utils/icons';

// ============================================================
// CONSTANTS - Type and Status Mappings
// ============================================================

const LESSON_TYPE_ICONS = {
  private: Icons.PrivateLesson,
  group: Icons.GroupLesson,
  training: Icons.Training,
  competition: Icons.Competition,
  event: Icons.Event,
  blocked: Icons.Blocked,
};

const LESSON_TYPE_LABELS = {
  private: 'Particulier',
  group: 'Collectif',
  training: 'Stage',
  competition: 'Concours',
  event: 'Événement',
  blocked: 'Bloqué',
};

const STATUS_BADGES = {
  scheduled: { label: 'Planifié', class: 'status-scheduled', icon: Icons.Calendar },
  confirmed: { label: 'Confirmé', class: 'status-confirmed', icon: Icons.Check },
  in_progress: { label: 'En cours', class: 'status-in-progress', icon: Icons.Clock },
  completed: { label: 'Terminé', class: 'status-completed', icon: Icons.Check },
  cancelled: { label: 'Annulé', class: 'status-cancelled', icon: Icons.Close },
  blocked: { label: 'Bloqué', class: 'status-blocked', icon: Icons.Blocked },
};

const SHORT_LESSON_THRESHOLD = 76; // minutes

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Get icon component for lesson type
 */
const getLessonTypeIcon = (type) => {
  const IconComponent = LESSON_TYPE_ICONS[type] || Icons.Calendar;
  return <IconComponent style={{ fontSize: '14px' }} />;
};

/**
 * Get label for lesson type
 */
const getLessonTypeLabel = (type) => {
  return LESSON_TYPE_LABELS[type] || type;
};

/**
 * Get status badge configuration
 */
const getStatusBadge = (status) => {
  return STATUS_BADGES[status] || { label: status, class: 'status-default', icon: Icons.Info };
};

/**
 * Render status badge component
 */
const renderStatusBadge = (status) => {
  const badge = getStatusBadge(status);
  const IconComponent = badge.icon;

  return (
    <span className={`status-badge ${badge.class}`}>
      <IconComponent style={{ fontSize: '10px', marginRight: '4px' }} />
      {badge.label}
    </span>
  );
};

/**
 * Calculate occupancy CSS class based on participant ratio
 */
const getOccupancyClass = (lesson) => {
  if (!lesson.max_participants || lesson.lesson_type === 'blocked') return '';

  const ratio = (lesson.participant_count || 0) / lesson.max_participants;
  if (ratio >= 1) return 'full';
  if (ratio >= 0.8) return 'almost-full';
  return '';
};

/**
 * Format time string (HH:MM)
 */
const formatTime = (timeStr) => {
  if (!timeStr) return '';
  try {
    const [hours, minutes] = timeStr.split(':');
    return `${hours}:${minutes}`;
  } catch {
    return timeStr;
  }
};

/**
 * Convert time string to minutes
 */
const timeToMinutes = (timeStr) => {
  if (!timeStr) return 0;
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + (minutes || 0);
};

/**
 * Calculate lesson duration in minutes
 */
const getDuration = (lesson) => {
  if (!lesson.start_time || !lesson.end_time) return 0;
  return timeToMinutes(lesson.end_time) - timeToMinutes(lesson.start_time);
};

/**
 * Check if lesson is short (< 1h)
 */
const isShortLesson = (lesson) => {
  return getDuration(lesson) < SHORT_LESSON_THRESHOLD;
};

/**
 * Build CSS classes for lesson card
 */
const buildLessonCardClasses = (lesson, isCompact = false) => {
  const baseClass = isCompact ? 'lesson-card-ultra-compact' : 'lesson-card';
  const classes = [
    baseClass,
    lesson.lesson_type || '',
    getOccupancyClass(lesson),
    lesson.is_modified ? 'modified' : '',
    lesson.not_given_by_laury ? 'not-given' : '',
  ];
  return classes.filter(Boolean).join(' ');
};

// ============================================================
// COMPONENT - Ultra-Compact Display (< 1h)
// ============================================================

const UltraCompactCard = ({ lesson, onClick, style }) => {
  const badge = getStatusBadge(lesson.status);
  const IconComponent = badge.icon;

  return (
    <div
      className={buildLessonCardClasses(lesson, true)}
      onClick={onClick}
      style={style || {}}
      title={lesson.name}
    >
      {/* Title with Status Icon */}
      <div className="ultra-compact-title">
        {IconComponent && (
          <IconComponent style={{ fontSize: '12px', marginRight: '4px', flexShrink: 0 }} />
        )}
        <span>{lesson.name || 'Sans nom'}</span>
      </div>

      {/* Count with Type Icon */}
      <div className="ultra-compact-count">
        {getLessonTypeIcon(lesson.lesson_type)}
        <span>
          {lesson.participant_count || 0} / {lesson.max_participants || 0}
        </span>
      </div>
    </div>
  );
};

// ============================================================
// COMPONENT - Standard Display (>= 1h)
// ============================================================

const StandardCard = ({ lesson, onClick, style }) => {
  return (
    <div className={buildLessonCardClasses(lesson, false)} onClick={onClick} style={style || {}}>
      {/* Header */}
      <div className="lesson-card-header">
        <span className="lesson-type-icon">{getLessonTypeIcon(lesson.lesson_type)}</span>
        <span className="lesson-type-label">{getLessonTypeLabel(lesson.lesson_type)}</span>

        {/* Indicators */}
        {lesson.is_modified && (
          <span className="modified-badge" title="Cours modifié">
            <Icons.Edit style={{ fontSize: '14px' }} />
          </span>
        )}
        {lesson.not_given_by_laury && (
          <span className="not-given-badge" title="Cours non donné par Laury">
            <Icons.Warning style={{ fontSize: '14px' }} />
          </span>
        )}
      </div>

      {/* Body */}
      <div className="lesson-card-body">
        {/* Name */}
        <div className="lesson-name">{lesson.name || 'Sans nom'}</div>

        {/* Time */}
        <div className="lesson-time">
          <Icons.Clock style={{ fontSize: '11px', marginRight: '4px' }} />
          {formatTime(lesson.start_time)} - {formatTime(lesson.end_time)}
          {lesson.lesson_type === 'blocked' && (
            <span className="duration"> ({getDuration(lesson)})</span>
          )}
        </div>

        {/* Participants */}
        {lesson.lesson_type !== 'blocked' && (
          <div className="lesson-participants">
            <span className="participant-count">
              <Icons.Users style={{ fontSize: '11px', marginRight: '4px' }} />
              {lesson.participant_count || 0}
              {lesson.max_participants && ` / ${lesson.max_participants}`}
            </span>
          </div>
        )}

        {/* Location */}
        {lesson.location && (
          <div
            className="lesson-location"
            style={{ fontSize: '11px', color: '#6c757d', marginTop: '4px' }}
          >
            <Icons.Location style={{ fontSize: '10px', marginRight: '4px' }} />
            {lesson.location}
          </div>
        )}

        {/* Status Badge */}
        {renderStatusBadge(lesson.status)}
      </div>
    </div>
  );
};

// ============================================================
// MAIN COMPONENT
// ============================================================

function LessonCard({ lesson, onClick, style }) {
  // Null check
  if (!lesson) {
    return null;
  }

  // Render ultra-compact or standard based on duration
  if (isShortLesson(lesson) && lesson.lesson_type !== 'blocked') {
    return <UltraCompactCard lesson={lesson} onClick={onClick} style={style} />;
  }

  return <StandardCard lesson={lesson} onClick={onClick} style={style} />;
}

export default LessonCard;
