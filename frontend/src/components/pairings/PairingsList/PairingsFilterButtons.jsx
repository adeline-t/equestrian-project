import React from 'react';
import PropTypes from 'prop-types';
import { Icons } from '../../../lib/libraries/icons';
import '../../../styles/common/buttons.css';

function PairingsFilterButtons({ filter, stats, onFilterChange }) {
  return (
    <div className="filter-buttons mb-20">
      <button
        className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
        onClick={() => onFilterChange('all')}
      >
        Toutes ({stats.total})
      </button>
      <button
        className={`btn ${filter === 'active' ? 'btn-primary' : 'btn-secondary'}`}
        onClick={() => onFilterChange('active')}
      >
        <Icons.Check style={{ marginRight: '4px' }} />
        Actives ({stats.active})
      </button>
      <button
        className={`btn ${filter === 'inactive' ? 'btn-primary' : 'btn-secondary'}`}
        onClick={() => onFilterChange('inactive')}
      >
        <Icons.Close style={{ marginRight: '4px' }} />
        Inactives ({stats.inactive})
      </button>
    </div>
  );
}

PairingsFilterButtons.propTypes = {
  filter: PropTypes.oneOf(['all', 'active', 'inactive']).isRequired,
  stats: PropTypes.shape({
    total: PropTypes.number.isRequired,
    active: PropTypes.number.isRequired,
    inactive: PropTypes.number.isRequired,
  }).isRequired,
  onFilterChange: PropTypes.func.isRequired,
};

export default PairingsFilterButtons;