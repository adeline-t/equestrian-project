import { CALENDAR_EVENT_TYPE_FILTERS, CALENDAR_STATUS_FILTERS } from '../../../lib/domains/filters';
import { Icons } from '../../../lib/icons';
import '../../../styles/common/index.css';
import '../../../styles/components/calendar.css';

/**
 * Calendar Filters Component
 * Updated for new schema:
 * - event_type: event, event, blocked, service, loaner_free_time
 * - slot_status: scheduled, confirmed, completed, cancelled
 */
const CalendarFilters = ({ filters, onFilterChange, onCreateEvent, onCreateBlockedTime }) => {
  const handleCreateEvent = () => {
    onCreateEvent();
  };

  const handleCreateBlockedTime = () => {
    onCreateBlockedTime();
  };

  return (
    <div className="calendar-filters" role="region" aria-label="Filtres du calendrier">
      <div className="filters-row">
        {/* Filter Controls */}
        <div className="filters-controls">
          <div className="filter-group">
            <label htmlFor="event-type-filter">Type de cours:</label>
            <select
              id="event-type-filter"
              value={filters.eventType}
              onChange={(e) => onFilterChange('eventType', e.target.value)}
              className="form-select"
              aria-label="Filtrer par type de cours"
            >
              {CALENDAR_EVENT_TYPE_FILTERS.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="status-filter">Statut:</label>
            <select
              id="status-filter"
              value={filters.status}
              onChange={(e) => onFilterChange('status', e.target.value)}
              className="form-select"
              aria-label="Filtrer par statut"
            >
              {CALENDAR_STATUS_FILTERS.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="filters-actions">
          <button
            className="btn btn-success"
            onClick={handleCreateEvent}
            title="Créer un nouveau cours"
            aria-label="Créer un nouveau cours"
          >
            <Icons.Add />
            <span className="btn-text">Nouveau cours</span>
          </button>

          <button
            className="btn btn-warning"
            onClick={handleCreateBlockedTime}
            title="Bloquer un créneau"
            aria-label="Bloquer un créneau horaire"
          >
            <Icons.Blocked />
            <span className="btn-text">Bloquer un créneau</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalendarFilters;
