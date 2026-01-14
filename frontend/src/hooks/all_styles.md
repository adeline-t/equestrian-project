# 📁 Project Files Export

Generated on: Mon Jan 12 23:18:06 CET 2026

## 📄 index.js
**Path:** `index.js`

```
/**
 * Centralized export for all custom hooks
 */

export { useLessonData } from './useLessonData.js';
export { useRiderHorses } from './useRiderHorses.js';
export { useParticipants } from './useParticipants.js';
```

---

## 📄 useHorseActions.js
**Path:** `useHorseActions.js`

```
import { useState } from 'react';
import { horseService } from '../services/index.js';

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
      const today = new Date().toISOString().split('T')[0];
      await horseService.update(horseToDelete.id, {
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

  return {
    showModal,
    editingHorse,
    showDeleteModal,
    horseToDelete,
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
```

---

## 📄 useHorseForm.js
**Path:** `useHorseForm.js`

```
import { useEffect, useState } from 'react';
import { HORSE_TYPES, OWNER_TYPES, validateHorseForm } from '../lib';
import { riderService } from '../services';

/**
 * Custom hook for managing horse form data and operations
 * @param {Object} horse - The horse object for editing
 * @returns {Object} Form data, handlers, and state
 */
export function useHorseForm(horse) {
  const [formData, setFormData] = useState({
    name: '',
    kind: HORSE_TYPES.HORSE,
    activity_start_date: '',
    activity_end_date: '',
    ownership_type: OWNER_TYPES.PRIVATE_OWNER, // ✅ Renommé
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [riders, setRiders] = useState([]);
  const [loadingRiders, setLoadingRiders] = useState(false);

  const loadRiders = async () => {
    try {
      setLoadingRiders(true);
      const ridersData = await riderService.getAll();
      setRiders(ridersData || []);
    } catch (err) {
      console.error('Error loading riders:', err);
      setError('Erreur lors du chargement des cavaliers');
    } finally {
      setLoadingRiders(false);
    }
  };

  useEffect(() => {
    loadRiders();
  }, []);

  useEffect(() => {
    if (horse) {
      setFormData({
        name: horse.name || '',
        kind: horse.kind || HORSE_TYPES.HORSE,
        activity_start_date: horse.activity_start_date || '',
        activity_end_date: horse.activity_end_date || '',
        ownership_type: horse.ownership_type || OWNER_TYPES.PRIVATE_OWNER, // ✅ Renommé
      });
    } else {
      setFormData({
        name: '',
        kind: HORSE_TYPES.HORSE,
        activity_start_date: '',
        activity_end_date: '',
        ownership_type: OWNER_TYPES.PRIVATE_OWNER, // ✅ Renommé
      });
    }
  }, [horse]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };

  const validateForm = () => {
    const validation = validateHorseForm(formData);
    if (!validation.isValid) {
      const firstError = Object.values(validation.errors)[0];
      setError(firstError);
      return false;
    }
    setError('');
    return true;
  };

  const resetForm = () => {
    setFormData({
      name: '',
      kind: HORSE_TYPES.HORSE,
      activity_start_date: '',
      activity_end_date: '',
      ownership_type: OWNER_TYPES.PRIVATE_OWNER,
    });
    setError('');
  };

  return {
    // State
    formData,
    error,
    submitting,
    riders,
    loadingRiders,
    kindOptions: Object.values(HORSE_TYPES),
    ownershipOptions: Object.values(OWNER_TYPES),

    // Actions
    handleChange,
    validateForm,
    resetForm,

    // State setters
    setError,
    setSubmitting,
    setFormData,
  };
}
```

---

## 📄 useHorseRiders.js
**Path:** `useHorseRiders.js`

