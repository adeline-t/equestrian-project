import PropTypes from 'prop-types';
import { Icons } from '../../../../lib/icons';
import { getStatusConfig } from '../../../../lib/domain/events';
import { getInstructorConfig } from '../../../../lib/domain/domain-constants';
import DomainBadge from '../../../common/DomainBadge';
import { formatDate, formatDateTime, formatTimeFlexible } from '../../../../lib/helpers/formatters';
import '../../../../styles/features/events.css';

export default function BlockedEventDisplay({ slot, event, recurrence }) {
  if (!slot || !event) {
    return <div className="blocked-event-loading">Chargement du créneau...</div>;
  }

  const instructorConfig = getInstructorConfig(event.instructor_id);
  const statusConfig = getStatusConfig(slot.slot_status);
  const StatusIcon = statusConfig?.icon || Icons.Info;

  return (
    <div className="blocked-event-display">
      {/* Header - Event Name & Status */}
      <div className="blocked-event-display-header">
        <h3 className="blocked-event-display-title">{event.name || 'Période bloquée'}</h3>

        <div className="blocked-event-status-badge">
          <StatusIcon className="blocked-event-status-icon" />
          {statusConfig && <DomainBadge config={statusConfig} />}
        </div>
      </div>

      {/* Date & Time Section */}
      <div className="blocked-event-datetime-section">
        <div className="blocked-event-datetime-header">
          <Icons.Calendar className="blocked-event-datetime-icon" />
          Date et horaires
        </div>

        <div className="blocked-event-datetime-content">
          <div className="blocked-event-datetime-row">
            <span className="blocked-event-datetime-label">Date :</span>
            <span className="blocked-event-datetime-value">
              {formatDate(slot.slot_date) || '—'}
            </span>
          </div>

          {slot.is_all_day ? (
            <div className="blocked-event-all-day-badge">
              <Icons.Calendar className="blocked-event-all-day-icon" />
              Journée entière
            </div>
          ) : (
            <>
              <div className="blocked-event-datetime-row">
                <span className="blocked-event-datetime-label">Début :</span>
                <span className="blocked-event-datetime-value">
                  {formatTimeFlexible(slot.start_time) || '—'}
                </span>
              </div>
              <div className="blocked-event-datetime-row">
                <span className="blocked-event-datetime-label">Fin :</span>
                <span className="blocked-event-datetime-value">
                  {formatTimeFlexible(slot.end_time) || '—'}
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Details Section */}
      <div className="blocked-event-details">
        <div className="blocked-event-detail-item">
          <div className="blocked-event-detail-label">
            <Icons.User className="detail-label-icon" />
            Instructeur
          </div>
          <div className="blocked-event-detail-value">
            {instructorConfig && <DomainBadge config={instructorConfig} />}
          </div>
        </div>

        {event.description && (
          <div className="blocked-event-detail-item">
            <div className="blocked-event-detail-label">
              <Icons.Info className="detail-label-icon" />
              Description
            </div>
            <div className="blocked-event-description">{event.description}</div>
          </div>
        )}

        {recurrence && (
          <div className="blocked-event-detail-item">
            <div className="blocked-event-detail-label">
              <Icons.Repeat className="detail-label-icon" />
              Récurrence
            </div>
            <div className="blocked-event-recurrence">{recurrence}</div>
          </div>
        )}
      </div>

      {/* Metadata Footer */}
      <div className="blocked-event-metadata">
        <Icons.Calendar className="metadata-icon" />
        Créé le {formatDateTime(event.created_at) || '—'}
      </div>
    </div>
  );
}

BlockedEventDisplay.propTypes = {
  slot: PropTypes.object,
  event: PropTypes.object,
  recurrence: PropTypes.string,
};
