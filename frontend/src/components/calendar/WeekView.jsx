import PropTypes from 'prop-types';
import DayColumn from './DayColumn';
import { minutesToTime } from '../../lib/helpers';

/* -------------------------------------------------------
 * DEBUG FLAG (facile à désactiver)
 * ----------------------------------------------------- */
const DEBUG = true;

/* -------------------------------------------------------
 * WeekView Component
 * ----------------------------------------------------- */
function WeekView({ weekData, onSlotClick, onQuickCreate }) {
  const hours = Array.from({ length: 14 }, (_, i) => i + 8);

  /* ---------------- DEBUG: render ---------------- */
  if (DEBUG) {
    console.debug('[WeekView] render', {
      hasWeekData: !!weekData,
      daysCount: weekData?.days?.length,
    });
  }

  if (!weekData?.days) {
    if (DEBUG) {
      console.warn('[WeekView] weekData.days manquant', weekData);
    }
    return <div>Chargement...</div>;
  }

  /* ---------------- DEBUG: days summary ---------------- */
  if (DEBUG) {
    console.debug(
      '[WeekView] days summary',
      weekData.days.map((day) => ({
        date: day.date,
        dayName: day.day_name,
        slotsCount: day.slots?.length || 0,
      }))
    );
  }

  /* ---------------- handlers with debug ---------------- */
  const handleSlotClick = (slot) => {
    if (DEBUG) {
      console.debug('[WeekView] slot click', {
        slotId: slot?.id,
        start: slot?.start_time,
        duration: slot?.duration_minutes,
        eventType: slot?.events?.event_type,
      });
    }
    onSlotClick?.(slot);
  };

  const handleQuickCreate = (payload) => {
    if (DEBUG) {
      console.debug('[WeekView] quick create', payload);
    }
    onQuickCreate?.(payload);
  };

  return (
    <div className="week-view">
      <div className="week-grid desktop-view">
        {/* ================= TIME COLUMN ================= */}
        <div className="time-column">
          <div className="time-header">Heures</div>

          {/* spacer all-day */}
          <div className="time-all-day-spacer" />

          {hours.map((hour) => (
            <div key={hour} className="time-slot">
              {minutesToTime(hour * 60)}
            </div>
          ))}
        </div>

        {/* ================= DAY COLUMNS ================= */}
        {weekData.days.map((day) => (
          <DayColumn
            key={day.date}
            date={day.date}
            dayName={day.day_name}
            slots={day.slots || []}
            onSlotClick={handleSlotClick}
            onQuickCreate={handleQuickCreate}
          />
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------
 * PropTypes
 * ----------------------------------------------------- */
WeekView.propTypes = {
  weekData: PropTypes.shape({
    days: PropTypes.arrayOf(
      PropTypes.shape({
        date: PropTypes.string.isRequired,
        day_name: PropTypes.string,
        slots: PropTypes.array,
      })
    ),
  }),
  onSlotClick: PropTypes.func,
  onQuickCreate: PropTypes.func,
};

export default WeekView;
