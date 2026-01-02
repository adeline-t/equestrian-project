import React from 'react';
import LessonCard from '../lessons/LessonCard';
import { format, isToday, isPast, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Icons } from '../../utils/icons';

function DayColumn({ date, dayName, lessons, onLessonClick }) {
  if (!date) {
    return (
      <div className="day-column">
        <div className="day-header">
          <div className="day-name">
            <Icons.Warning style={{ marginRight: '4px' }} />
            Invalid Date
          </div>
        </div>
        <div className="day-grid">
          <div className="no-lessons">
            <Icons.Warning style={{ fontSize: '32px', marginBottom: '8px' }} />
            <p>Date invalide</p>
          </div>
        </div>
      </div>
    );
  }

  const dateObj = parseISO(date);
  const isCurrentDay = isToday(dateObj);
  const isPastDay = isPast(dateObj) && !isCurrentDay;

  const HOUR_HEIGHT = 60;
  const START_HOUR = 8;
  const END_HOUR = 22;

  const timeToMinutes = (timeStr) => {
    if (!timeStr) return 0;
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + (minutes || 0);
  };

  const calculateLessonStyle = (lesson) => {
    if (!lesson.start_time || !lesson.end_time) {
      return {
        top: '0px',
        height: '60px',
        minHeight: '60px',
      };
    }

    const startMinutes = timeToMinutes(lesson.start_time);
    const endMinutes = timeToMinutes(lesson.end_time);

    const startHour = startMinutes / 60;
    const top = (startHour - START_HOUR) * HOUR_HEIGHT;

    const durationMinutes = endMinutes - startMinutes;
    const height = (durationMinutes / 60) * HOUR_HEIGHT;

    return {
      top: `${Math.max(0, top)}px`,
      height: `${Math.max(30, height)}px`,
      minHeight: `${Math.max(30, height)}px`,
    };
  };

  const validLessons = (lessons || []).filter((lesson) => lesson.start_time && lesson.end_time);

  return (
    <div className={`day-column ${isCurrentDay ? 'today' : ''} ${isPastDay ? 'past' : ''}`}>
      <div className="day-header">
        <div className="day-name">{dayName}</div>
        <div className="day-date">
          <Icons.Calendar style={{ marginRight: '4px', fontSize: '12px' }} />
          {format(dateObj, 'dd MMM', { locale: fr })}
        </div>
        {isCurrentDay && (
          <span className="today-badge">
            <Icons.Check style={{ marginRight: '4px', fontSize: '10px' }} />
            Aujourd'hui
          </span>
        )}
      </div>

      <div className="day-grid">
        <div className="hour-markers">
          {Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, i) => START_HOUR + i).map(
            (hour) => (
              <div
                key={hour}
                className="hour-marker"
                style={{ top: `${(hour - START_HOUR) * HOUR_HEIGHT}px` }}
              >
                <span className="hour-label">
                  <Icons.Clock style={{ fontSize: '8px', marginRight: '2px' }} />
                  {`${hour}:00`}
                </span>
              </div>
            )
          )}
        </div>

        {validLessons.length === 0 ? (
          <div className="no-lessons">
            <Icons.Calendar style={{ fontSize: '32px', color: '#adb5bd', marginBottom: '8px' }} />
            <p>Aucun cours</p>
          </div>
        ) : (
          <div className="lessons-container">
            {validLessons.map((lesson) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                onClick={() => onLessonClick(lesson)}
                style={calculateLessonStyle(lesson)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default DayColumn;
