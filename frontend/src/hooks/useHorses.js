import { useState, useEffect } from 'react';
import { horsesApi } from '../services';

/**
 * Custom hook for fetching and managing horses data
 * @returns {Object} Horses data, loading state, error, and refresh function
 */
export const useHorses = () => {
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
      console.error('Error loading horses:', err);
      setError(err.message || 'Erreur lors du chargement des chevaux');
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
    refresh: loadHorses,
  };
};