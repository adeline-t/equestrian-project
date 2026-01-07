import { useState, useEffect } from 'react';
import { ridersApi, packagesApi } from '../services';
import { isActive, filterActivePackages } from '../lib/helpers/shared/filters';
import {
  PACKAGE_STATUS,
  PACKAGE_STATUS_LABELS,
  getPackageStatusLabel,
} from '../lib/domains/packages/statuses';

/**
 * Custom hook for managing rider packages data and operations
 * @param {string|number} riderId - The ID of the rider
 * @returns {Object} Packages data, loading state, error, and handler functions
 */
export function useRiderPackages(riderId) {
  const [packages, setPackages] = useState([]);
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [packageToDelete, setPackageToDelete] = useState(null);

  const loadPackages = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ridersApi.getPackages(riderId);
      setPackages(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadRiders = async () => {
    try {
      const data = await ridersApi.getAll();
      setRiders(data || []);
    } catch (err) {
      console.error('Error loading riders:', err);
    }
  };

  const handleCreate = () => {
    setEditingPackage(null);
    setShowModal(true);
  };

  const handleEdit = (pkg) => {
    setEditingPackage(pkg);
    setShowModal(true);
  };

  const handleDeleteClick = (pkg) => {
    setPackageToDelete(pkg);
    setShowDeleteModal(true);
  };

  const handleRemoveFromInventory = async () => {
    if (!packageToDelete) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      await packagesApi.update(packageToDelete.id, {
        activity_end_date: today,
      });
      setSuccessMessage("Forfait retiré de l'inventaire");
      setTimeout(() => setSuccessMessage(''), 3000);
      setShowDeleteModal(false);
      setPackageToDelete(null);
      await loadPackages();
    } catch (err) {
      setError(err.message);
      setShowDeleteModal(false);
      setPackageToDelete(null);
    }
  };

  const handlePermanentDelete = async () => {
    if (!packageToDelete) return;

    try {
      await packagesApi.delete(packageToDelete.id);
      setSuccessMessage('Forfait supprimé définitivement');
      setTimeout(() => setSuccessMessage(''), 3000);
      setShowDeleteModal(false);
      setPackageToDelete(null);
      await loadPackages();
    } catch (err) {
      setError(err.message);
      setShowDeleteModal(false);
      setPackageToDelete(null);
    }
  };

  const handleFormSubmit = async (packageData) => {
    try {
      if (editingPackage) {
        await packagesApi.update(editingPackage.id, packageData);
        setSuccessMessage('Forfait modifié avec succès');
      } else {
        await packagesApi.createForRider(riderId, packageData);
        setSuccessMessage('Forfait créé avec succès');
      }
      setTimeout(() => setSuccessMessage(''), 3000);
      setShowModal(false);
      setEditingPackage(null);
      await loadPackages();
    } catch (err) {
      throw err;
    }
  };

  /**
   * Determine package status based on dates
   * @param {Object} pkg - Package object
   * @returns {string} Package status (active, expired, or suspended)
   */
  const getPackageStatus = (pkg) => {
    if (!pkg) return PACKAGE_STATUS.SUSPENDED;

    // Check if package is within active date range
    if (!isActive(pkg.activity_start_date, pkg.activity_end_date)) {
      return PACKAGE_STATUS.EXPIRED;
    }

    return PACKAGE_STATUS.ACTIVE;
  };

  /**
   * Get status badge label for display
   * @param {Object} pkg - Package object
   * @returns {string} Human-readable status label
   */
  const getStatusBadge = (pkg) => {
    const status = getPackageStatus(pkg);
    return getPackageStatusLabel(status);
  };

  // Filter active packages using helper function
  const activePackages = filterActivePackages(packages);

  // Modal handlers
  const closePackageModal = () => {
    setShowModal(false);
    setEditingPackage(null);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setPackageToDelete(null);
  };

  const clearSuccessMessage = () => {
    setSuccessMessage('');
  };

  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    if (riderId) {
      loadPackages();
      loadRiders();
    }
  }, [riderId]);

  return {
    // State
    packages,
    riders,
    loading,
    error,
    showModal,
    editingPackage,
    successMessage,
    showDeleteModal,
    packageToDelete,
    activePackages,

    // Status constants
    PACKAGE_STATUS,
    PACKAGE_STATUS_LABELS,

    // Actions
    loadPackages,
    handleCreate,
    handleEdit,
    handleDeleteClick,
    handleRemoveFromInventory,
    handlePermanentDelete,
    handleFormSubmit,

    // Modal handlers
    closePackageModal,
    closeDeleteModal,

    // Utility functions
    isActive,
    getPackageStatus,
    getStatusBadge,
    getPackageStatusLabel,

    // State setters
    clearSuccessMessage,
    clearError,
  };
}
