import React from 'react';
import DayColumn from './DayColumn';
import { Icons } from '../../lib/libraries/icons.jsx';

function WeekView({ weekData, onLessonClick, onQuickCreate, filters }) {
  const filterLessons = (lessons) => {
    return lessons.filter((lesson) => {
      if (filters.lessonType !== 'all' && lesson.lesson_type !== filters.lessonType) {
        return false;
      }

      if (filters.status !== 'all' && lesson.status !== filters.status) {
        return false;
      }

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
          <div className="time-header">
            <Icons.Clock style={{ marginBottom: '4px' }} />
            <div>Heure</div>
          </div>
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
            onQuickCreate={onQuickCreate}
          />
        ))}
      </div>
    </div>
  );
}

export default WeekView;
