import React from 'react';
import PropTypes from 'prop-types';
import { Icons } from '../../../../lib/icons';
import { INSTRUCTORS } from '../../../../lib/domain/domain-constants';
import { SLOT_STATUSES, getStatusConfig } from '../../../../lib/domain/events';
import {
  formatDuration,
  calculateDurationMinutes,
  formatTimeForInput,
  formatTimeForDatabase,
} from '../../../../lib/helpers/formatters';
import '../../../../styles/components/events.css';

function BlockedEventForm({ editData, handleChange }) {
  /**
   * Calculate duration if not all day
   */
  const duration =
    !editData.is_all_day && editData.start_time && editData.end_time
      ? calculateDurationMinutes(
          formatTimeForInput(editData.start_time),
          formatTimeForInput(editData.end_time)
        )
      : 0;

  console.log('[Form] render', { editData, duration });

  return (
    <div className="event-form-modern">
      {/* GENERAL INFORMATION SECTION */}
      <div className="event-form-section">
        <h2>Informations générales</h2>

        <div className="form-group">
          <div>
            <div className="inline-form-group">
              <label className="event-form-label">Nom de l'événement</label>
              <input
                type="text"
                value={editData.name || ''}
                onChange={(e) => handleChange('name', e.target.value)}
                className="form-input event-form-input"
                placeholder="Période bloquée"
              />
            </div>
          </div>

          <div>
            <div className="inline-form-group">
              <label className="event-form-label">
                <Icons.User />
                Instructeur
              </label>
            </div>
            <div className="button-group">
              {Object.entries(INSTRUCTORS).map(([id, name]) => (
                <button
                  key={id}
                  type="button"
                  className={`event-form-button ${
                    editData.actual_instructor_id === Number(id) ? 'active' : ''
                  }`}
                  onClick={() => handleChange('actual_instructor_id', Number(id))}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* DATE AND TIME SECTION */}
      <div className="event-form-section">
        <h2>Date et horaires</h2>

        <div className="form-group">
          <div>
            <div className="inline-form-group">
              <label className="event-form-label">
                <Icons.Calendar />
                Date
              </label>
              <input
                type="date"
                value={editData.slot_date || ''}
                onChange={(e) => handleChange('slot_date', e.target.value)}
                className="form-input event-form-input"
                required
              />
            </div>

            <div className="inline-form-group" style={{ marginTop: '12px' }}>
              <label>Format</label>
              <div className="segmented-control">
                <button
                  type="button"
                  className={`segment-btn ${editData.is_all_day ? 'active' : ''}`}
                  onClick={() => handleChange('is_all_day', true)}
                >
                  <Icons.Calendar className="segment-icon" />
                  Journée entière
                </button>
                <button
                  type="button"
                  className={`segment-btn ${!editData.is_all_day ? 'active' : ''}`}
                  onClick={() => handleChange('is_all_day', false)}
                >
                  <Icons.Clock className="segment-icon" />
                  Horaires
                </button>
              </div>
            </div>
          </div>

          {!editData.is_all_day && (
            <div>
              <div className="event-form-times-group">
                <div className="inline-form-group">
                  <label className="event-form-label">Heure début</label>
                  <input
                    type="time"
                    value={formatTimeForInput(editData.start_time)}
                    onChange={(e) =>
                      handleChange('start_time', formatTimeForDatabase(e.target.value))
                    }
                    className="form-input event-form-input"
                    step="900"
                    required
                  />
                </div>

                <div className="inline-form-group">
                  <label className="event-form-label">Heure fin</label>
                  <input
                    type="time"
                    value={formatTimeForInput(editData.end_time)}
                    onChange={(e) =>
                      handleChange('end_time', formatTimeForDatabase(e.target.value))
                    }
                    className="form-input event-form-input"
                    step="900"
                    required
                  />
                </div>
              </div>

              {duration > 0 && (
                <div className="event-form-duration-display">
                  <Icons.Clock className="event-form-duration-icon" />
                  Durée: {formatDuration(duration)}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* STATUS SECTION */}
      <div className="event-form-section">
        <h2>Statut</h2>

        <div className="form-group">
          <div>
            <div className="inline-form-group">
              <label className="event-form-label">
                <Icons.Info />
                Statut du créneau
              </label>
            </div>
            <div className="button-group">
              {Object.values(SLOT_STATUSES).map((status) => {
                const config = getStatusConfig(status);
                const StatusIcon = config.icon;

                return (
                  <button
                    key={status}
                    type="button"
                    className={`event-form-button ${
                      editData.slot_status === status ? 'active' : ''
                    }`}
                    onClick={() => handleChange('slot_status', status)}
                  >
                    <StatusIcon style={{ fontSize: '14px', marginRight: '4px' }} />
                    {config.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

BlockedEventForm.propTypes = {
  editData: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
};

export default BlockedEventForm;
