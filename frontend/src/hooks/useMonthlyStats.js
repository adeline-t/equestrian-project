import { useState, useEffect, useCallback } from 'react';
import statsService from '../services/statsService';
import { startOfMonth, format } from 'date-fns';

/**
 * Hook for managing monthly statistics
 * @param {Date} initialMonth - Initial month to display
 * @returns {Object} Stats state and methods
 */
export function useMonthlyStats(initialMonth = new Date()) {
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(initialMonth));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Horse stats
  const [horseStats, setHorseStats] = useState([]);

  // Rider stats (weekly event counts by type)
  const [riderStats, setRiderStats] = useState([]);

  // Rider weekly usage (services/private lessons consumption)
  const [riderWeeklyUsage, setRiderWeeklyUsage] = useState([]);

  // Rider monthly billing
  const [riderMonthlyBilling, setRiderMonthlyBilling] = useState([]);

  // Slot stats (all valid slots with events and participants)
  const [slotStats, setSlotStats] = useState(null);

  // Weeks metadata
  const [weeks, setWeeks] = useState([]);

  const loadStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const monthStr = format(currentMonth, 'yyyy-MM');

      // Get weeks for the month
      const weeksData = statsService.getWeeksOfMonth(currentMonth);
      setWeeks(weeksData);

      // Load all stats in parallel
      const [horses, riders, weeklyUsage, monthlyBilling, slots] = await Promise.all([
        statsService.getHorseStats(monthStr),
        statsService.getRiderStats(monthStr),
        statsService.getRiderWeeklyUsage(monthStr),
        statsService.getRiderMonthlyBilling(monthStr),
        statsService.getSlotStats(monthStr),
      ]);

      setHorseStats(horses || []);
      setRiderStats(riders || []);
      setRiderWeeklyUsage(weeklyUsage || []);
      setRiderMonthlyBilling(monthlyBilling || []);
      setSlotStats(slots || null);
    } catch (err) {
      console.error('Error loading monthly stats:', err);
      setError(err.message || 'Erreur lors du chargement des statistiques');
    } finally {
      setLoading(false);
    }
  }, [currentMonth]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const goToPreviousMonth = useCallback(() => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() - 1);
      return startOfMonth(newDate);
    });
  }, []);

  const goToNextMonth = useCallback(() => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + 1);
      return startOfMonth(newDate);
    });
  }, []);

  const goToCurrentMonth = useCallback(() => {
    setCurrentMonth(startOfMonth(new Date()));
  }, []);

  const goToMonth = useCallback((month) => {
    setCurrentMonth(startOfMonth(month));
  }, []);

  return {
    // State
    currentMonth,
    loading,
    error,
    weeks,

    // Horse statistics
    horseStats,

    // Rider statistics (event counts by type)
    riderStats,

    // Rider weekly usage (package consumption)
    riderWeeklyUsage,

    // Rider monthly billing
    riderMonthlyBilling,

    // Slot statistics (all valid slots with events and participants)
    slotStats,

    // Navigation methods
    goToPreviousMonth,
    goToNextMonth,
    goToCurrentMonth,
    goToMonth,

    // Reload
    reload: loadStats,
  };
}
