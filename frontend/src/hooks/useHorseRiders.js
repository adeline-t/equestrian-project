import { useState } from 'react';
import { horsesApi } from '../services';

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
    // Early return if no riders
    if (!horse || horse.active_riders_count === 0) {
      return;
    }

    try {
      setLoadingRiders(true);
      setShowRidersModal(true);
      setError(null);

      const data = await horsesApi.getRiders(horse.id);

      // Handle empty riders array
      if (!data || data.length === 0) {
        setSelectedHorseRiders({
          horseName: horse.name,
          riders: [],
        });
        return;
      }

      const ridersWithPairing = data.map((pairing) => ({
        ...pairing.riders,
        pairingId: pairing.id,
        pairingStartDate: pairing.pairing_start_date,
        pairingEndDate: pairing.pairing_end_date,
      }));

      setSelectedHorseRiders({
        horseName: horse.name,
        riders: ridersWithPairing,
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
    // State
    showRidersModal,
    selectedHorseRiders,
    loadingRiders,
    error,

    // Actions
    handleRidersClick,
    closeRidersModal,
  };
}
