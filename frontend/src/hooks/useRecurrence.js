import { useState, useEffect } from 'react';
import { calendarService } from '../services/calendarService';

/**
 * Hook pour gérer les récurrences d'un événement
 */
export function useRecurrence(eventId) {
  const [recurrences, setRecurrences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  // Charger les récurrences de l'event
  const refresh = async () => {
    if (!eventId) {
      setRecurrences([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await calendarService.getRecurrencesByEvent(eventId);
      setRecurrences(data || []);
    } catch (err) {
      console.error('[useRecurrence] Error loading recurrences:', err);
      setError(err.message || 'Erreur lors du chargement des récurrences');
      setRecurrences([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, [eventId]);

  // Démarrer la création d'une récurrence
  const startCreating = () => {
    setIsCreating(true);
    setSaveError(null);
  };

  // Annuler la création
  const cancelCreating = () => {
    setIsCreating(false);
    setSaveError(null);
  };

  // Créer une nouvelle récurrence
  const createRecurrence = async (recurrenceData) => {
    try {
      setSaving(true);
      setSaveError(null);

      const payload = {
        event_id: eventId,
        frequency: recurrenceData.frequency,
        interval: recurrenceData.interval || 1,
        week_days: recurrenceData.week_days || null,
        start_time: recurrenceData.start_time || null,
        end_time: recurrenceData.end_time || null,
        is_all_day: recurrenceData.is_all_day || false,
      };

      await calendarService.createRecurrence(payload);
      await refresh();
      setIsCreating(false);
      return true;
    } catch (err) {
      console.error('[useRecurrence] Error creating recurrence:', err);
      setSaveError(err.message || 'Erreur lors de la création de la récurrence');
      return false;
    } finally {
      setSaving(false);
    }
  };

  // Supprimer une récurrence
  const deleteRecurrence = async (recurrenceId) => {
    try {
      setDeleting(true);
      setDeleteError(null);
      await calendarService.deleteRecurrence(recurrenceId);
      await refresh();
      return true;
    } catch (err) {
      console.error('[useRecurrence] Error deleting recurrence:', err);
      setDeleteError(err.message || 'Erreur lors de la suppression de la récurrence');
      return false;
    } finally {
      setDeleting(false);
    }
  };

  return {
    recurrences,
    loading,
    error,
    isCreating,
    saving,
    saveError,
    deleting,
    deleteError,
    startCreating,
    cancelCreating,
    createRecurrence,
    deleteRecurrence,
    refresh,
  };
}
