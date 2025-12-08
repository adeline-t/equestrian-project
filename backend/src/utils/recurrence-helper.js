/**
 * Utilitaires pour la gestion des récurrences des leçons
 */

/**
 * Calcule les occurrences d'une règle de récurrence sur une période donnée
 *
 * @param {Object} recurrenceRule - Règle de récurrence
 * @param {string} startDate - Date de début (YYYY-MM-DD)
 * @param {string} endDate - Date de fin (YYYY-MM-DD)
 * @returns {Array} - Liste des dates des occurrences
 */
export function calculateOccurrences(recurrenceRule, startDate, endDate) {
  const occurrences = [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  const ruleStartDate = recurrenceRule.startDate ? new Date(recurrenceRule.startDate) : start;
  const ruleEndDate = recurrenceRule.endDate ? new Date(recurrenceRule.endDate) : null;

  // Ajuster la date de début si nécessaire
  let currentDate = new Date(Math.max(start.getTime(), ruleStartDate.getTime()));

  // Mapper les jours de la semaine
  const dayMap = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
  };

  if (recurrenceRule.frequency === 'weekly') {
    const targetDays = (recurrenceRule.byDay || []).map((day) => dayMap[day.toLowerCase()]);
    const interval = recurrenceRule.interval || 1;

    // Commencer au début de la semaine
    const dayOfWeek = currentDate.getDay();
    currentDate.setDate(currentDate.getDate() - dayOfWeek);

    let weekCount = 0;
    while (currentDate <= end) {
      // Vérifier si cette semaine doit être incluse (selon l'intervalle)
      if (weekCount % interval === 0) {
        for (const targetDay of targetDays) {
          const occurrenceDate = new Date(currentDate);
          occurrenceDate.setDate(currentDate.getDate() + targetDay);

          if (occurrenceDate >= start && occurrenceDate <= end) {
            // Vérifier la date de fin de règle
            if (!ruleEndDate || occurrenceDate <= ruleEndDate) {
              occurrences.push({
                date: occurrenceDate.toISOString().split('T')[0],
                day: occurrenceDate.getDay(),
              });
            }
          }
        }
      }

      // Passer à la semaine suivante
      currentDate.setDate(currentDate.getDate() + 7);
      weekCount++;
    }
  } else if (recurrenceRule.frequency === 'daily') {
    const interval = recurrenceRule.interval || 1;

    while (currentDate <= end) {
      if (!ruleEndDate || currentDate <= ruleEndDate) {
        occurrences.push({
          date: currentDate.toISOString().split('T')[0],
          day: currentDate.getDay(),
        });
      }

      // Ajouter l'intervalle
      currentDate.setDate(currentDate.getDate() + interval);
    }
  } else if (recurrenceRule.frequency === 'monthly') {
    const interval = recurrenceRule.interval || 1;
    const dayOfMonth = recurrenceRule.byMonthDay || currentDate.getDate();

    while (currentDate <= end) {
      // Définir le jour du mois
      currentDate.setDate(dayOfMonth);

      // Vérifier si la date est valide (pas le 31 février par exemple)
      if (currentDate.getDate() === dayOfMonth) {
        if (currentDate >= start && currentDate <= end) {
          if (!ruleEndDate || currentDate <= ruleEndDate) {
            occurrences.push({
              date: currentDate.toISOString().split('T')[0],
              day: currentDate.getDay(),
            });
          }
        }
      }

      // Ajouter l'intervalle de mois
      currentDate.setMonth(currentDate.getMonth() + interval);
    }
  }

  // Trier les occurrences par date
  occurrences.sort((a, b) => new Date(a.date) - new Date(b.date));

  return occurrences;
}

/**
 * Calcule l'heure de fin à partir de l'heure de début et de la durée
 *
 * @param {string} startTime - Heure de début (HH:MM)
 * @param {number} durationMinutes - Durée en minutes
 * @returns {string} - Heure de fin (HH:MM)
 */
export function calculateEndTime(startTime, durationMinutes) {
  const [hours, minutes] = startTime.split(':').map(Number);
  const endTime = new Date(2000, 0, 1, hours, minutes + durationMinutes);

  return `${endTime.getHours().toString().padStart(2, '0')}:${endTime
    .getMinutes()
    .toString()
    .padStart(2, '0')}`;
}

/**
 * Vérifie si une date est dans le passé
 *
 * @param {string} date - Date à vérifier (YYYY-MM-DD)
 * @returns {boolean} - True si la date est dans le passé
 */
