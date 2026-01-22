import { useState } from 'react';
import { horseService } from '../services/index.js';
import { getTodayISO } from '../lib/helpers/index.js';

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

  // HorseCard modal state
  const [showHorseCard, setShowHorseCard] = useState(false);
  const [selectedHorse, setSelectedHorse] = useState(null);

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
        await horseService.update(editingHorse.id, horseData);
        onSuccess('Cheval modifié avec succès');
      } else {
        await horseService.create(horseData);
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
      await horseService.update(horseToDelete.id, {
        activity_end_date: getTodayISO(),
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
      await horseService.delete(horseToDelete.id);
      onSuccess(`${horseToDelete.name} a été supprimé définitivement`);
      closeDeleteModal();
    } catch (err) {
      throw err;
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingHorse(null);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setHorseToDelete(null);
  };

  // HorseCard modal handlers
  const openHorseCard = (horse) => {
    setSelectedHorse(horse);
    setShowHorseCard(true);
  };

  const closeHorseCard = () => {
    setShowHorseCard(false);
    setSelectedHorse(null);
  };

  return {
    // Form modal
    showModal,
    editingHorse,
    handleCreate,
    handleEdit,
    handleSubmit,
    closeModal,

    // Delete modal
    showDeleteModal,
    horseToDelete,
    handleDeleteClick,
    handleRemoveFromInventory,
    handlePermanentDelete,
    closeDeleteModal,

    // HorseCard modal
    showHorseCard,
    selectedHorse,
    openHorseCard,
    closeHorseCard,
  };
}
