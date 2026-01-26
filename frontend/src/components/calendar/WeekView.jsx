import PropTypes from 'prop-types';
import { minutesToTime } from '../../lib/helpers/formatters';
import DayColumn from './DayColumn';

/* -------------------------------------------------------
 * DEBUG FLAG (facile à désactiver)
 * ----------------------------------------------------- */
const DEBUG = true;

/* -------------------------------------------------------
 * WeekView Component
 * ----------------------------------------------------- */
function WeekView({ weekData, onSlotClick, onQuickCreate }) {
  const hours = Array.from({ length: 14 }, (_, i) => i + 8);

  if (!weekData?.days) {
    return <div>Chargement...</div>;
  }

  const handleSlotClick = (slot, isSelectedSlotBlocked) => {
    onSlotClick?.(slot, isSelectedSlotBlocked);
  };

  const handleQuickCreate = (payload) => {
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
