import { useState } from 'react';
import { packageService } from '../services/index.js';

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
      let result;
      if (editingPackage) {
        // Soft delete old package
        await packageService.delete(editingPackage.id);

        // Create new
        result = await packageService.createForRider(riderId, packageData);

        onSuccess('Forfait modifié avec succès');
        setShowPackageModal(false);
        setEditingPackage(null);
        return result;
      }

      // Create
      result = await packageService.createForRider(riderId, packageData);

      onSuccess('Forfait créé avec succès');
      setShowPackageModal(false);
      return result;
    } catch (err) {
      // Rethrow error for parent handling
      throw err;
    }
  };

  const handlePermanentDelete = async () => {
    if (!packageToDelete) return;

    try {
      await packageService.delete(packageToDelete.id);
      onSuccess('Forfait supprimé');
      setShowDeleteModal(false);
      setPackageToDelete(null);
    } catch (err) {
      throw err;
    }
  };

  const closeModal = () => {
    setShowPackageModal(false);
    setEditingPackage(null);
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
    handlePermanentDelete,
    closeModal,
    closeDeleteModal,
  };
}
