import React, { useMemo } from 'react';
import DayColumn from './DayColumn';
import { Icons } from '../../lib/icons';
import { filterLessons } from '../../lib/helpers/domains/lessons/filters';
import '../../styles/components/calendar.css';

function WeekView({ weekData, onLessonClick, onQuickCreate, filters }) {
  // Memoized filtered week data
  const filteredWeekData = useMemo(() => {
    if (!weekData || !weekData.days) return weekData;

    return {
      ...weekData,
      days: weekData.days.map((day) => ({
        ...day,
        lessons: filterLessons(day.lessons, filters),
      })),
    };
  }, [weekData, filters]);

  return (
    <div className="week-view" role="main" aria-label="Vue hebdomadaire du calendrier">
      <div className="week-grid" role="grid" aria-label="Grille de la semaine">
        {/* Time column with hours */}
        <div className="time-column" role="presentation">
          <div className="time-header" role="columnheader" aria-label="Colonne des heures">
            <div className="time-header-content">
              <Icons.Clock aria-hidden="true" />
              <div>Heure</div>
            </div>
          </div>
          {Array.from({ length: 14 }, (_, i) => i + 8).map((hour) => (
            <div
              key={hour}
              className="time-slot"
              role="rowheader"
              aria-label={`${String(hour).padStart(2, '0')}h`}
            >
              <span className="time-label">{String(hour).padStart(2, '0')}h</span>
            </div>
          ))}
        </div>

        {/* Day columns */}
        {filteredWeekData?.days?.map((day) => (
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
