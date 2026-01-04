import { useState, useEffect } from 'react';
import { ridersApi } from '../services/api';

/**
 * Custom hook for managing riders list data
 * @returns {Object} Riders data, loading state, error, and reload function
 */
export function useRidersList() {
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadRiders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ridersApi.getAll();
      setRiders(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRiders();
  }, []);

  return {
    riders,
    loading,
    error,
    reload: loadRiders,
    setError,
  };
}