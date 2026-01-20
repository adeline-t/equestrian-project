import { useState, useEffect } from 'react';
import riderService from '../services/riderService';
import horseService from '../services/horseService';

/**
 * Hook to manage participant selection form state and fetch riders/horses
 */
export function useParticipants() {
  const [riders, setRiders] = useState([]);
  const [horses, setHorses] = useState([]);
  const [selectedRiderId, setSelectedRiderId] = useState('');
  const [selectedHorseId, setSelectedHorseId] = useState('');
  const [showAddParticipant, setShowAddParticipant] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch riders and horses on mount
  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch riders
        const ridersData = await riderService.getAll();
        if (!cancelled) setRiders(Array.isArray(ridersData) ? ridersData : []);

        // Fetch horses
        const horsesData = await horseService.getAll();
        if (!cancelled) setHorses(Array.isArray(horsesData) ? horsesData : []);
      } catch (err) {
        if (!cancelled) {
          console.error('Error fetching participants data:', err);
          setError('Erreur lors du chargement des données');
          setRiders([]);
          setHorses([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, []);

  const resetParticipantForm = () => {
    setSelectedRiderId('');
    setSelectedHorseId('');
    setShowAddParticipant(true);
  };

  return {
    riders,
    horses,
    selectedRiderId,
    setSelectedRiderId,
    selectedHorseId,
    setSelectedHorseId,
    showAddParticipant,
    setShowAddParticipant,
    resetParticipantForm,
    loading,
    error,
  };
}
