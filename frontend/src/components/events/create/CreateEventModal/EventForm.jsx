import { EVENT_TYPES, getEventTypesOptionForMode } from '../../../../lib/domain/events.js';
import { INSTRUCTORS } from '../../../../lib/domain/domain-constants.js';
import { Icons } from '../../../../lib/icons.jsx';
import { formatTimeForInput } from '../../../../lib/helpers/formatters/index.js';
import '../../../../styles/features/events.css';

import { useAppMode } from '../../../../context/AppMode.jsx';

const instructorOptions = Object.entries(INSTRUCTORS).map(([id, label]) => ({
  id: Number(id),
  label,
}));

/**
 * Pure presentation component for event form
 * Receives all state and handlers as props from parent (CreateEventModal)
 */
function EventForm({ formData, handleFormChange, setFormData }) {
  const { mode } = useAppMode();

  const availableEventTypes = getEventTypesOptionForMode(mode);

  const hideParticipantCount =
    formData.event_type === EVENT_TYPES.LOANER_FREE_TIME ||
    formData.event_type === EVENT_TYPES.SERVICE;

  const hideInstructorSelecteur = formData.event_type === EVENT_TYPES.LOANER_FREE_TIME;

  return (
    <form onSubmit={(e) => e.preventDefault()} className="event-form-modern">
      {/* GENERAL INFORMATION */}
      <div className="form-section mb-20">
        <h3 className="mb-15">Informations générales</h3>

        <div className="form-row">
          <div className="form-group">
            <label>Nom</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleFormChange}
              className="form-input"
              placeholder="Un nom sera généré automatiquement si laissé vide"
            />
          </div>
        </div>

        {/* Event Type Selector */}
        <div className="form-group mb-15">
          <label>
            Type <span className="required">*</span>
          </label>

          <div className="segmented-control">
            {availableEventTypes.map((option) => {
              const isActive = formData.event_type === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  className={`segment-btn ${isActive ? 'active' : ''}`}
                  onClick={() =>
                    handleFormChange({
                      target: { name: 'event_type', value: option.value },
                    })
                  }
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Participant Count (conditional) */}
        {!hideParticipantCount && (
          <div className="form-row">
            <div className="form-group">
              <label>
                Min participants <span className="required">*</span>
              </label>
              <input
                type="number"
                name="min_participants"
                value={formData.min_participants}
                onChange={handleFormChange}
                min="0"
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>
                Max participants <span className="required">*</span>
              </label>
              <input
                type="number"
                name="max_participants"
                value={formData.max_participants}
                onChange={handleFormChange}
                min="1"
                required
                className="form-input"
              />
            </div>
          </div>
        )}

        {/* Instructor Selector */}
        {!hideInstructorSelecteur && (
          <div className="form-group">
            <label>
              Instructeur <span className="required">*</span>
            </label>

            <div className="segmented-control">
              {instructorOptions.map((inst) => {
                const isActive = formData.instructor_id === inst.id;

                return (
                  <button
                    key={inst.id}
                    type="button"
                    className={`segment-btn ${isActive ? 'active' : ''}`}
                    onClick={() =>
                      handleFormChange({
                        target: { name: 'instructor_id', value: inst.id },
                      })
                    }
                  >
                    {inst.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* DATE & TIME */}
      <div className="form-section mb-20">
        <h3 className="mb-15">Date et horaires</h3>

        <div className="form-row">
          <div className="form-group">
            <label>
              Date <span className="required">*</span>
            </label>
            <input
              type="date"
              name="event_date"
              value={formData.event_date}
              onChange={handleFormChange}
              className="form-input"
              required
            />
          </div>
        </div>

        {/* All-day vs Time slots */}
        <div className="form-group mb-15">
          <label>Format</label>

          <div className="segmented-control">
            <button
              type="button"
              className={`segment-btn ${formData.is_all_day ? 'active' : ''}`}
              onClick={() => setFormData((prev) => ({ ...prev, is_all_day: true }))}
            >
              <Icons.Calendar />
              Journée entière
            </button>

            <button
              type="button"
              className={`segment-btn ${!formData.is_all_day ? 'active' : ''}`}
              onClick={() => setFormData((prev) => ({ ...prev, is_all_day: false }))}
            >
              <Icons.Clock />
              Horaires
            </button>
          </div>
        </div>

        {/* Time inputs (conditional) */}
        {!formData.is_all_day && (
          <div className="form-row">
            <div className="form-group">
              <label>
                Heure début <span className="required">*</span>
              </label>
              <input
                type="time"
                name="start_time"
                value={formatTimeForInput(formData.start_time)}
                onChange={handleFormChange}
                className="form-input"
                step="900"
                required
              />
            </div>

            <div className="form-group">
              <label>
                Heure fin <span className="required">*</span>
              </label>
              <input
                type="time"
                name="end_time"
                value={formatTimeForInput(formData.end_time)}
                onChange={handleFormChange}
                className="form-input"
                step="900"
                required
              />
            </div>
          </div>
        )}
      </div>
    </form>
  );
}

export default EventForm;
