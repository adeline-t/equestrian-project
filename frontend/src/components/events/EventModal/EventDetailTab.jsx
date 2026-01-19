import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { getEventTypeLabel } from '../../../lib/domain/events';
import { Icons } from '../../../lib/icons';
import '../../../styles/components/events.css';

const EventDetailsTab = ({ slot, event }) => {
  return (
    <div className="event-details-tab">
      {/* Type */}
      <div className="event-details-row">
        <label className="event-details-label">
          <Icons.List className="event-details-icon" /> Type :
        </label>
        <span className="event-details-value">{getEventTypeLabel(event?.event_type)}</span>
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
          {slot.start_time.slice(11, 16)} - {slot.end_time.slice(11, 16)}
        </span>
      </div>

      {/* Status */}
      <div className="event-details-row">
        <label className="event-details-label">
          <Icons.Info className="event-details-icon" /> Statut :
        </label>
        <span className={`event-details-status event-details-status-${slot.slot_status}`}>
          {slot.slot_status}
        </span>
      </div>

      {/* Description */}
      {event?.description && (
        <div className="event-details-row">
          <label className="event-details-label">
            <Icons.Info className="event-details-icon" /> Description :
          </label>
          <p className="event-details-description">{event.description}</p>
        </div>
      )}
    </div>
  );
};

export default EventDetailsTab;
