import { useState, useEffect } from 'react';
import { ridersApi } from '../services/api';

/**
 * Custom hook for managing rider-horse pairings
 * @param {string} riderId - Selected rider ID
 * @returns {Object} Paired horses and loading state
 */
export const useRiderHorses = (riderId) => {
  const [riderPairedHorses, setRiderPairedHorses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (riderId) {
      loadHorsesForRider(riderId);
    } else {
      setRiderPairedHorses([]);
    }
  }, [riderId]);

  const loadHorsesForRider = async (riderId) => {
    try {
      setLoading(true);
      setError(null);
      
      const pairedHorsesRaw = await ridersApi.getHorses(riderId);

      const pairedHorses = pairedHorsesRaw.map((pairing) => ({
        id: pairing.horses.id,
        name: pairing.horses.name,
        kind: pairing.horses.kind,
        breed: pairing.horses.breed,
        color: pairing.horses.color,
        pairing_id: pairing.id,
      }));

      setRiderPairedHorses(pairedHorses);

      console.log('🐴 Paired horses for rider:', pairedHorses);
    } catch (err) {
      console.error('Error loading rider horses:', err);
      setError(err);
      setRiderPairedHorses([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    riderPairedHorses,
    loading,
    error,
    refresh: () => riderId && loadHorsesForRider(riderId),
  };
};