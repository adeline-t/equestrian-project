import { useState, useEffect, useCallback, useMemo } from 'react';
import riderService from '../services/riderService';
import horseService from '../services/horseService';
import { OWNER_TYPES } from '../lib/domain/domain-constants';

const OWNER_TYPE_SORT_ORDER = {
  [OWNER_TYPES.LAURY]: 1,
  [OWNER_TYPES.CLUB]: 2,
  [OWNER_TYPES.PRIVATE_OWNER]: 3,
  [OWNER_TYPES.OTHER]: 4,
};

/**
 * Hook to manage participant selection logic
 * Handles fetching riders/horses, filtering, and selection state
 */
export function useParticipantSelection(existingParticipants = [], editingParticipantId = null) {
  const [riders, setRiders] = useState([]);
  const [horses, setHorses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [selectedRiderId, setSelectedRiderId] = useState(null);
  const [selectedHorseId, setSelectedHorseId] = useState(null);
  const [riderHorses, setRiderHorses] = useState([]);

  // Fetch riders and horses on mount
  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [ridersData, horsesData] = await Promise.all([
          riderService.getAll(),
          horseService.getAll(),
        ]);

        if (!cancelled) {
          setRiders(Array.isArray(ridersData) ? ridersData : []);
          setHorses(Array.isArray(horsesData) ? horsesData : []);
        }
      } catch (err) {
        if (!cancelled) {
          console.error('Error fetching participants data:', err);
          setError('Erreur lors du chargement des données');
          setRiders([]);
          setHorses([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, []);

  // Fetch horses for selected rider
  useEffect(() => {
    if (!selectedRiderId) {
      setRiderHorses([]);
      return;
    }

    const fetchRiderHorses = async () => {
      try {
        const data = await riderService.getHorses(selectedRiderId);
        if (Array.isArray(data)) {
          const horsesData = data
            .map((pairing) => pairing.horses)
            .filter((horse) => horse && horse.id);
          setRiderHorses(horsesData);

          // Auto-select first horse if available and none selected
          if (horsesData.length > 0 && !selectedHorseId) {
            setSelectedHorseId(horsesData[0].id);
          }
        } else {
          setRiderHorses([]);
        }
      } catch (err) {
        console.error('Error fetching rider horses:', err);
        setRiderHorses([]);
      }
    };

    fetchRiderHorses();
  }, [selectedRiderId, selectedHorseId]);

  // Get available riders (excluding already selected ones)
  const getAvailableRiders = useCallback(
    (riderTypeFilter = 'all', searchTerm = '') => {
      return riders.filter((r) => {
        // Filter by type
        if (riderTypeFilter !== 'all' && r.rider_type !== riderTypeFilter) {
          return false;
        }

        // Filter by search term
        if (searchTerm) {
          const riderNameNormalized = r.name
            .toLowerCase()
            .normalize('NFD')
            .replace(/\p{Diacritic}/gu, '');
          const searchNormalized = searchTerm
            .toLowerCase()
            .normalize('NFD')
            .replace(/\p{Diacritic}/gu, '');

          if (!riderNameNormalized.includes(searchNormalized)) {
            return false;
          }
        }

        // Exclude already selected riders (unless editing that participant)
        if (
          existingParticipants.some((p) => p.rider_id === r.id && p.id !== editingParticipantId)
        ) {
          return false;
        }

        return true;
      });
    },
    [riders, existingParticipants, editingParticipantId]
  );

  // Get available horses (sorted and filtered)
  const getAvailableHorses = useCallback(
    (ownershipFilter = 'all') => {
      // Combine rider horses (prioritized) with all other horses
      const sortedHorses = [
        ...riderHorses,
        ...horses.filter((h) => !riderHorses.some((rh) => rh.id === h.id)),
      ]
        // Exclude already selected horses (unless editing that participant)
        .filter(
          (h) =>
            !existingParticipants.some((p) => p.horse_id === h.id && p.id !== editingParticipantId)
        )
        // Sort by ownership type
        .sort((h1, h2) => {
          const order1 = OWNER_TYPE_SORT_ORDER[h1.ownership_type] ?? 99;
          const order2 = OWNER_TYPE_SORT_ORDER[h2.ownership_type] ?? 99;
          return order1 - order2;
        });

      // Apply ownership filter
      if (ownershipFilter === 'all') {
        return sortedHorses;
      }

      return sortedHorses.filter((h) => h.ownership_type === ownershipFilter);
    },
    [horses, riderHorses, existingParticipants, editingParticipantId]
  );

  const resetSelection = useCallback(() => {
    setSelectedRiderId(null);
    setSelectedHorseId(null);
    setRiderHorses([]);
  }, []);

  const setSelection = useCallback((riderId, horseId) => {
    setSelectedRiderId(riderId);
    setSelectedHorseId(horseId);
  }, []);

  return {
    // Data
    riders,
    horses,
    loading,
    error,

    // Selection state
    selectedRiderId,
    selectedHorseId,
    setSelectedRiderId,
    setSelectedHorseId,
    setSelection,
    resetSelection,

    // Filtered/sorted data
    getAvailableRiders,
    getAvailableHorses,

    // Helper to get names
    getRiderName: useCallback((id) => riders.find((r) => r.id === id)?.name || '—', [riders]),
    getHorseName: useCallback((id) => horses.find((h) => h.id === id)?.name || '—', [horses]),
  };
}
