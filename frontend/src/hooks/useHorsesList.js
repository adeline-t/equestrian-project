import { useState, useEffect } from 'react';
import { horseService } from '../services';
import { isActive } from '../lib/helpers';
import { HORSE_TYPES, OWNER_TYPES } from '../lib/domain';

/**
 * Custom hook for managing horses list with filters and stats
 */
export function useHorsesList() {
  const [horses, setHorses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [includeInactive, setIncludeInactive] = useState(false);
  const [kindFilter, setKindFilter] = useState('all');
  const [ownershipFilter, setOwnershipFilter] = useState('all');

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

  // Calculate stats
  const stats = {
    total: horses.length,
    active: horses.filter((h) => isActive(h.activity_start_date, h.activity_end_date)).length,
    inactive: horses.filter((h) => !isActive(h.activity_start_date, h.activity_end_date)).length,
    horse: horses.filter((h) => h.kind === HORSE_TYPES.HORSE).length,
    pony: horses.filter((h) => h.kind === HORSE_TYPES.PONY).length,
    laury: horses.filter((h) => h.ownership_type === OWNER_TYPES.LAURY).length,
    private_owner: horses.filter((h) => h.ownership_type === OWNER_TYPES.PRIVATE_OWNER).length,
    club: horses.filter((h) => h.ownership_type === OWNER_TYPES.CLUB).length,
    other: horses.filter((h) => h.ownership_type === OWNER_TYPES.OTHER).length,
  };

  // Filter horses
  const filteredHorses = horses.filter((horse) => {
    const horseIsActive = isActive(horse.activity_start_date, horse.activity_end_date);
    if (!includeInactive && !horseIsActive) return false;

    if (kindFilter !== 'all' && horse.kind !== kindFilter) return false;
    if (ownershipFilter !== 'all' && horse.ownership_type !== ownershipFilter) return false;

    return true;
  });

  const reload = async () => {
    await fetchHorses();
  };

  const toggleIncludeInactive = () => {
    setIncludeInactive(!includeInactive);
  };

  const clearError = () => setError(null);

  return {
    horses,
    filteredHorses,
    stats,
    loading,
    error,
    includeInactive,
    kindFilter,
    ownershipFilter,
    setKindFilter,
    setOwnershipFilter,
    toggleIncludeInactive,
    reload,
    clearError,
    setError,
    setHorses,
  };
}
