import { useState, useEffect } from 'react';
import { calendarService } from '../services/calendarService';
import { formatTimeForInput } from '../lib/helpers/formatters';

/**
 * Hook pour gérer l'édition d'un événement bloqué
 */
export function useBlockedEventEdit(slotId) {
  const [slot, setSlot] = useState(null);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const refresh = async () => {
    setLoading(true);
    try {
      const fullSlot = await calendarService.getSlotFullDetails(slotId);
      setSlot(fullSlot.slot);
      setEvent(fullSlot.event);

      // Initialize editData with proper format
      setEditData({
        name: fullSlot.event?.name || '',
        description: fullSlot.event?.description || '',
        actual_instructor_id: fullSlot.slot?.actual_instructor_id || 1,
        slot_date: fullSlot.slot?.slot_date || '',
        start_time: fullSlot.slot?.start_time || '09:00:00',
        end_time: fullSlot.slot?.end_time || '10:00:00',
        is_all_day: fullSlot.slot?.is_all_day || false,
        slot_status: fullSlot.slot?.slot_status || 'scheduled',
        cancellation_reason: fullSlot.slot?.cancellation_reason || '',
      });
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement du slot');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, [slotId]);

  const startEdit = () => {
    setIsEditing(true);
    setEditError(null);
  };

  const cancelEdit = () => {
    if (slot && event) {
      setEditData({
        name: event.name || '',
        description: event.description || '',
        actual_instructor_id: slot.actual_instructor_id || 1,
        slot_date: slot.slot_date || '',
        start_time: slot.start_time || '09:00:00',
        end_time: slot.end_time || '10:00:00',
        is_all_day: slot.is_all_day || false,
        slot_status: slot.slot_status || 'scheduled',
        cancellation_reason: slot.cancellation_reason || '',
      });
    }
    setEditError(null);
    setIsEditing(false);
  };

  const handleChange = (field, value) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  const validateTimes = () => {
    if (!editData.is_all_day) {
      const startTime = formatTimeForInput(editData.start_time);
      const endTime = formatTimeForInput(editData.end_time);

      if (startTime >= endTime) {
        setEditError('L heure de début doit être inférieure à l heure de fin.');
        return false;
      }
    }
    return true;
  };

  const saveEdit = async () => {
    if (!validateTimes()) return false;

    try {
      setSaving(true);

      // Prepare slot data with proper time format
      const slotPayload = {
        slot_date: editData.slot_date,
        actual_instructor_id: editData.actual_instructor_id,
        is_all_day: editData.is_all_day,
        slot_status: editData.slot_status,
        cancellation_reason: editData.cancellation_reason || null,
      };

      // Only add time fields if not all-day
      // The times are already in HH:MM:SS format from formatTimeForDatabase
      if (!editData.is_all_day) {
        slotPayload.start_time = editData.start_time;
        slotPayload.end_time = editData.end_time;
      } else {
        slotPayload.start_time = null;
        slotPayload.end_time = null;
      }

      await calendarService.updateSlot(slot.id, slotPayload);

      if (event) {
        const eventPayload = {
          name: editData.name,
          description: editData.description || null,
          instructor_id: editData.actual_instructor_id,
        };
        await calendarService.updateEvent(event.id, eventPayload);
      }

      await refresh();
      setIsEditing(false);
      setEditError(null);
      return true;
    } catch (err) {
      setEditError(err.message || 'Erreur lors de la sauvegarde');
      return false;
    } finally {
      setSaving(false);
    }
  };

  const deleteSlot = async () => {
    try {
      setDeleting(true);
      setDeleteError(null);
      await calendarService.deleteSlot(slotId);
      return true;
    } catch (err) {
      setDeleteError(err.message || 'Erreur lors de la suppression');
      return false;
    } finally {
      setDeleting(false);
    }
  };

  return {
    slot,
    event,
    loading,
    error,
    isEditing,
    editData,
    saving,
    editError,
    deleting,
    deleteError,
    startEdit,
    cancelEdit,
    handleChange,
    saveEdit,
    deleteSlot,
    refresh,
  };
}
