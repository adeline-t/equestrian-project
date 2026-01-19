import { useState, useEffect } from 'react';
import riderService from '../services/riderService';

/**
 * Hook to fetch horses associated with a specific rider
 * Also returns pairing information (loan days, link type, etc.)
 * @param {string|number} riderId - The selected rider ID
 */
export function useRiderHorsesWithPairings(riderId) {
  const [pairings, setPairings] = useState([]);
  const [horses, setHorses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!riderId) {
      setPairings([]);
      setHorses([]);
      return;
    }

    const fetchRiderHorses = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch rider-horse pairings using riderService
        const data = await riderService.getHorses(riderId);

        if (Array.isArray(data)) {
          setPairings(data);

          // Extract just the horses (for backward compatibility)
          const horsesData = data
            .map((pairing) => pairing.horses)
            .filter((horse) => horse && horse.id);
          setHorses(horsesData);
        } else {
          setPairings([]);
          setHorses([]);
        }
      } catch (err) {
        console.error('Error fetching rider horses:', err);
        setError('Erreur lors du chargement des chevaux du cavalier');
        setPairings([]);
        setHorses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRiderHorses();
  }, [riderId]);

  return {
    pairings, // Full pairing data with all details
    horses, // Just the horses (simplified)
    riderPairedHorses: horses, // Alias for backward compatibility
    loading,
    error,
  };
}
