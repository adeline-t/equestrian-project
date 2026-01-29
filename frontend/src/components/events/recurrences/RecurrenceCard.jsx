import PropTypes from 'prop-types';
import { Icons } from '../../../lib/icons';
import { formatTimeFlexible } from '../../../lib/helpers/formatters';
import { WEEK_DAYS, WEEK_DAYS_EN, weekDayCodeToFr } from '../../../lib/domain/domain-constants';

const FREQUENCY_LABELS = {
  daily: 'Quotidien',
  weekly: 'Hebdomadaire',
  monthly: 'Mensuel',
};

export default function RecurrenceCard({
  recurrences,
  isCreating,
  loading,
  error,
  deleting,
  onStartCreating,
  onDelete,
}) {
  // Afficher le loader
  if (loading) {
    return (
      <div className="info-card">
        <div className="info-card-header">
          <h3>Récurrence</h3>
        </div>
        <div className="info-card-body">
          <div className="text-center text-muted">
            <Icons.Loading className="spin" /> Chargement...
          </div>
        </div>
      </div>
    );
  }

  // Afficher l'erreur
  if (error) {
    return (
      <div className="info-card">
        <div className="info-card-header">
          <h3>Récurrence</h3>
        </div>
        <div className="info-card-body">
          <div className="alert alert-error">
            <Icons.Warning />
            <span>{error}</span>
          </div>
        </div>
      </div>
    );
  }

  // Récurrence existante
  const recurrence = recurrences && recurrences.length > 0 ? recurrences[0] : null;

  // Pas de récurrence - afficher le bouton d'ajout
  if (!recurrence) {
    return (
      <div className="info-card">
        <div className="info-card-header">
          <h3>Récurrence</h3>
          {!isCreating && (
            <button className="btn btn-primary btn-sm" onClick={onStartCreating}>
              <Icons.Add />
              Ajouter
            </button>
          )}
        </div>
        <div className="info-card-body">
          <div className="empty-state-small">
            <Icons.Calendar />
            <p>Aucune récurrence</p>
          </div>
        </div>
      </div>
    );
  }

  // Afficher la récurrence existante
  const frequencyLabel = FREQUENCY_LABELS[recurrence.frequency] || recurrence.frequency;

  return (
    <div className="info-card">
      <div className="info-card-header">
        <div className="info-card-title">
          <h3>Récurrence</h3>
        </div>
        <div className="header-actions-group">
          <button
            type="button"
            className="btn-icon-modern danger"
            onClick={() => onDelete(recurrence.id)}
            disabled={deleting}
            title="Supprimer"
          >
            {deleting ? <Icons.Loading className="spin" /> : <Icons.Delete />}
          </button>
        </div>
      </div>
      <div className="info-card-body">
        <div className="info-item-modern">
          <div className="info-content">
            <span className="info-label">Fréquence</span>
            <span className="info-value">{frequencyLabel}</span>
          </div>
        </div>

        {recurrence.week_days && recurrence.week_days.length > 0 && (
          <div className="info-item-modern">
            <div className="info-content">
              <span className="info-label">Jours</span>
              <div className="info-value">
                {WEEK_DAYS_EN.map((dayEn, i) => {
                  const dayIndex = i + 1; // 1=Lun, 2=Mar, ..., 7=Dim
                  const isActive = recurrence.week_days.includes(dayIndex);
                  return (
                    <span
                      key={dayEn}
                      className={`day-badge ${isActive ? 'active' : 'inactive'}`}
                      title={isActive ? 'Active' : 'Inactif'}
                    >
                      {weekDayCodeToFr(dayEn)}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {recurrence.is_all_day ? (
          <div className="info-item-modern">
            <div className="info-content">
              <span className="info-value">Journée entière</span>
            </div>
          </div>
        ) : (
          <div className="info-item-modern">
            <div className="info-content">
              <span className="info-label">Horaires</span>
              <span className="info-value">
                {formatTimeFlexible(recurrence.start_time)} -{' '}
                {formatTimeFlexible(recurrence.end_time)}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

RecurrenceCard.propTypes = {
  recurrences: PropTypes.array,
  loading: PropTypes.bool,
  error: PropTypes.string,
  deleting: PropTypes.bool,
  onStartCreating: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
