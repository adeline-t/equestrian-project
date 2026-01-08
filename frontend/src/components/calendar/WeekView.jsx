import React, { useMemo } from 'react';
import DayColumn from './DayColumn';
import { filterLessons } from '../../lib/helpers/domains/lessons/filters';
import '../../styles/components/calendar.css';

function WeekView({ weekData, onLessonClick, onQuickCreate, filters }) {
  const filteredWeekData = useMemo(() => {
    if (!weekData?.days) return { days: [] };
    return {
      ...weekData,
      days: weekData.days.map((day) => ({
        ...day,
        lessons: filterLessons(day.lessons, filters),
      })),
    };
  }, [weekData, filters]);

  const hours = Array.from(
    { length: 24 - 8 }, // de 8h à 22h, ou utiliser vos variables CSS si nécessaire
    (_, i) => i + 8
  );

  return (
    <div className="week-view" role="main" aria-label="Vue hebdomadaire du calendrier">
      <div className="week-grid" role="grid" aria-label="Grille de la semaine">
        {/* COLONNE DES HEURES */}
        <div className="time-column" aria-hidden="true">
          <div className="time-header">Heures</div>
          {hours.map((hour) => (
            <div key={hour} className="time-slot">
              {hour}:00
            </div>
          ))}
        </div>

        {/* COLONNES DES JOURS */}
        {filteredWeekData.days.map((day) => (
          <DayColumn
            key={day.date}
            date={day.date}
            dayName={day.day_name}
            lessons={day.lessons}
            onLessonClick={onLessonClick}
            onQuickCreate={onQuickCreate}
          />
        ))}
      </div>
    </div>
  );
}

export default WeekView;