export function isDateInPast(date) {
  const today = new Date().toISOString().split('T')[0];
  return date < today;
}

/**
 * Vérifie si une heure est déjà passée aujourd'hui
 *
 * @param {string} time - Heure à vérifier (HH:MM)
 * @returns {boolean} - True si l'heure est déjà passée
 */
export function isTimeInPast(time) {
  const now = new Date();
  const [hours, minutes] = time.split(':').map(Number);
  const checkTime = new Date(2000, 0, 1, hours, minutes);
  const currentTime = new Date(2000, 0, 1, now.getHours(), now.getMinutes());

  return checkTime < currentTime;
}

/**
 * Génère une description textuelle de la règle de récurrence
 *
 * @param {Object} recurrenceRule - Règle de récurrence
 * @returns {string} - Description textuelle
 */
export function getRecurrenceDescription(recurrenceRule) {
  if (!recurrenceRule || !recurrenceRule.frequency) {
    return 'Aucune récurrence';
  }

  const frequency = recurrenceRule.frequency;
  const interval = recurrenceRule.interval || 1;

  let description = '';

  if (frequency === 'weekly') {
    if (interval === 1) {
      description = 'Chaque semaine';
    } else {
      description = `Toutes les ${interval} semaines`;
    }

    if (recurrenceRule.byDay && recurrenceRule.byDay.length > 0) {
      const dayNames = {
        monday: 'Lundi',
        tuesday: 'Mardi',
        wednesday: 'Mercredi',
        thursday: 'Jeudi',
        friday: 'Vendredi',
        saturday: 'Samedi',
        sunday: 'Dimanche',
      };

      const days = recurrenceRule.byDay.map((day) => dayNames[day.toLowerCase()]);
      description += ' : ' + days.join(', ');
    }
  } else if (frequency === 'daily') {
    if (interval === 1) {
      description = 'Chaque jour';
    } else {
      description = `Tous les ${interval} jours`;
    }
  } else if (frequency === 'monthly') {
    if (interval === 1) {
      description = 'Chaque mois';
    } else {
      description = `Tous les ${interval} mois`;
    }

    if (recurrenceRule.byMonthDay) {
      description += ` le ${recurrenceRule.byMonthDay}${getOrdinalSuffix(
        recurrenceRule.byMonthDay
      )}`;
    }
  }

  if (recurrenceRule.endDate) {
    description += ` (jusqu'au ${new Date(recurrenceRule.endDate).toLocaleDateString('fr-FR')})`;
  }

  return description;
}

/**
 * Ajoute le suffixe ordinal à un nombre (français)
 *
 * @param {number} n - Nombre
 * @returns {string} - Nombre avec suffixe ordinal
 */
function getOrdinalSuffix(n) {
  if (n === 1) return 'er';
  return 'ème';
}

/**
 * Valide une règle de récurrence
 *
 * @param {Object} recurrenceRule - Règle à valider
 * @returns {Object} - {isValid: boolean, errors: Array}
 */
export function validateRecurrenceRule(recurrenceRule) {
  const errors = [];

  if (!recurrenceRule.frequency) {
    errors.push('La fréquence est requise');
  }

  if (
    recurrenceRule.frequency &&
    !['daily', 'weekly', 'monthly'].includes(recurrenceRule.frequency)
  ) {
    errors.push('La fréquence doit être daily, weekly ou monthly');
  }

  if (
    recurrenceRule.frequency === 'weekly' &&
    (!recurrenceRule.byDay || recurrenceRule.byDay.length === 0)
  ) {
    errors.push('Les jours de la semaine sont requis pour une récurrence hebdomadaire');
  }

  if (recurrenceRule.frequency === 'monthly' && !recurrenceRule.byMonthDay) {
    errors.push('Le jour du mois est requis pour une récurrence mensuelle');
  }

  if (recurrenceRule.interval && (recurrenceRule.interval < 1 || recurrenceRule.interval > 99)) {
    errors.push("L'intervalle doit être entre 1 et 99");
  }

  if (recurrenceRule.startDate && isNaN(new Date(recurrenceRule.startDate).getTime())) {
    errors.push('La date de début est invalide');
  }

  if (recurrenceRule.endDate && isNaN(new Date(recurrenceRule.endDate).getTime())) {
    errors.push('La date de fin est invalide');
  }

  if (recurrenceRule.startDate && recurrenceRule.endDate) {
    if (new Date(recurrenceRule.startDate) > new Date(recurrenceRule.endDate)) {
      errors.push('La date de début doit être avant la date de fin');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
