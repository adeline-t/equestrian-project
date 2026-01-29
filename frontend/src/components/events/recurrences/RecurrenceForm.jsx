import { useState } from 'react';
import PropTypes from 'prop-types';
import { Icons } from '../../..//lib/icons';
import { WEEK_DAYS } from '..//../../lib/domain/domain-constants';

const FREQUENCY_OPTIONS = [
  { value: 'daily', label: 'Quotidien' },
  { value: 'weekly', label: 'Hebdomadaire' },
  { value: 'monthly', label: 'Mensuel' },
];

export default function RecurrenceForm({ onSave, onCancel, saving, saveError, slotData }) {
  const [formData, setFormData] = useState({
    frequency: 'weekly',
    interval: 1,
    week_days: [],
    start_time: slotData?.start_time || '09:00',
    end_time: slotData?.end_time || '10:00',
    is_all_day: slotData?.is_all_day || false,
  });

  const [validationError, setValidationError] = useState(null);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setValidationError(null);
  };

  const toggleWeekDay = (dayIndex) => {
    setFormData((prev) => {
      const weekDays = prev.week_days || [];
      if (weekDays.includes(dayIndex)) {
        return { ...prev, week_days: weekDays.filter((d) => d !== dayIndex) };
      } else {
        return { ...prev, week_days: [...weekDays, dayIndex].sort((a, b) => a - b) };
      }
    });
    setValidationError(null);
  };

  const validate = () => {
    if (
      formData.frequency === 'weekly' &&
      (!formData.week_days || formData.week_days.length === 0)
    ) {
      setValidationError('Veuillez sélectionner au moins un jour de la semaine');
      return false;
    }

    if (!formData.is_all_day) {
      if (!formData.start_time || !formData.end_time) {
        setValidationError('Veuillez renseigner les horaires');
        return false;
      }
      if (formData.start_time >= formData.end_time) {
        setValidationError("L'heure de début doit être inférieure à l'heure de fin");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      ...formData,
      week_days: formData.frequency === 'weekly' ? formData.week_days : null,
    };

    onSave(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="entity-form" noValidate>
      {/* Erreurs globales */}
      {(validationError || saveError) && (
        <div className="alert alert-error">
          <Icons.Warning />
          <span>{validationError || saveError}</span>
        </div>
      )}

      {/* Fréquence */}
      <div className="form-section">
        <h3>Fréquence</h3>
        <div className="form-group">
          <label htmlFor="frequency">
            Type de récurrence <span className="required">*</span>
          </label>
          <select
            id="frequency"
            className="form-select"
            value={formData.frequency}
            onChange={(e) => handleChange('frequency', e.target.value)}
            disabled={saving}
          >
            {FREQUENCY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Jours de la semaine (si hebdomadaire) */}
        {formData.frequency === 'weekly' && (
          <div className="form-group">
            <label>
              Jours de la semaine <span className="required">*</span>
            </label>
            <div className="days-selector-grid">
              {WEEK_DAYS.map((dayLabel, index) => {
                const dayIndex = index + 1; // 1=Lun, 2=Mar, ..., 7=Dim
                const selected = formData.week_days.includes(dayIndex);
                return (
                  <button
                    key={dayIndex}
                    type="button"
                    className={`day-button ${selected ? 'selected' : ''}`}
                    onClick={() => toggleWeekDay(dayIndex)}
                    disabled={saving}
                  >
                    {dayLabel}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Horaires */}
      <div className="form-section">
        <h3>Horaires</h3>

        {/* Journée entière */}
        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={formData.is_all_day}
              onChange={(e) => handleChange('is_all_day', e.target.checked)}
              disabled={saving}
            />
            <span>Journée entière</span>
          </label>
        </div>

        {/* Horaires (si pas journée entière) */}
        {!formData.is_all_day && (
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="start_time">
                Heure de début <span className="required">*</span>
              </label>
              <input
                type="time"
                id="start_time"
                className="form-input"
                value={formData.start_time}
                onChange={(e) => handleChange('start_time', e.target.value)}
                disabled={saving}
              />
            </div>
            <div className="form-group">
              <label htmlFor="end_time">
                Heure de fin <span className="required">*</span>
              </label>
              <input
                type="time"
                id="end_time"
                className="form-input"
                value={formData.end_time}
                onChange={(e) => handleChange('end_time', e.target.value)}
                disabled={saving}
              />
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={saving}>
          <Icons.Cancel />
          Annuler
        </button>
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? (
            <>
              <Icons.Loading className="spin" />
              Enregistrement...
            </>
          ) : (
            <>
              <Icons.Check />
              Créer la récurrence
            </>
          )}
        </button>
      </div>
    </form>
  );
}

RecurrenceForm.propTypes = {
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  saving: PropTypes.bool,
  saveError: PropTypes.string,
  slotData: PropTypes.object,
};
