import React from 'react';
import { format, parseISO } from 'date-fns';

function LessonCard({ lesson, onClick }) {
  const getLessonTypeIcon = (type) => {
    const icons = {
      private: '👤',
      group: '👥',
      training: '🎓',
      competition: '🏆',
      event: '🎉',
      blocked: '🚫',
    };
    return icons[type] || '📅';
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
      scheduled: { label: 'Planifié', class: 'status-scheduled' },
      confirmed: { label: 'Confirmé', class: 'status-confirmed' },
      in_progress: { label: 'En cours', class: 'status-in-progress' },
      completed: { label: 'Terminé', class: 'status-completed' },
      cancelled: { label: 'Annulé', class: 'status-cancelled' },
      blocked: { label: 'Bloqué', class: 'status-blocked' },
    };
    const badge = badges[status] || { label: status, class: 'status-default' };
    return <span className={`status-badge ${badge.class}`}>{badge.label}</span>;
  };

  const getOccupancyClass = () => {
    if (!lesson.max_participants || lesson.lesson_type === 'blocked') return '';
    const ratio = lesson.participant_count / lesson.max_participants;
    if (ratio >= 1) return 'full';
    if (ratio >= 0.8) return 'almost-full';
    return '';
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    try {
      // timeStr est au format "HH:MM:SS"
      const [hours, minutes] = timeStr.split(':');
      return `${hours}:${minutes}`;
    } catch {
      return timeStr;
    }
  };

  return (
    <div
      className={`lesson-card ${lesson.lesson_type} ${getOccupancyClass()} ${
        lesson.is_modified ? 'modified' : ''
      } ${lesson.not_given_by_laury ? 'not-given' : ''}`}
      onClick={onClick}
    >
      <div className="lesson-card-header">
        <span className="lesson-type-icon">{getLessonTypeIcon(lesson.lesson_type)}</span>
        <span className="lesson-type-label">{getLessonTypeLabel(lesson.lesson_type)}</span>
        {lesson.is_modified && (
          <span className="modified-badge" title="Cours modifié">
            ✏️
          </span>
        )}
        {lesson.not_given_by_laury && (
          <span className="not-given-badge" title="Cours non donné par Laury">
            ⚠️
          </span>
        )}
      </div>

      <div className="lesson-card-body">
        <div className="lesson-name">{lesson.name}</div>
        <div className="lesson-time">
          {formatTime(lesson.start_time)} - {formatTime(lesson.end_time)}
        </div>

        {lesson.lesson_type !== 'blocked' && (
          <div className="lesson-participants">
            <span className="participant-count">
              👥 {lesson.participant_count || 0}
              {lesson.max_participants && ` / ${lesson.max_participants}`}
            </span>
          </div>
        )}

        {getStatusBadge(lesson.status)}
      </div>
    </div>
  );
}

export default LessonCard;