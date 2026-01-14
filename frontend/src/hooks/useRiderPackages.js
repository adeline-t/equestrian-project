import { useEffect, useState } from 'react';
import { PACKAGE_STATUS, PACKAGE_STATUS_LABELS } from '../lib/domain/packages.js';
import { filterActivePackages, getPackageStatusLabel, isActive } from '../lib/helpers/index.js';
import { packageService, riderService } from '../services/index.js';

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
      const data = await riderService.getPackages(riderId);
      setPackages(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadRiders = async () => {
    try {
      const data = await riderService.getAll();
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
      await packageService.update(packageToDelete.id, {
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
      await packageService.delete(packageToDelete.id);
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
        await packageService.update(editingPackage.id, packageData);
        setSuccessMessage('Forfait modifié avec succès');
      } else {
        await packageService.createForRider(riderId, packageData);
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

  const getPackageStatus = (pkg) => {
    if (!pkg) return PACKAGE_STATUS.INACTIVE;
    if (!isActive(pkg.activity_start_date, pkg.activity_end_date)) {
      return PACKAGE_STATUS.EXPIRED;
    }
    return PACKAGE_STATUS.ACTIVE;
  };

  const getStatusBadge = (pkg) => {
    const status = getPackageStatus(pkg);
    return getPackageStatusLabel(status);
  };

  const activePackages = filterActivePackages(packages);

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
    PACKAGE_STATUS,
    PACKAGE_STATUS_LABELS,
    loadPackages,
    handleCreate,
    handleEdit,
    handleDeleteClick,
    handleRemoveFromInventory,
    handlePermanentDelete,
    handleFormSubmit,
    closePackageModal,
    closeDeleteModal,
    isActive,
    getPackageStatus,
    getStatusBadge,
    getPackageStatusLabel,
    clearSuccessMessage,
    clearError,
  };
}
