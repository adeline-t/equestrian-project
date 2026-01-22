import { useState, useEffect } from 'react';
import { riderService, horseService } from '../services/index.js';

/**
 * Custom hook for managing rider card data and operations
 * @param {number} riderId - The rider ID
 * @returns {Object} Rider data, loading state, error, and handler functions
 */
export function useRiderCard(riderId) {
  const [rider, setRider] = useState(null);
  const [packages, setPackages] = useState([]);
  const [pairings, setPairings] = useState([]);
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

      const riderResponse = await riderService.getById(riderId);
      setRider(riderResponse);

      await Promise.all([fetchPackages(), fetchPairings(), fetchAllRiders(), fetchAllHorses()]);
    } catch (error) {
      console.error('❌ Error fetching rider data:', error);
      setError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const fetchPackages = async () => {
    try {
      const data = await riderService.getPackages(riderId);
      console.log('📦 Packages fetched:', data);

      // Filter out deleted packages client-side if needed
      const activePackages = Array.isArray(data) ? data.filter((pkg) => !pkg.deleted_at) : [];

      setPackages(activePackages);

      if (activePackages.length > 0) {
        console.log(
          '✅ Active package:',
          activePackages.find((pkg) => pkg.is_active)
        );
      }
    } catch (error) {
      console.error('❌ Error fetching packages:', error);
      setPackages([]);
    }
  };

  const fetchPairings = async () => {
    try {
      const data = await riderService.getHorses(riderId);
      console.log('🐴 Pairings fetched:', data);
      setPairings(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('❌ Error fetching pairings:', error);
      setPairings([]);
    }
  };

  const fetchAllRiders = async () => {
    try {
      const response = await riderService.getAll();
      setRiders(response || []);
    } catch (error) {
      console.error('❌ Error fetching all riders:', error);
      setRiders([]);
    }
  };

  const fetchAllHorses = async () => {
    try {
      const response = await horseService.getAll();
      setHorses(response || []);
    } catch (error) {
      console.error('❌ Error fetching all horses:', error);
      setHorses([]);
    }
  };

  const reload = () => {
    console.log('🔄 Reloading rider data...');
    fetchRiderData();
  };

  return {
    rider,
    packages,
    pairings,
    riders,
    horses,
    loading,
    error,
    reload,
  };
}
