import PropTypes from 'prop-types';
import { isToday, parseISO } from 'date-fns';
import { formatDate } from '../../../lib/helpers/formatters';
import { Icons } from '../../../lib/icons';

/**
 * DesktopDayHeader - En-tête d'une colonne jour (desktop)
 */
export default function DesktopDayHeader({ date, dayName }) {
  if (!date) {
    return (
      <div className="desktop-day-header desktop-day-header--invalid" role="banner">
        <div className="desktop-day-header__name">
          <Icons.Warning aria-hidden="true" />
          Date erronée
        </div>
      </div>
    );
  }

  const dateObj = parseISO(date);
  const isCurrentDay = isToday(dateObj);
  const formattedDate = formatDate(date, 'dd');
  const displayName = dayName || format(dateObj, 'EEEE', { locale: fr });

  return (
    <div
      className={`desktop-day-header ${isCurrentDay ? 'desktop-day-header--today' : ''}`}
      role="banner"
      aria-label={`${dayName} ${formattedDate}${isCurrentDay ? " (aujourd'hui)" : ''}`}
    >
      <div className="desktop-day-header__name">
        {displayName} {formattedDate}
      </div>
    </div>
  );
}

DesktopDayHeader.propTypes = {
  date: PropTypes.string,
  dayName: PropTypes.string.isRequired,
};
