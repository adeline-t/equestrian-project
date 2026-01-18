import React from 'react';
import PropTypes from 'prop-types';
import { Icons } from '../../../lib/icons.jsx';

/**
 * Calendar Error State Component
 */
function CalendarError({ error, onRetry }) {
  return (
    <div className="calendar-error" role="alert">
      <Icons.Warning style={{ fontSize: '48px', marginBottom: '16px', color: '#e53e3e' }} />
      <h3>Erreur de chargement</h3>
      <p>{error}</p>
      <button className="btn btn-primary" onClick={onRetry} aria-label="Réessayer le chargement">
        <Icons.Repeat /> Réessayer
      </button>
    </div>
  );
}

CalendarError.propTypes = {
  error: PropTypes.string.isRequired,
  onRetry: PropTypes.func.isRequired,
};

export default CalendarError;
