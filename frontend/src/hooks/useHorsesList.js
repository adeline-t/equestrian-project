import { useState, useEffect } from 'react';
import { horsesApi } from '../services/api';

/**
 * Custom hook for managing horses list data and operations
 * @returns {Object} Horses data, loading state, error, and reload function
 */
export function useHorsesList() {
  const [horses, setHorses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadHorses = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await horsesApi.getAll();
      setHorses(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHorses();
  }, []);

  return {
    horses,
    loading,
    error,
    reload: loadHorses,
    setError,
  };
}