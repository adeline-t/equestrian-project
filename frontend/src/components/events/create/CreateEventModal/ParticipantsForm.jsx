import { useState, useEffect, useRef } from 'react';
import { useParticipantSelection } from '../../../../hooks/useParticipantSelection.js';
import {
  RIDER_TYPES,
  OWNER_TYPES,
  getRiderTypeLabel,
} from '../../../../lib/domain/domain-constants.js';
import { Icons } from '../../../../lib/icons.jsx';
import '../../../../styles/features/events/event-participants.css';

function ParticipantsForm({
  participants,
  canAddParticipant,
  addParticipant,
  removeParticipant,
  updateParticipant,
}) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [riderTypeFilter, setRiderTypeFilter] = useState('all');
  const [riderSearch, setRiderSearch] = useState('');
  const [horseOwnershipFilter, setHorseOwnershipFilter] = useState('all');
  const [showScrollHint, setShowScrollHint] = useState(true);

  const containerRef = useRef(null);

  const participantSelection = useParticipantSelection(participants, null);

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

  // Détection du scroll pour masquer l'indicateur
  useEffect(() => {
    const container = containerRef.current?.closest('.create-event-participants-column');
    if (!container) return;

    const handleScroll = () => {
      if (container.scrollTop > 20) {
        setShowScrollHint(false);
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

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
    // Permet cavalier seul OU cheval seul
    if (!selectedRiderId && !selectedHorseId) return;

    addParticipant(selectedRiderId, selectedHorseId);

    resetSelection();
    setShowAddForm(false);
    setRiderSearch('');
  };

  const availableRiders = getAvailableRiders(riderTypeFilter, riderSearch);
  const availableHorses = getAvailableHorses(horseOwnershipFilter);

  return (
    <div className="form-section" ref={containerRef}>
      <div className="participants-header">
        <h3>Participants</h3>
        {participants.length > 0 && (
          <span className="participants-count">{participants.length}</span>
        )}
      </div>

      {loading && (
        <div className="alert alert-info mb-15">
          <Icons.Loading className="spin" /> Chargement des cavaliers et chevaux…
        </div>
      )}

      {/* EXISTING PARTICIPANTS */}
      {participants.length > 0 ? (
        <div className="participants-list mb-20">
          {participants.map((p) => (
            <div key={p.id} className="participant-badge">
              <div className="participant-badge-content">
                <span className="participant-badge-rider">
                  {p.rider_id ? getRiderName(p.rider_id) : 'Cavalier à définir'}
                </span>
                {p.rider_id && p.horse_id && <span className="participant-badge-separator">-</span>}
                <span className="participant-badge-rider">
                  {p.horse_id ? getHorseName(p.horse_id) : 'Cheval à définir'}
                </span>
              </div>
              <button
                type="reset"
                className="btn-icon-modern danger participant-btn"
                onClick={() => removeParticipant(p.id)}
                title="Supprimer"
              >
                <Icons.Close />
              </button>
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
          <div className="form-section-header">
            <h4>Ajouter un participant</h4>

            {/* Bouton d'ajout en haut à droite */}
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={handleSubmit}
              disabled={!selectedRiderId && !selectedHorseId}
            >
              <Icons.Check /> Ajouter
            </button>
          </div>

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
            <label className="form-label-small">Cavalier (optionnel)</label>
            <div className="event-form-times-group">
              {availableRiders.length > 0 ? (
                availableRiders.map((r) => {
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
                })
              ) : (
                <p className="text-muted">Aucun cavalier disponible</p>
              )}
            </div>
          </div>

          {/* HORSE FILTERS */}
          <div className="filter-section mb-10">
            <label className="form-label-small">Cheval (optionnel)</label>
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
              {availableHorses.length > 0 ? (
                availableHorses.map((h) => {
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
                })
              ) : (
                <p className="text-muted">Aucun cheval disponible</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ParticipantsForm;
