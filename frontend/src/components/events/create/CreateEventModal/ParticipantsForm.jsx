import { useState, useEffect } from 'react';
import { useParticipantSelection } from '../../../../hooks/useParticipantSelection.js';
import {
  RIDER_TYPES,
  OWNER_TYPES,
  getRiderTypeLabel,
} from '../../../../lib/domain/domain-constants.js';
import { Icons } from '../../../../lib/icons.jsx';
import { shortName } from '../../../../lib/helpers/index.js';

function ParticipantsForm({
  participants,
  canAddParticipant,
  addParticipant,
  removeParticipant,
  updateParticipant,
}) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [validationError, setValidationError] = useState(null);
  const [riderTypeFilter, setRiderTypeFilter] = useState('all');
  const [riderSearch, setRiderSearch] = useState('');
  const [horseOwnershipFilter, setHorseOwnershipFilter] = useState('all');

  const participantSelection = useParticipantSelection(participants, null);

  const {
    loading,
    selectedRiderId,
    setSelectedRiderId,
    selectedHorseId,
    setSelectedHorseId,
    resetSelection,
    getAvailableRiders,
    getAvailableHorses,
    getRiderName,
    getHorseName,
  } = participantSelection;

  useEffect(() => {
    setValidationError(null);
  }, [selectedRiderId, selectedHorseId]);

  const startAdd = () => {
    resetSelection();
    setShowAddForm(true);
    setRiderTypeFilter('all');
    setHorseOwnershipFilter('all');
    setRiderSearch('');
  };

  const cancelEdit = () => {
    resetSelection();
    setShowAddForm(false);
    setRiderTypeFilter('all');
    setHorseOwnershipFilter('all');
    setRiderSearch('');
  };

  const handleSubmit = () => {
    if (!selectedRiderId && !selectedHorseId) return;

    // Validation: Check if rider is already added
    if (selectedRiderId) {
      const riderExists = participants.some((p) => p.rider_id === selectedRiderId);
      if (riderExists) {
        setValidationError(
          `Le cavalier ${getRiderName(selectedRiderId)} est déjà ajouté comme participant.`
        );
        return;
      }
    }

    // Validation: Check if horse is already added
    if (selectedHorseId) {
      const horseExists = participants.some((p) => p.horse_id === selectedHorseId);
      if (horseExists) {
        setValidationError(
          `Le cheval ${getHorseName(selectedHorseId)} est déjà ajouté comme participant.`
        );
        return;
      }
    }

    addParticipant(selectedRiderId, selectedHorseId);
    resetSelection();
    setShowAddForm(false);
    setRiderSearch('');
  };

  const availableRiders = getAvailableRiders(riderTypeFilter, riderSearch);
  const availableHorses = getAvailableHorses(horseOwnershipFilter);

  return (
    <div className="form-section">
      <div className="card-title">
        <Icons.Users />
        <span className="card-title-text">Participants</span>
        {participants.length > 0 && <span className="count-badge">{participants.length}</span>}
      </div>

      {loading && (
        <div className="alert alert-info">
          <Icons.Loading className="spin" /> Chargement des cavaliers et chevaux…
        </div>
      )}

      {/* VALIDATION ERROR */}
      {validationError && (
        <div className="alert alert-error">
          <Icons.Warning /> {validationError}
        </div>
      )}

      {/* EXISTING PARTICIPANTS */}
      {participants.length > 0 ? (
        <div className="form-group">
          {participants.map((p) => (
            <div key={p.id} className="pairing-row">
              <div className="pairing-info">
                <div className="pairing-header">
                  <span>
                    {p.rider_id ? shortName(getRiderName(p.rider_id)) : 'Cavalier à définir'}
                  </span>
                  {p.rider_id && p.horse_id && <span className="text-muted">-</span>}
                  <span>
                    {p.horse_id ? shortName(getHorseName(p.horse_id)) : 'Cheval à définir'}
                  </span>
                </div>
              </div>
              <div className="pairing-actions">
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
        <div className="empty-state-small">
          <Icons.Users />
          <p>Aucun participant ajouté</p>
        </div>
      )}

      {!showAddForm && canAddParticipant && (
        <button type="button" className="btn btn-secondary" onClick={startAdd}>
          <Icons.Add /> Ajouter un participant
        </button>
      )}

      {/* ADD FORM */}
      {showAddForm && (
        <div className="card">
          <div className="card-header">
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={!selectedRiderId && !selectedHorseId}
            >
              <Icons.Check /> Ajouter
            </button>
          </div>
          <div className="form-section">
            {/* RIDER FILTERS */}
            <div className="list-filters">
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
            <div className="form-group">
              <label htmlFor="rider-search">Rechercher un cavalier</label>
              <input
                type="text"
                id="rider-search"
                placeholder="Rechercher un cavalier..."
                value={riderSearch}
                onChange={(e) => setRiderSearch(e.target.value)}
                className="form-input"
              />
            </div>

            {/* RIDER SELECTION */}
            <div className="form-group">
              <label>Cavalier (optionnel)</label>
              {availableRiders.length > 0 ? (
                <div className="btn-group">
                  {/* Bouton "Aucun" pour cavalier */}
                  <button
                    key="none-rider"
                    type="button"
                    className={`btn form-btn-primary ${selectedRiderId === null ? 'active' : ''}`}
                    onClick={() => setSelectedRiderId(null)}
                  >
                    Aucun
                  </button>
                  {availableRiders.map((r) => {
                    const isActive = selectedRiderId === r.id;
                    return (
                      <button
                        key={r.id}
                        type="button"
                        className={`btn form-btn-primary ${isActive ? 'active' : ''}`}
                        onClick={() => setSelectedRiderId(isActive ? null : r.id)}
                      >
                        {r.name}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="form-help">Aucun cavalier disponible</p>
              )}
            </div>

            {/* HORSE FILTERS */}
            <div className="form-group">
              <label>Cheval (optionnel)</label>
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

            {/* HORSE SELECTION */}
            <div className="form-group">
              {availableHorses.length > 0 ? (
                <div className="btn-group">
                  {/* Bouton "Aucun" pour cheval */}
                  <button
                    key="none-horse"
                    type="button"
                    className={`btn form-btn-primary ${selectedHorseId === null ? 'active' : ''}`}
                    onClick={() => setSelectedHorseId(null)}
                  >
                    Aucun
                  </button>
                  {availableHorses.map((h) => {
                    const isActive = selectedHorseId === h.id;
                    return (
                      <button
                        key={h.id}
                        type="button"
                        className={`btn form-btn-primary ${isActive ? 'active' : ''}`}
                        onClick={() => setSelectedHorseId(isActive ? null : h.id)}
                      >
                        {h.name}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="form-help">Aucun cheval disponible</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ParticipantsForm;
