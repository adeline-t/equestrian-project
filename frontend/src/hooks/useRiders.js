import { useState, useEffect } from 'react';
import { ridersApi } from '../services';

/**
 * Custom hook for fetching and managing riders data
 * @returns {Object} Riders data, loading state, error, and refresh function
 */
export const useRiders = () => {
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
      console.error('Error loading riders:', err);
      setError(err.message || 'Erreur lors du chargement des cavaliers');
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
    refresh: loadRiders,
  };
};