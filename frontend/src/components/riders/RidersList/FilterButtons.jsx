import React from 'react';
import PropTypes from 'prop-types';
import { ACTIVITY_STATUS_FILTERS, RIDER_KIND_FILTERS } from '../../../lib/domains/filters';
import { getRiderKindConfig } from '../../../lib/domains/riders/kinds';
import '../../../styles/index.css';
import '../../../styles/components/list-view.css';
import '../../../styles/components/riders.css';

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
      <div className="kind-filter-pills">
        {RIDER_KIND_FILTERS.map((filter) => {
          const config = filter.value !== 'all' ? getRiderKindConfig(filter.value) : null;

          return (
            <button
              key={filter.value}
              className={`kind-pill ${riderKindFilter === filter.value ? 'kind-pill-active' : ''}`}
              onClick={() => onRiderKindFilterChange(filter.value)}
              data-kind={filter.value}
              data-gradient={config?.gradient || 'var(--gradient-secondary)'}
            >
              <span className="kind-pill-label">{filter.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

FilterButtons.propTypes = {
  activityFilter: PropTypes.oneOf([
    ACTIVITY_STATUS_FILTERS.ALL,
    ACTIVITY_STATUS_FILTERS.ACTIVE,
    ACTIVITY_STATUS_FILTERS.INACTIVE,
  ]).isRequired,
  riderKindFilter: PropTypes.oneOf(RIDER_KIND_FILTERS.map((f) => f.value)).isRequired,
  stats: PropTypes.shape({
    total: PropTypes.number.isRequired,
    active: PropTypes.number.isRequired,
    inactive: PropTypes.number.isRequired,
  }).isRequired,
  onActivityFilterChange: PropTypes.func.isRequired,
  onRiderKindFilterChange: PropTypes.func.isRequired,
};

export default FilterButtons;
