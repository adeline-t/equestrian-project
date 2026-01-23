import { useState } from 'react';
import { calendarService } from '../services/calendarService'; // utilise ton service existant

/**
 * Hook to manage event participant CRUD operations
 * @param {Function} onSuccess - callback on success
 * @returns {Object} actions & state
 */
export function useEventParticipantActions(onSuccess) {
  const [showModal, setShowModal] = useState(false);
  const [editingParticipant, setEditingParticipant] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [participantToDelete, setParticipantToDelete] = useState(null);

  // Open modal to add participant
  const handleCreate = () => {
    setEditingParticipant(null);
    setShowModal(true);
  };

  // Open modal to edit participant
  const handleEdit = (participant) => {
    setEditingParticipant(participant);
    setShowModal(true);
  };

  // Open delete confirmation
  const handleDeleteClick = (participant) => {
    setParticipantToDelete(participant);
    setShowDeleteModal(true);
  };

  // Add or update participant using calendarService
  const handleSubmit = async (slotId, riderId, horseId) => {
    try {
      const payload = {
        planning_slot_id: slotId,
        rider_id: riderId,
        horse_id: horseId,
        horse_assignment_type: 'manual',
      };

      if (editingParticipant) {
        await calendarService.updateParticipant(editingParticipant.id, payload);
        onSuccess?.('Participant modifié avec succès');
      } else {
        await calendarService.addParticipant(payload);
        onSuccess?.('Participant ajouté avec succès');
      }

      setShowModal(false);
      setEditingParticipant(null);
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  // Remove participant using calendarService
  const handleRemove = async (participantToDeleteId) => {
    try {
      await calendarService.removeParticipant(participantToDeleteId);
      onSuccess?.('Participant supprimé');
      setShowDeleteModal(false);
      setParticipantToDelete(null);
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingParticipant(null);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setParticipantToDelete(null);
  };

  return {
    showModal,
    editingParticipant,
    showDeleteModal,
    participantToDelete,
    setShowDeleteModal,
    handleCreate,
    handleEdit,
    handleDeleteClick,
    handleSubmit,
    handleRemove,
    closeModal,
    closeDeleteModal,
  };
}
