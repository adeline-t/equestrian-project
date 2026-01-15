import { useState } from 'react';
import { packageService } from '../services/index.js';

/**
 * Custom hook for managing package actions (create, edit, delete)
 * @param {Function} onSuccess - Callback function called on successful operation
 * @returns {Object} Package actions state and handlers
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

  /**
   * Submit package form (create or update)
   * @param {number} riderId - The rider ID
   * @param {Object} packageData - Package form data
   */
  const handleSubmit = async (riderId, packageData) => {
    try {
      if (editingPackage) {
        // Update existing package
        await packageService.update(editingPackage.id, packageData);
        onSuccess?.('Forfait modifié avec succès');
      } else {
        // Create new package
        // ✅ CORRECTION: Inclure rider_id dans packageData
        const dataWithRider = {
          ...packageData,
          rider_id: riderId,
        };
        await packageService.create(dataWithRider);
        onSuccess?.('Forfait créé avec succès');
      }
      closeModal();
    } catch (error) {
      console.error('❌ Error submitting package:', error);
      throw error;
    }
  };

  const handleRemoveFromInventory = async () => {
    if (!packageToDelete) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      await packageService.update(packageToDelete.id, {
        activity_end_date: today,
      });
      onSuccess?.("Forfait retiré de l'inventaire");
      closeDeleteModal();
    } catch (error) {
      console.error('❌ Error removing package from inventory:', error);
      throw error;
    }
  };

  const handlePermanentDelete = async () => {
    if (!packageToDelete) return;

    try {
      await packageService.delete(packageToDelete.id);
      onSuccess?.('Forfait supprimé définitivement');
      closeDeleteModal();
    } catch (error) {
      console.error('❌ Error deleting package:', error);
      throw error;
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
    handleRemoveFromInventory,
    handlePermanentDelete,
    closeModal,
    closeDeleteModal,
  };
}
