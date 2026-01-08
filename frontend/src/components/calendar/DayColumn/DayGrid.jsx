import React from 'react';
import LessonCard from './LessonCard/index.jsx';

const DayGrid = ({
  lessons,
  onLessonClick,
  selectionStyle,
  isSelecting,
  calculateLessonStyle,
  onMouseDown,
  onMouseMove,
  HOUR_HEIGHT = 60,
  START_HOUR = 8,
  END_HOUR = 22,
}) => {
  const hours = Array.from({ length: END_HOUR - START_HOUR }, (_, i) => START_HOUR + i);
  const validLessons = lessons || [];

  return (
    <div className="day-grid">
      {/* Hour markers */}
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
            }}
            onMouseDown={(e) => onMouseDown(e, hour, 0)}
            onMouseMove={(e) => onMouseMove(e, hour, 0)}
          ></div>
        ))}
      </div>

      {/* Selection overlay */}
      {isSelecting && selectionStyle && (
        <div
          className="selection-overlay"
          style={{
            position: 'absolute',
            backgroundColor: 'rgba(66,153,225,0.2)',
            border: '2px solid #4299e1',
            borderRadius: 4,
            zIndex: 10,
            pointerEvents: 'none',
            left: 8,
            right: 8,
            width: 'calc(100% - 16px)',
            ...selectionStyle,
          }}
        />
      )}

      {/* Lessons */}
      {validLessons.length > 0 && (
        <div className="lessons-container">
          {validLessons.map((lesson) => (
            <div
              key={lesson.id}
              style={{
                position: 'absolute',
                left: 0,
                right: 4,
                width: 'calc(100% - 4px)',
                ...calculateLessonStyle(lesson),
              }}
            >
              <LessonCard lesson={lesson} onClick={onLessonClick} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DayGrid;
