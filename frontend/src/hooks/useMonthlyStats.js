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
  const [horseStats, setHorseStats] = useState([]);
  const [riderStats, setRiderStats] = useState([]);
  const [weeks, setWeeks] = useState([]);

  const loadStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const monthStr = format(currentMonth, 'yyyy-MM');

      // Get weeks for the month
      const weeksData = statsService.getWeeksOfMonth(currentMonth);
      setWeeks(weeksData);
      console.log('weeksdata', weeksData);

      // Load horse and rider stats in parallel
      const [horses, riders] = await Promise.all([
        statsService.getHorseStats(monthStr),
        statsService.getRiderStats(monthStr),
      ]);

      setHorseStats(horses || []);
      setRiderStats(riders || []);
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
    currentMonth,
    loading,
    error,
    horseStats,
    riderStats,
    weeks,
    goToPreviousMonth,
    goToNextMonth,
    goToCurrentMonth,
    goToMonth,
    reload: loadStats,
  };
}
