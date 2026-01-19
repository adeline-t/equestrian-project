import React, { useMemo, useState } from 'react';
import { format, parseISO, isToday } from 'date-fns';
import { fr } from 'date-fns/locale';
import DayColumn from './DayColumn';
import '../../styles/components/calendar.css';

/**
 * WeekView Component
 * Displays a week grid with days and slots from planning_slots + events
 */
function WeekView({ weekData, onEventClick, onQuickCreate, filters }) {
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);

  // Normaliser et enrichir les données
  const normalizedWeekData = useMemo(() => {
    if (!weekData?.days) return { days: [] };
    return {
      ...weekData,
      days: weekData.days.map((day) => {
        // Calculer day_name si manquant
        const dayName = day.day_name || format(parseISO(day.date), 'EEEE', { locale: fr });
        return {
          ...day,
          day_name: dayName,
          // Ensure we always pass an array to DayColumn
          slots: day.slots || [],
        };
      }),
    };
  }, [weekData]);

  const hours = Array.from({ length: 14 }, (_, i) => i + 8); // 8h to 22h

  // Gestion du swipe pour mobile
  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (touchStart === null) return;

    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    const swipeThreshold = 50; // Seuil minimum de 50px pour déclencher le swipe

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0 && activeDayIndex < normalizedWeekData.days.length - 1) {
        // Swipe vers la gauche = jour suivant
        setActiveDayIndex(activeDayIndex + 1);
      } else if (diff < 0 && activeDayIndex > 0) {
        // Swipe vers la droite = jour précédent
        setActiveDayIndex(activeDayIndex - 1);
      }
    }

    setTouchStart(null);
  };

  const handleTouchCancel = () => {
    setTouchStart(null);
  };

  return (
    <div className="week-view" role="main" aria-label="Vue hebdomadaire du calendrier">
      {/* Navigation mobile des jours */}
      <div className="mobile-days-nav">
        {normalizedWeekData.days.map((day, index) => {
          const isActive = index === activeDayIndex;
          const dateObj = parseISO(day.date);
          const isCurrentDay = isToday(dateObj);

          return (
            <button
              key={day.date}
              className={`mobile-day-tab ${isActive ? 'active' : ''} ${
                isCurrentDay ? 'today' : ''
              }`}
              onClick={() => setActiveDayIndex(index)}
            >
              <div className="mobile-day-name">{day.day_name}</div>
              <div className="mobile-day-date">{format(dateObj, 'dd', { locale: fr })}</div>
            </button>
          );
        })}
      </div>

      {/* Grille hebdomadaire (desktop) */}
      <div className="week-grid desktop-view" role="grid" aria-label="Grille de la semaine">
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
            slots={day.slots}
            onEventClick={onEventClick}
            onQuickCreate={onQuickCreate}
            filters={filters}
          />
        ))}
      </div>

      {/* Vue mobile - un seul jour à la fois */}
      <div
        className="mobile-day-view"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchCancel}
      >
        {normalizedWeekData.days[activeDayIndex] && (
          <DayColumn
            date={normalizedWeekData.days[activeDayIndex].date}
            dayName={normalizedWeekData.days[activeDayIndex].day_name}
            slots={normalizedWeekData.days[activeDayIndex].slots}
            onEventClick={onEventClick}
            onQuickCreate={onQuickCreate}
            filters={filters}
          />
        )}
      </div>
    </div>
  );
}

export default WeekView;
