import PropTypes from 'prop-types';
import { Icons } from '../../../../lib/icons';
import { getStatusConfig } from '../../../../lib/domain/events';
import { getInstructorConfig } from '../../../../lib/domain/domain-constants';
import DomainBadge from '../../../common/DomainBadge';
import { formatDate, formatDateTime, formatTimeFlexible } from '../../../../lib/helpers/formatters';
import RecurrenceCard from '../../recurrences/RecurrenceCard';
import RecurrenceForm from '../../recurrences/RecurrenceForm';
import { useRecurrence } from '../../../../hooks/useRecurrence';
import '../../../../styles/features/events/recurrence-styles.css';
import { useAppMode } from '../../../../context/AppMode';
export default function BlockedEventDisplay({ slot, event }) {
  const { mode, currentRider } = useAppMode();
  const {
    recurrences,
    loading: recurrenceLoading,
    error: recurrenceError,
    isCreating,
    saving,
    saveError,
    deleting,
    startCreating,
    cancelCreating,
    createRecurrence,
    deleteRecurrence,
  } = useRecurrence(event?.id);

  if (!slot || !event) {
    return (
      <div className="alert alert-info">
        <Icons.Loading className="spin" /> Chargement du créneau...
      </div>
    );
  }

  const instructorConfig = getInstructorConfig(event.instructor_id);
  const statusConfig = getStatusConfig(slot.slot_status);

  return (
    <div className="modal-content-scrollable">
      <div className={`layout-grid-content ${isCreating ? '' : 'simple'}`}>
        {/* MAIN CONTENT */}
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
            </div>
          </div>

          {/* RECURRENCE CARD */}
          {mode === 'admin' && (
            <RecurrenceCard
              recurrences={recurrences}
              isCreating={isCreating}
              loading={recurrenceLoading}
              error={recurrenceError}
              deleting={deleting}
              onStartCreating={startCreating}
              onDelete={deleteRecurrence}
            />
          )}

          {/* METADATA */}
          <div className="metadata-footer">
            <span className="text-muted">Créé le {formatDateTime(event.created_at) || '—'}</span>
          </div>
        </div>

        {/* SIDEBAR - Recurrence Form (conditionally rendered) */}
        {isCreating && (
          <div className="layout-main-content">
            <div className="modal-sidebar-header">
              <h3>Nouvelle récurrence</h3>
            </div>
            <div className="modal-sidebar-content">
              <RecurrenceForm
                onSave={createRecurrence}
                onCancel={cancelCreating}
                saving={saving}
                saveError={saveError}
                slotData={slot}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

BlockedEventDisplay.propTypes = {
  slot: PropTypes.object,
  event: PropTypes.object,
};
