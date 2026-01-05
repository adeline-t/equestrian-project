import React from 'react';
import { Icons } from '../../../lib/libraries/icons.jsx';
import { isToday, parseISO } from 'date-fns';

const DayHeader = ({ date, dayName }) => {
  if (!date) {
    return (
      <div className="day-header">
        <div className="day-name">
          <Icons.Warning style={{ marginRight: '4px' }} />
          Date eronnée
        </div>
      </div>
    );
  }

  const dateObj = parseISO(date);
  const isCurrentDay = isToday(dateObj);

  return (
    <div className={`day-header ${isCurrentDay ? 'today' : ''}`}>
      <div className="day-name">{dayName}</div>
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
        >
          Aujourd'hui
        </div>
      )}
    </div>
  );
};

export default DayHeader;
