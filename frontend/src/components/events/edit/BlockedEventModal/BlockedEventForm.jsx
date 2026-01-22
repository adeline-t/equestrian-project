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
import '../../../../styles/features/events.css';

// Convert domain map → array for UI
const instructorOptions = Object.entries(INSTRUCTORS).map(([id, label]) => ({
  id: Number(id),
  label,
}));

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
    <form onSubmit={(e) => e.preventDefault()} className="blocked-time-form">
      {/* GENERAL INFORMATION */}
      <div className="form-section mb-20">
        <h3 className="mb-15">Informations générales</h3>

        <div className="form-group mb-15">
          <label htmlFor="name">Nom de l'événement</label>
          <input
            type="text"
            id="name"
            value={editData.name || ''}
            onChange={(e) => handleChange('name', e.target.value)}
            className="form-input"
            placeholder="Période bloquée"
          />
        </div>

        <div className="form-group mb-15">
          <label>
            Instructeur <span className="required">*</span>
          </label>
          <div className="segmented-control">
            {instructorOptions.map((inst) => (
              <button
                key={inst.id}
                type="button"
                className={`segment-btn ${editData.instructor_id === inst.id ? 'active' : ''}`}
                onClick={() => handleChange('instructor_id', inst.id)}
              >
                {inst.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* DATE AND TIME SECTION */}
      <div className="form-section mb-20">
        <h3 className="mb-15">Date et horaires</h3>

        <div className="form-group mb-15">
          <label htmlFor="slot_date">
            Date <span className="required">*</span>
          </label>
          <input
            type="date"
            id="slot_date"
            value={editData.slot_date || ''}
            onChange={(e) => handleChange('slot_date', e.target.value)}
            className="form-input"
            required
          />
        </div>

        <div className="form-group mb-15">
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

        {!editData.is_all_day && (
          <>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="start_time">Heure début</label>
                <input
                  type="time"
                  id="start_time"
                  value={formatTimeForInput(editData.start_time)}
                  onChange={(e) =>
                    handleChange('start_time', formatTimeForDatabase(e.target.value))
                  }
                  className="form-input"
                  step="900"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="end_time">Heure fin</label>
                <input
                  type="time"
                  id="end_time"
                  value={formatTimeForInput(editData.end_time)}
                  onChange={(e) => handleChange('end_time', formatTimeForDatabase(e.target.value))}
                  className="form-input"
                  step="900"
                  required
                />
              </div>
            </div>

            {duration > 0 && (
              <div className="blocked-time-duration-display">
                <Icons.Clock />
                Durée: {formatDuration(duration)}
              </div>
            )}
          </>
        )}
      </div>

      {/* STATUS SECTION */}
      <div className="form-section mb-20">
        <h3 className="mb-15">Statut</h3>

        <div className="form-group mb-15">
          <label>
            Statut du créneau <span className="required">*</span>
          </label>
          <div className="segmented-control">
            {Object.values(SLOT_STATUSES).map((status) => {
              const config = getStatusConfig(status);
              const StatusIcon = config?.icon || Icons.Info;

              return (
                <button
                  key={status}
                  type="button"
                  className={`segment-btn ${editData.slot_status === status ? 'active' : ''}`}
                  onClick={() => handleChange('slot_status', status)}
                >
                  <StatusIcon className="segment-icon" />
                  {config?.label || status}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </form>
  );
}

BlockedEventForm.propTypes = {
  editData: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
};

export default BlockedEventForm;
