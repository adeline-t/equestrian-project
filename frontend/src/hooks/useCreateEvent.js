import { useState, useCallback } from 'react';
import { format } from 'date-fns';
import { calendarService } from '../services/calendarService';
import { EVENT_TYPES, SLOT_STATUSES } from '../lib/domain/events';

/**
 * Inline event form validation
 */
const validateEventForm = (formData, participants) => {
  // Ajouter participants en paramètre
  const errors = {};

  // Required fields
  if (!formData.event_date || formData.event_date.trim() === '') {
    errors.event_date = 'La date est requise';
  }
  if (!formData.start_time || formData.start_time.trim() === '') {
    errors.start_time = "L'heure de début est requise";
  }
  if (!formData.event_type) {
    errors.event_type = "Le type d'événement est requis";
  }
  if (!formData.slot_status) {
    errors.slot_status = 'Le statut est requis';
  }

  // Time validation (end > start)
  if (formData.start_time && formData.end_time) {
    const [startHour, startMin] = formData.start_time.split(':').map(Number);
    const [endHour, endMin] = formData.end_time.split(':').map(Number);
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;

    if (endMinutes <= startMinutes) {
      errors.end_time = "L'heure de fin doit être après l'heure de début";
    }
  }

  // Participants limits (min <= max)
  if (formData.event_type !== EVENT_TYPES.BLOCKED) {
    if (!formData.max_participants || formData.max_participants < 1) {
      errors.max_participants = 'Le nombre maximum de participants est requis';
    }

    if (formData.min_participants !== undefined && formData.max_participants !== undefined) {
      const min = parseInt(formData.min_participants);
      const max = parseInt(formData.max_participants);
      if (min > max) {
        errors.min_participants = 'Le minimum ne peut pas dépasser le maximum';
      }
      if (min < 0 || max < 0) {
        errors.max_participants = 'Les nombres de participants doivent être positifs';
      }
    }

    // Validation du nombre de participants ajoutés
    if (participants && participants.length > formData.max_participants) {
      errors.participants = `Il y a ${participants.length} participants mais le maximum est de ${formData.max_participants}`;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Hook for creating events with slot-first DB schema
 */
export function useCreateEvent() {
  const [formData, setFormData] = useState({
    // Slot fields
    event_date: format(new Date(), 'yyyy-MM-dd'),
    start_time: '09:00',
    end_time: '10:00',
    is_all_day: false,
    slot_status: SLOT_STATUSES.SCHEDULED,
    actual_instructor_id: null,
    cancellation_reason: '',

    // Event fields
    event_type: EVENT_TYPES.PRIVATE_LESSON,
    instructor_id: 1,
    min_participants: 0,
    max_participants: 1,
    name: '',
    description: '',
  });

  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const formatDuration = useCallback((startTime, endTime) => {
    if (!startTime || !endTime) return '0min';
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    const durationMinutes = endMinutes - startMinutes;
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;
    return hours > 0 ? `${hours}h${minutes.toString().padStart(2, '0')}` : `${minutes}min`;
  }, []);

  const handleFormChange = useCallback(
    (e) => {
      const { name, value, type, checked } = e.target;
      const newValue = type === 'checkbox' ? checked : value;

      // Auto-adjust end time when start time changes (preserving duration)
      if (name === 'start_time' && formData.start_time && formData.end_time) {
        const [oldStartHour, oldStartMin] = formData.start_time.split(':').map(Number);
        const [oldEndHour, oldEndMin] = formData.end_time.split(':').map(Number);
        const durationMinutes = oldEndHour * 60 + oldEndMin - (oldStartHour * 60 + oldStartMin);

        const [newStartHour, newStartMin] = value.split(':').map(Number);
        const newEndMinutes = newStartHour * 60 + newStartMin + durationMinutes;
        const newEndHour = Math.floor(newEndMinutes / 60);
        const newEndMin = newEndMinutes % 60;
        const newEndTime = `${String(newEndHour).padStart(2, '0')}:${String(newEndMin).padStart(
          2,
          '0'
        )}`;

        setFormData((prev) => ({ ...prev, [name]: value, end_time: newEndTime }));
      } else {
        setFormData((prev) => ({ ...prev, [name]: newValue }));
      }
    },
    [formData.start_time, formData.end_time, formData.event_date]
  );

  const handleTypeChange = useCallback((e) => {
    const type = e.target.value;

    // Determine default participant counts based on event type
    let defaultMin = 0;
    let defaultMax = 1;

    if (type === EVENT_TYPES.PRIVATE_LESSON) {
      defaultMin = 1;
      defaultMax = 1;
    } else if (type === EVENT_TYPES.GROUPED_LESSON) {
      defaultMin = 2;
      defaultMax = 6;
    } else if (type === EVENT_TYPES.BLOCKED) {
      defaultMin = 0;
      defaultMax = 0;
    }

    setFormData((prev) => ({
      ...prev,
      event_type: type,
      max_participants: defaultMax,
      min_participants: defaultMin,
    }));
  }, []);

  const addParticipant = useCallback((riderId, horseId, horseAssignmentType = 'manual') => {
    setParticipants((prev) => {
      const alreadyExists = prev.some((p) => p.rider_id === riderId && p.horse_id === horseId);

      if (alreadyExists) return prev;

      return [
        ...prev,
        {
          id: Date.now(),
          rider_id: riderId,
          horse_id: horseId || null,
          horse_assignment_type: horseAssignmentType,
        },
      ];
    });
  }, []);

  const removeParticipant = useCallback((participantId) => {
    setParticipants((prev) => prev.filter((p) => p.id !== participantId));
  }, []);

  const updateParticipant = useCallback((participantId, riderId, horseId) => {
    setParticipants((prev) =>
      prev.map((p) => (p.id === participantId ? { ...p, rider_id: riderId, horse_id: horseId } : p))
    );
  }, []);

  const clearParticipants = useCallback(() => {
    setParticipants([]);
  }, []);

  const resetForm = useCallback((initialDate) => {
    setFormData({
      event_date: initialDate || format(new Date(), 'yyyy-MM-dd'),
      event_end_date: '',
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

    // Validate form - PASSER participants en paramètre
    const validation = validateEventForm(formData, participants);
    if (!validation.isValid) {
      setError(Object.values(validation.errors).join(', '));
      return { success: false, error: Object.values(validation.errors).join(', ') };
    }

    // Generate event name if not provided
    let eventName = formData.name?.trim();
    if (!eventName) {
      const eventTypeConfig = Object.values(EVENT_TYPES).find(
        (t) => t.value === formData.event_type
      );
      eventName = eventTypeConfig ? eventTypeConfig.label : 'Événement';
    }

    try {
      setLoading(true);

      // 1. Create planning slot
      const slotDateTime = `${formData.event_date}T${formData.start_time}:00`;
      const slotEndDateTime = `${formData.event_date}T${formData.end_time}:00`;

      const slotPayload = {
        start_time: slotDateTime,
        end_time: slotEndDateTime,
        is_all_day: formData.is_all_day,
        slot_status: formData.slot_status,
        actual_instructor_id: formData.actual_instructor_id || null,
        cancellation_reason: formData.cancellation_reason || null,
      };

      const slotResponse = await calendarService.createSlot(slotPayload);
      const slotId = slotResponse.id;

      // 2. Create event (skip for blocked slots if you want)
      if (formData.event_type !== EVENT_TYPES.BLOCKED) {
        const eventPayload = {
          planning_slot_id: slotId,
          event_type: formData.event_type,
          instructor_id: formData.instructor_id || null,
          min_participants: formData.min_participants || 0,
          max_participants: formData.max_participants || 0,
          name: eventName,
          description: formData.description || null,
        };

        const eventResponse = await calendarService.createEvent(eventPayload);
        const eventId = eventResponse.id;

        // 3. Create participants
        if (participants.length > 0) {
          await Promise.all(
            participants.map((participant) =>
              calendarService.addParticipant({
                event_id: eventId,
                planning_slot_id: slotId,
                rider_id: participant.rider_id,
                horse_id: participant.horse_id,
                horse_assignment_type: participant.horse_assignment_type,
              })
            )
          );
        }

        return { success: true, slotId, eventId };
      } else {
        // For blocked slots, just return the slot
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
    formatDuration,
    handleFormChange,
    handleTypeChange,
    addParticipant,
    removeParticipant,
    updateParticipant,
    clearParticipants,
    resetForm,
    createEvent,
    setFormData,
  };
}
