import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { getEventTypeLabel, getStatusLabel } from '../../../lib/domain/events';
import { Icons } from '../../../lib/icons';
import '../../../styles/components/events.css';

const INSTRUCTORS = {
  1: 'Laury',
  2: 'Kévin',
  3: 'Julie',
  4: 'Capucine',
  0: 'Autre',
};

const EventDetailsTab = ({ slot, event }) => {
  const getInstructorName = (id) => INSTRUCTORS[id] || `Instructeur #${id}`;

  return (
    <div className="event-details-tab">
      {/* Type */}
      <div className="event-details-row">
        <label className="event-details-label">
          <Icons.List className="event-details-icon" /> Type :
        </label>
        <span className="event-details-value">
          {getEventTypeLabel(event?.event_type || slot?.event_type)}
        </span>
      </div>

      {/* Date */}
      <div className="event-details-row">
        <label className="event-details-label">
          <Icons.Calendar className="event-details-icon" /> Date :
        </label>
        <span className="event-details-value">
          {format(parseISO(slot.start_time), 'EEEE dd MMMM yyyy', { locale: fr })}
        </span>
      </div>

      {/* Time */}
      <div className="event-details-row">
        <label className="event-details-label">
          <Icons.Clock className="event-details-icon" /> Horaire :
        </label>
        <span className="event-details-value">
          {slot.is_all_day
            ? 'Journée entière'
            : `${slot.start_time.slice(11, 16)} - ${slot.end_time.slice(11, 16)}`}
        </span>
      </div>

      {/* Status */}
      <div className="event-details-row">
        <label className="event-details-label">
          <Icons.Info className="event-details-icon" /> Statut :
        </label>
        <span className={`event-details-status event-details-status-${slot.slot_status}`}>
          {getStatusLabel(slot.slot_status)}
        </span>
      </div>

      {/* Instructor */}
      <div className="event-details-row">
        <label className="event-details-label">
          <Icons.User className="event-details-icon" /> Instructeur :
        </label>
        <span className="event-details-value">
          {getInstructorName(slot.actual_instructor_id || event?.instructor_id)}
        </span>
      </div>

      {/* Participants */}
      {event && event.event_type !== 'blocked' && (
        <div className="event-details-row">
          <label className="event-details-label">
            <Icons.Users className="event-details-icon" /> Participants :
          </label>
          <span className="event-details-value">
            Min: {event.min_participants || 0} / Max: {event.max_participants || 0}
          </span>
        </div>
      )}

      {/* Description */}
      {event?.description && (
        <div className="event-details-row">
          <label className="event-details-label">
            <Icons.Info className="event-details-icon" /> Description :
          </label>
          <p className="event-details-description">{event.description}</p>
        </div>
      )}

      {/* Cancellation Reason */}
      {slot.cancellation_reason && (
        <div className="event-details-row">
          <label className="event-details-label">
            <Icons.Warning className="event-details-icon" /> Raison d'annulation :
          </label>
          <p className="event-details-description">{slot.cancellation_reason}</p>
        </div>
      )}
    </div>
  );
};

export default EventDetailsTab;
