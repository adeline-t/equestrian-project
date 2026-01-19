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

      // Fetch slot data
      const slotData = await calendarService.getSlot(id);
      setSlot(slotData);

      // If slot has an event, fetch event details
      if (slotData.event_id) {
        const eventData = await calendarService.getEvent(slotData.event_id);
        setEvent(eventData);

        // Fetch participants if event exists
        if (eventData.id) {
          const participantsData = await calendarService.getParticipants(eventData.id);
          setParticipants(participantsData || []);
        }
      }
    } catch (err) {
      console.error('Error loading event details:', err);
      setError(err.response?.data?.message || err.message || 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (slotId) {
      loadData(slotId);
    }
  }, [slotId, loadData]);

  const refresh = useCallback(() => {
    if (slotId) {
      loadData(slotId);
    }
  }, [slotId, loadData]);

  return {
    slot,
    event,
    participants,
    loading,
    error,
    refresh,
  };
}
