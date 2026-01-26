import { useState, useEffect } from 'react';
import { horseService, pairingService, riderService } from '../services';

export function useHorseCard(horseId) {
  const [fetchedHorse, setFetchedHorse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(null);

  // Pairing modal state
  const [showPairingModal, setShowPairingModal] = useState(false);
  const [editingPairing, setEditingPairing] = useState(null);
  const [showDeletePairingModal, setShowDeletePairingModal] = useState(false);
  const [pairingToDelete, setPairingToDelete] = useState(null);

  // Riders for pairing form
  const [riders, setRiders] = useState([]);
  const [loadingRiders, setLoadingRiders] = useState(false);

  const loadHorse = async () => {
    if (!horseId) return setFetchedHorse(null);

    try {
      setLoading(true);
      setLoadError(null);
      const data = await horseService.getById(horseId);

      if (!data) {
        setLoadError('Cheval non trouvé');
        setFetchedHorse(null);
        return;
      }

      const transformedHorse = {
        ...data,
        pairings: (data.rider_horse_pairings || []).map((p) => ({
          id: p.id,
          rider_id: p.riders?.id,
          rider_name: p.riders?.name || 'N/A',
          horse_id: data.id,
          link_type: p.link_type,
          loan_days: p.loan_days || [],
          loan_days_per_week: p.loan_days_per_week || 0,
          pairing_start_date: p.pairing_start_date,
          pairing_end_date: p.pairing_end_date,
        })),
      };

      delete transformedHorse.rider_horse_pairings;
      setFetchedHorse(transformedHorse);
    } catch (err) {
      setLoadError(err.message || 'Erreur lors du chargement du cheval');
      setFetchedHorse(null);
    } finally {
      setLoading(false);
    }
  };

  const loadRiders = async () => {
    try {
      setLoadingRiders(true);
      const data = await riderService.getAll();
      setRiders(data || []);
    } catch (err) {
      console.error('Error loading riders:', err);
      setRiders([]);
    } finally {
      setLoadingRiders(false);
    }
  };

  useEffect(() => {
    loadHorse();
  }, [horseId]);

  // Load riders when pairing modal opens
  useEffect(() => {
    if (showPairingModal) {
      loadRiders();
    }
  }, [showPairingModal]);

  const reload = () => loadHorse();

  // Pairing modal actions
  const handleCreatePairing = () => {
    setEditingPairing(null);
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
        await pairingService.update(editingPairing.id, pairingData);
      } else {
        await pairingService.create(pairingData);
      }
      closePairingModal();
      await reload();
    } catch (err) {
      throw err; // Propagate to HorseCard for error handling
    }
  };

  const handleDeletePairing = async () => {
    if (!pairingToDelete) return;

    try {
      await pairingService.delete(pairingToDelete.id);
      closeDeletePairingModal();
      await reload();
    } catch (err) {
      throw err; // Propagate to HorseCard for error handling
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
    fetchedHorse,
    loading,
    loadError,
    reload,
    // Pairing modal state
    showPairingModal,
    editingPairing,
    showDeletePairingModal,
    pairingToDelete,
    // Riders data
    riders,
    loadingRiders,
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
