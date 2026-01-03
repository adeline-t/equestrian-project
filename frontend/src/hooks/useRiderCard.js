import { useState, useEffect } from 'react';
import { ridersApi, packagesApi, horsesApi } from '../services/api';

/**
 * Custom hook for managing rider card data and operations
 * @param {string|number} riderId - The ID of the rider
 * @returns {Object} Rider data, loading state, error, and reload function
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

  const loadRiderData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [riderData, packagesData, pairingsData, ridersData, horsesData] = await Promise.all([
        ridersApi.getById(riderId),
        ridersApi.getPackages(riderId),
        ridersApi.getHorses(riderId),
        ridersApi.getAll(),
        horsesApi.getAll(),
      ]);

      setRider(riderData);
      setPackages(packagesData || []);
      setPairings(pairingsData || []);
      setRiders(ridersData || []);
      setHorses(horsesData || []);

      // Filter horses owned by this rider
      const owned = (horsesData || []).filter((horse) => horse.owner_id === riderId);
      setOwnedHorses(owned);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRiderData();
  }, [riderId]);

  return {
    rider,
    packages,
    pairings,
    ownedHorses,
    riders,
    horses,
    loading,
    error,
    reload: loadRiderData,
  };
}