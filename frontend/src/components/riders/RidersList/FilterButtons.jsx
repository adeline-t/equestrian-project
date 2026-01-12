import React from 'react';
import PropTypes from 'prop-types';
import {
  ACTIVITY_STATUS_FILTERS,
  RIDER_KIND_FILTERS,
} from '../../../lib/helpers/shared/filters/constants';
import '../../../styles/index.css';
import '../../../styles/components/list-view.css';

/**
 * Filter buttons for riders list
 * - Activity status (active / inactive / all)
 * - Rider kind (owner / club / boarder)
 */
function FilterButtons({
  activityFilter,
  riderKindFilter,
  stats,
  onActivityFilterChange,
  onRiderKindFilterChange,
}) {
  return (
    <div className="filter-buttons-wrapper mb-20">
      {/* Activity status filters */}
      <div className="filter-buttons">
        {[
          { value: ACTIVITY_STATUS_FILTERS.ACTIVE, label: `Actifs (${stats.active})` },
          { value: ACTIVITY_STATUS_FILTERS.INACTIVE, label: `Inactifs (${stats.inactive})` },
          { value: ACTIVITY_STATUS_FILTERS.ALL, label: `Tous (${stats.total})` },
        ].map((btn) => (
          <button
            key={btn.value}
            className={`btn ${activityFilter === btn.value ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => onActivityFilterChange(btn.value)}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Rider kind filters */}
      <div className="filter-buttons mt-10">
        {RIDER_KIND_FILTERS.map((filter) => (
          <button
            key={filter.value}
            className={`btn ${
              riderKindFilter === filter.value ? 'btn-outline-primary' : 'btn-outline-secondary'
            }`}
            onClick={() => onRiderKindFilterChange(filter.value)}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
}

FilterButtons.propTypes = {
  /** Activity filter value */
  activityFilter: PropTypes.oneOf([
    ACTIVITY_STATUS_FILTERS.ALL,
    ACTIVITY_STATUS_FILTERS.ACTIVE,
    ACTIVITY_STATUS_FILTERS.INACTIVE,
  ]).isRequired,

  /** Rider kind filter value */
  riderKindFilter: PropTypes.oneOf(RIDER_KIND_FILTERS.map((f) => f.value)).isRequired,

  /** Statistics for counters */
  stats: PropTypes.shape({
    total: PropTypes.number.isRequired,
    active: PropTypes.number.isRequired,
    inactive: PropTypes.number.isRequired,
  }).isRequired,

  /** Handlers */
  onActivityFilterChange: PropTypes.func.isRequired,
  onRiderKindFilterChange: PropTypes.func.isRequired,
};

export default FilterButtons;
