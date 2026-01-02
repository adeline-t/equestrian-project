import React, { useState, useEffect, useMemo } from 'react';
import { lessonsApi } from '../../services/calendarApi';
import { ridersApi, horsesApi } from '../../services/api';
import Portal from '../../utils/Portal';
import { Icons } from '../../utils/icons';
import { format, parse } from 'date-fns';
import { fr } from 'date-fns/locale';

function SingleLessonModal({ onClose, onSuccess, initialDate = null }) {
  const [formData, setFormData] = useState({
    lesson_date: initialDate || format(new Date(), 'yyyy-MM-dd'),
    start_time: '09:00',
    end_time: '10:00',
    lesson_type: 'private',
    description: '',
    max_participants: 1,
    status: 'confirmed',
  });

  const [participants, setParticipants] = useState([]);
  const [riders, setRiders] = useState([]);
  const [horses, setHorses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState(null);
  const [showAddParticipant, setShowAddParticipant] = useState(false);
  const [selectedRiderId, setSelectedRiderId] = useState('');
  const [selectedHorseId, setSelectedHorseId] = useState('');
  const [riderPairedHorses, setRiderPairedHorses] = useState([]);

  const lessonTypes = [
    { value: 'private', label: 'Cours particulier', icon: Icons.PrivateLesson, defaultMax: 1 },
    { value: 'group', label: 'Cours collectif', icon: Icons.GroupLesson, defaultMax: 6 },
    { value: 'training', label: 'Stage', icon: Icons.Training, defaultMax: 10 },
    { value: 'competition', label: 'Concours', icon: Icons.Competition, defaultMax: 20 },
    { value: 'event', label: 'Événement', icon: Icons.Event, defaultMax: 50 },
    { value: 'blocked', label: 'Période bloquée', icon: Icons.Blocked, defaultMax: null },
  ];

  // Load riders and horses on mount
  useEffect(() => {
    loadRidersAndHorses();
  }, []);

  // Auto-select horse when rider is selected
  useEffect(() => {
    if (selectedRiderId) {
      loadHorsesForRider(selectedRiderId);
    } else {
      setRiderPairedHorses([]);
      setSelectedHorseId('');
    }
  }, [selectedRiderId]);

  const loadRidersAndHorses = async () => {
    try {
      setLoadingData(true);
      const [ridersData, horsesData] = await Promise.all([ridersApi.getAll(), horsesApi.getAll()]);
      setRiders(ridersData || []);
      setHorses(horsesData || []);
    } catch (err) {
      console.error('Error loading riders/horses:', err);
      setError('Erreur lors du chargement des données');
    } finally {
      setLoadingData(false);
    }
  };

  const loadHorsesForRider = async (riderId) => {
    try {
      const pairedHorsesRaw = await ridersApi.getHorses(riderId);
      const pairedHorses = pairedHorsesRaw.map((pairing) => ({
        id: pairing.horses.id,
        name: pairing.horses.name,
        kind: pairing.horses.kind,
      }));

      setRiderPairedHorses(pairedHorses);

      if (pairedHorses && pairedHorses.length > 0) {
        setSelectedHorseId(pairedHorses[0].id.toString());
      } else {
        setSelectedHorseId('');
      }
    } catch (err) {
      console.error('Error loading rider horses:', err);
      setRiderPairedHorses([]);
      setSelectedHorseId('');
    }
  };

  const generatedName = useMemo(() => {
    try {
      const date = parse(formData.lesson_date, 'yyyy-MM-dd', new Date());
      const formattedDate = format(date, 'dd/MM', { locale: fr });
      return `Cours du ${formattedDate} à ${formData.start_time}`;
    } catch {
      return 'Cours';
    }
  }, [formData.lesson_date, formData.start_time]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTypeChange = (e) => {
    const type = e.target.value;
    const typeConfig = lessonTypes.find((t) => t.value === type);

    setFormData((prev) => ({
      ...prev,
      lesson_type: type,
      max_participants: typeConfig?.defaultMax || 1,
    }));

    // Clear participants if switching to blocked
    if (type === 'blocked') {
      setParticipants([]);
    }
  };

  const handleAddParticipant = (e) => {
    e.preventDefault();

    if (!selectedRiderId) return;

    const rider = riders.find((r) => r.id.toString() === selectedRiderId);
    const horse = selectedHorseId ? horses.find((h) => h.id.toString() === selectedHorseId) : null;

    // Check if rider already added
    if (participants.some((p) => p.rider_id.toString() === selectedRiderId)) {
      setError('Ce cavalier est déjà ajouté');
      return;
    }

    // Check capacity
    if (participants.length >= formData.max_participants) {
      setError(
        `Capacité maximale atteinte (${formData.max_participants}). Augmentez la capacité pour ajouter plus de participants.`
      );
      return;
    }

    const newParticipant = {
      rider_id: parseInt(selectedRiderId),
      rider_name: rider?.name || 'Inconnu',
      horse_id: selectedHorseId ? parseInt(selectedHorseId) : null,
      horse_name: horse?.name || null,
      horse_kind: horse?.kind || null,
      horse_assignment_type: selectedHorseId ? 'manual' : 'none',
    };

    setParticipants([...participants, newParticipant]);
    setShowAddParticipant(false);
    setSelectedRiderId('');
    setSelectedHorseId('');
    setRiderPairedHorses([]);
    setError(null);
  };

  const handleRemoveParticipant = (riderId) => {
    setParticipants(participants.filter((p) => p.rider_id !== riderId));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (formData.start_time >= formData.end_time) {
        throw new Error("L'heure de fin doit être après l'heure de début");
      }

      // Validation: participants vs max_participants
      if (participants.length > formData.max_participants) {
        throw new Error(
          `Vous avez ajouté ${participants.length} participant(s) mais la capacité maximale est de ${formData.max_participants}. Veuillez augmenter la capacité ou retirer des participants.`
        );
      }

      await lessonsApi.create({
        ...formData,
        name: generatedName,
        participants: participants.map((p) => ({
          rider_id: p.rider_id,
          horse_id: p.horse_id,
          horse_assignment_type: p.horse_assignment_type,
        })),
      });

      onSuccess();
    } catch (err) {
      console.error('Error creating lesson:', err);
      setError(err.response?.data?.error || err.message || 'Erreur lors de la création');
    } finally {
      setLoading(false);
    }
  };

  const isBlocked = formData.lesson_type === 'blocked';
  const selectedType = lessonTypes.find((t) => t.value === formData.lesson_type);
  const SelectedIcon = selectedType?.icon || Icons.Calendar;

  // Validation warning
  const hasCapacityWarning = participants.length > formData.max_participants;
  const canSubmit = !hasCapacityWarning && !loadingData;

  return (
    <Portal>
      <div className="modal-overlay" onClick={onClose}>
        <div
          className="modal-content"
          onClick={(e) => e.stopPropagation()}
          style={{ maxWidth: '700px' }}
        >
          <div className="modal-header">
            <h2>
              <Icons.Add style={{ marginRight: '8px' }} />
              Créer un cours
            </h2>
            <button className="btn-close" onClick={onClose}>
              <Icons.Close />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body" style={{ padding: '20px' }}>
              {error && (
                <div className="alert alert-error" style={{ marginBottom: '15px' }}>
                  <Icons.Warning style={{ marginRight: '8px' }} />
                  {error}
                </div>
              )}

              {hasCapacityWarning && (
                <div className="alert alert-warning" style={{ marginBottom: '15px' }}>
                  <Icons.Warning style={{ marginRight: '8px' }} />
                  Vous avez {participants.length} participant(s) mais la capacité maximale est de{' '}
                  {formData.max_participants}. Augmentez la capacité ou retirez des participants.
                </div>
              )}

              {/* Type & Date */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '15px',
                  marginBottom: '15px',
                }}
              >
                <div className="form-group" style={{ margin: 0 }}>
                  <label style={{ fontSize: '14px', marginBottom: '5px', display: 'block' }}>
                    <Icons.List style={{ marginRight: '4px', fontSize: '12px' }} />
                    Type *
                  </label>
                  <select
                    name="lesson_type"
                    value={formData.lesson_type}
                    onChange={handleTypeChange}
                    className="form-select"
                    required
                    style={{ fontSize: '14px' }}
                  >
                    {lessonTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label style={{ fontSize: '14px', marginBottom: '5px', display: 'block' }}>
                    <Icons.Calendar style={{ marginRight: '4px', fontSize: '12px' }} />
                    Date *
                  </label>
                  <input
                    type="date"
                    name="lesson_date"
                    value={formData.lesson_date}
                    onChange={handleChange}
                    className="form-input"
                    required
                    style={{ fontSize: '14px' }}
                  />
                </div>
              </div>

              {/* Time */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '15px',
                  marginBottom: '15px',
                }}
              >
                <div className="form-group" style={{ margin: 0 }}>
                  <label style={{ fontSize: '14px', marginBottom: '5px', display: 'block' }}>
                    <Icons.Clock style={{ marginRight: '4px', fontSize: '12px' }} />
                    Début *
                  </label>
                  <input
                    type="time"
                    name="start_time"
                    value={formData.start_time}
                    onChange={handleChange}
                    className="form-input"
                    required
                    style={{ fontSize: '14px' }}
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label style={{ fontSize: '14px', marginBottom: '5px', display: 'block' }}>
                    <Icons.Clock style={{ marginRight: '4px', fontSize: '12px' }} />
                    Fin *
                  </label>
                  <input
                    type="time"
                    name="end_time"
                    value={formData.end_time}
                    onChange={handleChange}
                    className="form-input"
                    required
                    style={{ fontSize: '14px' }}
                  />
                </div>
              </div>

              {/* Auto-generated name */}
              <div className="form-group" style={{ margin: '0 0 15px 0' }}>
                <label style={{ fontSize: '14px', marginBottom: '5px', display: 'block' }}>
                  <Icons.Edit style={{ marginRight: '4px', fontSize: '12px' }} />
                  Nom (auto)
                </label>
                <input
                  type="text"
                  value={generatedName}
                  className="form-input"
                  disabled
                  style={{
                    backgroundColor: '#f8f9fa',
                    cursor: 'not-allowed',
                    color: '#495057',
                    fontSize: '14px',
                  }}
                />
              </div>

              {/* Max participants */}
              {!isBlocked && (
                <div className="form-group" style={{ margin: '0 0 15px 0' }}>
                  <label style={{ fontSize: '14px', marginBottom: '5px', display: 'block' }}>
                    <Icons.Users style={{ marginRight: '4px', fontSize: '12px' }} />
                    Max participants
                  </label>
                  <input
                    type="number"
                    name="max_participants"
                    value={formData.max_participants}
                    onChange={handleChange}
                    className="form-input"
                    min="1"
                    max="50"
                    style={{ fontSize: '14px' }}
                  />
                </div>
              )}

              {/* Participants section */}
              {!isBlocked && (
                <div
                  style={{
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    padding: '12px',
                    marginBottom: '15px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '10px',
                    }}
                  >
                    <label style={{ fontSize: '14px', fontWeight: 'bold', margin: 0 }}>
                      <Icons.Users style={{ marginRight: '4px', fontSize: '12px' }} />
                      Participants ({participants.length}/{formData.max_participants})
                    </label>
                    {!showAddParticipant && (
                      <button
                        type="button"
                        className="btn btn-sm btn-primary"
                        onClick={() => setShowAddParticipant(true)}
                        disabled={loadingData}
                      >
                        <Icons.Add style={{ marginRight: '4px' }} />
                        Ajouter
                      </button>
                    )}
                  </div>

                  {/* Participants list */}
                  {participants.length > 0 && (
                    <div style={{ marginBottom: '10px' }}>
                      {participants.map((participant) => (
                        <div
                          key={participant.rider_id}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '8px',
                            background: '#f8f9fa',
                            borderRadius: '4px',
                            marginBottom: '6px',
                            fontSize: '13px',
                          }}
                        >
                          <div>
                            <div style={{ fontWeight: '500' }}>
                              <Icons.User
                                style={{ marginRight: '4px', fontSize: '12px', color: '#4299e1' }}
                              />
                              {participant.rider_name}
                            </div>
                            {participant.horse_name && (
                              <div style={{ fontSize: '12px', color: '#718096', marginTop: '2px' }}>
                                <Icons.Horse style={{ marginRight: '4px', fontSize: '11px' }} />
                                {participant.horse_name} ({participant.horse_kind})
                              </div>
                            )}
                          </div>
                          <button
                            type="button"
                            className="btn btn-sm btn-danger"
                            onClick={() => handleRemoveParticipant(participant.rider_id)}
                          >
                            <Icons.Delete />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add participant form */}
                  {showAddParticipant && (
                    <div style={{ background: '#f7fafc', padding: '10px', borderRadius: '4px' }}>
                      <div className="form-group" style={{ margin: '0 0 10px 0' }}>
                        <label style={{ fontSize: '13px', marginBottom: '4px', display: 'block' }}>
                          Cavalier *
                        </label>
                        <select
                          value={selectedRiderId}
                          onChange={(e) => setSelectedRiderId(e.target.value)}
                          className="form-select"
                          required
                          style={{ fontSize: '13px' }}
                        >
                          <option value="">Sélectionner un cavalier</option>
                          {riders.map((rider) => (
                            <option key={rider.id} value={rider.id}>
                              {rider.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group" style={{ margin: '0 0 10px 0' }}>
                        <label style={{ fontSize: '13px', marginBottom: '4px', display: 'block' }}>
                          Cheval
                        </label>
                        <select
                          value={selectedHorseId}
                          onChange={(e) => setSelectedHorseId(e.target.value)}
                          className="form-select"
                          disabled={!selectedRiderId}
                          style={{ fontSize: '13px' }}
                        >
                          <option value="">
                            {selectedRiderId ? 'Aucun cheval' : "Sélectionnez d'abord un cavalier"}
                          </option>

                          {selectedRiderId && (
                            <>
                              {riderPairedHorses.length > 0 && (
                                <optgroup label="Chevaux habituels">
                                  {riderPairedHorses.map((horse) => (
                                    <option key={`paired-${horse.id}`} value={horse.id}>
                                      {horse.name} ({horse.kind})
                                    </option>
                                  ))}
                                </optgroup>
                              )}

                              <optgroup label="Autres chevaux">
                                {horses
                                  .filter(
                                    (horse) => !riderPairedHorses.find((ph) => ph.id === horse.id)
                                  )
                                  .map((horse) => (
                                    <option key={`other-${horse.id}`} value={horse.id}>
                                      {horse.name} ({horse.kind || 'N/A'})
                                    </option>
                                  ))}
                              </optgroup>
                            </>
                          )}
                        </select>
                      </div>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          type="button"
                          className="btn btn-sm btn-primary"
                          onClick={handleAddParticipant}
                          disabled={!selectedRiderId}
                        >
                          <Icons.Check style={{ marginRight: '4px' }} />
                          Ajouter
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-secondary"
                          onClick={() => {
                            setShowAddParticipant(false);
                            setSelectedRiderId('');
                            setSelectedHorseId('');
                            setRiderPairedHorses([]);
                          }}
                        >
                          <Icons.Cancel style={{ marginRight: '4px' }} />
                          Annuler
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Description */}
              <div className="form-group" style={{ margin: '0 0 15px 0' }}>
                <label style={{ fontSize: '14px', marginBottom: '5px', display: 'block' }}>
                  <Icons.Info style={{ marginRight: '4px', fontSize: '12px' }} />
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="form-textarea"
                  rows="2"
                  placeholder="Optionnel..."
                  style={{ fontSize: '14px' }}
                />
              </div>

              {/* Compact Preview */}
              <div
                style={{
                  background: '#f7fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  padding: '12px',
                  fontSize: '13px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '6px',
                  }}
                >
                  <SelectedIcon style={{ fontSize: '16px', color: '#4299e1' }} />
                  <strong>{generatedName}</strong>
                  <span
                    style={{
                      marginLeft: 'auto',
                      padding: '2px 8px',
                      background: '#48bb78',
                      color: 'white',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: 'bold',
                    }}
                  >
                    Confirmé
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '15px', color: '#718096', fontSize: '12px' }}>
                  <span>
                    <Icons.Calendar style={{ fontSize: '11px', marginRight: '4px' }} />
                    {format(parse(formData.lesson_date, 'yyyy-MM-dd', new Date()), 'dd/MM/yyyy', {
                      locale: fr,
                    })}
                  </span>
                  <span>
                    <Icons.Clock style={{ fontSize: '11px', marginRight: '4px' }} />
                    {formData.start_time} - {formData.end_time}
                  </span>
                  {!isBlocked && (
                    <span>
                      <Icons.Users style={{ fontSize: '11px', marginRight: '4px' }} />
                      {participants.length}/{formData.max_participants}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="modal-footer" style={{ padding: '15px 20px' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                disabled={loading}
              >
                <Icons.Cancel style={{ marginRight: '8px' }} />
                Annuler
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading || !canSubmit}>
                {loading ? (
                  <>
                    <Icons.Loading className="spin" style={{ marginRight: '8px' }} />
                    Création...
                  </>
                ) : (
                  <>
                    <Icons.Check style={{ marginRight: '8px' }} />
                    Créer
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Portal>
  );
}

export default SingleLessonModal;
