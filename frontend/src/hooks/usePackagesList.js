import { useState, useEffect } from 'react';
import { packagesApi, ridersApi } from '../services';
import {
  PACKAGE_STATUS,
  getPackageStatusLabel,
  isPackageActive,
  isPackageExpired,
} from '../lib/domains/packages/statuses';
import { isActive } from '../lib/helpers/shared/filters';

/**
 * Custom hook for managing packages list data and operations
 * @returns {Object} Packages data, loading state, error, and handler functions
 */
export function usePackagesList() {
  const [packages, setPackages] = useState([]);
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [filter, setFilter] = useState(PACKAGE_STATUS.ACTIVE);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [packageToDelete, setPackageToDelete] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [packagesData, ridersData] = await Promise.all([
        packagesApi.getAll(),
        ridersApi.getAll(),
      ]);
      setPackages(packagesData || []);
      setRiders(ridersData || []);
    } catch (err) {
      console.error('❌ Error loading data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingPackage(null);
    setShowModal(true);
  };

  const handleEdit = (pkg) => {
    console.log('📝 Editing package:', pkg);
    setEditingPackage(pkg);
    setShowModal(true);
  };

  const handleDeleteClick = (pkg) => {
    setPackageToDelete(pkg);
    setShowDeleteModal(true);
  };

  const handleFormSubmit = async (packageData) => {
    try {
      if (editingPackage) {
        await packagesApi.update(editingPackage.id, packageData);
        setSuccessMessage('Forfait modifié avec succès');
      } else {
        await packagesApi.create(packageData);
        setSuccessMessage('Forfait créé avec succès');
      }

      setTimeout(() => setSuccessMessage(''), 3000);
      setShowModal(false);
      setEditingPackage(null);

      // Reload data after successful submission
      await loadData();
    } catch (err) {
      setError(err.message || 'Une erreur est survenue');
      throw err;
    }
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
      await loadData();
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
      await loadData();
    } catch (err) {
      console.error('❌ Error deleting package:', err);
      setError(err.message);
      setShowDeleteModal(false);
      setPackageToDelete(null);
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

  const getRiderName = (riderId) => {
    const rider = riders.find((r) => r.id === riderId);
    return rider ? rider.name : `Cavalier #${riderId}`;
  };

  const filteredPackages = packages.filter((pkg) => {
    const status = getPackageStatus(pkg);

    if (filter === 'all') return true;
    if (filter === PACKAGE_STATUS.ACTIVE) return status === PACKAGE_STATUS.ACTIVE;
    if (filter === PACKAGE_STATUS.EXPIRED) return status === PACKAGE_STATUS.EXPIRED;
    if (filter === PACKAGE_STATUS.SUSPENDED) return status === PACKAGE_STATUS.SUSPENDED;

    return true;
  });

  const stats = {
    total: packages.length,
    active: packages.filter((p) => getPackageStatus(p) === PACKAGE_STATUS.ACTIVE).length,
    expired: packages.filter((p) => getPackageStatus(p) === PACKAGE_STATUS.EXPIRED).length,
    suspended: packages.filter((p) => getPackageStatus(p) === PACKAGE_STATUS.SUSPENDED).length,
  };

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
    loadData();
  }, []);

  return {
    // State
    packages,
    riders,
    loading,
    error,
    showModal,
    editingPackage,
    successMessage,
    filter,
    showDeleteModal,
    packageToDelete,
    filteredPackages,
    stats,

    // Status constants
    PACKAGE_STATUS,

    // Actions
    loadData,
    handleCreate,
    handleEdit,
    handleDeleteClick,
    handleRemoveFromInventory,
    handlePermanentDelete,
    handleFormSubmit,
    setFilter,

    // Modal handlers
    closePackageModal,
    closeDeleteModal,

    // Utility functions
    getPackageStatus,
    getStatusBadge,
    getRiderName,
    isPackageActive,
    isPackageExpired,

    // State setters
    clearSuccessMessage,
    clearError,
  };
}
