import React, { useMemo } from 'react';
import DayColumn from './DayColumn';
import { filterEvents } from '../../lib/helpers/domains/events/filters';
import '../../styles/components/calendar.css';

/**
 * WeekView Component
 * Displays a week grid with days and events from planning_slots + events
 */
function WeekView({ weekData, onEventClick, onQuickCreate, filters }) {
  // Filter events based on event_type and slot_status
  const filteredWeekData = useMemo(() => {
    if (!weekData?.days) return { days: [] };
    
    return {
      ...weekData,
      days: weekData.days.map((day) => ({
        ...day,
        events: filterEvents(day.events, filters),
      })),
    };
  }, [weekData, filters]);

  const hours = Array.from({ length: 14 }, (_, i) => i + 8); // 8h to 22h

  return (
    <div className="week-view" role="main" aria-label="Vue hebdomadaire du calendrier">
      <div className="week-grid" role="grid" aria-label="Grille de la semaine">
        {/* Time Column */}
        <div className="time-column" aria-hidden="true">
          <div className="time-header">Heures</div>
          {hours.map((hour) => (
            <div key={hour} className="time-slot">
              {hour}:00
            </div>
          ))}
        </div>

        {/* Day Columns */}
        {filteredWeekData.days.map((day) => (
          <DayColumn
            key={day.date}
            date={day.date}
            dayName={day.day_name}
            events={day.events}
            onEventClick={onEventClick}
            onQuickCreate={onQuickCreate}
          />
        ))}
      </div>
    </div>
  );
}

export default WeekView;
