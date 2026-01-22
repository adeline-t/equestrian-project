import { useState, useCallback } from 'react';
import { HORSE_ASSIGNMENT_TYPES } from '../lib/domain/domain-constants';

/**
 * Hook to manage the list of participants for an event
 * Handles add, remove, update operations
 */
export function useParticipantList(initialParticipants = []) {
  const [participants, setParticipants] = useState(initialParticipants);

  const addParticipant = useCallback(
    (riderId, horseId, horseAssignmentType = HORSE_ASSIGNMENT_TYPES.MANUAL) => {
      setParticipants((prev) => {
        // Prevent duplicates
        if (prev.some((p) => p.rider_id === riderId && p.horse_id === horseId)) {
          return prev;
        }

        return [
          ...prev,
          {
            id: Date.now(),
            rider_id: riderId,
            horse_id: horseId,
            horse_assignment_type: horseAssignmentType,
          },
        ];
      });
    },
    []
  );

  const removeParticipant = useCallback((id) => {
    setParticipants((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const updateParticipant = useCallback(
    (id, riderId, horseId, horseAssignmentType = HORSE_ASSIGNMENT_TYPES.MANUAL) => {
      setParticipants((prev) => {
        // Prevent duplicate rider + horse combinations (excluding current participant)
        const hasDuplicate = prev.some(
          (p) => p.id !== id && p.rider_id === riderId && p.horse_id === horseId
        );

        if (hasDuplicate) {
          return prev;
        }

        return prev.map((p) =>
          p.id === id
            ? {
                ...p,
                rider_id: riderId,
                horse_id: horseId,
                horse_assignment_type: horseAssignmentType,
              }
            : p
        );
      });
    },
    []
  );

  const clearParticipants = useCallback(() => {
    setParticipants([]);
  }, []);

  return {
    participants,
    addParticipant,
    removeParticipant,
    updateParticipant,
    clearParticipants,
  };
}
