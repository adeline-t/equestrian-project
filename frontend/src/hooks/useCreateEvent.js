// ================================
// useCreateEvent.js
// ================================
import { useState, useCallback } from 'react';
import { format } from 'date-fns';
import { calendarService } from '../services/calendarService';
import { EVENT_TYPES, SLOT_STATUSES } from '../lib/domain/events';

const validateEventForm = (formData, participants) => {
  const errors = {};
  if (!formData.event_date) errors.event_date = 'La date est requise';
  if (!formData.start_time) errors.start_time = "L'heure de début est requise";
  if (!formData.event_type) errors.event_type = "Le type d'événement est requis";
  if (!formData.slot_status) errors.slot_status = 'Le statut est requis';

  if (formData.start_time && formData.end_time) {
    const [sh, sm] = formData.start_time.split(':').map(Number);
    const [eh, em] = formData.end_time.split(':').map(Number);
    if (eh * 60 + em <= sh * 60 + sm)
      errors.end_time = "L'heure de fin doit être après l'heure de début";
  }

  if (formData.event_type !== EVENT_TYPES.BLOCKED) {
    const min = parseInt(formData.min_participants || 0);
    const max = parseInt(formData.max_participants || 0);
    if (min > max) errors.min_participants = 'Le minimum ne peut pas dépasser le maximum';
    if (participants && participants.length > max)
      errors.participants = `Il y a ${participants.length} participants mais le maximum est de ${max}`;
  }

  return { isValid: Object.keys(errors).length === 0, errors };
};

export function useCreateEvent() {
  const [formData, setFormData] = useState({
    event_date: format(new Date(), 'yyyy-MM-dd'),
    start_time: '09:00',
    end_time: '10:00',
    is_all_day: false,
    slot_status: SLOT_STATUSES.SCHEDULED,
    actual_instructor_id: null,
    cancellation_reason: '',
    event_type: EVENT_TYPES.PRIVATE_LESSON,
    instructor_id: 1,
    min_participants: 1,
    max_participants: 1,
    name: '',
    description: '',
  });

  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFormChange = useCallback(
    (e) => {
      const { name, value, type, checked } = e.target;
      const newValue = type === 'checkbox' ? checked : value;

      if (name === 'start_time' && formData.start_time && formData.end_time) {
        const [sh, sm] = formData.start_time.split(':').map(Number);
        const [eh, em] = formData.end_time.split(':').map(Number);
        const duration = eh * 60 + em - (sh * 60 + sm);

        const [nh, nm] = value.split(':').map(Number);
        const totalEnd = nh * 60 + nm + duration;
        const newEnd = `${String(Math.floor(totalEnd / 60)).padStart(2, '0')}:${String(
          totalEnd % 60
        ).padStart(2, '0')}`;

        setFormData((prev) => ({ ...prev, [name]: value, end_time: newEnd }));
      } else {
        setFormData((prev) => ({ ...prev, [name]: newValue }));
      }
    },
    [formData.start_time, formData.end_time]
  );

  const addParticipant = useCallback((riderId, horseId, horseAssignmentType = 'manual') => {
    setParticipants((prev) => {
      if (prev.some((p) => p.rider_id === riderId && p.horse_id === horseId)) return prev;
      return [
        ...prev,
        {
          id: Date.now(),
          rider_id: riderId,
          horse_id: horseId,
          horse_assignment_type: horseAssignmentType,
        },
      ];
    });
  }, []);

  const removeParticipant = useCallback(
    (id) => setParticipants((prev) => prev.filter((p) => p.id !== id)),
    []
  );
  const clearParticipants = useCallback(() => setParticipants([]), []);

  const resetForm = useCallback((initialDate) => {
    setFormData({
      event_date: initialDate || format(new Date(), 'yyyy-MM-dd'),
      start_time: '09:00',
      end_time: '10:00',
      is_all_day: false,
      slot_status: SLOT_STATUSES.SCHEDULED,
      actual_instructor_id: null,
      cancellation_reason: '',
      event_type: EVENT_TYPES.PRIVATE_LESSON,
      instructor_id: 1,
      min_participants: 1,
      max_participants: 1,
      name: '',
      description: '',
    });
    setParticipants([]);
    setError(null);
  }, []);

  const createEvent = useCallback(async () => {
    setError(null);
    const validation = validateEventForm(formData, participants);
    if (!validation.isValid) {
      const msg = Object.values(validation.errors).join(', ');
      setError(msg);
      return { success: false, error: msg };
    }

    try {
      setLoading(true);
      const slotPayload = {
        start_time: `${formData.event_date}T${formData.start_time}:00`,
        end_time: `${formData.event_date}T${formData.end_time}:00`,
        is_all_day: formData.is_all_day,
        slot_status: formData.slot_status,
        actual_instructor_id: formData.actual_instructor_id || null,
        cancellation_reason: formData.cancellation_reason || null,
      };

      const slotResponse = await calendarService.createSlot(slotPayload);
      const slotId = slotResponse.id;

      if (formData.event_type !== EVENT_TYPES.BLOCKED) {
        const eventPayload = {
          planning_slot_id: slotId,
          event_type: formData.event_type,
          instructor_id: formData.instructor_id || null,
          min_participants: formData.min_participants,
          max_participants: formData.max_participants,
          name: formData.name || 'Événement',
          description: formData.description || null,
        };

        const eventResponse = await calendarService.createEvent(eventPayload);
        const eventId = eventResponse.id;

        if (participants.length > 0) {
          await Promise.all(
            participants.map((p) =>
              calendarService.addParticipant({
                event_id: eventId,
                planning_slot_id: slotId,
                rider_id: p.rider_id,
                horse_id: p.horse_id,
                horse_assignment_type: p.horse_assignment_type,
              })
            )
          );
        }

        return { success: true, slotId, eventId };
      } else {
        return { success: true, slotId, eventId: null };
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Erreur lors de la création';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, [formData, participants]);

  return {
    formData,
    participants,
    loading,
    error,
    handleFormChange,
    addParticipant,
    removeParticipant,
    clearParticipants,
    resetForm,
    createEvent,
    setFormData,
  };
}
