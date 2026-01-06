import React from 'react';
import { Icons } from '../../../lib/libraries/icons.jsx';
import '../../../styles/components/calendar.css';

const CalendarHeader = ({ weekTitle, onPrevWeek, onNextWeek, onToday, stats }) => {
  return (
    <div className="calendar-header">
      {/* Top: Title with Navigation */}
      <div className="calendar-header-title">
        <div className="calendar-title-section">
          <h2 className="calendar-title">{weekTitle}</h2>
        </div>

        <div className="calendar-nav-buttons">
          <button
            className="btn btn-secondary btn-sm"
            onClick={onPrevWeek}
            title="Semaine précédente"
          >
            <Icons.ChevronLeft />
            <span className="btn-text">Précédente</span>
          </button>

          <button className="btn btn-primary" onClick={onToday} title="Aller à aujourd'hui">
            <Icons.Calendar />
            <span className="btn-text">Aujourd'hui</span>
          </button>

          <button
            className="btn btn-secondary btn-sm"
            onClick={onNextWeek}
            title="Semaine suivante"
          >
            <span className="btn-text">Suivante</span>
            <Icons.ChevronRight />
          </button>
        </div>
      </div>

      {/* Bottom: Stats */}
      <div className="calendar-header-bottom">
        <div className="calendar-stats-compact">
          <div className="stat-compact-item">
            <Icons.List style={{ fontSize: '0.9rem', color: '#2c5aa0' }} />
            <span className="stat-compact-value">{stats.total}</span>
            <span className="stat-compact-label">Total</span>
          </div>

          <div className="stat-compact-item">
            <Icons.Check style={{ fontSize: '0.9rem', color: '#22543d' }} />
            <span className="stat-compact-value">{stats.confirmed}</span>
            <span className="stat-compact-label">Confirmés</span>
          </div>

          <div className="stat-compact-item">
            <Icons.Blocked style={{ fontSize: '0.9rem', color: '#7c2d12' }} />
            <span className="stat-compact-value">{stats.blocked}</span>
            <span className="stat-compact-label">Bloqués</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarHeader;
