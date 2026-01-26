import { useState } from 'react';
import { OWNER_TYPES, RIDER_HORSE_LINK_TYPE } from '../lib/domain/index.js';
import { getTodayISO } from '../lib/helpers/index.js';
import pairingService from '../services/pairingService.js';

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
    console.log('create pairing');
    setEditingPairing(null);
    setShowPairingModal(true);
  };

  const handleEdit = (pairing) => {
    console.log('edit pairing :', pairing);
    const pairingWithDays = {
      ...pairing,
      loan_days: pairing.loan_days || [],
    };
    setEditingPairing(pairingWithDays);
    setShowPairingModal(true);
  };

  const handleDeleteClick = (pairing) => {
    setPairingToDelete(pairing);
    setShowDeleteModal(true);
  };

  const handleSubmit = async (riderId, pairingData) => {
    try {
      // Default link_type based on rider
      const payload = {
        rider_id: riderId,
        horse_id: pairingData.horse_id,
        pairing_start_date: pairingData.pairing_start_date,
        pairing_end_date: pairingData.pairing_end_date,
        updated_at: new Date(),
        link_type: pairingData.link_type,
        loan_days_per_week:
          pairingData.link_type === RIDER_HORSE_LINK_TYPE.OWN
            ? null
            : pairingData.loan_days_per_week,
        loan_days: pairingData.link_type === RIDER_HORSE_LINK_TYPE.OWN ? [] : pairingData.loan_days,
      };

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
      await pairingService.update(pairingToDelete.id, { pairing_end_date: getTodayISO() });
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
