import { Icons } from '../../../../lib/icons';
import { getEventTypeOptions, getStatusOptions } from '../../../../lib/domain/events';
import { INSTRUCTORS, getInstructorLabel } from '../../../../lib/domain/domain-constants';
import '../../../../styles/features/events.css';

const INSTRUCTOR_OPTIONS = Object.keys(INSTRUCTORS).map((id) => ({
  id: Number(id),
  label: getInstructorLabel(id),
}));

export default function EventEditForm({ editData, onChange, onCancel, onSubmit, disabled }) {
  return (
    <form
      className="event-edit-form"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit?.(); // ici on envoie la copie locale au parent
      }}
    >
      {/* Name */}
      <div className="event-edit-form-group">
        <label className="event-edit-label">
          <Icons.Edit className="event-edit-icon" /> Nom
        </label>
        <input
          name="name"
          value={editData.name || ''}
          onChange={onChange}
          disabled={disabled}
          className="event-edit-input"
          placeholder="Nom de l'événement"
        />
      </div>

      {/* Type & Status */}
      <div className="event-edit-form-row">
        <div className="event-edit-form-group">
          <label className="event-edit-label">
            <Icons.List className="event-edit-icon" /> Type
          </label>
          <select
            name="event_type"
            value={editData.event_type || ''}
            onChange={onChange}
            disabled={disabled}
            className="event-edit-select"
          >
            {getEventTypeOptions().map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="event-edit-form-group">
          <label className="event-edit-label">
            <Icons.Info className="event-edit-icon" /> Statut
          </label>
          <select
            name="slot_status"
            value={editData.slot_status || 'scheduled'}
            onChange={onChange}
            disabled={disabled}
            className="event-edit-select"
          >
            {getStatusOptions().map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Instructor */}
      <div className="event-edit-form-group">
        <label className="event-edit-label">
          <Icons.User className="event-edit-icon" /> Instructeur
        </label>
        <div className="button-group">
          {INSTRUCTOR_OPTIONS.map((inst) => (
            <button
              key={inst.id}
              type="button"
              disabled={disabled}
              className={`badge clickable ${editData.instructor_id === inst.id ? 'active' : ''}`}
              onClick={() =>
                onChange({
                  target: { name: 'instructor_id', value: inst.id },
                })
              }
            >
              {inst.label}
            </button>
          ))}
        </div>
      </div>

      {/* Participants Min / Max */}
      {editData.event_type !== 'blocked' && (
        <div className="event-edit-form-row">
          <div className="event-edit-form-group">
            <label className="event-edit-label">
              <Icons.Users className="event-edit-icon" /> Min participants
            </label>
            <input
              type="number"
              name="min_participants"
              value={editData.min_participants ?? 0}
              onChange={onChange}
              disabled={disabled}
              min="0"
              className="event-edit-input"
            />
          </div>

          <div className="event-edit-form-group">
            <label className="event-edit-label">
              <Icons.Users className="event-edit-icon" /> Max participants
            </label>
            <input
              type="number"
              name="max_participants"
              value={editData.max_participants ?? 1}
              onChange={onChange}
              disabled={disabled}
              min="1"
              className="event-edit-input"
            />
          </div>
        </div>
      )}

      {/* Description */}
      <div className="event-edit-form-group">
        <label className="event-edit-label">
          <Icons.Info className="event-edit-icon" /> Description
        </label>
        <textarea
          name="description"
          value={editData.description || ''}
          onChange={onChange}
          disabled={disabled}
          className="event-edit-textarea"
          rows="3"
          placeholder="Description de l'événement..."
        />
      </div>

      {/* Footer */}
      <div className="modal-footer mt-20">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          <Icons.Cancel /> Annuler
        </button>
        <button type="submit" className="btn btn-primary" disabled={disabled}>
          <Icons.Check /> Sauvegarder
        </button>
      </div>
    </form>
  );
}
