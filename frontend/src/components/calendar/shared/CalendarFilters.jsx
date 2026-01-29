import PropTypes from 'prop-types';
import { useAppMode } from '../../../context/AppMode';
import { getEventTypeOptions, getStatusOptions } from '../../../lib/domain';
import { Icons } from '../../../lib/icons';

/**
 * CalendarFilters - Barre de filtres et actions (desktop uniquement)
 */
export default function CalendarFilters({
  filters,
  onFilterChange,
  onCreateEvent,
  onCreateBlockedTime,
  onShowScheduled,
}) {
  const { mode } = useAppMode();

  return (
    <div className="calendar-filters">
      {/* Filtres */}
      <div className="calendar-filters__group">
        <div className="calendar-filters__item">
          <label htmlFor="filter-event-type">Type</label>
          <select
            id="filter-event-type"
            className="form-select"
            value={filters.eventType}
            onChange={(e) => onFilterChange('eventType', e.target.value)}
          >
            <option value="">Tous</option>
            {getEventTypeOptions().map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="calendar-filters__item">
          <label htmlFor="filter-status">Statut</label>
          <select
            id="filter-status"
            className="form-select"
            value={filters.status}
            onChange={(e) => onFilterChange('status', e.target.value)}
          >
            <option value="">Tous</option>
            {getStatusOptions().map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Actions principales */}
      <div className="calendar-filters__actions">
        {mode === 'admin' && (
          <>
            <button
              className="btn btn-outline-primary btn-sm"
              onClick={onShowScheduled}
              title="Événements en attente"
            >
              <Icons.Calendar />
              Événements en attente
            </button>

            <button
              className="btn btn-modern danger"
              onClick={onCreateBlockedTime}
              title="Bloquer un créneau"
            >
              <Icons.Blocked /> Bloquer un créneau
            </button>
          </>
        )}

        <button className="btn btn-success btn-sm" onClick={onCreateEvent} title="Nouvel événement">
          <Icons.Add /> Ajouter
        </button>
      </div>
    </div>
  );
}

CalendarFilters.propTypes = {
  filters: PropTypes.shape({
    eventType: PropTypes.string,
    status: PropTypes.string,
  }).isRequired,
  onFilterChange: PropTypes.func.isRequired,
  onCreateEvent: PropTypes.func.isRequired,
  onCreateBlockedTime: PropTypes.func.isRequired,
  onShowScheduled: PropTypes.func.isRequired,
};
