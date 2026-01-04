import React from 'react';
import { Icons } from '../../../lib/libraries/icons';
import LessonCardContent from './LessonCardContent';

const getLessonColor = (lessonType, status) => {
  if (lessonType === 'blocked') return '#6c757d';
  if (status === 'cancelled') return '#dc3545';
  if (status === 'completed') return '#28a745';
  if (status === 'confirmed') return '#007bff';
  
  const colors = {
    private: '#007bff',
    group: '#28a745',
    training: '#ffc107',
    competition: '#dc3545',
    event: '#6f42c1',
  };
  
  return colors[lessonType] || '#6c757d';
};

const isShortLesson = (lesson) => {
  if (!lesson.duration_minutes) return true;
  return lesson.duration_minutes <= 76; // minutes
};

const LessonCardWrapper = ({ lesson, onClick, style = {} }) => {
  if (!lesson) {
    return null;
  }

  const backgroundColor = getLessonColor(lesson.lesson_type, lesson.status);
  const isCompact = isShortLesson(lesson) && lesson.lesson_type !== 'blocked';

  const defaultStyle = {
    backgroundColor,
    border: 'none',
    borderRadius: '6px',
    color: 'white',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    minHeight: isCompact ? '40px' : 'auto',
    ...style
  };

  const handleClick = (e) => {
    e.stopPropagation();
    if (onClick) {
      onClick(lesson);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick(e);
    }
  };

  return (
    <div
      className={`lesson-card ${isCompact ? 'compact' : 'standard'}`}
      style={defaultStyle}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Lesson: ${lesson.name || 'Unnamed lesson'}, ${lesson.start_time} - ${lesson.end_time}`}
    >
      <LessonCardContent 
        lesson={lesson} 
        isCompact={isCompact} 
      />
    </div>
  );
};

export default LessonCardWrapper;