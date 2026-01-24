import { useState, useCallback } from 'react';
import { format } from 'date-fns';
import { calendarService } from '../services/calendarService';
import { EVENT_TYPES, getEventTypeLabel, SLOT_STATUSES } from '../lib/domain/events';
import { formatTimeForDatabase, calculateDurationMinutes } from '../lib/helpers/formatters';
import { getTodayISO } from '../lib/helpers';
import { validateEventForm } from '../lib/helpers/validators';

/**
 * Hook to manage event form data and creation logic
 */
export function useEventCreate(initialDate, initialStartTime, initialEndTime) {
  const [formData, setFormData] = useState(() => ({
    event_date: initialDate || getTodayISO(),
    start_time: initialStartTime || '16:00',
    end_time: initialEndTime || '17:00',
    is_all_day: false,
    slot_status: SLOT_STATUSES.SCHEDULED,
    actual_instructor_id: null,
    cancellation_reason: '',
    event_type: EVENT_TYPES.PRIVATE_LESSON,
    instructor_id: 0,
    min_participants: 1,
    max_participants: 1,
    name: '',
    description: '',
  }));

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFormChange = useCallback(
    (e) => {
      const { name, value, type, checked } = e.target;
      const newValue = type === 'checkbox' ? checked : value;

      // Auto-adjust end_time when start_time changes to maintain duration
      if (name === 'start_time' && formData.start_time && formData.end_time) {
        const duration = calculateDurationMinutes(formData.start_time, formData.end_time);

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

  const resetForm = useCallback((initialDate) => {
    setFormData({
      event_date: initialDate || getTodayISO,
      start_time: '16:00',
      end_time: '17:00',
      is_all_day: false,
      slot_status: SLOT_STATUSES.SCHEDULED,
      actual_instructor_id: null,
      cancellation_reason: '',
      event_type: EVENT_TYPES.PRIVATE_LESSON,
      instructor_id: 0,
      min_participants: 1,
      max_participants: 1,
      name: '',
      description: '',
    });
    setError(null);
  }, []);

  const createEvent = useCallback(
    async (participants = []) => {
      setError(null);
      const validation = validateEventForm(formData, participants);
      if (!validation.isValid) {
        const msg = Object.values(validation.errors).join(', ');
        setError(msg);
        return { success: false, error: msg };
      }

      try {
        setLoading(true);

        // STEP 1: Create event first (required for foreign key constraint)
        const eventPayload = {
          event_type: formData.event_type,
          instructor_id: formData.instructor_id || null,
          min_participants: formData.min_participants,
          max_participants: formData.max_participants,
          name: formData.name || getEventTypeLabel(formData.event_type),
          description: formData.description || null,
        };

        console.log('📤 Event Payload:', eventPayload);

        const eventResponse = await calendarService.createEvent(eventPayload);
        const eventId = eventResponse.id;

        // STEP 2: Create planning slot with event_id
        const slotPayload = {
          event_id: eventId, // Required foreign key
          slot_date: formData.event_date,
          is_all_day: formData.is_all_day,
          slot_status: formData.slot_status,
          actual_instructor_id: null,
          cancellation_reason: null,
        };

        // Add time fields only if not all-day
        if (!formData.is_all_day) {
          slotPayload.start_time = formatTimeForDatabase(formData.start_time);
          slotPayload.end_time = formatTimeForDatabase(formData.end_time);
        } else {
          // For all-day events, provide default times
          slotPayload.start_time = '00:00:00';
          slotPayload.end_time = '23:59:59';
        }

        console.log('📤 Slot Payload:', slotPayload);

        const slotResponse = await calendarService.createSlot(slotPayload);
        const slotId = slotResponse.id;

        // STEP 3: Add participants (if any)
        if (participants.length > 0) {
          await Promise.all(
            participants.map((p) =>
              calendarService.addParticipant({
                event_id: eventId,
                planning_slot_id: slotId,
                rider_id: p.rider_id,
                horse_id: p.horse_id,
                horse_assignment_type: 'manual',
              })
            )
          );
        }

        return { success: true, slotId, eventId };
      } catch (err) {
        const errorMsg =
          err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          'Erreur lors de la création';
        setError(errorMsg);
        return { success: false, error: errorMsg };
      } finally {
        setLoading(false);
      }
    },
    [formData]
  );

  return {
    formData,
    setFormData,
    handleFormChange,
    resetForm,
    createEvent,
    loading,
    error,
  };
}
