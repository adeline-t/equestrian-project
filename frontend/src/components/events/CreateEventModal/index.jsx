import React, { useState } from 'react';
import { format } from 'date-fns';
import { eventsApi } from '../../../services/calendarApi.js';
import Modal from '../../common/Modal.jsx';
import { Icons } from '../../../lib/icons.jsx';
import { EVENT_TYPES } from '../../../lib/domains/events/types';
import { validateLessonForm } from '../../../lib/helpers/domains/events/validators';
import { useParticipants } from '../../../hooks/index.js';
import ParticipantsList from './ParticipantsList.jsx';
import LessonForm from './EventForm.jsx';
import '../../../styles/components/events.css';

/**
 * Refactored SingleLessonModal Component
 * Modal for creating a new single event
 */
function SingleLessonModal({
  onClose,
  onSuccess,
  initialDate = null,
  initialStartTime = null,
  initialEndTime = null,
}) {
  const [formData, setFormData] = useState({
    event_date: initialDate || format(new Date(), 'yyyy-MM-dd'),
    start_time: initialStartTime || '09:00',
    end_time: initialEndTime || '10:00',
    event_type: 'private',
    name: '',
    description: '',
    max_participants: 1,
    status: 'scheduled',
  });

  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('details');

  // Use the participants hook for managing participants
  const {
    riders,
    horses,
    selectedRiderId,
    setSelectedRiderId,
    selectedHorseId,
    setSelectedHorseId,
    showAddParticipant,
    setShowAddParticipant,
    loading: loadingData,
    resetParticipantForm,
  } = useParticipants(null, null);

  const handleFormChange = (e) => {
    const { name, value } = e.target;

    // Auto-update end time when start time changes
    if (name === 'start_time' && formData.start_time && formData.end_time) {
      // Calculate current duration in minutes
      const [oldStartHour, oldStartMin] = formData.start_time.split(':').map(Number);
      const [oldEndHour, oldEndMin] = formData.end_time.split(':').map(Number);
      const durationMinutes = oldEndHour * 60 + oldEndMin - (oldStartHour * 60 + oldStartMin);

      // Calculate new end time
      const [newStartHour, newStartMin] = value.split(':').map(Number);
      const newEndMinutes = newStartHour * 60 + newStartMin + durationMinutes;
      const newEndHour = Math.floor(newEndMinutes / 60);
      const newEndMin = newEndMinutes % 60;

      // Format new end time
      const newEndTime = `${String(newEndHour).padStart(2, '0')}:${String(newEndMin).padStart(
        2,
        '0'
      )}`;

      setFormData((prev) => ({
        ...prev,
        [name]: value,
        end_time: newEndTime,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleTypeChange = (e) => {
    const type = e.target.value;
    const typeConfig = EVENT_TYPES.find((t) => t.value === type);

    setFormData((prev) => ({
      ...prev,
      event_type: type,
      max_participants: typeConfig?.defaultMax || 1,
    }));
  };

  const handleAddParticipant = () => {
    if (!selectedRiderId) {
      alert('Veuillez sélectionner un cavalier');
      return;
    }

    const rider = riders.find((r) => r.id === parseInt(selectedRiderId));
    const horse = selectedHorseId ? horses.find((h) => h.id === parseInt(selectedHorseId)) : null;

    const newParticipant = {
      id: Date.now(), // Temporary ID
      rider_id: parseInt(selectedRiderId),
      rider_name: rider?.name || '',
      horse_id: horse?.id || null,
      horse_name: horse?.name || null,
      horse_kind: horse?.kind || null,
      horse_assignment_type: horse ? 'manual' : 'none',
    };

    setParticipants((prev) => [...prev, newParticipant]);
    resetParticipantForm();
    setShowAddParticipant(false);
  };

  const handleRemoveParticipant = (participantId) => {
    setParticipants((prev) => prev.filter((p) => p.id !== participantId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validate form
    const validation = validateLessonForm(formData);
    if (!validation.isValid) {
      setError(Object.values(validation.errors).join(', '));
      return;
    }

    // Auto-generate event name if empty
    let eventName = formData.name?.trim();
    if (!eventName) {
      const eventType = EVENT_TYPES.find((t) => t.value === formData.event_type);
      eventName = eventType ? eventType.label : 'Cours';
    }

    try {
      setLoading(true);

      // Create event
      const eventResponse = await eventsApi.create({
        ...formData,
        name: eventName,
      });

      const eventId = eventResponse.data.id;

      // Add participants if any
      if (participants.length > 0) {
        await Promise.all(
          participants.map((participant) =>
            eventsApi.addParticipant(eventId, {
              rider_id: participant.rider_id,
              horse_id: participant.horse_id,
              horse_assignment_type: participant.horse_assignment_type,
            })
          )
        );
      }

      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (err) {
      console.error('Error creating event:', err);
      setError(err.response?.data?.error || err.message || 'Erreur lors de la création du cours');
    } finally {
      setLoading(false);
    }
  };

  const isBlocked = formData.event_type === 'blocked';

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={
        <span style={{ display: 'flex', alignItems: 'center' }}>
          <Icons.Add style={{ marginRight: '8px' }} />
          Créer un cours unique
        </span>
      }
      size="large"
      footer={
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', width: '100%' }}>
          <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
            <Icons.Cancel style={{ marginRight: '8px' }} />
            Annuler
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={loading || loadingData}
          >
            {loading ? (
              <>
                <Icons.Loading className="spin" style={{ marginRight: '8px' }} />
                Création...
              </>
            ) : (
              <>
                <Icons.Check style={{ marginRight: '8px' }} />
                Créer le cours
              </>
            )}
          </button>
        </div>
      }
    >
      {error && (
        <div className="alert alert-error" style={{ marginBottom: '20px' }}>
          <Icons.Warning style={{ marginRight: '8px' }} />
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="modal-tabs" style={{ marginBottom: '20px' }}>
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
            Participants ({participants.length})
          </button>
        )}
      </div>

      {/* Tab Content */}
      {activeTab === 'details' && (
        <LessonForm
          formData={formData}
          handleFormChange={handleFormChange}
          handleTypeChange={handleTypeChange}
        />
      )}

      {activeTab === 'participants' && !isBlocked && (
        <ParticipantsList
          participants={participants}
          riders={riders}
          horses={horses}
          selectedRiderId={selectedRiderId}
          setSelectedRiderId={setSelectedRiderId}
          selectedHorseId={selectedHorseId}
          setSelectedHorseId={setSelectedHorseId}
          showAddParticipant={showAddParticipant}
          setShowAddParticipant={setShowAddParticipant}
          handleAddParticipant={handleAddParticipant}
          handleRemoveParticipant={handleRemoveParticipant}
          resetParticipantForm={resetParticipantForm}
        />
      )}
    </Modal>
  );
}

export default SingleLessonModal;
