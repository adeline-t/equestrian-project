import { Icons } from '../../../../lib/icons';
import {
  getStatusOptions,
  getEventTypesOptionForMode,
  EVENT_TYPES,
} from '../../../../lib/domain/events';
import { INSTRUCTORS, getInstructorLabel } from '../../../../lib/domain/domain-constants';
import { formatTimeForInput } from '../../../../lib/helpers/formatters/index.js';
import '../../../../styles/features/events.css';
import { useAppMode } from '../../../../context/AppMode.jsx';

const INSTRUCTOR_OPTIONS = Object.keys(INSTRUCTORS).map((id) => ({
  id: Number(id),
  label: getInstructorLabel(id),
}));

export default function EventEditForm({ editData, onChange, onCancel, onSubmit, disabled }) {
  const { mode } = useAppMode();

  const eventTypeOptions = getEventTypesOptionForMode(mode);
  const hideParticipantCount =
    editData.event_type === EVENT_TYPES.LOANER_FREE_TIME ||
    editData.event_type === EVENT_TYPES.SERVICE;

  return (
    <form
      className="event-form-modern"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit?.();
      }}
    >
      {/* GENERAL INFORMATION */}
      <div className="form-section mb-20">
        <h3 className="mb-15">Informations générales</h3>

        <div className="form-group mb-15">
          <label>Nom</label>
          <input
            type="text"
            name="name"
            value={editData.name || ''}
            onChange={onChange}
            disabled={disabled}
            className="form-input"
          />
        </div>

        {/* EVENT TYPE */}
        <div className="form-group mb-15">
          <label>Type</label>
          <div className="segmented-control">
            {eventTypeOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                disabled={disabled}
                className={`segment-btn ${editData.event_type === option.value ? 'active' : ''}`}
                onClick={() =>
                  onChange({
                    target: { name: 'event_type', value: option.value },
                  })
                }
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Status Selector */}
        <div className="form-group mb-15">
          <label>
            Statut <span className="required">*</span>
          </label>

          <div className="segmented-control">
            {getStatusOptions().map((option) => {
              const isActive = editData.slot_status === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  disabled={disabled}
                  className={`segment-btn ${isActive ? 'active' : ''}`}
                  onClick={() =>
                    onChange({
                      target: { name: 'slot_status', value: option.value },
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
          <>
            <div className="form-row">
              <div className="form-group">
                <label>
                  Min participants <span className="required">*</span>
                </label>
                <input
                  type="number"
                  name="min_participants"
                  value={editData.min_participants ?? 0}
                  onChange={onChange}
                  disabled={disabled}
                  min="0"
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
                  value={editData.max_participants ?? 1}
                  onChange={onChange}
                  disabled={disabled}
                  min="1"
                  className="form-input"
                />
              </div>
            </div>

            {/* Instructor Selector */}
            <div className="form-group">
              <label>
                Enseignant <span className="required">*</span>
              </label>

              <div className="segmented-control">
                {INSTRUCTOR_OPTIONS.map((inst) => {
                  const isActive = editData.instructor_id === inst.id;

                  return (
                    <button
                      key={inst.id}
                      type="button"
                      disabled={disabled}
                      className={`segment-btn ${isActive ? 'active' : ''}`}
                      onClick={() =>
                        onChange({
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

            {mode === 'admin' && (
              <>
                {/* Acutal Instructor Selector */}
                <div className="form-group">
                  <label>Remplacé par</label>

                  <div className="segmented-control">
                    {INSTRUCTOR_OPTIONS.map((inst) => {
                      const isActive = editData.actual_instructor_id === inst.id;

                      return (
                        <button
                          key={inst.id}
                          type="button"
                          disabled={disabled}
                          className={`segment-btn ${isActive ? 'active' : ''}`}
                          onClick={() =>
                            onChange({
                              target: { name: 'actual_instructor_id', value: inst.id },
                            })
                          }
                        >
                          {inst.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </>
        )}

        {/* Description */}
        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={editData.description || ''}
            onChange={onChange}
            disabled={disabled}
            className="form-input"
            rows="3"
            placeholder="Description de l'événement..."
          />
        </div>
      </div>

      {/* DATE & TIME */}
      <div className="form-section mb-20">
        <h3 className="mb-15">Date et horaires</h3>
        {/* DATE */}
        <div className="form-group">
          <label>Date</label>
          <input
            type="date"
            name="slot_date"
            value={editData.slot_date || ''}
            onChange={onChange} // ✅ FIX
            className="form-input"
          />
        </div>

        {/* FORMAT */}
        <div className="form-group mb-15">
          <label>Format</label>
          <div className="segmented-control">
            <button
              type="button"
              className={`segment-btn ${editData.is_all_day ? 'active' : ''}`}
              onClick={() => onChange({ target: { name: 'is_all_day', value: true } })}
            >
              <Icons.Calendar /> Journée entière
            </button>

            <button
              type="button"
              className={`segment-btn ${!editData.is_all_day ? 'active' : ''}`}
              onClick={() => onChange({ target: { name: 'is_all_day', value: false } })}
            >
              <Icons.Clock /> Horaires
            </button>
          </div>
        </div>

        {/* Time inputs (conditional) */}
        {!editData.is_all_day && (
          <div className="form-row">
            <input
              type="time"
              name="start_time"
              value={formatTimeForInput(editData.start_time)}
              onChange={onChange} // ✅ FIX
              className="form-input"
            />
            <input
              type="time"
              name="end_time"
              value={formatTimeForInput(editData.end_time)}
              onChange={onChange} // ✅ FIX
              className="form-input"
            />
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={disabled}>
          <Icons.Cancel /> Annuler
        </button>
        <button type="submit" className="btn btn-primary" disabled={disabled}>
          <Icons.Check /> Sauvegarder
        </button>
      </div>
    </form>
  );
}
