import React from 'react';
import { Icons } from '../../../lib/libraries/icons.jsx';
import LessonCard from './LessonCard/index.jsx';

const DayGrid = ({
  lessons,
  onLessonClick,
  selectionStyle,
  isSelecting,
  calculateLessonStyle,
  HOUR_HEIGHT = 60,
  START_HOUR = 8,
  END_HOUR = 22,
}) => {
  const hours = Array.from({ length: END_HOUR - START_HOUR }, (_, i) => START_HOUR + i);
  const validLessons = lessons || [];

  return (
    <div className="day-grid">
      {/* Hour markers and labels */}
      <div className="hour-markers">
        {hours.map((hour) => (
          <div
            key={hour}
            className="hour-marker-row"
            style={{
              position: 'absolute',
              top: `${(hour - START_HOUR) * HOUR_HEIGHT}px`,
              left: 0,
              right: 0,
              height: `${HOUR_HEIGHT}px`,
              borderBottom: '1px solid #e2e8f0',
              backgroundColor: hour % 2 === 0 ? '#fafafa' : 'white',
            }}
          >
            <div
              className="hour-label"
              style={{
                position: 'absolute',
                left: '4px',
                top: '2px',
                fontSize: '0.65rem',
                color: '#718096',
                fontWeight: '500',
                lineHeight: '1',
              }}
            >
              {hour.toString().padStart(2, '0')}:00
            </div>
          </div>
        ))}
      </div>

      {/* Selection overlay */}
      {isSelecting && selectionStyle && (
        <div
          className="selection-overlay"
          style={{
            position: 'absolute',
            backgroundColor: 'rgba(66, 153, 225, 0.2)',
            border: '2px solid #4299e1',
            borderRadius: '4px',
            zIndex: 10,
            pointerEvents: 'none',
            left: '8px',
            right: '8px',
            width: 'calc(100% - 16px)',
            ...selectionStyle,
          }}
        />
      )}

      {/* Lessons */}
      {validLessons.length > 0 && (
        <div className="lessons-container">
          {validLessons.map((lesson) => {
            const lessonStyle = calculateLessonStyle(lesson);

            // Debug log
            console.log(`Rendering lesson ${lesson.id}:`, lessonStyle);

            return (
              <div
                key={lesson.id}
                style={{
                  position: 'absolute',
                  left: '8px',
                  right: '8px',
                  width: 'calc(100% - 16px)',
                  ...lessonStyle,
                }}
              >
                <LessonCard lesson={lesson} onClick={onLessonClick} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DayGrid;
