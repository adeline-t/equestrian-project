import React from 'react';
import { Icons } from '../../../../lib/libraries/icons';

const DayGrid = ({ 
  lessons, 
  onLessonClick, 
  selectionStyle,
  isSelecting,
  validLessons,
  calculateLessonStyle 
}) => {
  return (
    <div 
      className="day-grid" 
      style={{ 
        position: 'relative', 
        minHeight: '840px', // 14 hours * 60px
        backgroundColor: '#fafafa',
        border: '1px solid #e2e8f0',
        borderRadius: '0 0 8px 8px'
      }}
    >
      {/* Time slots */}
      {Array.from({ length: 14 }, (_, i) => {
        const hour = 8 + i;
        return (
          <div
            key={hour}
            className="time-slot"
            style={{
              position: 'absolute',
              top: `${i * 60}px`,
              left: 0,
              right: 0,
              height: '60px',
              borderTop: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              paddingLeft: '8px',
              fontSize: '0.75rem',
              color: '#718096',
              backgroundColor: hour % 2 === 0 ? '#f7fafc' : 'white'
            }}
          >
            {hour.toString().padStart(2, '0')}:00
          </div>
        );
      })}

      {/* Selection overlay */}
      {isSelecting && selectionStyle && (
        <div 
          style={{
            position: 'absolute',
            backgroundColor: 'rgba(66, 153, 225, 0.2)',
            border: '2px solid #4299e1',
            borderRadius: '4px',
            zIndex: 10,
            pointerEvents: 'none',
            ...selectionStyle
          }} 
        />
      )}

      {/* Lessons */}
      {validLessons.length === 0 ? (
        <div 
          className="no-lessons" 
          style={{ 
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            color: '#a0aec0'
          }}
        >
          <Icons.Calendar style={{ fontSize: '32px', color: '#adb5bd', marginBottom: '8px' }} />
          <p style={{ margin: 0, fontSize: '0.875rem' }}>
            Cliquez et glissez pour créer un cours
          </p>
        </div>
      ) : (
        <div className="lessons-container" style={{ position: 'relative' }}>
          {validLessons.map((lesson) => (
            <div
              key={lesson.id}
              style={{
                position: 'absolute',
                ...calculateLessonStyle(lesson),
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onClick={() => onLessonClick(lesson)}
            >
              {/* This would be the actual lesson card content */}
              <div style={{
                padding: '4px 8px',
                fontSize: '0.75rem',
                borderRadius: '4px',
                backgroundColor: getLessonColor(lesson.lesson_type),
                color: 'white',
                height: '100%',
                overflow: 'hidden'
              }}>
                <div style={{ fontWeight: 'bold' }}>
                  {lesson.start_time} - {lesson.end_time}
                </div>
                <div style={{ fontSize: '0.7rem' }}>
                  {lesson.name || 'Cours'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Helper function for lesson colors
const getLessonColor = (lessonType) => {
  const colors = {
    private: '#4299e1',
    group: '#48bb78',
    training: '#ed8936',
    competition: '#9f7aea',
    event: '#f56565',
    blocked: '#718096'
  };
  return colors[lessonType] || '#718096';
};

export default DayGrid;