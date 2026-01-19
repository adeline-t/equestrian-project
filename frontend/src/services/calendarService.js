import { format } from 'date-fns';
import { calendarApi } from './api';

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
    return response.data;
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
    return response.data;
  },

  /**
   * Get a single planning slot by ID
   * @param {number} id - Slot ID
   * @returns {Promise<Object>} Slot data
   */
  getSlot: async (id) => {
    const response = await calendarApi.get(`/slots/${id}`);
    return response.data;
  },

  /**
   * Create a new planning slot
   * @param {Object} payload - Slot data
   * @returns {Promise<Object>} Created slot
   */
  createSlot: async (payload) => {
    const response = await calendarApi.post('/slots', payload);
    return response.data;
  },

  /**
   * Update an existing planning slot
   * @param {number} id - Slot ID
   * @param {Object} payload - Updated slot data
   * @returns {Promise<Object>} Updated slot
   */
  updateSlot: async (id, payload) => {
    const response = await calendarApi.put(`/slots/${id}`, payload);
    return response.data;
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
