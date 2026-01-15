import { useState, useEffect } from 'react';
import { horseService } from '../services/index.js';
import { isActive } from '../lib/helpers/index.js';

// Filtres de statut d'activité
export const ACTIVITY_STATUS_FILTERS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  ALL: 'all',
};

// Filtres de type de cheval
export const HORSE_KIND_FILTERS = {
  ALL: 'all',
  HORSE: 'horse',
  PONY: 'pony',
};

// Filtres de type de propriétaire
export const OWNERSHIP_TYPE_FILTERS = {
  ALL: 'all',
  LAURY: 'laury',
  PRIVATE_OWNER: 'private_owner',
  CLUB: 'club',
  OTHER: 'other',
};

/**
 * Custom hook for managing horses list with filters and stats
 * @returns {Object} Horses data, filters, stats, loading state, and actions
 */
export function useHorsesList() {
  const [horses, setHorses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [activityFilter, setActivityFilter] = useState(ACTIVITY_STATUS_FILTERS.ACTIVE);
  const [kindFilter, setKindFilter] = useState(HORSE_KIND_FILTERS.ALL);
  const [ownershipFilter, setOwnershipFilter] = useState(OWNERSHIP_TYPE_FILTERS.ALL);

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
    horse: horses.filter((h) => h.kind === 'horse').length,
    pony: horses.filter((h) => h.kind === 'pony').length,
    laury: horses.filter((h) => h.ownership_type === 'laury').length,
    private_owner: horses.filter((h) => h.ownership_type === 'private_owner').length,
    club: horses.filter((h) => h.ownership_type === 'club').length,
    other: horses.filter((h) => h.ownership_type === 'other').length,
  };

  // Filter horses
  const filteredHorses = horses.filter((horse) => {
    // Activity filter
    const horseIsActive = isActive(horse.activity_start_date, horse.activity_end_date);
    if (activityFilter === ACTIVITY_STATUS_FILTERS.ACTIVE && !horseIsActive) return false;
    if (activityFilter === ACTIVITY_STATUS_FILTERS.INACTIVE && horseIsActive) return false;

    // Kind filter
    if (kindFilter !== HORSE_KIND_FILTERS.ALL && horse.kind !== kindFilter) return false;

    // Ownership filter
    if (ownershipFilter !== OWNERSHIP_TYPE_FILTERS.ALL && horse.ownership_type !== ownershipFilter)
      return false;

    return true;
  });

  const reload = async () => {
    await fetchHorses();
  };

  const clearError = () => setError(null);

  return {
    horses,
    filteredHorses,
    stats,
    loading,
    error,
    activityFilter,
    kindFilter,
    ownershipFilter,
    ACTIVITY_STATUS_FILTERS,
    HORSE_KIND_FILTERS,
    OWNERSHIP_TYPE_FILTERS,
    setActivityFilter,
    setKindFilter,
    setOwnershipFilter,
    reload,
    clearError,
    setError,
    setHorses,
  };
}
