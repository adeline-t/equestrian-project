import { useState, useCallback } from 'react';
import { calendarService } from '../services/calendarService';

export function useEventEdit(slot, event) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const startEdit = useCallback(() => {
    setEditData({
      slot_status: slot?.slot_status || 'scheduled',
      event_type: event?.event_type || 'private_lesson',
      instructor_id: event?.instructor_id || slot?.actual_instructor_id || 1,
      min_participants: event?.min_participants || 0,
      max_participants: event?.max_participants || 1,
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
      if (!slotId) return false;
      try {
        setSaving(true);
        setError(null);

        // Update slot
        await calendarService.updateSlot(slotId, {
          slot_status: editData.slot_status,
          actual_instructor_id: editData.instructor_id,
        });

        // Update event if exists
        if (eventId) {
          await calendarService.updateEvent(eventId, {
            event_type: editData.event_type,
            instructor_id: editData.instructor_id,
            min_participants: parseInt(editData.min_participants) || 0,
            max_participants: parseInt(editData.max_participants) || 1,
            name: editData.name,
            description: editData.description,
          });
        }

        if (onSuccess) await onSuccess();
        setIsEditing(false);
        return true;
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Erreur lors de la sauvegarde');
        return false;
      } finally {
        setSaving(false);
      }
    },
    [editData]
  );

  const cancelEdit = useCallback(() => {
    setIsEditing(false);
    setEditData({});
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
