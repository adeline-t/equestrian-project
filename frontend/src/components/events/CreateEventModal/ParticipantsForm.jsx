import { useEffect, useState } from 'react';
import { useParticipants } from '../../../hooks/useParticipants';
import { useRiderHorsesWithPairings } from '../../../hooks/useRiderHorsesWithPairings';
import { Icons } from '../../../lib/icons.jsx';
import '../../../styles/components/events.css';

function ParticipantsForm({ participants, addParticipant, removeParticipant, updateParticipant }) {
  const {
    riders,
    horses,
    selectedRiderId,
    setSelectedRiderId,
    selectedHorseId,
    setSelectedHorseId,
    showAddParticipant,
    setShowAddParticipant,
    resetParticipantForm,
    loading: participantsLoading,
  } = useParticipants();

  const { horses: riderHorses } = useRiderHorsesWithPairings(selectedRiderId);
  const [editingParticipantId, setEditingParticipantId] = useState(null);

  useEffect(() => {
    if (selectedRiderId && riderHorses.length > 0) {
      setSelectedHorseId(String(riderHorses[0].id));
    }
  }, [selectedRiderId, riderHorses, setSelectedHorseId]);

  const handleAddParticipant = () => {
    if (!selectedRiderId && !selectedHorseId) return;

    addParticipant(
      selectedRiderId ? Number(selectedRiderId) : null,
      selectedHorseId ? Number(selectedHorseId) : null,
      'manual'
    );

    resetParticipantForm();
    setEditingParticipantId(null);
  };

  const handleEditParticipant = (participantId) => {
    const participant = participants.find((p) => p.id === participantId);
    if (participant) {
      setSelectedRiderId(participant.rider_id ? String(participant.rider_id) : '');
      setSelectedHorseId(participant.horse_id ? String(participant.horse_id) : '');
      setEditingParticipantId(participantId);
      setShowAddParticipant(true);
    }
  };

  const handleSaveEdit = () => {
    if (!selectedRiderId && !selectedHorseId) return;

    updateParticipant(
      editingParticipantId,
      selectedRiderId ? Number(selectedRiderId) : null,
      selectedHorseId ? Number(selectedHorseId) : null
    );

    resetParticipantForm();
    setEditingParticipantId(null);
  };

  const cancelEdit = () => {
    resetParticipantForm();
    setEditingParticipantId(null);
  };

  const getRiderName = (id) => riders.find((r) => r.id === id)?.name || `Cavalier #${id}`;
  const getHorseName = (id) => horses.find((h) => h.id === id)?.name || `Cheval #${id}`;

  return (
    <div className="participants-container">
      {participantsLoading && (
        <div className="participants-alert participants-alert-info">
          <Icons.Loading className="participants-spin participants-alert-icon" />
          Chargement des cavaliers et chevaux...
        </div>
      )}

      {participants.length > 0 ? (
        <div className="participants-table-wrapper">
          <table className="participants-table">
            <thead>
              <tr>
                <th>
                  <Icons.User /> Cavaliers
                </th>
                <th>
                  <Icons.Horse /> Chevaux
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {participants.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div className="participant-cell">
                      {p.rider_id ? (
                        getRiderName(p.rider_id)
                      ) : (
                        <span className="participant-missing">Aucun cavalier</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="participant-cell">
                      {p.horse_id ? (
                        getHorseName(p.horse_id)
                      ) : (
                        <span className="participant-missing">Aucun cheval</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="participant-actions">
                      <button
                        type="button"
                        className="participants-btn-icon btn-edit-ghost"
                        onClick={() => handleEditParticipant(p.id)}
                        title="Modifier"
                      >
                        <Icons.Edit />
                      </button>
                      <button
                        type="button"
                        className="participants-btn-icon btn-danger-ghost"
                        onClick={() => removeParticipant(p.id)}
                        title="Supprimer"
                      >
                        <Icons.Delete />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="participants-empty-state">
          <Icons.Users />
          <p>Aucun participant ajouté</p>
        </div>
      )}

      {showAddParticipant && (
        <div className="participants-add-form">
          <div className="participants-form-header">
            <h4>{editingParticipantId ? 'Modifier le participant' : 'Ajouter un participant'}</h4>
            {editingParticipantId && (
              <button type="button" className="participants-btn-link" onClick={cancelEdit}>
                Annuler
              </button>
            )}
          </div>

          <select
            value={selectedRiderId || ''}
            onChange={(e) => setSelectedRiderId(e.target.value)}
          >
            <option value="">-- Sélectionnez un cavalier (optionnel) --</option>
            {riders
              .filter(
                (r) =>
                  !participants.some((p) => p.rider_id === r.id && p.id !== editingParticipantId)
              )
              .map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
          </select>

          <div className="participants-horses-section">
            {selectedRiderId && riderHorses.length > 0 && (
              <>
                <label className="event-form-label">Ses chevaux</label>
                <div className="participants-horses">
                  {riderHorses
                    .filter(
                      (h) =>
                        !participants.some(
                          (p) => p.horse_id === h.id && p.id !== editingParticipantId
                        )
                    )
                    .map((h) => (
                      <div
                        key={h.id}
                        className={selectedHorseId === String(h.id) ? 'selected' : ''}
                        onClick={() =>
                          setSelectedHorseId(selectedHorseId === String(h.id) ? '' : String(h.id))
                        }
                      >
                        <Icons.Horse /> {h.name}
                      </div>
                    ))}
                </div>
              </>
            )}

            <label
              className="event-form-label"
              style={{ marginTop: selectedRiderId && riderHorses.length > 0 ? '12px' : '0' }}
            >
              {selectedRiderId && riderHorses.length > 0 ? 'Autres chevaux' : 'Tous les chevaux'}
            </label>
            <div className="participants-horses">
              {horses
                .filter(
                  (h) =>
                    !riderHorses.some((rh) => rh.id === h.id) &&
                    !participants.some((p) => p.horse_id === h.id && p.id !== editingParticipantId)
                )
                .map((h) => (
                  <div
                    key={h.id}
                    className={selectedHorseId === String(h.id) ? 'selected' : ''}
                    onClick={() =>
                      setSelectedHorseId(selectedHorseId === String(h.id) ? '' : String(h.id))
                    }
                  >
                    <Icons.Horse /> {h.name}
                  </div>
                ))}
            </div>
          </div>

          <button
            type="button"
            className="participants-btn participants-btn-primary"
            onClick={editingParticipantId ? handleSaveEdit : handleAddParticipant}
            disabled={!selectedRiderId && !selectedHorseId}
          >
            <Icons.Add /> {editingParticipantId ? 'Sauvegarder' : 'Ajouter'}
          </button>
        </div>
      )}
    </div>
  );
}

export default ParticipantsForm;
