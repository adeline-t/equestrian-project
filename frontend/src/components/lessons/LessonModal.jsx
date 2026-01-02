import React, { useState, useEffect } from 'react';
import { lessonsApi } from '../../services/calendarApi';
import { ridersApi, horsesApi } from '../../services/api';
import Portal from '../../utils/Portal';
import { Icons } from '../../utils/icons';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

function LessonModal({ lesson, onClose, onUpdate, onRefresh }) {
  const [lessonData, setLessonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('details');
  const [showAddParticipant, setShowAddParticipant] = useState(false);
  const [riders, setRiders] = useState([]);
  const [horses, setHorses] = useState([]);
  const [selectedRiderId, setSelectedRiderId] = useState('');
  const [selectedHorseId, setSelectedHorseId] = useState('');
  const [riderPairedHorses, setRiderPairedHorses] = useState([]);

  useEffect(() => {
    loadLessonDetails();
    loadRidersAndHorses();
  }, [lesson.id]);

  useEffect(() => {
    if (selectedRiderId) {
      loadHorsesForRider(selectedRiderId);
    } else {
      setRiderPairedHorses([]);
      setSelectedHorseId('');
    }
  }, [selectedRiderId]);

  const loadLessonDetails = async () => {
    try {
      setLoading(true);
      const response = await lessonsApi.getById(lesson.id);
      setLessonData(response.data);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadRidersAndHorses = async () => {
    try {
      const [ridersData, horsesData] = await Promise.all([ridersApi.getAll(), horsesApi.getAll()]);
      setRiders(ridersData);
      setHorses(horsesData);
    } catch (err) {
      console.error('Error loading riders/horses:', err);
    }
  };

  const loadHorsesForRider = async (riderId) => {
    try {
      const pairedHorsesRaw = await ridersApi.getHorses(riderId);

      const pairedHorses = pairedHorsesRaw.map((pairing) => ({
        id: pairing.horses.id,
        name: pairing.horses.name,
        kind: pairing.horses.kind,
        breed: pairing.horses.breed,
        color: pairing.horses.color,
        pairing_id: pairing.id,
      }));

      setRiderPairedHorses(pairedHorses);

      console.log('🐴 Paired horses for rider:', pairedHorses);

      if (pairedHorses && pairedHorses.length > 0) {
        setSelectedHorseId(pairedHorses[0].id.toString());
        console.log('✅ Auto-selected horse:', pairedHorses[0]);
      } else {
        setSelectedHorseId('');
        console.log('ℹ️ No paired horse found');
      }
    } catch (err) {
      console.error('Error loading rider horses:', err);
      setRiderPairedHorses([]);
      setSelectedHorseId('');
    }
  };

  const handleCancel = async () => {
    const reason = prompt("Raison de l'annulation :");
    if (reason === null) return;

    try {
      await lessonsApi.cancel(lesson.id, reason);
      onUpdate();
    } catch (err) {
      alert(err.response?.data?.error || "Erreur lors de l'annulation");
    }
  };

  const handleMarkNotGiven = async () => {
    const reason = prompt("Raison pour laquelle le cours n'a pas été donné :");
    if (reason === null) return;

    try {
      await lessonsApi.markNotGiven(lesson.id, reason);
      onUpdate();
    } catch (err) {
      alert(err.response?.data?.error || 'Erreur lors du marquage');
    }
  };

  const handleAddParticipant = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const riderId = parseInt(formData.get('rider_id'));
    const horseId = formData.get('horse_id') ? parseInt(formData.get('horse_id')) : null;

    try {
      await lessonsApi.addParticipant(lesson.id, {
        rider_id: riderId,
        horse_id: horseId,
        horse_assignment_type: horseId ? 'manual' : 'none',
      });
      setShowAddParticipant(false);
      setSelectedRiderId('');
      setSelectedHorseId('');
      setRiderPairedHorses([]);
      await loadLessonDetails();
    } catch (err) {
      alert(err.response?.data?.error || "Erreur lors de l'ajout du participant");
    }
  };

  const handleRemoveParticipant = async (participantId) => {
    if (!confirm('Êtes-vous sûr de vouloir retirer ce participant ?')) return;

    try {
      await lessonsApi.removeParticipant(lesson.id, participantId);
      await loadLessonDetails();
    } catch (err) {
      alert(err.response?.data?.error || 'Erreur lors du retrait du participant');
    }
  };

  const handleRiderChange = (e) => {
    setSelectedRiderId(e.target.value);
  };

  const handleHorseChange = (e) => {
    setSelectedHorseId(e.target.value);
  };

  const getLessonTypeIcon = (type) => {
    const icons = {
      private: Icons.PrivateLesson,
      group: Icons.GroupLesson,
      training: Icons.Training,
      competition: Icons.Competition,
      event: Icons.Event,
      blocked: Icons.Blocked,
    };
    return icons[type] || Icons.Calendar;
  };

  const getLessonTypeLabel = (type) => {
    const labels = {
      private: 'Cours Particulier',
      group: 'Cours Collectif',
      training: 'Stage',
      competition: 'Concours',
      event: 'Événement',
      blocked: 'Plage Bloquée',
    };
    return labels[type] || type;
  };

  if (loading) {
    return (
      <Portal>
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="loading">
              <Icons.Loading className="spin" style={{ fontSize: '32px', marginBottom: '12px' }} />
              <p>Chargement...</p>
            </div>
          </div>
        </div>
      </Portal>
    );
  }

  if (error) {
    return (
      <Portal>
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="error">
              <Icons.Warning style={{ fontSize: '32px', marginBottom: '12px' }} />
              <p>{error}</p>
            </div>
            <button className="btn btn-secondary" onClick={onClose}>
              <Icons.Close style={{ marginRight: '8px' }} />
              Fermer
            </button>
          </div>
        </div>
      </Portal>
    );
  }

  const isBlocked = lessonData.lesson_type === 'blocked';
  const LessonIcon = getLessonTypeIcon(lessonData.lesson_type);

  return (
    <Portal>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content lesson-modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>
              <LessonIcon style={{ marginRight: '8px' }} />
              {lessonData.name}
            </h2>
            <button className="btn-close" onClick={onClose}>
              <Icons.Close />
            </button>
          </div>

          {/* Tabs */}
          <div className="modal-tabs">
            <button
              className={`tab ${activeTab === 'details' ? 'active' : ''}`}
              onClick={() => setActiveTab('details')}
            >
              <Icons.Info style={{ marginRight: '4px' }} />
              Détails
            </button>
            {!isBlocked && (
              <button
                className={`tab ${activeTab === 'participants' ? 'active' : ''}`}
                onClick={() => setActiveTab('participants')}
              >
                <Icons.Users style={{ marginRight: '4px' }} />
                Participants ({lessonData.participants?.length || 0})
              </button>
            )}
          </div>

          <div className="modal-body">
            {/* Tab Détails */}
            {activeTab === 'details' && (
              <div className="details-tab">
                <div className="detail-row">
                  <label>
                    <Icons.List style={{ marginRight: '4px' }} />
                    Type :
                  </label>
                  <span className={`lesson-type-badge ${lessonData.lesson_type}`}>
                    <LessonIcon style={{ marginRight: '4px', fontSize: '12px' }} />
                    {getLessonTypeLabel(lessonData.lesson_type)}
                  </span>
                </div>

                <div className="detail-row">
                  <label>
                    <Icons.Calendar style={{ marginRight: '4px' }} />
                    Date :
                  </label>
                  <span>
                    {format(parseISO(lessonData.lesson_date), 'EEEE dd MMMM yyyy', { locale: fr })}
                  </span>
                </div>

                <div className="detail-row">
                  <label>
                    <Icons.Clock style={{ marginRight: '4px' }} />
                    Horaire :
                  </label>
                  <span>
                    {lessonData.start_time} - {lessonData.end_time}
                  </span>
                </div>

                <div className="detail-row">
                  <label>
                    <Icons.Info style={{ marginRight: '4px' }} />
                    Statut :
                  </label>
                  <span className={`status-badge status-${lessonData.status}`}>
                    {lessonData.status === 'confirmed' && (
                      <Icons.Check style={{ marginRight: '4px', fontSize: '10px' }} />
                    )}
                    {lessonData.status === 'cancelled' && (
                      <Icons.Close style={{ marginRight: '4px', fontSize: '10px' }} />
                    )}
                    {lessonData.status === 'completed' && (
                      <Icons.Check style={{ marginRight: '4px', fontSize: '10px' }} />
                    )}
                    {lessonData.status}
                  </span>
                </div>

                {!isBlocked && lessonData.max_participants && (
                  <div className="detail-row">
                    <label>
                      <Icons.Users style={{ marginRight: '4px' }} />
                      Capacité :
                    </label>
                    <span>
                      {lessonData.participants?.length || 0} / {lessonData.max_participants}
                    </span>
                  </div>
                )}

                {lessonData.location && (
                  <div className="detail-row">
                    <label>
                      <Icons.Location style={{ marginRight: '4px' }} />
                      Lieu :
                    </label>
                    <span>{lessonData.location}</span>
                  </div>
                )}

                {lessonData.description && (
                  <div className="detail-row">
                    <label>
                      <Icons.Info style={{ marginRight: '4px' }} />
                      Description :
                    </label>
                    <p>{lessonData.description}</p>
                  </div>
                )}

                {lessonData.is_modified && (
                  <div className="alert alert-info">
                    <Icons.Edit style={{ marginRight: '8px' }} />
                    Ce cours a été modifié par rapport au template original
                  </div>
                )}

                {lessonData.not_given_by_laury && (
                  <div className="alert alert-warning">
                    <Icons.Warning style={{ marginRight: '8px' }} />
                    Ce cours n'a pas été donné par Laury
                    {lessonData.not_given_reason && <p>Raison : {lessonData.not_given_reason}</p>}
                  </div>
                )}

                {lessonData.cancellation_reason && (
                  <div className="alert alert-error">
                    <Icons.Close style={{ marginRight: '8px' }} />
                    Cours annulé : {lessonData.cancellation_reason}
                  </div>
                )}
              </div>
            )}

            {/* Tab Participants */}
            {activeTab === 'participants' && !isBlocked && (
              <div className="participants-tab">
                {lessonData.participants && lessonData.participants.length > 0 ? (
                  <div className="participants-list">
                    {lessonData.participants.map((participant) => (
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
                              <span
                                className="badge badge-info"
                                title="Cheval assigné automatiquement"
                              >
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
                    <Icons.Users
                      style={{ fontSize: '48px', color: '#adb5bd', marginBottom: '12px' }}
                    />
                    <p>Aucun participant inscrit</p>
                  </div>
                )}

                {!showAddParticipant ? (
                  <button
                    className="btn btn-primary mt-20"
                    onClick={() => setShowAddParticipant(true)}
                  >
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
                                .filter(
                                  (horse) => !riderPairedHorses.find((ph) => ph.id === horse.id)
                                )
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
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => {
                          setShowAddParticipant(false);
                          setSelectedRiderId('');
                          setSelectedHorseId('');
                          setRiderPairedHorses([]);
                        }}
                      >
                        <Icons.Cancel style={{ marginRight: '8px' }} />
                        Annuler
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="modal-footer">
            {lessonData.status !== 'cancelled' && (
              <>
                {!isBlocked && !lessonData.not_given_by_laury && (
                  <button className="btn btn-warning" onClick={handleMarkNotGiven}>
                    <Icons.Warning style={{ marginRight: '8px' }} />
                    Marquer comme non donné
                  </button>
                )}
                <button className="btn btn-danger" onClick={handleCancel}>
                  <Icons.Close style={{ marginRight: '8px' }} />
                  Annuler le cours
                </button>
              </>
            )}
            <button className="btn btn-secondary" onClick={onClose}>
              <Icons.Close style={{ marginRight: '8px' }} />
              Fermer
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
}

export default LessonModal;
