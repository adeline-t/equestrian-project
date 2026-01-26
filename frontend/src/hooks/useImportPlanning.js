import { useState, useCallback } from 'react';
import riderService from '../services/riderService';
import horseService from '../services/horseService';
import { calendarService } from '../services/calendarService';
import { getTodayISO } from '../lib/helpers';
import { EVENT_TYPES } from '../lib/domain';

/**
 * Normalize string for comparison (case-insensitive, diacritic-insensitive)
 */
function normalizeString(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .trim();
}

/**
 * Check if two strings match (fuzzy match)
 * Returns true if normalized str1 contains normalized str2 or vice versa
 */
function fuzzyMatch(str1, str2) {
  if (!str1 || !str2) return false;
  const norm1 = normalizeString(str1);
  const norm2 = normalizeString(str2);
  return norm1.includes(norm2) || norm2.includes(norm1);
}

/**
 * Hook to import planning data from JSON
 */
export function useImportPlanning() {
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState({
    step: '',
    current: 0,
    total: 0,
    details: [],
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  /**
   * Find or create a rider by name
   */
  const findOrCreateRider = async (riderName, existingRiders) => {
    if (!riderName || riderName.toLowerCase() === 'essai') {
      return null; // Skip "essai" entries
    }

    // Try to find existing rider
    const match = existingRiders.find((rider) => fuzzyMatch(rider.name, riderName));

    if (match) {
      return match;
    }

    // Create new rider
    try {
      const newRider = await riderService.create({
        name: riderName,
        rider_type: 'club', // Default to club rider
        phone: null,
        email: null,
        activity_start_date: getTodayISO(),
        activity_end_date: null,
      });
      return newRider;
    } catch (err) {
      console.error(`Error creating rider ${riderName}:`, err);
      return null;
    }
  };

  /**
   * Find or create a horse by name
   */
  const findOrCreateHorse = async (horseName, existingHorses) => {
    if (!horseName) return null;

    // Try to find existing horse
    const match = existingHorses.find((horse) => fuzzyMatch(horse.name, horseName));

    if (match) {
      return match;
    }

    // Create new horse
    try {
      const newHorse = await horseService.create({
        name: horseName,
        kind: 'pony', // Default to pony (you can adjust based on your needs)
        ownership_type: 'club', // Default to club horse
        activity_start_date: getTodayISO(),
        activity_end_date: null,
      });
      return newHorse;
    } catch (err) {
      console.error(`Error creating horse ${horseName}:`, err);
      return null;
    }
  };

  /**
   * Check if a slot already exists for a given date and time
   */
  const slotExists = (existingSlots, slotDate, startTime) => {
    return existingSlots.some(
      (slot) => slot.slot_date === slotDate && slot.start_time === startTime
    );
  };

  /**
   * Import planning data from JSON
   */
  const importPlanning = useCallback(async (jsonData) => {
    setImporting(true);
    setError(null);
    setProgress({ step: 'Initialisation...', current: 0, total: 0, details: [] });

    const importResult = {
      ridersCreated: 0,
      ridersFound: 0,
      horsesCreated: 0,
      horsesFound: 0,
      eventsCreated: 0,
      slotsCreated: 0,
      participantsCreated: 0,
      slotsSkipped: 0,
      errors: [],
    };

    try {
      // Step 1: Load existing data
      setProgress({
        step: 'Chargement des données existantes...',
        current: 0,
        total: 3,
        details: [],
      });

      const [existingRiders, existingHorses, existingSlots] = await Promise.all([
        riderService.getAll(),
        horseService.getAll(),
        calendarService.getAllSlots(),
      ]);

      // Step 2: Process riders and horses
      setProgress({
        step: 'Traitement des cavaliers et chevaux...',
        current: 0,
        total: jsonData.event_participants.length,
        details: [],
      });

      const riderMap = new Map(); // riderName -> rider object
      const horseMap = new Map(); // horseName -> horse object

      for (let i = 0; i < jsonData.event_participants.length; i++) {
        const participant = jsonData.event_participants[i];

        setProgress((prev) => ({
          ...prev,
          current: i + 1,
          details: [`Traitement: ${participant.rider_name || 'N/A'}`],
        }));

        // Process rider
        if (participant.rider_name && !riderMap.has(participant.rider_name)) {
          const rider = await findOrCreateRider(participant.rider_name, existingRiders);
          if (rider) {
            riderMap.set(participant.rider_name, rider);
            if (existingRiders.some((r) => r.id === rider.id)) {
              importResult.ridersFound++;
            } else {
              importResult.ridersCreated++;
              existingRiders.push(rider); // Add to list for future lookups
            }
          }
        }

        // Process horse
        if (participant.horse_name && !horseMap.has(participant.horse_name)) {
          const horse = await findOrCreateHorse(participant.horse_name, existingHorses);
          if (horse) {
            horseMap.set(participant.horse_name, horse);
            if (existingHorses.some((h) => h.id === horse.id)) {
              importResult.horsesFound++;
            } else {
              importResult.horsesCreated++;
              existingHorses.push(horse); // Add to list for future lookups
            }
          }
        }
      }

      // Step 3: Process events and slots
      setProgress({
        step: 'Création des événements et créneaux...',
        current: 0,
        total: jsonData.events.length,
        details: [],
      });

      const eventIdMap = new Map(); // old event id -> new event id
      const slotIdMap = new Map(); // old slot id -> new slot id

      for (let i = 0; i < jsonData.events.length; i++) {
        const eventData = jsonData.events[i];
        const slotData = jsonData.planning_slots.find((s) => s.event_id === eventData.id);

        if (!slotData) {
          importResult.errors.push(`Slot non trouvé pour l'événement ${eventData.id}`);
          continue;
        }

        setProgress((prev) => ({
          ...prev,
          current: i + 1,
          details: [`Création: ${slotData.slot_date} ${slotData.start_time}`],
        }));

        // Check if slot already exists
        if (slotExists(existingSlots, slotData.slot_date, slotData.start_time)) {
          importResult.slotsSkipped++;
          continue;
        }

        try {
          // Create event
          const createdEvent = await calendarService.createEvent({
            event_type: eventData.event_type ?? 'private_lesson',
            instructor_id: 1,
            min_participants: eventData.min_participants,
            max_participants: eventData.max_participants,
            name: eventData.name ?? eventData.event_type,
          });

          eventIdMap.set(eventData.id, createdEvent.id);
          importResult.eventsCreated++;

          // Create slot
          const createdSlot = await calendarService.createSlot({
            event_id: createdEvent.id,
            slot_date: slotData.slot_date,
            start_time: slotData.start_time + ':00', // Add seconds
            end_time: slotData.end_time + ':00', // Add seconds
            is_all_day: slotData.is_all_day,
            slot_status: slotData.slot_status ?? 'scheduled',
            actual_instructor_id: null,
            cancellation_reason: '',
          });

          slotIdMap.set(slotData.id, createdSlot.id);
          importResult.slotsCreated++;
        } catch (err) {
          importResult.errors.push(
            `Erreur création slot ${slotData.slot_date} ${slotData.start_time}: ${err.message}`
          );
        }
      }

      // Step 4: Process participants
      setProgress({
        step: 'Ajout des participants...',
        current: 0,
        total: jsonData.event_participants.length,
        details: [],
      });

      for (let i = 0; i < jsonData.event_participants.length; i++) {
        const participantData = jsonData.event_participants[i];
        const newSlotId = slotIdMap.get(participantData.planning_slot_id);

        if (!newSlotId) {
          // Slot was skipped (already exists)
          continue;
        }

        setProgress((prev) => ({
          ...prev,
          current: i + 1,
          details: [`Participant: ${participantData.rider_name || 'N/A'}`],
        }));

        const rider = riderMap.get(participantData.rider_name);
        const horse = participantData.horse_name ? horseMap.get(participantData.horse_name) : null;

        if (!rider) {
          importResult.errors.push(
            `Cavalier non trouvé pour le participant ${participantData.id}: ${participantData.rider_name}`
          );
          continue;
        }

        try {
          await calendarService.addParticipant({
            planning_slot_id: newSlotId,
            rider_id: rider.id,
            horse_id: horse ? horse.id : null,
            horse_assignment_type: 'manual',
            is_cancelled: false,
          });

          importResult.participantsCreated++;
        } catch (err) {
          importResult.errors.push(
            `Erreur ajout participant ${participantData.rider_name}: ${err.message}`
          );
        }
      }

      setProgress({
        step: 'Import terminé',
        current: 100,
        total: 100,
        details: ['Import réussi !'],
      });

      setResult(importResult);
      return importResult;
    } catch (err) {
      console.error('Error importing planning:', err);
      setError(err.message);
      throw err;
    } finally {
      setImporting(false);
    }
  }, []);

  /**
   * Reset hook state
   */
  const reset = useCallback(() => {
    setImporting(false);
    setProgress({ step: '', current: 0, total: 0, details: [] });
    setResult(null);
    setError(null);
  }, []);

  return {
    importing,
    progress,
    result,
    error,
    importPlanning,
    reset,
  };
}
