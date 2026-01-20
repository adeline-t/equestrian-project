import { useCreateBlockedTime } from '../../../../hooks/useCreateBlockedTime.js';
import { formatDuration, calculateDurationMinutes } from '../../../../lib/utils.js';
import { Icons } from '../../../../lib/icons.jsx';
import '../../../../styles/components/events.css';

const INSTRUCTORS = [
  { id: 1, label: 'Laury' },
  { id: 2, label: 'Kévin' },
  { id: 3, label: 'Julie' },
  { id: 4, label: 'Capucine' },
  { id: 0, label: 'Autre' },
];

function BlockedTimeForm({ initialDate }) {
  const { formData, handleChange, setFormData } = useCreateBlockedTime();

  useEffect(() => {
    if (initialDate) {
      setFormData((prev) => ({ ...prev, event_date: initialDate }));
    }
  }, [initialDate, setFormData]);

  return (
    <form onSubmit={(e) => e.preventDefault()} className="event-form-modern">
      {/* GENERAL INFORMATION SECTION */}
      <div className="event-form-section">
        <h2>Informations générales</h2>

        <div className="form-group">
          <div>
            <div className="inline-form-group">
              <label className="event-form-label">Nom</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-input event-form-input"
                placeholder="un nom sera généré automatiquement si laissé vide"
              />
            </div>
          </div>

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
                  onClick={() => setFormData((prev) => ({ ...prev, instructor_id: inst.id }))}
                >
                  {inst.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* DATE SECTION */}
      <div className="event-form-section">
        <h2>Date et horaires</h2>

        <div className="form-group">
          <div>
            <div className="inline-form-group">
              <label className="event-form-label">Date *</label>
              <input
                type="date"
                name="event_date"
                value={formData.event_date}
                onChange={handleChange}
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
                >
                  <Icons.Calendar className="segment-icon" />
                  Journée entière
                </button>
                <button
                  type="button"
                  className={`segment-btn ${!formData.is_all_day ? 'active' : ''}`}
                  onClick={() => setFormData((prev) => ({ ...prev, is_all_day: false }))}
                >
                  <Icons.Clock className="segment-icon" />
                  Horaires
                </button>
              </div>
            </div>
          </div>

          {!formData.is_all_day && (
            <div>
              <div className="event-form-times-group">
                <div className="inline-form-group">
                  <label className="event-form-label">Heure début</label>
                  <input
                    type="time"
                    name="start_time"
                    value={formData.start_time}
                    onChange={handleChange}
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
                    onChange={handleChange}
                    className="form-input event-form-input"
                    step="900"
                    required
                  />
                </div>
              </div>

              <div className="event-form-duration-display">
                <Icons.Clock className="event-form-duration-icon" />
                Durée:{' '}
                {formatDuration(calculateDurationMinutes(formData.start_time, formData.end_time))}
              </div>
            </div>
          )}
        </div>
      </div>
    </form>
  );
}

export default BlockedTimeForm;
