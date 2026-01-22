import { useState, useEffect } from 'react';
import { horseService } from '../services/index.js';
import { pairingService } from '../services/index.js';

/**
 * Custom hook for loading complete horse data with pairings for HorseCard
 * @param {number|string} horseId - The horse ID
 * @returns {Object} Horse data with pairings and state management
 */
export function useHorseCard(horseId) {
  const [horse, setHorse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pairing modal state
  const [showPairingModal, setShowPairingModal] = useState(false);
  const [editingPairing, setEditingPairing] = useState(null);
  const [showDeletePairingModal, setShowDeletePairingModal] = useState(false);
  const [pairingToDelete, setPairingToDelete] = useState(null);

  const loadHorse = async () => {
    if (!horseId) {
      setHorse(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Use getById to load horse with complete pairings data
      const data = await horseService.getById(horseId);

      if (!data) {
        setError('Cheval non trouvé');
        setHorse(null);
        return;
      }

      // Transform the data to flatten rider information in pairings
      const transformedHorse = {
        ...data,
        pairings: (data.rider_horse_pairings || []).map((pairing) => ({
          id: pairing.id,
          rider_id: pairing.riders?.id,
          rider_name: pairing.riders?.name || 'N/A',
          horse_id: data.id,
          link_type: pairing.link_type,
          loan_days: pairing.loan_days || [],
          loan_days_per_week: pairing.loan_days_per_week || 0,
          pairing_start_date: pairing.pairing_start_date,
          pairing_end_date: pairing.pairing_end_date,
        })),
      };

      // Remove the nested rider_horse_pairings to avoid confusion
      delete transformedHorse.rider_horse_pairings;

      setHorse(transformedHorse);
    } catch (err) {
      console.error('Error loading horse with pairings:', err);
      setError(err.message || 'Erreur lors du chargement du cheval');
      setHorse(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHorse();
  }, [horseId]);

  const reload = () => {
    loadHorse();
  };

  // Pairing action handlers
  const handleCreatePairing = () => {
    setEditingPairing({ horse_id: horseId });
    setShowPairingModal(true);
  };

  const handleEditPairing = (pairing) => {
    setEditingPairing(pairing);
    setShowPairingModal(true);
  };

  const handleDeletePairingClick = (pairing) => {
    setPairingToDelete(pairing);
    setShowDeletePairingModal(true);
  };

  const handlePairingSubmit = async (pairingData) => {
    try {
      if (editingPairing?.id) {
        // Update existing pairing
        await pairingService.update(editingPairing.id, pairingData);
      } else {
        // Create new pairing
        await pairingService.create(pairingData);
      }
      closePairingModal();
      await reload(); // Reload to get updated data
      return { success: true };
    } catch (err) {
      throw err;
    }
  };

  const handleDeletePairing = async () => {
    if (!pairingToDelete) return;

    try {
      await pairingService.delete(pairingToDelete.id);
      closeDeletePairingModal();
      await reload(); // Reload to get updated data
      return { success: true };
    } catch (err) {
      throw err;
    }
  };

  const closePairingModal = () => {
    setShowPairingModal(false);
    setEditingPairing(null);
  };

  const closeDeletePairingModal = () => {
    setShowDeletePairingModal(false);
    setPairingToDelete(null);
  };

  return {
    // Horse data
    horse,
    loading,
    error,
    reload,

    // Pairing modal state
    showPairingModal,
    editingPairing,
    showDeletePairingModal,
    pairingToDelete,

    // Pairing actions
    handleCreatePairing,
    handleEditPairing,
    handleDeletePairingClick,
    handlePairingSubmit,
    handleDeletePairing,
    closePairingModal,
    closeDeletePairingModal,
  };
}
