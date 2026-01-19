import { format, parseISO } from 'date-fns';
import { calendarApi } from './api';
import { timeToMinutes, minutesToTime } from '../lib/helpers/formatters';

/**
 * Extrait l'heure au format "HH:MM" depuis un timestamp ISO ou une chaîne d'heure
 * @param {string|number} timeValue - Peut être "09:00", "2026-01-19T09:00:00", ou un nombre de minutes
 * @returns {string} Format "HH:MM"
 */
function normalizeTimeToHHMM(timeValue) {
  if (!timeValue) return '00:00';

  // Si c'est un nombre (minutes), convertir en "HH:MM"
  if (typeof timeValue === 'number') {
    return minutesToTime(timeValue);
  }

  // Si c'est une chaîne
  if (typeof timeValue === 'string') {
    // Si c'est un timestamp ISO (contient 'T')
    if (timeValue.includes('T')) {
      try {
        const date = parseISO(timeValue);
        return format(date, 'HH:mm');
      } catch (error) {
        console.warn('Could not parse ISO timestamp:', timeValue);
        return '00:00';
      }
    }

    // Si c'est déjà au format "HH:MM" (ou "HH:MM:SS")
    const timePart = timeValue.split(':');
    if (timePart.length >= 2) {
      const hours = timePart[0].padStart(2, '0');
      const minutes = timePart[1].padStart(2, '0');
      return `${hours}:${minutes}`;
    }
  }

  console.warn('Unexpected time format:', timeValue);
  return '00:00';
}

/**
 * Enrichit un slot avec les données calculées nécessaires
 */
function enrichSlot(slot) {
  if (!slot) return slot;

  console.log('🔍 Enriching slot:', {
    slot_id: slot.slot_id,
    original_start: slot.start_time,
    original_end: slot.end_time,
    is_all_day: slot.is_all_day,
  });

  // Gérer les événements en journée entière
  if (slot.is_all_day === true) {
    console.log('📅 All-day event detected:', slot.slot_id);
    return {
      ...slot,
      start_time: '00:00',
      end_time: '23:59',
      duration_minutes: 1439,
    };
  }

  // S'assurer que nous avons start_time et end_time pour les événements horaires
  if (!slot.start_time || !slot.end_time) {
    console.warn('⚠️ Slot sans start_time ou end_time:', slot);
    return slot;
  }

  // Normaliser les formats de temps en strings "HH:MM"
  const normalizedStartTime = normalizeTimeToHHMM(slot.start_time);
  const normalizedEndTime = normalizeTimeToHHMM(slot.end_time);

  console.log('✅ Normalized times:', {
    slot_id: slot.slot_id,
    start: normalizedStartTime,
    end: normalizedEndTime,
  });

  // Calculer duration_minutes si manquant
  let durationMinutes = slot.duration_minutes;

  if (!durationMinutes || durationMinutes === 0) {
    const startMinutes = timeToMinutes(normalizedStartTime);
    const endMinutes = timeToMinutes(normalizedEndTime);
    durationMinutes = endMinutes - startMinutes;
  }

  return {
    ...slot,
    start_time: normalizedStartTime,
    end_time: normalizedEndTime,
    duration_minutes: durationMinutes,
  };
}

/**
 * Calendar Service
 * Single entry point for all calendar-related API calls
 */
