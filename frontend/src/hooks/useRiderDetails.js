import { useState, useEffect, useCallback } from 'react';
import riderService from '../services/riderService.js';
import { isActive } from '../lib/helpers/index.js';

/**
 * useRiderDetails
 * Charge toutes les données pertinentes pour un cavalier :
 * - informations du cavalier
 * - forfait actif (le plus récent)
 * - pairings actifs
 * - chevaux liés
 */
export function useRiderDetails(riderId) {
  const [rider, setRider] = useState(null);
  const [packages, setPackages] = useState([]);
  const [pairings, setPairings] = useState([]);
  const [horses, setHorses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Fonction principale pour fetch les données ---
  const fetchRiderDetails = useCallback(async () => {
    if (!riderId) {
      setError('Rider ID manquant');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const riderData = await riderService.getById(riderId);
      if (!riderData) throw new Error('Cavalier non trouvé');
      console.info('Rider :', riderData);

      setRider(riderData);

      // Packages actifs et non supprimés
      const activePkg = (riderData.packages || []).filter((pkg) => pkg.is_active);
      setPackages(activePkg);

      // Pairings actifs
      const activePair = (riderData.rider_horse_pairings || []).filter((p) =>
        isActive(p.pairing_start_date, p.pairing_end_date)
      );
      setPairings(activePair);
      console.log('activePairing', activePair);

      // Extraire chevaux liés aux pairings
      const horseList = activePair.map((p) => p.horses).filter(Boolean);
      console.log('horseList :', horseList);
      setHorses(horseList);
    } catch (err) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  }, [riderId]);

  // --- useEffect pour trigger fetch au montage ou riderId change ---
  useEffect(() => {
    fetchRiderDetails();
  }, [fetchRiderDetails]);

  // --- Fonction reload exposée au composant ---
  const reload = useCallback(() => {
    fetchRiderDetails();
  }, [fetchRiderDetails]);

  // --- Computed values ---
  const activePackage = packages[0] || null;
  const activePairings = pairings;

  return {
    rider,
    horses,
    activePackage,
    activePairings,
    loading,
    error,
    reload,
  };
}
