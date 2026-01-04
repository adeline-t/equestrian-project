import { useState, useEffect } from 'react';
import { ridersApi } from '../services';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

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
      loadRiders();
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
      loadRiders();
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
      loadRiders();
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

  const getStats = () => {
    return {
      total: riders.length,
      active: riders.filter((r) => isActive(r.activity_start_date, r.activity_end_date)).length,
      inactive: riders.filter((r) => !isActive(r.activity_start_date, r.activity_end_date)).length,
    };
  };

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
    loading,
    error,
    showModal,
    editingRider,
    successMessage,
    selectedRiderId,
    showDeleteModal,
    riderToDelete,
    stats: getStats(),

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

    // Utility functions
    getStatusBadge,
    isActive,

    // State setters
    clearSuccessMessage,
    clearError,
  };
}
