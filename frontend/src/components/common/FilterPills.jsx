import React from 'react';
import PropTypes from 'prop-types';

/**
 * FilterPills - Composant de filtres pills réutilisable
 *
 * @param {Array} filters - Tableau d'objets de configuration des filtres
 *   Chaque filtre doit avoir: { value, label, icon (optionnel), count (optionnel) }
 * @param {string} selectedValue - Valeur actuellement sélectionnée
 * @param {function} onSelect - Callback appelé lors de la sélection
 * @param {string} className - Classes CSS additionnelles
 */
function FilterPills({ filters, selectedValue, onSelect, className = '' }) {
  return (
    <div className={`filter-pills ${className}`}>
      {filters.map((filter) => (
        <button
          key={filter.value}
          className={`pill ${selectedValue === filter.value ? 'pill-active' : ''}`}
          onClick={() => onSelect(filter.value)}
        >
          {filter.icon && <span style={{ fontSize: 'var(--font-size-sm)' }}>{filter.icon}</span>}
          {filter.label}
          {filter.count !== undefined && (
            <span
              className={`count-badge ${selectedValue === filter.value ? 'selected' : ''}`}
              style={{ marginLeft: 'var(--spacing-xs)' }}
            >
              {filter.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

FilterPills.propTypes = {
  filters: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.any.isRequired,
      label: PropTypes.string.isRequired,
      icon: PropTypes.node,
      count: PropTypes.number,
    })
  ).isRequired,
  selectedValue: PropTypes.any.isRequired,
  onSelect: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default FilterPills;
