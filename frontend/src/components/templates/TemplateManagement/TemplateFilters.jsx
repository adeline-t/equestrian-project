import React from 'react';

const TemplateFilters = ({ filters, onFilterChange, stats }) => {
  const lessonTypes = [
    { value: 'all', label: 'Tous les types' },
    { value: 'private', label: 'Cours Particulier' },
    { value: 'group', label: 'Cours Collectif' },
    { value: 'training', label: 'Stage' },
    { value: 'competition', label: 'Concours' },
    { value: 'event', label: 'Événement' },
    { value: 'blocked', label: 'Plage Bloquée' },
  ];

  const statusOptions = [
    { value: 'all', label: 'Tous les statuts' },
    { value: 'active', label: 'Actifs seulement' },
    { value: 'inactive', label: 'Inactifs seulement' },
  ];

  return (
    <div className="template-filters" style={{ marginBottom: '20px' }}>
      <div className="filter-row" style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '12px' }}>
        <div className="filter-group">
          <label>Statut:</label>
          <select
            value={filters.active}
            onChange={(e) => onFilterChange('active', e.target.value)}
            className="form-select"
            style={{ minWidth: '180px' }}
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Type de cours:</label>
          <select
            value={filters.lessonType}
            onChange={(e) => onFilterChange('lessonType', e.target.value)}
            className="form-select"
            style={{ minWidth: '200px' }}
          >
            {lessonTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="filter-stats" style={{ fontSize: '0.875rem', color: '#666' }}>
        {stats.total} template(s) trouvé(s) • 
        {stats.active} actif(s) • 
        {stats.inactive} inactif(s)
      </div>
    </div>
  );
};

export default TemplateFilters;