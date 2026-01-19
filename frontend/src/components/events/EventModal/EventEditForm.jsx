import { Icons } from '../../../lib/icons';
import '../../../styles/components/events.css';

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
          value={editData.name}
          onChange={handleChange}
          className="event-edit-input"
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
            value={editData.event_type}
            onChange={handleChange}
            className="event-edit-select"
          >
            {Object.values(EVENT_TYPES).map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
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
            value={editData.slot_status}
            onChange={handleChange}
            className="event-edit-select"
          >
            <option value="scheduled">Planifié</option>
            <option value="confirmed">Confirmé</option>
            <option value="cancelled">Annulé</option>
          </select>
        </div>
      </div>

      {/* Description */}
      <div className="event-edit-form-group">
        <label className="event-edit-label">
          <Icons.Info className="event-edit-icon" /> Description
        </label>
        <textarea
          name="description"
          value={editData.description}
          onChange={handleChange}
          className="event-edit-textarea"
          rows="3"
        />
      </div>
    </form>
  );
};

export default EventEditForm;
