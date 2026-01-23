import { useState, useEffect } from 'react';
import { useParticipantSelection } from '../../../../hooks/useParticipantSelection.js';
import {
  RIDER_TYPES,
  OWNER_TYPES,
  getRiderTypeLabel,
} from '../../../../lib/domain/domain-constants.js';
import { Icons } from '../../../../lib/icons.jsx';
import '../../../../styles/features/events.css';

function ParticipantsForm({
  participants,
  canAddParticipant,
  addParticipant,
  removeParticipant,
  updateParticipant,
}) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingParticipantId, setEditingParticipantId] = useState(null);
  const [riderTypeFilter, setRiderTypeFilter] = useState('all');
  const [riderSearch, setRiderSearch] = useState('');
  const [horseOwnershipFilter, setHorseOwnershipFilter] = useState('all');

  const participantSelection = useParticipantSelection(participants, editingParticipantId);

  const {
    loading,
    selectedRiderId,
    setSelectedRiderId,
    selectedHorseId,
    setSelectedHorseId,
    setSelection,
    resetSelection,
    getAvailableRiders,
    getAvailableHorses,
    getRiderName,
    getHorseName,
  } = participantSelection;

  // Auto-select first horse when rider is selected
  useEffect(() => {
    if (selectedRiderId) {
      const availableHorses = getAvailableHorses(horseOwnershipFilter);
      if (availableHorses.length > 0 && !selectedHorseId) {
        setSelectedHorseId(availableHorses[0].id);
      }
    }
  }, [
    selectedRiderId,
    horseOwnershipFilter,
    selectedHorseId,
    getAvailableHorses,
    setSelectedHorseId,
  ]);

  const startAdd = () => {
    resetSelection();
    setEditingParticipantId(null);
    setShowAddForm(true);
    setRiderTypeFilter('all');
    setHorseOwnershipFilter('all');
  };

  const startEdit = (participantId) => {
    const participant = participants.find((p) => p.id === participantId);
    if (!participant) return;

    // Set the current participant selection
    setSelection(participant.rider_id, participant.horse_id);
    setEditingParticipantId(participantId);
    setShowAddForm(true);
    setRiderTypeFilter('all');
    setHorseOwnershipFilter('all');
  };

  const cancelEdit = () => {
    resetSelection();
    setEditingParticipantId(null);
    setShowAddForm(false);
    setRiderTypeFilter('all');
    setHorseOwnershipFilter('all');
  };

  const handleSubmit = () => {
    if (!selectedRiderId && !selectedHorseId) return;

    if (editingParticipantId) {
      updateParticipant(editingParticipantId, selectedRiderId, selectedHorseId);
    } else {
      addParticipant(selectedRiderId, selectedHorseId);
    }

    resetSelection();
    setEditingParticipantId(null);
    setShowAddForm(false);
  };

  const availableRiders = getAvailableRiders(riderTypeFilter, riderSearch);
  const availableHorses = getAvailableHorses(horseOwnershipFilter);

  return (
    <div className="form-section">
      <h3 className="mb-15">Participants</h3>

      {loading && (
        <div className="alert alert-info mb-15">
          <Icons.Loading className="spin" /> Chargement des cavaliers et chevaux…
        </div>
      )}

      {/* EXISTING PARTICIPANTS */}
      {participants.length > 0 ? (
        <div className="participants-list mb-20">
          {participants.map((p) => (
            <div key={p.id} className="participant-card">
              <div className="participant-card-header">
                {p.rider_id ? getRiderName(p.rider_id) : 'Cavalier à choisir'}
              </div>
              <div className="participant-card-body">
                {p.horse_id ? getHorseName(p.horse_id) : 'Cheval à choisir'}
              </div>
              <div className="participant-card-footer">
                <button
                  type="button"
                  className="btn-icon-modern"
                  onClick={() => startEdit(p.id)}
                  title="Modifier"
                >
                  <Icons.Edit />
                </button>
                <button
                  type="button"
                  className="btn-icon-modern danger"
                  onClick={() => removeParticipant(p.id)}
                  title="Supprimer"
                >
                  <Icons.Delete />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state-small mb-20">
          <Icons.Users />
          <p>Aucun participant ajouté</p>
        </div>
      )}

      {!showAddForm && canAddParticipant && (
        <button type="button" className="btn btn-secondary" onClick={startAdd}>
          <Icons.Add /> Ajouter un participant
        </button>
      )}

      {/* ADD / EDIT FORM */}
      {showAddForm && (
        <div className="event-form-section mt-20">
          <h4 className="mb-15">
            {editingParticipantId ? 'Modifier le participant' : 'Ajouter un participant'}
          </h4>

          {/* RIDER FILTERS */}
          <div className="filter-section mb-15">
            <div className="filter-pills">
              <button
                className={`pill ${riderTypeFilter === 'all' ? 'pill-active' : ''}`}
                onClick={() => setRiderTypeFilter('all')}
              >
                Tous
              </button>
              {Object.values(RIDER_TYPES).map((type) => (
                <button
                  key={type}
                  className={`pill ${riderTypeFilter === type ? 'pill-active' : ''}`}
                  onClick={() => setRiderTypeFilter(type)}
                >
                  {getRiderTypeLabel(type)}
                </button>
              ))}
            </div>
          </div>

          {/* RIDER SEARCH */}
          <div className="form-group mb-15">
            <input
              type="text"
              placeholder="Rechercher un cavalier..."
              value={riderSearch}
              onChange={(e) => setRiderSearch(e.target.value)}
              className="form-input"
            />
          </div>

          {/* RIDER BUTTONS */}
          <div className="form-group mb-15">
            <div className="event-form-times-group">
              {availableRiders.map((r) => {
                const isActive = selectedRiderId === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    className={`btn-form ${isActive ? 'active' : ''}`}
                    onClick={() => setSelectedRiderId(isActive ? null : r.id)}
                  >
                    {r.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* HORSE FILTERS */}
          <div className="filter-section mb-10">
            <div className="filter-pills">
              <button
                className={`pill ${horseOwnershipFilter === 'all' ? 'pill-active' : ''}`}
                onClick={() => setHorseOwnershipFilter('all')}
              >
                Tous
              </button>
              {Object.values(OWNER_TYPES).map((type) => (
                <button
                  key={type}
                  className={`pill ${horseOwnershipFilter === type ? 'pill-active' : ''}`}
                  onClick={() => setHorseOwnershipFilter(type)}
                >
                  {type === OWNER_TYPES.LAURY
                    ? 'Laury'
                    : type === OWNER_TYPES.PRIVATE_OWNER
                    ? 'Propriétaire'
                    : type === OWNER_TYPES.CLUB
                    ? 'Club'
                    : 'Autre'}
                </button>
              ))}
            </div>
          </div>

          {/* HORSE BUTTONS */}
          <div className="form-group mb-15">
            <div className="event-form-times-group">
              {availableHorses.map((h) => {
                const isActive = selectedHorseId === h.id;
                return (
                  <button
                    key={h.id}
                    type="button"
                    className={`btn-form ${isActive ? 'active' : ''}`}
                    onClick={() => setSelectedHorseId(isActive ? null : h.id)}
                  >
                    {h.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ACTIONS */}
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={cancelEdit}>
              <Icons.Cancel /> Annuler
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={!selectedRiderId && !selectedHorseId}
            >
              <Icons.Check /> {editingParticipantId ? 'Sauvegarder' : 'Ajouter'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ParticipantsForm;
