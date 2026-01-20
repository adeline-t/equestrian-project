import { useEffect, useState } from 'react';
import {
  calculateRiderStats,
  COMMON_FILTERS,
  filterRiders,
  isActive,
} from '../lib/helpers/index.js';
import { riderService } from '../services/index.js';

/**
 * Custom hook for managing riders list data and operations
 */
export function useRidersList() {
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingRider, setEditingRider] = useState(null);
  const [selectedRiderId, setSelectedRiderId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [riderToDelete, setRiderToDelete] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [riderTypeFilter, setRiderTypeFilter] = useState(COMMON_FILTERS.ALL);
  const [includeInactive, setIncludeInactive] = useState(false);

  useEffect(() => {
    loadRiders();
  }, []);

  const loadRiders = async () => {
    try {
      setLoading(true);
      setError(null);

      // Une seule requête qui retourne tout !
      const data = await riderService.getAllWithPairings();

      // Les données sont déjà normalisées côté backend
      // Plus besoin de Promise.all ou de transformations
      setRiders(data);
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement des cavaliers');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingRider(null);
    setShowModal(true);
  };

  const handleEdit = (rider) => {
    setEditingRider(rider);
    setShowModal(true);
  };

  const handleViewDetails = (riderId) => {
    setSelectedRiderId(riderId);
  };

  const handleDeleteClick = (rider) => {
    setRiderToDelete(rider);
    setShowDeleteModal(true);
  };

  const handleFormSubmit = async (riderData) => {
    try {
      if (editingRider) {
        await riderService.update(editingRider.id, riderData);
        setSuccessMessage('Cavalier modifié avec succès');
      } else {
        await riderService.create(riderData);
        setSuccessMessage('Cavalier créé avec succès');
      }

      setTimeout(() => setSuccessMessage(''), 3000);
      setShowModal(false);
      setEditingRider(null);
      await loadRiders();
    } catch (err) {
      throw err;
    }
  };

  const handleRemoveFromInventory = async () => {
    if (!riderToDelete) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      await riderService.update(riderToDelete.id, {
        activity_end_date: today,
      });
      setSuccessMessage("Cavalier retiré de l'inventaire");
      setTimeout(() => setSuccessMessage(''), 3000);
      closeDeleteModal();
      await loadRiders();
    } catch (err) {
      setError(err.message);
      closeDeleteModal();
    }
  };

  const handlePermanentDelete = async () => {
    if (!riderToDelete) return;

    try {
      await riderService.delete(riderToDelete.id);
      setSuccessMessage('Cavalier supprimé définitivement');
      setTimeout(() => setSuccessMessage(''), 3000);
      closeDeleteModal();
      await loadRiders();
    } catch (err) {
      setError(err.message);
      closeDeleteModal();
    }
  };

  const toggleIncludeInactive = () => {
    setIncludeInactive((prev) => !prev);
  };

  const stats = calculateRiderStats(riders);

  const filteredRiders = riders.filter((rider) => {
    const active = isActive(rider.activity_start_date, rider.activity_end_date);

    if (!includeInactive && !active) {
      return false;
    }

    if (riderTypeFilter !== COMMON_FILTERS.ALL && rider.rider_type !== riderTypeFilter) {
      return false;
    }

    return true;
  });

  const getRiderStatus = (rider) => isActive(rider.activity_start_date, rider.activity_end_date);

  const getStatusBadge = (rider) => (getRiderStatus(rider) ? 'Actif' : 'Inactif');

  const closeRiderModal = () => {
    setShowModal(false);
    setEditingRider(null);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setRiderToDelete(null);
  };

  const closeRiderCard = () => {
    setSelectedRiderId(null);
  };

  const clearSuccessMessage = () => setSuccessMessage('');
  const clearError = () => setError(null);

  /**
   * Retourne la liste unique des jours de tous les pairings d’un cavalier
   */
  const getRiderPairingDays = (rider) => {
    if (!rider.pairings || rider.pairings.length === 0) {
      return [];
    }

    const daysSet = new Set();

    rider.pairings.forEach((pairing) => {
      const days = pairing.days || pairing.loan_days || [];
      days.forEach((day) => daysSet.add(day));
    });

    return Array.from(daysSet);
  };

  return {
    riders,
    filteredRiders,
    stats,
    loading,
    error,
    showModal,
    editingRider,
    selectedRiderId,
    showDeleteModal,
    riderToDelete,
    successMessage,
    riderTypeFilter,
    COMMON_FILTERS,
    includeInactive,
    toggleIncludeInactive,
    setRiderTypeFilter,
    handleCreate,
    handleEdit,
    handleViewDetails,
    handleDeleteClick,
    handleRemoveFromInventory,
    handlePermanentDelete,
    handleFormSubmit,
    closeRiderModal,
    closeDeleteModal,
    closeRiderCard,
    getStatusBadge,
    getRiderStatus,
    getRiderPairingDays,
    clearSuccessMessage,
    clearError,
  };
}
