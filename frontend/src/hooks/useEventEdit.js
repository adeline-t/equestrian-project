import { useState, useCallback } from 'react';
import { EVENT_TYPES } from '../lib/domain/events';

export function useEventEdit(slot, event) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const startEdit = useCallback(() => {
    setEditData({
      slot_status: slot?.slot_status || 'scheduled',
      event_type: event?.event_type || EVENT_TYPES.PRIVATE_LESSON.value,
      instructor_id: slot?.actual_instructor_id || 1,
      name: event?.name || '',
      description: event?.description || '',
    });
    setIsEditing(true);
    setError(null);
  }, [slot, event]);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }, []);

  const saveEdit = useCallback(
    async (slotId, eventId, onSuccess) => {
      try {
        setSaving(true);
        setError(null);

        // Update slot
        await calendarService.updateSlot(slotId, {
          slot_status: editData.slot_status,
          actual_instructor_id: editData.instructor_id,
        });

        // Update/create event
        if (eventId) {
          await calendarService.updateEvent(eventId, editData);
        } else {
          await calendarService.createEvent({
            planning_slot_id: slotId,
            ...editData,
          });
        }

        onSuccess();
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setSaving(false);
      }
    },
    [editData]
  );

  const cancelEdit = useCallback(() => {
    setIsEditing(false);
    setError(null);
  }, []);

  return {
    isEditing,
    editData,
    saving,
    error,
    startEdit,
    handleChange,
    saveEdit,
    cancelEdit,
  };
}
