import { useEffect, useState } from 'react';
import {
  ACTIVITY_STATUS_FILTERS,
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
  const [activityFilter, setActivityFilter] = useState(ACTIVITY_STATUS_FILTERS.ACTIVE);
  const [riderTypeFilter, setRiderTypeFilter] = useState(COMMON_FILTERS.ALL);

  useEffect(() => {
    loadRiders();
  }, []);

  const loadRiders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await riderService.getAll();
      setRiders(data || []);
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

  const stats = calculateRiderStats(riders);

  const filteredRiders = filterRiders(riders, {
    activityStatus: activityFilter,
    riderType: riderTypeFilter,
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
    activityFilter,
    riderTypeFilter, // ✅ Renommé
    ACTIVITY_STATUS_FILTERS,
    COMMON_FILTERS,
    setActivityFilter,
    setRiderTypeFilter, // ✅ Renommé
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
    clearSuccessMessage,
    clearError,
  };
}