export const calendarService = {
  /* -------------------------------------------------------
   * WEEK VIEW
   * ----------------------------------------------------- */

  /**
   * Get calendar data for a specific week
   * @param {Date} weekStartDate - Start date of the week
   * @returns {Promise<Object>} Week data with days and slots
   */
  getWeekData: async (weekStartDate) => {
    const start = format(weekStartDate, 'yyyy-MM-dd');
    const response = await calendarApi.get('/week', {
      params: { start },
    });

    // Enrichir les données avant de les retourner
    const enrichedData = {
      ...response.data,
      days: (response.data.days || []).map((day) => ({
        ...day,
        slots: (day.slots || []).map(enrichSlot),
      })),
    };

    return enrichedData;
  },

  /* -------------------------------------------------------
   * PLANNING SLOTS
   * ----------------------------------------------------- */

  /**
   * Get all planning slots
   * @returns {Promise<Array>} List of all slots
   */
  getAllSlots: async () => {
    const response = await calendarApi.get('/slots');
    return (response.data || []).map(enrichSlot);
  },

  /**
   * Get a single planning slot by ID
   * @param {number} id - Slot ID
   * @returns {Promise<Object>} Slot data
   */
  getSlot: async (id) => {
    const response = await calendarApi.get(`/slots/${id}`);
    return enrichSlot(response.data);
  },

  /**
   * Create a new planning slot
   * @param {Object} payload - Slot data
   * @returns {Promise<Object>} Created slot
   */
  createSlot: async (payload) => {
    const response = await calendarApi.post('/slots', payload);
    return enrichSlot(response.data);
  },

  /**
   * Update an existing planning slot
   * @param {number} id - Slot ID
   * @param {Object} payload - Updated slot data
   * @returns {Promise<Object>} Updated slot
   */
  updateSlot: async (id, payload) => {
    const response = await calendarApi.put(`/slots/${id}`, payload);
    return enrichSlot(response.data);
  },

  /**
   * Delete a planning slot (soft delete)
   * @param {number} id - Slot ID
   * @returns {Promise<Object>} Deletion confirmation
   */
  deleteSlot: async (id) => {
    const response = await calendarApi.delete(`/slots/${id}`);
    return response.data;
  },

  /* -------------------------------------------------------
   * EVENTS
   * ----------------------------------------------------- */

  /**
   * Get all events
   * @returns {Promise<Array>} List of all events
   */
  getAllEvents: async () => {
    const response = await calendarApi.get('/events');
    return response.data;
  },

  /**
   * Get a single event by ID
   * @param {number} id - Event ID
   * @returns {Promise<Object>} Event data with participants
   */
  getEvent: async (id) => {
    const response = await calendarApi.get(`/events/${id}`);
    return response.data;
  },

  /**
   * Create a new event
   * @param {Object} payload - Event data
   * @returns {Promise<Object>} Created event
   */
  createEvent: async (payload) => {
    const response = await calendarApi.post('/events', payload);
    return response.data;
  },

  /**
   * Update an existing event
   * @param {number} id - Event ID
   * @param {Object} payload - Updated event data
   * @returns {Promise<Object>} Updated event
   */
  updateEvent: async (id, payload) => {
    const response = await calendarApi.put(`/events/${id}`, payload);
    return response.data;
  },

  /**
   * Delete an event (soft delete)
   * @param {number} id - Event ID
   * @returns {Promise<Object>} Deletion confirmation
   */
  deleteEvent: async (id) => {
    const response = await calendarApi.delete(`/events/${id}`);
    return response.data;
  },

  /* -------------------------------------------------------
   * EVENT PARTICIPANTS
   * ----------------------------------------------------- */

  /**
   * Get all event participants
   * @returns {Promise<Array>} List of all participants
   */
  getAllParticipants: async () => {
    const response = await calendarApi.get('/participants');
    return response.data;
  },

  /**
   * Get a single participant by ID
   * @param {number} id - Participant ID
   * @returns {Promise<Object>} Participant data
   */
  getParticipant: async (id) => {
    const response = await calendarApi.get(`/participants/${id}`);
    return response.data;
  },

  /**
   * Add a participant to an event
   * @param {Object} payload - Participant data (must include event_id, rider_id, etc.)
   * @returns {Promise<Object>} Created participant
   */
  addParticipant: async (payload) => {
    const response = await calendarApi.post('/participants', payload);
    return response.data;
  },

  /**
   * Update a participant
   * @param {number} id - Participant ID
   * @param {Object} payload - Updated participant data
   * @returns {Promise<Object>} Updated participant
   */
  updateParticipant: async (id, payload) => {
    const response = await calendarApi.put(`/participants/${id}`, payload);
    return response.data;
  },

  /**
   * Remove/cancel a participant
   * @param {number} id - Participant ID
   * @returns {Promise<Object>} Cancellation confirmation
   */
  removeParticipant: async (id) => {
    const response = await calendarApi.delete(`/participants/${id}`);
    return response.data;
  },

  /* -------------------------------------------------------
   * RECURRENCES
   * ----------------------------------------------------- */

  /**
   * Get all recurrences
   * @returns {Promise<Array>} List of all recurrences
   */
  getAllRecurrences: async () => {
    const response = await calendarApi.get('/recurrences');
    return response.data;
  },

  /**
   * Get a single recurrence by ID
   * @param {number} id - Recurrence ID
   * @returns {Promise<Object>} Recurrence data
   */
  getRecurrence: async (id) => {
    const response = await calendarApi.get(`/recurrences/${id}`);
    return response.data;
  },

  /**
   * Create a new recurrence pattern
   * @param {Object} payload - Recurrence data
   * @returns {Promise<Object>} Created recurrence
   */
  createRecurrence: async (payload) => {
    const response = await calendarApi.post('/recurrences', payload);
    return response.data;
  },

  /**
   * Update an existing recurrence
   * @param {number} id - Recurrence ID
   * @param {Object} payload - Updated recurrence data
   * @returns {Promise<Object>} Updated recurrence
   */
  updateRecurrence: async (id, payload) => {
    const response = await calendarApi.put(`/recurrences/${id}`, payload);
    return response.data;
  },

  /**
   * Delete a recurrence
   * @param {number} id - Recurrence ID
   * @returns {Promise<Object>} Deletion confirmation
   */
  deleteRecurrence: async (id) => {
    const response = await calendarApi.delete(`/recurrences/${id}`);
    return response.data;
  },
};
