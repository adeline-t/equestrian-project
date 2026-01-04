import { useState } from 'react';
import { packagesApi } from '../services';

/**
 * Custom hook for managing package CRUD operations
 * @param {Function} onSuccess - Callback function to execute on successful operation
 * @returns {Object} Package action handlers and state
 */
export function usePackageActions(onSuccess) {
  const [showPackageModal, setShowPackageModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [packageToDelete, setPackageToDelete] = useState(null);

  const handleCreate = () => {
    setEditingPackage(null);
    setShowPackageModal(true);
  };

  const handleEdit = (pkg) => {
    setEditingPackage(pkg);
    setShowPackageModal(true);
  };

  const handleDeleteClick = (pkg) => {
    setPackageToDelete(pkg);
    setShowDeleteModal(true);
  };

  const handleSubmit = async (riderId, packageData) => {
    try {
      if (editingPackage) {
        await packagesApi.update(editingPackage.id, packageData);
        onSuccess('Forfait modifié avec succès');
      } else {
        await packagesApi.createForRider(riderId, packageData);
        onSuccess('Forfait créé avec succès');
      }
      setShowPackageModal(false);
    } catch (err) {
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
      onSuccess("Forfait retiré de l'inventaire");
      setShowDeleteModal(false);
      setPackageToDelete(null);
    } catch (err) {
      throw err;
    }
  };

  const handlePermanentDelete = async () => {
    if (!packageToDelete) return;

    try {
      await packagesApi.delete(packageToDelete.id);
      onSuccess('Forfait supprimé définitivement');
      setShowDeleteModal(false);
      setPackageToDelete(null);
    } catch (err) {
      throw err;
    }
  };

  const closeModal = () => {
    setShowPackageModal(false);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setPackageToDelete(null);
  };

  return {
    showPackageModal,
    editingPackage,
    showDeleteModal,
    packageToDelete,
    handleCreate,
    handleEdit,
    handleDeleteClick,
    handleSubmit,
    handleRemoveFromInventory,
    handlePermanentDelete,
    closeModal,
    closeDeleteModal,
  };
}