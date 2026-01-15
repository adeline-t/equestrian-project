import { useState } from 'react';
import pairingService from '../services/pairingService.js';
import { RIDER_HORSE_LINK_TYPE } from '../lib/domain/pairings.js';

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
      // Défaut link_type selon le rider
      const payload = {
        ...pairingData,
        rider_id: riderId,
        link_type: pairingData.link_type ?? RIDER_HORSE_LINK_TYPE.OWN,
      };

      // Validation frontend minimale : loan_days_per_week et loan_days uniquement pour 'loan'
      if (payload.link_type === RIDER_HORSE_LINK_TYPE.LOAN) {
        if (
          payload.loan_days_per_week != null &&
          (payload.loan_days_per_week < 1 || payload.loan_days_per_week > 7)
        ) {
          throw new Error('loan_days_per_week doit être un entier entre 1 et 7');
        }
        if (payload.loan_days && !Array.isArray(payload.loan_days)) {
          throw new Error('loan_days doit être un tableau de jours valides');
        }
      } else {
        delete payload.loan_days_per_week;
        delete payload.loan_days;
      }

      if (editingPairing) {
        await pairingService.update(editingPairing.id, payload);
        onSuccess('Pension modifiée avec succès');
      } else {
        await pairingService.create(payload);
        onSuccess('Pension créée avec succès');
      }

      setShowPairingModal(false);
      setEditingPairing(null);
    } catch (err) {
      throw err;
    }
  };

  const handleRemoveFromInventory = async () => {
    if (!pairingToDelete) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      await pairingService.update(pairingToDelete.id, { pairing_end_date: today });
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
      await pairingService.delete(pairingToDelete.id);
      onSuccess('Pension supprimée définitivement');
      setShowDeleteModal(false);
      setPairingToDelete(null);
    } catch (err) {
      throw err;
    }
  };

  const closeModal = () => {
    setShowPairingModal(false);
    setEditingPairing(null);
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
