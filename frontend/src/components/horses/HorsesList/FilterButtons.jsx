import React from 'react';
import PropTypes from 'prop-types';
import '../../../styles/common/buttons.css';

function FilterButtons({ filter, stats, onFilterChange }) {
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
}

FilterButtons.propTypes = {
  filter: PropTypes.oneOf(['all', 'horse', 'pony']).isRequired,
  stats: PropTypes.shape({
    total: PropTypes.number.isRequired,
    horses: PropTypes.number.isRequired,
    ponies: PropTypes.number.isRequired,
  }).isRequired,
  onFilterChange: PropTypes.func.isRequired,
};

export default FilterButtons;
