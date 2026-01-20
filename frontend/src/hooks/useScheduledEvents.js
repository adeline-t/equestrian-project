import { useState, useEffect, useCallback } from 'react';
import { calendarService } from '../services/calendarService';

/**
 * Hook pour gérer les événements programmés
 */
export function useScheduledEvents() {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    loadScheduledSlots();
  }, [loadScheduledSlots]);

  const refresh = useCallback(() => {
    loadScheduledSlots();
  }, [loadScheduledSlots]);

  return {
    slots,
    loading,
    error,
    refresh,
  };
}
