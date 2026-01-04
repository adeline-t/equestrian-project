import React from 'react';

const CalendarFilters = ({ filters, onFilterChange }) => {
  const lessonTypes = [
    { value: 'all', label: 'Tous les types' },
    { value: 'private', label: 'Cours Particulier' },
    { value: 'group', label: 'Cours Collectif' },
    { value: 'training', label: 'Stage' },
    { value: 'competition', label: 'Concours' },
    { value: 'event', label: 'Événement' },
  ];

  const statusOptions = [
    { value: 'all', label: 'Tous les statuts' },
    { value: 'scheduled', label: 'Planifiés' },
    { value: 'confirmed', label: 'Confirmés' },
    { value: 'completed', label: 'Terminés' },
    { value: 'cancelled', label: 'Annulés' },
  ];

  return (
    <div className="calendar-filters" style={{ marginBottom: '20px', padding: '16px', backgroundColor: '#f7fafc', borderRadius: '8px' }}>
      <div className="filters-row" style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div className="filter-group">
          <label style={{ fontSize: '0.875rem', marginBottom: '4px', display: 'block', color: '#4a5568' }}>
            Type de cours:
          </label>
          <select
            value={filters.lessonType}
            onChange={(e) => onFilterChange('lessonType', e.target.value)}
            className="form-select"
            style={{ minWidth: '180px', fontSize: '0.875rem' }}
          >
            {lessonTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label style={{ fontSize: '0.875rem', marginBottom: '4px', display: 'block', color: '#4a5568' }}>
            Statut:
          </label>
          <select
            value={filters.status}
            onChange={(e) => onFilterChange('status', e.target.value)}
            className="form-select"
            style={{ minWidth: '160px', fontSize: '0.875rem' }}
          >
            {statusOptions.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label style={{ fontSize: '0.875rem', display: 'flex', alignItems: 'center', cursor: 'pointer', color: '#4a5568' }}>
            <input
              type="checkbox"
              checked={filters.showBlocked}
              onChange={(e) => onFilterChange('showBlocked', e.target.checked)}
              style={{ marginRight: '8px', cursor: 'pointer' }}
            />
            Afficher les plages bloquées
          </label>
        </div>
      </div>
    </div>
  );
};

export default CalendarFilters;