import React from 'react';
import LessonCard from './LessonCard';
import { format, isToday, isPast, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

function DayColumn({ date, dayName, lessons, onLessonClick }) {
  const dateObj = parseISO(date);
  const isCurrentDay = isToday(dateObj);
  const isPastDay = isPast(dateObj) && !isCurrentDay;

  return (
    <div className={`day-column ${isCurrentDay ? 'today' : ''} ${isPastDay ? 'past' : ''}`}>
      {/* En-tête du jour */}
      <div className="day-header">
        <div className="day-name">{dayName}</div>
        <div className="day-date">{format(dateObj, 'dd MMM', { locale: fr })}</div>
        {isCurrentDay && <span className="today-badge">Aujourd'hui</span>}
      </div>

      {/* Grille horaire */}
      <div className="day-grid">
        {lessons.length === 0 ? (
          <div className="no-lessons">
            <p>Aucun cours</p>
          </div>
        ) : (
          <div className="lessons-container">
            {lessons.map((lesson) => (
              <LessonCard key={lesson.id} lesson={lesson} onClick={() => onLessonClick(lesson)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default DayColumn;