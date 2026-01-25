import { useState, useCallback, useEffect } from 'react';
import { calendarService } from '../services/calendarService';

/**
 * Hook to manage scheduled events
 */
export function useEventScheduledList() {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null); // ID of slot being processed
  const [actionError, setActionError] = useState(null);

  const loadScheduledSlots = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await calendarService.getScheduledSlots();
      setSlots(data || []);
    } catch (err) {
      console.error('Error loading scheduled events:', err);
      setError(err.message || 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  }, []);

  // Load on mount
  useEffect(() => {
    loadScheduledSlots();
  }, [loadScheduledSlots]);

  const validateSlot = useCallback(
    async (slotId) => {
      try {
        setActionLoading(slotId);
        setActionError(null);
        await calendarService.updateSlot(slotId, { slot_status: 'confirmed' });
        await loadScheduledSlots(); // Reload the list
        return true;
      } catch (err) {
        console.error('Error validating slot:', err);
        setActionError(err.message || 'Erreur lors de la validation');
        return false;
      } finally {
        setActionLoading(null);
      }
    },
    [loadScheduledSlots]
  );

  const deleteSlot = useCallback(
    async (slotId) => {
      try {
        setActionLoading(slotId);
        setActionError(null);
        await calendarService.deleteSlot(slotId);
        await loadScheduledSlots(); // Reload the list
        return true;
      } catch (err) {
        console.error('Error deleting slot:', err);
        setActionError(err.message || 'Erreur lors de la suppression');
        return false;
      } finally {
        setActionLoading(null);
      }
    },
    [loadScheduledSlots]
  );

  const refresh = useCallback(() => {
    loadScheduledSlots();
  }, [loadScheduledSlots]);

  return {
    slots,
    loading,
    error,
    actionLoading,
    actionError,
    validateSlot,
    deleteSlot,
    refresh,
  };
}
