import { useState, useEffect } from 'react';
import { ridersApi, packagesApi, pairingsApi, horsesApi } from '../services';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

/**
 * Custom hook for managing rider card data and operations
 * @param {Object} rider - The rider object
 * @param {Function} onPackageAdd - Callback for adding package
 * @param {Function} onPairingAdd - Callback for adding pairing
 * @param {Function} onUpdate - Callback for updates
 * @returns {Object} Rider data, loading state, error, and handler functions
 */
export function useRiderCard({ rider, onPackageAdd, onPairingAdd, onUpdate }) {
  const [activeTab, setActiveTab] = useState('info');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [packages, setPackages] = useState([]);
  const [pairings, setPairings] = useState([]);
  const [horses, setHorses] = useState([]);
  const [loading, setLoading] = useState({
    packages: false,
    pairings: false,
    horses: false
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (rider?.id) {
      fetchRiderData();
    }
  }, [rider]);

  const fetchRiderData = async () => {
    try {
      setError(null);
      await Promise.all([
        fetchPackages(),
        fetchPairings(),
        fetchHorses()
      ]);
    } catch (error) {
      console.error('Error fetching rider data:', error);
      setError('Erreur lors du chargement des données');
    }
  };

  const fetchPackages = async () => {
    try {
      setLoading(prev => ({ ...prev, packages: true }));
      const response = await ridersApi.getPackages(rider.id);
      setPackages(response.data || []);
    } catch (error) {
      console.error('Error fetching packages:', error);
      throw error;
    } finally {
      setLoading(prev => ({ ...prev, packages: false }));
    }
  };

  const fetchPairings = async () => {
    try {
      setLoading(prev => ({ ...prev, pairings: true }));
      const response = await ridersApi.getHorses(rider.id);
      setPairings(response.data || []);
    } catch (error) {
      console.error('Error fetching pairings:', error);
      throw error;
    } finally {
      setLoading(prev => ({ ...prev, pairings: false }));
    }
  };

  const fetchHorses = async () => {
    try {
      setLoading(prev => ({ ...prev, horses: true }));
      const response = await horsesApi.getAll();
      // Filter horses owned by this rider
      const owned = (response.data || []).filter(horse => horse.owner_id === rider.id);
      setHorses(owned);
    } catch (error) {
      console.error('Error fetching horses:', error);
      throw error;
    } finally {
      setLoading(prev => ({ ...prev, horses: false }));
    }
  };

  const handleDelete = async () => {
    try {
      await ridersApi.delete(rider.id);
      setShowDeleteModal(false);
      // onDelete callback would be passed from parent
    } catch (error) {
      console.error('Error deleting rider:', error);
      setError('Erreur lors de la suppression du cavalier');
    }
  };

  const handlePackageStatusChange = async (packageId, newStatus) => {
    try {
      await packagesApi.update(packageId, { status: newStatus });
      fetchPackages();
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error updating package status:', error);
      setError('Erreur lors de la mise à jour du statut');
    }
  };

  const handlePairingStatusChange = async (pairingId, newStatus) => {
    try {
      await pairingsApi.update(pairingId, { status: newStatus });
      fetchPairings();
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error updating pairing status:', error);
      setError('Erreur lors de la mise à jour du statut');
    }
  };

  const handlePackageAdd = () => {
    if (onPackageAdd) {
      onPackageAdd(rider);
    }
  };

  const handlePairingAdd = () => {
    if (onPairingAdd) {
      onPairingAdd(rider);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: fr });
    } catch {
      return dateString;
    }
  };

  const isActive = (startDate, endDate) => {
    const now = new Date();
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    if (start && start > now) return false;
    if (end && end < now) return false;
    return true;
  };

  const getStatusBadge = (startDate, endDate) => {
    const active = isActive(startDate, endDate);
    return active ? 'Actif' : 'Inactif';
  };

  const getKindLabel = (kind) => {
    return kind === 'horse' ? 'Cheval' : 'Poney';
  };

  const getRiderStats = () => {
    const activePackages = packages.filter(p => 
      isActive(p.activity_start_date, p.activity_end_date)
    ).length;
    const activePairings = pairings.filter(p => 
      isActive(p.pairing_start_date, p.pairing_end_date)
    ).length;
    const activeHorses = horses.filter(h => 
      isActive(h.activity_start_date, h.activity_end_date)
    ).length;
    
    return {
      totalPackages: packages.length,
      activePackages,
      totalPairings: pairings.length,
      activePairings,
      totalHorses: horses.length,
      activeHorses
    };
  };

  return {
    // State
    activeTab,
    showDeleteModal,
    packages,
    pairings,
    horses,
    loading,
    error,
    
    // Actions
    setActiveTab,
    setShowDeleteModal,
    handleDelete,
    handlePackageStatusChange,
    handlePairingStatusChange,
    handlePackageAdd,
    handlePairingAdd,
    fetchRiderData,
    
    // Utilities
    formatDate,
    isActive,
    getStatusBadge,
    getKindLabel,
    getRiderStats
  };
}