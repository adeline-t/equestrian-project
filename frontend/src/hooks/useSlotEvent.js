import { useState, useEffect } from 'react';
import { calendarService } from '../services/calendarService';

/**
 * Hook to fetch event associated with a slot
 * @param {Object} slot - The slot object
 */
export function useSlotEvent(slot) {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(Boolean(slot?.event_id));
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slot?.event_id) {
      setEvent(null);
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function fetchEvent() {
      try {
        setLoading(true);
        setError(null);
        const data = await calendarService.getEvent(slot.event_id);
        if (!cancelled) {
          setEvent(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchEvent();
    return () => {
      cancelled = true;
    };
  }, [slot?.event_id]);

  return { event, loading, error };
}
