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

      const response = await horseService.getRiders(horse.id);

      // ✅ L'API retourne { data: { horse_data, pairings: [...] } }
      // On veut récupérer les pairings qui sont dans data.pairings
      const horseData = response.data || response;
      const ridersArray = Array.isArray(horseData.pairings) ? horseData.pairings : [];

      setSelectedHorseRiders({
        horseName: horse.name,
        riders: ridersArray, // Maintenant c'est un tableau de pairings
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
