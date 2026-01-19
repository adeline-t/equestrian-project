import { useState } from 'react';
import { calendarService } from '../../../services/calendarService';
import { Icons } from '../../../lib/icons';
import '../../../styles/components/events.css';

const ASSIGNMENT_TYPE_LABELS = {
  manual: 'Manuel',
  owned: 'Propriétaire',
  loaned: 'Prêt',
  automatic: 'Automatique',
};

const ASSIGNMENT_TYPE_ICONS = {
  manual: Icons.Edit,
  owned: Icons.User,
  loaned: Icons.Horse,
  automatic: Icons.Settings,
};

const ParticipantsTab = ({ participants, event, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

      <div className="participants-table-wrapper">
        <table className="participants-table">
          <thead>
            <tr>
              <th>
                <Icons.User /> Cavalier
              </th>
              <th>
                <Icons.Horse /> Cheval
              </th>
              <th>
                <Icons.Settings /> Type d'attribution
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {participants.map((p) => {
              const AssignmentIcon =
                ASSIGNMENT_TYPE_ICONS[p.horse_assignment_type] || Icons.Settings;

              return (
                <tr key={p.id}>
                  <td>
                    <div className="participant-info-cell">
                      {p.rider ? (
                        <>
                          <span className="participant-name">{p.rider.name}</span>
                          {p.rider.phone && (
                            <span className="participant-contact">
                              <Icons.Phone style={{ fontSize: '12px' }} />
                              {p.rider.phone}
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="participant-missing">Aucun cavalier</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="participant-info-cell">
                      {p.horse ? (
                        <span className="participant-name">{p.horse.name}</span>
                      ) : (
                        <span className="participant-missing">Aucun cheval</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="participant-type-badge">
                      <Icons.Link className="participant-type-icon" />
                      {ASSIGNMENT_TYPE_LABELS[p.horse_assignment_type] || p.horse_assignment_type}
                    </div>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="participants-btn-icon btn-danger-ghost"
                      onClick={() => handleRemoveParticipant(p.id)}
                      disabled={loading}
                      title="Retirer le participant"
                    >
                      <Icons.Delete />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ParticipantsTab;
