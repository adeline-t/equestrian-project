import { useState } from 'react';
import { horseService } from '../services/index.js';

/**
 * Custom hook for managing horse riders modal
 * @returns {Object} Riders modal state and handlers
 */
export function useHorseRiders() {
  const [showRidersModal, setShowRidersModal] = useState(false);
  const [selectedHorseRiders, setSelectedHorseRiders] = useState(null);
  const [loadingRiders, setLoadingRiders] = useState(false);
  const [error, setError] = useState(null);

  const handleRidersClick = async (horse) => {
    if (!horse || horse.active_riders_count === 0) {
      return;
    }

    try {
      setLoadingRiders(true);
      setShowRidersModal(true);
      setError(null);

      const data = await horseService.getRiders(horse.id);

      if (!data || data.length === 0) {
        setSelectedHorseRiders({
          horseName: horse.name,
          riders: [],
        });
        return;
      }

      // ✅ MODIFICATION : Garder la structure complète du pairing
      // Le RidersModal attend maintenant un tableau de pairings complets
      // avec link_type, loan_days, et riders nested
      setSelectedHorseRiders({
        horseName: horse.name,
        riders: data, // Passe les pairings complets (pas aplati)
      });
    } catch (err) {
      console.error('Error loading riders:', err);
      setError(err.message || 'Erreur lors du chargement des cavaliers');
      setShowRidersModal(false);
    } finally {
      setLoadingRiders(false);
    }
  };

  const closeRidersModal = () => {
    setShowRidersModal(false);
    setSelectedHorseRiders(null);
    setError(null);
  };

  return {
    showRidersModal,
    selectedHorseRiders,
    loadingRiders,
    error,
    handleRidersClick,
    closeRidersModal,
  };
}
