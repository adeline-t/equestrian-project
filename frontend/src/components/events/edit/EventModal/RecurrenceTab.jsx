import { Icons } from '../../../../lib/icons';
import { getHorseAssignmentConfig } from '../../../../lib/domain/domain-constants';
import DomainBadge from '../../../common/DomainBadge';
import '../../../../styles/features/events.css';

const FREQUENCY_LABELS = {
  daily: 'Quotidien',
  weekly: 'Hebdomadaire',
  monthly: 'Mensuel',
};

const WEEKDAY_LABELS = {
  1: 'Lundi',
  2: 'Mardi',
  3: 'Mercredi',
  4: 'Jeudi',
  5: 'Vendredi',
  6: 'Samedi',
  7: 'Dimanche',
};

const RecurrenceTab = ({ recurrence, slot }) => {
  if (!recurrence) {
    return (
      <div className="empty-state">
        <Icons.Repeat />
        <p>Aucune récurrence associée</p>
      </div>
    );
  }

  return (
    <div className="recurrence-tab">
      {/* Recurrence Info */}
      <div className="event-details-section">
        <h3 className="event-details-section-title">
          <Icons.Repeat /> Paramètres de récurrence
        </h3>

        <div className="event-details-row">
          <label className="event-details-label">Fréquence</label>
          <span className="event-details-value">
            {FREQUENCY_LABELS[recurrence.frequency] || recurrence.frequency}
            {recurrence.interval > 1 && ` (tous les ${recurrence.interval})`}
          </span>
        </div>

        {recurrence.by_week_days && recurrence.by_week_days.length > 0 && (
          <div className="event-details-row">
            <label className="event-details-label">Jours de la semaine</label>
            <div className="recurrence-weekdays">
              {recurrence.by_week_days.map((day) => (
                <span key={day} className="badge badge-day">
                  {WEEKDAY_LABELS[day]}
                </span>
              ))}
            </div>
          </div>
        )}

        {recurrence.start_time && recurrence.end_time && (
          <div className="event-details-row">
            <label className="event-details-label">Horaires récurrents</label>
            <span className="event-details-value">
              {recurrence.start_time.slice(0, 5)} - {recurrence.end_time.slice(0, 5)}
            </span>
          </div>
        )}
      </div>

      {/* Recurrence Participants */}
      {recurrence.participants && recurrence.participants.length > 0 && (
        <div className="event-details-section">
          <h3 className="event-details-section-title">
            <Icons.Users /> Participants réguliers ({recurrence.participants.length})
          </h3>
          <div className="recurrence-participants-list">
            {recurrence.participants.map((p) => {
              const assignmentConfig = getHorseAssignmentConfig(p.horse_assignment_type);

              return (
                <div key={p.id} className="recurrence-participant-card">
                  <div className="recurrence-participant-main">
                    <div className="recurrence-participant-info">
                      <Icons.User className="recurrence-participant-icon" />
                      <span className="recurrence-participant-name">
                        {p.rider?.name || 'Cavalier inconnu'}
                      </span>
                    </div>
                    {p.horse && (
                      <div className="recurrence-participant-horse">
                        <Icons.Horse className="recurrence-participant-icon" />
                        <span className="recurrence-participant-horse-name">{p.horse.name}</span>
                        {assignmentConfig && <DomainBadge config={assignmentConfig} />}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Warning if this occurrence differs */}
      <div className="event-details-section event-details-section-info">
        <div className="recurrence-occurrence-info">
          <Icons.Info className="recurrence-info-icon" />
          <div className="recurrence-info-content">
            <p>
              <strong>Cette occurrence fait partie d'une série récurrente</strong>
            </p>
            <p>
              Les modifications apportées à cette occurrence n'affecteront pas les autres événements
              de la série.
            </p>
          </div>
        </div>
      </div>

      {/* Recurrence Metadata */}
      <div className="event-details-section event-details-section-metadata">
        <h3 className="event-details-section-title">
          <Icons.Settings /> Métadonnées de récurrence
        </h3>

        <div className="event-details-metadata-grid">
          <div className="event-details-metadata-item">
            <span className="event-details-metadata-label">ID Récurrence</span>
            <span className="event-details-metadata-value">#{recurrence.id}</span>
          </div>
          {recurrence.created_at && (
            <div className="event-details-metadata-item">
              <span className="event-details-metadata-label">Créée le</span>
              <span className="event-details-metadata-value">
                {new Date(recurrence.created_at).toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecurrenceTab;
