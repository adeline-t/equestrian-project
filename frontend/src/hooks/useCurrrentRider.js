import { useState, useEffect } from 'react';
import { useAppMode } from '../context/AppMode';
import riderService from '../services/riderService';
import { isActive } from '../lib/helpers';

/**
 * Hook pour gérer le rider courant via AppMode et fournir la liste des riders actifs
 */
export function useCurrentRider() {
  const { currentRider, selectRider } = useAppMode();
  const [activeRiders, setActiveRiders] = useState([]);
  const [loading, setLoading] = useState(false);

  // Charge la liste des riders actifs
  useEffect(() => {
    setLoading(true);
    riderService
      .getAll()
      .then((riders) => {
        // On filtre sur les riders actifs (pas de date de fin ou fin dans le futur)
        const today = new Date();
        const actifs = riders.filter((r) => isActive(r.activity_start_date, r.activity_end_date));
        setActiveRiders(actifs);
      })
      .catch((err) => {
        console.error('Erreur lors du chargement des cavaliers :', err);
        setActiveRiders([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const clearRider = () => {
    selectRider(null); // AppMode gère le localStorage
  };

  return {
    rider: currentRider,
    selectRider,
    clearRider,
    activeRiders,
    loading,
  };
}
