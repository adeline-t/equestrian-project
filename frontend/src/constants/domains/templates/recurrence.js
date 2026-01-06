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