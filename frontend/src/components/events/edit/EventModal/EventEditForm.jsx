import { Icons } from '../../../../lib/icons';
import { getEventTypeOptions, getStatusOptions } from '../../../../lib/domain/events';
import { INSTRUCTORS, getInstructorLabel } from '../../../../lib/domain/domain-constants';
import '../../../../styles/features/events.css';

const INSTRUCTOR_OPTIONS = Object.keys(INSTRUCTORS).map((id) => ({
  id: Number(id),
  label: getInstructorLabel(id),
}));

const EventEditForm = ({ editData, handleChange }) => {
  return (
    <form className="event-edit-form" onSubmit={(e) => e.preventDefault()}>
      {/* Name */}
      <div className="event-edit-form-group">
        <label className="event-edit-label">
          <Icons.Edit className="event-edit-icon" /> Nom
        </label>
        <input
          name="name"
          value={editData.name || ''}
          onChange={handleChange}
          className="event-edit-input"
          placeholder="Nom de l'événement"
        />
      </div>

      {/* Type & Status Row */}
      <div className="event-edit-form-row">
        <div className="event-edit-form-group">
          <label className="event-edit-label">
            <Icons.List className="event-edit-icon" /> Type
          </label>
          <select
            name="event_type"
            value={editData.event_type || ''}
            onChange={handleChange}
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
            onChange={handleChange}
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
              className={`badge clickable ${editData.instructor_id === inst.id ? 'active' : ''}`}
              data-type={inst.id}
              onClick={() =>
                handleChange({
                  target: { name: 'instructor_id', value: inst.id },
                })
              }
            >
              {inst.label}
            </button>
          ))}
        </div>
      </div>

      {/* Participants Min/Max */}
      {editData.event_type !== 'blocked' && (
        <div className="event-edit-form-row">
          <div className="event-edit-form-group">
            <label className="event-edit-label">
              <Icons.Users className="event-edit-icon" /> Min participants
            </label>
            <input
              type="number"
              name="min_participants"
              value={editData.min_participants || 0}
              onChange={handleChange}
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
              value={editData.max_participants || 1}
              onChange={handleChange}
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
          onChange={handleChange}
          className="event-edit-textarea"
          rows="3"
          placeholder="Description de l'événement..."
        />
      </div>
    </form>
  );
};

export default EventEditForm;
