import { useState, useEffect } from 'react';
import { ridersApi } from '../services';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { isActive } from '../lib/helpers/shared/filters';
import { ACTIVITY_STATUS_FILTERS } from '../lib/domains/filters';

/**
 * Custom hook for managing riders list data and operations
 * @returns {Object} Riders data, loading state, error, and handler functions
 */
export function useRidersList() {
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingRider, setEditingRider] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedRiderId, setSelectedRiderId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [riderToDelete, setRiderToDelete] = useState(null);
  const [filter, setFilter] = useState(ACTIVITY_STATUS_FILTERS.ALL);

  useEffect(() => {
    loadRiders();
  }, []);

  const loadRiders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ridersApi.getAll();
      setRiders(data || []);
    } catch (err) {
      setError(err.message);
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

  const handleRemoveFromInventory = async () => {
    if (!riderToDelete) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      await ridersApi.update(riderToDelete.id, {
        activity_end_date: today,
      });
      setSuccessMessage("Cavalier retiré de l'inventaire");
      setTimeout(() => setSuccessMessage(''), 3000);
      setShowDeleteModal(false);
      setRiderToDelete(null);
      await loadRiders();
    } catch (err) {
      setError(err.message);
      setShowDeleteModal(false);
      setRiderToDelete(null);
    }
  };

  const handlePermanentDelete = async () => {
    if (!riderToDelete) return;

    try {
      await ridersApi.delete(riderToDelete.id);
      setSuccessMessage('Cavalier supprimé définitivement');
      setTimeout(() => setSuccessMessage(''), 3000);
      setShowDeleteModal(false);
      setRiderToDelete(null);
      await loadRiders();
    } catch (err) {
      setError(err.message);
      setShowDeleteModal(false);
      setRiderToDelete(null);
    }
  };

  const handleFormSubmit = async (riderData) => {
    try {
      if (editingRider) {
        await ridersApi.update(editingRider.id, riderData);
        setSuccessMessage('Cavalier modifié avec succès');
      } else {
        await ridersApi.create(riderData);
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

  /**
   * Get status badge label for display
   * @param {Object} rider - Rider object
   * @returns {string} Human-readable status label
   */
  const getStatusBadge = (rider) => {
    if (!rider) return 'Inactif';
    const active = isActive(rider.activity_start_date, rider.activity_end_date);
    return active ? 'Actif' : 'Inactif';
  };

  /**
   * Get rider activity status
   * @param {Object} rider - Rider object
   * @returns {boolean} True if rider is active
   */
  const getRiderStatus = (rider) => {
    if (!rider) return false;
    return isActive(rider.activity_start_date, rider.activity_end_date);
  };

  /**
   * Get statistics about riders
   * @returns {Object} Stats object with total, active, and inactive counts
   */
  const getStats = () => {
    return {
      total: riders.length,
      active: riders.filter((r) => getRiderStatus(r)).length,
      inactive: riders.filter((r) => !getRiderStatus(r)).length,
    };
  };

  /**
   * Filter riders based on activity status
   * @returns {Array} Filtered array of riders
   */
  const filteredRiders = riders.filter((rider) => {
    if (filter === ACTIVITY_STATUS_FILTERS.ALL) return true;
    if (filter === ACTIVITY_STATUS_FILTERS.ACTIVE) return getRiderStatus(rider);
    if (filter === ACTIVITY_STATUS_FILTERS.INACTIVE) return !getRiderStatus(rider);
    return true;
  });

  // Modal handlers
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

  // Clear messages
  const clearSuccessMessage = () => setSuccessMessage('');
  const clearError = () => setError(null);

  return {
    // State
    riders,
    filteredRiders,
    loading,
    error,
    showModal,
    editingRider,
    successMessage,
    selectedRiderId,
    showDeleteModal,
    riderToDelete,
    filter,
    stats: getStats(),

    // Filter constants
    ACTIVITY_STATUS_FILTERS,

    // Actions
    handleCreate,
    handleEdit,
    handleViewDetails,
    handleDeleteClick,
    handleRemoveFromInventory,
    handlePermanentDelete,
    handleFormSubmit,
    setFilter,

    // Modal handlers
    closeRiderModal,
    closeDeleteModal,
    closeRiderCard,

    // Utility functions
    getStatusBadge,
    getRiderStatus,
    isActive,

    // State setters
    clearSuccessMessage,
    clearError,
  };
}
