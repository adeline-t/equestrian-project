import React from 'react';
import { Icons } from '../../../lib/icons.jsx';

/**
 * Calendar Loading State Component
 */
function CalendarLoading() {
  return (
    <div className="calendar-loading" role="status" aria-live="polite">
      <Icons.Loading className="spin" style={{ fontSize: '48px', marginBottom: '16px' }} />
      <h3>Chargement du calendrier...</h3>
      <p>Veuillez patienter pendant que nous chargeons vos cours</p>
    </div>
  );
}

export default CalendarLoading;
