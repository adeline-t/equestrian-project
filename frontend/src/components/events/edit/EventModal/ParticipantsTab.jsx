import { useState } from 'react';
import { calendarService } from '../../../../services/calendarService';
import { Icons } from '../../../../lib/icons';
import '../../../../styles/components/events.css';

const ASSIGNMENT_TYPE_LABELS = {
  manual: 'Manuel',
  owned: 'Propriétaire',
  loaned: 'Prêt',
  automatic: 'Automatique',
};

const RIDER_TYPE_LABELS = {
  owner: 'Propriétaire',
  club: 'Club',
  boarder: 'Pensionnaire',
};

const OWNERSHIP_TYPE_LABELS = {
  owned: 'Propriété du club',
  boarded: 'En pension',
  lease: 'En location',
};

const LINK_TYPE_LABELS = {
  ownership: 'Propriété',
  loan: 'Prêt',
};

const WEEKDAY_LABELS = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

const ParticipantsTab = ({ participants, event, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedParticipant, setExpandedParticipant] = useState(null);

  const handleRemoveParticipant = async (participantId) => {
    if (!confirm('Supprimer ce participant ?')) return;

    try {
      setLoading(true);
      setError(null);
      await calendarService.removeParticipant(participantId);
      onUpdate();
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la suppression');
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (participantId) => {
    setExpandedParticipant(expandedParticipant === participantId ? null : participantId);
  };

  if (!participants || participants.length === 0) {
    return (
      <div className="participants-empty-state">
        <Icons.Users style={{ fontSize: '48px', color: 'var(--color-gray-400)' }} />
        <p>Aucun participant inscrit</p>
        {event && (
          <div className="participants-empty-meta">
            <span>
              Capacité: {event.min_participants} - {event.max_participants} participants
            </span>
          </div>
        )}
      </div>
    );
  }

  const participantCount = participants.length;
  const maxParticipants = event?.max_participants || 0;
  const isFull = maxParticipants > 0 && participantCount >= maxParticipants;

  return (
    <div className="participants-container">
      {/* Summary Card */}
      <div className="participants-summary">
        <div className="participants-summary-stat">
          <Icons.Users className="participants-summary-icon" />
          <div className="participants-summary-content">
            <span className="participants-summary-label">Inscrits</span>
            <span className="participants-summary-value">
              {participantCount} / {maxParticipants || '∞'}
            </span>
          </div>
        </div>
        {maxParticipants > 0 && (
          <div className="participants-summary-progress">
            <div className="participants-progress-bar">
              <div
                className={`participants-progress-fill ${isFull ? 'full' : ''}`}
                style={{ width: `${Math.min((participantCount / maxParticipants) * 100, 100)}%` }}
              />
            </div>
            <span className="participants-progress-text">
              {isFull ? 'Complet' : `${maxParticipants - participantCount} place(s) restante(s)`}
            </span>
          </div>
        )}
      </div>

      {error && (
        <div className="create-event-alert create-event-alert-error">
          <Icons.Warning className="create-event-alert-icon" />
          {error}
        </div>
      )}

      {/* Participants List */}
      <div className="participants-list">
        {participants.map((p) => {
          const isExpanded = expandedParticipant === p.id;
          const hasDetails =
            p.rider?.email ||
            p.rider?.phone ||
            p.package ||
            p.pairing ||
            p.rider?.rider_type ||
            p.horse?.ownership_type;

          return (
            <div key={p.id} className="participant-card">
              {/* Main Info */}
              <div className="participant-card-header">
                <div className="participant-card-main">
                  {/* Rider Info */}
                  <div className="participant-info">
                    <div className="participant-info-header">
                      <Icons.User className="participant-icon" />
                      <div className="participant-name-section">
                        {p.rider ? (
                          <>
                            <span className="participant-name">{p.rider.name}</span>
                            {p.rider.rider_type && (
                              <span className="participant-badge participant-badge-rider">
                                {RIDER_TYPE_LABELS[p.rider.rider_type] || p.rider.rider_type}
                              </span>
                            )}
                          </>
                        ) : (
                          <span className="participant-missing">Aucun cavalier</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Horse Info */}
                  <div className="participant-info">
                    <div className="participant-info-header">
                      <Icons.Horse className="participant-icon" />
                      <div className="participant-name-section">
                        {p.horse ? (
                          <>
                            <span className="participant-name">{p.horse.name}</span>
                            <span className="participant-badge participant-badge-assignment">
                              {ASSIGNMENT_TYPE_LABELS[p.horse_assignment_type] ||
                                p.horse_assignment_type}
                            </span>
                          </>
                        ) : (
                          <span className="participant-missing">Aucun cheval</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="participant-card-actions">
                  {hasDetails && (
                    <button
                      type="button"
                      className="participants-btn-icon"
                      onClick={() => toggleExpand(p.id)}
                      title={isExpanded ? 'Réduire' : 'Voir plus'}
                    >
                      {isExpanded ? <Icons.ChevronUp /> : <Icons.ChevronDown />}
                    </button>
                  )}
                  <button
                    type="button"
                    className="participants-btn-icon btn-danger-ghost"
                    onClick={() => handleRemoveParticipant(p.id)}
                    disabled={loading}
                    title="Retirer le participant"
                  >
                    <Icons.Delete />
                  </button>
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && hasDetails && (
                <div className="participant-card-details">
                  {/* Rider Details */}
                  {(p.rider?.email || p.rider?.phone) && (
                    <div className="participant-detail-section">
                      <h4 className="participant-detail-title">
                        <Icons.Info /> Contact cavalier
                      </h4>
                      <div className="participant-detail-grid">
                        {p.rider.email && (
                          <div className="participant-detail-item">
                            <Icons.Mail className="participant-detail-icon" />
                            <span>{p.rider.email}</span>
                          </div>
                        )}
                        {p.rider.phone && (
                          <div className="participant-detail-item">
                            <Icons.Phone className="participant-detail-icon" />
                            <span>{p.rider.phone}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Package Info */}
                  {p.package && (
                    <div className="participant-detail-section">
                      <h4 className="participant-detail-title">
                        <Icons.Package /> Forfait actif
                      </h4>
                      <div className="participant-detail-grid">
                        <div className="participant-detail-item">
                          <Icons.Calendar className="participant-detail-icon" />
                          <span>{p.package.services_per_week} service(s) / semaine</span>
                        </div>
                        <div className="participant-detail-item">
                          <Icons.Users className="participant-detail-icon" />
                          <span>
                            {p.package.group_lessons_per_week} cours collectif(s) / semaine
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Pairing Info */}
                  {p.pairing && (
                    <div className="participant-detail-section">
                      <h4 className="participant-detail-title">
                        <Icons.Link /> Relation cavalier-cheval
                      </h4>
                      <div className="participant-detail-grid">
                        <div className="participant-detail-item">
                          <Icons.Settings className="participant-detail-icon" />
                          <span>
                            {LINK_TYPE_LABELS[p.pairing.link_type] || p.pairing.link_type}
                          </span>
                        </div>
                        {p.pairing.link_type === 'loan' && p.pairing.loan_days && (
                          <div className="participant-detail-item">
                            <Icons.Calendar className="participant-detail-icon" />
                            <div className="loan-days-badges">
                              {p.pairing.loan_days.map((day) => (
                                <span key={day} className="loan-day-badge">
                                  {WEEKDAY_LABELS[day]}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {p.pairing.pairing_start_date && (
                          <div className="participant-detail-item">
                            <Icons.Calendar className="participant-detail-icon" />
                            <span>
                              Depuis le{' '}
                              {new Date(p.pairing.pairing_start_date).toLocaleDateString('fr-FR')}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Horse Details */}
                  {p.horse?.ownership_type && (
                    <div className="participant-detail-section">
                      <h4 className="participant-detail-title">
                        <Icons.Horse /> Informations cheval
                      </h4>
                      <div className="participant-detail-grid">
                        <div className="participant-detail-item">
                          <Icons.Info className="participant-detail-icon" />
                          <span>
                            {OWNERSHIP_TYPE_LABELS[p.horse.ownership_type] ||
                              p.horse.ownership_type}
                          </span>
                        </div>
                        {p.horse.kind && (
                          <div className="participant-detail-item">
                            <Icons.Horse className="participant-detail-icon" />
                            <span>{p.horse.kind}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ParticipantsTab;
