import { useEffect, useState } from 'react';
import { calendarService } from '../services';

export function useEventDetails(slotId) {
  const [slot, setSlot] = useState(null);
  const [event, setEvent] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await calendarService.getSlotFullDetails(slotId);

      setSlot(response.slot);
      setEvent(response.slot?.events || null);

      // Filtrer les participants annulés
      const activeParticipants = (response.participants || []).filter((p) => !p.is_cancelled);

      setParticipants(activeParticipants);
    } catch (err) {
      console.error(err);
      setError('Erreur lors du chargement de l’événement');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slotId) fetchEvent();
  }, [slotId]);

  return {
    slot,
    event,
    participants,
    loading,
    error,
    reload: fetchEvent,
  };
}
