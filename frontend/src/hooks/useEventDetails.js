import { useState, useCallback, useEffect } from 'react';
import { calendarService } from '../services/calendarService';

export function useEventDetails(slotId) {
  const [data, setData] = useState({
    slot: null,
    event: null,
    participants: [],
    recurrence: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = useCallback(async (id) => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);

      const fullDetails = await calendarService.getSlotFullDetails(id);

      // Normalize slot times for UI
      if (fullDetails.slot) {
        fullDetails.slot.start_time = fullDetails.slot.start_time?.slice(11, 16);
        fullDetails.slot.end_time = fullDetails.slot.end_time?.slice(11, 16);
      }

      setData(fullDetails);
    } catch (err) {
      console.error('Error loading event details:', err);
      setError(err.response?.data?.message || err.message || 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData(slotId);
  }, [slotId, loadData]);

  const refresh = useCallback(() => {
    loadData(slotId);
  }, [slotId, loadData]);

  return {
    ...data,
    loading,
    error,
    refresh,
  };
}
