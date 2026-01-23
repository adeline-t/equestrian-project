import { useState, useCallback } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { calendarService } from '../services/calendarService';
import { EVENT_TYPES, SLOT_STATUSES } from '../lib/domain/events';
import { getTodayISO } from '../lib/helpers/index.js';

/**
 * Hook to manage blocked time creation
 * Uses Event → Slot order (event_id required in planning_slots)
 */
export function useCreateBlockedTime() {
  const [formData, setFormData] = useState({
    slot_date: getTodayISO(),
    start_time: '09:00',
    end_time: '10:00',
    is_all_day: false,
    slot_status: SLOT_STATUSES.SCHEDULED,
    event_type: EVENT_TYPES.BLOCKED,
    instructor_id: 1,
    name: '',
    description: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;

      // Auto-generate name if user hasn't set a custom one
      if (name !== 'name' && !formData.name) {
        const dateStr = format(new Date(formData.slot_date), 'dd/MM', { locale: fr });
        const autoName = formData.is_all_day
          ? `Bloqué - ${dateStr}`
          : `Bloqué - ${dateStr} ${formData.start_time}`;
        setFormData((prev) => ({ ...prev, [name]: value, name: autoName }));
      } else {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
    },
    [formData.name, formData.slot_date, formData.start_time, formData.is_all_day]
  );

  const resetForm = useCallback((initialDate) => {
    setFormData({
      slot_date: initialDate || getTodayISO(),
      start_time: '09:00',
      end_time: '10:00',
      is_all_day: false,
      slot_status: SLOT_STATUSES.SCHEDULED,
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

      // Generate final name
      const dateStr = format(new Date(formData.slot_date), 'dd/MM', { locale: fr });
      const finalName =
        formData.name ||
        (formData.is_all_day
          ? `Bloqué - ${dateStr}`
          : `Bloqué - ${dateStr} ${formData.start_time}`);

      // ⚠️ STEP 1: Create EVENT first (required for foreign key constraint)
      const eventPayload = {
        event_type: EVENT_TYPES.BLOCKED,
        instructor_id: formData.instructor_id,
        min_participants: 0,
        max_participants: 0,
        name: finalName,
        description: formData.description || null,
      };

      console.log('📤 Blocked Event Payload:', eventPayload);

      const eventResponse = await calendarService.createEvent(eventPayload);
      const eventId = eventResponse.id;

      console.log('✅ Blocked Event created:', eventId);

      // ⚠️ STEP 2: Create SLOT with event_id (required FK)
      const slotPayload = {
        event_id: eventId, // ⚠️ CRITICAL: Required foreign key
        slot_date: formData.slot_date,
        start_time: formData.is_all_day ? '00:00:00' : `${formData.start_time}:00`,
        end_time: formData.is_all_day ? '23:59:59' : `${formData.end_time}:00`,
        is_all_day: formData.is_all_day,
        slot_status: formData.slot_status || SLOT_STATUSES.SCHEDULED,
        actual_instructor_id: formData.instructor_id,
        cancellation_reason: null,
      };

      console.log('📤 Blocked Slot Payload:', slotPayload);

      const slotResponse = await calendarService.createSlot(slotPayload);
      const slotId = slotResponse.id;

      console.log('✅ Blocked Slot created:', slotId);

      return { success: true, slotId, eventId };
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Erreur lors de la création';
      setError(errorMsg);
      console.error('❌ Blocked time creation error:', err);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, [formData]);

  return {
    formData,
    loading,
    error,
    handleChange,
    resetForm,
    createBlockedTime,
    setFormData,
  };
}
