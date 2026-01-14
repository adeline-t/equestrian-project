/**
 * Date formatting utilities
 */

import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

/**
 * Format week title
 * @param {Object} weekData - Week data with period
 * @returns {string} Formatted week title
 */
export function formatWeekTitle(weekData) {
  if (!weekData || !weekData.period) return 'Chargement...';

  const start = new Date(weekData.period.start);
  const end = new Date(weekData.period.end);

  // Validate dates before formatting
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return 'Semaine en cours';
  }

  return `Semaine du ${format(start, 'dd MMMM', { locale: fr })} au ${format(end, 'dd MMMM yyyy', {
    locale: fr,
  })}`;
}

/**
 * Format date for display
 * @param {Date|string} date - Date to format
 * @param {string} formatStr - Format string (default: 'dd/MM/yyyy')
 * @returns {string} Formatted date
 */
export function formatDate(date, formatStr = 'dd/MM/yyyy') {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, formatStr, { locale: fr });
}

/**
 * Format date and time
 * @param {Date|string} date - Date to format
 * @param {string} formatStr - Format string (default: 'dd/MM/yyyy HH:mm')
 * @returns {string} Formatted date and time
 */
export function formatDateTime(date, formatStr = 'dd/MM/yyyy HH:mm') {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, formatStr, { locale: fr });
}
