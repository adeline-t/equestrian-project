import React from 'react';
import DayColumn from './DayColumn';

function WeekView({ weekData, onLessonClick, filters }) {
  // Filtrer les cours selon les filtres actifs
  const filterLessons = (lessons) => {
    return lessons.filter((lesson) => {
      // Filtre par type
      if (filters.lessonType !== 'all' && lesson.lesson_type !== filters.lessonType) {
        return false;
      }

      // Filtre par statut
      if (filters.status !== 'all' && lesson.status !== filters.status) {
        return false;
      }

      // Filtre plages bloquées
      if (!filters.showBlocked && lesson.lesson_type === 'blocked') {
        return false;
      }

      return true;
    });
  };

  return (
    <div className="week-view">
      <div className="week-grid">
        {/* Colonne des heures */}
        <div className="time-column">
          <div className="time-header">Heure</div>
          {Array.from({ length: 14 }, (_, i) => i + 8).map((hour) => (
            <div key={hour} className="time-slot">
              {String(hour).padStart(2, '0')}:00
            </div>
          ))}
        </div>

        {/* Colonnes des jours */}
        {weekData.days.map((day) => (
          <DayColumn
            key={day.date}
            date={day.date}
            dayName={day.day_name}
            lessons={filterLessons(day.lessons)}
            onLessonClick={onLessonClick}
          />
        ))}
      </div>
    </div>
  );
}

export default WeekView;