import React from 'react';
import LessonCard from '../lessons/LessonCard';
import { format, isToday, isPast, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

function DayColumn({ date, dayName, lessons, onLessonClick }) {
  // Add null check for date
  if (!date) {
    return (
      <div className="day-column">
        <div className="day-header">
          <div className="day-name">Invalid Date</div>
        </div>
        <div className="day-grid">
          <div className="no-lessons">
            <p>Date invalide</p>
          </div>
        </div>
      </div>
    );
  }

  const dateObj = parseISO(date);
  const isCurrentDay = isToday(dateObj);
  const isPastDay = isPast(dateObj) && !isCurrentDay;

  // Configuration de la grille horaire
  const HOUR_HEIGHT = 60; // pixels par heure
  const START_HOUR = 8; // Début de la grille (6h du matin)
  const END_HOUR = 22; // Fin de la grille (22h)

  /**
   * Convertit un temps "HH:MM:SS" en minutes depuis minuit
   */
  const timeToMinutes = (timeStr) => {
    if (!timeStr) return 0;
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + (minutes || 0);
  };

  /**
   * Calcule la position et la hauteur d'un cours
   */
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

    // Position depuis le début de la grille
    const startHour = startMinutes / 60;
    const top = (startHour - START_HOUR) * HOUR_HEIGHT;

    // Hauteur basée sur la durée
    const durationMinutes = endMinutes - startMinutes;
    const height = (durationMinutes / 60) * HOUR_HEIGHT;

    return {
      top: `${Math.max(0, top)}px`,
      height: `${Math.max(30, height)}px`, // Minimum 30px height
      minHeight: `${Math.max(30, height)}px`,
    };
  };

  // Filter out lessons with invalid times
  const validLessons = (lessons || []).filter((lesson) => lesson.start_time && lesson.end_time);

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
        {/* Marqueurs d'heures (optionnel) */}
        <div className="hour-markers">
          {Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, i) => START_HOUR + i).map(
            (hour) => (
              <div
                key={hour}
                className="hour-marker"
                style={{ top: `${(hour - START_HOUR) * HOUR_HEIGHT}px` }}
              >
                <span className="hour-label">{`${hour}:00`}</span>
              </div>
            )
          )}
        </div>

        {validLessons.length === 0 ? (
          <div className="no-lessons">
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
