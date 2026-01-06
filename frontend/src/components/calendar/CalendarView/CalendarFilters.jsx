import React from 'react';
import { Icons } from '../../../lib/libraries/icons.jsx';

const CalendarFilters = ({ filters, onFilterChange, onCreateLesson, onCreateBlockedTime }) => {
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
    { value: 'cancelled', label: 'Annulés' },
  ];

  const handleCreateLesson = () => {
    console.log('Creating lesson from filters');
    onCreateLesson();
  };

  const handleCreateBlockedTime = () => {
    console.log('Creating blocked time from filters');
    onCreateBlockedTime();
  };

  return (
    <div className="calendar-filters">
      <div className="filters-row">
        {/* Filter Controls */}
        <div className="filters-controls">
          <div className="filter-group">
            <label>Type de cours:</label>
            <select
              value={filters.lessonType}
              onChange={(e) => onFilterChange('lessonType', e.target.value)}
              className="form-select"
            >
              {lessonTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Statut:</label>
            <select
              value={filters.status}
              onChange={(e) => onFilterChange('status', e.target.value)}
              className="form-select"
            >
              {statusOptions.map((status) => (
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
            onClick={handleCreateLesson}
            title="Créer un nouveau cours"
          >
            <Icons.Add />
            <span className="btn-text">Nouveau cours</span>
          </button>

          <button
            className="btn btn-warning"
            onClick={handleCreateBlockedTime}
            title="Bloquer un créneau"
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
