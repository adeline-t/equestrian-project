import { isToday, parseISO } from 'date-fns';
import { formatDate } from '../../lib/helpers/formatters';
import { Icons } from '../../lib/icons';

export default function DayHeader({ date, dayName }) {
  if (!date) {
    return (
      <div className="day-header" role="banner">
        <div className="day-name">
          <Icons.Warning aria-hidden="true" />
          Date erronée
        </div>
      </div>
    );
  }

  const dateObj = parseISO(date);
  const isCurrentDay = isToday(dateObj);
  const formattedDate = formatDate(date, 'dd');

  return (
    <div
      className={`day-header ${isCurrentDay ? 'today' : ''}`}
      role="banner"
      aria-label={`${dayName} ${formattedDate}${isCurrentDay ? " (aujourd'hui)" : ''}`}
    >
      <div className="day-name">
        {dayName} {formattedDate}
      </div>
    </div>
  );
}
