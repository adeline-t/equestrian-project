import { useCallback, useMemo, useState } from 'react';
import { calendarService } from '../services';
import { validateEventEdit } from '../lib/helpers';

export function useEventEdit(slot, event, onSuccess) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [editData, setEditData] = useState({});

  const startEdit = useCallback(() => {
    setEditData({
      slot_status: slot?.slot_status,
      instructor_id: event?.instructor_id,
      event_type: event?.event_type,
      name: event?.name || '',
      description: event?.description || '',
      min_participants: event?.min_participants,
      max_participants: event?.max_participants,
    });

    setIsEditing(true);
    setError(null);
  }, [slot, event]);

  /* -----------------------------
     FORM CHANGE
  ------------------------------ */
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  }, []);

  /* -----------------------------
     VALIDATION (externe)
  ------------------------------ */
  const validationErrors = useMemo(() => validateEventEdit(editData), [editData]);

  /* -----------------------------
     SAVE
  ------------------------------ */
  const saveEdit = async (slotId, eventId) => {
    if (validationErrors.length) {
      setError(validationErrors.join(', '));
      return false;
    }

    try {
      setSaving(true);
      setError(null);

      await calendarService.updateSlot(slotId, {
        slot_status: editData.slot_status,
        actual_instructor_id: editData.instructor_id,
      });

      await calendarService.updateEvent(eventId, {
        name: editData.name,
        description: editData.description,
        event_type: editData.event_type,
        instructor_id: editData.instructor_id,
        min_participants: editData.min_participants,
        max_participants: editData.max_participants,
      });

      setIsEditing(false);
      onSuccess?.();
      return true;
    } catch (err) {
      setError(err.message || 'Erreur lors de la sauvegarde');
      return false;
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditData({});
    setError(null);
  };

  /*
  Delete
  */
  const openDeleteModal = useCallback(() => {
    setShowDeleteModal(true);
  }, []);

  const deleteSlot = async (slotId) => {
    try {
      setError(null);
      setIsDeleting(true);
      await calendarService.deleteSlot(slotId);
      return true;
    } catch (err) {
      setError(err.message || 'Erreur lors de la sauvegarde');
      return false;
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const cancelSlot = async (slotId, cancellationReason) => {
    try {
      setError(null);
      setIsDeleting(true);

      await calendarService.cancelSlot(slotId, {
        cancellation_reason: cancellationReason,
      });

      return true;
    } catch (err) {
      setError(err.message || "Erreur lors de l'annulation du créneau");
      return false;
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  return {
    isEditing,
    editData,
    saving,
    error,
    validationErrors,
    startEdit,
    handleChange,
    saveEdit,
    cancelEdit,
    deleteSlot,
    cancelSlot,
    showDeleteModal, // <- AJOUTER
    setShowDeleteModal,
    openDeleteModal, // <- AJOUTER (pour cohérence)
    isDeleting,
  };
}
