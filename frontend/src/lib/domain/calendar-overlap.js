/**
 * calendar-overlap.js
 * Gestion des événements qui se chevauchent
 */

/**
 * Convertit une heure "HH:mm" en minutes
 */
function getMinutes(timeStr) {
  if (!timeStr) return 0;
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

/**
 * Détecte et organise les événements qui se chevauchent en colonnes
 * @param {Array} slots - Liste des slots à analyser
 * @returns {Array} - Slots avec informations de colonne (column, totalColumns)
 */
export function calculateOverlapColumns(slots) {
  if (!slots || slots.length === 0) return [];

  // Enrichir les slots avec startMinutes et endMinutes
  const events = slots.map((slot) => ({
    ...slot,
    startMinutes: getMinutes(slot.start_time),
    endMinutes: getMinutes(slot.end_time),
    column: 0,
    totalColumns: 1,
  }));

  // Trier par heure de début, puis par heure de fin (décroissante)
  events.sort((a, b) => {
    if (a.startMinutes !== b.startMinutes) {
      return a.startMinutes - b.startMinutes;
    }
    return b.endMinutes - a.endMinutes; // Plus long en premier
  });

  // Grouper les événements qui se chevauchent
  const groups = [];
  let currentGroup = [];
  let currentGroupEnd = 0;

  events.forEach((event) => {
    if (currentGroup.length === 0 || event.startMinutes < currentGroupEnd) {
      // Fait partie du groupe actuel
      currentGroup.push(event);
      currentGroupEnd = Math.max(currentGroupEnd, event.endMinutes);
    } else {
      // Nouveau groupe
      if (currentGroup.length > 0) {
        groups.push([...currentGroup]);
      }
      currentGroup = [event];
      currentGroupEnd = event.endMinutes;
    }
  });

  // Ajouter le dernier groupe
  if (currentGroup.length > 0) {
    groups.push(currentGroup);
  }

  // Pour chaque groupe, assigner les colonnes
  groups.forEach((group) => {
    if (group.length === 1) {
      // Pas de chevauchement
      group[0].column = 0;
      group[0].totalColumns = 1;
      return;
    }

    // Algorithme de placement en colonnes
    const columns = [];

    group.forEach((event) => {
      // Trouver la première colonne disponible
      let assignedColumn = -1;

      for (let col = 0; col < columns.length; col++) {
        const lastEventInColumn = columns[col][columns[col].length - 1];

        // Vérifier si cette colonne est libre
        if (event.startMinutes >= lastEventInColumn.endMinutes) {
          assignedColumn = col;
          break;
        }
      }

      // Si aucune colonne disponible, créer une nouvelle colonne
      if (assignedColumn === -1) {
        assignedColumn = columns.length;
        columns.push([]);
      }

      // Assigner l'événement à cette colonne
      columns[assignedColumn].push(event);
      event.column = assignedColumn;
    });

    // Définir le nombre total de colonnes pour tous les événements du groupe
    const totalColumns = columns.length;
    group.forEach((event) => {
      event.totalColumns = totalColumns;
    });
  });

  return events;
}

/**
 * Calcule la position CSS pour un slot avec gestion des colonnes
 * @param {Object} slot - Slot avec column et totalColumns
 * @param {Number} HOUR_HEIGHT - Hauteur d'une heure en pixels
 * @param {Number} START_HOUR - Heure de début du calendrier
 * @returns {Object|null} - Style CSS ou null si invalide
 */
export function calculateSlotPositionWithColumns(slot, HOUR_HEIGHT, START_HOUR) {
  if (!slot.start_time || !slot.end_time) return null;

  const startHour = slot.startMinutes / 60;
  const endHour = slot.endMinutes / 60;

  if (startHour < START_HOUR) return null;

  const top = (startHour - START_HOUR) * HOUR_HEIGHT;
  const height = (endHour - startHour) * HOUR_HEIGHT;

  // Calcul de la position horizontale
  const { column = 0, totalColumns = 1 } = slot;
  
  // Espacement entre colonnes : 2px
  const gap = 2;
  const totalGap = gap * (totalColumns - 1);
  const availableWidth = 100; // Pourcentage
  const columnWidth = (availableWidth - totalGap) / totalColumns;
  
  const left = column * (columnWidth + gap);
  const width = columnWidth;

  return {
    top: `${top}px`,
    height: `${Math.max(height, 30)}px`, // Hauteur minimum de 30px
    left: `${left}%`,
    width: `${width}%`,
    position: 'absolute',
  };
}

/**
 * Détecte si un slot fait partie d'un groupe avec chevauchement
 * @param {Object} slot - Slot à vérifier
 * @returns {Boolean}
 */
export function hasOverlap(slot) {
  return slot.totalColumns > 1;
}

/**
 * Retourne le nombre d'événements dans le même créneau
 * @param {Object} slot - Slot à vérifier
 * @returns {Number}
 */
export function getOverlapCount(slot) {
  return slot.totalColumns || 1;
}
