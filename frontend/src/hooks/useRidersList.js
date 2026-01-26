import { useEffect, useState } from 'react';
import riderService from '../services/riderService';
import { calculateRiderStats, filterRiders } from '../lib/helpers';
import { COMMON_FILTERS } from '../lib/helpers/filters/activityFilters';

/**
 * Hook pour gérer la liste des cavaliers, filtres, stats et opérations CRUD
 */
export function useRidersList() {
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [editingRider, setEditingRider] = useState(null);
  const [selectedRiderId, setSelectedRiderId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [riderToDelete, setRiderToDelete] = useState(null);

  const [riderTypeFilter, setRiderTypeFilter] = useState(COMMON_FILTERS.ALL);
  const [includeInactive, setIncludeInactive] = useState(false);

  useEffect(() => {
    loadRiders();
  }, []);

  const loadRiders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await riderService.getAllWithPairings();
      setRiders(data || []);
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement des cavaliers');
    } finally {
      setLoading(false);
    }
  };

  const filteredRiders = filterRiders(riders, { riderType: riderTypeFilter, includeInactive });
  const stats = calculateRiderStats(riders);
  const toggleIncludeInactive = () => setIncludeInactive((prev) => !prev);

  // CRUD
  const handleCreate = () => {
    setEditingRider(null);
    setShowModal(true);
  };
  const handleEdit = (rider) => {
    setEditingRider(rider);
    setShowModal(true);
  };
  const handleViewDetails = (riderId) => setSelectedRiderId(riderId);

  const handleDeleteClick = (rider) => {
    setRiderToDelete(rider);
    setShowDeleteModal(true);
  };
  const handleRemoveFromInventory = async () => {
    if (!riderToDelete) return;
    try {
      const today = new Date().toISOString().split('T')[0];
      await riderService.update(riderToDelete.id, { activity_end_date: today });
      setSelectedRiderId(null);
      setSuccessMessage("Cavalier retiré de l'inventaire");
      setShowDeleteModal(false);
      await loadRiders();
    } catch (err) {
      setError(err.message);
      setShowDeleteModal(false);
    }
  };
  const handlePermanentDelete = async () => {
    if (!riderToDelete) return;
    try {
      await riderService.delete(riderToDelete.id);
      setSelectedRiderId(null);
      setSuccessMessage('Cavalier supprimé définitivement');
      setShowDeleteModal(false);
      await loadRiders();
    } catch (err) {
      setError(err.message);
      setShowDeleteModal(false);
    }
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
      setShowModal(false);
      setEditingRider(null);
      await loadRiders();
    } catch (err) {
      const message = err.message || 'Erreur lors de la sauvegarde';
      setError(message);
      throw new Error(message);
    }
  };

  const handleSuccess = async () => {
    await loadRiders();
  };

  // Modales
  const closeRiderModal = () => {
    setShowModal(false);
    setEditingRider(null);
  };
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setRiderToDelete(null);
  };
  const closeRiderCard = () => setSelectedRiderId(null);

  const getRiderPairingDays = (rider) => {
    if (!rider.pairings?.length) return [];
    const daysSet = new Set();
    rider.pairings.forEach((pairing) => {
      const days = pairing.days || pairing.loan_days || [];
      days.forEach((day) => daysSet.add(day));
    });
    return Array.from(daysSet);
  };

  const clearSuccessMessage = () => setSuccessMessage('');
  const clearError = () => setError(null);

  return {
    riders,
    filteredRiders,
    stats,
    loading,
    error,
    successMessage,

    showModal,
    editingRider,
    selectedRiderId,
    showDeleteModal,
    riderToDelete,

    riderTypeFilter,
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
    handleSuccess,

    closeRiderModal,
    closeDeleteModal,
    closeRiderCard,
    getRiderPairingDays,
    clearSuccessMessage,
    clearError,
  };
}
