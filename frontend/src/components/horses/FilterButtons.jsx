import React from 'react';

const FilterButtons = ({ filter, onFilterChange, stats }) => {
  return (
    <div className="filter-buttons mb-20">
      <button
        className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
        onClick={() => onFilterChange('all')}
      >
        Tous ({stats.total})
      </button>
      <button
        className={`btn ${filter === 'horse' ? 'btn-primary' : 'btn-secondary'}`}
        onClick={() => onFilterChange('horse')}
      >
        Chevaux ({stats.horses})
      </button>
      <button
        className={`btn ${filter === 'pony' ? 'btn-primary' : 'btn-secondary'}`}
        onClick={() => onFilterChange('pony')}
      >
        Poneys ({stats.ponies})
      </button>
    </div>
  );
};

export default FilterButtons;