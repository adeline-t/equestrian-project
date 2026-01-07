import React from 'react';
import PropTypes from 'prop-types';
import { CARD_STYLES } from '../../../../lib/config/ui/cardStyles';
import {
  getLessonColor,
  shouldUseCompactLayout,
  isBlockedLesson,
} from '../../../../lib/helpers/domains/lessons/formatters';
import { formatTime } from '../../../../lib/helpers/shared/formatters/time';
import LessonCardContent from './LessonCardContent';
import '../../../../styles/components/calendar.css';

/**
 * Main Lesson Card Component
 */
function LessonCard({ lesson, onClick, style }) {
  if (!lesson) return null;

  const isCompact = shouldUseCompactLayout(lesson);
  const isBlocked = isBlockedLesson(lesson);
  const backgroundColor = getLessonColor(lesson.lesson_type);

  const cardStyle = {
    ...CARD_STYLES.base,
    ...(isCompact ? CARD_STYLES.compact : CARD_STYLES.standard),
    backgroundColor,
    ...style,
  };

  const handleClick = (e) => {
    e.stopPropagation();
    onClick?.(lesson);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick(e);
    }
  };

  const lessonLabel = `${lesson.name || 'Cours'}, ${formatTime(lesson.start_time)} - ${formatTime(
    lesson.end_time
  )}`;

  return (
    <div
      className={`lesson-card ${isCompact ? 'compact' : 'standard'} ${isBlocked ? 'blocked' : ''}`}
      style={cardStyle}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={lessonLabel}
      aria-pressed="false"
    >
      <LessonCardContent lesson={lesson} isCompact={isCompact} isBlocked={isBlocked} />
    </div>
  );
}

LessonCard.propTypes = {
  lesson: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string,
    lesson_type: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    start_time: PropTypes.string.isRequired,
    end_time: PropTypes.string.isRequired,
    duration_minutes: PropTypes.number,
    participant_count: PropTypes.number,
    max_participants: PropTypes.number,
  }).isRequired,
  onClick: PropTypes.func,
  style: PropTypes.object,
};

export default LessonCard;
