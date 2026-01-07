import React from 'react';
import { Icons } from '../../../lib/icons';
import { LAYOUT_STYLES } from '../../../lib/config/ui/cardStyles';
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
    <div className="day-grid" role="presentation">
      {/* Hour markers and labels */}
      <div className="hour-markers" role="presentation">
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
            role="presentation"
            onMouseDown={(e) => onMouseDown(e, hour, 0)}
            onMouseMove={(e) => onMouseMove(e, hour, 0)}
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
              aria-label={`${hour.toString().padStart(2, '0')}:00`}
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
          role="presentation"
          aria-hidden="true"
        />
      )}

      {/* Lessons */}
      {validLessons.length > 0 && (
        <div className="lessons-container" role="presentation">
          {validLessons.map((lesson) => {
            const lessonStyle = calculateLessonStyle(lesson);

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
                role="presentation"
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
