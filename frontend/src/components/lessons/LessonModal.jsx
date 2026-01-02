import React, { useState, useEffect, useMemo } from 'react';
import { lessonsApi } from '../../services/calendarApi';
import { ridersApi, horsesApi } from '../../services/api';
import Portal from '../../utils/Portal';
import { Icons } from '../../utils/icons';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import './LessonModal.css';

function LessonModal({ lesson, onClose, onUpdate, onRefresh }) {
  const [lessonData, setLessonData] = useState(null);

  const formatTime = (time) => {
    if (!time) return '';
    return time.substring(0, 5); // HH:MM format
  };

  const calculateDuration = (startTime, endTime) => {
    if (!startTime || !endTime) return '0 min';

    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);

    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;

    const duration = endMinutes - startMinutes;

    if (duration < 60) {
      return `${duration} min`;
    } else {
      const hours = Math.floor(duration / 60);
      const minutes = duration % 60;
      return minutes > 0 ? `${hours}h ${minutes}min` : `${hours}h`;
    }
  };
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('details');
  const [showAddParticipant, setShowAddParticipant] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState(null);
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

  // Edit mode handlers
  const handleStartEdit = () => {
    setIsEditing(true);
    setEditError(null);
    setEditFormData({
      name: lessonData.name,
      lesson_date: lessonData.lesson_date,
      start_time: lessonData.start_time,
      end_time: lessonData.end_time,
      lesson_type: lessonData.lesson_type,
      description: lessonData.description || '',
      max_participants: lessonData.max_participants || 1,
      min_participants: lessonData.min_participants || '',
      status: lessonData.status || 'scheduled',
      cancellation_reason: lessonData.cancellation_reason || '',
      not_given_by_laury: lessonData.not_given_by_laury || false,
      not_given_reason: lessonData.not_given_reason || '',
    });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditFormData({});
    setEditError(null);
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;

    // If start_time is changed, calculate new end_time based on duration
    if (name === 'start_time') {
      const currentStartTime = editFormData.start_time;
      const currentEndTime = editFormData.end_time;

      // Calculate duration in minutes
      const [startHour, startMin] = currentStartTime.split(':').map(Number);
      const [endHour, endMin] = currentEndTime.split(':').map(Number);
      const durationMinutes = endHour * 60 + endMin - (startHour * 60 + startMin);

      // Calculate new end time
      const [newStartHour, newStartMin] = value.split(':').map(Number);
      const newEndTotalMinutes = newStartHour * 60 + newStartMin + durationMinutes;
      const newEndHour = Math.floor(newEndTotalMinutes / 60);
      const newEndMin = newEndTotalMinutes % 60;
      const newEndTime = `${String(newEndHour).padStart(2, '0')}:${String(newEndMin).padStart(
        2,
        '0'
      )}`;

      setEditFormData((prev) => ({
        ...prev,
        [name]: value,
        end_time: newEndTime,
      }));
    } else {
      setEditFormData((prev) => ({
        ...prev,
        [name]: fieldValue,
      }));
    }
  };

  const handleTypeChange = (e) => {
    const type = e.target.value;
    const typeConfig = lessonTypes.find((t) => t.value === type);

    setEditFormData((prev) => ({
      ...prev,
      lesson_type: type,
      max_participants: typeConfig?.defaultMax || 1,
    }));
  };

  const handleSaveEdit = async () => {
    setSaving(true);
    setEditError(null);

    try {
      // Validation
      if (editFormData.start_time >= editFormData.end_time) {
        throw new Error("L'heure de fin doit être après l'heure de début");
      }

      await lessonsApi.update(lesson.id, editFormData);
      await loadLessonDetails(); // Reload lesson data
      setIsEditing(false);
      onUpdate(); // Notify parent component
    } catch (err) {
      setEditError(err.response?.data?.error || err.message || 'Erreur lors de la mise à jour');
    } finally {
      setSaving(false);
    }
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

  const lessonTypes = [
    { value: 'private', label: 'Cours particulier', icon: Icons.PrivateLesson, defaultMax: 1 },
    { value: 'group', label: 'Cours collectif', icon: Icons.GroupLesson, defaultMax: 6 },
    { value: 'training', label: 'Stage', icon: Icons.Training, defaultMax: 10 },
    { value: 'competition', label: 'Concours', icon: Icons.Competition, defaultMax: 20 },
    { value: 'event', label: 'Événement', icon: Icons.Event, defaultMax: 50 },
    { value: 'blocked', label: 'Période bloquée', icon: Icons.Blocked, defaultMax: null },
  ];

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
              {isEditing
                ? `Modifier: ${editFormData.name || lessonData.name} - ${formatTime(
                    editFormData.start_time || lessonData.start_time
                  )}`
                : `${lessonData.name} - ${formatTime(lessonData.start_time)}`}
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
              {isEditing ? 'Modifier' : 'Détails'}
            </button>
            {!isBlocked && !isEditing && (
              <button
                className={`tab ${activeTab === 'participants' ? 'active' : ''}`}
                onClick={() => setActiveTab('participants')}
              >
                <Icons.Users style={{ marginRight: '4px' }} />
                Participants ({lessonData.participants?.length || 0})
              </button>
            )}
            {!isEditing && (
              <button
                className={`tab ${activeTab === 'advanced' ? 'active' : ''}`}
                onClick={() => setActiveTab('advanced')}
              >
                <Icons.Settings style={{ marginRight: '4px' }} />
                Avancé
              </button>
            )}
          </div>

          <div className="modal-body">
            {/* Tab Détails */}
            {activeTab === 'details' && (
              <div className="details-tab">
                {isEditing ? (
                  <div className="edit-form">
                    {editError && (
                      <div className="alert alert-error" style={{ marginBottom: '15px' }}>
                        <Icons.Warning style={{ marginRight: '8px' }} />
                        {editError}
                      </div>
                    )}

                    {/* Template warning for template-derived lessons */}
                    {lessonData.template_id && (
                      <div className="alert alert-warning" style={{ marginBottom: '15px' }}>
                        <Icons.Warning style={{ marginRight: '8px' }} />
                        Ce cours provient d'un template. Les modifications ne s'appliqueront qu'à
                        cette instance spécifique et n'affecteront pas le template ni les autres
                        cours.
                      </div>
                    )}

                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                      }}
                    >
                      {/* Name */}
                      <div className="form-group" style={{ marginBottom: '15px' }}>
                        <label style={{ fontSize: '14px', marginBottom: '5px', display: 'block' }}>
                          <Icons.Edit style={{ marginRight: '4px', fontSize: '12px' }} />
                          Nom du cours *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={editFormData.name}
                          onChange={handleEditChange}
                          className="form-input"
                          required
                          style={{ fontSize: '14px' }}
                        />
                      </div>

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
                          <label
                            style={{ fontSize: '14px', marginBottom: '5px', display: 'block' }}
                          >
                            <Icons.List style={{ marginRight: '4px', fontSize: '12px' }} />
                            Type *
                          </label>
                          <select
                            name="lesson_type"
                            value={editFormData.lesson_type}
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
                          <label
                            style={{ fontSize: '14px', marginBottom: '5px', display: 'block' }}
                          >
                            <Icons.Calendar style={{ marginRight: '4px', fontSize: '12px' }} />
                            Date *
                          </label>
                          <input
                            type="date"
                            name="lesson_date"
                            value={editFormData.lesson_date}
                            onChange={handleEditChange}
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
                          <label
                            style={{ fontSize: '14px', marginBottom: '5px', display: 'block' }}
                          >
                            <Icons.Clock style={{ marginRight: '4px', fontSize: '12px' }} />
                            Début *
                          </label>
                          <input
                            type="time"
                            name="start_time"
                            value={editFormData.start_time}
                            onChange={handleEditChange}
                            className="form-input"
                            required
                            style={{ fontSize: '14px' }}
                          />
                        </div>

                        <div className="form-group" style={{ margin: 0 }}>
                          <label
                            style={{ fontSize: '14px', marginBottom: '5px', display: 'block' }}
                          >
                            <Icons.Clock style={{ marginRight: '4px', fontSize: '12px' }} />
                            Fin *
                          </label>
                          <input
                            type="time"
                            name="end_time"
                            value={editFormData.end_time}
                            onChange={handleEditChange}
                            className="form-input"
                            required
                            style={{ fontSize: '14px' }}
                          />
                        </div>
                      </div>

                      {/* Duration Display */}
                      <div className="form-group" style={{ marginBottom: '15px' }}>
                        <div
                          style={{
                            background: '#f8f9fa',
                            padding: '8px 12px',
                            borderRadius: '6px',
                            fontSize: '13px',
                            color: '#6c757d',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                          }}
                        >
                          <Icons.Clock style={{ fontSize: '14px' }} />
                          Durée: {calculateDuration(editFormData.start_time, editFormData.end_time)}
                        </div>
                      </div>

                      {/* Participants - Min and Max */}
                      {editFormData.lesson_type !== 'blocked' && (
                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '15px',
                            marginBottom: '15px',
                          }}
                        >
                          <div className="form-group" style={{ margin: 0 }}>
                            <label
                              style={{ fontSize: '14px', marginBottom: '5px', display: 'block' }}
                            >
                              <Icons.Users style={{ marginRight: '4px', fontSize: '12px' }} />
                              Min participants
                            </label>
                            <input
                              type="number"
                              name="min_participants"
                              value={editFormData.min_participants}
                              onChange={handleEditChange}
                              className="form-input"
                              min="1"
                              max="50"
                              placeholder="Optionnel"
                              style={{ fontSize: '14px' }}
                            />
                          </div>

                          <div className="form-group" style={{ margin: 0 }}>
                            <label
                              style={{ fontSize: '14px', marginBottom: '5px', display: 'block' }}
                            >
                              <Icons.Users style={{ marginRight: '4px', fontSize: '12px' }} />
                              Max participants
                            </label>
                            <input
                              type="number"
                              name="max_participants"
                              value={editFormData.max_participants}
                              onChange={handleEditChange}
                              className="form-input"
                              min="1"
                              max="50"
                              style={{ fontSize: '14px' }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Status */}
                      <div className="form-group" style={{ marginBottom: '15px' }}>
                        <label style={{ fontSize: '14px', marginBottom: '5px', display: 'block' }}>
                          <Icons.Info style={{ marginRight: '4px', fontSize: '12px' }} />
                          Statut
                        </label>
                        <select
                          name="status"
                          value={editFormData.status || lessonData.status}
                          onChange={handleEditChange}
                          className="form-select"
                          style={{ fontSize: '14px' }}
                        >
                          <option value="scheduled">Planifié</option>
                          <option value="confirmed">Confirmé</option>
                          <option value="completed">Terminé</option>
                          <option value="cancelled">Annulé</option>
                          <option value="blocked">Bloqué</option>
                        </select>
                      </div>

                      {/* Cancellation Reason - Only show if status is cancelled */}
                      {editFormData.status === 'cancelled' &amp;&amp; (
                        <div className="form-group" style={{ marginBottom: '15px' }}>
                          <label style={{ fontSize: '14px', marginBottom: '5px', display: 'block' }}>
                            <Icons.Close style={{ marginRight: '4px', fontSize: '12px' }} />
                            Raison de l'annulation
                          </label>
                          <textarea
                            name="cancellation_reason"
                            value={editFormData.cancellation_reason}
                            onChange={handleEditChange}
                            className="form-textarea"
                            rows="2"
                            placeholder="Pourquoi ce cours est-il annulé ?"
                            style={{ fontSize: '14px' }}
                          />
                        </div>
                      )}

                      {/* Not Given by Laury */}
                      <div className="form-group" style={{ marginBottom: '15px' }}>
                        <label style={{ fontSize: '14px', marginBottom: '5px', display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            name="not_given_by_laury"
                            checked={editFormData.not_given_by_laury}
                            onChange={handleEditChange}
                            style={{ marginRight: '8px', cursor: 'pointer' }}
                          />
                          <Icons.Warning style={{ marginRight: '4px', fontSize: '12px' }} />
                          Cours non donné par Laury
                        </label>
                      </div>

                      {/* Not Given Reason - Only show if checkbox is checked */}
                      {editFormData.not_given_by_laury &amp;&amp; (
                        <div className="form-group" style={{ marginBottom: '15px' }}>
                          <label style={{ fontSize: '14px', marginBottom: '5px', display: 'block' }}>
                            <Icons.Info style={{ marginRight: '4px', fontSize: '12px' }} />
                            Raison
                          </label>
                          <textarea
                            name="not_given_reason"
                            value={editFormData.not_given_reason}
                            onChange={handleEditChange}
                            className="form-textarea"
                            rows="2"
                            placeholder="Pourquoi ce cours n'a-t-il pas été donné par Laury ?"
                            style={{ fontSize: '14px' }}
                          />
                        </div>
                      )}

                      {/* Description */}
                      <div className="form-group" style={{ marginBottom: '15px' }}>
                        <label style={{ fontSize: '14px', marginBottom: '5px', display: 'block' }}>
                          <Icons.Info style={{ marginRight: '4px', fontSize: '12px' }} />
                          Description
                        </label>
                        <textarea
                          name="description"
                          value={editFormData.description}
                          onChange={handleEditChange}
                          className="form-textarea"
                          rows="3"
                          placeholder="Optionnel..."
                          style={{ fontSize: '14px' }}
                        />
                      </div>

                      {/* Form actions removed - moved to footer */}
                    </form>
                  </div>
                ) : (
                  /* View mode */
                  <>
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
                        {format(parseISO(lessonData.lesson_date), 'EEEE dd MMMM yyyy', {
                          locale: fr,
                        })}
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

                    {lessonData.template_id && (
                      <div className="alert alert-info">
                        <Icons.Info style={{ marginRight: '8px' }} />
                        Ce cours a été créé à partir d'un template récurrent
                      </div>
                    )}

                    {lessonData.not_given_by_laury && (
                      <div className="alert alert-warning">
                        <Icons.Warning style={{ marginRight: '8px' }} />
                        Ce cours n'a pas été donné par Laury
                      </div>
                    )}
                  </>
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

            {/* Tab Advanced */}
            {activeTab === 'advanced' &amp;&amp; (
              <div className="advanced-tab">
                <div className="advanced-section">
                  <h3 className="section-title">
                    <Icons.Info style={{ marginRight: '8px' }} />
                    Informations Détaillées
                  </h3>

                  {/* Min Participants - Only show if set */}
                  {lessonData.min_participants &amp;&amp; (
                    <div className="detail-row">
                      <label>
                        <Icons.Users style={{ marginRight: '4px' }} />
                        Participants minimum :
                      </label>
                      <span>{lessonData.min_participants}</span>
                    </div>
                  )}

                  {/* Cancellation Reason - Only show if cancelled */}
                  {lessonData.status === 'cancelled' &amp;&amp; lessonData.cancellation_reason &amp;&amp; (
                    <div className="alert alert-error">
                      <Icons.Close style={{ marginRight: '8px' }} />
                      <div>
                        <strong>Raison de l'annulation :</strong>
                        <p style={{ marginTop: '8px' }}>{lessonData.cancellation_reason}</p>
                      </div>
                    </div>
                  )}

                  {/* Not Given Info - Only show if marked */}
                  {lessonData.not_given_by_laury &amp;&amp; (
                    <div className="alert alert-warning">
                      <Icons.Warning style={{ marginRight: '8px' }} />
                      <div>
                        <strong>Cours non donné par Laury</strong>
                        {lessonData.not_given_reason &amp;&amp; (
                          <p style={{ marginTop: '8px' }}>
                            <strong>Raison :</strong> {lessonData.not_given_reason}
                          </p>
                        )}
                        {lessonData.not_given_at &amp;&amp; (
                          <small style={{ display: 'block', marginTop: '8px', opacity: 0.8 }}>
                            Marqué le : {format(parseISO(lessonData.not_given_at), 'dd/MM/yyyy à HH:mm', { locale: fr })}
                          </small>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Modification Info - Only show if modified */}
                  {lessonData.is_modified &amp;&amp; (
                    <div className="alert alert-info">
                      <Icons.Edit style={{ marginRight: '8px' }} />
                      <div>
                        <strong>Cours modifié</strong>
                        <p style={{ marginTop: '8px' }}>Ce cours a été modifié par rapport au template original.</p>
                        {lessonData.modified_fields &amp;&amp; Object.keys(lessonData.modified_fields).length > 0 &amp;&amp; (
                          <div style={{ marginTop: '12px' }}>
                            <strong>Champs modifiés :</strong>
                            <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
                              {Object.entries(lessonData.modified_fields).map(([field, value]) => (
                                <li key={field} style={{ marginBottom: '4px' }}>
                                  <strong>{field}:</strong> {JSON.stringify(value)}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="advanced-section">
                  <h3 className="section-title">
                    <Icons.Clock style={{ marginRight: '8px' }} />
                    Métadonnées
                  </h3>

                  {lessonData.created_at &amp;&amp; (
                    <div className="detail-row">
                      <label>
                        <Icons.Calendar style={{ marginRight: '4px' }} />
                        Créé le :
                      </label>
                      <span>
                        {format(parseISO(lessonData.created_at), 'dd/MM/yyyy à HH:mm', { locale: fr })}
                      </span>
                    </div>
                  )}

                  {lessonData.updated_at &amp;&amp; (
                    <div className="detail-row">
                      <label>
                        <Icons.Clock style={{ marginRight: '4px' }} />
                        Dernière modification :
                      </label>
                      <span>
                        {format(parseISO(lessonData.updated_at), 'dd/MM/yyyy à HH:mm', { locale: fr })}
                      </span>
                    </div>
                  )}

                  {lessonData.instructor_id &amp;&amp; (
                    <div className="detail-row">
                      <label>
                        <Icons.User style={{ marginRight: '4px' }} />
                        ID Instructeur :
                      </label>
                      <span>#{lessonData.instructor_id}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="modal-footer">
            {isEditing ? (
              /* Edit mode actions */
              <div className="modal-actions-compact">
                <button
                  type="button"
                  className="btn btn-sm btn-secondary"
                  onClick={handleCancelEdit}
                  disabled={saving}
                >
                  <Icons.Cancel style={{ marginRight: '6px', fontSize: '14px' }} />
                  Annuler
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-primary"
                  onClick={handleSaveEdit}
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <Icons.Loading
                        className="spin"
                        style={{ marginRight: '6px', fontSize: '14px' }}
                      />
                      Sauvegarde...
                    </>
                  ) : (
                    <>
                      <Icons.Check style={{ marginRight: '6px', fontSize: '14px' }} />
                      Sauvegarder
                    </>
                  )}
                </button>
              </div>
            ) : (
              /* Normal mode actions */
              <div className="modal-actions-compact">
                {lessonData.status !== 'cancelled' && (
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={handleStartEdit}
                    title="Modifier le cours"
                  >
                    <Icons.Edit style={{ marginRight: '6px', fontSize: '14px' }} />
                    Modifier
                  </button>
                )}
                {lessonData.status !== 'cancelled' && (
                  <>
                    {!isBlocked && !lessonData.not_given_by_laury && (
                      <button className="btn btn-sm btn-warning" onClick={handleMarkNotGiven}>
                        <Icons.Warning style={{ marginRight: '6px', fontSize: '14px' }} />
                        Non donné
                      </button>
                    )}
                    <button className="btn btn-sm btn-danger" onClick={handleCancel}>
                      <Icons.Close style={{ marginRight: '6px', fontSize: '14px' }} />
                      Annuler
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Portal>
  );
}

export default LessonModal;
