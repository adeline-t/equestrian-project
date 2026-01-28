import React from 'react';
import PropTypes from 'prop-types';
import { Icons } from '../../lib/icons';

/**
 * SearchInput - Composant de recherche réutilisable
 *
 * @param {string} value - Valeur actuelle de la recherche
 * @param {function} onChange - Callback appelé lors du changement
 * @param {string} placeholder - Texte du placeholder
 * @param {string} className - Classes CSS additionnelles
 */
function SearchInput({ value, onChange, placeholder = 'Rechercher...', className = '' }) {
  return (
    <div className={`form-group ${className}`}>
      <div style={{ position: 'relative' }}>
        <input
          type="text"
          className="form-input"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ paddingLeft: 'calc(var(--spacing-sm) * 4)' }}
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            style={{
              position: 'absolute',
              right: 'var(--spacing-sm)',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--color-text-muted)',
              padding: 'var(--spacing-xs)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 'var(--radius-md)',
              transition: 'all var(--transition-base)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--color-bg-hover)';
              e.currentTarget.style.color = 'var(--color-text)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'var(--color-text-muted)';
            }}
            aria-label="Effacer la recherche"
          >
            <Icons.Close style={{ fontSize: 'var(--font-size-base)' }} />
          </button>
        )}
      </div>
    </div>
  );
}

SearchInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  className: PropTypes.string,
};

export default SearchInput;
