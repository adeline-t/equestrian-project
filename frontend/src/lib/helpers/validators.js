/**
 * Consolidated Form Validation Module
 *
 * Combines config/forms and helpers/validators into one file:
 * - validation messages and rules
 * - generic helpers: getValidationMessage, formatLengthMessage, validateRule
 * - domain validators: horse and rider
 */

import { EVENT_TYPES, RIDER_TYPE_LABELS, RIDER_TYPES } from '../domain/index.js';
import { calculateDurationMinutes } from './formatters/duration.js';

/**
 * Horse validation utilities
 */

/**
 * Validate horse form data
 * @param {Object} formData - Horse form data
 * @returns {Object} Validation result with isValid and errors object
 */
export const validateHorseForm = (formData) => {
  const errors = {};

  // Name validation
  if (!formData.name || formData.name.trim() === '') {
    errors.name = 'Le nom du cheval est requis';
  }

  // Kind validation
  if (!formData.kind) {
    errors.kind = 'Le type de cheval est requis';
  }

  // Owner validation (if provided, must be valid integer)
  if (formData.owner_id && isNaN(parseInt(formData.owner_id, 10))) {
    errors.owner_id = 'Le propriétaire sélectionné est invalide';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate rider form data
 * @param {Object} formData - Rider form data
 * @returns {Object} Validation result with isValid and errors object
 */
export const validateRiderForm = (formData) => {
  const errors = {};

  // Name validation
  if (!formData.name || formData.name.trim() === '') {
    errors.name = 'Le nom du cavalier est requis';
  }

  // Type validation
  if (!formData.rider_type) {
    errors.rider_type = 'Le type de cavalier est requis';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Filter and normalize slots for the calendar
export function getValidSlots(slots, startHour, endHour) {
  if (!Array.isArray(slots)) return [];
  return slots.filter((slot) => {
    if (slot.start_time == null || slot.end_time == null) return false;

    // Ensure start and end are numbers (minutes since 0:00)
    const startMinutes =
      typeof slot.start_time === 'number' ? slot.start_time : parseTime(slot.start_time);
    const endMinutes = typeof slot.end_time === 'number' ? slot.end_time : parseTime(slot.end_time);
    if (startMinutes >= endMinutes) return false;

    // Ensure slot is within calendar hours
    if (startMinutes / 60 >= endHour || endMinutes / 60 <= startHour) return false;

    return true;
  });
}

// Helper to parse "HH:mm" strings to minutes
function parseTime(timeStr) {
  if (!timeStr) return 0;
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

// lib/validators/eventEdit.js

/**
 * Validation pour l'édition d'un événement
 * Retourne un tableau de messages d'erreur
 */
export function validateEventEdit(editData) {
  const errors = [];

  return errors;
}

export const validateEventForm = (formData, participants) => {
  const errors = {};

  // Required fields validation
  if (!formData.event_date) errors.event_date = 'La date est requise';
  if (!formData.start_time && !formData.is_all_day)
    errors.start_time = "L'heure de début est requise";
  if (!formData.end_time && !formData.is_all_day) errors.end_time = "L'heure de fin est requise";
  if (!formData.event_type) errors.event_type = "Le type d'événement est requis";
  if (!formData.slot_status) errors.slot_status = 'Le statut est requis';

  // Time validation (only if not all-day)
  if (!formData.is_all_day && formData.start_time && formData.end_time) {
    const duration = calculateDurationMinutes(formData.start_time, formData.end_time);
    if (duration <= 0) {
      errors.end_time = "L'heure de fin doit être après l'heure de début";
    }
  }

  // Participants validation (only if not blocked)
  if (formData.event_type !== EVENT_TYPES.BLOCKED) {
    const min = parseInt(formData.min_participants || 0);
    const max = parseInt(formData.max_participants || 0);
    if (min > max) errors.min_participants = 'Le minimum ne peut pas dépasser le maximum';
    if (participants && participants.length > max)
      errors.participants = `Il y a ${participants.length} participants mais le maximum est de ${max}`;
  }

  return { isValid: Object.keys(errors).length === 0, errors };
};
