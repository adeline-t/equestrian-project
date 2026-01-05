import React from 'react';

const PackageFilterButtons = ({ filter, onFilterChange, stats }) => {
  return (
    <div className="filter-buttons mb-20">
      <button
        className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
        onClick={() => onFilterChange('all')}
      >
        Tous ({stats.total})
      </button>
      <button
        className={`btn ${filter === 'active' ? 'btn-primary' : 'btn-secondary'}`}
        onClick={() => onFilterChange('active')}
      >
        Actifs ({stats.active})
      </button>
      <button
        className={`btn ${filter === 'inactive' ? 'btn-primary' : 'btn-secondary'}`}
        onClick={() => onFilterChange('inactive')}
      >
        Inactifs ({stats.inactive})
      </button>
    </div>
  );
};

export default PackageFilterButtons;