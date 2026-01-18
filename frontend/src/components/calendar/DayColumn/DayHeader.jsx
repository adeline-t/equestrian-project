import React from 'react';
import { Icons } from '../../../lib/icons';
import { isToday, parseISO, format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { DATE_FORMATS } from '../../../lib/config/ui/constants';

const DayHeader = ({ date, dayName }) => {
  if (!date) {
    return (
      <div className="day-header" role="banner">
        <div className="day-name">
          <Icons.Warning style={{ marginRight: '4px' }} aria-hidden="true" />
          Date eronnée
        </div>
      </div>
    );
  }

  const dateObj = parseISO(date);
  const isCurrentDay = isToday(dateObj);

  // Format the date using the constant
  const formattedDate = format(dateObj, 'dd', { locale: fr });

  return (
    <div
      className={`day-header ${isCurrentDay ? 'today' : ''}`}
      role="banner"
      aria-label={`${dayName} ${formattedDate}${isCurrentDay ? " (aujourd'hui)" : ''}`}
    >
      <div className="day-name">
        {dayName} {formattedDate}
      </div>
      {isCurrentDay && (
        <div
          className="today-badge"
          style={{
            marginTop: '4px',
            padding: '2px 8px',
            backgroundColor: '#48bb78',
            color: 'white',
            borderRadius: '12px',
            fontSize: '0.75rem',
            display: 'inline-block',
          }}
          role="status"
          aria-label="Jour actuel"
        >
          Aujourd'hui
        </div>
      )}
    </div>
  );
};

export default DayHeader;
