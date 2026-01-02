import React from 'react';
import { Icons } from '../../utils/icons';

function LessonCard({ lesson, onClick, style }) {
  // Add null check for lesson
  if (!lesson) {
    return null;
  }

  const getLessonTypeIcon = (type) => {
    const icons = {
      private: Icons.PrivateLesson,
      group: Icons.GroupLesson,
      training: Icons.Training,
      competition: Icons.Competition,
      event: Icons.Event,
      blocked: Icons.Blocked,
    };
    const IconComponent = icons[type] || Icons.Calendar;
    return <IconComponent style={{ fontSize: '14px' }} />;
  };

  const getLessonTypeLabel = (type) => {
    const labels = {
      private: 'Particulier',
      group: 'Collectif',
      training: 'Stage',
      competition: 'Concours',
      event: 'Événement',
      blocked: 'Bloqué',
    };
    return labels[type] || type;
  };

  const getStatusBadge = (status) => {
    const badges = {
      scheduled: { label: 'Planifié', class: 'status-scheduled', icon: Icons.Calendar },
      confirmed: { label: 'Confirmé', class: 'status-confirmed', icon: Icons.Check },
      in_progress: { label: 'En cours', class: 'status-in-progress', icon: Icons.Clock },
      completed: { label: 'Terminé', class: 'status-completed', icon: Icons.Check },
      cancelled: { label: 'Annulé', class: 'status-cancelled', icon: Icons.Close },
      blocked: { label: 'Bloqué', class: 'status-blocked', icon: Icons.Blocked },
    };
    const badge = badges[status] || { label: status, class: 'status-default', icon: Icons.Info };
    const IconComponent = badge.icon;

    return (
      <span className={`status-badge ${badge.class}`}>
        <IconComponent style={{ fontSize: '10px', marginRight: '4px' }} />
        {badge.label}
      </span>
    );
  };

  const getOccupancyClass = () => {
    if (!lesson.max_participants || lesson.lesson_type === 'blocked') return '';
    const ratio = (lesson.participant_count || 0) / lesson.max_participants;
    if (ratio >= 1) return 'full';
    if (ratio >= 0.8) return 'almost-full';
    return '';
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    try {
      const [hours, minutes] = timeStr.split(':');
      return `${hours}:${minutes}`;
    } catch {
      return timeStr;
    }
  };

  const getDuration = () => {
    if (!lesson.start_time || !lesson.end_time) return '';

    const timeToMinutes = (timeStr) => {
      if (!timeStr) return 0;
      const [hours, minutes] = timeStr.split(':').map(Number);
      return hours * 60 + (minutes || 0);
    };

    const durationMinutes = timeToMinutes(lesson.end_time) - timeToMinutes(lesson.start_time);
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;

    if (hours > 0 && minutes > 0) {
      return `${hours}h${minutes}`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else {
      return `${minutes}min`;
    }
  };

  return (
    <div
      className={`lesson-card ${lesson.lesson_type || ''} ${getOccupancyClass()} ${
        lesson.is_modified ? 'modified' : ''
      } ${lesson.not_given_by_laury ? 'not-given' : ''}`}
      onClick={onClick}
      style={style || {}}
    >
      <div className="lesson-card-header">
        <span className="lesson-type-icon">{getLessonTypeIcon(lesson.lesson_type)}</span>
        <span className="lesson-type-label">{getLessonTypeLabel(lesson.lesson_type)}</span>
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

      <div className="lesson-card-body">
        <div className="lesson-name">{lesson.name || 'Sans nom'}</div>
        <div className="lesson-time">
          <Icons.Clock style={{ fontSize: '11px', marginRight: '4px' }} />
          {formatTime(lesson.start_time)} - {formatTime(lesson.end_time)}
          {lesson.lesson_type === 'blocked' && <span className="duration"> ({getDuration()})</span>}
        </div>

        {lesson.lesson_type !== 'blocked' && (
          <div className="lesson-participants">
            <span className="participant-count">
              <Icons.Users style={{ fontSize: '11px', marginRight: '4px' }} />
              {lesson.participant_count || 0}
              {lesson.max_participants && ` / ${lesson.max_participants}`}
            </span>
          </div>
        )}

        {lesson.location && (
          <div
            className="lesson-location"
            style={{ fontSize: '11px', color: '#6c757d', marginTop: '4px' }}
          >
            <Icons.Location style={{ fontSize: '10px', marginRight: '4px' }} />
            {lesson.location}
          </div>
        )}

        {getStatusBadge(lesson.status)}
      </div>
    </div>
  );
}

export default LessonCard;
