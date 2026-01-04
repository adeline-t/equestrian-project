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
}

FilterButtons.propTypes = {
  filter: PropTypes.oneOf(['all', 'active', 'inactive']).isRequired,
  stats: PropTypes.shape({
    total: PropTypes.number.isRequired,
    active: PropTypes.number.isRequired,
    inactive: PropTypes.number.isRequired,
  }).isRequired,
  onFilterChange: PropTypes.func.isRequired,
};

export default FilterButtons;