import PropTypes from 'prop-types';
import { Icons } from '../../../../lib/icons';
import { getStatusConfig } from '../../../../lib/domain/events';
import { getInstructorConfig } from '../../../../lib/domain/domain-constants';
import DomainBadge from '../../../common/DomainBadge';
import { formatDate, formatDateTime, formatTimeFlexible } from '../../../../lib/helpers/formatters';

export default function BlockedEventDisplay({ slot, event, recurrence }) {
  if (!slot || !event) {
    return (
      <div className="alert alert-info">
        <Icons.Loading className="spin" /> Chargement du créneau...
      </div>
    );
  }

  const instructorConfig = getInstructorConfig(event.instructor_id);
  const statusConfig = getStatusConfig(slot.slot_status);
  console.log(statusConfig);

  return (
    <div className="modal-content-scrollable">
      {/* HEADER */}
      <div className="layout-sidebar-content">
        <div className="info-card">
          <div className="info-card-header">Statut</div>
          <div className="info-card-body">
            <div className="info-item-modern">
              <div className="info-content">
                <div className="info-value">
                  <h3>{event.name || 'Période bloquée'}</h3>
                </div>
                {statusConfig && (
                  <div className="header-badge">
                    <DomainBadge config={statusConfig} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DATE & TIME */}
      <div className="info-card">
        <div className="info-card-header">
          <h3>Date et horaires</h3>
        </div>
        <div className="info-card-body">
          <div className="info-item-modern">
            <div className="info-icon info-icon-success">
              <Icons.Check />
            </div>
            <div className="info-content">
              <span className="info-label">Date</span>
              <span className="info-value">{formatDate(slot.slot_date) || '—'}</span>
            </div>
          </div>

          {slot.is_all_day ? (
            <div className="info-item-modern">
              <div className="info-icon info-banner success">
                <Icons.Clock />
              </div>
              <div className="info-content">
                <span className="info-value">Journée entière</span>
              </div>
            </div>
          ) : (
            <div className="info-item-modern">
              <div className="info-content">
                <span className="info-label">Début</span>
                <span className="info-value">{formatTimeFlexible(slot.start_time) || '—'}</span>
              </div>
              <div className="info-content">
                <span className="info-label">Fin</span>
                <span className="info-value">{formatTimeFlexible(slot.end_time) || '—'}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* DETAILS */}
      <div className="info-card">
        <div className="info-card-header">
          <h3>Détails</h3>
        </div>

        <div className="info-card-body">
          <div className="info-item-modern">
            <div className="info-content">
              <span className="info-label">Instructeur</span>
              <span className="info-value">
                {instructorConfig ? <DomainBadge config={instructorConfig} /> : '—'}
              </span>
            </div>
          </div>

          {event.description && (
            <div className="info-item-modern">
              <div className="info-content">
                <div className="info-item full-width">
                  <span className="info-label">Description</span>
                  <p className="info-description">{event.description}</p>
                </div>
              </div>
            </div>
          )}

          {recurrence && (
            <div className="info-item full-width">
              <span className="info-label">
                <Icons.Repeat /> Récurrence
              </span>
              <span className="info-value">{recurrence}</span>
            </div>
          )}
        </div>
      </div>

      {/* METADATA */}
      <div className="metadata-footer">
        <span className="text-muted">Créé le {formatDateTime(event.created_at) || '—'}</span>
      </div>
    </div>
  );
}

BlockedEventDisplay.propTypes = {
  slot: PropTypes.object,
  event: PropTypes.object,
  recurrence: PropTypes.string,
};
