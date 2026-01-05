import { useState, useEffect } from 'react';
import { ridersApi, packagesApi, pairingsApi, horsesApi } from '../services';

/**
 * Custom hook for managing rider card data and operations
 * @param {number} riderId - The rider ID
 * @returns {Object} Rider data, loading state, error, and handler functions
 */
export function useRiderCard(riderId) {
  const [rider, setRider] = useState(null);
  const [packages, setPackages] = useState([]);
  const [pairings, setPairings] = useState([]);
  const [ownedHorses, setOwnedHorses] = useState([]);
  const [riders, setRiders] = useState([]);
  const [horses, setHorses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (riderId) {
      fetchRiderData();
    }
  }, [riderId]);

  const fetchRiderData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch rider details
      const riderResponse = await ridersApi.getById(riderId);
      setRider(riderResponse);

      // Fetch all data in parallel
      await Promise.all([
        fetchPackages(),
        fetchPairings(),
        fetchOwnedHorses(),
        fetchAllRiders(),
        fetchAllHorses(),
      ]);
    } catch (error) {
      console.error('Error fetching rider data:', error);
      setError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const fetchPackages = async () => {
    try {
      // The API returns data directly, not wrapped in a response object
      const data = await ridersApi.getPackages(riderId);
      console.log('Packages fetched:', data); // Debug log
      setPackages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching packages:', error);
      setPackages([]);
    }
  };

  const fetchPairings = async () => {
    try {
      // The API returns data directly, not wrapped in a response object
      const data = await ridersApi.getHorses(riderId);
      console.log('Pairings fetched:', data); // Debug log
      setPairings(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching pairings:', error);
      setPairings([]);
    }
  };

  const fetchOwnedHorses = async () => {
    try {
      const response = await horsesApi.getAll();
      // Filter horses owned by this rider
      const owned = (response || []).filter((horse) => horse.owner_id === riderId);
      setOwnedHorses(owned);
    } catch (error) {
      console.error('Error fetching owned horses:', error);
      setOwnedHorses([]);
    }
  };

  const fetchAllRiders = async () => {
    try {
      const response = await ridersApi.getAll();
      setRiders(response || []);
    } catch (error) {
      console.error('Error fetching all riders:', error);
      setRiders([]);
    }
  };

  const fetchAllHorses = async () => {
    try {
      const response = await horsesApi.getAll();
      setHorses(response || []);
    } catch (error) {
      console.error('Error fetching all horses:', error);
      setHorses([]);
    }
  };

  const reload = () => {
    fetchRiderData();
  };

  return {
    // State
    rider,
    packages,
    pairings,
    ownedHorses,
    riders,
    horses,
    loading,
    error,

    // Actions
    reload,
  };
}
