import { useState, useEffect } from 'react';
import { packagesApi, ridersApi } from '../services';

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
  const [filter, setFilter] = useState('all');
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
      console.log('📤 Form submit - Editing:', !!editingPackage);
      console.log('📤 Package data:', packageData);

      if (editingPackage) {
        console.log('🔄 Updating package ID:', editingPackage.id);
        await packagesApi.update(editingPackage.id, packageData);
        setSuccessMessage('Forfait modifié avec succès');
      } else {
        console.log('➕ Creating new package');
        await packagesApi.create(packageData);
        setSuccessMessage('Forfait créé avec succès');
      }

      setTimeout(() => setSuccessMessage(''), 3000);
      setShowModal(false);
      setEditingPackage(null);

      // Reload data after successful submission
      await loadData();
      console.log('✅ Data reloaded');
    } catch (err) {
      console.error('❌ Form submit error:', err);
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
      console.error('❌ Error removing from inventory:', err);
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

  const getRiderName = (riderId) => {
    const rider = riders.find((r) => r.id === riderId);
    return rider ? rider.name : `Cavalier #${riderId}`;
  };

  const filteredPackages = packages.filter((pkg) => {
    if (filter === 'all') return true;
    if (filter === 'active') return isActive(pkg.activity_start_date, pkg.activity_end_date);
    if (filter === 'inactive') return !isActive(pkg.activity_start_date, pkg.activity_end_date);
    return true;
  });

  const stats = {
    total: packages.length,
    active: packages.filter((p) => isActive(p.activity_start_date, p.activity_end_date)).length,
    inactive: packages.filter((p) => !isActive(p.activity_start_date, p.activity_end_date)).length,
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
    isActive,
    getStatusBadge,
    getRiderName,

    // State setters
    clearSuccessMessage,
    clearError,
  };
}
