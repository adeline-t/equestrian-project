import { useState, useEffect } from 'react';
import { horsesApi } from '../services';

/**
 * Custom hook for managing horses list data and operations
 * @returns {Object} Horses data, loading state, error, and handler functions
 */
export function useHorsesList() {
  const [horses, setHorses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingHorse, setEditingHorse] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [filter, setFilter] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [horseToDelete, setHorseToDelete] = useState(null);

  // State for riders modal
  const [showRidersModal, setShowRidersModal] = useState(false);
  const [selectedHorseRiders, setSelectedHorseRiders] = useState(null);
  const [loadingRiders, setLoadingRiders] = useState(false);

  const loadHorses = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await horsesApi.getAll();
      setHorses(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRidersClick = async (horse) => {
    if (horse.active_riders_count === 0) return;

    try {
      setLoadingRiders(true);
      setShowRidersModal(true);

      const data = await horsesApi.getRiders(horse.id);

      const ridersWithPairing = data.map((pairing) => ({
        ...pairing.riders,
        pairingId: pairing.id,
        pairingStartDate: pairing.pairing_start_date,
        pairingEndDate: pairing.pairing_end_date,
      }));

      setSelectedHorseRiders({
        horseName: horse.name,
        riders: ridersWithPairing || [],
      });
    } catch (err) {
      console.error('Error loading riders:', err);
      setError('Erreur lors du chargement des cavaliers');
      setShowRidersModal(false);
    } finally {
      setLoadingRiders(false);
    }
  };

  const handleCreate = () => {
    setEditingHorse(null);
    setShowModal(true);
  };

  const handleEdit = (horse) => {
    setEditingHorse(horse);
    setShowModal(true);
  };

  const handleDeleteClick = (horse) => {
    setHorseToDelete(horse);
    setShowDeleteModal(true);
  };

  const handleRemoveFromInventory = async () => {
    if (!horseToDelete) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      await horsesApi.update(horseToDelete.id, {
        activity_end_date: today,
      });
      setSuccessMessage(`${horseToDelete.name} a été retiré de l'inventaire`);
      setTimeout(() => setSuccessMessage(''), 3000);
      setShowDeleteModal(false);
      setHorseToDelete(null);
      loadHorses();
    } catch (err) {
      setError(err.message);
      setShowDeleteModal(false);
      setHorseToDelete(null);
    }
  };

  const handlePermanentDelete = async () => {
    if (!horseToDelete) return;

    try {
      await horsesApi.delete(horseToDelete.id);
      setSuccessMessage(`${horseToDelete.name} a été supprimé définitivement`);
      setTimeout(() => setSuccessMessage(''), 3000);
      setShowDeleteModal(false);
      setHorseToDelete(null);
      loadHorses();
    } catch (err) {
      setError(err.message);
      setShowDeleteModal(false);
      setHorseToDelete(null);
    }
  };

  const handleFormSubmit = async (horseData) => {
    try {
      if (editingHorse) {
        await horsesApi.update(editingHorse.id, horseData);
        setSuccessMessage('Cheval modifié avec succès');
      } else {
        await horsesApi.create(horseData);
        setSuccessMessage('Cheval créé avec succès');
      }
      setTimeout(() => setSuccessMessage(''), 3000);
      setShowModal(false);
      loadHorses();
    } catch (err) {
      throw err;
    }
  };

  const isActive = (startDate, endDate) => {
    const now = new Date();
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    if (start && start > now) return false;
    if (end && end < now) return false;
    return true;
  };

  const getStatusBadge = (startDate, endDate) => {
    const active = isActive(startDate, endDate);
    return active ? 'Actif' : 'Inactif';
  };

  const getKindLabel = (kind) => {
    return kind === 'horse' ? 'Cheval' : 'Poney';
  };

  const getOwnershipLabel = (ownership) => {
    return `${ownership}`;
  };

  const filteredHorses = horses.filter((horse) => {
    if (filter === 'all') return true;
    return horse.kind === filter;
  });

  const stats = {
    total: horses.length,
    horses: horses.filter((h) => h.kind === 'horse').length,
    ponies: horses.filter((h) => h.kind === 'pony').length,
    active: horses.filter((h) => isActive(h.activity_start_date, h.activity_end_date)).length,
  };

  // Modal handlers
  const closeHorseModal = () => {
    setShowModal(false);
    setEditingHorse(null);
  };

  const closeRidersModal = () => {
    setShowRidersModal(false);
    setSelectedHorseRiders(null);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setHorseToDelete(null);
  };

  const clearSuccessMessage = () => {
    setSuccessMessage('');
  };

  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    loadHorses();
  }, []);

  return {
    // State
    horses,
    loading,
    error,
    showModal,
    editingHorse,
    successMessage,
    filter,
    showDeleteModal,
    horseToDelete,
    showRidersModal,
    selectedHorseRiders,
    loadingRiders,
    filteredHorses,
    stats,

    // Actions
    loadHorses,
    handleRidersClick,
    handleCreate,
    handleEdit,
    handleDeleteClick,
    handleRemoveFromInventory,
    handlePermanentDelete,
    handleFormSubmit,
    setFilter,

    // Modal handlers
    closeHorseModal,
    closeRidersModal,
    closeDeleteModal,

    // Utility functions
    isActive,
    getStatusBadge,
    getKindLabel,
    getOwnershipLabel,

    // State setters
    clearSuccessMessage,
    clearError,
  };
}
