import { useState, useEffect } from 'react';
import { packagesApi, ridersApi } from '../services';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

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
  const [filter, setFilter] = useState('all'); // all, active, inactive
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [packageToDelete, setPackageToDelete] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      // Load both packages and riders for the form
      const [packagesData, ridersData] = await Promise.all([
        packagesApi.getAll(),
        ridersApi.getAll(),
      ]);
      setPackages(packagesData || []);
      setRiders(ridersData || []);
    } catch (err) {
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
      setSuccessMessage('Forfait retiré de l\'inventaire');
      setTimeout(() => setSuccessMessage(''), 3000);
      setShowDeleteModal(false);
      setPackageToDelete(null);
      loadData();
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
      loadData();
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
        await packagesApi.create(packageData);
        setSuccessMessage('Forfait créé avec succès');
      }
      setTimeout(() => setSuccessMessage(''), 3000);
      setShowModal(false);
      loadData();
    } catch (err) {
      throw err;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: fr });
    } catch {
      return dateString;
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
    const rider = riders.find(r => r.id === riderId);
    return rider ? rider.name : `Cavalier #${riderId}`;
  };

  // Filter packages based on selected filter
  const filteredPackages = packages.filter((pkg) => {
    if (filter === 'all') return true;
    if (filter === 'active') return isActive(pkg.activity_start_date, pkg.activity_end_date);
    if (filter === 'inactive') return !isActive(pkg.activity_start_date, pkg.activity_end_date);
    return true;
  });

  const stats = {
    total: packages.length,
    active: packages.filter(p => isActive(p.activity_start_date, p.activity_end_date)).length,
    inactive: packages.filter(p => !isActive(p.activity_start_date, p.activity_end_date)).length,
  };

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
    formatDate,
    isActive,
    getStatusBadge,
    getRiderName,
    
    // State setters
    clearSuccessMessage,
    clearError
  };
}