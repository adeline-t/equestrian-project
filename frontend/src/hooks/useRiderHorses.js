import { useState, useEffect } from 'react';
import axios from 'axios';

/**
 * Hook to fetch horses associated with a specific rider
 * @param {string|number} riderId - The selected rider ID
 */
export function useRiderHorses(riderId) {
  const [riderPairedHorses, setRiderPairedHorses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!riderId) {
      setRiderPairedHorses([]);
      return;
    }

    const fetchRiderHorses = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch rider-horse pairings
        const response = await axios.get(`/api/riders/${riderId}/horses`);

        // The backend returns an array of pairings with nested horses
        // Each pairing has: { id, rider_id, horse_id, link_type, horses: { id, name, ... } }
        let horsesData = [];

        if (Array.isArray(response.data)) {
          // Extract horses from pairings and filter out null/deleted horses
          horsesData = response.data
            .map((pairing) => pairing.horses)
            .filter((horse) => horse && horse.id); // Filter out null or invalid horses
        }

        setRiderPairedHorses(horsesData);
      } catch (err) {
        console.error('Error fetching rider horses:', err);
        setError('Erreur lors du chargement des chevaux du cavalier');
        setRiderPairedHorses([]); // Ensure it's always an array
      } finally {
        setLoading(false);
      }
    };

    fetchRiderHorses();
  }, [riderId]);

  return {
    riderPairedHorses,
    loading,
    error,
  };
}