```
import { useState } from 'react';
import { horseService } from '../services/index.js';

/**
 * Custom hook for managing horse riders modal
 * @returns {Object} Riders modal state and handlers
 */
export function useHorseRiders() {
  const [showRidersModal, setShowRidersModal] = useState(false);
  const [selectedHorseRiders, setSelectedHorseRiders] = useState(null);
  const [loadingRiders, setLoadingRiders] = useState(false);
  const [error, setError] = useState(null);

  const handleRidersClick = async (horse) => {
    if (!horse || horse.active_riders_count === 0) {
      return;
    }

    try {
      setLoadingRiders(true);
      setShowRidersModal(true);
      setError(null);

      const data = await horseService.getRiders(horse.id);

      if (!data || data.length === 0) {
        setSelectedHorseRiders({
          horseName: horse.name,
          riders: [],
        });
        return;
      }

      const ridersWithPairing = data.map((pairing) => ({
        ...pairing.riders,
        pairingId: pairing.id,
        pairingStartDate: pairing.pairing_start_date,
        pairingEndDate: pairing.pairing_end_date,
      }));

      setSelectedHorseRiders({
        horseName: horse.name,
        riders: ridersWithPairing,
      });
    } catch (err) {
      console.error('Error loading riders:', err);
      setError(err.message || 'Erreur lors du chargement des cavaliers');
      setShowRidersModal(false);
    } finally {
      setLoadingRiders(false);
    }
  };

  const closeRidersModal = () => {
    setShowRidersModal(false);
    setSelectedHorseRiders(null);
    setError(null);
  };

  return {
    showRidersModal,
    selectedHorseRiders,
    loadingRiders,
    error,
    handleRidersClick,
    closeRidersModal,
  };
}
```

---

## 📄 useHorsesList.js
**Path:** `useHorsesList.js`

```
import { useState, useEffect } from 'react';
import { horseService } from '../services/index.js';

/**
 * Custom hook for managing horses list data
 * @returns {Object} Horses data, loading state, error, and reload function
 */
export function useHorsesList() {
  const [horses, setHorses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHorses = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await horseService.getAll();
      setHorses(data || []);
    } catch (err) {
      console.error('Error fetching horses:', err);
      setError(err.message || 'Erreur lors du chargement des chevaux');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHorses();
  }, []);

  const reload = async () => {
    await fetchHorses();
  };

  return {
    horses,
    loading,
    error,
    reload,
    setError,
    setHorses,
  };
}
```

---

## 📄 usePackageActions.js
**Path:** `usePackageActions.js`

```
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
      if (editingPackage) {
        await packageService.update(editingPackage.id, packageData);
        onSuccess('Forfait modifié avec succès');
      } else {
        await packageService.createForRider(riderId, packageData);
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
      await packageService.update(packageToDelete.id, {
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
      await packageService.delete(packageToDelete.id);
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
```

---

## 📄 usePackageForm.js
**Path:** `usePackageForm.js`

```
import { useState, useEffect } from 'react';
import { validatePackageForm } from '../lib';

/**
 * Custom hook for managing package form state and validation
 * @param {Object} packageData - Existing package to edit (null for new package)
 * @param {string|number} riderId - Pre-selected rider ID
 * @param {Function} onSubmit - Submit callback
 * @returns {Object} Form state and handlers
 */
export function usePackageForm(packageData, riderId, onSubmit) {
  const [formData, setFormData] = useState({
    rider_id: '',
    services_per_week: 0,
    group_lessons_per_week: 0,
    is_active: true, // ✅ Ajouté
    activity_start_date: '', // ✅ Ajouté
    activity_end_date: '', // ✅ Ajouté
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (packageData) {
      setFormData({
        rider_id: packageData.rider_id?.toString() || '',
        services_per_week: Number(packageData.services_per_week) || 0,
        group_lessons_per_week: Number(packageData.group_lessons_per_week) || 0,
        is_active: packageData.is_active !== undefined ? Boolean(packageData.is_active) : true,
        activity_start_date: packageData.activity_start_date || '',
        activity_end_date: packageData.activity_end_date || '',
      });
    } else if (riderId) {
      setFormData({
        rider_id: riderId?.toString() || '',
        services_per_week: 0,
        group_lessons_per_week: 0,
        is_active: true,
        activity_start_date: '',
        activity_end_date: '',
      });
    } else {
      setFormData({
        rider_id: '',
        services_per_week: 0,
        group_lessons_per_week: 0,
        is_active: true,
        activity_start_date: '',
        activity_end_date: '',
      });
    }
  }, [packageData, riderId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    let processedValue = value;

    // Handle checkbox
    if (type === 'checkbox') {
      processedValue = checked;
    }
    // Handle numbers
    else if (name === 'services_per_week' || name === 'group_lessons_per_week') {
      const numValue = Number(value);
      processedValue = isNaN(numValue) || value === '' ? 0 : Math.max(0, numValue);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: processedValue,
    }));

    if (error) {
      setError('');
    }
  };

  const validateForm = () => {
    const validation = validatePackageForm(formData);

    if (!validation.isValid) {
      const firstError = Object.values(validation.errors)[0];
      setError(firstError);
      return false;
    }

    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);

      const submitData = {
        rider_id: Number(formData.rider_id),
        services_per_week: Number(formData.services_per_week) || 0,
        group_lessons_per_week: Number(formData.group_lessons_per_week) || 0,
        is_active: Boolean(formData.is_active),
        activity_start_date: formData.activity_start_date || null,
        activity_end_date: formData.activity_end_date || null,
      };

      console.log('📤 Submitting package data:', submitData);
      await onSubmit(submitData);
      console.log('✅ Package submitted successfully');
    } catch (err) {
      console.error('❌ Submit error:', err);
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setSubmitting(false);
    }
  };

  return {
    formData,
    error,
    submitting,
    handleChange,
    handleSubmit,
  };
}
```

