import React from 'react';
import LessonCardWrapper from './LessonCard/LessonCardWrapper';

/**
 * LessonCard Component - Refactored into modular subcomponents
 * 
 * A reusable card component for displaying lesson information in the calendar.
 * Supports both compact and standard layouts based on lesson duration.
 * 
 * @param {Object} lesson - The lesson data object
 * @param {Function} onClick - Click handler for the card
 * @param {Object} style - Additional CSS styles
 */
function LessonCard({ lesson, onClick, style }) {
  return (
    <LessonCardWrapper
      lesson={lesson}
      onClick={onClick}
      style={style}
    />
  );
}

export default LessonCard;