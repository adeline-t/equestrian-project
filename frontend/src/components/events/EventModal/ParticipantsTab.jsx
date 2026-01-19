import { useState } from 'react';
import { calendarService } from '../../../services/calendarService';
import { Icons } from '../../../lib/icons';
import '../../../styles/components/events.css';

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
        <Icons.Users />
        <p>Aucun participant inscrit</p>
      </div>
    );
  }

  return (
    <div className="participants-container">
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
              <th>Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {participants.map((p) => (
              <tr key={p.id}>
                <td>{p.rider?.name || '-'}</td>
                <td>{p.horse?.name || '-'}</td>
                <td>
                  <span className="participant-type-badge">
                    {p.horse_assignment_type === 'manual'
                      ? 'Manuel'
                      : p.horse_assignment_type === 'owned'
                      ? 'Propriétaire'
                      : p.horse_assignment_type === 'loaned'
                      ? 'Prêt'
                      : 'Auto'}
                  </span>
                </td>
                <td>
                  <button
                    type="button"
                    className="participants-btn-icon btn-danger-ghost"
                    onClick={() => handleRemoveParticipant(p.id)}
                    disabled={loading}
                    title="Supprimer"
                  >
                    <Icons.Delete />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ParticipantsTab;