---

## 📄 usePackagesList.js
**Path:** `usePackagesList.js`

```
import { useState, useEffect } from 'react';
import { packageService, riderService } from '../services/index.js';
import {
  PACKAGE_STATUS,
  getPackageStatusLabel,
  isPackageActive,
  isPackageExpired,
} from '../domain/packages.js';
import { isActive } from '../helpers/shared/filters/index.js';

/**
 * Custom hook for managing packages list data and operations
 * @returns {Object} Packages data, loading state, error, and handler functions
 */
export function usePackagesList() {
  const [packages, setPackages] = useState([]);
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [filter, setFilter] = useState(PACKAGE_STATUS.ACTIVE);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [packageToDelete, setPackageToDelete] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [packagesData, ridersData] = await Promise.all([
        packageService.getAll(),
        riderService.getAll(),
      ]);
      setPackages(packagesData || []);
      setRiders(ridersData || []);
    } catch (err) {
      console.error('❌ Error loading data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingPackage(null);
    setShowModal(true);
  };

  const handleEdit = (pkg) => {
    console.log('📝 Editing package:', pkg);
    setEditingPackage(pkg);
    setShowModal(true);
  };

  const handleDeleteClick = (pkg) => {
    setPackageToDelete(pkg);
    setShowDeleteModal(true);
  };

  const handleFormSubmit = async (packageData) => {
    try {
      if (editingPackage) {
        await packageService.update(editingPackage.id, packageData);
        setSuccessMessage('Forfait modifié avec succès');
      } else {
        await packageService.create(packageData);
        setSuccessMessage('Forfait créé avec succès');
      }

      setTimeout(() => setSuccessMessage(''), 3000);
      setShowModal(false);
      setEditingPackage(null);
      await loadData();
    } catch (err) {
      setError(err.message || 'Une erreur est survenue');
      throw err;
    }
  };

  const handleRemoveFromInventory = async () => {
    if (!packageToDelete) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      await packageService.update(packageToDelete.id, {
        activity_end_date: today,
      });
      setSuccessMessage("Forfait retiré de l'inventaire");
      setTimeout(() => setSuccessMessage(''), 3000);
      setShowDeleteModal(false);
      setPackageToDelete(null);
      await loadData();
    } catch (err) {
      setError(err.message);
      setShowDeleteModal(false);
      setPackageToDelete(null);
    }
  };

  const handlePermanentDelete = async () => {
    if (!packageToDelete) return;

    try {
      await packageService.delete(packageToDelete.id);
      setSuccessMessage('Forfait supprimé définitivement');
      setTimeout(() => setSuccessMessage(''), 3000);
      setShowDeleteModal(false);
      setPackageToDelete(null);
      await loadData();
    } catch (err) {
      console.error('❌ Error deleting package:', err);
      setError(err.message);
      setShowDeleteModal(false);
      setPackageToDelete(null);
    }
  };

  const getPackageStatus = (pkg) => {
    if (!pkg) return PACKAGE_STATUS.SUSPENDED;
    if (!isActive(pkg.activity_start_date, pkg.activity_end_date)) {
      return PACKAGE_STATUS.EXPIRED;
    }
    return PACKAGE_STATUS.ACTIVE;
  };

  const getStatusBadge = (pkg) => {
    const status = getPackageStatus(pkg);
    return getPackageStatusLabel(status);
  };

  const getRiderName = (riderId) => {
    const rider = riders.find((r) => r.id === riderId);
    return rider ? rider.name : `Cavalier #${riderId}`;
  };

  const filteredPackages = packages.filter((pkg) => {
    const status = getPackageStatus(pkg);

    if (filter === 'all') return true;
    if (filter === PACKAGE_STATUS.ACTIVE) return status === PACKAGE_STATUS.ACTIVE;
    if (filter === PACKAGE_STATUS.EXPIRED) return status === PACKAGE_STATUS.EXPIRED;
    if (filter === PACKAGE_STATUS.SUSPENDED) return status === PACKAGE_STATUS.SUSPENDED;

    return true;
  });

  const stats = {
    total: packages.length,
    active: packages.filter((p) => getPackageStatus(p) === PACKAGE_STATUS.ACTIVE).length,
    expired: packages.filter((p) => getPackageStatus(p) === PACKAGE_STATUS.EXPIRED).length,
    suspended: packages.filter((p) => getPackageStatus(p) === PACKAGE_STATUS.SUSPENDED).length,
  };

  const closePackageModal = () => {
    setShowModal(false);
    setEditingPackage(null);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setPackageToDelete(null);
  };

  const clearSuccessMessage = () => {
    setSuccessMessage('');
  };

  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    loadData();
  }, []);

  return {
    packages,
    riders,
    loading,
    error,
    showModal,
    editingPackage,
    successMessage,
    filter,
    showDeleteModal,
    packageToDelete,
    filteredPackages,
    stats,
    PACKAGE_STATUS,
    loadData,
    handleCreate,
    handleEdit,
    handleDeleteClick,
    handleRemoveFromInventory,
    handlePermanentDelete,
    handleFormSubmit,
    setFilter,
    closePackageModal,
    closeDeleteModal,
    getPackageStatus,
    getStatusBadge,
    getRiderName,
    isPackageActive,
    isPackageExpired,
    clearSuccessMessage,
    clearError,
  };
}
```

---

## 📄 usePairingActions.js
**Path:** `usePairingActions.js`

```
import { useState } from 'react';
import { pairingService } from '../services/index.js';

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
      if (editingPairing) {
        await pairingService.update(editingPairing.id, pairingData);
        onSuccess('Pension modifiée avec succès');
      } else {
        await pairingService.create({ ...pairingData, rider_id: riderId });
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
      const today = new Date().toISOString().split('T')[0];
      await pairingService.update(pairingToDelete.id, {
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
```

---

## 📄 usePairingForm.js
**Path:** `usePairingForm.js`

```
import { useState, useEffect } from 'react';
import { validatePairingForm } from '../lib';

/**
 * Custom hook for managing pairing form data and operations
 * @param {Object} pairing - The pairing object for editing
 * @param {string|number} riderId - Pre-selected rider ID (optional)
 * @returns {Object} Form data, handlers, and state
 */
export function usePairingForm(pairing, riderId) {
  const [formData, setFormData] = useState({
    rider_id: null,
    horse_id: null,
    pairing_start_date: '',
    pairing_end_date: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (pairing) {
      // Editing mode
      setFormData({
        rider_id: pairing.rider_id ? parseInt(pairing.rider_id) : null,
        horse_id: pairing.horse_id ? parseInt(pairing.horse_id) : null,
        pairing_start_date: pairing.pairing_start_date || '',
        pairing_end_date: pairing.pairing_end_date || '',
      });
    } else if (riderId) {
      // Creating mode with pre-filled riderId
      setFormData({
        rider_id: parseInt(riderId),
        horse_id: null,
        pairing_start_date: '',
        pairing_end_date: '',
      });
    } else {
      // Creating mode without pre-filled data
      setFormData({
        rider_id: null,
        horse_id: null,
        pairing_start_date: '',
        pairing_end_date: '',
      });
    }
  }, [pairing, riderId]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Convert to number for rider_id and horse_id
    const finalValue =
      name === 'rider_id' || name === 'horse_id' ? (value ? parseInt(value) : null) : value;

    setFormData((prev) => ({
      ...prev,
      [name]: finalValue,
    }));

    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };

  const validateForm = () => {
    const validation = validatePairingForm(formData);
    if (!validation.isValid) {
      const firstError = Object.values(validation.errors)[0];
      setError(firstError);
      return false;
    }
    setError('');
    return true;
  };

  const resetForm = () => {
    setFormData({
      rider_id: riderId ? parseInt(riderId) : null,
      horse_id: null,
      pairing_start_date: '',
      pairing_end_date: '',
    });
    setError('');
  };

  return {
    // State
    formData,
    error,
    submitting,

    // Actions
    handleChange,
    validateForm,
    resetForm,

    // State setters
    setError,
    setSubmitting,
  };
}
```

---

## 📄 usePairingsList.js
**Path:** `usePairingsList.js`

```
import { useState, useEffect } from 'react';
import { pairingService, riderService, horseService } from '../services/index.js';

/**
 * Custom hook for managing pairings list data
 * @returns {Object} Pairings data, riders, horses, loading state, error, and reload function
 */
export function usePairingsList() {
  const [pairings, setPairings] = useState([]);
  const [riders, setRiders] = useState([]);
  const [horses, setHorses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [pairingsData, ridersData, horsesData] = await Promise.all([
        pairingService.getAll(),
        riderService.getAll(),
        horseService.getAll(),
      ]);
      setPairings(pairingsData || []);
      setRiders(ridersData || []);
      setHorses(horsesData || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return {
    pairings,
    riders,
    horses,
    loading,
    error,
    reload: loadData,
    setError,
  };
}
```

---

## 📄 useRiderCard.js
**Path:** `useRiderCard.js`

```
import { useState, useEffect } from 'react';
import { riderService, packageService, pairingService, horseService } from '../services/index.js';

/**
 * Custom hook for managing rider card data and operations
 * @param {number} riderId - The rider ID
 * @returns {Object} Rider data, loading state, error, and handler functions
 */
export function useRiderCard(riderId) {
  const [rider, setRider] = useState(null);
  const [packages, setPackages] = useState([]);
  const [pairings, setPairings] = useState([]);
  const [riders, setRiders] = useState([]);
  const [horses, setHorses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (riderId) {
      fetchRiderData();
    }
  }, [riderId]);

  const fetchRiderData = async () => {
    try {
      setLoading(true);
      setError(null);

      const riderResponse = await riderService.getById(riderId);
      setRider(riderResponse);

      await Promise.all([
        fetchPackages(),
        fetchPairings(),
        fetchAllRiders(),
        fetchAllHorses(),
      ]);
    } catch (error) {
      console.error('Error fetching rider data:', error);
      setError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const fetchPackages = async () => {
    try {
      const data = await riderService.getPackages(riderId);
      console.log('Packages fetched:', data);
      setPackages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching packages:', error);
      setPackages([]);
    }
  };

  const fetchPairings = async () => {
    try {
      const data = await riderService.getHorses(riderId);
      console.log('Pairings fetched:', data);
      setPairings(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching pairings:', error);
      setPairings([]);
    }
  };

  const fetchAllRiders = async () => {
    try {
      const response = await riderService.getAll();
      setRiders(response || []);
    } catch (error) {
      console.error('Error fetching all riders:', error);
      setRiders([]);
    }
  };

  const fetchAllHorses = async () => {
    try {
      const response = await horseService.getAll();
      setHorses(response || []);
    } catch (error) {
      console.error('Error fetching all horses:', error);
      setHorses([]);
    }
  };

  const reload = () => {
    fetchRiderData();
  };

  return {
    rider,
    packages,
    pairings,
    riders,
    horses,
    loading,
    error,
    reload,
  };
}
```

---

## 📄 useRiderForm.js
**Path:** `useRiderForm.js`

```
import { useState, useEffect } from 'react';
import { validateRiderForm } from '../helpers/domains/riders/validators.js';
import { RIDER_TYPES } from '../domain/riders.js';

/**
 * Custom hook for managing rider form data and operations
 * @param {Object} rider - The rider object for editing
 * @param {Function} onSubmit - Submit handler
 * @param {Function} onCancel - Cancel handler
 * @returns {Object} Form data, handlers, and state
 */
export function useRiderForm(rider, onSubmit, onCancel) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    activity_start_date: '',
    activity_end_date: '',
    rider_type: RIDER_TYPES.BOARDER, // ✅ Renommé de 'kind' vers 'rider_type'
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (rider) {
      setFormData({
        name: rider.name || '',
        phone: rider.phone || '',
        email: rider.email || '',
        activity_start_date: rider.activity_start_date || '',
        activity_end_date: rider.activity_end_date || '',
        rider_type: rider.rider_type || RIDER_TYPES.BOARDER, // ✅ Renommé
      });
    } else {
      resetForm();
    }
  }, [rider]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const validation = validateRiderForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return false;
    }
    setErrors({});
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    if (!validateForm()) return;
    
    try {
      setSubmitting(true);
      if (onSubmit) await onSubmit(formData);
    } catch (err) {
      setErrors({ submit: err.message || 'Une erreur est survenue lors de la sauvegarde' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setErrors({});
    if (onCancel) onCancel();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      activity_start_date: '',
      activity_end_date: '',
      rider_type: RIDER_TYPES.BOARDER,
    });
    setErrors({});
  };

  return {
    formData,
    errors,
    submitting,
    riderTypeOptions: Object.values(RIDER_TYPES), // ✅ Ajouté
    handleChange,
    handleSubmit,
    handleCancel,
    validateForm,
    resetForm,
    setErrors,
    setFormData,
  };
}
```

---

## 📄 useRiderHorses.js
**Path:** `useRiderHorses.js`

```
import { useState, useEffect } from 'react';
import { riderService } from '../services/index.js';

/**
 * Custom hook for managing rider-horse pairings
 * @param {string} riderId - Selected rider ID
 * @returns {Object} Paired horses and loading state
 */
export const useRiderHorses = (riderId) => {
  const [riderPairedHorses, setRiderPairedHorses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (riderId) {
      loadHorsesForRider(riderId);
    } else {
      setRiderPairedHorses([]);
    }
  }, [riderId]);

  const loadHorsesForRider = async (riderId) => {
    try {
      setLoading(true);
      setError(null);
      
      const pairedHorsesRaw = await riderService.getHorses(riderId);

      const pairedHorses = pairedHorsesRaw.map((pairing) => ({
        id: pairing.horses.id,
        name: pairing.horses.name,
        kind: pairing.horses.kind,
        ownership_type: pairing.horses.ownership_type, // ✅ Corrigé
        pairing_id: pairing.id,
        pairing_start_date: pairing.pairing_start_date,
        pairing_end_date: pairing.pairing_end_date,
      }));

      setRiderPairedHorses(pairedHorses);
      console.log('🐴 Paired horses for rider:', pairedHorses);
    } catch (err) {
      console.error('Error loading rider horses:', err);
      setError(err);
      setRiderPairedHorses([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    riderPairedHorses,
    loading,
    error,
    refresh: () => riderId && loadHorsesForRider(riderId),
  };
};
```

---

## 📄 useRiderPackages.js
**Path:** `useRiderPackages.js`

```
import { useState, useEffect } from 'react';
import { riderService, packageService } from '../services/index.js';
import { isActive, filterActivePackages } from '../helpers/shared/filters/index.js';
import {
  PACKAGE_STATUS,
  PACKAGE_STATUS_LABELS,
  getPackageStatusLabel,
} from '../domain/packages.js';

/**
 * Custom hook for managing rider packages data and operations
 * @param {string|number} riderId - The ID of the rider
 * @returns {Object} Packages data, loading state, error, and handler functions
 */
export function useRiderPackages(riderId) {
  const [packages, setPackages] = useState([]);
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [packageToDelete, setPackageToDelete] = useState(null);

  const loadPackages = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await riderService.getPackages(riderId);
      setPackages(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadRiders = async () => {
    try {
      const data = await riderService.getAll();
      setRiders(data || []);
    } catch (err) {
      console.error('Error loading riders:', err);
    }
  };

  const handleCreate = () => {
    setEditingPackage(null);
    setShowModal(true);
  };

  const handleEdit = (pkg) => {
    setEditingPackage(pkg);
    setShowModal(true);
  };

  const handleDeleteClick = (pkg) => {
    setPackageToDelete(pkg);
    setShowDeleteModal(true);
  };

  const handleRemoveFromInventory = async () => {
    if (!packageToDelete) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      await packageService.update(packageToDelete.id, {
        activity_end_date: today,
      });
      setSuccessMessage("Forfait retiré de l'inventaire");
      setTimeout(() => setSuccessMessage(''), 3000);
      setShowDeleteModal(false);
      setPackageToDelete(null);
      await loadPackages();
    } catch (err) {
      setError(err.message);
      setShowDeleteModal(false);
      setPackageToDelete(null);
    }
  };

  const handlePermanentDelete = async () => {
    if (!packageToDelete) return;

    try {
      await packageService.delete(packageToDelete.id);
      setSuccessMessage('Forfait supprimé définitivement');
      setTimeout(() => setSuccessMessage(''), 3000);
      setShowDeleteModal(false);
      setPackageToDelete(null);
      await loadPackages();
    } catch (err) {
      setError(err.message);
      setShowDeleteModal(false);
      setPackageToDelete(null);
    }
  };

  const handleFormSubmit = async (packageData) => {
    try {
      if (editingPackage) {
        await packageService.update(editingPackage.id, packageData);
        setSuccessMessage('Forfait modifié avec succès');
      } else {
        await packageService.createForRider(riderId, packageData);
        setSuccessMessage('Forfait créé avec succès');
      }
      setTimeout(() => setSuccessMessage(''), 3000);
      setShowModal(false);
      setEditingPackage(null);
      await loadPackages();
    } catch (err) {
      throw err;
    }
  };

  const getPackageStatus = (pkg) => {
    if (!pkg) return PACKAGE_STATUS.INACTIVE;
    if (!isActive(pkg.activity_start_date, pkg.activity_end_date)) {
      return PACKAGE_STATUS.EXPIRED;
    }
    return PACKAGE_STATUS.ACTIVE;
  };

  const getStatusBadge = (pkg) => {
    const status = getPackageStatus(pkg);
    return getPackageStatusLabel(status);
  };

  const activePackages = filterActivePackages(packages);

  const closePackageModal = () => {
    setShowModal(false);
    setEditingPackage(null);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setPackageToDelete(null);
  };

  const clearSuccessMessage = () => {
    setSuccessMessage('');
  };

  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    if (riderId) {
      loadPackages();
      loadRiders();
    }
  }, [riderId]);

  return {
    packages,
    riders,
    loading,
    error,
    showModal,
    editingPackage,
    successMessage,
    showDeleteModal,
    packageToDelete,
    activePackages,
    PACKAGE_STATUS,
    PACKAGE_STATUS_LABELS,
    loadPackages,
    handleCreate,
    handleEdit,
    handleDeleteClick,
    handleRemoveFromInventory,
    handlePermanentDelete,
    handleFormSubmit,
    closePackageModal,
    closeDeleteModal,
    isActive,
    getPackageStatus,
    getStatusBadge,
    getPackageStatusLabel,
    clearSuccessMessage,
    clearError,
  };
}
```

---

## 📄 useRidersList.js
**Path:** `useRidersList.js`

```
import { useState, useEffect } from 'react';
import { riderService } from '../services/index.js';
import { isActive } from '../helpers/shared/filters/activityFilters.js';
import { ACTIVITY_STATUS_FILTERS, COMMON_FILTERS } from '../domain/filters.js';
import { calculateRiderStats, filterRiders } from '../helpers/domains/riders/index.js';

/**
 * Custom hook for managing riders list data and operations
 */
export function useRidersList() {
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingRider, setEditingRider] = useState(null);
  const [selectedRiderId, setSelectedRiderId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [riderToDelete, setRiderToDelete] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [activityFilter, setActivityFilter] = useState(ACTIVITY_STATUS_FILTERS.ACTIVE);
  const [riderTypeFilter, setRiderTypeFilter] = useState(COMMON_FILTERS.ALL); // ✅ Renommé de kindFilter

  useEffect(() => {
    loadRiders();
  }, []);

  const loadRiders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await riderService.getAll();
      setRiders(data || []);
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement des cavaliers');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingRider(null);
    setShowModal(true);
  };

  const handleEdit = (rider) => {
    setEditingRider(rider);
    setShowModal(true);
  };

  const handleViewDetails = (riderId) => {
    setSelectedRiderId(riderId);
  };

  const handleDeleteClick = (rider) => {
    setRiderToDelete(rider);
    setShowDeleteModal(true);
  };

  const handleFormSubmit = async (riderData) => {
    try {
      if (editingRider) {
        await riderService.update(editingRider.id, riderData);
        setSuccessMessage('Cavalier modifié avec succès');
      } else {
        await riderService.create(riderData);
        setSuccessMessage('Cavalier créé avec succès');
      }

      setTimeout(() => setSuccessMessage(''), 3000);
      setShowModal(false);
      setEditingRider(null);
      await loadRiders();
    } catch (err) {
      throw err;
    }
  };

  const handleRemoveFromInventory = async () => {
    if (!riderToDelete) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      await riderService.update(riderToDelete.id, {
        activity_end_date: today,
      });
      setSuccessMessage("Cavalier retiré de l'inventaire");
      setTimeout(() => setSuccessMessage(''), 3000);
      closeDeleteModal();
      await loadRiders();
    } catch (err) {
      setError(err.message);
      closeDeleteModal();
    }
  };

  const handlePermanentDelete = async () => {
    if (!riderToDelete) return;

    try {
      await riderService.delete(riderToDelete.id);
      setSuccessMessage('Cavalier supprimé définitivement');
      setTimeout(() => setSuccessMessage(''), 3000);
      closeDeleteModal();
      await loadRiders();
    } catch (err) {
      setError(err.message);
      closeDeleteModal();
    }
  };

  const stats = calculateRiderStats(riders);

  const filteredRiders = filterRiders(riders, {
    activityStatus: activityFilter,
    riderType: riderTypeFilter, // ✅ Utilise riderType au lieu de kind
  });

  const getRiderStatus = (rider) => isActive(rider.activity_start_date, rider.activity_end_date);

  const getStatusBadge = (rider) => (getRiderStatus(rider) ? 'Actif' : 'Inactif');

  const closeRiderModal = () => {
    setShowModal(false);
    setEditingRider(null);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setRiderToDelete(null);
  };

  const closeRiderCard = () => {
    setSelectedRiderId(null);
  };

  const clearSuccessMessage = () => setSuccessMessage('');
  const clearError = () => setError(null);

  return {
    riders,
    filteredRiders,
    stats,
    loading,
    error,
    showModal,
    editingRider,
    selectedRiderId,
    showDeleteModal,
    riderToDelete,
    successMessage,
    activityFilter,
    riderTypeFilter, // ✅ Renommé
    ACTIVITY_STATUS_FILTERS,
    COMMON_FILTERS,
    setActivityFilter,
    setRiderTypeFilter, // ✅ Renommé
    handleCreate,
    handleEdit,
    handleViewDetails,
    handleDeleteClick,
    handleRemoveFromInventory,
    handlePermanentDelete,
    handleFormSubmit,
    closeRiderModal,
    closeDeleteModal,
    closeRiderCard,
    getStatusBadge,
    getRiderStatus,
    clearSuccessMessage,
    clearError,
  };
}
```

---

