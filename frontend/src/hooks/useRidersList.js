import { useState, useEffect } from 'react';
import { ridersApi } from '../services';
import { isActive } from '../lib/helpers/shared/filters/activityFilters';
import { ACTIVITY_STATUS_FILTERS, COMMON_FILTERS } from '../lib/domains/filters';
import { calculateRiderStats, filterRiders } from '../lib/helpers/domains/riders';

/**
 * Custom hook for managing riders list data and operations
 */
export function useRidersList() {
  /* ------------------------------------------------------------------ */
  /* State                                                              */
  /* ------------------------------------------------------------------ */

  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // UI state
  const [showModal, setShowModal] = useState(false);
  const [editingRider, setEditingRider] = useState(null);
  const [selectedRiderId, setSelectedRiderId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [riderToDelete, setRiderToDelete] = useState(null);

  // Messages
  const [successMessage, setSuccessMessage] = useState('');

  // Filters
  const [activityFilter, setActivityFilter] = useState(
    ACTIVITY_STATUS_FILTERS.ACTIVE // default: actifs uniquement
  );
  const [kindFilter, setKindFilter] = useState(COMMON_FILTERS.ALL);

  /* ------------------------------------------------------------------ */
  /* Data loading                                                       */
  /* ------------------------------------------------------------------ */

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
      setError(err.message || 'Erreur lors du chargement des cavaliers');
    } finally {
      setLoading(false);
    }
  };

  /* ------------------------------------------------------------------ */
  /* CRUD actions                                                       */
  /* ------------------------------------------------------------------ */

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

  /* ------------------------------------------------------------------ */
  /* Delete logic                                                       */
  /* ------------------------------------------------------------------ */

  const handleRemoveFromInventory = async () => {
    if (!riderToDelete) return;

    try {
      const today = new Date().toISOString().split('T')[0];

      await ridersApi.update(riderToDelete.id, {
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
      await ridersApi.delete(riderToDelete.id);
      setSuccessMessage('Cavalier supprimé définitivement');
      setTimeout(() => setSuccessMessage(''), 3000);
      closeDeleteModal();
      await loadRiders();
    } catch (err) {
      setError(err.message);
      closeDeleteModal();
    }
  };

  /* ------------------------------------------------------------------ */
  /* Derived data (domain logic delegated)                               */
  /* ------------------------------------------------------------------ */

  const stats = calculateRiderStats(riders);

  const filteredRiders = filterRiders(riders, {
    activityStatus: activityFilter,
    kind: kindFilter,
  });

  /* ------------------------------------------------------------------ */
  /* Utilities                                                          */
  /* ------------------------------------------------------------------ */

  const getRiderStatus = (rider) => isActive(rider.activity_start_date, rider.activity_end_date);

  const getStatusBadge = (rider) => (getRiderStatus(rider) ? 'Actif' : 'Inactif');

  /* ------------------------------------------------------------------ */
  /* Modal handlers                                                     */
  /* ------------------------------------------------------------------ */

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

  /* ------------------------------------------------------------------ */
  /* Message helpers                                                    */
  /* ------------------------------------------------------------------ */

  const clearSuccessMessage = () => setSuccessMessage('');
  const clearError = () => setError(null);

  /* ------------------------------------------------------------------ */
  /* Public API                                                         */
  /* ------------------------------------------------------------------ */

  return {
    // Data
    riders,
    filteredRiders,
    stats,

    // UI state
    loading,
    error,
    showModal,
    editingRider,
    selectedRiderId,
    showDeleteModal,
    riderToDelete,
    successMessage,

    // Filters
    activityFilter,
    kindFilter,
    ACTIVITY_STATUS_FILTERS,
    COMMON_FILTERS,
    setActivityFilter,
    setKindFilter,

    // Actions
    handleCreate,
    handleEdit,
    handleViewDetails,
    handleDeleteClick,
    handleRemoveFromInventory,
    handlePermanentDelete,
    handleFormSubmit,

    // Modal handlers
    closeRiderModal,
    closeDeleteModal,
    closeRiderCard,

    // Utilities
    getStatusBadge,
    getRiderStatus,
    kindFilter,
    setKindFilter,

    // Message helpers
    clearSuccessMessage,
    clearError,
  };
}
