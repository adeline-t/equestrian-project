import React, { useMemo } from 'react';
import DayColumn from './DayColumn';
import '../../styles/components/calendar.css';

/**
 * WeekView Component
 * Displays a week grid with days and slots from planning_slots + events
 */
function WeekView({ weekData, onEventClick, onQuickCreate, filters }) {
  // If weekData is already filtered by the hook, just normalize the shape
  const normalizedWeekData = useMemo(() => {
    if (!weekData?.days) return { days: [] };

    return {
      ...weekData,
      days: weekData.days.map((day) => ({
        ...day,
        // Ensure we always pass an array to DayColumn
        slots: day.slots || [],
      })),
    };
  }, [weekData]);

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
        {normalizedWeekData.days.map((day) => (
          <DayColumn
            key={day.date}
            date={day.date}
            dayName={day.day_name}
            // Use slots, since your hook exposes day.slots
            slots={day.slots}
            onEventClick={onEventClick}
            onQuickCreate={onQuickCreate}
            filters={filters}
          />
        ))}
      </div>
    </div>
  );
}

export default WeekView;
