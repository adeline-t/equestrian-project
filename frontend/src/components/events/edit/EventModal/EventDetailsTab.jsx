import { format, parseISO, isValid } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  getEventTypeLabel,
  getStatusLabel,
  getEventTypeColor,
} from '../../../../lib/domain/events';
import { Icons } from '../../../../lib/icons';
import '../../../../styles/components/events.css';

const INSTRUCTORS = {
  1: 'Laury',
  2: 'Kévin',
  3: 'Julie',
  4: 'Capucine',
  0: 'Autre',
};

const EventDetailsTab = ({ slot, event }) => {
  const getInstructorName = (id) => INSTRUCTORS[id] || `Instructeur #${id}`;

  const eventType = event?.event_type || slot?.event_type;
  const isBlocked = eventType === 'blocked';
  const eventColor = getEventTypeColor(eventType);

  // Safe date parsing helper
  const formatDate = (dateStr, formatStr, options = {}) => {
    if (!dateStr) return 'N/A';
    try {
      const parsed = parseISO(dateStr);
      if (!isValid(parsed)) return 'Date invalide';
      return format(parsed, formatStr, options);
    } catch (err) {
      console.error('Date formatting error:', err, dateStr);
      return 'Date invalide';
    }
  };

  // Calculate duration with safe date parsing
  const getDuration = () => {
    try {
      const startTime = new Date(slot.start_time);
      const endTime = new Date(slot.end_time);

      if (!isValid(startTime) || !isValid(endTime)) {
        return 'N/A';
      }

      const durationMs = endTime - startTime;
      const durationMinutes = Math.floor(durationMs / 1000 / 60);
      const hours = Math.floor(durationMinutes / 60);
      const minutes = durationMinutes % 60;

      return hours > 0 ? `${hours}h${minutes.toString().padStart(2, '0')}` : `${minutes} min`;
    } catch (err) {
      console.error('Duration calculation error:', err);
      return 'N/A';
    }
  };

  const durationDisplay = getDuration();

  return (
    <div className="event-details-tab">
      {/* Event Type Badge */}
      <div className="event-details-type-banner" style={{ backgroundColor: eventColor }}>
        <div className="event-details-type-content">
          <Icons.List className="event-details-type-icon" />
          <span className="event-details-type-label">{getEventTypeLabel(eventType)}</span>
        </div>
      </div>

      {/* Status Badge */}
      <div className="event-details-row">
        <label className="event-details-label">
          <Icons.Info className="event-details-icon" /> Statut
        </label>
        <span className={`event-details-status event-details-status-${slot.slot_status}`}>
          {getStatusLabel(slot.slot_status)}
        </span>
      </div>

      {/* Date & Time Section */}
      <div className="event-details-section">
        <h3 className="event-details-section-title">
          <Icons.Calendar /> Date et horaires
        </h3>

        <div className="event-details-row">
          <label className="event-details-label">Date</label>
          <span className="event-details-value">
            {formatDate(slot.start_time, 'EEEE dd MMMM yyyy', { locale: fr })}
          </span>
        </div>

        <div className="event-details-row">
          <label className="event-details-label">Horaires</label>
          <span className="event-details-value">
            {slot.is_all_day
              ? 'Journée entière'
              : `${slot.start_time.slice(11, 16)} - ${slot.end_time.slice(11, 16)}`}
          </span>
        </div>

        {!slot.is_all_day && (
          <div className="event-details-row">
            <label className="event-details-label">Durée</label>
            <span className="event-details-value event-details-duration">
              <Icons.Clock className="event-details-inline-icon" />
              {durationDisplay}
            </span>
          </div>
        )}
      </div>

      {/* Event Info Section */}
      {event && !isBlocked && (
        <div className="event-details-section">
          <h3 className="event-details-section-title">
            <Icons.Info /> Informations
          </h3>

          <div className="event-details-row">
            <label className="event-details-label">Instructeur</label>
            <span className="event-details-value">
              <Icons.User className="event-details-inline-icon" />
              {getInstructorName(slot.actual_instructor_id || event?.instructor_id)}
            </span>
          </div>

          <div className="event-details-row">
            <label className="event-details-label">Participants</label>
            <div className="event-details-participants-info">
              <div className="event-details-participants-range">
                <span className="event-details-participants-label">Minimum:</span>
                <span className="event-details-participants-value">
                  {event.min_participants || 0}
                </span>
              </div>
              <div className="event-details-participants-range">
                <span className="event-details-participants-label">Maximum:</span>
                <span className="event-details-participants-value">
                  {event.max_participants || 0}
                </span>
              </div>
            </div>
          </div>

          {event.description && (
            <div className="event-details-row event-details-row-full">
              <label className="event-details-label">Description</label>
              <p className="event-details-description">{event.description}</p>
            </div>
          )}
        </div>
      )}

      {/* Blocked Event Info */}
      {isBlocked && (
        <div className="event-details-section event-details-section-blocked">
          <h3 className="event-details-section-title">
            <Icons.Blocked /> Période bloquée
          </h3>

          <div className="event-details-row">
            <label className="event-details-label">Responsable</label>
            <span className="event-details-value">
              <Icons.User className="event-details-inline-icon" />
              {getInstructorName(slot.actual_instructor_id)}
            </span>
          </div>

          {event?.description && (
            <div className="event-details-row event-details-row-full">
              <label className="event-details-label">Raison</label>
              <p className="event-details-description">{event.description}</p>
            </div>
          )}
        </div>
      )}

      {/* Cancellation Info */}
      {slot.slot_status === 'cancelled' && slot.cancellation_reason && (
        <div className="event-details-section event-details-section-warning">
          <h3 className="event-details-section-title">
            <Icons.Warning /> Annulation
          </h3>
          <div className="event-details-row event-details-row-full">
            <p className="event-details-description event-details-cancellation">
              {slot.cancellation_reason}
            </p>
          </div>
        </div>
      )}

      {/* Metadata */}
      <div className="event-details-section event-details-section-metadata">
        <h3 className="event-details-section-title">
          <Icons.Info /> Métadonnées
        </h3>

        <div className="event-details-metadata-grid">
          <div className="event-details-metadata-item">
            <span className="event-details-metadata-label">ID Slot</span>
            <span className="event-details-metadata-value">#{slot.id}</span>
          </div>
          {event && (
            <div className="event-details-metadata-item">
              <span className="event-details-metadata-label">ID Event</span>
              <span className="event-details-metadata-value">#{event.id}</span>
            </div>
          )}
          <div className="event-details-metadata-item">
            <span className="event-details-metadata-label">Créé le</span>
            <span className="event-details-metadata-value">
              {formatDate(slot.created_at, 'dd/MM/yyyy HH:mm', { locale: fr })}
            </span>
          </div>
          <div className="event-details-metadata-item">
            <span className="event-details-metadata-label">Modifié le</span>
            <span className="event-details-metadata-value">
              {formatDate(slot.updated_at, 'dd/MM/yyyy HH:mm', { locale: fr })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsTab;
