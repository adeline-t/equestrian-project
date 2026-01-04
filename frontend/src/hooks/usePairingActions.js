import { useState } from 'react';

/**
 * Custom hook for managing pairing CRUD operations
 * @param {Function} onSuccess - Callback function to execute on successful operation
 * @returns {Object} Pairing action handlers and state
 */
export function usePairingActions(onSuccess) {
  const [showPairingModal, setShowPairingModal] = useState(false);
  const [editingPairing, setEditingPairing] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [pairingToDelete, setPairingToDelete] = useState(null);

  const handleCreate = () => {
    setEditingPairing(null);
    setShowPairingModal(true);
  };

  const handleEdit = (pairing) => {
    setEditingPairing(pairing);
    setShowPairingModal(true);
  };

  const handleDeleteClick = (pairing) => {
    setPairingToDelete(pairing);
    setShowDeleteModal(true);
  };

  const handleSubmit = async (riderId, pairingData) => {
    try {
      const pairingsApi = await import('../services').then((m) => m.pairingsApi);

      if (editingPairing) {
        await pairingsApi.update(editingPairing.id, pairingData);
        onSuccess('Pension modifiée avec succès');
      } else {
        await pairingsApi.create({ ...pairingData, rider_id: riderId });
        onSuccess('Pension créée avec succès');
      }
      setShowPairingModal(false);
    } catch (err) {
      throw err;
    }
  };

  const handleRemoveFromInventory = async () => {
    if (!pairingToDelete) return;

    try {
      const pairingsApi = await import('../services').then((m) => m.pairingsApi);
      const today = new Date().toISOString().split('T')[0];
      await pairingsApi.update(pairingToDelete.id, {
        pairing_end_date: today,
      });
      onSuccess("Pension retirée de l'inventaire");
      setShowDeleteModal(false);
      setPairingToDelete(null);
    } catch (err) {
      throw err;
    }
  };

  const handlePermanentDelete = async () => {
    if (!pairingToDelete) return;

    try {
      const pairingsApi = await import('../services').then((m) => m.pairingsApi);
      await pairingsApi.delete(pairingToDelete.id);
      onSuccess('Pension supprimée définitivement');
      setShowDeleteModal(false);
      setPairingToDelete(null);
    } catch (err) {
      throw err;
    }
  };

  const closeModal = () => {
    setShowPairingModal(false);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setPairingToDelete(null);
  };

  return {
    showPairingModal,
    editingPairing,
    showDeleteModal,
    pairingToDelete,
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