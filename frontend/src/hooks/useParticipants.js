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

  // Fetch riders and horses on mount (combined to avoid loading state conflicts)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch riders using riderService
        const ridersData = await riderService.getAll();
        setRiders(Array.isArray(ridersData) ? ridersData : []);

        // Fetch horses using horseService
        const horsesData = await horseService.getAll();
        setHorses(Array.isArray(horsesData) ? horsesData : []);
      } catch (err) {
        console.error('Error fetching participants data:', err);
        setError('Erreur lors du chargement des données');
        setRiders([]);
        setHorses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
