import PropTypes from 'prop-types';
import { minutesToTime } from '../../../lib/helpers/formatters';
import { CALENDAR_CONFIG } from '../../../lib/domain';

/**
 * DesktopTimeColumn - Colonne des heures (desktop)
 */
export default function DesktopTimeColumn() {
  const { HOUR_HEIGHT, START_HOUR, END_HOUR } = CALENDAR_CONFIG;
  const hours = Array.from({ length: END_HOUR - START_HOUR }, (_, i) => START_HOUR + i);

  return (
    <div className="desktop-time-column">
      <div className="desktop-time-column__header">Heures</div>

      {/* Spacer pour aligner avec all-day section */}
      <div className="desktop-time-column__allday-spacer" />

      {/* Heures */}
      {hours.map((hour) => (
        <div key={hour} className="desktop-time-column__slot">
          {minutesToTime(hour * 60)}
        </div>
      ))}
    </div>
  );
}
