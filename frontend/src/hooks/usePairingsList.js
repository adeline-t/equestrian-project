import { useState, useEffect } from 'react';
import { pairingsApi, ridersApi, horsesApi } from '../services';

/**
 * Custom hook for managing pairings list data
 * @returns {Object} Pairings data, riders, horses, loading state, error, and reload function
 */
export function usePairingsList() {
  const [pairings, setPairings] = useState([]);
  const [riders, setRiders] = useState([]);
  const [horses, setHorses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [pairingsData, ridersData, horsesData] = await Promise.all([
        pairingsApi.getAll(),
        ridersApi.getAll(),
        horsesApi.getAll(),
      ]);
      setPairings(pairingsData || []);
      setRiders(ridersData || []);
      setHorses(horsesData || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return {
    pairings,
    riders,
    horses,
    loading,
    error,
    reload: loadData,
    setError,
  };
}