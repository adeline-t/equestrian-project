import { useState, useEffect } from 'react';
import { calendarService } from '../services/calendarService';
import { formatTimeForInput, formatTimeForDatabase } from '../lib/helpers/formatters';

/**
 * Hook pour gérer l'édition d'un événement bloqué
 */
export function useEventBlockedEdit(slotId) {
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
    setError(null);
    try {
      const fullSlot = await calendarService.getSlotFullDetails(slotId);

      if (!fullSlot || !fullSlot.slot) {
        throw new Error('Aucune donnée reçue');
      }

      const slotData = fullSlot.slot;
      const eventData = slotData.events; // L'event est dans slot.events !

      if (!slotData) {
        throw new Error('Slot introuvable');
      }

      setSlot(slotData);
      setEvent(eventData);

      // Préparer editData avec les valeurs du slot/event
      setEditData({
        name: eventData?.name || '',
        description: eventData?.description || '',
        instructor_id: eventData?.instructor_id || slotData?.actual_instructor_id || 1,
        slot_date: slotData?.slot_date || '',
        start_time: slotData?.start_time || '09:00',
        end_time: slotData?.end_time || '10:00',
        is_all_day: slotData?.is_all_day || false,
        slot_status: slotData?.slot_status || 'SCHEDULED',
        cancellation_reason: slotData?.cancellation_reason || '',
      });

      setError(null);
    } catch (err) {
      console.error('[useEventBlockedEdit] Error:', err);
      setError(err.message || 'Erreur lors du chargement du slot');
      setSlot(null);
      setEvent(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slotId) {
      refresh();
    }
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
        instructor_id: event.instructor_id || slot.actual_instructor_id || 1,
        slot_date: slot.slot_date || '',
        start_time: slot.start_time || '09:00',
        end_time: slot.end_time || '10:00',
        is_all_day: slot.is_all_day || false,
        slot_status: slot.slot_status || 'SCHEDULED',
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
      const startTime = editData.start_time;
      const endTime = editData.end_time;

      if (startTime >= endTime) {
        setEditError("L'heure de début doit être inférieure à l'heure de fin.");
        return false;
      }
    }
    return true;
  };

  const saveEdit = async () => {
    if (!validateTimes()) return false;

    try {
      setSaving(true);
      setEditError(null);

      const slotPayload = {
        slot_date: editData.slot_date,
        actual_instructor_id: editData.instructor_id,
        is_all_day: editData.is_all_day,
        slot_status: editData.slot_status,
        cancellation_reason: editData.cancellation_reason || null,
      };

      if (!editData.is_all_day) {
        slotPayload.start_time = formatTimeForDatabase(editData.start_time);
        slotPayload.end_time = formatTimeForDatabase(editData.end_time);
      } else {
        slotPayload.start_time = null;
        slotPayload.end_time = null;
      }

      await calendarService.updateSlot(slot.id, slotPayload);

      if (event) {
        const eventPayload = {
          name: editData.name,
          description: editData.description || null,
          instructor_id: editData.instructor_id,
        };
        await calendarService.updateEvent(event.id, eventPayload);
      }

      await refresh();
      setIsEditing(false);
      return true;
    } catch (err) {
      console.error('[useEventBlockedEdit] Save error:', err);
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
      console.error('[useEventBlockedEdit] Delete error:', err);
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
