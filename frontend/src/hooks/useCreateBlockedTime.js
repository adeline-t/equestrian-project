import { useState, useCallback } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { calendarService } from '../services/calendarService';
import { EVENT_TYPES, SLOT_STATUSES } from '../lib/domain/events';

/**
 * Hook for creating blocked time slots with new slot-first DB schema
 */
export function useCreateBlockedTime() {
  const [formData, setFormData] = useState({
    event_date: format(new Date(), 'yyyy-MM-dd'),
    start_time: '09:00',
    end_time: '10:00',
    is_all_day: false,
    slot_status: SLOT_STATUSES.SCHEDULED,
    event_type: EVENT_TYPES.BLOCKED,
    instructor_id: 1, // TODO: from user context
    name: '',
    description: '',
  });

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

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;

      // Auto-generate name based on date and time if not manually set
      if (name !== 'name' && !formData.name) {
        const dateStr = format(new Date(formData.event_date), 'dd/MM', { locale: fr });
        const autoName = formData.is_all_day
          ? `Bloqué - ${dateStr}`
          : `Bloqué - ${dateStr} ${formData.start_time}`;

        setFormData((prev) => ({
          ...prev,
          [name]: value,
          name: autoName,
        }));
      } else {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
    },
    [formData.name, formData.event_date, formData.start_time, formData.is_all_day]
  );

  const resetForm = useCallback((initialDate) => {
    setFormData({
      event_date: initialDate || format(new Date(), 'yyyy-MM-dd'),
      start_time: '09:00',
      end_time: '10:00',
      is_all_day: false,
      slot_status: SLOT_STATUSES.CONFIRMED,
      event_type: EVENT_TYPES.BLOCKED,
      instructor_id: 1,
      name: '',
      description: '',
    });
    setError(null);
  }, []);

  const createBlockedTime = useCallback(async () => {
    setError(null);

    try {
      setLoading(true);

      // 1. Create planning slot
      const slotDateTime = formData.is_all_day
        ? `${formData.event_date}T00:00:00`
        : `${formData.event_date}T${formData.start_time}:00`;

      const slotEndDateTime = formData.is_all_day
        ? `${formData.event_date}T23:59:59`
        : `${formData.event_date}T${formData.end_time}:00`;

      const slotPayload = {
        start_time: slotDateTime,
        end_time: slotEndDateTime,
        is_all_day: formData.is_all_day,
        slot_status: formData.slot_status,
        actual_instructor_id: formData.instructor_id,
        cancellation_reason: null,
      };

      const slotResponse = await calendarService.createSlot(slotPayload);
      const slotId = slotResponse.id;

      // 2. Create blocked event
      const dateStr = format(new Date(formData.event_date), 'dd/MM', { locale: fr });
      const finalName =
        formData.name ||
        (formData.is_all_day
          ? `Bloqué - ${dateStr}`
          : `Bloqué - ${dateStr} ${formData.start_time}`);

      const eventPayload = {
        planning_slot_id: slotId,
        event_type: EVENT_TYPES.BLOCKED,
        instructor_id: formData.instructor_id,
        min_participants: 0,
        max_participants: 0,
        name: finalName,
        description: formData.description || null,
      };

      const eventResponse = await calendarService.createEvent(eventPayload);
      return { success: true, slotId, eventId: eventResponse.id };
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Erreur lors de la création';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, [formData]);

  return {
    formData,
    loading,
    error,
    formatDuration,
    handleChange,
    resetForm,
    createBlockedTime,
    setFormData,
  };
}
