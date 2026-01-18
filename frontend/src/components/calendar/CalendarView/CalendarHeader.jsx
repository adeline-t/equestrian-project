import React from 'react';
import { Icons } from '../../../lib/icons';
import '../../../styles/components/calendar.css';

/**
 * Calendar Header Component
 * Updated for new schema - stats now based on planning_slots.slot_status and events.event_type
 */
const CalendarHeader = ({ weekTitle, onPrevWeek, onNextWeek, onToday, stats }) => {
  return (
    <div className="calendar-header" role="banner">
      {/* Top: Title with Navigation */}
      <div className="calendar-header-title">
        <div className="calendar-title-section">
          <h2 className="calendar-title">{weekTitle}</h2>
        </div>

        <div className="calendar-nav-buttons" role="group" aria-label="Navigation de la semaine">
          <button
            className="btn btn-secondary btn-sm"
            onClick={onPrevWeek}
            title="Semaine précédente"
            aria-label="Aller à la semaine précédente"
          >
            <Icons.ChevronLeft />
            <span className="btn-text">Précédente</span>
          </button>

          <button
            className="btn btn-primary"
            onClick={onToday}
            title="Aller à aujourd'hui"
            aria-label="Aller à la semaine actuelle"
          >
            <Icons.Calendar />
            <span className="btn-text">Aujourd'hui</span>
          </button>

          <button
            className="btn btn-secondary btn-sm"
            onClick={onNextWeek}
            title="Semaine suivante"
            aria-label="Aller à la semaine suivante"
          >
            <span className="btn-text">Suivante</span>
            <Icons.ChevronRight />
          </button>
        </div>
      </div>

      {/* Bottom: Stats */}
      <div className="calendar-header-bottom">
        <div
          className="calendar-stats-compact"
          role="region"
          aria-label="Statistiques de la semaine"
        >
          <div className="stat-compact-item">
            <Icons.List style={{ fontSize: '0.9rem', color: '#2c5aa0' }} aria-hidden="true" />
            <span className="stat-compact-value">{stats.total || 0}</span>
            <span className="stat-compact-label">Total</span>
          </div>

          <div className="stat-compact-item">
            <Icons.Check style={{ fontSize: '0.9rem', color: '#22543d' }} aria-hidden="true" />
            <span className="stat-compact-value">{stats.confirmed || 0}</span>
            <span className="stat-compact-label">Confirmés</span>
          </div>

          <div className="stat-compact-item">
            <Icons.Blocked style={{ fontSize: '0.9rem', color: '#7c2d12' }} aria-hidden="true" />
            <span className="stat-compact-value">{stats.blocked || 0}</span>
            <span className="stat-compact-label">Bloqués</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarHeader;
