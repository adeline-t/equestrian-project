/**
 * Check if an item is currently active based on start and end dates
 * @param {string} startDate - Activity start date
 * @param {string} endDate - Activity end date
 * @returns {boolean} True if the item is active
 */
export function isActive(startDate, endDate) {
  const now = new Date();
  const start = startDate ? new Date(startDate) : null;
  const end = endDate ? new Date(endDate) : null;

  if (start && start > now) return false;
  if (end && end < now) return false;
  return true;
}

/**
 * Filter packages to return only active ones
 * @param {Array} packages - Array of package objects
 * @returns {Array} Filtered array of active packages
 */
export function filterActivePackages(packages) {
  return packages.filter((pkg) =>
    isActive(pkg.activity_start_date, pkg.activity_end_date)
  );
}

/**
 * Filter pairings to return only active ones (both pairing and horse must be active)
 * @param {Array} pairings - Array of pairing objects
 * @returns {Array} Filtered array of active pairings
 */
export function filterActivePairings(pairings) {
  return pairings.filter((pairing) => {
    const pairingActive = isActive(pairing.pairing_start_date, pairing.pairing_end_date);
    const horseActive =
      pairing.horses &&
      isActive(pairing.horses.activity_start_date, pairing.horses.activity_end_date);
    return pairingActive && horseActive;
  });
}

/**
 * Filter horses to return only active ones
 * @param {Array} horses - Array of horse objects
 * @returns {Array} Filtered array of active horses
 */
export function filterActiveHorses(horses) {
  return horses.filter((horse) =>
    isActive(horse.activity_start_date, horse.activity_end_date)
  );
}