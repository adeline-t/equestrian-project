import React from 'react';
import PropTypes from 'prop-types';
import {
  RECURRENCE_FREQUENCIES,
  WEEK_DAYS,
  getRecurrenceIntervalText,
} from '../../../constants/domains/templates';
import '../../../styles/common/forms.css';
import '../../../styles/components/templates.css';

function RecurrenceSection({ recurrenceRule, onRecurrenceChange, onDayToggle }) {
  return (
    <div className="form-section">
      <h3>Récurrence</h3>

      <div className="form-row">
        <div className="form-group">
          <label>Fréquence</label>
          <select
            value={recurrenceRule.frequency}
            onChange={(e) => onRecurrenceChange('frequency', e.target.value)}
            className="form-select"
          >
            {RECURRENCE_FREQUENCIES.map((freq) => (
              <option key={freq.value} value={freq.value}>
                {freq.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Intervalle</label>
          <input
            type="number"
            value={recurrenceRule.interval}
            onChange={(e) => onRecurrenceChange('interval', parseInt(e.target.value) || 1)}
            min="1"
            className="form-input"
          />
          <small className="text-muted">
            {getRecurrenceIntervalText(recurrenceRule.frequency, recurrenceRule.interval)}
          </small>
        </div>
      </div>

      {recurrenceRule.frequency === 'weekly' && (
        <div className="form-group">
          <label>Jours de la semaine *</label>
          <div className="day-selector">
            {WEEK_DAYS.map((day) => (
              <button
                key={day.value}
                type="button"
                className={`day-button ${
                  (recurrenceRule.byDay || []).includes(day.value) ? 'active' : ''
                }`}
                onClick={() => onDayToggle(day.value)}
              >
                {day.label}
              </button>
            ))}
          </div>
          {recurrenceRule.byDay?.length === 0 && (
            <small className="text-danger">
              ⚠️ Sélectionnez au moins un jour de la semaine
            </small>
          )}
        </div>
      )}
    </div>
  );
}

RecurrenceSection.propTypes = {
  recurrenceRule: PropTypes.shape({
    frequency: PropTypes.string.isRequired,
    interval: PropTypes.number.isRequired,
    byDay: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  onRecurrenceChange: PropTypes.func.isRequired,
  onDayToggle: PropTypes.func.isRequired,
};

export default RecurrenceSection;