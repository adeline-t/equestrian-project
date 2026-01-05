import { useState, useEffect } from 'react';
import { horsesApi } from '../services';

/**
 * Custom hook for managing horses list data
 * @returns {Object} Horses data, loading state, error, and reload function
 */
export function useHorsesList() {
  const [horses, setHorses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHorses = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await horsesApi.getAll();
      setHorses(data || []);
    } catch (err) {
      console.error('Error fetching horses:', err);
      setError(err.message || 'Erreur lors du chargement des chevaux');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHorses();
  }, []);

  // Reload function to refresh the list
  const reload = async () => {
    await fetchHorses();
  };

  return {
    // State
    horses,
    loading,
    error,

    // Actions
    reload,

    // State setters
    setError,
    setHorses,
  };
}
