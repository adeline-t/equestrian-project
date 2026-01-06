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
        {/* Time column with hours */}
        <div className="time-column">
          <div className="time-header">
            <div className="time-header-content">
              <Icons.Clock />
              <div>Heure</div>
            </div>
          </div>
          {Array.from({ length: 14 }, (_, i) => i + 8).map((hour) => (
            <div key={hour} className="time-slot">
              <span className="time-label">{String(hour).padStart(2, '0')}h</span>
            </div>
          ))}
        </div>

        {/* Day columns */}
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
