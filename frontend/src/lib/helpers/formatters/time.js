/**
 * Time formatting and calculation utilities
 */

import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

/* ============================================
   CORE TIME CONVERSION
   ============================================ */

/**
 * Convert "HH:MM" string to minutes since midnight
 * @param {string} timeStr - Time in HH:MM format
 * @returns {number} Minutes since midnight
 */
export function timeToMinutes(timeStr) {
  if (typeof timeStr !== 'string') {
    console.warn('timeToMinutes received non-string:', timeStr);
    return 0;
  }

  const [hours, minutes] = timeStr.split(':').map(Number);

  if (isNaN(hours) || isNaN(minutes)) {
    console.warn('timeToMinutes could not parse:', timeStr);
    return 0;
  }

  return hours * 60 + minutes;
}

/**
 * Convert minutes since midnight to "HH:MM" format
 * @param {number} minutes - Minutes since midnight
 * @returns {string} Time in HH:MM format
 */
export function minutesToTime(minutes) {
  if (typeof minutes !== 'number' || isNaN(minutes)) {
    console.warn('minutesToTime received invalid input:', minutes);
    return '00:00';
  }

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

/* ============================================
   TIME FORMATTING
   ============================================ */

/**
 * Format time string for display
 * @param {string} timeStr - Time in HH:MM format
 * @returns {string} Formatted time
 */
export function formatTime(timeStr) {
  if (!timeStr) return '';
  const [hours, minutes] = timeStr.split(':');
  return `${hours}:${minutes}`;
}

/**
 * Format time from either ISO datetime string or HH:MM string
 * @param {string} value - ISO datetime or HH:MM time string
 * @returns {string} Formatted time in HH:MM format
 */
export function formatTimeFlexible(value) {
  if (!value) return '';
  try {
    // If it's a full datetime, extract time
    if (value.includes('T')) {
      const date = new Date(value);
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${hours}:${minutes}`;
    }
    // If it's already just time (HH:MM:SS or HH:MM)
    return value.slice(0, 5);
  } catch {
    return value;
  }
}

/**
 * Format time string to HH:MM for time input
 * Handles HH:MM:SS from database
 * @param {string} timeStr - Time in HH:MM:SS or HH:MM format
 * @returns {string} Time in HH:MM format
 */
export function formatTimeForInput(timeStr) {
  if (!timeStr) return '';
  return String(timeStr).slice(0, 5);
}

/**
 * Format time from input to HH:MM:SS for database
 * @param {string} timeStr - Time in HH:MM format from input
 * @returns {string} Time in HH:MM:SS format
 */
export function formatTimeForDatabase(timeStr) {
  if (!timeStr) return '';
  // If already has seconds, return as is
  if (timeStr.length === 8) return timeStr;
  // Otherwise append :00
  return `${timeStr}:00`;
}

/* ============================================
   CALENDAR POSITIONING
   ============================================ */

/**
 * Calculate selection style positioning for calendar
 * @param {string} selectionStart - Start time in HH:MM format
 * @param {string} selectionEnd - End time in HH:MM format
 * @param {number} HOUR_HEIGHT - Height of one hour in pixels (default: 60)
 * @param {number} START_HOUR - Calendar start hour (default: 8)
 * @param {number} END_HOUR - Calendar end hour (default: 22)
 * @returns {Object|null} Style object with top and height, or null if invalid
 */
export function calculateSelectionStyle(
  selectionStart,
  selectionEnd,
  HOUR_HEIGHT = 60,
  START_HOUR = 8,
  END_HOUR = 22
) {
  if (!selectionStart || !selectionEnd) return null;

  const startMinutes = timeToMinutes(selectionStart);
  const endMinutes = timeToMinutes(selectionEnd);
  const dayStartMinutes = START_HOUR * 60;
  const dayEndMinutes = END_HOUR * 60;

  // Ensure start is before end
  const minMinutes = Math.min(startMinutes, endMinutes);
  const maxMinutes = Math.max(startMinutes, endMinutes);

  if (maxMinutes <= dayStartMinutes || minMinutes >= dayEndMinutes) {
    return null;
  }

  const clampedStart = Math.max(minMinutes, dayStartMinutes);
  const clampedEnd = Math.min(maxMinutes, dayEndMinutes);

  const top = (clampedStart - dayStartMinutes) * (HOUR_HEIGHT / 60);
  const height = (clampedEnd - clampedStart) * (HOUR_HEIGHT / 60);

  return {
    top: `${top}px`,
    height: `${height}px`,
  };
}
