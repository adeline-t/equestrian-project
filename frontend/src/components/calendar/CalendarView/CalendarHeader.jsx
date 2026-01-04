import React from 'react';
import { Icons } from '../../../lib/libraries/icons';

const CalendarHeader = ({ 
  weekTitle, 
  onPrevWeek, 
  onNextWeek, 
  onToday,
  onCreateLesson,
  onCreateBlockedTime,
  stats 
}) => {
  return (
    <div className="calendar-header" style={{ marginBottom: '20px' }}>
      <div className="header-top" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2 style={{ margin: 0, fontSize: '1.5rem' }}>
          {weekTitle}
        </h2>
        
        <div className="header-actions" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button 
            className="btn btn-secondary" 
            onClick={onPrevWeek}
            title="Semaine précédente"
          >
            <Icons.ChevronLeft /> Semaine préc.
          </button>
          
          <button 
            className="btn btn-primary" 
            onClick={onToday}
            title="Aujourd'hui"
          >
            <Icons.Calendar /> Aujourd'hui
          </button>
          
          <button 
            className="btn btn-secondary" 
            onClick={onNextWeek}
            title="Semaine suivante"
          >
            Semaine suiv. <Icons.ChevronRight />
          </button>
        </div>
      </div>

      <div className="header-stats-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="stats" style={{ display: 'flex', gap: '16px', fontSize: '0.875rem', color: '#666' }}>
          <span>
            <Icons.List style={{ marginRight: '4px' }} />
            {stats.total} cours au total
          </span>
          <span>
            <Icons.Check style={{ marginRight: '4px', color: '#48bb78' }} />
            {stats.confirmed} confirmés
          </span>
          <span>
            <Icons.Blocked style={{ marginRight: '4px', color: '#ed8936' }} />
            {stats.blocked} bloqués
          </span>
        </div>

        <div className="create-actions" style={{ display: 'flex', gap: '8px' }}>
          <button 
            className="btn btn-success" 
            onClick={onCreateLesson}
            title="Créer un cours"
          >
            <Icons.Add /> Nouveau cours
          </button>
          
          <button 
            className="btn btn-warning" 
            onClick={onCreateBlockedTime}
            title="Ajouter une plage bloquée"
          >
            <Icons.Blocked /> Bloquer un créneau
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalendarHeader;