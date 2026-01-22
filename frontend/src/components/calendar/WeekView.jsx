import { isToday, parseISO } from 'date-fns';
import { useState } from 'react';
import { formatDate, minutesToTime } from '../../lib/helpers/formatters';
import '../../styles/features/calendar.css';
import DayColumn from './DayColumn';

function WeekView({ weekData, onSlotClick, onQuickCreate }) {
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);

  // Calendar hours (8h → 22h)
  const hours = Array.from({ length: 14 }, (_, i) => i + 8);

  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (touchStart === null) return;

    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    const swipeThreshold = 50;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0 && activeDayIndex < (weekData?.days?.length || 0) - 1) {
        setActiveDayIndex(activeDayIndex + 1);
      } else if (diff < 0 && activeDayIndex > 0) {
        setActiveDayIndex(activeDayIndex - 1);
      }
    }

    setTouchStart(null);
  };

  const handleTouchCancel = () => {
    setTouchStart(null);
  };

  if (!weekData?.days) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="week-view">
      <div className="week-grid desktop-view">
        <div className="time-column">
          <div className="time-header">Heures</div>
          {hours.map((hour) => (
            <div key={hour} className="time-slot">
              {minutesToTime(hour * 60)}
            </div>
          ))}
        </div>

        {weekData.days.map((day) => (
          <DayColumn
            key={day.date}
            date={day.date}
            dayName={day.day_name}
            slots={day.slots || []}
            onSlotClick={onSlotClick}
            onQuickCreate={onQuickCreate}
          />
        ))}
      </div>
    </div>
  );
}

export default WeekView;
