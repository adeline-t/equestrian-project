import { useState, useCallback, useEffect } from 'react';
import { calendarService } from '../services/calendarService';

export function useEventDetails(slotId) {
  const [slot, setSlot] = useState(null);
  const [event, setEvent] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);

      const slotData = await calendarService.getSlot(id);
      setSlot(slotData);

      if (slotData.event?.id) {
        const eventData = await calendarService.getEvent(slotData.event.id);
        setEvent(eventData);
        setParticipants(eventData.participants || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (slotId) loadData(slotId);
  }, [slotId, loadData]);

  return { slot, event, participants, loading, error, refresh: loadData };
}
