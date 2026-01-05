import { useState } from 'react';
import { horsesApi } from '../services';

/**
 * Custom hook for managing horse CRUD operations
 * @param {Function} onSuccess - Callback function to execute on successful operation
 * @returns {Object} Horse action handlers and state
 */
export function useHorseActions(onSuccess) {
  const [showModal, setShowModal] = useState(false);
  const [editingHorse, setEditingHorse] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [horseToDelete, setHorseToDelete] = useState(null);

  const handleCreate = () => {
    setEditingHorse(null);
    setShowModal(true);
  };

  const handleEdit = (horse) => {
    setEditingHorse(horse);
    setShowModal(true);
  };

  const handleDeleteClick = (horse) => {
    setHorseToDelete(horse);
    setShowDeleteModal(true);
  };

  const handleSubmit = async (horseData) => {
    try {
      if (editingHorse) {
        await horsesApi.update(editingHorse.id, horseData);
        onSuccess('Cheval modifié avec succès');
      } else {
        await horsesApi.create(horseData);
        onSuccess('Cheval créé avec succès');
      }
      closeModal();
    } catch (err) {
      throw err;
    }
  };

  const handleRemoveFromInventory = async () => {
    if (!horseToDelete) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      await horsesApi.update(horseToDelete.id, {
        activity_end_date: today,
      });
      onSuccess(`${horseToDelete.name} a été retiré de l'inventaire`);
      closeDeleteModal();
    } catch (err) {
      throw err;
    }
  };

  const handlePermanentDelete = async () => {
    if (!horseToDelete) return;

    try {
      await horsesApi.delete(horseToDelete.id);
      onSuccess(`${horseToDelete.name} a été supprimé définitivement`);
      closeDeleteModal();
    } catch (err) {
      throw err;
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingHorse(null); // Clear editing state when closing
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setHorseToDelete(null);
  };

  return {
    // State
    showModal,
    editingHorse,
    showDeleteModal,
    horseToDelete,

    // Actions
    handleCreate,
    handleEdit,
    handleDeleteClick,
    handleSubmit,
    handleRemoveFromInventory,
    handlePermanentDelete,

    // Modal handlers
    closeModal,
    closeDeleteModal,
  };
}
