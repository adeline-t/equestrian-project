import { useState } from 'react';
import pairingService from '../services/pairingService.js';
import { RIDER_HORSE_LINK_TYPE } from '../lib/domain/pairings.js';

// Mapping des indices vers les noms de jours en anglais (format backend)
const DAY_INDEX_TO_NAME = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

// Mapping inverse : noms de jours vers indices (pour l'édition)
const DAY_NAME_TO_INDEX = {
  mon: 0,
  tue: 1,
  wed: 2,
  thu: 3,
  fri: 4,
  sat: 5,
  sun: 6,
};

/**
 * Convertit les indices de jours (0-6) en noms de jours ('mon', 'tue', ...)
 * @param {number[]} dayIndices - Tableau d'indices [0, 2, 4]
 * @returns {string[]} Tableau de noms ['mon', 'wed', 'fri']
 */
function convertDayIndicesToNames(dayIndices) {
  if (!Array.isArray(dayIndices)) return [];
  return dayIndices.map((index) => DAY_INDEX_TO_NAME[index]).filter(Boolean);
}

/**
 * Convertit les noms de jours ('mon', 'tue', ...) en indices (0-6)
 * @param {string[]} dayNames - Tableau de noms ['mon', 'wed', 'fri']
 * @returns {number[]} Tableau d'indices [0, 2, 4]
 */
export function convertDayNamesToIndices(dayNames) {
  if (!Array.isArray(dayNames)) return [];
  return dayNames.map((name) => DAY_NAME_TO_INDEX[name]).filter((idx) => idx !== undefined);
}

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
    // ✅ CORRECTION : Convertir les noms de jours du backend en indices pour le frontend
    const pairingWithIndices = {
      ...pairing,
      loan_days: pairing.loan_days ? convertDayNamesToIndices(pairing.loan_days) : [],
    };
    setEditingPairing(pairingWithIndices);
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

      // ✅ CORRECTION : Convertir les indices de jours en noms pour le backend
      if (payload.link_type === RIDER_HORSE_LINK_TYPE.LOAN) {
        // Validation frontend minimale
        if (
          payload.loan_days_per_week != null &&
          (payload.loan_days_per_week < 1 || payload.loan_days_per_week > 7)
        ) {
          throw new Error('loan_days_per_week doit être un entier entre 1 et 7');
        }

        if (payload.loan_days && !Array.isArray(payload.loan_days)) {
          throw new Error('loan_days doit être un tableau de jours valides');
        }

        // Convertir les indices en noms de jours
        payload.loan_days = convertDayIndicesToNames(payload.loan_days || []);
      } else {
        // Pour link_type 'own', pas de loan_days
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
