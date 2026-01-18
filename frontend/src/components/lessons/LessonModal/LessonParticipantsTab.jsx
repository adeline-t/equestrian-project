import React from 'react';
import { Icons } from '../../../lib/icons';
import { useRiderHorses } from '../../../hooks/index.js';

/**
 * Lesson Participants Tab Component
 */
const LessonParticipantsTab = ({
  eventData,
  showAddParticipant,
  setShowAddParticipant,
  riders,
  horses,
  selectedRiderId,
  setSelectedRiderId,
  selectedHorseId,
  setSelectedHorseId,
  handleAddParticipant,
  handleRemoveParticipant,
  resetParticipantForm,
}) => {
  const { riderPairedHorses } = useRiderHorses(selectedRiderId);

  const handleRiderChange = (e) => {
    setSelectedRiderId(e.target.value);
  };

  const handleHorseChange = (e) => {
    setSelectedHorseId(e.target.value);
  };

  return (
    <div className="participants-tab">
      {eventData.participants && eventData.participants.length > 0 ? (
        <div className="participants-list">
          {eventData.participants.map((participant) => (
            <div key={participant.id} className="participant-card">
              <div className="participant-info">
                <div className="participant-name">
                  <strong>
                    <Icons.User style={{ marginRight: '4px', fontSize: '14px' }} />
                    {participant.rider_name}
                  </strong>
                  {participant.rider_email && (
                    <small className="text-muted">
                      <Icons.Email style={{ marginRight: '4px', fontSize: '10px' }} />
                      {participant.rider_email}
                    </small>
                  )}
                </div>
                {participant.horse_name && (
                  <div className="participant-horse">
                    <Icons.Horse style={{ marginRight: '4px', fontSize: '14px' }} />
                    {participant.horse_name} ({participant.horse_kind})
                  </div>
                )}
                <div className="participant-status">
                  <span className={`badge badge-${participant.participation_status}`}>
                    {participant.participation_status}
                  </span>
                  {participant.horse_assignment_type === 'auto' && (
                    <span className="badge badge-info" title="Cheval assigné automatiquement">
                      <Icons.Info style={{ fontSize: '10px', marginRight: '2px' }} />
                      Auto
                    </span>
                  )}
                </div>
              </div>
              <button
                className="btn btn-sm btn-danger"
                onClick={() => handleRemoveParticipant(participant.id)}
              >
                <Icons.Delete />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Icons.Users style={{ fontSize: '48px', color: '#adb5bd', marginBottom: '12px' }} />
          <p>Aucun participant inscrit</p>
        </div>
      )}

      {!showAddParticipant ? (
        <button className="btn btn-primary mt-20" onClick={() => setShowAddParticipant(true)}>
          <Icons.Add style={{ marginRight: '8px' }} />
          Ajouter un participant
        </button>
      ) : (
        <form onSubmit={handleAddParticipant} className="add-participant-form mt-20">
          <h4>
            <Icons.Add style={{ marginRight: '8px' }} />
            Ajouter un participant
          </h4>

          <div className="form-group">
            <label>
              <Icons.User style={{ marginRight: '4px' }} />
              Cavalier *
            </label>
            <select
              name="rider_id"
              required
              className="form-select"
              value={selectedRiderId}
              onChange={handleRiderChange}
            >
              <option value="">Sélectionner un cavalier</option>
              {riders.map((rider) => (
                <option key={rider.id} value={rider.id}>
                  {rider.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>
              <Icons.Horse style={{ marginRight: '4px' }} />
              Cheval
            </label>
            <select
              name="horse_id"
              className="form-select"
              value={selectedHorseId}
              onChange={handleHorseChange}
              disabled={!selectedRiderId}
            >
              <option value="">
                {selectedRiderId ? 'Aucun cheval' : "Sélectionnez d'abord un cavalier"}
              </option>

              {selectedRiderId && (
                <>
                  {riderPairedHorses.length > 0 && (
                    <optgroup label="🐴 Chevaux habituels">
                      {riderPairedHorses.map((horse) => (
                        <option key={`paired-${horse.id}`} value={horse.id}>
                          {horse.name} ({horse.kind})
                        </option>
                      ))}
                    </optgroup>
                  )}

                  <optgroup label="🏥 Autres chevaux (remplacement)">
                    {horses
                      .filter((horse) => !riderPairedHorses.find((ph) => ph.id === horse.id))
                      .map((horse) => (
                        <option key={`other-${horse.id}`} value={horse.id}>
                          {horse.name} ({horse.kind || horse.breed || 'Race inconnue'})
                        </option>
                      ))}
                  </optgroup>
                </>
              )}
            </select>

            {selectedRiderId && riderPairedHorses.length > 0 && (
              <small className="text-info">
                <Icons.Info style={{ fontSize: '10px', marginRight: '4px' }} />
                Le cheval habituel est sélectionné. Vous pouvez le changer si nécessaire.
              </small>
            )}
            {selectedRiderId && riderPairedHorses.length === 0 && (
              <small className="text-muted">
                <Icons.Info style={{ fontSize: '10px', marginRight: '4px' }} />
                Ce cavalier n'a pas de cheval habituel associé.
              </small>
            )}
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              <Icons.Add style={{ marginRight: '8px' }} />
              Ajouter
            </button>
            <button type="button" className="btn btn-secondary" onClick={resetParticipantForm}>
              <Icons.Cancel style={{ marginRight: '8px' }} />
              Annuler
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default LessonParticipantsTab;
