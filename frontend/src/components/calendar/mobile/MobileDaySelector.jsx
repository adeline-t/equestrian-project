import PropTypes from 'prop-types';
import { format, isToday, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';

/**
 * MobileDaySelector - Sélecteur de jour de la semaine (mobile)
 */
export default function MobileDaySelector({ weekDays, selectedDate, getEventCount, onDayClick }) {
  return (
    <div className="mobile-day-selector">
      {weekDays.map((date) => {
        const eventCount = getEventCount(date);
        const isSelected = isSameDay(date, selectedDate);
        const isTodayDate = isToday(date);

        return (
          <button
            key={format(date, 'yyyy-MM-dd')}
            className={`mobile-day-selector__button
              ${isSelected ? 'mobile-day-selector__button--selected' : ''}
              ${isTodayDate ? 'mobile-day-selector__button--today' : ''}
            `}
            onClick={() => onDayClick(date)}
            aria-label={`${format(date, 'EEEE d MMMM', { locale: fr })}${
              isTodayDate ? " (aujourd'hui)" : ''
            }`}
            aria-pressed={isSelected}
          >
            <span className="mobile-day-selector__day-name">
              {format(date, 'EEE', { locale: fr })}
            </span>
            <span className="mobile-day-selector__day-number">{format(date, 'd')}</span>
            <span className="mobile-day-selector__event-count">
              {eventCount > 0 ? `${eventCount}` : ''}
            </span>
          </button>
        );
      })}
    </div>
  );
}

MobileDaySelector.propTypes = {
  weekDays: PropTypes.arrayOf(PropTypes.instanceOf(Date)).isRequired,
  selectedDate: PropTypes.instanceOf(Date).isRequired,
  getEventCount: PropTypes.func.isRequired,
  onDayClick: PropTypes.func.isRequired,
};
