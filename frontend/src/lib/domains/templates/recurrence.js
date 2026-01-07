/**
 * Week days for recurrence selection
 */
export const WEEK_DAYS = [
  { value: 'monday', label: 'Lun' },
  { value: 'tuesday', label: 'Mar' },
  { value: 'wednesday', label: 'Mer' },
  { value: 'thursday', label: 'Jeu' },
  { value: 'friday', label: 'Ven' },
  { value: 'saturday', label: 'Sam' },
  { value: 'sunday', label: 'Dim' },
];

/**
 * Recurrence frequency options
 */
export const RECURRENCE_FREQUENCIES = [
  { value: 'daily', label: 'Quotidien' },
  { value: 'weekly', label: 'Hebdomadaire' },
  { value: 'monthly', label: 'Mensuel' },
];

/**
 * Get recurrence interval description
 * @param {string} frequency - Recurrence frequency
 * @param {number} interval - Interval value
 * @returns {string} Description text
 */
export function getRecurrenceIntervalText(frequency, interval) {
  switch (frequency) {
    case 'weekly':
      return `Toutes les ${interval} semaine(s)`;
    case 'daily':
      return `Tous les ${interval} jour(s)`;
    case 'monthly':
      return `Tous les ${interval} mois`;
    default:
      return '';
  }
}

/**
 * Check if recurrence is valid
 * @param {string} frequency - Recurrence frequency
 * @param {number} interval - Interval value
 * @returns {boolean} True if valid
 */
export function isValidRecurrence(frequency, interval) {
  return RECURRENCE_FREQUENCIES.some(f => f.value === frequency) && 
         interval > 0;
}

/**
 * Get default interval for frequency
 * @param {string} frequency - Recurrence frequency
 * @returns {number} Default interval
 */
export function getDefaultInterval(frequency) {
  switch (frequency) {
    case 'weekly':
      return 1;
    case 'daily':
      return 1;
    case 'monthly':
      return 1;
    default:
      return 1;
  }
}