import PropTypes from 'prop-types';
import { Icons } from '../../../lib/icons';

/**
 * CalendarHeader - En-tête avec navigation semaine
 */
export default function CalendarHeader({ weekTitle, onPrevWeek, onNextWeek, onToday }) {
  return (
    <div className="calendar-header">
      <h2 className="calendar-header__title">{weekTitle}</h2>
      <div className="calendar-header__nav">
        <button
          className="btn btn-secondary btn-md"
          onClick={onPrevWeek}
          title="Semaine précédente"
          aria-label="Semaine précédente"
        >
          <Icons.ChevronLeft />
        </button>
        <button
          className="btn btn-primary btn-md"
          onClick={onToday}
          aria-label="Retour à aujourd'hui"
        >
          Aujourd'hui
        </button>
        <button
          className="btn btn-secondary btn-md"
          onClick={onNextWeek}
          title="Semaine suivante"
          aria-label="Semaine suivante"
        >
          <Icons.ChevronRight />
        </button>
      </div>
    </div>
  );
}

CalendarHeader.propTypes = {
  weekTitle: PropTypes.string.isRequired,
  onPrevWeek: PropTypes.func.isRequired,
  onNextWeek: PropTypes.func.isRequired,
  onToday: PropTypes.func.isRequired,
};
