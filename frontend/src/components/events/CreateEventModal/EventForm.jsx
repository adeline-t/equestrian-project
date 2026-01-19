import { useEffect } from 'react';
import { EVENT_TYPES, getEventTypeOptions, getStatusOptions } from '../../../lib/domain/events';
import { Icons } from '../../../lib/icons.jsx';
import '../../../styles/components/events.css';

const INSTRUCTORS = [
  { id: 1, label: 'Laury' },
  { id: 2, label: 'Kévin' },
  { id: 3, label: 'Julie' },
  { id: 4, label: 'Capucine' },
  { id: 0, label: 'Autre' },
];

function EventForm({
  formData,
  formatDuration,
  handleFormChange,
  handleTypeChange,
  setFormData,
  initialDate,
  initialStartTime,
  initialEndTime,
}) {
  useEffect(() => {
    if (initialDate) {
      setFormData((prev) => ({ ...prev, event_date: initialDate }));
    }
  }, [initialDate, setFormData]);

  useEffect(() => {
    if (initialStartTime && initialEndTime) {
      setFormData((prev) => ({
        ...prev,
        start_time: initialStartTime,
        end_time: initialEndTime,
      }));
    }
  }, [initialStartTime, initialEndTime, setFormData]);

  const hideParticipantCount =
    formData.event_type === EVENT_TYPES.BLOCKED ||
    formData.event_type === EVENT_TYPES.LOANER_FREE_TIME ||
    formData.event_type === EVENT_TYPES.SERVICE;
  const isMultiDay = formData.event_end_date && formData.event_end_date !== formData.event_date;

  return (
    <form onSubmit={(e) => e.preventDefault()} className="event-form-modern">
      {/* GENERAL INFORMATION SECTION */}
      <div className="event-form-section">
        <h2>Informations générales</h2>
        <div className="event-form-row">
          <div className="form-group">
            <div className="inline-form-group">
              <label className="event-form-label">Nom</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                className="form-input event-form-input"
                placeholder="un nom sera généré automatiquement si laissé vide"
              />
            </div>

            <div style={{ marginTop: '12px' }}>
              <label className="event-form-label">Type *</label>
              <div className="button-group">
                {getEventTypeOptions().map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`event-form-button ${
                      formData.event_type === option.value ? 'active' : ''
                    }`}
                    onClick={() => handleTypeChange({ target: { value: option.value } })}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {!hideParticipantCount && (
              <div style={{ marginTop: '12px' }}>
                <div className="event-form-times-group">
                  <div className="inline-form-group">
                    <label>Min participants *</label>
                    <input
                      type="number"
                      name="min_participants"
                      value={formData.min_participants}
                      onChange={handleFormChange}
                      min="0"
                      required
                      className="compact-number-input"
                    />
                  </div>

                  <div className="inline-form-group">
                    <label>Max participants *</label>
                    <input
                      type="number"
                      name="max_participants"
                      value={formData.max_participants}
                      onChange={handleFormChange}
                      min="1"
                      required
                      className="compact-number-input"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="form-group">
            <div>
              <label className="event-form-label">Instructeur *</label>
              <div className="button-group">
                {INSTRUCTORS.map((inst) => (
                  <button
                    key={inst.id}
                    type="button"
                    className={`event-form-button ${
                      formData.instructor_id === inst.id ? 'active' : ''
                    }`}
                    onClick={() =>
                      handleFormChange({
                        target: { name: 'instructor_id', value: inst.id },
                      })
                    }
                  >
                    {inst.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginTop: '12px' }}>
              <label className="event-form-label">Statut *</label>
              <div className="button-group">
                {getStatusOptions().map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`event-form-button ${
                      formData.slot_status === option.value ? 'active' : ''
                    }`}
                    onClick={() =>
                      handleFormChange({
                        target: { name: 'slot_status', value: option.value },
                      })
                    }
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DATE SECTION */}
      <div className="event-form-section">
        <h2>Date</h2>
        <div className="event-form-row">
          <div className="form-group">
            <div className="inline-form-group">
              <label>Date *</label>
              <input
                type="date"
                name="event_date"
                value={formData.event_date}
                onChange={handleFormChange}
                className="form-input event-form-input"
                required
              />
            </div>

            <div className="inline-form-group" style={{ marginTop: '12px' }}>
              <label>Format</label>
              <div className="segmented-control">
                <button
                  type="button"
                  className={`segment-btn ${formData.is_all_day ? 'active' : ''}`}
                  onClick={() => setFormData((prev) => ({ ...prev, is_all_day: true }))}
                  disabled={isMultiDay}
                >
                  <Icons.Calendar className="segment-icon" />
                  Journée entière
                </button>
                <button
                  type="button"
                  className={`segment-btn ${!formData.is_all_day ? 'active' : ''}`}
                  onClick={() => setFormData((prev) => ({ ...prev, is_all_day: false }))}
                  disabled={isMultiDay}
                >
                  <Icons.Clock className="segment-icon" />
                  Horaires
                </button>
              </div>
            </div>
          </div>

          <div className="form-group">
            {!formData.is_all_day && (
              <div className="event-form-times-group">
                <div className="inline-form-group">
                  <label className="event-form-label">Heure début</label>
                  <input
                    type="time"
                    name="start_time"
                    value={formData.start_time}
                    onChange={handleFormChange}
                    className="form-input event-form-input"
                    step="900"
                    required
                  />
                </div>

                <div className="inline-form-group">
                  <label className="event-form-label">Heure fin</label>
                  <input
                    type="time"
                    name="end_time"
                    value={formData.end_time}
                    onChange={handleFormChange}
                    step="900"
                    required
                  />
                </div>

                <div className="event-form-duration-display">
                  <Icons.Clock className="event-form-duration-icon" />
                  {formatDuration(formData.start_time, formData.end_time)}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}

export default EventForm;
